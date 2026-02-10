import React, { useState, useEffect } from 'react';
import GameCanvas from './components/GameCanvas';
import MainMenu from './components/UI/MainMenu';
import HUD from './components/UI/HUD';
import GameOver from './components/UI/GameOver';
import LoadingScreen from './components/UI/LoadingScreen';
import WelcomeScreen from './components/UI/WelcomeScreen';
import SettingsMenu from './components/UI/SettingsMenu';
import Leaderboard from './components/UI/Leaderboard';
import { GameState, GameMode, ScoreConfig, GameSettings } from './types';
import { soundEngine } from './utils/soundEngine';

function App() {
  const [gameState, setGameState] = useState<GameState>(GameState.LOADING);
  const [gameMode, setGameMode] = useState<GameMode>(GameMode.CLASSIC);
  const [showSettings, setShowSettings] = useState(false);
  const [gameId, setGameId] = useState(0); // Used to force remount of GameCanvas

  const [settings, setSettings] = useState<GameSettings>({
    soundEnabled: true,
    screenShake: true,
    highQualityParticles: true,
    showCombo: true,
    showLevel: true
  });

  const [scoreConfig, setScoreConfig] = useState<ScoreConfig>({
    score: 0,
    highScore: 0,
    combo: 0,
    lives: 3,
    level: 1,
    isFrenzy: false,
    frenzyProgress: 0,
    nextTargetScore: null
  });

  // Apply sound settings
  useEffect(() => {
    soundEngine.setMute(!settings.soundEnabled);
  }, [settings.soundEnabled]);

  const handleUpdateSettings = (newSettings: GameSettings) => {
    setSettings(newSettings);
  };

  const handleLoadingComplete = () => {
    setGameState(GameState.INTRO);
  };

  const handleIntroComplete = () => {
    setGameState(GameState.MENU);
  };

  const startGame = () => {
    setGameId(prev => prev + 1); // Force new game instance
    setGameState(GameState.PLAYING);
  };

  const goToMenu = () => {
    setGameState(GameState.MENU);
  };

  const handleScoreUpdate = (newConfig: ScoreConfig) => {
    setScoreConfig(newConfig);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-0 sm:p-4 overflow-hidden touch-none">
      {/* Game Container Device Frame - Responsive Portrait Mode */}
      <div className={`relative w-full max-w-[600px] h-[100dvh] sm:h-auto sm:aspect-[3/4] sm:max-h-[90vh] sm:rounded-xl overflow-hidden shadow-[0_0_40px_rgba(255,192,203,0.15)] ring-0 sm:ring-8 bg-neutral-900 select-none transition-all duration-300 ${scoreConfig.isFrenzy ? 'sm:ring-yellow-400 shadow-[0_0_60px_rgba(255,215,0,0.5)]' : 'sm:ring-neutral-900'}`}>

        {/* Layer 1: The Game Canvas */}
        {/* Key forces remount on new game */}
        <GameCanvas
          key={gameId}
          gameState={gameState}
          setGameState={setGameState}
          onScoreUpdate={handleScoreUpdate}
          gameMode={gameMode}
          settings={settings}
        />

        {/* Layer 2: UI Overlays */}
        {gameState === GameState.LOADING && (
          <LoadingScreen onComplete={handleLoadingComplete} />
        )}

        {gameState === GameState.INTRO && (
          <WelcomeScreen onStart={handleIntroComplete} />
        )}

        {gameState === GameState.MENU && (
          <MainMenu
            onStart={startGame}
            onOpenSettings={() => setShowSettings(true)}
            onOpenLeaderboard={() => setGameState(GameState.LEADERBOARD)}
          />
        )}

        {gameState === GameState.LEADERBOARD && (
          <Leaderboard onBack={goToMenu} />
        )}

        {gameState === GameState.PLAYING && (
          <HUD scoreConfig={scoreConfig} settings={settings} />
        )}

        {gameState === GameState.GAME_OVER && (
          <GameOver
            score={scoreConfig.score}
            onRestart={startGame}
            onHome={goToMenu}
          />
        )}

        {/* Settings Modal (Global) */}
        {showSettings && (
          <SettingsMenu
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onClose={() => setShowSettings(false)}
          />
        )}

      </div>

      {/* Decorative Background Elements */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, #333 1px, transparent 0)',
          backgroundSize: '20px 20px'
        }}
      />
    </div>
  );
}

export default App;