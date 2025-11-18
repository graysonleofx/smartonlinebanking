  import React, { useCallback, useEffect, useState } from 'react';
  import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
  import { Button } from '@/components/ui/button';
  import { Input } from '@/components/ui/input';
  import { Label } from '@/components/ui/label';
  import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
  import { Textarea } from '@/components/ui/textarea';
  import { Badge } from '@/components/ui/badge';
  import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
  import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
  import AdminSidebar from '@/components/AdminSidebar';
  import { useToast } from '@/hooks/use-toast';
  import { 
    CreditCard, 
    Plus, 
    TrendingUp, 
    TrendingDown,
    Activity,
    Search,
    Menu
  } from 'lucide-react';
  import supabase from '@/lib/supabaseClient'; // adjust path/name to your client export
  import { use } from 'react';


  const AdminTransactions = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { toast } = useToast();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [formData, setFormData] = useState({
      userId: '',
      userName: '',
      userAccount: '',
      type: '',
      amount: '',
      note: '',
      email: ''
    });

    const [users, setUsers] = useState([]);

    // Users - try fetching from a users table, fallback to hardcoded if not found
    // const [users, setUsers] = useState([{ id: '1', full_name: 'John Doe', account: '3032410090' },
    //   { id: '2', full_name: 'Jane Smith', account: '3032410091' },
    //   { id: '3', full_name: 'Mike Johnson', account: '3032410092' }
    // ]);

    // const loadUsers = useCallback(async () => {
    //   try {
    //     const { data, error } = await supabase.from('users').select('email, full_name, account');
    //     if (error) {
    //       // silently fallback to mock users
    //       console.debug('Could not load users from supabase:', error.message);
    //       return;
    //     }
    //     if (data) {
    //       setUsers(data);
    //     }
    //   } catch (err) {
    //     console.debug(err);
    //   }
    // }, []);

    const loadUsers = useCallback(async () => {
    try {
        const { data, error } = await supabase
          .from('accounts')
          .select('email, full_name, account_number, id');

        if (!error && data) {
          setUsers(data);
        }
      } catch (err) { }
    }, []);

    const loadTransactions = useCallback(async () => {
      setLoading(true);
      try {
        // adjust column names if different (e.g. created_at)
        const { data, error } = await supabase
          .from('transactions')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          toast({ title: 'Error', description: error.message, variant: 'destructive' });
          setLoading(false);
          return;
        }
        // const mapped = (data || []).map((r) => ({
        //   id: String(r.id),
        //   email: r.email,
        //   userName: r.account_name,
        //   userAccount: r.user_account,
        //   type: r.type,
        //   amount: Number(r.amount),
        //   note: r.note,
        //   status: r.status,
        //   timestamp: r.created_at
        // }));
        const mapped = (data || []).map((r) => ({
          id: String(r.id),
          email: r.email || "",
          userName: r.account_name || "",
          userAccount: r.user_account || "",
          type: r.type || "",
          amount: Number(r.amount) || 0,
          note: r.note || "",
          status: r.status || "completed",
          timestamp: r.created_at
        }));


        setTransactions(mapped);
      } catch (err) {
        toast({ title: 'Error', description: err.message || 'Failed to load', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    }, [toast]);

    useEffect(() => {
      loadUsers();
      loadTransactions();
    }, [loadUsers, loadTransactions]);

    // const filteredTransactions = transactions.filter(transaction => {
    //   const matchesSearch =
    //     transaction.email.toLowerCase().includes(searchTerm.toLowerCase()) || u
    //     transaction.userAccount.includes(searchTerm) ||
    //     transaction.id.toLowerCase().includes(searchTerm.toLowerCase());

    //   const matchesType = filterType === 'all' || transaction.type === filterType;
    //   const matchesStatus = filterStatus === 'all' || transaction.status === filterStatus;

    //   return matchesSearch && matchesType && matchesStatus;
    // });

    const filteredTransactions = transactions.filter((transaction) => {
      const email = transaction.email || "";
      const account = transaction.userAccount || "";
      const id = transaction.id || "";

      const matchesSearch =
        email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        account.includes(searchTerm) ||
        id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = filterType === 'all' || transaction.type === filterType;
      const matchesStatus = filterStatus === 'all' || transaction.status === filterStatus;

      return matchesSearch && matchesType && matchesStatus;
    });
    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0
      }).format(amount);
    };

    const formatDate = (dateString) => {
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(new Date(dateString));
    };

    // const handleUserSelect = (userId) => {
    //   const user = users.find(u => u.id === userId);
    //   if (user) {
    //     setFormData(prev => ({
    //       ...prev,
    //       userId,
    //       userName: user.name,
    //       userAccount: user.account
    //     }));
    //   }
    // };

    const handleUserSelect = (email) => {
      const user = users.find(u => u.email === email);
      if (user) {
        setFormData(prev => ({
          ...prev,
          email: user.email,
          userName: user.full_name,
          userAccount: user.account
        }));
      }
    };

    const handleAddTransaction = async () => {
      if (!formData.email || !formData.type || !formData.amount) {
        toast({
          title: 'Error',
          description: 'Please fill in all required fields',
          variant: 'destructive'
        });
        return;
      }
      const payload = {
        email: formData.email,
        account_name: formData.userName,
        user_account: formData.userAccount,
        type: formData.type,
        amount: Number(formData.amount),
        note: formData.note || 'Admin transaction',
        status: 'completed',
        created_at: new Date().toISOString(),
        date: new Date().toLocaleDateString(),
      };

      try {
        setLoading(true);
        const { data, error } = await supabase.from('transactions').insert(payload).select().limit(1).single();

        if (error) {
          toast({ title: 'Error', description: error.message, variant: 'destructive' });
          return;
        }

        // Map inserted row to Transaction type
        const newTransaction = {
          id: String(data.id ?? data.txn_id ?? Date.now()),
          email: data.email ?? formData.email,
          userId: String(data.user_id ?? data.userId ?? formData.userId),
          userName: data.account_name ?? data.accountName ?? formData.userName,
          userAccount: data.user_account ?? data.userAccount ?? formData.userAccount,
          type: (data.type ?? formData.type),
          amount: Number(data.amount ?? formData.amount),
          note: data.note ?? formData.note ?? 'Admin transaction',
          status: (data.status ?? 'completed'),
          timestamp: data.created_at ?? data.timestamp ?? new Date().toISOString()
        };

        setTransactions(prev => [newTransaction, ...prev]);
        setIsAddDialogOpen(false);
        // setFormData({
        //   account_name: '',
        //   userAccount: '',
        //   type: '',
        //   amount: '',
        //   note: '', 
        //   email: ''
        // });

        setFormData({
          email: "",
          userName: "",
          userAccount: "",
          type: "",
          amount: "",
          note: ""
        });

        toast({
          title: 'Transaction Added',
          description: `${newTransaction.type} of ${formatCurrency(newTransaction.amount)} has been processed`
        });
      } catch (err) {
        toast({ title: 'Error', description: err.message || 'Failed to add', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };

    const getTransactionIcon = (type) => {
      switch (type) {
        case 'deposit':
          return <TrendingUp className="w-4 h-4 text-green-600" />;
        case 'withdrawal':
          return <TrendingDown className="w-4 h-4 text-red-600" />;
        case 'transfer':
          return <Activity className="w-4 h-4 text-blue-600" />;
        default:
          return <Activity className="w-4 h-4" />;
      }
    };

    const getStatusBadgeVariant = (status) => {
      switch (status) {
        case 'completed':
          return 'default';
        case 'pending':
          return 'secondary';
        case 'failed':
          return 'destructive';
        default:
          return 'secondary';
      }
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
            <h1 className="text-lg font-semibold">Transactions</h1>
            <div className="w-10"></div>
          </div>
          
          <div className="p-4 md:p-6 overflow-x-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 md:mb-8 gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center">
                <CreditCard className="w-6 h-6 md:w-8 md:h-8 mr-2 md:mr-3" />
                Transaction Management
              </h1>
              <p className="text-sm md:text-base text-muted-foreground">Manage and monitor all transactions</p>
            </div>
            
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center w-full sm:w-auto">
                  <Plus className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Add Transaction</span>
                  <span className="sm:hidden">Add</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Transaction</DialogTitle>
                  <DialogDescription>Manually add a transaction for a user</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="user-select">Select User</Label>
                    <Select onValueChange={handleUserSelect} value={formData.email}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a user" />
                      </SelectTrigger>
                      <SelectContent>
                        {users.length === 0 && (
                          <p className="p-2 text-sm text-muted-foreground">No users found</p>
                        )}

                        {users.map((user) => (
                          <SelectItem key={user.email} value={user.email}>
                            {user.full_name} — {user.email} ({user.account_number})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="transaction-type">Transaction Type</Label>
                    <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="deposit">Deposit (Credit)</SelectItem>
                        <SelectItem value="withdrawal">Withdrawal (Debit)</SelectItem>
                        <SelectItem value="transfer">Transfer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="amount">Amount ($)</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={formData.amount}
                      onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                      placeholder="0.00"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="note">Note (Optional)</Label>
                    <Textarea
                      id="note"
                      value={formData.note}
                      onChange={(e) => setFormData(prev => ({ ...prev, note: e.target.value }))}
                      placeholder="Transaction description..."
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddTransaction} disabled={loading}>
                    Add Transaction
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Filters */}
          <Card className="mb-4 md:mb-6">
            <CardContent className="pt-4 md:pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                <div className="relative col-span-1 sm:col-span-2 lg:col-span-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search transactions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 text-sm md:text-base"
                  />
                </div>
                
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="deposit">Deposit</SelectItem>
                    <SelectItem value="withdrawal">Withdrawal</SelectItem>
                    <SelectItem value="transfer">Transfer</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Transactions Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">All Transactions ({filteredTransactions.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0 md:p-6">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[100px]">ID</TableHead>
                      <TableHead className="min-w-[120px]">User</TableHead>
                      <TableHead className="min-w-[80px]">Type</TableHead>
                      <TableHead className="min-w-[100px]">Amount</TableHead>
                      <TableHead className="min-w-[80px]">Status</TableHead>
                      <TableHead className="hidden lg:table-cell min-w-[120px]">Date</TableHead>
                      <TableHead className="hidden xl:table-cell min-w-[150px]">Note</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-mono text-xs md:text-sm">{transaction.email}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-sm">{transaction.userName}</p>
                            <p className="text-xs text-muted-foreground">{transaction.userAccount}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1 md:space-x-2">
                            {getTransactionIcon(transaction.type)}
                            <span className="capitalize text-sm">{transaction.type}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold text-sm">
                          {formatCurrency(transaction.amount)}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(transaction.status)} className="text-xs">
                            {transaction.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-xs">
                          {formatDate(transaction.timestamp)}
                        </TableCell>
                        <TableCell className="hidden xl:table-cell max-w-xs truncate text-xs text-muted-foreground">
                          {transaction.note}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {loading && <div className="p-4 text-center text-sm text-muted-foreground">Loading...</div>}
            </CardContent>
          </Card>
          </div>
        </div>
      </div>
    );
  };

  export default AdminTransactions;