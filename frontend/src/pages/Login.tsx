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
} from '@mui/material';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Link as RouterLink } from 'react-router-dom';
import { Button } from '@/components/core';
import { useAuth } from '@/hooks/useAuth';

interface LoginForm {
  email: string;
  password: string;
  remember_me: boolean;
}

const Login: React.FC = () => {
  const { login, isLoggingIn } = useAuth();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    defaultValues: {
      email: '',
      password: '',
      remember_me: false,
    },
  });

  const onSubmit = (data: LoginForm) => {
    login(data);
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
                Welcome back
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Sign in to your NovaMeet account
              </Typography>
            </Box>

            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
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
                autoFocus
                error={!!errors.email}
                helperText={errors.email?.message}
              />
              
              <TextField
                {...register('password', {
                  required: 'Password is required',
                })}
                margin="normal"
                fullWidth
                label="Password"
                type="password"
                autoComplete="current-password"
                error={!!errors.password}
                helperText={errors.password?.message}
              />
              
              <FormControlLabel
                control={
                  <Checkbox
                    {...register('remember_me')}
                    color="primary"
                  />
                }
                label="Remember me"
                sx={{ mt: 1 }}
              />
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                loading={isLoggingIn}
                loadingText="Signing in..."
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              
              <Box textAlign="center" mt={2}>
                <Link component={RouterLink} to="/forgot-password" variant="body2">
                  Forgot your password?
                </Link>
              </Box>
              
              <Box textAlign="center" mt={2}>
                <Typography variant="body2" color="text.secondary">
                  Don't have an account?{' '}
                  <Link component={RouterLink} to="/register" sx={{ fontWeight: 500 }}>
                    Sign up
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

export default Login;