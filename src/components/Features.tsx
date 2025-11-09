import { 
  CreditCard, 
  Clock, 
  Shield, 
  MessageCircle, 
  Lock, 
  BarChart3 
} from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: CreditCard,
      title: 'Create Virtual Account',
      description: 'Get your virtual account number instantly and start receiving payments immediately.',
    },
    {
      icon: Clock,
      title: 'Real-Time Deposits',
      description: 'Instant notifications and real-time balance updates for all your transactions.',
    },
    {
      icon: Shield,
      title: 'Secure Transfers',
      description: 'Bank-grade encryption and security protocols protect every transaction.',
    },
    {
      icon: MessageCircle,
      title: '24/7 Chat Support',
      description: 'Get help anytime with our dedicated customer support team.',
    },
    {
      icon: Lock,
      title: 'Fraud Protection',
      description: 'Advanced AI-powered fraud detection keeps your money safe.',
    },
    {
      icon: BarChart3,
      title: 'Transaction Tracking',
      description: 'Detailed analytics and insights to help you manage your finances better.',
    },
  ];

  return (
    <section id="features" className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Powerful Features for{' '}
            <span className="text-transparent bg-gradient-primary bg-clip-text">
              Modern Banking
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Everything you need to manage your finances efficiently and securely in one platform.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-8 rounded-2xl bg-card border hover:shadow-banking transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center mb-6">
                <div className="p-3 rounded-xl bg-gradient-primary">
                  <feature.icon className="h-6 w-6 text-primary-foreground" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-card-foreground mb-4">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;