import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { User, Save, Check } from 'lucide-react';

interface ProfileSectionProps {
  userSession: {
    fullName: string;
    email: string;
    accountNumber: string;
    balance: number;
  };
}

const ProfileSection = ({ userSession }: ProfileSectionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: userSession.fullName,
    email: userSession.email,
    phone: '+234 (0) 812 345 6789',
    address: '123 Banking Street, Lagos, Nigeria',
    dateOfBirth: '1990-01-01',
    occupation: 'Software Engineer'
  });

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Update localStorage with new full name
    const session = JSON.parse(localStorage.getItem('userSession') || '{}');
    session.fullName = profileData.fullName;
    session.email = profileData.email;
    localStorage.setItem('userSession', JSON.stringify(session));
    
    setIsSaving(false);
    setIsEditing(false);
    
    toast({
      title: "Profile Updated",
      description: "Your profile information has been successfully saved.",
    });
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <User className="h-5 w-5 md:h-6 md:w-6 text-primary" />
          <h2 className="text-xl md:text-2xl font-bold">Profile Settings</h2>
        </div>
        {!isEditing && (
          <Button variant="outline" onClick={() => setIsEditing(true)}>
            Edit Profile
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base md:text-lg">Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={profileData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                disabled={!isEditing}
                className={!isEditing ? 'bg-muted/30' : ''}
              />
            </div>

            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={profileData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                disabled={!isEditing}
                className={!isEditing ? 'bg-muted/30' : ''}
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={profileData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                disabled={!isEditing}
                className={!isEditing ? 'bg-muted/30' : ''}
              />
            </div>

            <div>
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={profileData.dateOfBirth}
                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                disabled={!isEditing}
                className={!isEditing ? 'bg-muted/30' : ''}
              />
            </div>

            <div>
              <Label htmlFor="occupation">Occupation</Label>
              <Input
                id="occupation"
                value={profileData.occupation}
                onChange={(e) => handleInputChange('occupation', e.target.value)}
                disabled={!isEditing}
                className={!isEditing ? 'bg-muted/30' : ''}
              />
            </div>

            <div>
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input
                id="accountNumber"
                value={userSession.accountNumber}
                disabled
                className="bg-muted/30"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={profileData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              disabled={!isEditing}
              className={!isEditing ? 'bg-muted/30' : ''}
            />
          </div>

          {isEditing && (
            <div className="flex space-x-3 pt-4">
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  setProfileData({
                    fullName: userSession.fullName,
                    email: userSession.email,
                    phone: '+234 (0) 812 345 6789',
                    address: '123 Banking Street, Lagos, Nigeria',
                    dateOfBirth: '1990-01-01',
                    occupation: 'Software Engineer'
                  });
                }}
                disabled={isSaving}
              >
                Cancel
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Account Security */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base md:text-lg">Account Security</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
            <div>
              <h4 className="font-medium">Two-Factor Authentication</h4>
              <p className="text-sm text-muted-foreground">
                Secure your account with SMS verification
              </p>
            </div>
            <div className="flex items-center space-x-2 text-green-600">
              <Check className="h-4 w-4" />
              <span className="text-sm font-medium">Enabled</span>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
            <div>
              <h4 className="font-medium">Email Notifications</h4>
              <p className="text-sm text-muted-foreground">
                Get notified about account activity
              </p>
            </div>
            <div className="flex items-center space-x-2 text-green-600">
              <Check className="h-4 w-4" />
              <span className="text-sm font-medium">Enabled</span>
            </div>
          </div>

          <Button variant="outline" className="w-full">
            Change Password
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSection;