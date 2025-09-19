import React, { useRef, useEffect } from 'react';

const SoundEffects = () => {
  const audioRefs = useRef({});

  useEffect(() => {
    // Create audio contexts for different sounds
    const createAudioContext = () => {
      try {
        return new (window.AudioContext || window.webkitAudioContext)();
      } catch (e) {
        console.log('Web Audio API not supported');
        return null;
      }
    };

    const audioContext = createAudioContext();

    // Load MP3 audio file
    const loadMP3Audio = () => {
      const audio = new Audio('/durga-puja-dhak2.mp3');
      audio.preload = 'auto';
      audio.volume = 0.3;
      return audio;
    };

    // Create bell sound (for button clicks)
    const createBellSound = () => {
      if (!audioContext) return null;
      
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
      
      return oscillator;
    };

    // Create conch sound (for navigation)
    const createConchSound = () => {
      if (!audioContext) return null;
      
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(150, audioContext.currentTime + 0.5);
      
      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.8);
      
      return oscillator;
    };

    // Create festive sound (for page transitions)
    const createFestiveSound = () => {
      if (!audioContext) return null;
      
      const oscillator1 = audioContext.createOscillator();
      const oscillator2 = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator1.connect(gainNode);
      oscillator2.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator1.frequency.setValueAtTime(523, audioContext.currentTime); // C5
      oscillator2.frequency.setValueAtTime(659, audioContext.currentTime); // E5
      
      gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
      
      oscillator1.start(audioContext.currentTime);
      oscillator2.start(audioContext.currentTime);
      oscillator1.stop(audioContext.currentTime + 0.4);
      oscillator2.stop(audioContext.currentTime + 0.4);
      
      return { oscillator1, oscillator2 };
    };

    // Store sound functions
    audioRefs.current = {
      bell: createBellSound,
      conch: createConchSound,
      festive: createFestiveSound,
      dhak: loadMP3Audio,
      audioContext
    };

    return () => {
      if (audioContext) {
        audioContext.close();
      }
    };
  }, []);

  // Play sound function
  const playSound = (soundType) => {
    if (audioRefs.current[soundType]) {
      try {
        if (soundType === 'dhak') {
          // Play MP3 audio with auto-stop after 10 seconds
          const audio = audioRefs.current[soundType]();
          audio.currentTime = 0;
          audio.play().catch(e => console.log('Audio play failed:', e));
          
          // Stop audio after 10 seconds
          setTimeout(() => {
            if (audio && !audio.paused) {
              audio.pause();
              audio.currentTime = 0;
            }
          }, 10000);
        } else if (audioRefs.current.audioContext) {
          // Resume audio context if suspended
          if (audioRefs.current.audioContext.state === 'suspended') {
            audioRefs.current.audioContext.resume();
          }
          audioRefs.current[soundType]();
        }
      } catch (error) {
        console.log('Error playing sound:', error);
      }
    }
  };

  // Expose playSound function globally
  useEffect(() => {
    window.playDurgaSound = playSound;
    return () => {
      delete window.playDurgaSound;
    };
  }, []);

  return null; // This component doesn't render anything
};

export default SoundEffects;
