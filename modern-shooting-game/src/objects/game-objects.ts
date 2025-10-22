import { Player, Vector2D, Bullet, Enemy, PowerUp, EnemyType, PowerUpType, GameSettings, BoundingBox, AttackPattern } from '../types/game';
import { GameUtils, CollisionDetection } from '../utils/collision-detection';

/**
 * プレイヤークラス
 */
export class GamePlayer implements Player {
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
  speed: number;
  fireRate: number;
  lastShotTime: number;
  isInvulnerable: boolean;
  invulnerabilityTime: number;
  powerUps: PowerUpType[];
  color: string;
  powerLevel: number;
  private baseSpeed: number;

  constructor(x: number, y: number) {
    this.id = Math.random().toString(36).substr(2, 9);
    this.x = x;
    this.y = y;
    this.width = 40;
    this.height = 40;
    this.velocityX = 0;
    this.velocityY = 0;
    this.health = 3;
    this.maxHealth = 3;
    this.isActive = true;
    this.speed = 300;
    this.baseSpeed = 300;
    this.fireRate = 0.2;
    this.lastShotTime = 0;
    this.isInvulnerable = false;
    this.invulnerabilityTime = 0;
    this.powerUps = [];
    this.color = '#00D4FF'; // サイアン
    this.powerLevel = 1;
  }

  update(deltaTime: number): void {
    // プレイヤーの移動はGameEngineで処理される
    // 無敵時間の更新
    if (this.isInvulnerable) {
      this.invulnerabilityTime -= deltaTime * 1000;
      if (this.invulnerabilityTime <= 0) {
        this.isInvulnerable = false;
      }
    }
  }

  // update(deltaTime: number): void {
  //   // 基本的な更新処理（移動なし）
  //   if (this.isInvulnerable) {
  //     this.invulnerabilityTime -= deltaTime * 1000;
  //     if (this.invulnerabilityTime <= 0) {
  //       this.isInvulnerable = false;
  //     }
  //   }
  // }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.save();

    // 無敵時間中は点滅
    if (this.isInvulnerable && Math.floor(Date.now() / 100) % 2 === 0) {
      ctx.globalAlpha = 0.5;
    }

    // プレイヤー本体の描画（三角形）
    ctx.fillStyle = this.color;
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;

    // 発光効果
    ctx.shadowBlur = 20;
    ctx.shadowColor = this.color;

    ctx.beginPath();
    ctx.moveTo(this.x, this.y - this.height / 2);
    ctx.lineTo(this.x - this.width / 2, this.y + this.height / 2);
    ctx.lineTo(this.x + this.width / 2, this.y + this.height / 2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // パワーレベルに応じてエンジンエフェクト
    if (this.powerLevel > 1) {
      ctx.fillStyle = '#FF006E'; // ピンク
      ctx.beginPath();
      ctx.arc(this.x, this.y + this.height / 2 + 10, 5 * this.powerLevel, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  shoot(currentTime: number): Bullet | null {
    const shootDelay = (this.fireRate - (this.powerLevel * 0.02)) * 1000; // パワーレベルで連射速度向上
    if (currentTime - this.lastShotTime < shootDelay) {
      return null;
    }

    this.lastShotTime = currentTime;
    
    // パワーレベルに応じて複数の弾を発射
    const baseBullet = new GameBullet(this.x, this.y - this.height / 2, 0, -600, true, this.powerLevel);
    
    if (this.powerLevel >= 2) {
      // 2way弾
      return baseBullet; // 簡易実装のため最初の弾のみ返す
    } else {
      return baseBullet;
    }
  }

  // update(deltaTime: number): void {
  //   // 無敵時間の更新
  //   if (this.isInvulnerable) {
  //     this.invulnerabilityTime -= deltaTime * 1000;
  //     if (this.invulnerabilityTime <= 0) {
  //       this.isInvulnerable = false;
  //     }
  //   }
  // }

  onCollision(other: any): void {
    // 衝突処理はGameEngineで行う
  }

  takeDamage(amount: number): void {
    if (this.isInvulnerable) return;

    this.health -= amount;
    this.isInvulnerable = true;
    this.invulnerabilityTime = 1000; // 1秒間無敵
  }

  heal(amount: number): void {
    this.health = Math.min(this.maxHealth, this.health + amount);
  }

  upgradePower(): void {
    this.powerLevel = Math.min(3, this.powerLevel + 1);
  }

  increaseSpeed(amount: number): void {
    this.speed = Math.min(500, this.speed + amount);
  }

  getBoundingBox(): BoundingBox {
    return {
      x: this.x - this.width / 2,
      y: this.y - this.height / 2,
      width: this.width,
      height: this.height
    };
  }

  isDead(): boolean {
    return this.health <= 0;
  }
}

/**
 * 弾クラス
 */
export class GameBullet implements Bullet {
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
  isPlayerBullet: boolean;
  damage: number;
  color: string;

  constructor(
    x: number,
    y: number,
    velocityX: number,
    velocityY: number,
    isPlayerBullet: boolean,
    damage: number = 1
  ) {
    this.id = Math.random().toString(36).substr(2, 9);
    this.x = x;
    this.y = y;
    this.width = 4;
    this.height = 12;
    this.velocityX = velocityX;
    this.velocityY = velocityY;
    this.health = 1;
    this.maxHealth = 1;
    this.isActive = true;
    this.isPlayerBullet = isPlayerBullet;
    this.damage = damage;
    this.color = isPlayerBullet ? '#00D4FF' : '#FF006E';
  }

  update(deltaTime: number): void {
    this.x += this.velocityX * deltaTime;
    this.y += this.velocityY * deltaTime;
  }

  onCollision(other: any): void {
    // 弾は衝突時に非アクティブにする
    this.isActive = false;
  }

  takeDamage(amount: number): void {
    // パワーアップはダメージを受けない
  }

  isDead(): boolean {
    return !this.isActive;
  }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    
    // 発光効果
    ctx.shadowBlur = 10;
    ctx.shadowColor = this.color;
    
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
    
    ctx.restore();
  }

  isOffScreen(screenWidth: number, screenHeight: number): boolean {
    return this.x < -this.width || this.x > screenWidth + this.width ||
           this.y < -this.height || this.y > screenHeight + this.height;
  }

  getBoundingBox(): BoundingBox {
    return {
      x: this.x - this.width / 2,
      y: this.y - this.height / 2,
      width: this.width,
      height: this.height
    };
  }
}

/**
 * 敵クラス
 */
export class GameEnemy implements Enemy {
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
  color: string;
  type: EnemyType;
  lastShot: number;
  shootInterval: number;
  movePattern: number;
  moveTimer: number;
  scoreValue: number;
  attackPattern: AttackPattern;
  lastAttackTime: number;
  speed: number;

  constructor(x: number, y: number, type: EnemyType) {
    this.id = Math.random().toString(36).substr(2, 9);
    this.type = type;
    this.x = x;
    this.y = y;
    this.velocityX = 0;
    this.velocityY = 0;
    this.isActive = true;
    this.lastShot = 0;
    this.lastAttackTime = 0;

    // タイプに応じて初期値を設定
    switch (type) {
      case EnemyType.BASIC:
        this.width = 30;
        this.height = 30;
        this.health = 1;
        this.maxHealth = 1;
        this.speed = 100;
        this.color = '#FF006E'; // ピンク
        this.scoreValue = 100;
        this.shootInterval = 1500;
        this.attackPattern = { type: 'single' as const, damage: 1, fireRate: 1.5, bulletSpeed: 300 };
        break;
      case EnemyType.FAST:
        this.width = 25;
        this.height = 25;
        this.health = 1;
        this.maxHealth = 1;
        this.speed = 200;
        this.color = '#00D4FF'; // サイアン
        this.scoreValue = 150;
        this.shootInterval = 1000;
        this.attackPattern = { type: 'single' as const, damage: 1, fireRate: 1.0, bulletSpeed: 400 };
        break;
      case EnemyType.HEAVY:
        this.width = 40;
        this.height = 40;
        this.health = 3;
        this.maxHealth = 3;
        this.speed = 50;
        this.color = '#FFD700'; // ゴールド
        this.scoreValue = 300;
        this.shootInterval = 2000;
        this.attackPattern = { type: 'single' as const, damage: 2, fireRate: 2.0, bulletSpeed: 250 };
        break;
      case EnemyType.BOSS:
        this.width = 60;
        this.height = 60;
        this.health = 10;
        this.maxHealth = 10;
        this.speed = 30;
        this.color = '#9400D3'; // バイオレット
        this.scoreValue = 1000;
        this.shootInterval = 800;
        this.attackPattern = { type: 'burst' as const, damage: 3, fireRate: 0.8, bulletSpeed: 350 };
        break;
    }
  }

  // update(deltaTime: number, playerX: number, playerY: number): void {
  //   this.moveTimer += deltaTime;

  //   // 移動パターンに応じて動作
  //   switch (this.movePattern) {
  //     case 0: // 直進
  //       this.y += this.speed * deltaTime;
  //       break;
  //     case 1: // ジグザグ
  //       this.x += Math.sin(this.moveTimer * 3) * 150 * deltaTime;
  //       this.y += this.speed * deltaTime;
  //       break;
  //     case 2: // ホーミング
  //       const dx = playerX - this.x;
  //       const dy = playerY - this.y;
  //       const distance = Math.sqrt(dx * dx + dy * dy);
  //       if (distance > 0) {
  //         this.x += (dx / distance) * this.speed * deltaTime;
  //         this.y += (dy / distance) * this.speed * deltaTime;
  //       }
  //       break;
  //     case 3: // ボスの円運動
  //       this.x += Math.cos(this.moveTimer * 2) * 100 * deltaTime;
  //       this.y += this.speed * deltaTime;
  //       break;
  //   }
  // }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.save();

    // 発光効果
    ctx.shadowBlur = 15;
    ctx.shadowColor = this.color;

    // 敵本体の描画（四角形または円）
    ctx.fillStyle = this.color;
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;

    if (this.type === EnemyType.BOSS) {
      // ボスは円形
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.width / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    } else {
      // 通常敵は四角形
      ctx.fillRect(
        this.x - this.width / 2,
        this.y - this.height / 2,
        this.width,
        this.height
      );
      ctx.strokeRect(
        this.x - this.width / 2,
        this.y - this.height / 2,
        this.width,
        this.height
      );
    }

    // 体力バー
    if (this.health < this.maxHealth) {
      const barWidth = this.width;
      const barHeight = 4;
      const healthRatio = this.health / this.maxHealth;

      ctx.fillStyle = '#FF0000';
      ctx.fillRect(this.x - barWidth / 2, this.y - this.height / 2 - 10, barWidth, barHeight);

      ctx.fillStyle = '#00FF00';
      ctx.fillRect(this.x - barWidth / 2, this.y - this.height / 2 - 10, barWidth * healthRatio, barHeight);
    }

    ctx.restore();
  }

  shoot(currentTime: number, playerX: number, playerY: number): Bullet | null {
    if (currentTime - this.lastAttackTime < this.shootInterval) {
      return null;
    }

    this.lastAttackTime = currentTime;

    // プレイヤーに向けて弾を発射
    const dx = playerX - this.x;
    const dy = playerY - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 0) {
      const velocityX = (dx / distance) * this.attackPattern.bulletSpeed;
      const velocityY = (dy / distance) * this.attackPattern.bulletSpeed;

      return new GameBullet(this.x, this.y + this.height / 2, velocityX, velocityY, false, this.attackPattern.damage);
    }

    return null;
  }

  update(deltaTime: number): void {
    // 基本的な移動（下方向）
    this.y += this.speed * deltaTime;
  }

  onCollision(other: any): void {
    // 衝突処理はGameEngineで行う
  }

  takeDamage(amount: number): void {
    this.health -= amount;
  }

  isOffScreen(screenHeight: number): boolean {
    return this.y > screenHeight + this.height;
  }

  getBoundingBox(): BoundingBox {
    return {
      x: this.x - this.width / 2,
      y: this.y - this.height / 2,
      width: this.width,
      height: this.height
    };
  }

  isDead(): boolean {
    return this.health <= 0;
  }
}

/**
 * パワーアップクラス
 */
export class GamePowerUp implements PowerUp {
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
  type: PowerUpType;
  duration: number;
  effectValue: number;
  color: string;
  speed: number;
  pulsePhase: number;

  constructor(x: number, y: number, type: PowerUpType) {
    this.id = Math.random().toString(36).substr(2, 9);
    this.x = x;
    this.y = y;
    this.width = 25;
    this.height = 25;
    this.velocityX = 0;
    this.velocityY = 100;
    this.health = 1;
    this.maxHealth = 1;
    this.isActive = true;
    this.type = type;
    this.duration = 5000;
    this.effectValue = 1;
    this.speed = 100;
    this.pulsePhase = 0;

    // タイプに応じて色を設定
    switch (type) {
      case PowerUpType.HEALTH:
        this.color = '#00FF00';
        break;
      case PowerUpType.POWER:
        this.color = '#FFD700';
        break;
      case PowerUpType.SPEED:
        this.color = '#00BFFF';
        break;
      case PowerUpType.SCORE:
        this.color = '#FF69B4';
        break;
      case PowerUpType.HEALTH_RESTORE:
        this.color = '#00FF00';
        break;
      case PowerUpType.DAMAGE_UP:
        this.color = '#FFD700';
        break;
      case PowerUpType.SPEED_BOOST:
        this.color = '#00BFFF';
        break;
      case PowerUpType.SHIELD:
        this.color = '#FF69B4';
        break;
      case PowerUpType.FIRE_RATE_UP:
        this.color = '#FFA500';
        break;
    }
  }

  update(deltaTime: number): void {
    this.y += this.speed * deltaTime;
    this.pulsePhase += deltaTime * 5;
  }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.save();

    // パルス効果
    const pulseScale = 1 + Math.sin(this.pulsePhase) * 0.2;
    const currentSize = this.width * pulseScale;

    // 発光効果
    ctx.shadowBlur = 20;
    ctx.shadowColor = this.color;

    // パワーアップアイテムの描画
    ctx.fillStyle = this.color;
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;

    // タイプに応じた形状
    switch (this.type) {
      case PowerUpType.HEALTH:
        // ハート形
        this.drawHeart(ctx, this.x, this.y, currentSize / 2);
        break;
      case PowerUpType.POWER:
        // 星形
        this.drawStar(ctx, this.x, this.y, currentSize / 2);
        break;
      case PowerUpType.SPEED:
        // 矢印
        this.drawArrow(ctx, this.x, this.y, currentSize);
        break;
      case PowerUpType.SCORE:
        // ダイヤモンド
        this.drawDiamond(ctx, this.x, this.y, currentSize / 2);
        break;
    }

    ctx.restore();
  }

  private drawHeart(ctx: CanvasRenderingContext2D, x: number, y: number, size: number): void {
    ctx.beginPath();
    ctx.moveTo(x, y + size / 2);
    ctx.bezierCurveTo(x - size, y - size / 2, x - size, y - size, x, y - size / 4);
    ctx.bezierCurveTo(x + size, y - size, x + size, y - size / 2, x, y + size / 2);
    ctx.fill();
    ctx.stroke();
  }

  private drawStar(ctx: CanvasRenderingContext2D, x: number, y: number, size: number): void {
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
      const px = x + Math.cos(angle) * size;
      const py = y + Math.sin(angle) * size;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  private drawArrow(ctx: CanvasRenderingContext2D, x: number, y: number, size: number): void {
    ctx.beginPath();
    ctx.moveTo(x, y - size / 2);
    ctx.lineTo(x + size / 3, y);
    ctx.lineTo(x, y + size / 2);
    ctx.lineTo(x - size / 3, y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  private drawDiamond(ctx: CanvasRenderingContext2D, x: number, y: number, size: number): void {
    ctx.beginPath();
    ctx.moveTo(x, y - size);
    ctx.lineTo(x + size, y);
    ctx.lineTo(x, y + size);
    ctx.lineTo(x - size, y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  isOffScreen(screenHeight: number): boolean {
    return this.y > screenHeight + this.height;
  }

  getBoundingBox(): BoundingBox {
    return {
      x: this.x - this.width / 2,
      y: this.y - this.height / 2,
      width: this.width,
      height: this.height
    };
  }

  onCollision(other: any): void {
    // 衝突処理はGameEngineで行う
  }

  takeDamage(amount: number): void {
    // パワーアップはダメージを受けない
  }
}