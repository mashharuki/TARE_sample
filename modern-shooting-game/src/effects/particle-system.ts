import { Vector2D } from '../types/game';

/**
 * パーティクルクラス
 */
export class GameParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
  gravity: number;
  friction: number;
  alpha: number;

  constructor(x: number, y: number, vx: number, vy: number, color: string, size: number, life: number) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.color = color;
    this.size = size;
    this.life = life;
    this.maxLife = life;
    this.gravity = 0.1;
    this.friction = 0.98;
    this.alpha = 1;
  }

  /**
   * パーティクルを更新
   */
  update(deltaTime: number): void {
    // 位置を更新
    this.x += this.vx * deltaTime;
    this.y += this.vy * deltaTime;

    // 速度を更新（重力と摩擦）
    this.vy += this.gravity * deltaTime;
    this.vx *= this.friction;
    this.vy *= this.friction;

    // ライフを減少
    this.life -= deltaTime * 1000;
    this.alpha = Math.max(0, this.life / this.maxLife);
  }

  /**
   * パーティクルを描画
   */
  render(ctx: CanvasRenderingContext2D): void {
    if (this.life <= 0) return;

    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  /**
   * パーティクルが生存しているか
   */
  isAlive(): boolean {
    return this.life > 0;
  }
}

/**
 * パーティクルエミッタークラス
 */
export class ParticleEmitter {
  private particles: GameParticle[] = [];

  /**
   * パーティクルを追加
   */
  addParticle(particle: GameParticle): void {
    this.particles.push(particle);
  }

  /**
   * 爆発エフェクトを作成
   */
  createExplosion(x: number, y: number, color: string, count: number = 15): void {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const speed = Math.random() * 300 + 100;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;
      const size = Math.random() * 4 + 2;
      const life = Math.random() * 1000 + 500;

      const particle = new GameParticle(x, y, vx, vy, color, size, life);
      this.addParticle(particle);
    }
  }

  /**
   * スパークエフェクトを作成
   */
  createSparks(x: number, y: number, color: string, count: number = 8): void {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 200 + 50;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;
      const size = Math.random() * 2 + 1;
      const life = Math.random() * 500 + 200;

      const particle = new GameParticle(x, y, vx, vy, color, size, life);
      this.addParticle(particle);
    }
  }

  /**
   * トレイルエフェクトを作成
   */
  createTrail(x: number, y: number, color: string, count: number = 5): void {
    for (let i = 0; i < count; i++) {
      const offsetX = (Math.random() - 0.5) * 20;
      const offsetY = (Math.random() - 0.5) * 20;
      const speed = Math.random() * 50;
      const angle = Math.random() * Math.PI * 2;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;
      const size = Math.random() * 3 + 1;
      const life = Math.random() * 300 + 100;

      const particle = new GameParticle(x + offsetX, y + offsetY, vx, vy, color, size, life);
      particle.gravity = 0.05;
      particle.friction = 0.95;
      this.addParticle(particle);
    }
  }

  /**
   * パワーアップエフェクトを作成
   */
  createPowerUpEffect(x: number, y: number, color: string): void {
    // 中心から放射状にパーティクルを放出
    for (let i = 0; i < 20; i++) {
      const angle = (Math.PI * 2 * i) / 20;
      const speed = Math.random() * 150 + 100;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;
      const size = Math.random() * 4 + 2;
      const life = Math.random() * 800 + 400;

      const particle = new GameParticle(x, y, vx, vy, color, size, life);
      particle.gravity = -0.05; // 上昇効果
      particle.friction = 0.96;
      this.addParticle(particle);
    }

    // 追加のスパーク
    this.createSparks(x, y, '#FFD700', 10);
  }

  /**
   * 更新処理
   */
  update(deltaTime: number): void {
    // パーティクルを更新
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i];
      particle.update(deltaTime);

      // 死んだパーティクルを削除
      if (!particle.isAlive()) {
        this.particles.splice(i, 1);
      }
    }
  }

  /**
   * 描画処理
   */
  render(ctx: CanvasRenderingContext2D): void {
    this.particles.forEach(particle => {
      particle.render(ctx);
    });
  }

  /**
   * パーティクルをクリア
   */
  clear(): void {
    this.particles.length = 0;
  }

  /**
   * パーティクル数を取得
   */
  getParticleCount(): number {
    return this.particles.length;
  }
}

/**
 * スクリーンシェイククラス
 */
export class ScreenShake {
  private intensity: number = 0;
  private duration: number = 0;
  private elapsed: number = 0;
  private offsetX: number = 0;
  private offsetY: number = 0;

  /**
   * シェイクを開始
   */
  shake(intensity: number, duration: number): void {
    this.intensity = intensity;
    this.duration = duration;
    this.elapsed = 0;
  }

  /**
   * 更新処理
   */
  update(deltaTime: number): void {
    if (this.elapsed >= this.duration) {
      this.offsetX = 0;
      this.offsetY = 0;
      return;
    }

    this.elapsed += deltaTime * 1000;
    const progress = this.elapsed / this.duration;
    const currentIntensity = this.intensity * (1 - progress);

    // ランダムなオフセットを生成
    this.offsetX = (Math.random() - 0.5) * currentIntensity;
    this.offsetY = (Math.random() - 0.5) * currentIntensity;
  }

  /**
   * シェイクをCanvasに適用
   */
  applyShake(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.translate(this.offsetX, this.offsetY);
  }

  /**
   * リセット
   */
  reset(): void {
    this.intensity = 0;
    this.duration = 0;
    this.elapsed = 0;
    this.offsetX = 0;
    this.offsetY = 0;
  }
}