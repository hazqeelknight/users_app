// User Module Type Definitions

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  is_organizer: boolean;
  is_email_verified: boolean;
  is_phone_verified: boolean;
  is_mfa_enabled: boolean;
  account_status: 'active' | 'inactive' | 'suspended' | 'pending_verification' | 'password_expired' | 'password_expired_grace_period';
  roles: Role[];
  profile: Profile;
  last_login: string | null;
  date_joined: string;
}

export interface Profile {
  organizer_slug: string;
  display_name: string;
  bio: string;
  profile_picture: string | null;
  phone: string;
  website: string;
  company: string;
  job_title: string;
  timezone_name: string;
  language: string;
  date_format: string;
  time_format: string;
  brand_color: string;
  brand_logo: string | null;
  public_profile: boolean;
  show_phone: boolean;
  show_email: boolean;
  reasonable_hours_start: number;
  reasonable_hours_end: number;
}

export interface Role {
  id: string;
  name: string;
  role_type: 'admin' | 'organizer' | 'team_member' | 'billing_manager' | 'viewer';
  description: string;
  parent: string | null;
  parent_name: string | null;
  children_count: number;
  role_permissions: Permission[];
  total_permissions: number;
  is_system_role: boolean;
}

export interface Permission {
  id: string;
  codename: string;
  name: string;
  description: string;
  category: string;
}

// Authentication & Account Management Types
export interface LoginCredentials {
  email: string;
  password: string;
  remember_me?: boolean;
}

export interface RegisterData {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  password_confirm: string;
  terms_accepted: boolean;
}

export interface ChangePasswordData {
  old_password: string;
  new_password: string;
  new_password_confirm: string;
}

export interface ForcedPasswordChangeData {
  new_password: string;
  new_password_confirm: string;
}

export interface PasswordResetRequestData {
  email: string;
}

export interface PasswordResetConfirmData {
  token: string;
  new_password: string;
  new_password_confirm: string;
}

export interface EmailVerificationData {
  token: string;
}

export interface ResendVerificationData {
  email: string;
}

// Team & Session Management Types
export interface Invitation {
  id: string;
  invited_email: string;
  role: string;
  role_name: string;
  message: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  invited_by_name: string;
  created_at: string;
  expires_at: string;
}

export interface InvitationCreateData {
  invited_email: string;
  role: string;
  message: string;
}

export interface InvitationResponseData {
  token: string;
  action: 'accept' | 'decline';
  first_name?: string;
  last_name?: string;
  password?: string;
  password_confirm?: string;
}

export interface AuditLog {
  id: string;
  user_email: string;
  action: string;
  action_display: string;
  description: string;
  ip_address: string;
  user_agent: string;
  metadata: Record<string, any>;
  created_at: string;
}

export interface UserSession {
  id: string;
  session_key: string;
  ip_address: string;
  country: string;
  city: string;
  location: string;
  user_agent: string;
  device_info: Record<string, any>;
  created_at: string;
  last_activity: string;
  expires_at: string;
  is_active: boolean;
  is_current: boolean;
  is_expired: boolean;
}

// MFA & SSO Types
export interface MFADevice {
  id: string;
  device_type: 'totp' | 'sms' | 'backup';
  device_type_display: string;
  name: string;
  phone_number: string;
  is_active: boolean;
  is_primary: boolean;
  last_used_at: string | null;
  created_at: string;
}

export interface MFASetupData {
  device_type: 'totp' | 'sms';
  device_name: string;
  phone_number?: string;
}

export interface MFAVerificationData {
  otp_code: string;
  device_id?: string;
}

export interface SAMLConfiguration {
  id: string;
  organization_name: string;
  organization_domain: string;
  entity_id: string;
  sso_url: string;
  slo_url: string;
  email_attribute: string;
  first_name_attribute: string;
  last_name_attribute: string;
  role_attribute: string;
  is_active: boolean;
  auto_provision_users: boolean;
  default_role: string | null;
  created_at: string;
  updated_at: string;
}

export interface OIDCConfiguration {
  id: string;
  organization_name: string;
  organization_domain: string;
  issuer: string;
  client_id: string;
  scopes: string[];
  email_claim: string;
  first_name_claim: string;
  last_name_claim: string;
  role_claim: string;
  is_active: boolean;
  auto_provision_users: boolean;
  default_role: string | null;
  created_at: string;
  updated_at: string;
}

export interface SSOInitiateData {
  sso_type: 'saml' | 'oidc';
  organization_domain: string;
  redirect_url?: string;
}

export interface SSOSession {
  id: string;
  sso_type: 'saml' | 'oidc';
  provider_name: string;
  ip_address: string;
  created_at: string;
  last_activity: string;
  expires_at: string;
}

// Form validation types
export interface ProfileUpdateData {
  display_name: string;
  bio: string;
  profile_picture?: File | null;
  phone: string;
  website: string;
  company: string;
  job_title: string;
  timezone_name: string;
  language: string;
  date_format: string;
  time_format: string;
  brand_color: string;
  brand_logo?: File | null;
  public_profile: boolean;
  show_phone: boolean;
  show_email: boolean;
  reasonable_hours_start: number;
  reasonable_hours_end: number;
}