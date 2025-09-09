import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/client';
import { queryKeys } from '@/api/queryClient';
import { toast } from 'react-toastify';
import {
  User,
  Profile,
  Role,
  Permission,
  LoginCredentials,
  RegisterData,
  ChangePasswordData,
  ForcedPasswordChangeData,
  PasswordResetRequestData,
  PasswordResetConfirmData,
  EmailVerificationData,
  ResendVerificationData,
  Invitation,
  InvitationCreateData,
  InvitationResponseData,
  AuditLog,
  UserSession,
  MFADevice,
  MFASetupData,
  MFAVerificationData,
  SAMLConfiguration,
  OIDCConfiguration,
  SSOInitiateData,
  SSOSession,
  ProfileUpdateData,
} from '../types';

// Authentication Hooks
export const useRegister = () => {
  return useMutation({
    mutationFn: async (data: RegisterData) => {
      const response = await api.post('/users/register/', data);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || 'Registration successful!');
    },
  });
};

export const useLogin = () => {
  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await api.post('/users/login/', credentials);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Welcome back!');
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      await api.post('/users/logout/');
    },
    onSuccess: () => {
      queryClient.clear();
      toast.success('Logged out successfully');
    },
    onError: () => {
      // Even if the API call fails, we should still log out locally
      queryClient.clear();
    },
  });
};

// Profile Management Hooks
export const useUserProfile = () => {
  return useQuery({
    queryKey: queryKeys.users.profile(),
    queryFn: async () => {
      const response = await api.get('/users/profile/');
      return response.data as Profile;
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (updates: Partial<ProfileUpdateData>) => {
      const formData = new FormData();
      
      Object.entries(updates).forEach(([key, value]) => {
        if (value instanceof File) {
          formData.append(key, value);
        } else if (value !== null && value !== undefined) {
          formData.append(key, String(value));
        }
      });
      
      const response = await api.patch('/users/profile/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.profile() });
      toast.success('Profile updated successfully');
    },
  });
};

export const usePublicProfile = (organizerSlug: string) => {
  return useQuery({
    queryKey: ['users', 'public-profile', organizerSlug],
    queryFn: async () => {
      const response = await api.get(`/users/public/${organizerSlug}/`);
      return response.data as Profile;
    },
    enabled: !!organizerSlug,
  });
};

// Password Management Hooks
export const useChangePassword = () => {
  return useMutation({
    mutationFn: async (data: ChangePasswordData) => {
      const response = await api.post('/users/change-password/', data);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Password changed successfully');
    },
  });
};

export const useForcePasswordChange = () => {
  return useMutation({
    mutationFn: async (data: ForcedPasswordChangeData) => {
      const response = await api.post('/users/force-password-change/', data);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Password changed successfully. Your account is now active.');
    },
  });
};

export const useRequestPasswordReset = () => {
  return useMutation({
    mutationFn: async (data: PasswordResetRequestData) => {
      const response = await api.post('/users/request-password-reset/', data);
      return response.data;
    },
    onSuccess: () => {
      toast.success('If an account with that email exists, a password reset link has been sent.');
    },
  });
};

export const useConfirmPasswordReset = () => {
  return useMutation({
    mutationFn: async (data: PasswordResetConfirmData) => {
      const response = await api.post('/users/confirm-password-reset/', data);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Password reset successfully');
    },
  });
};

// Email Verification Hooks
export const useVerifyEmail = () => {
  return useMutation({
    mutationFn: async (data: EmailVerificationData) => {
      const response = await api.post('/users/verify-email/', data);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Email verified successfully');
    },
  });
};

export const useResendVerification = () => {
  return useMutation({
    mutationFn: async (data: ResendVerificationData) => {
      const response = await api.post('/users/resend-verification/', data);
      return response.data;
    },
    onSuccess: () => {
      toast.success('If an unverified account with that email exists, a verification email has been sent.');
    },
  });
};

// Role & Permission Hooks
export const usePermissions = () => {
  return useQuery({
    queryKey: queryKeys.users.permissions(),
    queryFn: async () => {
      const response = await api.get('/users/permissions/');
      return response.data as Permission[];
    },
  });
};

export const useRoles = () => {
  return useQuery({
    queryKey: queryKeys.users.roles(),
    queryFn: async () => {
      const response = await api.get('/users/roles/');
      return response.data as Role[];
    },
  });
};

// Invitation Hooks
export const useInvitations = () => {
  return useQuery({
    queryKey: ['users', 'invitations'],
    queryFn: async () => {
      const response = await api.get('/users/invitations/');
      return response.data as Invitation[];
    },
  });
};

export const useCreateInvitation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: InvitationCreateData) => {
      const response = await api.post('/users/invitations/', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'invitations'] });
      toast.success('Invitation sent successfully');
    },
  });
};

export const useRespondToInvitation = () => {
  return useMutation({
    mutationFn: async (data: InvitationResponseData) => {
      const response = await api.post('/users/invitations/respond/', data);
      return response.data;
    },
    onSuccess: (data) => {
      if (data.message) {
        toast.success(data.message);
      }
    },
  });
};

// Session Management Hooks
export const useUserSessions = () => {
  return useQuery({
    queryKey: queryKeys.users.sessions(),
    queryFn: async () => {
      const response = await api.get('/users/sessions/');
      return response.data as UserSession[];
    },
  });
};

export const useRevokeSession = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (sessionId: string) => {
      const response = await api.post(`/users/sessions/${sessionId}/revoke/`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.sessions() });
      toast.success('Session revoked successfully');
    },
  });
};

export const useRevokeAllSessions = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      const response = await api.post('/users/sessions/revoke-all/');
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.sessions() });
      toast.success('All other sessions revoked successfully');
    },
  });
};

// Audit Log Hooks
export const useAuditLogs = () => {
  return useQuery({
    queryKey: queryKeys.users.auditLogs(),
    queryFn: async () => {
      const response = await api.get('/users/audit-logs/');
      return response.data as AuditLog[];
    },
  });
};

// MFA Management Hooks
export const useMFADevices = () => {
  return useQuery({
    queryKey: ['users', 'mfa-devices'],
    queryFn: async () => {
      const response = await api.get('/users/mfa/devices/');
      return response.data as MFADevice[];
    },
  });
};

export const useSetupMFA = () => {
  return useMutation({
    mutationFn: async (data: MFASetupData) => {
      const response = await api.post('/users/mfa/setup/', data);
      return response.data;
    },
  });
};

export const useVerifyMFASetup = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: MFAVerificationData) => {
      const response = await api.post('/users/mfa/verify/', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'mfa-devices'] });
      toast.success('MFA enabled successfully');
    },
  });
};

export const useDisableMFA = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (password: string) => {
      const response = await api.post('/users/mfa/disable/', { password });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'mfa-devices'] });
      toast.success('MFA disabled successfully');
    },
  });
};

export const useRegenerateBackupCodes = () => {
  return useMutation({
    mutationFn: async (password: string) => {
      const response = await api.post('/users/mfa/backup-codes/regenerate/', { password });
      return response.data;
    },
    onSuccess: () => {
      toast.success('Backup codes regenerated successfully');
    },
  });
};

export const useResendSMSOTP = () => {
  return useMutation({
    mutationFn: async () => {
      const response = await api.post('/users/mfa/resend-sms/');
      return response.data;
    },
    onSuccess: () => {
      toast.success('SMS verification code sent successfully');
    },
  });
};

export const useSendSMSMFACode = () => {
  return useMutation({
    mutationFn: async (deviceId: string) => {
      const response = await api.post('/users/mfa/send-sms-code/', { device_id: deviceId });
      return response.data;
    },
    onSuccess: () => {
      toast.success('SMS MFA code sent successfully');
    },
  });
};

// SSO Configuration Hooks (Admin only)
export const useSAMLConfigs = () => {
  return useQuery({
    queryKey: ['users', 'saml-configs'],
    queryFn: async () => {
      const response = await api.get('/users/sso/saml/');
      return response.data as SAMLConfiguration[];
    },
  });
};

export const useCreateSAMLConfig = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Partial<SAMLConfiguration>) => {
      const response = await api.post('/users/sso/saml/', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'saml-configs'] });
      toast.success('SAML configuration created successfully');
    },
  });
};

export const useSAMLConfigDetail = (configId: string) => {
  return useQuery({
    queryKey: ['users', 'saml-config', configId],
    queryFn: async () => {
      const response = await api.get(`/users/sso/saml/${configId}/`);
      return response.data as SAMLConfiguration;
    },
    enabled: !!configId,
  });
};

export const useOIDCConfigs = () => {
  return useQuery({
    queryKey: ['users', 'oidc-configs'],
    queryFn: async () => {
      const response = await api.get('/users/sso/oidc/');
      return response.data as OIDCConfiguration[];
    },
  });
};

export const useCreateOIDCConfig = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Partial<OIDCConfiguration>) => {
      const response = await api.post('/users/sso/oidc/', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'oidc-configs'] });
      toast.success('OIDC configuration created successfully');
    },
  });
};

export const useOIDCConfigDetail = (configId: string) => {
  return useQuery({
    queryKey: ['users', 'oidc-config', configId],
    queryFn: async () => {
      const response = await api.get(`/users/sso/oidc/${configId}/`);
      return response.data as OIDCConfiguration;
    },
    enabled: !!configId,
  });
};

export const useInitiateSSO = () => {
  return useMutation({
    mutationFn: async (data: SSOInitiateData) => {
      const response = await api.post('/users/sso/initiate/', data);
      return response.data;
    },
  });
};

export const useSSOLogout = () => {
  return useMutation({
    mutationFn: async () => {
      const response = await api.post('/users/sso/logout/');
      return response.data;
    },
    onSuccess: () => {
      toast.success('SSO logout initiated');
    },
  });
};

export const useSSODiscovery = (domain: string) => {
  return useQuery({
    queryKey: ['users', 'sso-discovery', domain],
    queryFn: async () => {
      const response = await api.get(`/users/sso/discovery/?domain=${domain}`);
      return response.data;
    },
    enabled: !!domain,
  });
};

export const useSSOSessions = () => {
  return useQuery({
    queryKey: ['users', 'sso-sessions'],
    queryFn: async () => {
      const response = await api.get('/users/sso/sessions/');
      return response.data as SSOSession[];
    },
  });
};

export const useRevokeSSOSession = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (sessionId: string) => {
      const response = await api.post(`/users/sso/sessions/${sessionId}/revoke/`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'sso-sessions'] });
      toast.success('SSO session revoked successfully');
    },
  });
};