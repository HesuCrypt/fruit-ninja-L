import React from 'react';
import { X, Volume2, VolumeX, Smartphone, Zap, Eye, EyeOff, Layout } from 'lucide-react';
import { GameSettings } from '../../types';
import { soundEngine } from '../../utils/soundEngine';

interface SettingsMenuProps {
  settings: GameSettings;
  onUpdateSettings: (s: GameSettings) => void;
  onClose: () => void;
}

const SettingsMenu: React.FC<SettingsMenuProps> = ({ settings, onUpdateSettings, onClose }) => {
  const toggleSound = () => {
      soundEngine.playUiToggle();
      onUpdateSettings({ ...settings, soundEnabled: !settings.soundEnabled });
  }
  const toggleShake = () => {
      soundEngine.playUiToggle();
      onUpdateSettings({ ...settings, screenShake: !settings.screenShake });
  }
  const toggleQuality = () => {
      soundEngine.playUiToggle();
      onUpdateSettings({ ...settings, highQualityParticles: !settings.highQualityParticles });
  }
  const toggleCombo = () => {
      soundEngine.playUiToggle();
      onUpdateSettings({ ...settings, showCombo: !settings.showCombo });
  }
  const toggleLevel = () => {
      soundEngine.playUiToggle();
      onUpdateSettings({ ...settings, showLevel: !settings.showLevel });
  }
  
  const handleClose = () => {
      soundEngine.playClick();
      onClose();
  }

  return (
    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-neutral-900 border-4 border-white p-6 shadow-[8px_8px_0_0_#FF69B4] relative font-retro text-white animate-slide-up">
        
        <button onClick={handleClose} className="absolute top-2 right-2 p-2 hover:bg-white/10 rounded transition-colors">
            <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl text-center mb-6 text-issy-accent drop-shadow-[2px_2px_0_#FFF]">SETTINGS</h2>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            {/* Sound */}
            <div className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                    {settings.soundEnabled ? <Volume2 className="text-issy-pastelGreen" /> : <VolumeX className="text-gray-500" />}
                    <span className="group-hover:text-issy-pastelGreen transition-colors">SOUND FX</span>
                </div>
                <button 
                    onClick={toggleSound}
                    className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${settings.soundEnabled ? 'bg-issy-pastelGreen' : 'bg-gray-700'}`}
                >
                    <div className={`w-4 h-4 bg-white rounded-full toggle-handle ${settings.soundEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
            </div>

            {/* Screen Shake */}
            <div className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                    <Smartphone className={`${settings.screenShake ? 'text-issy-pastelBlue' : 'text-gray-500'}`} />
                    <span className="group-hover:text-issy-pastelBlue transition-colors">SHAKE</span>
                </div>
                <button 
                    onClick={toggleShake}
                    className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${settings.screenShake ? 'bg-issy-pastelBlue' : 'bg-gray-700'}`}
                >
                    <div className={`w-4 h-4 bg-white rounded-full toggle-handle ${settings.screenShake ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
            </div>

            {/* Quality */}
            <div className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                    <Zap className={`${settings.highQualityParticles ? 'text-yellow-400' : 'text-gray-500'}`} />
                    <div className="flex flex-col">
                        <span className="group-hover:text-yellow-400 transition-colors">PARTICLES</span>
                        <span className="text-[10px] text-gray-400">{settings.highQualityParticles ? 'HIGH' : 'LOW'}</span>
                    </div>
                </div>
                <button 
                    onClick={toggleQuality}
                    className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${settings.highQualityParticles ? 'bg-yellow-400' : 'bg-gray-700'}`}
                >
                    <div className={`w-4 h-4 bg-white rounded-full toggle-handle ${settings.highQualityParticles ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
            </div>

            <div className="w-full h-0.5 bg-gray-700 my-2"></div>
            <p className="text-xs text-gray-400 uppercase">Interface</p>

            {/* Show Combo */}
            <div className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                    {settings.showCombo ? <Eye className="text-issy-pink" /> : <EyeOff className="text-gray-500" />}
                    <span className="group-hover:text-issy-pink transition-colors">SHOW COMBO</span>
                </div>
                <button 
                    onClick={toggleCombo}
                    className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${settings.showCombo ? 'bg-issy-pink' : 'bg-gray-700'}`}
                >
                    <div className={`w-4 h-4 bg-white rounded-full toggle-handle ${settings.showCombo ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
            </div>

            {/* Show Level */}
            <div className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                    <Layout className={`${settings.showLevel ? 'text-issy-orange' : 'text-gray-500'}`} />
                    <span className="group-hover:text-issy-orange transition-colors">SHOW LEVEL</span>
                </div>
                <button 
                    onClick={toggleLevel}
                    className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${settings.showLevel ? 'bg-issy-orange' : 'bg-gray-700'}`}
                >
                    <div className={`w-4 h-4 bg-white rounded-full toggle-handle ${settings.showLevel ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
            </div>
        </div>

        <button 
            onClick={handleClose}
            className="w-full mt-6 py-3 bg-white text-black font-bold border-2 border-gray-400 hover:bg-gray-200 transition-colors btn-retro"
        >
            CLOSE
        </button>
      </div>
    </div>
  );
};

export default SettingsMenu;