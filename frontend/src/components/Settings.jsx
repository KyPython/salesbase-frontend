import React, { useState } from 'react';
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
  Alert
} from '@mui/material';
import {
  Person as PersonIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Save as SaveIcon
} from '@mui/icons-material';

export default function Settings() {
  const [activeTab, setActiveTab] = useState(0);
  const [profileData, setProfileData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@salesbase.com',
    role: 'Sales Manager',
    phone: '+1 (555) 123-4567'
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

  const [saveStatus, setSaveStatus] = useState('');

  const handleProfileSave = (e) => {
    e.preventDefault();
    setSaveStatus('success');
    setTimeout(() => setSaveStatus(''), 3000);
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

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>

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
                    >
                      <MenuItem value="Sales Rep">Sales Rep</MenuItem>
                      <MenuItem value="Sales Manager">Sales Manager</MenuItem>
                      <MenuItem value="Account Manager">Account Manager</MenuItem>
                      <MenuItem value="Admin">Admin</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<SaveIcon />}
                    sx={{ mt: 2 }}
                  >
                    Save Profile
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
                      />
                    }
                    label="Two-Factor Authentication"
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
              </Grid>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}