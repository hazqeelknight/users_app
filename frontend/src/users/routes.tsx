import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Lazy load pages for better performance
const ProfileSettingsPage = React.lazy(() => import('./pages/ProfileSettingsPage'));
const SecuritySettingsPage = React.lazy(() => import('./pages/SecuritySettingsPage'));
const AuditLogPage = React.lazy(() => import('./pages/AuditLogPage'));
const TeamManagementPage = React.lazy(() => import('./pages/TeamManagementPage'));
const SSOConfigurationPage = React.lazy(() => import('./pages/SSOConfigurationPage'));
const PublicProfilePage = React.lazy(() => import('./pages/PublicProfilePage'));
const EmailVerificationPage = React.lazy(() => import('./pages/EmailVerificationPage'));
const ForgotPasswordPage = React.lazy(() => import('./pages/ForgotPasswordPage'));
const ResetPasswordPage = React.lazy(() => import('./pages/ResetPasswordPage'));
const ForcePasswordChangePage = React.lazy(() => import('./pages/ForcePasswordChangePage'));

const UsersRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="profile" element={<ProfileSettingsPage />} />
      <Route path="security" element={<SecuritySettingsPage />} />
      <Route path="audit-logs" element={<AuditLogPage />} />
      <Route path="team" element={<TeamManagementPage />} />
      <Route path="sso/*" element={<SSOConfigurationPage />} />
      
      {/* Public routes (these should be handled at the app level) */}
      <Route path="public/:organizer_slug" element={<PublicProfilePage />} />
      <Route path="verify-email" element={<EmailVerificationPage />} />
      <Route path="forgot-password" element={<ForgotPasswordPage />} />
      <Route path="reset-password" element={<ResetPasswordPage />} />
      <Route path="force-password-change" element={<ForcePasswordChangePage />} />
    </Routes>
  );
};

export default UsersRoutes;