import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import AdminSidebar from '@/components/AdminSidebar';
import { useToast } from '@/hooks/use-toast';
import { 
  Settings, 
  User, 
  Lock, 
  Bell, 
  Shield,
  Save,
  Menu
} from 'lucide-react';

const AdminSettings = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { toast } = useToast();
  
  const [profileData, setProfileData] = useState({
    name: 'Admin User',
    email: 'admin@bankingsystem.com',
    role: 'System Administrator'
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    transactionAlerts: true,
    systemUpdates: true,
    securityAlerts: true
  });

  const [systemSettings, setSystemSettings] = useState({
    maintenanceMode: false,
    autoBackup: true,
    twoFactorAuth: true,
    sessionTimeout: '30'
  });

  const handleProfileUpdate = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile information has been successfully updated."
    });
  };

  const handlePasswordChange = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        variant: "destructive"
      });
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast({
        title: "Error", 
        description: "Password must be at least 8 characters long.",
        variant: "destructive"
      });
      return;
    }

    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });

    toast({
      title: "Password Changed",
      description: "Your password has been successfully updated."
    });
  };

  const handleNotificationToggle = (setting: keyof typeof notificationSettings) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleSystemToggle = (setting: keyof typeof systemSettings) => {
    if (setting === 'sessionTimeout') return;
    
    setSystemSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));

    toast({
      title: "System Setting Updated",
      description: `${setting.replace(/([A-Z])/g, ' $1').toLowerCase()} has been ${systemSettings[setting] ? 'disabled' : 'enabled'}.`
    });
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 lg:ml-0">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-border bg-card">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold">Settings</h1>
          <div className="w-10"></div>
        </div>
        
        <div className="p-4 md:p-6">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center">
            <Settings className="w-6 h-6 md:w-8 md:h-8 mr-2 md:mr-3" />
            Admin Settings
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">Manage your admin account and system preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                Profile Information
              </CardTitle>
              <CardDescription>Update your personal information and account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={profileData.name}
                  onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                  className="text-sm md:text-base"
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                  className="text-sm md:text-base"
                />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Input
                  id="role"
                  value={profileData.role}
                  disabled
                  className="text-sm md:text-base bg-muted"
                />
              </div>
              <Button onClick={handleProfileUpdate} className="w-full">
                <Save className="w-4 h-4 mr-2" />
                Update Profile
              </Button>
            </CardContent>
          </Card>

          {/* Password Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lock className="w-5 h-5 mr-2" />
                Change Password
              </CardTitle>
              <CardDescription>Update your password to keep your account secure</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="current-password">Current Password</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                  className="text-sm md:text-base"
                />
              </div>
              <div>
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                  className="text-sm md:text-base"
                />
              </div>
              <div>
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="text-sm md:text-base"
                />
              </div>
              <Button onClick={handlePasswordChange} className="w-full">
                <Lock className="w-4 h-4 mr-2" />
                Change Password
              </Button>
            </CardContent>
          </Card>

          {/* Notification Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="w-5 h-5 mr-2" />
                Notification Preferences
              </CardTitle>
              <CardDescription>Configure how you receive system notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-notifications" className="text-sm font-medium">Email Notifications</Label>
                  <p className="text-xs text-muted-foreground">Receive notifications via email</p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={notificationSettings.emailNotifications}
                  onCheckedChange={() => handleNotificationToggle('emailNotifications')}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="sms-notifications" className="text-sm font-medium">SMS Notifications</Label>
                  <p className="text-xs text-muted-foreground">Receive notifications via SMS</p>
                </div>
                <Switch
                  id="sms-notifications"
                  checked={notificationSettings.smsNotifications}
                  onCheckedChange={() => handleNotificationToggle('smsNotifications')}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="transaction-alerts" className="text-sm font-medium">Transaction Alerts</Label>
                  <p className="text-xs text-muted-foreground">Get notified about large transactions</p>
                </div>
                <Switch
                  id="transaction-alerts"
                  checked={notificationSettings.transactionAlerts}
                  onCheckedChange={() => handleNotificationToggle('transactionAlerts')}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="system-updates" className="text-sm font-medium">System Updates</Label>
                  <p className="text-xs text-muted-foreground">Receive system maintenance notifications</p>
                </div>
                <Switch
                  id="system-updates"
                  checked={notificationSettings.systemUpdates}
                  onCheckedChange={() => handleNotificationToggle('systemUpdates')}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="security-alerts" className="text-sm font-medium">Security Alerts</Label>
                  <p className="text-xs text-muted-foreground">Important security notifications</p>
                </div>
                <Switch
                  id="security-alerts"
                  checked={notificationSettings.securityAlerts}
                  onCheckedChange={() => handleNotificationToggle('securityAlerts')}
                />
              </div>
            </CardContent>
          </Card>

          {/* System Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                System Settings
              </CardTitle>
              <CardDescription>Configure system-wide settings and security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="maintenance-mode" className="text-sm font-medium">Maintenance Mode</Label>
                  <p className="text-xs text-muted-foreground">Put the system in maintenance mode</p>
                </div>
                <Switch
                  id="maintenance-mode"
                  checked={systemSettings.maintenanceMode}
                  onCheckedChange={() => handleSystemToggle('maintenanceMode')}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-backup" className="text-sm font-medium">Auto Backup</Label>
                  <p className="text-xs text-muted-foreground">Automatically backup system data</p>
                </div>
                <Switch
                  id="auto-backup"
                  checked={systemSettings.autoBackup}
                  onCheckedChange={() => handleSystemToggle('autoBackup')}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="two-factor-auth" className="text-sm font-medium">Two-Factor Authentication</Label>
                  <p className="text-xs text-muted-foreground">Require 2FA for admin access</p>
                </div>
                <Switch
                  id="two-factor-auth"
                  checked={systemSettings.twoFactorAuth}
                  onCheckedChange={() => handleSystemToggle('twoFactorAuth')}
                />
              </div>
              
              <Separator />
              
              <div>
                <Label htmlFor="session-timeout" className="text-sm font-medium">Session Timeout (minutes)</Label>
                <p className="text-xs text-muted-foreground mb-2">Auto-logout after inactivity</p>
                <Input
                  id="session-timeout"
                  type="number"
                  value={systemSettings.sessionTimeout}
                  onChange={(e) => setSystemSettings(prev => ({ ...prev, sessionTimeout: e.target.value }))}
                  className="text-sm md:text-base"
                  min="5"
                  max="120"
                />
              </div>
            </CardContent>
          </Card>
        </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;