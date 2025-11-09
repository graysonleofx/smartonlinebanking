import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Gift, Users, ArrowRight, Copy, Check, MessageCircle, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Referral = () => {
  const { toast } = useToast();
  const [referralCode, setReferralCode] = useState('');
  const [isCodeGenerated, setIsCodeGenerated] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const generateReferralCode = () => {
    // Get user data from localStorage if available, otherwise generate random
    const userData = JSON.parse(localStorage.getItem('userSession') || '{}');
    const accountNumber = userData.accountNumber || generateAccountNumber();
    const code = `REF-${accountNumber}`;
    setReferralCode(code);
    setIsCodeGenerated(true);
    setIsDialogOpen(true);
  };

  const generateAccountNumber = () => {
    return '3032' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralCode);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Referral code copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const shareViaWhatsApp = () => {
    const message = `Join Smart Bank with my referral code ${referralCode} and we both get $5,000! Sign up at ${window.location.origin}/open-account`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const shareViaEmail = () => {
    const subject = 'Join Federal Edge Finance and earn $5,000!';
    const body = `Hi!

      I'm inviting you to join Federal Edge Finance - Nigeria's smartest digital banking platform.

    Use my referral code: ${referralCode}

    When you sign up and make your first deposit, we both get $5,000 credited to our accounts instantly!

    Sign up here: ${window.location.origin}/open-account

    Thanks!`;
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl);
  };

  return (
    <section className="py-24 bg-gradient-hero">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center text-white space-y-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-accent mb-6">
            <Gift className="h-8 w-8 text-accent-foreground" />
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold">
            Refer & Earn{' '}
            <span className="text-transparent bg-gradient-accent bg-clip-text">
              $5,000
            </span>{' '}
            per Account
          </h2>
          
          <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
            Share Federal Edge Finance with your friends and family. For every successful referral, 
            both you and your friend get $5,000 credited to your accounts instantly.
          </p>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-12">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Share Your Link</h3>
              <p className="text-white/80">Send your unique referral link to friends</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
                <ArrowRight className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Friend Signs Up</h3>
              <p className="text-white/80">They create an account and make their first deposit</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
                <Gift className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Both Get Rewarded</h3>
              <p className="text-white/80">$5,000 credited to both accounts instantly</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="accent" 
                  size="lg" 
                  className="text-lg px-8 py-6"
                  onClick={generateReferralCode}
                >
                  Get My Referral Code
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-center">Your Referral Code</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="p-4 bg-secondary rounded-lg border-2 border-dashed border-primary/20">
                      <p className="text-2xl font-bold text-primary font-mono">{referralCode}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Button 
                      onClick={copyToClipboard} 
                      className="w-full" 
                      variant="outline"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-2" />
                          Copy Code
                        </>
                      )}
                    </Button>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <Button 
                        onClick={shareViaWhatsApp} 
                        variant="outline" 
                        className="text-green-600 border-green-600 hover:bg-green-50"
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        WhatsApp
                      </Button>
                      <Button 
                        onClick={shareViaEmail} 
                        variant="outline"
                        className="text-blue-600 border-blue-600 hover:bg-blue-50"
                      >
                        <Mail className="w-4 h-4 mr-2" />
                        Email
                      </Button>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground text-center">
                    Share this code with friends and family. When they sign up and deposit, 
                    you both get $5,000!
                  </p>
                </div>
              </DialogContent>
            </Dialog>
            <Button variant="outline-white" size="lg" className="text-lg px-8 py-6">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Referral;