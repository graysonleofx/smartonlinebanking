import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import TransactionProgress from '@/components/TransactionProgress';
import TransactionReceipt from '@/components/TransactionReceipt';
import { ArrowLeft, ArrowUpFromLine } from 'lucide-react';
import supabase from '../lib/supabaseClient';
import { sendOtp } from '../lib/sendOtp';
import { verifyOtp } from '../lib/verifyOtp';

const Withdraw = () => {
const navigate = useNavigate();
const [showOtpModal, setShowOtpModal] = useState(false);
const [showProgress, setShowProgress] = useState(false);
const [showReceipt, setShowReceipt] = useState(false);
const [otpValue, setOtpValue] = useState('');
const [userSession, setUserSession] = useState(null);
const [selectedAccount, setSelectedAccount] = useState('');
const [formData, setFormData] = useState({
  accountName: '',
  accountNumber: '',
  routingNumber: '',
  swiftCode: '',
  amount: '',
  bankName: '',
  note: '',
  fromAccount: ''
});
const [balance, setBalance] = useState({ checking: null, savings: null });

useEffect(() => {
  const session = localStorage.getItem('userSession');
  if (session) {
    setUserSession(JSON.parse(session));
  }

  const fetchBalances = async () => {
    if (session) {
      const user = JSON.parse(session);
      const { data, error } = await supabase 
        .from('accounts')
        .select('checking_account_balance, savings_account_balance')
        .eq('email', user?.email)
        // .single()

        // console.log(data);

        if(data && data.length > 0) {
          setBalance({
            checking: data[0].checking_account_balance,
            savings: data[0].savings_account_balance
          });
        } else {
          setBalance({ checking: 0, savings: 0 });
        }
        if (error) {
          console.error('Error fetching balances:', error);
        }
    }
  };

  fetchBalances();
}, []);

const handleInputChange = (field, value) => {
  setFormData(prev => ({ ...prev, [field]: value }));

  // if (field === 'amount') {
  //   const numericValue = parseFloat(value);
  //   if (selectedAccount === 'checking' && numericValue > balance.checking) {
  //     document.getElementById('amount').style.borderColor = 'red';
  //     document.getElementById('amount').style.borderWidth = '2px';

  //   } else if (selectedAccount === 'savings' && numericValue > balance.savings) {
  //     setFormData(prev => ({ ...prev, amount: balance.savings.toString() }));
  //   }
  // }
};

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!selectedAccount) return;
  if (parseFloat(formData.amount) <= 0) return;

  // Validate balance
  const amount = parseFloat(formData.amount);
  if (
    (selectedAccount === 'checking' && amount > balance.checking) ||
    (selectedAccount === 'savings' && amount > balance.savings)
  ) {
    alert('Insufficient funds.');
    document.getElementById('amount').style.borderColor = 'red';
    document.getElementById('amount').style.borderWidth = '2px';
    setShowOtpModal(false);
    setShowProgress(false);
    setShowReceipt(false);
    return;
  } else if( amount < 1 ) {
    alert('Minimum withdrawal is $1.');
    document.getElementById('amount').style.borderColor = 'red';
    document.getElementById('amount').style.borderWidth = '2px';
    setShowOtpModal(false);
    setShowProgress(false);
    setShowReceipt(false);
    return;
  } else {
    document.getElementById('amount').style.borderColor = '';
    document.getElementById('amount').style.borderWidth = '';
    // Valid submission
    console.log('Withdrawal Data:', { ...formData, fromAccount: selectedAccount, amount });

    // Save withdrawal request to DB 
    try {
      const { error } = await supabase.from('withdrawals').insert([
        {
          id: userSession?.id,
          email: userSession?.email,
          account_name: formData.accountName,
          account_number: Number(formData.accountNumber),
          bank_name: formData.bankName,
          routing_number: formData.routingNumber,
          swift_code: formData.swiftCode,
          amount: amount,
          note: formData.note,
          from_account: Number(selectedAccount),
          status: 'pending',
          created_at: new Date().toISOString()
        }
      ]);
      if (error) {
        alert('Error submitting withdrawal.');
        console.error('Error inserting withdrawal:', error.message);
        return;
      }
    } catch (err) {
      alert('Error submitting withdrawal.');
      console.error('Error submitting withdrawal:', err.message);
      return;
    }

    // Reset form
    setFormData({
      accountName: '',
      accountNumber: '',
      bankName: '',
      routingNumber: '',
      swiftCode: '',
      amount: '',
      note: '',
      fromAccount: ''
    });
    setSelectedAccount('');

    // try {
    //   // Generate a 6-digit OTP
    //   const otp = Math.floor(100000 + Math.random() * 900000).toString();
    //   const userEmail = userSession?.email;
    //   console.log('Generated OTP:', otp);

    //   // Send OTP to user email
    //   await sendOtp(userEmail, otp);

    // } catch (err) {
    //   console.error('Error sending otp email:', err.message);
    //   alert('Error sending OTP email. Please try again.');
    //   return;
    // }

      // Show OTP modal

    try {
      await sendOtp(userSession?.email);  // ✅ backend handles OTP generation
    } catch (err) {
      console.error('Error sending OTP email:', err.message);
      alert('Error sending OTP email. Please try again.');
      return;
    }

      setOtpValue('');
      setShowOtpModal(true);

    }


  };

  const handleOtpSubmit = () => {
    if (otpValue.length !== 6) {
      alert('Please enter a valid 6-digit OTP.');
      return;
    }
    // Verify OTP
    verifyOtp(userSession?.email, otpValue)
      .then((res) => {
        if (res.success) {
          // OTP verified
          proceedToProgress();
        } else {
          alert(res.message || 'Invalid OTP. Please try again.');
        }
      })
      .catch((err) => {
        console.error('Error verifying OTP:', err.message);
        alert('Error verifying OTP. Please try again.');
      });
  };

  const proceedToProgress = () => {
    setShowOtpModal(false);
    setShowProgress(true);
  };

  const handleProgressComplete = () => {
    setShowProgress(false);
    setShowReceipt(true);
  };

  const handleReceiptClose = () => {
    setShowReceipt(false);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b px-4 py-4 flex items-center">
        <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="ml-3 text-lg font-semibold text-foreground">Withdraw Funds</h1>
      </header>

      {/* Form */}
      <div className="p-4 pb-24">
        {showProgress ? (
          <TransactionProgress type="withdrawal" onComplete={handleProgressComplete} />
        ) : showReceipt ? (
          <TransactionReceipt 
            type="withdrawal" 
            formData={formData} 
            onClose={handleReceiptClose} 
          />
        ) : (
          <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowUpFromLine className="h-5 w-5 text-primary" />
              Withdraw to Bank
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="accountName">Account Name</Label>
                  <Input
                    id="accountName"
                    placeholder="Your full name"
                    value={formData.accountName}
                    onChange={(e) => handleInputChange('accountName', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <Input
                    id="accountNumber"
                    placeholder="1234567890"
                    value={formData.accountNumber}
                    onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="bankName">Bank Name</Label>
                  <Input
                    id="bankName"
                    placeholder="Bank name"
                    value={formData.bankName}
                    onChange={(e) => handleInputChange('bankName', e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="routingNumber">Routing Number</Label>
                    <Input
                      id="routingNumber"
                      placeholder="021000021"
                      value={formData.routingNumber}
                      onChange={(e) => handleInputChange('routingNumber', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="swiftCode">SWIFT Code</Label>
                    <Input
                      id="swiftCode"
                      placeholder="ABCDUS33"
                      value={formData.swiftCode}
                      onChange={(e) => handleInputChange('swiftCode', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="fromAccount">Withdraw From</Label>
                  <Select value={selectedAccount} onValueChange={setSelectedAccount} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select account" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="checking">
                        Checking Account - ${balance?.checking || '0'}
                      </SelectItem>
                      <SelectItem value="savings">
                        Savings Account - ${balance?.savings || '0'}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="amount">Amount ($)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => handleInputChange('amount', e.target.value)}
                    required
                  />
                  {selectedAccount && (
                    <p className="text-xs text-muted-foreground mt-1  selected-acc-bal">
                      Available: ${selectedAccount === 'checking' 
                        ? balance?.checking?.toLocaleString() 
                        : balance?.savings?.toLocaleString()}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="note">Note (Optional)</Label>
                  <Textarea
                    id="note"
                    placeholder="Withdrawal description..."
                    value={formData.note}
                    onChange={(e) => handleInputChange('note', e.target.value)}
                    rows={3}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={!selectedAccount}>
                Continue Withdrawal
              </Button>
            </form>
          </CardContent>
        </Card>
        )}
      </div>

      {/* OTP Modal */}
      <Dialog open={showOtpModal} onOpenChange={setShowOtpModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Verify Withdrawal</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-center">
            <p className="text-sm text-muted-foreground">
              Enter the OTP sent to your email to confirm this withdrawal
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
              Confirm Withdrawal
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Withdraw;