import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const FAQ = () => {
  const faqs = [
    {
      question: 'How long does it take to open an account?',
      answer: 'You can open your Federal Edge Finance account in less than 2 minutes. Simply provide your email, phone number, and basic personal information to get started immediately.',
    },
    {
      question: 'Are my deposits and withdrawals instant?',
      answer: 'Yes! Deposits are credited to your account instantly, and you\'ll receive real-time notifications. Withdrawals typically process within minutes during business hours.',
    },
    {
      question: 'How secure is my money with Federal Edge Finance?',
      answer: 'Your funds are protected by bank-grade encryption, multi-factor authentication, and advanced fraud detection. We\'re also insured and regulated by the appropriate financial authorities.',
    },
    {
      question: 'What are the fees for transactions?',
      answer: 'We believe in transparent pricing. Account opening is free, and most standard transactions have minimal fees. Check our fee schedule for detailed information on all charges.',
    },
    {
      question: 'Can I access my account 24/7?',
      answer: 'Absolutely! Your Federal Edge Finance account is available 24/7 through our mobile app and web platform. Our customer support team is also available around the clock to assist you.',
    },
    {
      question: 'How do virtual account numbers work?',
      answer: 'Virtual account numbers are unique identifiers that allow you to receive payments directly to your Federal Edge Finance account. They work just like traditional account numbers but are generated instantly.',
    },
  ];

  return (
    <section id="faq" className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Frequently Asked{' '}
            <span className="text-transparent bg-gradient-primary bg-clip-text">
              Questions
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Got questions? We've got answers. Here are the most common questions our customers ask.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border border-border rounded-lg px-6 hover:shadow-card transition-all duration-300"
              >
                <AccordionTrigger className="text-left font-semibold text-foreground py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;