import { useEffect } from 'react';

const InteractiveEffects = () => {
  useEffect(() => {
    // Custom Cursor Effect
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.cssText = `
      position: fixed;
      width: 20px;
      height: 20px;
      background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.4) 50%, transparent 100%);
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
      transition: all 0.1s ease;
      mix-blend-mode: difference;
    `;
    document.body.appendChild(cursor);

    const updateCursor = (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    };

    document.addEventListener('mousemove', updateCursor);

    // Magnetic Button Effect
    const magneticButtons = document.querySelectorAll('.magnetic-btn, .package-btn, .explore-button, .gallery-btn');
    
    magneticButtons.forEach(button => {
      button.addEventListener('mousemove', (e) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        button.style.setProperty('--mouse-x', `${x * 0.1}px`);
        button.style.setProperty('--mouse-y', `${y * 0.1}px`);
        button.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px) scale(1.05)`;
      });

      button.addEventListener('mouseleave', () => {
        button.style.setProperty('--mouse-x', '0px');
        button.style.setProperty('--mouse-y', '0px');
        button.style.transform = 'translate(0, 0) scale(1)';
      });
    });

    // Particle System
    const createParticle = () => {
      const particle = document.createElement('div');
      particle.style.cssText = `
        position: fixed;
        width: 4px;
        height: 4px;
        background: rgba(255, 255, 255, 0.6);
        border-radius: 50%;
        pointer-events: none;
        z-index: 1;
        animation: confetti 3s linear forwards;
      `;
      
      particle.style.left = Math.random() * window.innerWidth + 'px';
      particle.style.top = '-10px';
      
      document.body.appendChild(particle);
      
      setTimeout(() => {
        particle.remove();
      }, 3000);
    };

    // Create particles periodically
    const particleInterval = setInterval(createParticle, 2000);

    // Sound Effects
    const playSound = (type) => {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      switch(type) {
        case 'click':
          oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
          break;
        case 'hover':
          oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.05);
          break;
        case 'success':
          oscillator.frequency.setValueAtTime(523, audioContext.currentTime);
          oscillator.frequency.setValueAtTime(659, audioContext.currentTime + 0.1);
          oscillator.frequency.setValueAtTime(784, audioContext.currentTime + 0.2);
          break;
      }
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    };

    // Add sound effects to buttons
    const soundButtons = document.querySelectorAll('button, .clickable');
    soundButtons.forEach(button => {
      button.addEventListener('mouseenter', () => playSound('hover'));
      button.addEventListener('click', () => playSound('click'));
    });

    // Easter Egg - Konami Code
    let konamiCode = [];
    const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // ↑↑↓↓←→←→BA
    
    const handleKeyPress = (e) => {
      konamiCode.push(e.keyCode);
      if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
      }
      
      if (konamiCode.join(',') === konamiSequence.join(',')) {
        // Confetti explosion
        for (let i = 0; i < 50; i++) {
          setTimeout(() => createParticle(), i * 50);
        }
        playSound('success');
        konamiCode = [];
      }
    };

    document.addEventListener('keydown', handleKeyPress);

    // Scroll-based animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animation = 'slideInUp 0.8s ease-out forwards';
        }
      });
    }, observerOptions);

    // Observe all cards and sections
    const animatedElements = document.querySelectorAll('.package-card, .gallery-card, .testimonial-card');
    animatedElements.forEach(el => observer.observe(el));

    // Cleanup
    return () => {
      document.removeEventListener('mousemove', updateCursor);
      document.removeEventListener('keydown', handleKeyPress);
      clearInterval(particleInterval);
      cursor.remove();
    };
  }, []);

  return null;
};

export default InteractiveEffects;
