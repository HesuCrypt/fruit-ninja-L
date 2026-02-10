import React, { useState, useEffect } from 'react';
import { GameState } from '../../types';
import { Play, Trophy, Settings, Zap, HelpCircle, Instagram } from 'lucide-react';
import { soundEngine } from '../../utils/soundEngine';

interface MainMenuProps {
  onStart: () => void;
  onOpenSettings: () => void;
  onOpenLeaderboard: () => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ onStart, onOpenSettings, onOpenLeaderboard }) => {
  const [showHowTo, setShowHowTo] = useState(false);
  const [username, setUsername] = useState('');
  const [inputError, setInputError] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('issy_username');
    if (stored) setUsername(stored);
  }, []);

  const handleStart = () => {
    if (!username.trim() || username.trim().length < 2) {
        soundEngine.playExplosion(); // Error sound
        setInputError(true);
        setTimeout(() => setInputError(false), 500);
        return;
    }

    // Format as handle if needed (remove @ if typed, then re-add if we want consistency, but raw is fine)
    let cleanName = username.trim();
    if (cleanName.startsWith('@')) cleanName = cleanName.substring(1);
    
    // Save plain username without @ for consistency
    localStorage.setItem('issy_username', cleanName);
    
    soundEngine.playClick();
    onStart();
  };

  const handleOpenSettings = () => {
    soundEngine.playClick();
    onOpenSettings();
  };

  const handleOpenLeaderboard = () => {
    soundEngine.playClick();
    onOpenLeaderboard();
  };

  const handleHowTo = (show: boolean) => {
      soundEngine.playClick();
      setShowHowTo(show);
  }

  if (showHowTo) {
      return (
          <div className="absolute inset-0 bg-black/90 z-20 flex flex-col items-center justify-center p-6 font-retro text-white text-center animate-slide-up">
              <h2 className="text-2xl text-issy-accent mb-4">HOW TO PLAY</h2>
              <ul className="text-sm space-y-4 text-gray-300 mb-8 text-left max-w-xs leading-6">
                  <li>• Swipe your finger/mouse to slice fruits.</li>
                  <li>• Avoid the grey <span className="text-red-400">BOMBS</span>!</li>
                  <li>• Slice multiple fruits at once for <span className="text-issy-pastelGreen">COMBOS</span>.</li>
                  <li>• Slice the Glowing Banana for <span className="text-yellow-400">FRENZY MODE</span>!</li>
              </ul>
              <button 
                onClick={() => handleHowTo(false)}
                className="px-6 py-2 border-2 border-white btn-retro hover:bg-white hover:text-black transition-colors"
              >
                  BACK
              </button>
          </div>
      )
  }

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-20 font-retro text-issy-text p-4">
        <div className="mb-6 text-center animate-bounce">
            <h1 className="text-3xl md:text-5xl text-issy-accent drop-shadow-[4px_4px_0_#FFF] mb-2">
                ISSY
            </h1>
            <h2 className="text-lg md:text-3xl text-issy-pastelBlue drop-shadow-[2px_2px_0_#FFF]">
                FRUIT SLASH
            </h2>
        </div>

        <div className="flex flex-col gap-4 w-full max-w-[250px] animate-slide-up">
            {/* Username Input Section */}
            <div className={`relative transition-transform ${inputError ? 'animate-shake text-red-500' : ''}`}>
                <div className="flex items-center bg-issy-darkCard border-2 border-white/50 focus-within:border-issy-pink focus-within:shadow-[0_0_10px_#FF69B4] transition-all rounded">
                    <div className="pl-3 pr-2 text-gray-400">
                        <Instagram className="w-5 h-5" />
                    </div>
                    <span className="text-gray-400">@</span>
                    <input 
                        type="text" 
                        value={username.startsWith('@') ? username.substring(1) : username}
                        onChange={(e) => {
                            setInputError(false);
                            setUsername(e.target.value);
                        }}
                        placeholder="your_instagram"
                        className="w-full bg-transparent p-3 pl-0 text-white outline-none placeholder-gray-600 font-retro text-xs sm:text-sm uppercase"
                        maxLength={30}
                    />
                </div>
                {inputError && (
                    <p className="absolute -bottom-6 left-0 w-full text-center text-[10px] text-red-400 animate-pulse">
                        ENTER USERNAME TO PLAY
                    </p>
                )}
            </div>

            <button 
                onClick={handleStart}
                className="group relative px-6 py-4 bg-issy-pink border-4 border-white shadow-[4px_4px_0_0_#FFF] btn-retro mt-2"
            >
                <div className="flex items-center justify-center gap-2 text-black font-bold">
                    <Play className="w-6 h-6" />
                    <span>PLAY</span>
                </div>
            </button>

            <div className="flex gap-2">
                <button 
                    onClick={() => handleHowTo(true)}
                    className="flex-1 group relative px-4 py-3 bg-issy-darkCard border-4 border-white shadow-[4px_4px_0_0_#FFF] btn-retro"
                >
                    <div className="flex items-center justify-center gap-2 text-white">
                        <HelpCircle className="w-5 h-5 text-issy-orange" />
                    </div>
                </button>
                 <button 
                    onClick={handleOpenSettings}
                    className="flex-1 group relative px-4 py-3 bg-issy-darkCard border-4 border-white shadow-[4px_4px_0_0_#FFF] btn-retro"
                >
                    <div className="flex items-center justify-center gap-2 text-white">
                        <Settings className="w-5 h-5 text-gray-400" />
                    </div>
                </button>
            </div>
            
             <button 
                onClick={handleOpenLeaderboard}
                className="group relative px-6 py-3 bg-issy-darkCard border-4 border-white shadow-[4px_4px_0_0_#FFF] btn-retro"
            >
                <div className="flex items-center justify-center gap-2 text-white">
                    <Trophy className="w-5 h-5 text-issy-pink" />
                    <span className="text-sm">LEADERBOARD</span>
                </div>
            </button>
        </div>

        <p className="mt-12 text-[10px] text-gray-400 animate-pulse">v1.1.0 • POWERED BY ISSY COSMETICS</p>
    </div>
  );
};

export default MainMenu;