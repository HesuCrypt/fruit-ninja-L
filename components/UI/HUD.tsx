import React, { useEffect, useState } from 'react';
import { ScoreConfig, GameSettings } from '../../types';
import { Heart, X, Zap, Trophy, ArrowUp } from 'lucide-react';
import { LEVELS } from '../../constants';

interface HUDProps {
  scoreConfig: ScoreConfig;
  settings: GameSettings;
}

const HUD: React.FC<HUDProps> = ({ scoreConfig, settings }) => {
  const currentLevelName = LEVELS[Math.min((scoreConfig.level || 1) - 1, LEVELS.length - 1)]?.name || "LEVEL 1";
  
  // Local state to trigger animation
  const [isScoreAnimating, setIsScoreAnimating] = useState(false);
  const [prevScore, setPrevScore] = useState(0);

  useEffect(() => {
    if (scoreConfig.score > prevScore) {
        setIsScoreAnimating(true);
        const timer = setTimeout(() => setIsScoreAnimating(false), 150); // Reset after anim
        return () => clearTimeout(timer);
    }
    setPrevScore(scoreConfig.score);
  }, [scoreConfig.score, prevScore]);

  // Frenzy Bar calculation
  const frenzyPct = Math.min(100, Math.max(0, scoreConfig.frenzyProgress * 100));

  return (
    <div className="absolute inset-0 pointer-events-none font-retro z-10 flex flex-col justify-between p-4">
      
      {/* TOP BAR */}
      <div className="flex justify-between items-start w-full">
        {/* Score & Level */}
        <div className="flex flex-col items-start">
            <div className="flex items-center gap-2 text-issy-accent text-xl sm:text-2xl drop-shadow-[2px_2px_0_#FFF]">
                <span className="text-xs sm:text-sm uppercase text-gray-300">Score</span>
                <span className={`text-2xl sm:text-3xl drop-shadow-[2px_2px_0_#FF69B4] transition-colors duration-200 ${scoreConfig.isFrenzy ? 'text-yellow-400' : 'text-white'} ${isScoreAnimating ? 'animate-pop' : ''}`}>
                    {scoreConfig.score.toString().padStart(5, '0')}
                </span>
            </div>
            
            {/* Rank Target */}
            {scoreConfig.nextTargetScore !== null && (
                <div className="flex items-center gap-1 mt-1 animate-slide-up bg-black/40 px-2 py-1 rounded border border-white/10">
                    <Trophy className="w-3 h-3 text-yellow-500" />
                    <span className="text-[10px] text-gray-300">NEXT RANK:</span>
                    <span className="text-[10px] text-white font-bold">{scoreConfig.nextTargetScore}</span>
                    <span className="text-[10px] text-gray-400 ml-1">
                        ({Math.max(0, scoreConfig.nextTargetScore - scoreConfig.score)} left)
                    </span>
                </div>
            )}
            
            {settings.showLevel && (
                <div className="mt-2 flex items-center gap-2 animate-slide-up" key={scoreConfig.level}>
                    <span className="text-[10px] sm:text-xs text-issy-pastelBlue bg-gray-800 px-2 py-1 border border-white/50 rounded">
                        LVL {scoreConfig.level || 1}
                    </span>
                    <span className="text-[10px] sm:text-xs text-white/70 tracking-widest uppercase">
                        {currentLevelName}
                    </span>
                </div>
            )}

            {scoreConfig.isFrenzy && (
                <div className="flex items-center gap-2 mt-2 text-yellow-300 animate-bounce">
                    <Zap className="w-4 h-4 sm:w-5 sm:h-5 fill-yellow-300" />
                    <span className="text-sm sm:text-lg font-bold drop-shadow-[2px_2px_0_#000]">BONUS ROUND!</span>
                </div>
            )}

            {settings.showCombo && scoreConfig.combo > 1 && (
                <div className="text-issy-pastelGreen animate-pop mt-1 text-sm sm:text-lg drop-shadow-[1px_1px_0_#FFF]">
                    {scoreConfig.combo}x COMBO!
                </div>
            )}
        </div>

        {/* Lives */}
        <div className="flex gap-1">
            {[1, 2, 3].map((i) => (
                <div key={i} className="relative transition-transform duration-300">
                    {i <= scoreConfig.lives ? (
                        <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-issy-pink fill-issy-pink drop-shadow-[2px_2px_0_#FFF] animate-pop" />
                    ) : (
                        <X className="w-6 h-6 sm:w-8 sm:h-8 text-gray-700 opacity-50 scale-90" />
                    )}
                </div>
            ))}
        </div>
      </div>

      {/* BOTTOM BAR: Frenzy Gauge */}
      <div className="w-full flex flex-col items-center mb-2">
         <div className="w-full max-w-md relative">
             {/* Label */}
             <div className="flex justify-between items-end mb-1 px-1">
                 <span className={`text-[10px] font-bold ${scoreConfig.isFrenzy ? 'text-yellow-400 animate-pulse' : 'text-gray-400'}`}>
                    {scoreConfig.isFrenzy ? 'FRENZY ACTIVE!' : 'BONUS GAUGE'}
                 </span>
                 <span className="text-[10px] text-gray-500">{Math.floor(frenzyPct)}%</span>
             </div>
             
             {/* Bar Container */}
             <div className="h-4 w-full bg-gray-800 border-2 border-white/30 rounded-full overflow-hidden relative shadow-[0_0_10px_rgba(0,0,0,0.5)]">
                 {/* Fill */}
                 <div 
                    className={`h-full transition-all duration-200 ease-out relative ${scoreConfig.isFrenzy ? 'bg-yellow-400' : 'bg-gradient-to-r from-issy-pink to-issy-accent'}`}
                    style={{ width: `${frenzyPct}%` }}
                 >
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 bg-white/20" style={{ transform: 'skewX(-20deg) translateX(-50%)' }}></div>
                 </div>
                 
                 {/* Markers */}
                 <div className="absolute top-0 left-1/4 w-0.5 h-full bg-black/20"></div>
                 <div className="absolute top-0 left-2/4 w-0.5 h-full bg-black/20"></div>
                 <div className="absolute top-0 left-3/4 w-0.5 h-full bg-black/20"></div>
             </div>
         </div>
      </div>
    </div>
  );
};

export default HUD;