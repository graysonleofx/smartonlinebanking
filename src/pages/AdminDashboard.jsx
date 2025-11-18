import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AdminSidebar from '@/components/AdminSidebar';
import { 
  Users, 
  UserCheck, 
  UserX, 
  DollarSign,
  TrendingUp,
  Activity,
  AlertCircle,
  Menu,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import supabase from '@/lib/supabaseClient'; 

const AdminDashboard = () => {
  const navigate = useNavigate();

  // Check admin login on mount
  useEffect(() => {
    const adminData = localStorage.getItem('admin');
    if (!adminData) {
      navigate('/admin/login');
      return;
    }
    const parsed = JSON.parse(adminData);
    if (!parsed.isAdmin) {
      navigate('/admin/dashboard');
      return;
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('admin');
    navigate('/admin/login');
  };

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    blockedUsers: 0,
    totalBalance: 0,
    todayTransactions: 0,
    pendingTransactions: 0
  });

  useEffect(() => {
    let mounted = true;

    const fetchStats = async () => {
      try {
        // TOTAL USERS
        const { count: totalUsers } = await supabase
          .from("accounts")
          .select("id", { count: "exact", head: true });

        // ACTIVE USERS
        const { count: activeUsers } = await supabase
          .from("accounts")
          .select("id", { count: "exact", head: true })
          .eq("status", "active");

        // BLOCKED USERS
        const { count: blockedUsers } = await supabase
          .from("accounts")
          .select("id", { count: "exact", head: true })
          .eq("status", "blocked");

        // TOTAL BALANCE
        const { data: balanceRows } = await supabase
          .from("accounts")
          .select("checking_account_balance, savings_account_balance");

        const totalBalance = balanceRows?.reduce(
          (sum, row) => sum + (row.checking_account_balance || 0) + (row.savings_account_balance || 0),
          0
        ) || 0;

        // TODAY TRANSACTIONS
        const start = new Date();
        start.setHours(0, 0, 0, 0);
        const end = new Date();
        end.setHours(23, 59, 59, 999);

        const { count: todayTransactions } = await supabase
          .from("transactions")
          .select("id", { count: "exact", head: true })
          .gte("created_at", start.toISOString())
          .lte("created_at", end.toISOString());

        // PENDING TRANSACTIONS
        const { count: pendingTransactions } = await supabase
          .from("transactions")
          .select("id", { count: "exact", head: true })
          .eq("status", "pending");

        setStats({
          totalUsers: totalUsers || 0,
          activeUsers: activeUsers || 0,
          blockedUsers: blockedUsers || 0,
          totalBalance,
          todayTransactions: todayTransactions || 0,
          pendingTransactions: pendingTransactions || 0,
        });
      } catch (err) {
        console.error("STAT ERROR:", err);
      }
    };



    fetchStats();
    return () => { mounted = false };
  }, []);


  const [recentTransactions] = useState([
    { id: 'TXN-001', user: 'John Doe', type: 'deposit', amount: 150000, status: 'completed', timestamp: new Date().toISOString() },
    { id: 'TXN-002', user: 'Jane Smith', type: 'withdrawal', amount: 75000, status: 'pending', timestamp: new Date().toISOString() },
    { id: 'TXN-003', user: 'Mike Johnson', type: 'transfer', amount: 200000, status: 'completed', timestamp: new Date().toISOString() },
    { id: 'TXN-004', user: 'Sarah Wilson', type: 'deposit', amount: 300000, status: 'failed', timestamp: new Date().toISOString() }
  ]);

  const formatCurrency = (amount) => new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  }).format(amount);

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'completed': return 'default';
      case 'pending': return 'secondary';
      case 'failed': return 'destructive';
      default: return 'secondary';
    }
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'deposit': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'withdrawal': return <TrendingUp className="w-4 h-4 text-red-600 rotate-180" />;
      case 'transfer': return <Activity className="w-4 h-4 text-blue-600" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  return (
    <div className="flex  min-h-screen bg-background">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 lg:ml-0">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-border bg-card">
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold">Admin Dashboard</h1>
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="w-5 h-5 text-red-600" />
          </Button>
        </div>

        <div className="p-4 md:p-6">
          {/* Header */}
          <div className="mb-6 md:mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-sm md:text-base text-muted-foreground">Overview of your banking platform</p>
            </div>
            <Button variant="destructive" onClick={handleLogout}>
              Logout
            </Button>
          </div>
            {/* <TotalUser  sFetcher /> */}

            {/* Stats Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
                <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                  Last update: {new Date().toLocaleTimeString()}
                  </p>
                </CardContent>
                </Card>

                <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                  <UserCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.activeUsers.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                  {stats.totalUsers > 0
                    ? `${((stats.activeUsers / stats.totalUsers) * 100).toFixed(1)}% of total users`
                    : '—'}
                  </p>
                </CardContent>
                </Card>

                <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Blocked Users</CardTitle>
                  <UserX className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.blockedUsers.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                  {stats.totalUsers > 0
                    ? `${((stats.blockedUsers / stats.totalUsers) * 100).toFixed(1)}% of total users`
                    : '—'}
                  </p>
                </CardContent>
                </Card>

                <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(stats.totalBalance)}</div>
                  <p className="text-xs text-muted-foreground">
                  {stats.totalUsers > 0
                    ? `${formatCurrency(Math.round(stats.totalBalance / Math.max(stats.totalUsers, 1)))} avg / user`
                    : '—'}
                  </p>
                </CardContent>
                </Card>
              </div>

              {/* Quick Stats and Recent Transactions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="w-5 h-5 mr-2" />
                    Today's Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Transactions</span>
                    <span className="font-semibold">{stats.todayTransactions}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Pending</span>
                    <div className="flex items-center">
                      <AlertCircle className="w-4 h-4 text-yellow-500 mr-1" />
                      <span className="font-semibold">{stats.pendingTransactions}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Success Rate</span>
                    <span className="font-semibold text-green-600">98.5%</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>Latest transactions across the platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentTransactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          {getTransactionIcon(transaction.type)}
                          <div>
                            <p className="font-medium">{transaction.user}</p>
                            <p className="text-sm text-muted-foreground capitalize">
                              {transaction.type} • {transaction.id}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{formatCurrency(transaction.amount)}</p>
                          <Badge variant={getStatusBadgeVariant(transaction.status)} className="text-xs">
                            {transaction.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
