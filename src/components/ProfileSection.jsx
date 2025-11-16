import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { User, Save, Check } from 'lucide-react';
import supabase from '@/lib/supabaseClient';

const ProfileSection = ({ userSession }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    dateOfBirth: "",
    occupation: ""
  });
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  // useEffect(() => {
  //   if (!userSession?.id) return;
  //   let mounted = true;

  //   (async () => {
  //     setIsLoadingProfile(true);
  //     const { data, error } = await supabase
  //       .from('accounts')
  //       .select('full_name, email, phone, address, date_of_birth, occupation')
  //       .eq('id', userSession.id)
  //       .single();

  //     setIsLoadingProfile(false);

  //     if (error) {
  //       toast({
  //         title: 'Failed to load profile',
  //         description: error.message || 'Unable to fetch profile from server.'
  //       });
  //       return;
  //     }

  //     if (!mounted || !data) return;

  //     setProfileData({
  //       fullName: data.full_name || "",
  //       email: data.email || "",
  //       phone: data.phone || "",
  //       address: data.address || "",
  //       dateOfBirth: data.date_of_birth || "",
  //       occupation: data.occupation || ""
  //     });
  //   })();

  //   return () => {
  //     mounted = false;
  //   };
  // }, [userSession?.id]);


  useEffect(() => {
    let mounted = true;

    const fetchProfile = async () => {
      setIsLoadingProfile(true);

      // Get current logged-in user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        console.log("No logged-in user found");
        setIsLoadingProfile(false);
        return;
      }

      // Fetch profile from accounts table
      const { data, error } = await supabase
        .from('accounts')
        .select('id, full_name, email, phone, address, date_of_birth, occupation')
        .eq('id', user.id)
        .single();

      setIsLoadingProfile(false);

      if (error || !data) {
        toast({
          title: 'Failed to load profile',
          description: error?.message || 'Unable to fetch profile from server.'
        });
        return;
      }

      if (!mounted) return;

      setProfileData({
        fullName: data.full_name || "",
        email: data.email || "",
        phone: data.phone || "",
        address: data.address || "",
        dateOfBirth: data.date_of_birth || "",
        occupation: data.occupation || ""
      });

      // Save a copy to revert on cancel
      setOriginalProfile({ ...data, fullName: data.full_name });
    };

    fetchProfile();

    return () => {
      mounted = false;
    };
  }, []);

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  // const handleSave = async () => {
  //   setIsSaving(true);
    
  //   // Update supabase with new full name
  //   const {data, error } = await supabase
  //     .from('accounts')
  //     .update({
  //       full_name: profileData.fullName,
  //       email: profileData.email,
  //       phone: profileData.phone,
  //       address: profileData.address,
  //       date_of_birth: profileData.dateOfBirth,
  //       occupation: profileData.occupation
  //     })
  //     .eq('id', userSession.id);

  //     if (data) {
  //       toast({
  //         title: "Profile Updated",
  //         description: "Your profile information has been successfully saved.",
  //       });
  //     }

  //   if (error) {
  //     toast({
  //       title: "Error Updating Profile",
  //       description: "There was an error updating your profile information.",
  //     });
  //     setIsSaving(false);
  //     return;
  //   }

  //   setIsSaving(false);
  //   setIsEditing(false);
    
  //   toast({
  //     title: "Profile Updated",
  //     description: "Your profile information has been successfully saved.",
  //   });
  // };


  const handleSave = async () => {
    setIsSaving(true);

    // First fetch the actual row to get the DB id
    const { data: row, error: fetchError } = await supabase
      .from("accounts")
      .select("id")
      .eq("email", profileData.email)
      .single();

    if (fetchError || !row) {
      toast({
        title: "User not found",
        description: "Could not find your profile in database.",
      });
      setIsSaving(false);
      return;
    }

    const userId = row.id;

    // Now update using the correct id
    const { error } = await supabase
      .from("accounts")
      .update({
        full_name: profileData.fullName,
        email: profileData.email,
        phone: profileData.phone,
        address: profileData.address,
        date_of_birth: profileData.dateOfBirth,
        occupation: profileData.occupation
      })
      .eq("id", userId);

    if (error) {
      toast({
        title: "Error Updating Profile",
        description: error.message,
      });
    } else {
      toast({
        title: "Profile Updated",
        description: "Your profile information has been successfully saved.",
      });
      setIsEditing(false);
    }

    setIsSaving(false);
  };


  const [originalProfile, setOriginalProfile] = useState(null);

  // Capture the fetched profile as the "original" so we can revert on cancel
  useEffect(() => {
    // Only set originalProfile once after the fetch populates profileData
    const hasAnyValue =
      profileData.fullName ||
      profileData.email ||
      profileData.phone ||
      profileData.address ||
      profileData.dateOfBirth ||
      profileData.occupation;

    if (!originalProfile && hasAnyValue) {
      setOriginalProfile({ ...profileData });
    }
  }, [profileData, originalProfile]);

  // After a successful save (isEditing becomes false and not saving), update the original snapshot
  useEffect(() => {
    if (!isEditing && !isSaving && originalProfile) {
      const same =
        originalProfile.fullName === profileData.fullName &&
        originalProfile.email === profileData.email &&
        originalProfile.phone === profileData.phone &&
        originalProfile.address === profileData.address &&
        originalProfile.dateOfBirth === profileData.dateOfBirth &&
        originalProfile.occupation === profileData.occupation;

      if (!same) {
        setOriginalProfile({ ...profileData });
      }
    }
  }, [isEditing, isSaving, profileData, originalProfile]);

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
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={profileData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                disabled={!isEditing}
                className={!isEditing ? 'bg-muted/30' : ''}
              />
            </div>
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
                  if (originalProfile) {
                    setProfileData({ ...originalProfile });
                  } else {
                    // fallback to userSession values if originalProfile not available
                    setProfileData({
                      fullName: userSession.fullName || "",
                      email: userSession.email || "",
                      phone: userSession.phone || "",
                      address: userSession.address || "",
                      dateOfBirth: userSession.dateOfBirth || "",
                      occupation: userSession.occupation || ""
                    });
                  }
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