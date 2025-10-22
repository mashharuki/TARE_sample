import { GameObject, InputState, GameState, EnemyType, PowerUpType } from '../types/game';
import { GamePlayer, GameBullet, GameEnemy, GamePowerUp } from '../objects/game-objects';
import { ParticleEmitter, ScreenShake } from '../effects/particle-system';
import { SoundManager } from '../audio/sound-manager';
import { CollisionDetection } from '../utils/collision-detection';

/**
 * ゲームエンジンクラス
 */
export class GameEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private gameObjects: GameObject[] = [];
  private player: GamePlayer | null = null;
  private particleEmitter: ParticleEmitter;
  private screenShake: ScreenShake;
  private soundManager: SoundManager;
  private score: number = 0;
  private wave: number = 1;
  private enemySpawnTimer: number = 0;
  private enemySpawnInterval: number = 2000; // 2秒ごと
  private lastTime: number = 0;
  private gameState: GameState = GameState.PLAYING;

  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.particleEmitter = new ParticleEmitter();
    this.screenShake = new ScreenShake();
    this.soundManager = new SoundManager();
    
    this.initializeGame();
  }

  /**
   * ゲームの初期化
   */
  private initializeGame(): void {
    // プレイヤーを作成
    this.player = new GamePlayer(this.canvas.width / 4, this.canvas.height - 100);
    this.addGameObject(this.player);
    
    // 初期スコアとウェーブを設定
    this.score = 0;
    this.wave = 1;
    this.gameState = GameState.PLAYING;
  }

  /**
   * ゲームオブジェクトを追加
   */
  addGameObject(object: GameObject): void {
    this.gameObjects.push(object);
  }

  /**
   * ゲームオブジェクトを削除
   */
  removeGameObject(object: GameObject): void {
    const index = this.gameObjects.indexOf(object);
    if (index > -1) {
      this.gameObjects.splice(index, 1);
    }
  }

  /**
   * 更新処理
   */
  update(deltaTime: number, input: InputState): void {
    if (this.gameState !== GameState.PLAYING) return;

    // スクリーンシェイクを更新
    this.screenShake.update(deltaTime);

    // パーティクルを更新
    this.particleEmitter.update(deltaTime);

    // プレイヤーを更新
    if (this.player && !this.player.isDead()) {
      this.player.update(deltaTime);
      
      // プレイヤーの射撃
      if (input.shoot) {
        const bullet = this.player.shoot(Date.now());
        if (bullet) {
          this.addGameObject(bullet);
          this.soundManager.playSound('laser');
        }
      }
    }

    // 敵のスポーン
    this.spawnEnemies(deltaTime);

    // ゲームオブジェクトを更新
    for (let i = this.gameObjects.length - 1; i >= 0; i--) {
      const object = this.gameObjects[i];
      
      if (object instanceof GameBullet) {
        object.update(deltaTime);
        
        // 画面外に出た弾を削除
        if (object.isOffScreen(this.canvas.width, this.canvas.height)) {
          this.removeGameObject(object);
          continue;
        }
      } else if (object instanceof GameEnemy) {
        object.update(deltaTime);
        
        // 敵の射撃
        const enemyBullet = object.shoot(Date.now(), this.player?.x || 0, this.player?.y || 0);
        if (enemyBullet) {
          this.addGameObject(enemyBullet);
        }
        
        // 画面外に出た敵を削除
        if (object.isOffScreen(this.canvas.height)) {
          this.removeGameObject(object);
          continue;
        }
      } else if (object instanceof GamePowerUp) {
        object.update(deltaTime);
        
        // 画面外に出たパワーアップを削除
        if (object.isOffScreen(this.canvas.height)) {
          this.removeGameObject(object);
          continue;
        }
      }
    }

    // 衝突判定
    this.checkCollisions();

    // ウェーブ管理
    this.updateWave();
  }

  /**
   * 敵のスポーン
   */
  private spawnEnemies(deltaTime: number): void {
    this.enemySpawnTimer += deltaTime * 1000;
    
    if (this.enemySpawnTimer >= this.enemySpawnInterval) {
      this.enemySpawnTimer = 0;
      
      // ランダムな位置に敵を生成
      const x = Math.random() * (this.canvas.width - 100) + 50;
      const y = -50;
      
      // ウェーブに応じて敵のタイプを選択
      let enemyType: EnemyType;
      const rand = Math.random();
      
      if (this.wave >= 5 && rand < 0.1) {
        enemyType = EnemyType.BOSS;
      } else if (this.wave >= 3 && rand < 0.3) {
        enemyType = EnemyType.HEAVY;
      } else if (this.wave >= 2 && rand < 0.5) {
        enemyType = EnemyType.FAST;
      } else {
        enemyType = EnemyType.BASIC;
      }
      
      const enemy = new GameEnemy(x, y, enemyType);
      this.addGameObject(enemy);
    }
  }

  /**
   * 衝突判定
   */
  private checkCollisions(): void {
    if (!this.player || this.player.isDead()) return;

    const playerBox = this.player.getBoundingBox();

    for (let i = this.gameObjects.length - 1; i >= 0; i--) {
      const object = this.gameObjects[i];

      // プレイヤーと敵の衝突
      if (object instanceof GameEnemy) {
        const enemyBox = object.getBoundingBox();
        if (CollisionDetection.rectRect(playerBox, enemyBox)) {
          // プレイヤーにダメージ
          this.player.takeDamage(1);
          if (this.player.isDead()) {
            this.gameState = GameState.GAME_OVER;
          }
          
          // 敵を倒す
          object.takeDamage(1);
          this.score += object.scoreValue;
          
          // エフェクト
          this.particleEmitter.createExplosion(object.x, object.y, '#FF006E', 15);
          this.screenShake.shake(10, 200);
          
          this.removeGameObject(object);
          continue;
        }
      }

      // プレイヤーと敵の弾の衝突
      if (object instanceof GameBullet && !object.isPlayerBullet) {
        const bulletBox = object.getBoundingBox();
        if (CollisionDetection.rectRect(playerBox, bulletBox)) {
          // プレイヤーにダメージ
          this.player.takeDamage(1);
          if (this.player.isDead()) {
            this.gameState = GameState.GAME_OVER;
          }
          
          // エフェクト
          this.particleEmitter.createSparks(object.x, object.y, '#FF006E', 8);
          this.screenShake.shake(5, 150);
          
          this.removeGameObject(object);
          continue;
        }
      }

      // プレイヤーの弾と敵の衝突
      if (object instanceof GameBullet && object.isPlayerBullet) {
        const bulletBox = object.getBoundingBox();
        
        for (let j = this.gameObjects.length - 1; j >= 0; j--) {
          const target = this.gameObjects[j];
          
          if (target instanceof GameEnemy) {
            const enemyBox = target.getBoundingBox();
            if (CollisionDetection.rectRect(bulletBox, enemyBox)) {
              // 敵にダメージ
              target.takeDamage(object.damage);
              if (target.isDead()) {
                this.score += target.scoreValue;
                
                // パワーアップのドロップ（確率）
                if (Math.random() < 0.2) {
                  const powerUpTypes = [PowerUpType.HEALTH, PowerUpType.POWER, PowerUpType.SPEED, PowerUpType.SCORE];
                  const randomType = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
                  const powerUp = new GamePowerUp(target.x, target.y, randomType);
                  this.addGameObject(powerUp);
                }
                
                // 大きな爆発エフェクト
                this.particleEmitter.createExplosion(target.x, target.y, '#00D4FF', 20);
                this.screenShake.shake(15, 300);
                this.soundManager.playSound('explosion');
                
                this.removeGameObject(target);
              } else {
                // ダメージを与えたが倒せなかった
                this.particleEmitter.createSparks(target.x, target.y, '#FFD700', 5);
                this.screenShake.shake(5, 100);
              }
              
              this.removeGameObject(object);
              break;
            }
          }
        }
      }

      // プレイヤーとパワーアップの衝突
      if (object instanceof GamePowerUp) {
        const powerUpBox = object.getBoundingBox();
        if (CollisionDetection.rectRect(playerBox, powerUpBox)) {
          // パワーアップ効果を適用
        this.applyPowerUp(object.type);
        this.soundManager.playSound('powerup');
          
          // パワーアップエフェクト
          this.particleEmitter.createPowerUpEffect(object.x, object.y, object.color);
          
          this.removeGameObject(object);
          continue;
        }
      }
    }
  }

  /**
   * パワーアップ効果を適用
   */
  private applyPowerUp(type: PowerUpType): void {
    if (!this.player) return;

    switch (type) {
      case PowerUpType.HEALTH:
        this.player.heal(1);
        break;
      case PowerUpType.POWER:
        this.player.upgradePower();
        break;
      case PowerUpType.SPEED:
        this.player.increaseSpeed(50);
        break;
      case PowerUpType.SCORE:
        this.score += 500;
        break;
    }
  }

  /**
   * ウェーブの更新
   */
  private updateWave(): void {
    // 一定のスコアに達したらウェーブを上げる
    const nextWaveScore = this.wave * 1000;
    if (this.score >= nextWaveScore) {
      this.wave++;
      // スポーン間隔を短縮
      this.enemySpawnInterval = Math.max(500, this.enemySpawnInterval - 100);
    }
  }

  /**
   * 描画処理
   */
  render(): void {
    // 画面をクリア
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // 背景を描画
    this.renderBackground();

    // スクリーンシェイクを適用
    this.screenShake.applyShake(this.ctx);

    // ゲームオブジェクトを描画
    this.gameObjects.forEach(object => {
      object.render(this.ctx);
    });

    // パーティクルを描画
    this.particleEmitter.render(this.ctx);

    // スクリーンシェイクをリセット
    this.ctx.restore();

    // デバッグ情報を描画
    this.renderDebugInfo();
  }

  /**
   * 背景を描画
   */
  private renderBackground(): void {
    // グラデーション背景
    const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(1, '#16213e');
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // 星の描画
    this.ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 100; i++) {
      const x = (i * 137.5) % this.canvas.width;
      const y = (i * 73.2) % this.canvas.height;
      const size = Math.sin(Date.now() * 0.001 + i) * 0.5 + 1;
      this.ctx.beginPath();
      this.ctx.arc(x, y, size, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  /**
   * デバッグ情報を描画
   */
  private renderDebugInfo(): void {
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = '14px monospace';
    this.ctx.fillText(`Score: ${this.score}`, 10, 30);
    this.ctx.fillText(`Wave: ${this.wave}`, 10, 50);
    this.ctx.fillText(`Objects: ${this.gameObjects.length}`, 10, 70);
    this.ctx.fillText(`Particles: ${this.particleEmitter.getParticleCount()}`, 10, 90);
  }

  /**
   * スコアを取得
   */
  getScore(): number {
    return this.score;
  }

  /**
   * プレイヤーのライフを取得
   */
  getPlayerLives(): number {
    return this.player?.health || 0;
  }

  /**
   * ウェーブを取得
   */
  getWave(): number {
    return this.wave;
  }

  /**
   * ゲーム状態を取得
   */
  getGameState(): GameState {
    return this.gameState;
  }

  /**
   * ゲームを破棄
   */
  destroy(): void {
    this.gameObjects.length = 0;
    this.particleEmitter.clear();
    this.screenShake.reset();
    this.soundManager.destroy();
  }
}