import { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Clock, Zap } from 'lucide-react';

const TransactionProgress = ({ type, onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { label: 'Verifying details', icon: Clock },
    { label: 'Processing transaction', icon: Zap },
    { label: 'Completing transaction', icon: CheckCircle },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 500);
          return 100;
        }
        const newProgress = oldProgress + 2;
        
        // Update current step based on progress
        if (newProgress >= 33 && currentStep === 0) {
          setCurrentStep(1);
        } else if (newProgress >= 66 && currentStep === 1) {
          setCurrentStep(2);
        }
        
        return newProgress;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [currentStep, onComplete]);

  return (
    <Card>
      <CardContent className="p-6 text-center space-y-6">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">
            Processing {type === 'transfer' ? 'Transfer' : 'Withdrawal'}
          </h3>
          <p className="text-sm text-muted-foreground">
            Please wait while we process your transaction...
          </p>
        </div>

        <div className="space-y-4">
          <Progress value={progress} className="w-full h-2" />
          <div className="text-sm font-medium">{Math.round(progress)}% Complete</div>
        </div>

        <div className="space-y-3">
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            const isActive = currentStep === index;
            const isCompleted = currentStep > index;
            
            return (
              <div
                key={index}
                className={`flex items-center space-x-3 p-2 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-primary/10 text-primary' 
                    : isCompleted 
                    ? 'bg-green-50 text-green-600' 
                    : 'text-muted-foreground'
                }`}
              >
                <StepIcon className={`h-4 w-4 ${
                  isActive ? 'animate-pulse' : ''
                }`} />
                <span className="text-sm">{step.label}</span>
                {isCompleted && (
                  <CheckCircle className="h-4 w-4 text-green-600 ml-auto" />
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionProgress;