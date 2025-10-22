import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Pause, Play, Volume2, VolumeX, Menu } from 'lucide-react';
import { GameEngine } from '../engine/game-engine';
import { InputState, GameState } from '../types/game';

interface GameMainProps {
  onGameOver: (score: number, wave: number) => void;
  isMuted: boolean;
  onBackToMenu: () => void;
}

/**
 * ゲームメイン画面コンポーネント
 */
export function GameMain({ onGameOver, isMuted, onBackToMenu }: GameMainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameEngineRef = useRef<GameEngine | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [wave, setWave] = useState(1);
  const [showControls, setShowControls] = useState(true);

  // 入力状態
  const [inputState, setInputState] = useState<InputState>({
    up: false,
    down: false,
    left: false,
    right: false,
    shoot: false
  });

  // キーボードイベントハンドラ
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    e.preventDefault();
    switch (e.code) {
      case 'ArrowUp':
      case 'KeyW':
        setInputState(prev => ({ ...prev, up: true }));
        break;
      case 'ArrowDown':
      case 'KeyS':
        setInputState(prev => ({ ...prev, down: true }));
        break;
      case 'ArrowLeft':
      case 'KeyA':
        setInputState(prev => ({ ...prev, left: true }));
        break;
      case 'ArrowRight':
      case 'KeyD':
        setInputState(prev => ({ ...prev, right: true }));
        break;
      case 'Space':
        setInputState(prev => ({ ...prev, shoot: true }));
        break;
      case 'KeyP':
        setIsPaused(prev => !prev);
        break;
    }
  }, []);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    e.preventDefault();
    switch (e.code) {
      case 'ArrowUp':
      case 'KeyW':
        setInputState(prev => ({ ...prev, up: false }));
        break;
      case 'ArrowDown':
      case 'KeyS':
        setInputState(prev => ({ ...prev, down: false }));
        break;
      case 'ArrowLeft':
      case 'KeyA':
        setInputState(prev => ({ ...prev, left: false }));
        break;
      case 'ArrowRight':
      case 'KeyD':
        setInputState(prev => ({ ...prev, right: false }));
        break;
      case 'Space':
        setInputState(prev => ({ ...prev, shoot: false }));
        break;
    }
  }, []);

  // Canvasのリサイズ処理
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const container = canvas.parentElement;
    if (!container) return;

    // コンテナのサイズを取得
    const rect = container.getBoundingClientRect();
    
    // Canvasのサイズを設定（高DPI対応）
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    
    // CSSサイズを設定
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    
    // コンテキストのスケールを設定
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
    }
  }, []);

  // ゲームループ
  const gameLoop = useCallback((currentTime: number) => {
    if (!gameEngineRef.current || !canvasRef.current) return;

    const deltaTime = Math.min((currentTime - lastTimeRef.current) / 1000, 0.1);
    lastTimeRef.current = currentTime;

    if (!isPaused && gameEngineRef.current.getGameState() === GameState.PLAYING) {
      // ゲームエンジンを更新
      gameEngineRef.current.update(deltaTime, inputState);
      
      // UI状態を更新
      setScore(gameEngineRef.current.getScore());
      setLives(gameEngineRef.current.getPlayerLives());
      setWave(gameEngineRef.current.getWave());
    }

    // 描画
    gameEngineRef.current.render();

    // ゲームオーバー判定
    if (gameEngineRef.current.getGameState() === GameState.GAME_OVER) {
      onGameOver(gameEngineRef.current.getScore(), gameEngineRef.current.getWave());
      return;
    }

    // 次のフレームを要求
    animationFrameRef.current = requestAnimationFrame(gameLoop);
  }, [isPaused, inputState, onGameOver]);

  // 初期化
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // ゲームエンジンを初期化
    gameEngineRef.current = new GameEngine(canvas, ctx);

    // Canvasをリサイズ
    resizeCanvas();

    // イベントリスナーを設定
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('resize', resizeCanvas);

    // コントロール表示を非表示に（3秒後）
    const controlsTimer = setTimeout(() => {
      setShowControls(false);
    }, 3000);

    // ゲームループを開始
    lastTimeRef.current = performance.now();
    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      // クリーンアップ
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('resize', resizeCanvas);
      clearTimeout(controlsTimer);
      
      if (gameEngineRef.current) {
        gameEngineRef.current.destroy();
      }
    };
  }, [handleKeyDown, handleKeyUp, resizeCanvas, gameLoop]);

  // 一時停止/再開
  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* HUD */}
      <div className="flex justify-between items-center p-4 bg-black/50 backdrop-blur-sm border-b border-white/10">
        {/* 左側: スコアとウェーブ */}
        <div className="flex gap-6">
          <div className="text-white">
            <div className="text-sm opacity-70">SCORE</div>
            <div className="text-2xl font-bold text-cyan-400">{score.toLocaleString()}</div>
          </div>
          <div className="text-white">
            <div className="text-sm opacity-70">WAVE</div>
            <div className="text-2xl font-bold text-pink-400">{wave}</div>
          </div>
        </div>

        {/* 中央: ライフ */}
        <div className="text-white">
          <div className="text-sm opacity-70">LIVES</div>
          <div className="flex gap-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className={`w-6 h-6 rounded-full ${
                  i < lives ? 'bg-red-500' : 'bg-gray-600'
                } border-2 border-white/20`}
              />
            ))}
          </div>
        </div>

        {/* 右側: コントロール */}
        <div className="flex gap-2">
          <button
            onClick={togglePause}
            className="p-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
            title={isPaused ? '再開' : '一時停止'}
          >
            {isPaused ? <Play size={20} /> : <Pause size={20} />}
          </button>
          <button
            onClick={onBackToMenu}
            className="p-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
            title="メニューに戻る"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      {/* ゲームキャンバス */}
      <div className="flex-1 relative bg-black/30">
        <canvas
          ref={canvasRef}
          className="w-full h-full game-canvas"
          style={{ display: 'block' }}
        />

        {/* 一時停止オーバーレイ */}
        {isPaused && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center text-white"
            >
              <div className="text-4xl font-bold mb-4">PAUSED</div>
              <div className="text-lg opacity-70">Pキーまたはボタンで再開</div>
            </motion.div>
          </div>
        )}

        {/* コントロール説明 */}
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute bottom-4 left-4 right-4 md:left-8 md:right-8 bg-black/70 backdrop-blur-sm rounded-lg p-4 border border-white/20"
          >
            <div className="text-white text-sm md:text-base">
              <div className="font-bold mb-2 text-cyan-400">操作方法</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>移動: WASD または 矢印キー</div>
                <div>射撃: スペースキー</div>
                <div>一時停止: Pキー</div>
                <div>メニュー: 右上のボタン</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* モバイルコントロール */}
        <div className="absolute bottom-4 right-4 md:hidden">
          <div className="bg-black/70 backdrop-blur-sm rounded-lg p-3 border border-white/20 text-white text-xs">
            タップで射撃
          </div>
        </div>
      </div>
    </div>
  );
}