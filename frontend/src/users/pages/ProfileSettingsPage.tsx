import React from 'react';
import { Box, Alert } from '@mui/material';
import { motion } from 'framer-motion';
import { PageHeader, LoadingSpinner } from '@/components/core';
import { ProfileForm } from '../components/ProfileForm';
import { useUserProfile, useUpdateProfile } from '../api/hooks';
import { ProfileUpdateData } from '../types';

const ProfileSettingsPage: React.FC = () => {
  const { data: profile, isLoading, error } = useUserProfile();
  const updateProfileMutation = useUpdateProfile();

  const handleSubmit = (data: ProfileUpdateData) => {
    updateProfileMutation.mutate(data);
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading profile..." />;
  }

  if (error) {
    return (
      <Box>
        <PageHeader
          title="Profile Settings"
          subtitle="Manage your personal information and preferences"
        />
        <Alert severity="error">
          Failed to load profile data. Please try again later.
        </Alert>
      </Box>
    );
  }

  if (!profile) {
    return (
      <Box>
        <PageHeader
          title="Profile Settings"
          subtitle="Manage your personal information and preferences"
        />
        <Alert severity="warning">
          Profile data not found. Please contact support if this issue persists.
        </Alert>
      </Box>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <PageHeader
        title="Profile Settings"
        subtitle="Manage your personal information and preferences"
      />

      <ProfileForm
        profile={profile}
        onSubmit={handleSubmit}
        isLoading={updateProfileMutation.isPending}
      />
    </motion.div>
  );
};

export default ProfileSettingsPage;