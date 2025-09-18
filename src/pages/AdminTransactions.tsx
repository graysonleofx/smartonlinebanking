import React, { useState } from 'react';
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
  Filter,
  Menu
} from 'lucide-react';

interface Transaction {
  id: string;
  userId: string;
  userName: string;
  userAccount: string;
  type: 'deposit' | 'withdrawal' | 'transfer';
  amount: number;
  note: string;
  status: 'completed' | 'pending' | 'failed';
  timestamp: string;
}

const AdminTransactions = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 'TXN-001',
      userId: '1',
      userName: 'John Doe',
      userAccount: '3032410090',
      type: 'deposit',
      amount: 150000,
      note: 'Initial deposit',
      status: 'completed',
      timestamp: new Date().toISOString()
    },
    {
      id: 'TXN-002',
      userId: '2',
      userName: 'Jane Smith',
      userAccount: '3032410091',
      type: 'withdrawal',
      amount: 75000,
      note: 'ATM withdrawal',
      status: 'pending',
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString()
    },
    {
      id: 'TXN-003',
      userId: '1',
      userName: 'John Doe',
      userAccount: '3032410090',
      type: 'transfer',
      amount: 200000,
      note: 'Transfer to savings',
      status: 'completed',
      timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString()
    }
  ]);

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
    note: ''
  });

  // Mock users for selection
  const users = [
    { id: '1', name: 'John Doe', account: '3032410090' },
    { id: '2', name: 'Jane Smith', account: '3032410091' },
    { id: '3', name: 'Mike Johnson', account: '3032410092' }
  ];

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      transaction.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.userAccount.includes(searchTerm) ||
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || transaction.type === filterType;
    const matchesStatus = filterStatus === 'all' || transaction.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString));
  };

  const handleUserSelect = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setFormData(prev => ({
        ...prev,
        userId,
        userName: user.name,
        userAccount: user.account
      }));
    }
  };

  const handleAddTransaction = () => {
    if (!formData.userId || !formData.type || !formData.amount) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const newTransaction: Transaction = {
      id: `TXN-${Date.now().toString().slice(-3).padStart(3, '0')}`,
      userId: formData.userId,
      userName: formData.userName,
      userAccount: formData.userAccount,
      type: formData.type as 'deposit' | 'withdrawal' | 'transfer',
      amount: parseFloat(formData.amount),
      note: formData.note || 'Admin transaction',
      status: 'completed',
      timestamp: new Date().toISOString()
    };

    setTransactions(prev => [newTransaction, ...prev]);
    setIsAddDialogOpen(false);
    setFormData({
      userId: '',
      userName: '',
      userAccount: '',
      type: '',
      amount: '',
      note: ''
    });

    toast({
      title: "Transaction Added",
      description: `${formData.type} of ${formatCurrency(parseFloat(formData.amount))} has been processed`
    });
  };

  const getTransactionIcon = (type: string) => {
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

  const getStatusBadgeVariant = (status: string) => {
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
                  <Select onValueChange={handleUserSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a user" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name} ({user.account})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="transaction-type">Transaction Type</Label>
                  <Select onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
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
                  <Label htmlFor="amount">Amount (₦)</Label>
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
                <Button onClick={handleAddTransaction}>
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
                      <TableCell className="font-mono text-xs md:text-sm">{transaction.id}</TableCell>
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
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminTransactions;