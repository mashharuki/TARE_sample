// ベクトル型
export interface Vector2D {
  x: number;
  y: number;
}

// ゲームオブジェクトの基本インターフェース
export interface GameObject {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  velocityX: number;
  velocityY: number;
  health: number;
  maxHealth: number;
  isActive: boolean;
  update(deltaTime: number): void;
  render(ctx: CanvasRenderingContext2D): void;
  onCollision(other: GameObject): void;
  takeDamage(amount: number): void;
}

// プレイヤーインターフェース
export interface Player extends GameObject {
  speed: number;
  fireRate: number;
  lastShotTime: number;
  isInvulnerable: boolean;
  invulnerabilityTime: number;
  powerUps: PowerUpType[];
}

// 敵の種類
export enum EnemyType {
  BASIC = 'basic',
  FAST = 'fast',
  HEAVY = 'heavy',
  BOSS = 'boss'
}

// 敵インターフェース
export interface Enemy extends GameObject {
  type: EnemyType;
  scoreValue: number;
  attackPattern: AttackPattern;
  lastAttackTime: number;
}

// 攻撃パターン
export interface AttackPattern {
  type: 'single' | 'burst' | 'spread' | 'laser';
  damage: number;
  fireRate: number;
  bulletSpeed: number;
}

// 弾のインターフェース
export interface Bullet extends GameObject {
  damage: number;
  isPlayerBullet: boolean;
}

// パワーアップの種類
export enum PowerUpType {
  SPEED_BOOST = 'speed_boost',
  FIRE_RATE_UP = 'fire_rate_up',
  DAMAGE_UP = 'damage_up',
  SHIELD = 'shield',
  HEALTH_RESTORE = 'health_restore',
  HEALTH = 'health',
  POWER = 'power',
  SPEED = 'speed',
  SCORE = 'score'
}

// パワーアップインターフェース
export interface PowerUp extends GameObject {
  type: PowerUpType;
  duration: number;
  effectValue: number;
}

// パーティクルインターフェース
export interface Particle {
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
  update(deltaTime: number): void;
  render(ctx: CanvasRenderingContext2D): void;
  isAlive(): boolean;
}

// ゲーム状態
export interface GameStateInterface {
  isPlaying: boolean;
  isPaused: boolean;
  isGameOver: boolean;
  score: number;
  combo: number;
  wave: number;
  difficulty: Difficulty;
  enemiesDefeated: number;
  survivalTime: number;
}

// ゲーム状態の列挙型
export enum GameState {
  MENU = 'menu',
  PLAYING = 'playing',
  PAUSED = 'paused',
  GAME_OVER = 'gameOver'
}

// 難易度
export enum Difficulty {
  EASY = 'easy',
  NORMAL = 'normal',
  HARD = 'hard',
  EXTREME = 'extreme'
}

// 入力状態
export interface InputState {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  shoot: boolean;
}

// ゲーム設定
export interface GameSettings {
  volume: number;
  graphicsQuality: 'low' | 'medium' | 'high';
  showParticles: boolean;
  screenShake: boolean;
  autoFire: boolean;
}

// ハイスコアデータ
export interface HighScore {
  score: number;
  enemiesDefeated: number;
  survivalTime: number;
  difficulty: Difficulty;
  achievedAt: Date;
}

// 衝突判定用の矩形
export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

// ゲーム定数
export const GAME_CONSTANTS = {
  CANVAS_WIDTH: 1920,
  CANVAS_HEIGHT: 1080,
  PLAYER_SPEED: 300,
  PLAYER_FIRE_RATE: 0.2,
  PLAYER_HEALTH: 100,
  BULLET_SPEED: 800,
  ENEMY_BASE_SPEED: 100,
  POWERUP_DURATION: 5000,
  INVULNERABILITY_TIME: 2000,
  COMBO_TIMEOUT: 3000,
  PARTICLE_MAX_COUNT: 1000
} as const;