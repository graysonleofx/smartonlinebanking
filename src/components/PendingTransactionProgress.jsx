import { useState, useEffect, useRef } from 'react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Clock, Zap } from 'lucide-react';

const PendingTransactionProgress = ({ type = 'transfer', onComplete }) => {
  const [progress, setProgress] = useState(0);
  const timerRef = useRef(null);

  const steps = [
    { label: 'Verifying details', icon: Clock },
    { label: 'Processing transaction', icon: Zap },
    { label: 'Completing transaction', icon: CheckCircle },
  ];

  useEffect(() => {
    // start interval
    timerRef.current = setInterval(() => {
      setProgress((old) => {
        const next = Math.min(100, old + 2);
        if (next === 100) {
          clearInterval(timerRef.current);
          // small delay before calling onComplete
          if (typeof onComplete === 'function') {
            setTimeout(onComplete, 500);
          }
        }
        return next;
      });
    }, 100);

    return () => {
      clearInterval(timerRef.current);
    };
  }, [onComplete]);

  // derive step from progress
  const currentStep =
    progress < 33 ? 0 : progress < 66 ? 1 : 2;

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
                <StepIcon className={`h-4 w-4 ${isActive ? 'animate-pulse' : ''}`} />
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

export default PendingTransactionProgress;
