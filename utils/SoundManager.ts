import { Audio } from 'expo-av';

export class SoundManager {
  private static instance: SoundManager;
  private backgroundMusic: Audio.Sound | null = null;
  private soundEffects: { [key: string]: Audio.Sound } = {};
  private isMuted = false;

  private constructor() {}

  static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  async initializeSounds() {
    try {
      // Configure audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: false,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      // Try to load local audio files with proper error handling
      await this.loadBackgroundMusic();
      await this.loadSoundEffects();

    } catch (error) {
      console.log('Failed to initialize sounds', error);
    }
  }

  async playSound(soundName: string, volume: number = 1.0) {
    if (this.isMuted) return;

    try {
      const sound = this.soundEffects[soundName];
      if (sound) {
        const status = await sound.getStatusAsync();
        if (status.isLoaded) {
          await sound.setVolumeAsync(volume);
          await sound.setPositionAsync(0); // Reset to beginning
          await sound.playAsync();
          console.log(`🔊 Playing sound: ${soundName}`);
        } else {
          console.log(`Sound not loaded: ${soundName}`);
        }
      } else {
        console.log(`Sound not found: ${soundName} - creating beep fallback`);
        // Create a simple beep as fallback
        this.createBeepSound(soundName);
      }
    } catch (error) {
      console.log(`Error playing sound: ${soundName}`, error);
    }
  }

  private async loadBackgroundMusic() {
    try {
      const { sound: bgMusic } = await Audio.Sound.createAsync(
        require('../assets/sounds/bgm.mp3'),
        { shouldPlay: false, isLooping: true, volume: 0.2 }
      );
      this.backgroundMusic = bgMusic;
      console.log('✅ Background music loaded: bgm.mp3');
    } catch (error) {
      console.log('❌ Failed to load bgm.mp3:', error);
      this.backgroundMusic = null;
    }
  }

  private async loadSoundEffects() {
    // Load cardFlip
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../assets/sounds/card-flip.mp3'),
        { shouldPlay: false, volume: 0.7 }
      );
      this.soundEffects.cardFlip = sound;
      console.log(`✅ Loaded sound: cardFlip`);
    } catch (error) {
      console.log(`❌ Failed to load cardFlip:`, error);
    }

    // Load cardMatch
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../assets/sounds/card-match.mp3'),
        { shouldPlay: false, volume: 0.7 }
      );
      this.soundEffects.cardMatch = sound;
      console.log(`✅ Loaded sound: cardMatch`);
    } catch (error) {
      console.log(`❌ Failed to load cardMatch:`, error);
    }

    // Load cardWrong
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../assets/sounds/card-wrong.mp3'),
        { shouldPlay: false, volume: 0.7 }
      );
      this.soundEffects.cardWrong = sound;
      console.log(`✅ Loaded sound: cardWrong`);
    } catch (error) {
      console.log(`❌ Failed to load cardWrong:`, error);
    }

    // Load tick
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../assets/sounds/tick.mp3'),
        { shouldPlay: false, volume: 0.7 }
      );
      this.soundEffects.tick = sound;
      console.log(`✅ Loaded sound: tick`);
    } catch (error) {
      console.log(`❌ Failed to load tick:`, error);
    }

    // For gameComplete, use cardMatch as fallback since game-complete.mp3 is missing
    if (this.soundEffects.cardMatch) {
      this.soundEffects.gameComplete = this.soundEffects.cardMatch;
      console.log(`✅ Using cardMatch sound for gameComplete (fallback)`);
    }
  }

  private createBeepSound(soundName: string) {
    // Simple console beep as ultimate fallback
    console.log(`🔊 BEEP (${soundName})`);
  }

  async playBackgroundMusic() {
    if (this.isMuted || !this.backgroundMusic) return;

    try {
      const status = await this.backgroundMusic.getStatusAsync();
      if (status.isLoaded && !status.isPlaying) {
        await this.backgroundMusic.setVolumeAsync(0.2);
        await this.backgroundMusic.playAsync();
        console.log('🎵 Background music started');
      }
    } catch (error) {
      console.log('Error playing background music', error);
    }
  }

  async stopBackgroundMusic() {
    if (!this.backgroundMusic) return;

    try {
      const status = await this.backgroundMusic.getStatusAsync();
      if (status.isLoaded && status.isPlaying) {
        await this.backgroundMusic.stopAsync();
        console.log('🎵 Background music stopped');
      }
    } catch (error) {
      console.log('Error stopping background music', error);
    }
  }

  async pauseBackgroundMusic() {
    if (!this.backgroundMusic) return;

    try {
      const status = await this.backgroundMusic.getStatusAsync();
      if (status.isLoaded && status.isPlaying) {
        await this.backgroundMusic.pauseAsync();
        console.log('🎵 Background music paused');
      }
    } catch (error) {
      console.log('Error pausing background music', error);
    }
  }

  setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stopBackgroundMusic();
    }
  }

  isSoundMuted(): boolean {
    return this.isMuted;
  }

  async cleanup() {
    try {
      // Stop and cleanup all sounds
      for (const sound of Object.values(this.soundEffects)) {
        await sound.unloadAsync();
      }
      
      if (this.backgroundMusic) {
        await this.backgroundMusic.unloadAsync();
      }
      console.log('🔊 Sound cleanup completed');
    } catch (error) {
      console.log('Error cleaning up sounds', error);
    }
  }
}

export const soundManager = SoundManager.getInstance(); 