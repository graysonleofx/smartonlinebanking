import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  Settings, 
  LogOut,
  Shield,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminSidebar = ({ isOpen, onClose }: AdminSidebarProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    localStorage.removeItem('adminSession');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out"
    });
    navigate('/admin/login');
  };

  const navItems = [
    {
      title: 'Dashboard',
      href: '/admin/dashboard',
      icon: LayoutDashboard
    },
    {
      title: 'Users',
      href: '/admin/users',
      icon: Users
    },
    {
      title: 'Transactions',
      href: '/admin/transactions',
      icon: CreditCard
    },
    {
      title: 'Settings',
      href: '/admin/settings',
      icon: Settings
    }
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        flex flex-col w-64 bg-card border-r border-border h-screen
        fixed z-50 transform transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0 lg:z-auto
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo & Header */}
        <div className="p-4 md:p-6 border-b border-border">
          {/* Mobile Close Button */}
          <div className="flex items-center justify-between lg:justify-start">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 md:w-6 md:h-6 text-white" />
              </div>
              <div className="hidden md:block">
                <h2 className="text-lg font-semibold text-foreground">Admin Panel</h2>
                <p className="text-sm text-muted-foreground">Banking System</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="lg:hidden"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 md:p-4">
        <ul className="space-y-1 md:space-y-2">
          {navItems.map((item) => (
            <li key={item.href}>
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-2 md:px-4 md:py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                  }`
                }
              >
                <item.icon className="w-4 h-4 md:w-5 md:h-5" />
                <span className="font-medium text-sm md:text-base">{item.title}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-2 md:p-4 border-t border-border">
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3" />
          <span className="text-sm md:text-base">Logout</span>
        </Button>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;