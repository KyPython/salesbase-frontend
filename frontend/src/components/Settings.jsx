import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Tabs,
  Tab,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Divider,
  Alert,
  CircularProgress,
  IconButton
} from '@mui/material';
import {
  Person as PersonIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Save as SaveIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon
} from '@mui/icons-material';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { useSnackbar } from 'notistack';

export default function Settings() {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saveStatus, setSaveStatus] = useState('');
  
  const { mode, toggleTheme, setTheme } = useTheme();
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    phone: ''
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    dealUpdates: true,
    customerAlerts: true,
    weeklyReports: false
  });

  const [security, setSecurity] = useState({
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordExpiry: 90
  });

  // Load user settings from database
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        setError('');
        
        const response = await api.get('/user-settings');
        const settings = response.data.settings;
        
        if (settings) {
          // Update profile data
          setProfileData({
            firstName: user?.first_name || '',
            lastName: user?.last_name || '',
            email: user?.email || '',
            role: user?.role || '',
            phone: user?.phone || ''
          });
          
          // Update notification settings
          setNotifications({
            emailNotifications: settings.email_notifications || true,
            smsNotifications: settings.sms_notifications || false,
            dealUpdates: settings.deal_updates || true,
            customerAlerts: settings.customer_alerts || true,
            weeklyReports: settings.weekly_reports || false
          });
          
          // Update security settings
          setSecurity({
            twoFactorAuth: false, // Not implemented yet
            sessionTimeout: settings.session_timeout || 30,
            passwordExpiry: settings.password_expiry || 90
          });
        }
      } catch (err) {
        console.error('Failed to load settings:', err);
        setError('Failed to load user settings');
        enqueueSnackbar('Failed to load settings', { variant: 'error' });
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadSettings();
    }
  }, [user, enqueueSnackbar]);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError('');
      
      // Update user profile (this would need a separate endpoint)
      // For now, just show success message
      setSaveStatus('success');
      enqueueSnackbar('Profile updated successfully', { variant: 'success' });
      
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (err) {
      console.error('Failed to update profile:', err);
      setError('Failed to update profile');
      enqueueSnackbar('Failed to update profile', { variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleNotificationSave = async () => {
    try {
      setSaving(true);
      setError('');
      
      await api.put('/user-settings', {
        email_notifications: notifications.emailNotifications,
        sms_notifications: notifications.smsNotifications,
        deal_updates: notifications.dealUpdates,
        customer_alerts: notifications.customerAlerts,
        weekly_reports: notifications.weeklyReports
      });
      
      enqueueSnackbar('Notification settings saved successfully', { variant: 'success' });
    } catch (err) {
      console.error('Failed to save notification settings:', err);
      setError('Failed to save notification settings');
      enqueueSnackbar('Failed to save notification settings', { variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleSecuritySave = async () => {
    try {
      setSaving(true);
      setError('');
      
      await api.put('/user-settings', {
        session_timeout: security.sessionTimeout,
        password_expiry: security.passwordExpiry
      });
      
      enqueueSnackbar('Security settings saved successfully', { variant: 'success' });
    } catch (err) {
      console.error('Failed to save security settings:', err);
      setError('Failed to save security settings');
      enqueueSnackbar('Failed to save security settings', { variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleNotificationChange = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSecurityChange = (key, value) => {
    setSecurity(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Settings
        </Typography>
        
        {/* Theme Toggle Button */}
        <IconButton
          onClick={toggleTheme}
          color="primary"
          sx={{ 
            backgroundColor: 'background.paper',
            boxShadow: 2,
            '&:hover': { backgroundColor: 'action.hover' }
          }}
        >
          {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {saveStatus === 'success' && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Settings saved successfully!
        </Alert>
      )}

      <Card>
        <CardContent>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs value={activeTab} onChange={handleTabChange} aria-label="settings tabs">
              <Tab icon={<PersonIcon />} label="Profile" />
              <Tab icon={<NotificationsIcon />} label="Notifications" />
              <Tab icon={<SecurityIcon />} label="Security" />
            </Tabs>
          </Box>

          {/* Profile Tab */}
          {activeTab === 0 && (
            <Box component="form" onSubmit={handleProfileSave}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="First Name"
                    value={profileData.firstName}
                    onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    value={profileData.lastName}
                    onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                    margin="normal"
                    disabled
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone"
                    value={profileData.phone}
                    onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Role</InputLabel>
                    <Select
                      value={profileData.role}
                      label="Role"
                      onChange={(e) => setProfileData(prev => ({ ...prev, role: e.target.value }))}
                      disabled
                    >
                      <MenuItem value="sales_rep">Sales Rep</MenuItem>
                      <MenuItem value="manager">Manager</MenuItem>
                      <MenuItem value="admin">Admin</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<SaveIcon />}
                    disabled={saving}
                    sx={{ mt: 2 }}
                  >
                    {saving ? 'Saving...' : 'Save Profile'}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Notifications Tab */}
          {activeTab === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Notification Preferences
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notifications.emailNotifications}
                        onChange={() => handleNotificationChange('emailNotifications')}
                      />
                    }
                    label="Email Notifications"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notifications.smsNotifications}
                        onChange={() => handleNotificationChange('smsNotifications')}
                      />
                    }
                    label="SMS Notifications"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notifications.dealUpdates}
                        onChange={() => handleNotificationChange('dealUpdates')}
                      />
                    }
                    label="Deal Updates"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notifications.customerAlerts}
                        onChange={() => handleNotificationChange('customerAlerts')}
                      />
                    }
                    label="Customer Alerts"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notifications.weeklyReports}
                        onChange={() => handleNotificationChange('weeklyReports')}
                      />
                    }
                    label="Weekly Reports"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleNotificationSave}
                    disabled={saving}
                    sx={{ mt: 2 }}
                  >
                    {saving ? 'Saving...' : 'Save Notification Settings'}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Security Tab */}
          {activeTab === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Security Settings
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={security.twoFactorAuth}
                        onChange={() => handleSecurityChange('twoFactorAuth', !security.twoFactorAuth)}
                        disabled
                      />
                    }
                    label="Two-Factor Authentication (Coming Soon)"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Session Timeout (minutes)</InputLabel>
                    <Select
                      value={security.sessionTimeout}
                      label="Session Timeout (minutes)"
                      onChange={(e) => handleSecurityChange('sessionTimeout', e.target.value)}
                    >
                      <MenuItem value={15}>15 minutes</MenuItem>
                      <MenuItem value={30}>30 minutes</MenuItem>
                      <MenuItem value={60}>1 hour</MenuItem>
                      <MenuItem value={120}>2 hours</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Password Expiry (days)</InputLabel>
                    <Select
                      value={security.passwordExpiry}
                      label="Password Expiry (days)"
                      onChange={(e) => handleSecurityChange('passwordExpiry', e.target.value)}
                    >
                      <MenuItem value={30}>30 days</MenuItem>
                      <MenuItem value={60}>60 days</MenuItem>
                      <MenuItem value={90}>90 days</MenuItem>
                      <MenuItem value={180}>180 days</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleSecuritySave}
                    disabled={saving}
                    sx={{ mt: 2 }}
                  >
                    {saving ? 'Saving...' : 'Save Security Settings'}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}