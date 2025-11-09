import { Button } from '@/components/ui/button';
import { ArrowRight, Play } from 'lucide-react';
import heroImage from '@/assets/banking-dashboard.jpg';

const Hero = () => {

  const handleGetStarted = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  const handleWatchDemo = () => {
    window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank');
  }
  return (
    <section id="home" className="relative min-h-screen flex items-center bg-gradient-hero">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-white space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                Banking That Moves as{' '}
                <span className="text-transparent bg-gradient-accent bg-clip-text">
                  Fast as You Do
                </span>
              </h1>
              <p className="text-xl lg:text-2xl text-white/90 leading-relaxed max-w-2xl">
                Open a virtual account, make seamless transfers, and grow your money – 
                all in one place. Join thousands who've made the smart switch.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="accent" size="lg" className="text-lg px-8 py-6" onClick={handleGetStarted}>
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline-white" size="lg" className="text-lg px-8 py-6" onClick={handleWatchDemo}>
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-white/20">
              <div>
                <div className="text-3xl font-bold">2,000+</div>
                <div className="text-white/80">Active Users</div>
              </div>
              <div>
                <div className="text-3xl font-bold">$50M+</div>
                <div className="text-white/80">Transferred</div>
              </div>
              <div>
                <div className="text-3xl font-bold">99.9%</div>
                <div className="text-white/80">Uptime</div>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="relative z-10">
              <img
                src={heroImage}
                alt="Smart Banking Dashboard"
                className="rounded-2xl shadow-banking w-full h-auto"
              />
            </div>
            <div className="absolute -top-2 -right-2 w-full h-full bg-gradient-accent rounded-2xl opacity-20"></div>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-banking-orange opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white opacity-5 rounded-full blur-3xl"></div>
      </div>
    </section>
  );
};

export default Hero;