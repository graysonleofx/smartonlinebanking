import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, Shield } from 'lucide-react';
import brand from '@/assets/bank.png';
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);

  const navigation = [
    { name: 'Home', href: '/#home' },
    { name: 'Features', href: '/#features' },
    { name: 'Services', href: '/#services' },
    { name: 'FAQ', href: '/#faq' },
    { name: 'Contact', href: '/#contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
      
      // Simple scrollspy logic
      const sections = navigation.map(nav => nav.href.substring(1));
      const currentSection = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom > 100;
        }
        return false;
      });
      
      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSmoothScroll = (href: string) => {
    const targetId = href.substring(1);
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${
      isScrolled 
        ? 'bg-background/95 backdrop-blur-lg border-b border-border shadow-sm' 
        : 'bg-background/80 backdrop-blur-md border-b border-transparent'
    }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex items-center space-x-3 group cursor-pointer" onClick={() => handleSmoothScroll('/home')}>
              <div className="relative">
                {/* <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <Shield className="w-4 h-4 text-white" />
                </div> */}
                <img src={brand} alt="Bank Logo" className="w-16 h-14 rounded-lg bg-slate-200" />
              </div>
              <span className="text-xl font-bold text-primary group-hover:text-primary/80 transition-colors">Federal Edge Finance</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => {
              const isActive = activeSection === item.href.substring(1);
              return (
                <button
                  key={item.name}
                  onClick={() => handleSmoothScroll(item.href)}
                  className={`relative text-sm font-medium transition-all duration-200 hover:text-primary ${
                    isActive 
                      ? 'text-primary' 
                      : 'text-foreground hover:text-primary'
                  }`}
                >
                  {item.name}
                  {isActive && (
                    <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-primary rounded-full"></div>
                  )}
                </button>
              );
            })}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex space-x-3">
            <Button 
              variant="outline" 
              size="lg" 
              onClick={() => window.location.href = '/login'}
              className="hover:scale-105 transition-transform duration-200"
            >
              Sign In
            </Button>
            <Button 
              variant="default" 
              size="lg" 
              onClick={() => window.location.href = '/open-account'}
              className="bg-gradient-primary hover:opacity-90 hover:scale-105 transition-all duration-200 shadow-glow"
            >
              Open Account
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="hover:scale-110 transition-transform duration-200"
            >
              <div className="relative w-5 h-5">
                <Menu className={`absolute inset-0 h-5 w-5 transition-all duration-300 ${isMenuOpen ? 'rotate-180 opacity-0' : 'rotate-0 opacity-100'}`} />
                <X className={`absolute inset-0 h-5 w-5 transition-all duration-300 ${isMenuOpen ? 'rotate-0 opacity-100' : '-rotate-180 opacity-0'}`} />
              </div>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="px-2 pt-2 pb-3 space-y-1 bg-background/95 backdrop-blur-lg border-t animate-fade-in">
            {navigation.map((item, index) => {
              const isActive = activeSection === item.href.substring(1);
              return (
                <button
                  key={item.name}
                  onClick={() => handleSmoothScroll(item.href)}
                  className={`block w-full text-left px-3 py-3 text-base font-medium transition-all duration-200 rounded-lg hover:bg-secondary ${
                    isActive 
                      ? 'text-primary bg-secondary/50' 
                      : 'text-foreground hover:text-primary'
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {item.name}
                </button>
              );
            })}
            <div className="px-3 py-3 space-y-3">
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full hover:scale-105 transition-transform duration-200" 
                onClick={() => window.location.href = '/login'}
              >
                Sign In
              </Button>
              <Button 
                variant="default" 
                size="lg" 
                className="w-full bg-gradient-primary hover:opacity-90 hover:scale-105 transition-all duration-200" 
                onClick={() => window.location.href = '/open-account'}
              >
                Open Account
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;