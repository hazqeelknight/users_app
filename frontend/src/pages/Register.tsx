import React from 'react';
import {
  Box,
  Paper,
  TextField,
  Typography,
  Link,
  FormControlLabel,
  Checkbox,
  Container,
  Grid,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Link as RouterLink } from 'react-router-dom';
import { Button } from '@/components/core';
import { useAuth } from '@/hooks/useAuth';
import { validatePassword } from '@/utils/validators';

interface RegisterForm {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password_confirm: string;
  terms_accepted: boolean;
}

const Register: React.FC = () => {
  const { register: registerUser, isRegistering } = useAuth();
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>({
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      password_confirm: '',
      terms_accepted: false,
    },
  });

  const password = watch('password');

  const onSubmit = (data: RegisterForm) => {
    registerUser(data);
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          py: 4,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 4,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 3,
            }}
          >
            <Box textAlign="center" mb={4}>
              <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
                Create your account
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Start scheduling meetings with NovaMeet
              </Typography>
            </Box>

            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    {...register('first_name', {
                      required: 'First name is required',
                      maxLength: {
                        value: 30,
                        message: 'First name must be less than 30 characters',
                      },
                    })}
                    fullWidth
                    label="First Name"
                    autoComplete="given-name"
                    error={!!errors.first_name}
                    helperText={errors.first_name?.message}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    {...register('last_name', {
                      required: 'Last name is required',
                      maxLength: {
                        value: 30,
                        message: 'Last name must be less than 30 characters',
                      },
                    })}
                    fullWidth
                    label="Last Name"
                    autoComplete="family-name"
                    error={!!errors.last_name}
                    helperText={errors.last_name?.message}
                  />
                </Grid>
              </Grid>
              
              <TextField
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Please enter a valid email address',
                  },
                })}
                margin="normal"
                fullWidth
                label="Email Address"
                type="email"
                autoComplete="email"
                error={!!errors.email}
                helperText={errors.email?.message}
              />
              
              <TextField
                {...register('password', {
                  required: 'Password is required',
                  validate: (value) => {
                    const validation = validatePassword(value);
                    return validation.isValid || validation.errors[0];
                  },
                })}
                margin="normal"
                fullWidth
                label="Password"
                type="password"
                autoComplete="new-password"
                error={!!errors.password}
                helperText={errors.password?.message}
              />
              
              <TextField
                {...register('password_confirm', {
                  required: 'Please confirm your password',
                  validate: (value) =>
                    value === password || 'Passwords do not match',
                })}
                margin="normal"
                fullWidth
                label="Confirm Password"
                type="password"
                autoComplete="new-password"
                error={!!errors.password_confirm}
                helperText={errors.password_confirm?.message}
              />
              
              <FormControlLabel
                control={
                  <Checkbox
                    {...register('terms_accepted', {
                      required: 'You must accept the terms and conditions',
                    })}
                    color="primary"
                  />
                }
                label={
                  <Typography variant="body2">
                    I agree to the{' '}
                    <Link href="/terms" target="_blank" sx={{ fontWeight: 500 }}>
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" target="_blank" sx={{ fontWeight: 500 }}>
                      Privacy Policy
                    </Link>
                  </Typography>
                }
                sx={{ mt: 2 }}
              />
              
              {errors.terms_accepted && (
                <Typography variant="caption" color="error" display="block" sx={{ mt: 1 }}>
                  {errors.terms_accepted.message}
                </Typography>
              )}
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                loading={isRegistering}
                loadingText="Creating account..."
                sx={{ mt: 3, mb: 2 }}
              >
                Create Account
              </Button>
              
              <Box textAlign="center" mt={2}>
                <Typography variant="body2" color="text.secondary">
                  Already have an account?{' '}
                  <Link component={RouterLink} to="/login" sx={{ fontWeight: 500 }}>
                    Sign in
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Paper>
        </motion.div>
      </Box>
    </Container>
  );
};

export default Register;