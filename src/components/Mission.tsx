import { Button } from '@/components/ui/button';
import handshakeImage from '@/assets/handshake-hero.jpg';
import ceoImage from '@/assets/ceo-portrait.jpg';

const Mission = () => {
  return (
    <section className="py-24 bg-background" id='about-us'>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <div className="relative">
            <img
              src={handshakeImage}
              alt="Business partnership and trust"
              className="rounded-2xl shadow-banking w-full h-auto"
            />
            <div className="absolute inset-0 bg-gradient-primary opacity-10 rounded-2xl"></div>
          </div>

          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="text-sm font-semibold text-primary uppercase tracking-wider">
                Who We Are
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-foreground">
                Our Mission, Values and{' '}
                <span className="text-transparent bg-gradient-primary bg-clip-text">
                  Motto
                </span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We believe banking should be simple, transparent, and accessible to everyone. 
                Our mission is to democratize financial services by providing cutting-edge 
                technology that empowers individuals and businesses to achieve their financial goals.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                With a focus on innovation, security, and customer satisfaction, we're building 
                the future of digital banking, one transaction at a time.
              </p>
            </div>

            {/* CEO Section */}
            <div className="flex items-center space-x-4 p-6 rounded-xl bg-banking-gray">
              <img
                src={ceoImage}
                alt="James Patterson, CEO"
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <div className="font-semibold text-foreground">James Patterson</div>
                <div className="text-sm text-muted-foreground">Founder & CEO</div>
              </div>
            </div>

            <Button variant="hero" size="lg" className="mt-8" onClick={() => window.location.href = '/about-us'}>
              Learn More About Us
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Mission;