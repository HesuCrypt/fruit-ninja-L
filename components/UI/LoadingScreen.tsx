import React, { useEffect, useState } from 'react';

interface LoadingScreenProps {
  onComplete: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500);
          return 100;
        }
        // Random increment for realistic feel
        return prev + Math.random() * 5; 
      });
    }, 50);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="absolute inset-0 bg-black z-50 flex flex-col items-center justify-center font-retro text-issy-text p-8">
      <div className="text-4xl text-issy-accent animate-pulse mb-8 drop-shadow-[4px_4px_0_#FFF]">
        ISSY
      </div>
      
      <div className="w-64 h-6 border-4 border-white p-1 mb-4">
        <div 
          className="h-full bg-issy-pink transition-all duration-100 ease-out"
          style={{ width: `${Math.min(100, progress)}%` }}
        />
      </div>

      <div className="text-xs text-gray-400 uppercase tracking-widest">
        {progress < 100 ? 'Initializing Assets...' : 'Ready!'}
      </div>
      
      <div className="mt-8 text-[10px] text-gray-600">
        © 2024 ISSY COSMETICS
      </div>
    </div>
  );
};

export default LoadingScreen;