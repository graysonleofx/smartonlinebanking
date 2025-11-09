import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Lock, Eye, EyeOff } from 'lucide-react';
import supabase from '@/lib/supabaseClient';
import Header from '@/components/Header';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showLoginOtp, setShowLoginOtp] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [formData, setFormData] = useState({
    emailOrPhone: '',
    password: ''
  });
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (email, password) => {
    if (!email || !password) {
      // Handle empty fields
      toast({ description: 'Please fill in all fields', duration: 4000 });
      return;
    }
    if (password.length < 8) {
      toast({ description: 'Password must be at least 8 characters long', duration: 4000 });
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    const user = data?.user

    if(user) {
      // User is logged in
      setUser(user);
      localStorage.setItem('userSession', JSON.stringify(user));
      toast({ description: 'Login successful!', duration: 4000 });
      setShowLoginOtp(true);
    } else {
      const errorMsg = error?.message || "Unknown error occurred";
      toast({ description: errorMsg, duration: 4000 });
      setErrorMessage(errorMsg);
      if (error.message.includes("User not found")) {
        // Handle user not found error
        setErrorMessage("User not found. Please check your email or phone number.");
        navigate('/open-account');
      } else if (error.message.includes("Invalid login credentials")) {
        setErrorMessage("Invalid login credentials. Please try again.");
        navigate('/login');
      }
    }

    if (error) {
      toast({ description: 'Login failed. Please check your credentials.', duration: 4000 });
      return;
    }

    // const user = data?.user;
    // if (!user) {
    //   toast({ description: 'User not found', duration: 4000 });
    //   return;
    // }

    // Show OTP verification after successful login
    // setShowLoginOtp(true);
  };

  const handleOtpSubmit = () => {
    // Mock successful OTP verification and login
    const mockUserSession = {
      fullName: 'John Doe',
      email: formData.emailOrPhone,
      accountNumber: '3032410090',
      balance: 15724.25
    };
    localStorage.setItem('userSession', JSON.stringify(mockUserSession));
    setShowLoginOtp(false);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-primary">Welcome Back</CardTitle>
              <CardDescription>Sign in to your Federal Edge Finance account</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={ (e) => {
                e.preventDefault();
                handleSubmit(formData.emailOrPhone, formData.password);
              }} className="space-y-4">
                <div>
                  <Label htmlFor="emailOrPhone">Email or Phone</Label>
                  <Input
                    id="emailOrPhone"
                    name="emailOrPhone"
                    type="text"
                    required
                    value={formData.emailOrPhone}
                    onChange={handleInputChange}
                    placeholder="Enter your email or phone"
                  />
                </div>

                <div>
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter your password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-sm text-muted-foreground bg-secondary p-3 rounded-lg">
                  <Lock className="w-4 h-4" />
                  <span>Your connection is encrypted and secure</span>
                </div>

                <Button type="submit" variant="hero" className="w-full" size="lg">
                  Log In Securely
                </Button>
              </form>

              <div className="mt-6 space-y-4">
                <div className="text-center">
                  <Button variant="link" className="text-sm">
                    Forgot Password?
                  </Button>
                </div>
                
                <div className="text-center border-t pt-4">
                  <p className="text-sm text-muted-foreground mb-2">
                    Don't have an account?
                  </p>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate('/open-account')}
                  >
                    Create Account
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Login OTP Modal */}
      <Dialog open={showLoginOtp} onOpenChange={setShowLoginOtp}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Verify Login</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-center">
            <p className="text-sm text-muted-foreground">
              Enter the OTP sent to your email to access your dashboard
            </p>
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={otpValue}
                onChange={(value) => setOtpValue(value)}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
            <Button 
              className="w-full" 
              disabled={otpValue.length !== 6}
              onClick={handleOtpSubmit}
            >
              Verify & Login
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Login;