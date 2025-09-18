import { UserPlus, CreditCard, Send } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: UserPlus,
      step: '01',
      title: 'Sign Up',
      description: 'Create your account in less than 2 minutes with just your email and phone number.',
    },
    {
      icon: CreditCard,
      step: '02',
      title: 'Get Bank Details',
      description: 'Receive your virtual account number instantly and start receiving payments.',
    },
    {
      icon: Send,
      step: '03',
      title: 'Start Banking',
      description: 'Send money, receive payments, and manage your finances with ease.',
    },
  ];

  return (
    <section className="py-24 bg-banking-gray">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Get Started in{' '}
            <span className="text-transparent bg-gradient-primary bg-clip-text">
              3 Simple Steps
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of users who've made the switch to smarter banking.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {steps.map((step, index) => (
            <div key={index} className="text-center group">
              <div className="relative mb-8">
                <div className="mx-auto w-20 h-20 rounded-full bg-gradient-primary flex items-center justify-center group-hover:shadow-glow transition-all duration-300">
                  <step.icon className="h-10 w-10 text-primary-foreground" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-accent flex items-center justify-center">
                  <span className="text-sm font-bold text-accent-foreground">
                    {step.step}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-primary to-transparent"></div>
                )}
              </div>
              <h3 className="text-2xl font-semibold text-foreground mb-4">
                {step.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;