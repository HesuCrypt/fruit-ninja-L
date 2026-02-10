import React from 'react';
import { ArrowRight } from 'lucide-react';
import { soundEngine } from '../../utils/soundEngine';

interface WelcomeScreenProps {
  onStart: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  const handleStart = () => {
      soundEngine.init(); // Ensure context is ready
      soundEngine.playGameStart();
      onStart();
  }

  return (
    <div className="absolute inset-0 bg-neutral-900 z-40 flex flex-col items-center justify-center font-retro text-white p-6 text-center">
      <div className="max-w-md animate-fade-in-up">
        <h1 className="text-2xl text-issy-pastelBlue mb-6 leading-relaxed">
          WELCOME TO THE <span className="text-issy-accent">ISSYVERSE</span>
        </h1>
        
        <p className="text-sm text-gray-300 mb-8 leading-loose">
          Slice fresh fruits and collect rare cosmetics to unlock the ultimate look.
          <br /><br />
          Beware of the <span className="text-red-500">BOMBS</span>!
        </p>

        <div className="bg-issy-darkCard border-2 border-white/20 p-4 rounded mb-8 text-xs text-left">
           <div className="flex items-center gap-2 mb-2">
             <div className="w-3 h-3 bg-issy-pink rounded-full"></div>
             <span>Drag/Swipe to slice</span>
           </div>
           <div className="flex items-center gap-2 mb-2">
             <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
             <span>Slice Bananas for FRENZY</span>
           </div>
           <div className="flex items-center gap-2">
             <div className="w-3 h-3 bg-red-500 rounded-full"></div>
             <span>Don't slice the BOMBS</span>
           </div>
        </div>

        <button 
          onClick={handleStart}
          className="group flex items-center gap-2 mx-auto px-8 py-4 bg-issy-accent text-black font-bold border-4 border-white shadow-[4px_4px_0_0_#FFF] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#FFF] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all"
        >
          <span>START GAME</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;