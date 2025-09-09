import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import { api } from '@/api/client';
import { queryKeys } from '@/api/queryClient';
import { User } from '@/types';
import { toast } from 'react-toastify';

interface LoginCredentials {
  email: string;
  password: string;
  remember_me?: boolean;
}

interface RegisterData {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  password_confirm: string;
  terms_accepted: boolean;
}

export const useAuth = () => {
  const queryClient = useQueryClient();
  const { user, token, isAuthenticated, login, logout, setLoading, updateUser } = useAuthStore();

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await api.post('/users/login/', credentials);
      return response.data;
    },
    onSuccess: (data) => {
      login(data.user, data.token);
      toast.success('Welcome back!');
    },
    onError: () => {
      // Error handling is done by the API client interceptor
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: async (data: RegisterData) => {
      const response = await api.post('/users/register/', data);
      return response.data;
    },
    onSuccess: (data) => {
      login(data.user, data.token);
      toast.success(data.message || 'Registration successful!');
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      await api.post('/users/logout/');
    },
    onSuccess: () => {
      logout();
      queryClient.clear();
      toast.success('Logged out successfully');
    },
    onError: () => {
      // Even if the API call fails, we should still log out locally
      logout();
      queryClient.clear();
    },
  });

  // Profile query
  const profileQuery = useQuery({
    queryKey: queryKeys.users.profile(),
    queryFn: async () => {
      const response = await api.get('/users/profile/');
      return response.data;
    },
    enabled: isAuthenticated,
    onSuccess: (data) => {
      if (user) {
        updateUser({ profile: data });
      }
    },
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (updates: Partial<User['profile']>) => {
      const response = await api.patch('/users/profile/', updates);
      return response.data;
    },
    onSuccess: (data) => {
      updateUser({ profile: data });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.profile() });
      toast.success('Profile updated successfully');
    },
  });

  // Change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: async (data: { old_password: string; new_password: string; new_password_confirm: string }) => {
      const response = await api.post('/users/change-password/', data);
      return response.data;
    },
    onSuccess: (data) => {
      // Update token if provided
      if (data.token) {
        useAuthStore.getState().setToken(data.token);
      }
      toast.success('Password changed successfully');
    },
  });

  return {
    // State
    user,
    token,
    isAuthenticated,
    isLoading: loginMutation.isPending || registerMutation.isPending || profileQuery.isLoading,
    
    // Mutations
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: logoutMutation.mutate,
    updateProfile: updateProfileMutation.mutate,
    changePassword: changePasswordMutation.mutate,
    
    // Mutation states
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    isUpdatingProfile: updateProfileMutation.isPending,
    isChangingPassword: changePasswordMutation.isPending,
    
    // Profile data
    profile: profileQuery.data,
    isLoadingProfile: profileQuery.isLoading,
    profileError: profileQuery.error,
  };
};