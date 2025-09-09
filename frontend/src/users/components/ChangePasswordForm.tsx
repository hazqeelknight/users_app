import React from 'react';
import {
  Box,
  TextField,
  Typography,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { CheckCircle, Cancel } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Button } from '@/components/core';
import { ChangePasswordData } from '../types';
import { validatePassword } from '@/utils/validators';

interface ChangePasswordFormProps {
  onSubmit: (data: ChangePasswordData) => void;
  isLoading?: boolean;
}

export const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({
  onSubmit,
  isLoading = false,
}) => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ChangePasswordData>({
    defaultValues: {
      old_password: '',
      new_password: '',
      new_password_confirm: '',
    },
  });

  const newPassword = watch('new_password');
  const passwordValidation = validatePassword(newPassword);

  const passwordRequirements = [
    { label: 'At least 8 characters long', met: newPassword.length >= 8 },
    { label: 'Contains uppercase letter', met: /[A-Z]/.test(newPassword) },
    { label: 'Contains lowercase letter', met: /[a-z]/.test(newPassword) },
    { label: 'Contains number', met: /\d/.test(newPassword) },
    { label: 'Contains special character', met: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword) },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Typography variant="h6" gutterBottom>
          Change Password
        </Typography>

        <Alert severity="info" sx={{ mb: 3 }}>
          For security reasons, changing your password will log you out of all other devices.
        </Alert>

        <Controller
          name="old_password"
          control={control}
          rules={{ required: 'Current password is required' }}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Current Password"
              type="password"
              margin="normal"
              error={!!errors.old_password}
              helperText={errors.old_password?.message}
            />
          )}
        />

        <Controller
          name="new_password"
          control={control}
          rules={{
            required: 'New password is required',
            validate: (value) => {
              const validation = validatePassword(value);
              return validation.isValid || validation.errors[0];
            },
          }}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="New Password"
              type="password"
              margin="normal"
              error={!!errors.new_password}
              helperText={errors.new_password?.message}
            />
          )}
        />

        {newPassword && (
          <Box sx={{ mt: 2, mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Password Requirements:
            </Typography>
            <List dense>
              {passwordRequirements.map((req, index) => (
                <ListItem key={index} sx={{ py: 0 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    {req.met ? (
                      <CheckCircle color="success" fontSize="small" />
                    ) : (
                      <Cancel color="error" fontSize="small" />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={req.label}
                    sx={{
                      '& .MuiListItemText-primary': {
                        fontSize: '0.875rem',
                        color: req.met ? 'success.main' : 'error.main',
                      },
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        <Controller
          name="new_password_confirm"
          control={control}
          rules={{
            required: 'Please confirm your new password',
            validate: (value) =>
              value === newPassword || 'Passwords do not match',
          }}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Confirm New Password"
              type="password"
              margin="normal"
              error={!!errors.new_password_confirm}
              helperText={errors.new_password_confirm?.message}
            />
          )}
        />

        <Box display="flex" justifyContent="flex-end" sx={{ mt: 3 }}>
          <Button
            type="submit"
            variant="contained"
            size="large"
            loading={isLoading}
            loadingText="Changing Password..."
            disabled={!passwordValidation.isValid}
          >
            Change Password
          </Button>
        </Box>
      </Box>
    </motion.div>
  );
};