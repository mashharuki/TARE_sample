import { GameObject, Vector2D, BoundingBox, GAME_CONSTANTS } from '../types/game';

/**
 * 衝突判定ユーティリティクラス
 */
export class CollisionDetection {
  /**
   * 2つの矩形の衝突判定（エイリアス）
   */
  static rectRect(rect1: BoundingBox, rect2: BoundingBox): boolean {
    return this.checkRectCollision(rect1, rect2);
  }

  /**
   * 2つの矩形の衝突判定
   */
  static checkRectCollision(rect1: BoundingBox, rect2: BoundingBox): boolean {
    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y
    );
  }

  /**
   * ゲームオブジェクト同士の衝突判定
   */
  static checkGameObjectCollision(obj1: GameObject, obj2: GameObject): boolean {
    const rect1: BoundingBox = {
      x: obj1.x,
      y: obj1.y,
      width: obj1.width,
      height: obj1.height
    };

    const rect2: BoundingBox = {
      x: obj2.x,
      y: obj2.y,
      width: obj2.width,
      height: obj2.height
    };

    return this.checkRectCollision(rect1, rect2);
  }

  /**
   * 点と矩形の衝突判定
   */
  static checkPointInRect(point: Vector2D, rect: BoundingBox): boolean {
    return (
      point.x >= rect.x &&
      point.x <= rect.x + rect.width &&
      point.y >= rect.y &&
      point.y <= rect.y + rect.height
    );
  }

  /**
   * 円同士の衝突判定
   */
  static checkCircleCollision(
    center1: Vector2D,
    radius1: number,
    center2: Vector2D,
    radius2: number
  ): boolean {
    const dx = center1.x - center2.x;
    const dy = center1.y - center2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < radius1 + radius2;
  }

  /**
   * 画面境界の衝突判定
   */
  static checkBoundaryCollision(obj: GameObject, canvasWidth: number, canvasHeight: number): {
    left: boolean;
    right: boolean;
    top: boolean;
    bottom: boolean;
  } {
    return {
      left: obj.x <= 0,
      right: obj.x + obj.width >= canvasWidth,
      top: obj.y <= 0,
      bottom: obj.y + obj.height >= canvasHeight
    };
  }
}

/**
 * ユーティリティ関数
 */
export class GameUtils {
  /**
   * 2点間の距離を計算
   */
  static distance(p1: Vector2D, p2: Vector2D): number {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * 正規化されたベクトルを取得
   */
  static normalize(vector: Vector2D): Vector2D {
    const length = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
    if (length === 0) return { x: 0, y: 0 };
    return {
      x: vector.x / length,
      y: vector.y / length
    };
  }

  /**
   * ランダムな位置を生成（画面内）
   */
  static randomPosition(margin: number = 50): Vector2D {
    return {
      x: Math.random() * (GAME_CONSTANTS.CANVAS_WIDTH - margin * 2) + margin,
      y: Math.random() * (GAME_CONSTANTS.CANVAS_HEIGHT - margin * 2) + margin
    };
  }

  /**
   * ランダムな色を生成
   */
  static randomColor(): string {
    const colors = ['#00D4FF', '#FF006E', '#8338EC', '#3A86FF', '#06FFA5'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  /**
   * 角度からラジアンを計算
   */
  static degreesToRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  /**
   * ラジアンから角度を計算
   */
  static radiansToDegrees(radians: number): number {
    return radians * (180 / Math.PI);
  }

  /**
   * 2点間の角度を計算
   */
  static angleBetweenPoints(from: Vector2D, to: Vector2D): number {
    return Math.atan2(to.y - from.y, to.x - from.x);
  }

  /**
   * 指定された角度に基づいて速度ベクトルを作成
   */
  static velocityFromAngle(angle: number, speed: number): Vector2D {
    return {
      x: Math.cos(angle) * speed,
      y: Math.sin(angle) * speed
    };
  }

  /**
   * 値を指定された範囲に制限
   */
  static clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }

  /**
   * 線形補間
   */
  static lerp(start: number, end: number, factor: number): number {
    return start + (end - start) * factor;
  }

  /**
   * UUIDを生成
   */
  static generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}

/**
 * オブジェクトプーリングクラス
 */
export class ObjectPool<T> {
  private pool: T[] = [];
  private activeObjects: Set<T> = new Set();

  constructor(
    private createFn: () => T,
    private resetFn: (obj: T) => void,
    private initialSize: number = 10
  ) {
    this.initializePool();
  }

  private initializePool(): void {
    for (let i = 0; i < this.initialSize; i++) {
      this.pool.push(this.createFn());
    }
  }

  /**
   * オブジェクトを取得
   */
  get(): T {
    let obj: T;
    
    if (this.pool.length > 0) {
      obj = this.pool.pop()!;
    } else {
      obj = this.createFn();
    }

    this.activeObjects.add(obj);
    return obj;
  }

  /**
   * オブジェクトを返却
   */
  release(obj: T): void {
    if (!this.activeObjects.has(obj)) return;

    this.resetFn(obj);
    this.activeObjects.delete(obj);
    this.pool.push(obj);
  }

  /**
   * アクティブなオブジェクトを取得
   */
  getActiveObjects(): T[] {
    return Array.from(this.activeObjects);
  }

  /**
   * プールをクリア
   */
  clear(): void {
    this.activeObjects.clear();
    this.pool.length = 0;
    this.initializePool();
  }

  /**
   * アクティブなオブジェクト数を取得
   */
  getActiveCount(): number {
    return this.activeObjects.size;
  }

  /**
   * プールサイズを取得
   */
  getPoolSize(): number {
    return this.pool.length + this.activeObjects.size;
  }
}