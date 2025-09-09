import React from 'react';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Typography,
  TextField,
  Alert,
  Paper,
  Grid,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import { QrCode, Sms } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/core';
import { MFASetupData, MFAVerificationData } from '../types';

interface MFAWizardProps {
  onSetup: (data: MFASetupData) => Promise<any>;
  onVerify: (data: MFAVerificationData) => Promise<any>;
  onComplete: (backupCodes: string[]) => void;
  isLoading?: boolean;
}

const steps = ['Choose Method', 'Setup Device', 'Verify & Complete'];

export const MFAWizard: React.FC<MFAWizardProps> = ({
  onSetup,
  onVerify,
  onComplete,
  isLoading = false,
}) => {
  const [activeStep, setActiveStep] = React.useState(0);
  const [setupResponse, setSetupResponse] = React.useState<any>(null);
  const [deviceType, setDeviceType] = React.useState<'totp' | 'sms'>('totp');

  const setupForm = useForm<MFASetupData>({
    defaultValues: {
      device_type: 'totp',
      device_name: 'Authenticator App',
      phone_number: '',
    },
  });

  const verifyForm = useForm<MFAVerificationData>({
    defaultValues: {
      otp_code: '',
    },
  });

  const handleSetup = async (data: MFASetupData) => {
    try {
      const response = await onSetup(data);
      setSetupResponse(response);
      setActiveStep(2);
    } catch (error) {
      console.error('MFA setup failed:', error);
    }
  };

  const handleVerify = async (data: MFAVerificationData) => {
    try {
      const response = await onVerify(data);
      if (response.backup_codes) {
        onComplete(response.backup_codes);
      }
    } catch (error) {
      console.error('MFA verification failed:', error);
    }
  };

  const handleNext = () => {
    if (activeStep === 0) {
      setActiveStep(1);
      setupForm.setValue('device_type', deviceType);
      setupForm.setValue('device_name', deviceType === 'totp' ? 'Authenticator App' : 'SMS Device');
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Typography variant="h6" gutterBottom>
              Choose Your MFA Method
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Select how you'd like to receive your second factor authentication codes.
            </Typography>

            <FormControl component="fieldset">
              <RadioGroup
                value={deviceType}
                onChange={(e) => setDeviceType(e.target.value as 'totp' | 'sms')}
              >
                <Paper sx={{ p: 2, mb: 2 }}>
                  <FormControlLabel
                    value="totp"
                    control={<Radio />}
                    label={
                      <Box display="flex" alignItems="center" gap={2}>
                        <QrCode color="primary" />
                        <Box>
                          <Typography variant="subtitle1">Authenticator App</Typography>
                          <Typography variant="body2" color="text.secondary">
                            Use apps like Google Authenticator, Authy, or 1Password
                          </Typography>
                        </Box>
                      </Box>
                    }
                  />
                </Paper>

                <Paper sx={{ p: 2 }}>
                  <FormControlLabel
                    value="sms"
                    control={<Radio />}
                    label={
                      <Box display="flex" alignItems="center" gap={2}>
                        <Sms color="primary" />
                        <Box>
                          <Typography variant="subtitle1">SMS Text Message</Typography>
                          <Typography variant="body2" color="text.secondary">
                            Receive codes via text message to your phone
                          </Typography>
                        </Box>
                      </Box>
                    }
                  />
                </Paper>
              </RadioGroup>
            </FormControl>
          </motion.div>
        );

      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Box component="form" onSubmit={setupForm.handleSubmit(handleSetup)}>
              <Typography variant="h6" gutterBottom>
                Setup Your {deviceType === 'totp' ? 'Authenticator App' : 'SMS Device'}
              </Typography>

              <Controller
                name="device_name"
                control={setupForm.control}
                rules={{ required: 'Device name is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Device Name"
                    margin="normal"
                    error={!!setupForm.formState.errors.device_name}
                    helperText={setupForm.formState.errors.device_name?.message}
                  />
                )}
              />

              {deviceType === 'sms' && (
                <Controller
                  name="phone_number"
                  control={setupForm.control}
                  rules={{
                    required: 'Phone number is required for SMS',
                    pattern: {
                      value: /^\+?[\d\s\-\(\)]{10,}$/,
                      message: 'Please enter a valid phone number',
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Phone Number"
                      placeholder="+1 (555) 123-4567"
                      margin="normal"
                      error={!!setupForm.formState.errors.phone_number}
                      helperText={setupForm.formState.errors.phone_number?.message}
                    />
                  )}
                />
              )}

              <Box display="flex" justifyContent="space-between" sx={{ mt: 3 }}>
                <Button variant="outlined" onClick={handleBack}>
                  Back
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  loading={isLoading}
                  loadingText="Setting up..."
                >
                  Setup Device
                </Button>
              </Box>
            </Box>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Box component="form" onSubmit={verifyForm.handleSubmit(handleVerify)}>
              <Typography variant="h6" gutterBottom>
                Verify Your Setup
              </Typography>

              {deviceType === 'totp' && setupResponse?.qr_code && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" gutterBottom>
                    1. Scan this QR code with your authenticator app:
                  </Typography>
                  <Box display="flex" justifyContent="center" sx={{ mb: 2 }}>
                    <img
                      src={setupResponse.qr_code}
                      alt="QR Code"
                      style={{ maxWidth: 200, maxHeight: 200 }}
                    />
                  </Box>
                  <Alert severity="info" sx={{ mb: 2 }}>
                    <Typography variant="body2">
                      <strong>Manual entry key:</strong> {setupResponse.manual_entry_key}
                    </Typography>
                  </Alert>
                  <Typography variant="body2" gutterBottom>
                    2. Enter the 6-digit code from your app:
                  </Typography>
                </Box>
              )}

              {deviceType === 'sms' && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  We've sent a verification code to your phone. Enter it below to complete setup.
                </Alert>
              )}

              <Controller
                name="otp_code"
                control={verifyForm.control}
                rules={{
                  required: 'Verification code is required',
                  pattern: {
                    value: /^\d{6}$/,
                    message: 'Code must be 6 digits',
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Verification Code"
                    placeholder="123456"
                    inputProps={{ maxLength: 6 }}
                    error={!!verifyForm.formState.errors.otp_code}
                    helperText={verifyForm.formState.errors.otp_code?.message}
                  />
                )}
              />

              <Box display="flex" justifyContent="space-between" sx={{ mt: 3 }}>
                <Button variant="outlined" onClick={handleBack}>
                  Back
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  loading={isLoading}
                  loadingText="Verifying..."
                >
                  Verify & Enable MFA
                </Button>
              </Box>
            </Box>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <Box>
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <AnimatePresence mode="wait">
        {renderStepContent()}
      </AnimatePresence>

      {activeStep === 0 && (
        <Box display="flex" justifyContent="flex-end" sx={{ mt: 3 }}>
          <Button variant="contained" onClick={handleNext}>
            Next
          </Button>
        </Box>
      )}
    </Box>
  );
};