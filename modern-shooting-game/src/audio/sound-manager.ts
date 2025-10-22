/**
 * サウンド管理クラス
 */
export class SoundManager {
  private static instance: SoundManager | null = null;
  private audioContext: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isMuted = false;
  private soundBuffers: Map<string, AudioBuffer> = new Map();

  constructor() {
    this.initializeAudio();
    SoundManager.instance = this;
  }

  /**
   * シングルトンインスタンスを取得
   */
  static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  /**
   * オーディオコンテキストを初期化
   */
  private async initializeAudio(): Promise<void> {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.masterGain = this.audioContext.createGain();
      this.masterGain.connect(this.audioContext.destination);
      this.masterGain.gain.value = 0.3; // マスター音量
    } catch (error) {
      console.warn('Web Audio APIがサポートされていません:', error);
    }
  }

  /**
   * ユーザージェスチャーでオーディオコンテキストを開始
   */
  async resumeAudioContext(): Promise<void> {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  /**
   * サウンドを生成（プロシージャル生成）
   */
  private createSound(type: 'laser' | 'explosion' | 'powerup' | 'hit' | 'select'): AudioBuffer | null {
    if (!this.audioContext) return null;

    const sampleRate = this.audioContext.sampleRate;
    const duration = this.getSoundDuration(type);
    const length = sampleRate * duration;
    const buffer = this.audioContext.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);

    switch (type) {
      case 'laser':
        this.generateLaserSound(data, sampleRate);
        break;
      case 'explosion':
        this.generateExplosionSound(data, sampleRate);
        break;
      case 'powerup':
        this.generatePowerupSound(data, sampleRate);
        break;
      case 'hit':
        this.generateHitSound(data, sampleRate);
        break;
      case 'select':
        this.generateSelectSound(data, sampleRate);
        break;
    }

    return buffer;
  }

  /**
   * レーザーサウンド生成
   */
  private generateLaserSound(data: Float32Array, sampleRate: number): void {
    const duration = 0.1;
    const length = Math.floor(sampleRate * duration);
    
    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate;
      if (i < length) {
        const frequency = 800 - (t * 400); // 周波数を下げる
        data[i] = Math.sin(2 * Math.PI * frequency * t) * Math.exp(-t * 20) * 0.3;
      } else {
        data[i] = 0;
      }
    }
  }

  /**
   * 爆発音生成
   */
  private generateExplosionSound(data: Float32Array, sampleRate: number): void {
    const duration = 0.3;
    const length = Math.floor(sampleRate * duration);
    
    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate;
      if (i < length) {
        // ノイズと低周波数の組み合わせ
        const noise = (Math.random() - 0.5) * 2;
        const lowFreq = Math.sin(2 * Math.PI * 60 * t) * 0.5;
        const envelope = Math.exp(-t * 8);
        data[i] = (noise + lowFreq) * envelope * 0.4;
      } else {
        data[i] = 0;
      }
    }
  }

  /**
   * パワーアップ音生成
   */
  private generatePowerupSound(data: Float32Array, sampleRate: number): void {
    const duration = 0.5;
    const length = Math.floor(sampleRate * duration);
    
    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate;
      if (i < length) {
        const frequency = 200 + (t * 600); // 周波数を上げる
        const envelope = Math.sin(Math.PI * t / duration) * 0.3;
        data[i] = Math.sin(2 * Math.PI * frequency * t) * envelope;
      } else {
        data[i] = 0;
      }
    }
  }

  /**
   * ヒット音生成
   */
  private generateHitSound(data: Float32Array, sampleRate: number): void {
    const duration = 0.05;
    const length = Math.floor(sampleRate * duration);
    
    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate;
      if (i < length) {
        const frequency = 1000;
        const envelope = Math.exp(-t * 30);
        data[i] = Math.sin(2 * Math.PI * frequency * t) * envelope * 0.2;
      } else {
        data[i] = 0;
      }
    }
  }

  /**
   * 選択音生成
   */
  private generateSelectSound(data: Float32Array, sampleRate: number): void {
    const duration = 0.1;
    const length = Math.floor(sampleRate * duration);
    
    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate;
      if (i < length) {
        const frequency = 440;
        const envelope = Math.exp(-t * 10);
        data[i] = Math.sin(2 * Math.PI * frequency * t) * envelope * 0.1;
      } else {
        data[i] = 0;
      }
    }
  }

  /**
   * サウンドの長さを取得
   */
  private getSoundDuration(type: string): number {
    const durations: Record<string, number> = {
      laser: 0.1,
      explosion: 0.3,
      powerup: 0.5,
      hit: 0.05,
      select: 0.1
    };
    return durations[type] || 0.1;
  }

  /**
   * サウンドを再生
   */
  async playSound(type: 'laser' | 'explosion' | 'powerup' | 'hit' | 'select'): Promise<void> {
    if (this.isMuted || !this.audioContext || !this.masterGain) return;

    try {
      // ユーザージェスチャーでオーディオコンテキストを開始
      await this.resumeAudioContext();

      let buffer = this.soundBuffers.get(type);
      if (!buffer) {
        buffer = this.createSound(type);
        if (buffer) {
          this.soundBuffers.set(type, buffer);
        }
      }

      if (buffer) {
        const source = this.audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(this.masterGain);
        source.start();
      }
    } catch (error) {
      console.warn('サウンドの再生に失敗しました:', error);
    }
  }

  /**
   * ミュート切り替え
   */
  toggleMute(): void {
    this.isMuted = !this.isMuted;
    if (this.masterGain) {
      this.masterGain.gain.value = this.isMuted ? 0 : 0.3;
    }
  }

  /**
   * マスター音量を設定
   */
  setMasterVolume(volume: number): void {
    if (this.masterGain) {
      this.masterGain.gain.value = this.isMuted ? 0 : Math.max(0, Math.min(1, volume));
    }
  }

  /**
   * ミュート状態を取得
   */
  getIsMuted(): boolean {
    return this.isMuted;
  }

  /**
   * リソースを解放
   */
  destroy(): void {
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    this.soundBuffers.clear();
    if (SoundManager.instance === this) {
      SoundManager.instance = null;
    }
  }
}