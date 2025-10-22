import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Home, Trophy, Star } from 'lucide-react';

interface GameOverProps {
  score: number;
  wave: number;
  highScores?: number[];
  onPlayAgain: () => void;
  onMainMenu: () => void;
}

/**
 * ゲームオーバー画面コンポーネント
 */
export const GameOver: React.FC<GameOverProps> = ({ 
  score, 
  wave, 
  highScores = [],
  onPlayAgain, 
  onMainMenu 
}) => {
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    // 新しいハイスコアかチェック
    const isHighScore = highScores.length < 5 || score > Math.min(...highScores);
    setIsNewHighScore(isHighScore);

    // 統計を表示
    setTimeout(() => setShowStats(true), 1000);
  }, [score]);

  const getScoreRank = (score: number) => {
    if (score >= 10000) return { rank: 'S', color: 'text-yellow-400', bgColor: 'from-yellow-400/20 to-yellow-600/20' };
    if (score >= 5000) return { rank: 'A', color: 'text-cyan-400', bgColor: 'from-cyan-400/20 to-cyan-600/20' };
    if (score >= 2000) return { rank: 'B', color: 'text-green-400', bgColor: 'from-green-400/20 to-green-600/20' };
    if (score >= 1000) return { rank: 'C', color: 'text-blue-400', bgColor: 'from-blue-400/20 to-blue-600/20' };
    return { rank: 'D', color: 'text-gray-400', bgColor: 'from-gray-400/20 to-gray-600/20' };
  };

  const scoreRank = getScoreRank(score);

  const stats = [
    { label: 'FINAL SCORE', value: score.toLocaleString(), color: 'text-cyan-400' },
    { label: 'WAVES SURVIVED', value: wave.toString(), color: 'text-purple-400' },
    { label: 'RANK', value: scoreRank.rank, color: scoreRank.color }
  ];

  const actionButtons = [
    {
      id: 'restart',
      label: 'PLAY AGAIN',
      icon: RotateCcw,
      onClick: onPlayAgain,
      color: 'from-cyan-400 to-blue-500',
      glowColor: 'shadow-cyan-400/50'
    },
    {
      id: 'menu',
      label: 'MAIN MENU',
      icon: Home,
      onClick: onMainMenu,
      color: 'from-purple-400 to-pink-500',
      glowColor: 'shadow-purple-400/50'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-purple-900 to-gray-900 flex items-center justify-center overflow-hidden relative">
      {/* 背景アニメーション */}
      <div className="absolute inset-0">
        {/* 崩壊エフェクト */}
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={`debris-${i}`}
            className="absolute w-1 h-1 bg-red-500 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              y: [0, Math.random() * 200 + 100],
              x: [0, (Math.random() - 0.5) * 200],
              opacity: [1, 0]
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}

        {/* フラッシュエフェクト */}
        <motion.div
          className="absolute inset-0 bg-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.1, 0] }}
          transition={{ duration: 0.5, times: [0, 0.5, 1] }}
        />
      </div>

      <div className="relative z-10 text-center px-8 max-w-4xl mx-auto">
        {/* ゲームオーバータイトル */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="mb-8"
        >
          <motion.h1
            className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 bg-clip-text text-transparent"
            animate={{
              textShadow: [
                "0 0 30px rgba(255, 0, 0, 0.8)",
                "0 0 60px rgba(255, 0, 110, 0.8)",
                "0 0 30px rgba(255, 0, 0, 0.8)"
              ]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            GAME OVER
          </motion.h1>

          {isNewHighScore && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-4"
            >
              <motion.div
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 py-2 rounded-full font-bold text-xl"
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [-2, 2, -2]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Star className="w-6 h-6" />
                <span>NEW HIGH SCORE!</span>
                <Star className="w-6 h-6" />
              </motion.div>
            </motion.div>
          )}
        </motion.div>

        {/* ゲーム統計 */}
        <AnimatePresence>
          {showStats && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 100 }}
              className="mb-12"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.2 }}
                    className={`bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-white/20 bg-gradient-to-br ${scoreRank.bgColor}`}
                  >
                    <div className="text-white/70 text-sm font-bold mb-2">{stat.label}</div>
                    <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
                  </motion.div>
                ))}
              </div>

              {/* ハイスコア表示 */}
              {highScores.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-white/20"
                >
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <Trophy className="w-6 h-6 text-yellow-400" />
                    <h3 className="text-xl font-bold text-yellow-400">HIGH SCORES</h3>
                    <Trophy className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div className="grid grid-cols-5 gap-4">
                    {highScores.map((highScore, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1 + index * 0.1 }}
                        className={`text-center p-3 rounded-lg ${
                          highScore === score && isNewHighScore
                            ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold'
                            : 'bg-white/10 text-white'
                        }`}
                      >
                        <div className="text-sm opacity-70">#{index + 1}</div>
                        <div className="text-lg font-bold">{highScore.toLocaleString()}</div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* アクションボタン */}
        <AnimatePresence>
          {showStats && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, type: "spring", stiffness: 100 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              {actionButtons.map((button, index) => {
                const Icon = button.icon;
                return (
                  <motion.button
                    key={button.id}
                    onClick={button.onClick}
                    className={`
                      relative group w-64 h-16 rounded-xl font-bold text-xl
                      bg-gradient-to-r ${button.color}
                      hover:scale-105 transition-all duration-300
                      border border-white/20
                      overflow-hidden
                    `}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5 + index * 0.2 }}
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: `0 0 30px ${button.glowColor}`
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <div className="relative flex items-center justify-center space-x-3">
                      <Icon className="w-6 h-6" />
                      <span>{button.label}</span>
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
      </div>

      {/* 下部の装飾 */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/50 to-transparent" />
    </div>
  );
};