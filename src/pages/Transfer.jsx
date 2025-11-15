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
import { ArrowLeft, Send } from 'lucide-react';
import  supabase from '@/lib/supabaseClient';
import { sendOtp } from '../lib/sendOtp';
import { verifyOtp } from '../lib/verifyOtp';

const Transfer = () => {
  const navigate = useNavigate();
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [userSession, setUserSession] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [receiptData, setReceiptData] = useState(null);
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

        // console.log(data)

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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAccount) return;
    if (parseFloat(formData.amount) <= 0) return;

    // Show loading state

    // Validate balance
    const amount = parseFloat(formData.amount);
    if (
      (selectedAccount === 'checking' && amount > balance.checking) ||
      (selectedAccount === 'savings' && amount > balance.savings)
    ) {
      alert('Insufficient funds in the selected account.');
      document.getElementById('amount').style.borderColor = 'red';
      document.getElementById('amount').style.borderWidth = '2px';
      setShowOtpModal(false);
      setShowProgress(false);
      setShowReceipt(false);
      return;
    } else if (amount < 10) {
      alert('Minimum transfer amount is $10.');
      document.getElementById('amount').style.borderColor = 'red';
      document.getElementById('amount').style.borderWidth = '2px';
      setShowOtpModal(false);
      setShowProgress(false);
      setShowReceipt(false);
      return;
    } else {
      document.getElementById('proceedTransferBtn').disabled = true;
      document.getElementById('proceedTransferBtn').textContent = 'Please wait...';
      document.getElementById('amount').style.borderColor = '';
      document.getElementById('amount').style.borderWidth = '';

      // Send OTP and show modal
      try {
        const sendRes = await sendOtp(userSession.email);
        console.log('OTP sent:', sendRes);
       
        if (!sendRes.success) {
          alert(sendRes.message || 'Failed to send OTP. Please try again.');
          return
        }

        setOtpValue('');
        setShowOtpModal(true);
      } catch (error) {
        console.error('Error sending OTP:', error);
        alert('Failed to send OTP. Please try again.');
      }

      setOtpValue('');
      setShowOtpModal(true);
    }

  }

  const handleOtpSubmit = async () => {
   if (otpValue.length !== 6) {
      alert('Please enter a valid 6-digit OTP.');
      return;
    }

    if (!userSession?.email) {
      alert('User session not found. Please login again.');
      return;
    }

    try {
      const verifyRes = await verifyOtp(userSession.email, otpValue);

      if (!verifyRes.success) {
        alert(verifyRes.message || 'OTP verification failed. Please try again.');
        return;
      }

      const amount = parseFloat(formData.amount);

      // insert transaction and update balance
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert([{
          email: userSession.email,
          account_name: formData.accountName,
          account_number: formData.accountNumber?.trim(),
          routing_number: formData.routingNumber?.trim(),
          swift_code: formData.swiftCode?.trim(),
          bank_name: formData.bankName,
          amount: amount,
          note: formData.note,
          from_account: selectedAccount,
          type: 'Transfer',
          status: 'completed',
          created_at: new Date().toISOString(),
          date: new Date().toLocaleDateString(),
        }]);

      if (transactionError) throw transactionError;
      
      // Update account balance
      const newBalance = { 
        ...balance, 
        [selectedAccount]: balance[selectedAccount] - amount
      };

      const email = userSession.email.trim().toLowerCase();

      const {data: updateData, error: updateError } = await supabase
        .from('accounts')
        .update({
          checking_account_balance: newBalance.checking,
          savings_account_balance: newBalance.savings
        }, { returning: 'representation' })
        .eq('email', email);

      if (updateError) throw updateError;

      setBalance(newBalance);

      setReceiptData({
        accountName: formData.accountName,
        accountNumber: formData.accountNumber,
        bankName: formData.bankName,
        routingNumber: formData.routingNumber,
        swiftCode: formData.swiftCode,
        amount: amount,
        note: formData.note,
        fromAccount: selectedAccount
      });

      setFormData({
        accountName: '',
        accountNumber: '',
        routingNumber: '',
        swiftCode: '',
        bankName: '',
        amount: '',
        note: '',
        fromAccount: ''
      });

      setSelectedAccount('');

      proceedToProgress();
      setTimeout(() => {
        setShowOtpModal(false);
        setShowProgress(true);
      }, 3000);
    } catch (error) {
      console.error('Error processing transfer:', error);
      alert('Failed to process transfer. Please try again.');
    }
  }

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
        <h1 className="ml-3 text-lg font-semibold text-foreground">Transfer Money</h1>
      </header>

      {/* Form */}
      <div className="p-4 pb-24">
        {showProgress ? (
          <TransactionProgress type="transfer" onComplete={handleProgressComplete} />
        ) : showReceipt ? (
           <TransactionReceipt 
            type="withdrawal" 
            formData={receiptData} 
            onClose={handleReceiptClose}
          />
        ) : (
          <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5 text-primary" />
              Send Money
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="accountName">Account Name</Label>
                  <Input
                    id="accountName"
                    placeholder="Recipient's full name"
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
                  <Label htmlFor="fromAccount">Transfer From</Label>
                  <Select value={selectedAccount} onValueChange={setSelectedAccount} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select account" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="checking">
                        Checking Account - ${balance?.checking?.toLocaleString() || '0'}
                      </SelectItem>
                      <SelectItem value="savings">
                        Savings Account - ${balance?.savings?.toLocaleString() || '0'}
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
                    placeholder="Payment description..."
                    value={formData.note}
                    onChange={(e) => handleInputChange('note', e.target.value)}
                    rows={3}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={!selectedAccount} id="proceedTransferBtn">
                Proceed to Transfer
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
            <DialogTitle>Verify Transfer</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-center">
            <p className="text-sm text-muted-foreground">
              Enter the OTP sent to your email to confirm this transfer
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
              Confirm Transfer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Transfer;