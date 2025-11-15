import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import ProfileSection from '@/components/ProfileSection.jsx';
import SupportSection from '@/components/SupportSection';
import { useToast } from '@/hooks/use-toast';
import { Home, CreditCard, ArrowDownToLine, ArrowUpFromLine, Send, User, HelpCircle, LogOut, Bell, Eye, EyeOff, Gift, Settings, Copy, Check } from 'lucide-react';
import supabase from  '../lib/supabaseClient';
import { data } from 'autoprefixer';
const Dashboard = () => {
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const [userSession, setUserSession] = useState(null);
  const [showBalance, setShowBalance] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawAccount, setWithdrawAccount] = useState('');
  const [otpValue, setOtpValue] = useState('');
  const [copied, setCopied] = useState('');
  const [showReferralCard, setShowReferralCard] = useState(false);
  const [referralCodeCopied, setReferralCodeCopied] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState({
    checking: null,
    savings: null
  });
  const [userName, setUserName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');

  useEffect(() => {
    const fetchBalances = async() => {
      try {
        const session = localStorage.getItem('userSession');
        if (!session) {
          navigate('/login');
          return;
        } else {
          setUserSession(JSON.parse(session));
        }

        const user = JSON.parse(session);
        //  console.log(user);
        const {data, error} = await supabase 
          .from('accounts')
          .select('checking_account_balance, savings_account_balance')
          .eq('email', user?.email)
          // .single()

        // if (!data) {
        //   console.log('No data found');
        //   return;
        // }

        // console.log(data)

        if (data && data.length > 0) {
          setBalance({
            checking_account_balance: data[0].checking_account_balance,
            savings_account_balance: data[0].savings_account_balance
          });
        }

        // console.log(data);
        // console.log(user?.email)
        if(error){
          console.error('Error fetching balances', error.message);
        } else{
          console.log('Balances fetched successfully');
        }
        return data;
      } catch (error) {
        console.error('Error fetching balances', error.message);
        return null;
      } finally {
        setLoading(false);
      }
    };

    const fetchName = async() => {
      try {
        const session = localStorage.getItem('userSession');
        if (!session) {
          navigate('/login');
          return;
        } else {
          setUserSession(JSON.parse(session));
        }

        const user = JSON.parse(session);
        const {data, error} = await supabase
          .from('accounts')
          .select('full_name')
          .eq('email', user?.email)
          .single();

        if (data) {
          setUserName(data.full_name);
        }

        if (error) {
          console.error('Error fetching user name', error.message);
        }
      } catch (error) {
        console.error('Error fetching user name', error.message);
      }
    };

    const fetchAccountNumber = async() => {
      try {
        const session = localStorage.getItem('userSession');
        if (!session) {
          navigate('/login');
          return;
        } else {
          setUserSession(JSON.parse(session));
        }

        const user = JSON.parse(session);
        const {data, error} = await supabase
          .from('accounts')
          .select('account_number')
          .eq('email', user?.email)
          .single();

        if (data) {
          setAccountNumber(data.account_number);
        }

        if (error) {
          console.error('Error fetching account number', error.message);
        }
      } catch (error) {
        console.error('Error fetching account number', error.message);
      }
    };

    const fetchTransactions = async () => {
    try {
      const session = localStorage.getItem('userSession');
      if (!session) return;

      const user = JSON.parse(session);

      const { data, error } = await supabase
        .from('transactions') // your table name
        .select('*')
        .eq('email', user.email)
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching transactions:', error.message);
        return;
      }

      if (data) {
        setTransactions(data);
      }
    } catch (err) {
      console.error('Fetch transactions error:', err.message);
    }
  };


    fetchBalances();
    fetchTransactions();
    setBalance(data[0]);
    fetchName();
    fetchAccountNumber();

    // const sessionData = JSON.parse(session);
    // // Initialize separate account balances if not present
    // if (!sessionData.checkingBalance && !sessionData.savingsBalance) {
    //   sessionData.checkingBalance = sessionData.checkingBalance * 0.7; // 70% in checking
    //   sessionData.savingsBalance = sessionData.savingsBalance * 0.3; // 30% in savings
    //   localStorage.setItem('userSession', JSON.stringify(sessionData));
    // }
    // setUserSession(sessionData);
  }, []);
  const handleLogout = () => {
    localStorage.removeItem('userSession');
    navigate('/');
  };
  const handleDepositClick = () => {
    setActiveTab('deposit');
    setShowDepositModal(true);
  };
  const handleWithdrawClick = () => {
    setActiveTab('withdraw');
    setShowWithdrawModal(true);
  };
  const handleWithdrawSubmit = () => {
    setShowWithdrawModal(false);
    setShowOtpModal(true);
  };
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(''), 2000);
  };
  const handleReferralCodeCopy = () => {
    const referralCode = `REF-${userSession.accountNumber}`;
    navigator.clipboard.writeText(referralCode);
    setReferralCodeCopied(true);
    toast({
      title: "Referral code copied!",
      description: "Share it with friends to earn $5,000 each"
    });
    setTimeout(() => setReferralCodeCopied(false), 2000);
  };
  const bankDetails = {
    accountName: "Smart Digital Bank",
    accountNumber: "3032410090",
    bankName: "Federal Edge Finance Bank",
    routingNumber: "021000021"
  };
  const mockTransactions = [{
    id: 1,
    type: 'Credit',
    description: 'Initial Deposit',
    amount: 15750.00,
    date: '2024-01-15',
    status: 'Completed'
  }, {
    id: 2,
    type: 'Debit',
    description: 'Online Purchase',
    amount: -25.99,
    date: '2024-01-14',
    status: 'Completed'
  }, {
    id: 3,
    type: 'Credit',
    description: 'Referral Bonus',
    amount: 5000.00,
    date: '2024-01-13',
    status: 'Completed'
  }];
  const sidebarItems = [{
    id: 'home',
    label: 'Home',
    icon: Home
  }, {
    id: 'transactions',
    label: 'Transactions',
    icon: CreditCard
  }, {
    id: 'deposit',
    label: 'Deposit',
    icon: ArrowDownToLine
  }, {
    id: 'withdraw',
    label: 'Withdraw',
    icon: ArrowUpFromLine
  }, {
    id: 'profile',
    label: 'Profile',
    icon: User
  }, {
    id: 'support',
    label: 'Support',
    icon: HelpCircle
  }];
  const bottomNavItems = [{
    id: 'home',
    label: 'Dashboard',
    icon: Home
  }, {
    id: 'deposit',
    label: 'Deposit',
    icon: ArrowDownToLine,
    action: handleDepositClick
  }, {
    id: 'withdraw',
    label: 'Withdraw',
    icon: ArrowUpFromLine,
    action: () => navigate('/withdraw')
  }, {
      id: 'transactions',
      label: 'Transactions',
      icon: CreditCard,
      action: () => setActiveTab('transactions')
    } , {
      id: 'profile',
      label: 'Profile',
      icon: User
    }, {
      id: 'support',
      label: 'Support',
      icon: HelpCircle
    }
  ];
  if (!userSession) {
    return <div>Loading...</div>;
  }
  // const checking = balance?.checking_account_balance  ?? 0;
  // const savings = balance?.savings_account_balance  ?? 0;
  return(
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      {/* Top Bar */}
      <header className="bg-card border-b px-4 py-3 md:py-4 flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <h1 className="text-base md:text-xl font-semibold text-primary truncate">Welcome back, {userName.split(' ')[0]}!</h1>
          <p className="text-xs md:text-sm text-muted-foreground">Account: {accountNumber}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="h-8 w-8 md:h-10 md:w-10">
            <Bell className="h-4 w-4 md:h-5 md:w-5" />
          </Button>
          <Button variant="ghost" onClick={handleLogout} className="hidden md:flex">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-64 bg-card border-r min-h-screen p-4">
          <div className="space-y-2">
            {sidebarItems.map(item => <Button key={item.id} variant={activeTab === item.id ? "secondary" : "ghost"} className="w-full justify-start" onClick={() => setActiveTab(item.id)}>
                <item.icon className="h-4 w-4 mr-2" />
                {item.label}
              </Button>)}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-3 md:p-6 max-w-full overflow-x-hidden">
          {activeTab === 'home' && <div className="space-y-4 md:space-y-6">
              {/* Referral Stats */}
              

              {/* Account Balances */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base md:text-lg">Checking Account</CardTitle>
                        <CardDescription className="text-xs md:text-sm">Daily spending</CardDescription>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => setShowBalance(!showBalance)}>
                        {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="text-xl md:text-2xl font-bold text-primary">
                      {showBalance ? `$${balance?.checking_account_balance?.toLocaleString() || 0}` : '••••••'}
                    </div>
                  </CardContent> 
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base md:text-lg">Savings Account</CardTitle>
                        <CardDescription className="text-xs md:text-sm">Long-term savings</CardDescription>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => setShowBalance(!showBalance)}>
                        {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="text-xl md:text-2xl font-bold text-primary">
                      {showBalance ? `$${balance?.savings_account_balance?.toLocaleString() || 0}` : '••••••'}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 md:grid-cols-2 gap-3 md:gap-4">
                <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={handleDepositClick}>
                  <CardContent className="p-3 md:p-6 text-center">
                    <ArrowDownToLine className="h-6 w-6 md:h-8 md:w-8 mx-auto mb-2 text-banking-blue" />
                    <h3 className="text-sm md:text-base font-semibold">Deposit</h3>
                    <p className="text-xs md:text-sm text-muted-foreground">Add money</p>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/withdraw')}>
                  <CardContent className="p-3 md:p-6 text-center">
                    <ArrowUpFromLine className="h-6 w-6 md:h-8 md:w-8 mx-auto mb-2 text-banking-orange" />
                    <h3 className="text-sm md:text-base font-semibold">Withdraw</h3>
                    <p className="text-xs md:text-sm text-muted-foreground">Transfer out</p>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md transition-shadow col-span-2 md:col-span-1" onClick={() => navigate('/transfer')}>
                  <CardContent className="p-3 md:p-6 text-center">
                    <Send className="h-6 w-6 md:h-8 md:w-8 mx-auto mb-2 text-primary" />
                    <h3 className="text-sm md:text-base font-semibold">Transfer</h3>
                    <p className="text-xs md:text-sm text-muted-foreground">Send money</p>
                  </CardContent>
                </Card>
              </div>

              {/* Virtual Card Display */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base md:text-lg">Your Virtual Card</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gradient-primary p-4 md:p-6 rounded-lg text-white">
                    <div className="flex justify-between items-start mb-6 md:mb-8">
                      <div>
                        <p className="text-sm opacity-80">Federal Edge Finance</p>
                        <p className="text-xs opacity-60">Virtual Debit Card</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">••••</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-base md:text-lg font-mono">•••• •••• •••• {accountNumber ? String(accountNumber).slice(-4) : 'XXXX'}</p>
                      <div className="flex justify-between">
                        <div>
                          <p className="text-xs opacity-60">CARDHOLDER</p>
                          <p className="text-sm md:text-base font-semibold">{userName.toUpperCase()}</p>
                        </div>
                        <div>
                          <p className="text-xs opacity-60">EXPIRES</p>
                          <p className="text-sm md:text-base font-semibold">12/27</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Transactions */}
              <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base md:text-lg">Recent Transactions</CardTitle>
                <CardDescription className="text-xs md:text-sm">Your latest account activity</CardDescription>
              </CardHeader>
              <CardContent>
                {transactions.length === 0 ? (
                <div className="py-6 text-center text-sm text-muted-foreground">No transactions yet</div>
                ) : (
                <div className="overflow-x-auto">
                <Table>
                <TableHeader>
                  <TableRow>
                  <TableHead className="text-xs md:text-sm">Description</TableHead>
                  <TableHead className="text-xs md:text-sm">Amount</TableHead>
                  <TableHead className="text-xs md:text-sm hidden md:table-cell">Date</TableHead>
                  <TableHead className="text-xs md:text-sm">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.slice(0, 5).map(transaction => {
                    // normalize type for reliable matching
                    const type = (transaction.type || '').toLowerCase();
                    const positiveTypes = ['credit', 'deposit'];
                    const negativeTypes = ['debit', 'withdraw', 'withdrawal', 'transfer'];
                    const sign = positiveTypes.includes(type) ? '+' : (negativeTypes.includes(type) ? '-' : (transaction.amount > 0 ? '+' : '-'));
                    const colorClass = sign === '+' ? 'text-banking-blue' : 'text-banking-orange';
                    return (
                      <TableRow key={transaction.id}>
                        <TableCell className="text-xs md:text-sm">{transaction.note}</TableCell>
                        <TableCell className={`text-xs md:text-sm ${colorClass}`}>
                        {sign}${Math.abs(transaction.amount).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-xs md:text-sm hidden md:table-cell">{transaction.date}</TableCell>
                        <TableCell>
                        <Badge variant="secondary" className="text-xs">{transaction.status}</Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
                </Table>
                </div>
                )}
              </CardContent>
              </Card>

              {/* Referral Widget */}
              <Card>
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center space-x-3 md:space-x-4">
                    <Gift className="h-6 w-6 md:h-8 md:w-8 text-accent flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm md:text-base font-semibold">Refer a friend, earn $5,000</h3>
                      <p className="text-xs md:text-sm text-muted-foreground">Share your referral code and earn rewards</p>
                    </div>
                    <Button variant="outline" size="sm" className="text-xs md:text-sm" onClick={() => setShowReferralCard(!showReferralCard)}>
                      Share Code
                    </Button>
                  </div>
                  
                  {/* Referral Program Card - Shows at bottom when Share Code is clicked */}
                  {showReferralCard && <div className="mt-6 p-4 bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/10 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-background rounded-lg">
                      <p className="text-lg font-bold text-primary font-mono">REF-{userSession.accountNumber}</p>
                      <p className="text-xs text-muted-foreground">Referral Code</p>
                    </div>
                    <div className="text-center p-3 bg-background rounded-lg">
                      <p className="text-lg font-bold text-primary">3</p>
                      <p className="text-xs text-muted-foreground">People Referred</p>
                    </div>
                    <div className="text-center p-3 bg-background rounded-lg">
                      <p className="text-lg font-bold text-accent">$15,000</p>
                      <p className="text-xs text-muted-foreground">Total Earnings</p>
                    </div>
                    <div className="flex items-center justify-center">
                      <Button onClick={handleReferralCodeCopy} variant="outline" size="sm" className="w-full">
                      {referralCodeCopied ? <>
                        <Check className="w-4 h-4 mr-2" />
                        Copied!
                        </> : <>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Code
                        </>}
                      </Button>
                    </div>
                    </div>
                    {referralCodeCopied && <div className="mt-3 text-center">
                      <p className="text-sm text-primary font-medium">Referral code copied!</p>
                    </div>}
                  </div>}
                </CardContent>
              </Card>
            </div>}

          {activeTab === 'transactions' && <div className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold">Transaction History</h2>
            <Card>
            {transactions.length === 0 ? (
              <CardContent className="p-4 md:p-6">
              <p className="text-sm text-muted-foreground">No transactions found</p>
              </CardContent>
            ) : (
              <CardContent className="p-4 md:p-6">
              <div className="overflow-x-auto">
                <Table>
                <TableHeader>
                  <TableRow>
                  <TableHead className="text-xs md:text-sm">Date</TableHead>
                  <TableHead className="text-xs md:text-sm">Description</TableHead>
                  <TableHead className="text-xs md:text-sm hidden md:table-cell">Type</TableHead>
                  <TableHead className="text-xs md:text-sm">Amount</TableHead>
                  <TableHead className="text-xs md:text-sm">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map(transaction => {
                    const type = (transaction.type || '').toLowerCase();
                    const positiveTypes = ['credit', 'deposit'];
                    const negativeTypes = ['debit', 'withdraw', 'withdrawal', 'transfer'];
                    const sign = positiveTypes.includes(type) ? '+' : (negativeTypes.includes(type) ? '-' : (transaction.amount > 0 ? '+' : '-'));
                    const colorClass = sign === '+' ? 'text-banking-blue' : 'text-banking-orange';
                    return (
                      <TableRow key={transaction.id}>
                        <TableCell className="text-xs md:text-sm">{transaction.date}</TableCell>
                        <TableCell className="text-xs md:text-sm">{transaction.note}</TableCell>
                        <TableCell className="text-xs md:text-sm hidden md:table-cell">
                          <Badge variant={transaction.type === 'Credit' ? 'default' : 'secondary'} className="text-xs">
                          {transaction.type}
                          </Badge>
                        </TableCell>
                        <TableCell className={`text-xs md:text-sm ${colorClass}`}>
                          {sign}${Math.abs(transaction.amount).toLocaleString()} 
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="text-xs">{transaction.status}</Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })} 
                </TableBody>
                </Table>
              </div>
              </CardContent>
            )}
            </Card>
          </div>}

          {activeTab === 'deposit' && <div className="space-y-4 md:space-y-6">
            <div className="flex items-center space-x-2 mb-4">
            <ArrowDownToLine className="h-5 w-5 md:h-6 md:w-6 text-banking-blue" />
            <h2 className="text-xl md:text-2xl font-bold">Deposit Funds</h2>
            </div>
                        
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base md:text-lg">Wire Transfer Information</CardTitle>
                <CardDescription className="text-xs md:text-sm">
                Use the details below to transfer funds to your account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border">
                  <div className="flex-1">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wide">Account Name</Label>
                  <p className="font-semibold text-sm md:text-base">{userName}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => handleCopy(bankDetails.accountName, 'name')}>
                  {copied === 'name' ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border">
                  <div className="flex-1">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wide">Account Number</Label>
                  <p className="font-semibold text-sm md:text-base font-mono">{accountNumber}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => handleCopy(bankDetails.accountNumber, 'account')}>
                  {copied === 'account' ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border">
                  <div className="flex-1">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wide">Bank Name</Label>
                  <p className="font-semibold text-sm md:text-base">{bankDetails.bankName}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => handleCopy(bankDetails.bankName, 'bank')}>
                  {copied === 'bank' ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border">
                  <div className="flex-1">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wide">Routing Number</Label>
                  <p className="font-semibold text-sm md:text-base font-mono">{bankDetails.routingNumber}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => handleCopy(bankDetails.routingNumber, 'routing')}>
                  {copied === 'routing' ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border">
                  <div className="flex-1">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wide">SWIFT Code</Label>
                  <p className="font-semibold text-sm md:text-base font-mono">FANBUS33</p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => handleCopy('FANBUS33', 'swift')}>
                  {copied === 'swift' ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                
                <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wide">Reference Note</Label>
                  <p className="font-semibold text-sm md:text-base text-primary">
                  Deposit to Account: {accountNumber}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                  Include this reference in your transfer
                  </p>
                </div>
                </div>
                
                <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
                <div className="flex items-start space-x-2">
                  <div className="w-4 h-4 rounded-full bg-amber-500 mt-0.5 shrink-0"></div>
                  <div>
                  <p className="text-sm font-medium text-amber-800 dark:text-amber-200">Important Instructions</p>
                  <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                    Transfer funds to the account above and click "I've Sent It" to notify us. 
                    Processing typically takes 1-3 business days.
                  </p>
                  </div>
                </div>
                </div>
                
                {/* <Button className="w-full mt-4" size="lg">
                I've Sent It
                </Button> */}
              </CardContent>
            </Card>
          </div>}

          {activeTab === 'withdraw' && <div className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold">Withdraw Funds</h2>
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground">
                  Use the mobile withdraw option or visit our dedicated withdraw page for a better experience.
                </p>
                <Button onClick={() => navigate('/withdraw')} className="mt-4">
                  Go to Withdraw Page
                </Button>
              </CardContent>
            </Card>
          </div>}

          {activeTab === 'profile' && <ProfileSection userSession={userSession} />}

          {activeTab === 'support' && <SupportSection />}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 safe-area-pb">
        <div className="flex items-center justify-around py-2 px-1">
          {bottomNavItems.map(item => <Button key={item.id} variant="ghost" className={`flex flex-col items-center gap-1 h-auto py-2 px-2 min-w-0 flex-1 ${activeTab === item.id ? 'text-primary bg-primary/10' : 'text-muted-foreground'}`} onClick={() => item.action ? item.action() : setActiveTab(item.id)}>
              <item.icon className="h-5 w-5 flex-shrink-0" />
              <span className="text-xs leading-tight">{item.label}</span>
            </Button>)}
        </div>
      </nav>

      {/* Deposit Modal */}
      <Dialog open={showDepositModal} onOpenChange={setShowDepositModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Wire Transfer Information</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Transfer money to the account below and click "I've Sent It" to notify us.
            </p>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <Label className="text-xs text-muted-foreground">Account Name</Label>
                  <p className="font-medium">{userName}</p> 
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleCopy(bankDetails.accountName, 'name')}>
                  {copied === 'name' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <Label className="text-xs text-muted-foreground">Account Number</Label>
                  <p className="font-medium">{bankDetails.accountNumber}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleCopy(bankDetails.accountNumber, 'account')}>
                  {copied === 'account' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <Label className="text-xs text-muted-foreground">Bank Name</Label>
                  <p className="font-medium">{bankDetails.bankName}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleCopy(bankDetails.bankName, 'bank')}>
                  {copied === 'bank' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <Label className="text-xs text-muted-foreground">Routing Number</Label>
                  <p className="font-medium">{bankDetails.routingNumber}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleCopy(bankDetails.routingNumber, 'routing')}>
                  {copied === 'routing' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <Button className="w-full" onClick={() => setShowDepositModal(false)}>
              I've Sent It
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Withdraw Modal */}
      <Dialog open={showWithdrawModal} onOpenChange={setShowWithdrawModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Withdraw Funds</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="amount">Amount ($)</Label>
              <Input id="amount" placeholder="Enter amount" value={withdrawAmount} onChange={e => setWithdrawAmount(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="account">Destination Account</Label>
              <Input id="account" placeholder="Enter account number" value={withdrawAccount} onChange={e => setWithdrawAccount(e.target.value)} />
            </div>
            <Button className="w-full" onClick={handleWithdrawSubmit}>
              Proceed to Withdraw
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* OTP Modal */}
      <Dialog open={showOtpModal} onOpenChange={setShowOtpModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Verify Withdrawal</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-center">
            <p className="text-sm text-muted-foreground">
              Enter the OTP sent to your email to confirm withdrawal
            </p>
            <div className="flex justify-center">
              <InputOTP maxLength={6} value={otpValue} onChange={value => setOtpValue(value)}>
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
            <Button className="w-full" disabled={otpValue.length !== 6}>
              Submit OTP
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
export default Dashboard;