import { Button } from '@/components/ui/button';
import { ArrowRight, MessageCircle } from 'lucide-react';

const CTA = () => {
  return (
    <section className="py-24 bg-gradient-primary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center text-white space-y-8">
          <h2 className="text-4xl lg:text-6xl font-bold">
            Join 2,000+ Users{' '}
            <span className="text-transparent bg-gradient-accent bg-clip-text">
              Banking Smart
            </span>
          </h2>
          
          <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Ready to experience the future of banking? Join thousands of satisfied customers 
            who've made the switch to smarter, faster, and more secure banking.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Button variant="accent" size="lg" className="text-lg px-8 py-6" onClick={() => window.location.href = '/open-account'}>
              Open Account Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline-white" size="lg" className="text-lg px-8 py-6" onClick={() => window.location.href = '/contact'}>
              <MessageCircle className="mr-2 h-5 w-5" />
              Contact Support
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 pt-12 opacity-80">
            <div className="text-center">
              <div className="text-2xl font-bold">256-bit</div>
              <div className="text-sm">SSL Encryption</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">FDIC</div>
              <div className="text-sm">Insured</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">24/7</div>
              <div className="text-sm">Security Monitoring</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">99.9%</div>
              <div className="text-sm">Uptime SLA</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;