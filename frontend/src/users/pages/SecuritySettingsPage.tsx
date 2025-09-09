import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Alert,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import { Security, VpnKey, Devices, Shield } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { PageHeader, Button, LoadingSpinner } from '@/components/core';
import { ChangePasswordForm } from '../components/ChangePasswordForm';
import { MFAWizard } from '../components/MFAWizard';
import { UserSessionTable } from '../components/UserSessionTable';
import {
  useChangePassword,
  useMFADevices,
  useSetupMFA,
  useVerifyMFASetup,
  useDisableMFA,
  useRegenerateBackupCodes,
  useUserSessions,
  useRevokeSession,
  useRevokeAllSessions,
} from '../api/hooks';
import { useAuthStore } from '@/store/authStore';
import { ChangePasswordData, MFASetupData, MFAVerificationData } from '../types';

const SecuritySettingsPage: React.FC = () => {
  const { user, updateUser } = useAuthStore();
  const [showPasswordForm, setShowPasswordForm] = React.useState(false);
  const [showMFAWizard, setShowMFAWizard] = React.useState(false);
  const [showBackupCodes, setShowBackupCodes] = React.useState(false);
  const [backupCodes, setBackupCodes] = React.useState<string[]>([]);
  const [disableMFAPassword, setDisableMFAPassword] = React.useState('');

  // API hooks
  const changePasswordMutation = useChangePassword();
  const { data: mfaDevices, isLoading: mfaLoading } = useMFADevices();
  const setupMFAMutation = useSetupMFA();
  const verifyMFAMutation = useVerifyMFASetup();
  const disableMFAMutation = useDisableMFA();
  const regenerateBackupCodesMutation = useRegenerateBackupCodes();
  const { data: sessions, isLoading: sessionsLoading } = useUserSessions();
  const revokeSessionMutation = useRevokeSession();
  const revokeAllSessionsMutation = useRevokeAllSessions();

  const handleChangePassword = (data: ChangePasswordData) => {
    changePasswordMutation.mutate(data, {
      onSuccess: (response) => {
        setShowPasswordForm(false);
        // Update token if provided
        if (response.token) {
          localStorage.setItem('auth_token', response.token);
        }
      },
    });
  };

  const handleSetupMFA = async (data: MFASetupData) => {
    return setupMFAMutation.mutateAsync(data);
  };

  const handleVerifyMFA = async (data: MFAVerificationData) => {
    return verifyMFAMutation.mutateAsync(data);
  };

  const handleMFAComplete = (codes: string[]) => {
    setBackupCodes(codes);
    setShowMFAWizard(false);
    setShowBackupCodes(true);
    // Update user MFA status
    if (user) {
      updateUser({ is_mfa_enabled: true });
    }
  };

  const handleDisableMFA = () => {
    if (!disableMFAPassword) return;
    
    disableMFAMutation.mutate(disableMFAPassword, {
      onSuccess: () => {
        setDisableMFAPassword('');
        if (user) {
          updateUser({ is_mfa_enabled: false });
        }
      },
    });
  };

  const handleRegenerateBackupCodes = () => {
    if (!disableMFAPassword) return;
    
    regenerateBackupCodesMutation.mutate(disableMFAPassword, {
      onSuccess: (response) => {
        setBackupCodes(response.backup_codes);
        setShowBackupCodes(true);
        setDisableMFAPassword('');
      },
    });
  };

  const handleRevokeSession = (sessionId: string) => {
    revokeSessionMutation.mutate(sessionId);
  };

  const handleRevokeAllSessions = () => {
    revokeAllSessionsMutation.mutate();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <PageHeader
        title="Security Settings"
        subtitle="Manage your account security and authentication methods"
      />

      <Grid container spacing={3}>
        {/* Password Section */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <VpnKey color="primary" />
                <Typography variant="h6">Password</Typography>
              </Box>
              
              <Typography variant="body2" color="text.secondary" paragraph>
                Keep your account secure with a strong password.
              </Typography>

              <Button
                variant="outlined"
                onClick={() => setShowPasswordForm(true)}
              >
                Change Password
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* MFA Section */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Shield color="primary" />
                <Typography variant="h6">Multi-Factor Authentication</Typography>
                {user?.is_mfa_enabled && (
                  <Chip label="Enabled" color="success" size="small" />
                )}
              </Box>

              <Typography variant="body2" color="text.secondary" paragraph>
                Add an extra layer of security to your account.
              </Typography>

              {mfaLoading ? (
                <LoadingSpinner size={24} message="Loading MFA status..." />
              ) : user?.is_mfa_enabled ? (
                <Box display="flex" gap={1} flexWrap="wrap">
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setShowMFAWizard(true)}
                  >
                    Add Device
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    color="warning"
                    onClick={() => setDisableMFAPassword('')}
                  >
                    Regenerate Backup Codes
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    color="error"
                    onClick={() => setDisableMFAPassword('')}
                  >
                    Disable MFA
                  </Button>
                </Box>
              ) : (
                <Button
                  variant="contained"
                  onClick={() => setShowMFAWizard(true)}
                >
                  Enable MFA
                </Button>
              )}

              {mfaDevices && mfaDevices.length > 0 && (
                <Box mt={2}>
                  <Typography variant="subtitle2" gutterBottom>
                    Active Devices:
                  </Typography>
                  {mfaDevices.map((device) => (
                    <Chip
                      key={device.id}
                      label={`${device.name} (${device.device_type_display})`}
                      size="small"
                      sx={{ mr: 1, mb: 1 }}
                    />
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Active Sessions Section */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Devices color="primary" />
                <Typography variant="h6">Active Sessions</Typography>
              </Box>

              <Typography variant="body2" color="text.secondary" paragraph>
                Manage devices and browsers that are currently signed in to your account.
              </Typography>

              {sessionsLoading ? (
                <LoadingSpinner message="Loading sessions..." />
              ) : sessions ? (
                <UserSessionTable
                  sessions={sessions}
                  onRevokeSession={handleRevokeSession}
                  onRevokeAllSessions={handleRevokeAllSessions}
                  isLoading={revokeSessionMutation.isPending || revokeAllSessionsMutation.isPending}
                />
              ) : (
                <Alert severity="info">No session data available.</Alert>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Change Password Dialog */}
      <Dialog
        open={showPasswordForm}
        onClose={() => setShowPasswordForm(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <ChangePasswordForm
            onSubmit={handleChangePassword}
            isLoading={changePasswordMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* MFA Setup Dialog */}
      <Dialog
        open={showMFAWizard}
        onClose={() => setShowMFAWizard(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Setup Multi-Factor Authentication</DialogTitle>
        <DialogContent>
          <MFAWizard
            onSetup={handleSetupMFA}
            onVerify={handleVerifyMFA}
            onComplete={handleMFAComplete}
            isLoading={setupMFAMutation.isPending || verifyMFAMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Backup Codes Dialog */}
      <Dialog
        open={showBackupCodes}
        onClose={() => setShowBackupCodes(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Your Backup Codes</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Save these backup codes in a safe place. You can use them to access your account if you lose your MFA device.
          </Alert>
          
          <List>
            {backupCodes.map((code, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={code}
                  sx={{
                    '& .MuiListItemText-primary': {
                      fontFamily: 'monospace',
                      fontSize: '1.1rem',
                    },
                  }}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowBackupCodes(false)}>
            I've Saved These Codes
          </Button>
        </DialogActions>
      </Dialog>
    </motion.div>
  );
};

export default SecuritySettingsPage;