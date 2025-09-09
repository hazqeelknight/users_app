import React from 'react';
import {
  Box,
  TextField,
  Grid,
  FormControlLabel,
  Switch,
  MenuItem,
  Typography,
  Avatar,
  IconButton,
  Alert,
} from '@mui/material';
import { PhotoCamera, Delete } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Button } from '@/components/core';
import { Profile, ProfileUpdateData } from '../types';

interface ProfileFormProps {
  profile: Profile;
  onSubmit: (data: ProfileUpdateData) => void;
  isLoading?: boolean;
}

const timezones = [
  'UTC',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Australia/Sydney',
];

const languages = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'it', label: 'Italian' },
  { value: 'pt', label: 'Portuguese' },
  { value: 'ja', label: 'Japanese' },
  { value: 'zh', label: 'Chinese' },
];

const dateFormats = [
  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
];

const timeFormats = [
  { value: '12h', label: '12-hour (AM/PM)' },
  { value: '24h', label: '24-hour' },
];

export const ProfileForm: React.FC<ProfileFormProps> = ({
  profile,
  onSubmit,
  isLoading = false,
}) => {
  const [profilePicturePreview, setProfilePicturePreview] = React.useState<string | null>(
    profile.profile_picture
  );
  const [brandLogoPreview, setBrandLogoPreview] = React.useState<string | null>(
    profile.brand_logo
  );

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProfileUpdateData>({
    defaultValues: {
      display_name: profile.display_name,
      bio: profile.bio,
      phone: profile.phone,
      website: profile.website,
      company: profile.company,
      job_title: profile.job_title,
      timezone_name: profile.timezone_name,
      language: profile.language,
      date_format: profile.date_format,
      time_format: profile.time_format,
      brand_color: profile.brand_color,
      public_profile: profile.public_profile,
      show_phone: profile.show_phone,
      show_email: profile.show_email,
      reasonable_hours_start: profile.reasonable_hours_start,
      reasonable_hours_end: profile.reasonable_hours_end,
    },
  });

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: 'profile_picture' | 'brand_logo'
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setValue(field, file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (field === 'profile_picture') {
          setProfilePicturePreview(result);
        } else {
          setBrandLogoPreview(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveFile = (field: 'profile_picture' | 'brand_logo') => {
    setValue(field, null);
    if (field === 'profile_picture') {
      setProfilePicturePreview(null);
    } else {
      setBrandLogoPreview(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Grid container spacing={3}>
          {/* Profile Picture Section */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Profile Picture
            </Typography>
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar
                src={profilePicturePreview || undefined}
                sx={{ width: 80, height: 80 }}
              />
              <Box>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="profile-picture-upload"
                  type="file"
                  onChange={(e) => handleFileChange(e, 'profile_picture')}
                />
                <label htmlFor="profile-picture-upload">
                  <IconButton color="primary" component="span">
                    <PhotoCamera />
                  </IconButton>
                </label>
                {profilePicturePreview && (
                  <IconButton
                    color="error"
                    onClick={() => handleRemoveFile('profile_picture')}
                  >
                    <Delete />
                  </IconButton>
                )}
              </Box>
            </Box>
          </Grid>

          {/* Basic Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Basic Information
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Controller
              name="display_name"
              control={control}
              rules={{ required: 'Display name is required' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Display Name"
                  error={!!errors.display_name}
                  helperText={errors.display_name?.message}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Phone Number"
                  error={!!errors.phone}
                  helperText={errors.phone?.message}
                />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Controller
              name="bio"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Bio"
                  multiline
                  rows={3}
                  placeholder="Tell people a bit about yourself..."
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Controller
              name="website"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Website"
                  placeholder="https://example.com"
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Controller
              name="company"
              control={control}
              render={({ field }) => (
                <TextField {...field} fullWidth label="Company" />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Controller
              name="job_title"
              control={control}
              render={({ field }) => (
                <TextField {...field} fullWidth label="Job Title" />
              )}
            />
          </Grid>

          {/* Localization Settings */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Localization
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Controller
              name="timezone_name"
              control={control}
              render={({ field }) => (
                <TextField {...field} select fullWidth label="Timezone">
                  {timezones.map((tz) => (
                    <MenuItem key={tz} value={tz}>
                      {tz}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Controller
              name="language"
              control={control}
              render={({ field }) => (
                <TextField {...field} select fullWidth label="Language">
                  {languages.map((lang) => (
                    <MenuItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Controller
              name="date_format"
              control={control}
              render={({ field }) => (
                <TextField {...field} select fullWidth label="Date Format">
                  {dateFormats.map((format) => (
                    <MenuItem key={format.value} value={format.value}>
                      {format.label}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Controller
              name="time_format"
              control={control}
              render={({ field }) => (
                <TextField {...field} select fullWidth label="Time Format">
                  {timeFormats.map((format) => (
                    <MenuItem key={format.value} value={format.value}>
                      {format.label}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Grid>

          {/* Branding */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Branding
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Controller
              name="brand_color"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Brand Color"
                  type="color"
                  InputProps={{
                    sx: { height: 56 },
                  }}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="body2" gutterBottom>
              Brand Logo
            </Typography>
            <Box display="flex" alignItems="center" gap={2}>
              {brandLogoPreview && (
                <Box
                  component="img"
                  src={brandLogoPreview}
                  sx={{ width: 60, height: 60, objectFit: 'contain' }}
                />
              )}
              <Box>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="brand-logo-upload"
                  type="file"
                  onChange={(e) => handleFileChange(e, 'brand_logo')}
                />
                <label htmlFor="brand-logo-upload">
                  <IconButton color="primary" component="span">
                    <PhotoCamera />
                  </IconButton>
                </label>
                {brandLogoPreview && (
                  <IconButton
                    color="error"
                    onClick={() => handleRemoveFile('brand_logo')}
                  >
                    <Delete />
                  </IconButton>
                )}
              </Box>
            </Box>
          </Grid>

          {/* Privacy Settings */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Privacy Settings
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Controller
              name="public_profile"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Switch {...field} checked={field.value} />}
                  label="Make profile public"
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Controller
              name="show_phone"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Switch {...field} checked={field.value} />}
                  label="Show phone number on public profile"
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Controller
              name="show_email"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Switch {...field} checked={field.value} />}
                  label="Show email on public profile"
                />
              )}
            />
          </Grid>

          {/* Scheduling Settings */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Scheduling Settings
            </Typography>
            <Alert severity="info" sx={{ mb: 2 }}>
              These hours are used for multi-invitee scheduling to find reasonable meeting times.
            </Alert>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Controller
              name="reasonable_hours_start"
              control={control}
              rules={{
                min: { value: 0, message: 'Start hour must be between 0 and 23' },
                max: { value: 23, message: 'Start hour must be between 0 and 23' },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Reasonable Hours Start"
                  type="number"
                  inputProps={{ min: 0, max: 23 }}
                  error={!!errors.reasonable_hours_start}
                  helperText={errors.reasonable_hours_start?.message || '24-hour format (0-23)'}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Controller
              name="reasonable_hours_end"
              control={control}
              rules={{
                min: { value: 1, message: 'End hour must be between 1 and 24' },
                max: { value: 24, message: 'End hour must be between 1 and 24' },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Reasonable Hours End"
                  type="number"
                  inputProps={{ min: 1, max: 24 }}
                  error={!!errors.reasonable_hours_end}
                  helperText={errors.reasonable_hours_end?.message || '24-hour format (1-24)'}
                />
              )}
            />
          </Grid>

          {/* Submit Button */}
          <Grid item xs={12}>
            <Box display="flex" justifyContent="flex-end" sx={{ mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                loading={isLoading}
                loadingText="Saving..."
              >
                Save Changes
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </motion.div>
  );
};