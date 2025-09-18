import React from 'react';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="flex flex-col items-center space-y-4">
        {/* Animated Logo */}
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-primary rounded-lg flex items-center justify-center animate-pulse">
            <div className="w-8 h-8 bg-white rounded opacity-90"></div>
          </div>
          {/* Spinning ring */}
          <div className="absolute inset-0 w-16 h-16 border-2 border-transparent border-t-primary rounded-lg animate-spin"></div>
        </div>
        
        {/* Loading text */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-foreground">Smart Bank</h3>
          <p className="text-sm text-muted-foreground animate-pulse">Loading your banking experience...</p>
        </div>
        
        {/* Progress dots */}
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;