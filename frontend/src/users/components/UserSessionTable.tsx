import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Typography,
  Box,
  Tooltip,
  Alert,
} from '@mui/material';
import {
  Delete,
  Computer,
  Phone,
  Tablet,
  DeviceUnknown,
  LocationOn,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Button } from '@/components/core';
import { UserSession } from '../types';
import { formatDateTime, formatRelativeTime } from '@/utils/formatters';

interface UserSessionTableProps {
  sessions: UserSession[];
  onRevokeSession: (sessionId: string) => void;
  onRevokeAllSessions: () => void;
  isLoading?: boolean;
}

const getDeviceIcon = (deviceInfo: Record<string, any>) => {
  const device = deviceInfo.device?.toLowerCase() || '';
  
  if (device.includes('mobile')) {
    return <Phone fontSize="small" />;
  } else if (device.includes('tablet')) {
    return <Tablet fontSize="small" />;
  } else if (device.includes('desktop')) {
    return <Computer fontSize="small" />;
  }
  
  return <DeviceUnknown fontSize="small" />;
};

const getBrowserInfo = (userAgent: string) => {
  const ua = userAgent.toLowerCase();
  
  if (ua.includes('chrome')) return 'Chrome';
  if (ua.includes('firefox')) return 'Firefox';
  if (ua.includes('safari') && !ua.includes('chrome')) return 'Safari';
  if (ua.includes('edge')) return 'Edge';
  
  return 'Unknown Browser';
};

export const UserSessionTable: React.FC<UserSessionTableProps> = ({
  sessions,
  onRevokeSession,
  onRevokeAllSessions,
  isLoading = false,
}) => {
  const activeSessions = sessions.filter(session => session.is_active);
  const currentSession = sessions.find(session => session.is_current);

  if (sessions.length === 0) {
    return (
      <Alert severity="info">
        No active sessions found.
      </Alert>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h6">
          Active Sessions ({activeSessions.length})
        </Typography>
        {activeSessions.length > 1 && (
          <Button
            variant="outlined"
            color="error"
            onClick={onRevokeAllSessions}
            loading={isLoading}
            loadingText="Revoking..."
          >
            Revoke All Other Sessions
          </Button>
        )}
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Device & Browser</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Last Activity</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sessions.map((session) => (
              <TableRow
                key={session.id}
                sx={{
                  backgroundColor: session.is_current ? 'action.hover' : 'inherit',
                }}
              >
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    {getDeviceIcon(session.device_info)}
                    <Box>
                      <Typography variant="body2" fontWeight={500}>
                        {getBrowserInfo(session.user_agent)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {session.device_info.os || 'Unknown OS'}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <LocationOn fontSize="small" color="action" />
                    <Box>
                      <Typography variant="body2">
                        {session.location || 'Unknown'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {session.ip_address}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                
                <TableCell>
                  <Typography variant="body2">
                    {formatRelativeTime(session.last_activity)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatDateTime(session.last_activity)}
                  </Typography>
                </TableCell>
                
                <TableCell>
                  <Box display="flex" flexDirection="column" gap={0.5}>
                    {session.is_current && (
                      <Chip
                        label="Current Session"
                        color="primary"
                        size="small"
                        variant="outlined"
                      />
                    )}
                    <Chip
                      label={session.is_active ? 'Active' : 'Inactive'}
                      color={session.is_active ? 'success' : 'default'}
                      size="small"
                    />
                    {session.is_expired && (
                      <Chip
                        label="Expired"
                        color="error"
                        size="small"
                      />
                    )}
                  </Box>
                </TableCell>
                
                <TableCell align="right">
                  {!session.is_current && session.is_active && (
                    <Tooltip title="Revoke this session">
                      <IconButton
                        color="error"
                        onClick={() => onRevokeSession(session.id)}
                        disabled={isLoading}
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {currentSession && (
        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography variant="body2">
            <strong>Current session:</strong> This is the session you're currently using. 
            You cannot revoke your current session from here.
          </Typography>
        </Alert>
      )}
    </motion.div>
  );
};