import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Trophy, Settings, Volume2, VolumeX, Gamepad2 } from 'lucide-react';
import { SoundManager } from '../audio/sound-manager';



interface StartMenuProps {
  onStartGame: () => void;
  onShowHighScores?: () => void;
  onShowSettings?: () => void;
  highScores?: number[];
  isMuted: boolean;
  onToggleMute: () => void;
}

/**
 * スタートメニューコンポーネント
 */
export const StartMenu: React.FC<StartMenuProps> = ({ 
  onStartGame, 
  onShowHighScores, 
  onShowSettings,
  isMuted,
  onToggleMute
}) => {
  const [showTitle, setShowTitle] = useState(false);
  const [showButtons, setShowButtons] = useState(false);

  useEffect(() => {
    // タイトルを表示
    const titleTimer = setTimeout(() => setShowTitle(true), 500);
    // ボタンを表示
    const buttonsTimer = setTimeout(() => setShowButtons(true), 1500);

    return () => {
      clearTimeout(titleTimer);
      clearTimeout(buttonsTimer);
    };
  }, []);

  const handleStartGame = () => {
    SoundManager.getInstance().playSound('select');
    onStartGame();
  };

  const handleShowHighScores = () => {
    SoundManager.getInstance().playSound('select');
    onShowHighScores?.();
  };

  const handleShowSettings = () => {
    SoundManager.getInstance().playSound('select');
    onShowSettings?.();
  };

  const menuItems = [
    {
      id: 'start',
      label: 'GAME START',
      icon: Play,
      onClick: handleStartGame,
      color: 'from-cyan-400 to-blue-500',
      glowColor: 'shadow-cyan-400/50'
    },
    {
      id: 'highscores',
      label: 'HIGH SCORES',
      icon: Trophy,
      onClick: handleShowHighScores,
      color: 'from-yellow-400 to-orange-500',
      glowColor: 'shadow-yellow-400/50'
    },
    {
      id: 'settings',
      label: 'SETTINGS',
      icon: Settings,
      onClick: handleShowSettings,
      color: 'from-purple-400 to-pink-500',
      glowColor: 'shadow-purple-400/50'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center overflow-hidden relative">
      {/* 背景アニメーション */}
      <div className="absolute inset-0">
        {/* グリッドパターン */}
        <div className="absolute inset-0 opacity-20">
          <div className="grid grid-cols-12 grid-rows-8 h-full w-full">
            {Array.from({ length: 96 }).map((_, i) => (
              <motion.div
                key={i}
                className="border border-cyan-500/20"
                initial={{ opacity: 0 }}
                animate={{ opacity: Math.random() * 0.5 + 0.1 }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
            ))}
          </div>
        </div>

        {/* フローティングパーティクル */}
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-2 h-2 bg-cyan-400 rounded-full opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              x: [0, Math.random() * 100 - 50, 0],
              y: [0, Math.random() * 100 - 50, 0],
              scale: [1, Math.random() * 2 + 1, 1],
              opacity: [0.6, 0.2, 0.6]
            }}
            transition={{
              duration: Math.random() * 10 + 5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center px-8">
        {/* タイトル */}
        <AnimatePresence>
          {showTitle && (
            <motion.div
              initial={{ opacity: 0, y: -100, scale: 0.5 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                type: "spring",
                stiffness: 100,
                damping: 10
              }}
              className="mb-16"
            >
              <motion.div
                className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-cyan-400 via-pink-500 to-purple-600 bg-clip-text text-transparent mb-4"
                animate={{
                  textShadow: [
                    "0 0 20px rgba(0, 212, 255, 0.8)",
                    "0 0 40px rgba(255, 0, 110, 0.8)",
                    "0 0 20px rgba(0, 212, 255, 0.8)"
                  ]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                NEON
              </motion.div>
              <motion.div
                className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-400 bg-clip-text text-transparent"
                animate={{
                  textShadow: [
                    "0 0 20px rgba(255, 0, 110, 0.8)",
                    "0 0 40px rgba(0, 212, 255, 0.8)",
                    "0 0 20px rgba(255, 0, 110, 0.8)"
                  ]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              >
                SHOOTER
              </motion.div>
              
              <motion.div
                className="text-lg text-cyan-300 mt-4 opacity-80"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.8 }}
                transition={{ delay: 1 }}
              >
                A Modern Arcade Experience
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* メニューボタン */}
        <AnimatePresence>
          {showButtons && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.button
                    key={item.id}
                    onClick={item.onClick}
                    className={`
                      relative group w-80 h-16 rounded-xl font-bold text-xl
                      bg-gradient-to-r ${item.color}
                      hover:scale-105 transition-all duration-300
                      border border-white/20
                      overflow-hidden
                    `}
                    initial={{ opacity: 0, x: -100 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ 
                      delay: index * 0.2 + 0.5,
                      type: "spring",
                      stiffness: 100
                    }}
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: `0 0 30px ${item.glowColor}`
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <div className="relative flex items-center justify-center space-x-3">
                      <Icon className="w-6 h-6" />
                      <span>{item.label}</span>
                    </div>

                    {/* ホバーエフェクト */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.6 }}
                    />
                  </motion.button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ゲームパッドアイコン */}
        <AnimatePresence>
          {showButtons && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 0.3, y: 0 }}
              transition={{ delay: 2, duration: 0.5 }}
              className="mt-12"
            >
              <Gamepad2 className="w-16 h-16 mx-auto text-cyan-400" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 下部の装飾 */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/50 to-transparent" />
    </div>
  );
};