/* ==========================================================================
   Aladdin's Lab - 3D Printing & Maker Bot Assistant Engine ("Aladdin Maker Bot")
   HTML5 Canvas 2D Vector Rendering with FDM Layer Lines, Hotend Nozzle & Stepper Synth
   Ported from Antigravity design into Angular.
   ========================================================================== */

class AladdinRobot {
  constructor(canvasId, dialogueId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.dialogueEl = document.getElementById(dialogueId);

    // HD DPR Canvas scaling
    this.dpr = window.devicePixelRatio || 1;
    this.width = 520;
    this.height = 520;
    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.ctx.scale(this.dpr, this.dpr);

    this.centerX = this.width / 2;
    this.centerY = this.height / 2 + 10;

    // Global Mouse Tracking Physics
    window.globalMouseX = window.innerWidth / 2;
    window.globalMouseY = window.innerHeight / 2 - 100;

    this.mouse = { x: this.centerX, y: this.centerY - 100 };
    this.headOffset = { x: 0, y: 0 };
    this.eyeOffset = { x: 0, y: 0 };

    this.time = 0;
    this.floatOffsetY = 0;
    this.antennaGlow = 0;

    // Expressions & Blinking
    this.expression = 'NORMAL';
    this.expressionTimer = 0;
    this.isBlinking = false;
    this.nextBlinkTime = Date.now() + 3000;
    this.blinkProgress = 0;

    // Web Audio Synth for Stepper Motors
    this.audioCtx = null;
    this.isMuted = false;

    // 3D Filament Color Palettes (PLA, PETG, TPU, ABS)
    this.skins = {
      cyan: { primary: '#2563eb', secondary: '#3b82f6', brass: '#f59e0b', glow: 'rgba(37, 99, 235, 0.5)', body: '#ffffff', visor: '#0f172a', border: '#cbd5e1', filament: 'PLA Blue' },
      gold: { primary: '#d97706', secondary: '#f59e0b', brass: '#fbbf24', glow: 'rgba(217, 119, 6, 0.5)', body: '#ffffff', visor: '#18120a', border: '#fcd34d', filament: 'Silk Gold' },
      emerald: { primary: '#059669', secondary: '#10b981', brass: '#f59e0b', glow: 'rgba(5, 150, 105, 0.5)', body: '#ffffff', visor: '#0a1812', border: '#6ee7b7', filament: 'PETG Green' },
      purple: { primary: '#7c3aed', secondary: '#8b5cf6', brass: '#fbbf24', glow: 'rgba(124, 58, 237, 0.5)', body: '#ffffff', visor: '#160a18', border: '#c4b5fd', filament: 'TPU Violet' }
    };
    this.currentSkin = this.skins.cyan;

    // 3D Printing Maker Dialogues
    this.dialogueIndex = 0;
    this.dialogues = [
      "3D Printing in progress... Hotend: 215°C | Heatbed: 60°C 🖨️",
      "Auto-bed leveling complete! Layer 180/450 at 0.16mm resolution.",
      "Extruding high-toughness PLA for custom robotics chassis & gears!",
      "Check out our 5 featured 3D printing & hardware tutorials below!",
      "Grab exclusive community promo codes for 3D printers and microcontrollers!"
    ];

    this.initEvents();
    this.animate();
    this.startDialogueLoop();
  }

  initEvents() {
    window.addEventListener('mousemove', (e) => {
      window.globalMouseX = e.clientX;
      window.globalMouseY = e.clientY;
    });

    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        window.globalMouseX = e.touches[0].clientX;
        window.globalMouseY = e.touches[0].clientY;
      }
    });

    this.canvas.addEventListener('click', () => {
      this.triggerReaction('HAPPY');
      this.speakNextDialogue();
      this.playStepperChime();
    });
  }

  setSkin(skinName) {
    if (this.skins[skinName]) {
      this.currentSkin = this.skins[skinName];
      this.playStepperChime();
    }
  }

  initAudio() {
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioCtx();
    }
  }

  // Stepper Motor Sound Synthesizer (Iconic 3D Printer TMC Driver Chime)
  playStepperChime() {
    if (this.isMuted) return;
    try {
      this.initAudio();
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      const freqs = [587.33, 880, 1174.66]; // D5, A5, D6 harmonic step
      freqs.forEach((freq, idx) => {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime + idx * 0.06);
        gain.gain.setValueAtTime(0.05, this.audioCtx.currentTime + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + idx * 0.06 + 0.12);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(this.audioCtx.currentTime + idx * 0.06);
        osc.stop(this.audioCtx.currentTime + idx * 0.06 + 0.12);
      });
    } catch (e) {}
  }

  playSynthBeep(freq = 440, type = 'sine', duration = 0.1) {
    if (this.isMuted) return;
    try {
      this.initAudio();
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
      gain.gain.setValueAtTime(0.05, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + duration);
    } catch (e) {}
  }

  triggerReaction(exp) {
    this.expression = exp;
    this.expressionTimer = Date.now() + 2000;
  }

  startDialogueLoop() {
    setInterval(() => {
      if (Math.random() > 0.6) {
        this.speakNextDialogue();
      }
    }, 9000);
  }

  speakNextDialogue() {
    if (!this.dialogueEl) return;
    this.dialogueIndex = (this.dialogueIndex + 1) % this.dialogues.length;
    const text = this.dialogues[this.dialogueIndex];

    this.dialogueEl.textContent = '';
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        this.dialogueEl.textContent += text.charAt(i);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 22);
  }

  animate() {
    this.time += 0.04;
    this.ctx.clearRect(0, 0, this.width, this.height);

    const rect = this.canvas.getBoundingClientRect();
    const targetX = window.globalMouseX - rect.left;
    const targetY = window.globalMouseY - rect.top;

    this.mouse.x += (targetX - this.mouse.x) * 0.08;
    this.mouse.y += (targetY - this.mouse.y) * 0.08;

    const dx = this.mouse.x - this.centerX;
    const dy = this.mouse.y - (this.centerY - 50);

    this.headOffset.x = Math.max(-28, Math.min(28, dx * 0.07));
    this.headOffset.y = Math.max(-22, Math.min(22, dy * 0.07));

    this.eyeOffset.x = Math.max(-15, Math.min(15, dx * 0.05));
    this.eyeOffset.y = Math.max(-12, Math.min(12, dy * 0.05));

    this.floatOffsetY = Math.sin(this.time) * 8;
    this.antennaGlow = (Math.sin(this.time * 3) + 1) / 2;

    if (Date.now() > this.nextBlinkTime && !this.isBlinking) {
      this.isBlinking = true;
      this.blinkProgress = 0;
      this.nextBlinkTime = Date.now() + 3000 + Math.random() * 3000;
    }

    if (this.isBlinking) {
      this.blinkProgress += 0.2;
      if (this.blinkProgress >= Math.PI) {
        this.isBlinking = false;
      }
    }

    if (this.expressionTimer && Date.now() > this.expressionTimer) {
      this.expression = 'NORMAL';
    }

    const activeSkin = { ...this.currentSkin };

    this.drawPEIHeatbed(activeSkin);
    this.drawRobotBody(activeSkin);
    this.drawRobotHead(activeSkin);

    requestAnimationFrame(() => this.animate());
  }

  /* --- 3D Printer PEI Heatbed Grid Base --- */
  drawPEIHeatbed(skin) {
    const ctx = this.ctx;
    const bx = this.centerX;
    const by = this.centerY + 185;

    ctx.save();

    // Heatbed Platform Base Plate (Textured PEI Sheet)
    ctx.fillStyle = skin.visor;
    ctx.strokeStyle = skin.primary;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(bx - 140, by - 25, 280, 30, 8);
    ctx.fill();
    ctx.stroke();

    // PEI Heatbed Grid Lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1;
    for (let x = -120; x <= 120; x += 24) {
      ctx.beginPath();
      ctx.moveTo(bx + x, by - 25);
      ctx.lineTo(bx + x, by + 5);
      ctx.stroke();
    }

    // Heatbed Indicator LED
    ctx.fillStyle = '#ef4444';
    ctx.shadowColor = '#ef4444';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(bx - 120, by - 10, 4, 0, Math.PI * 2);
    ctx.fill();

    // Bed Temperature Status Text
    ctx.shadowBlur = 0;
    ctx.fillStyle = skin.primary;
    ctx.font = "700 8px monospace";
    ctx.textAlign = "right";
    ctx.fillText("HEATBED: 60°C [OK]", bx + 125, by - 8);

    ctx.restore();
  }

  /* --- Robot Torso with Direct-Drive Extruder & Layer Lines --- */
  drawRobotBody(skin) {
    const ctx = this.ctx;
    const bx = this.centerX;
    const by = this.centerY + 85 + this.floatOffsetY;

    ctx.save();

    // Thruster / Bed Leveling Sensor Glow
    const shadowGrad = ctx.createRadialGradient(bx, by + 105, 5, bx, by + 105, 45);
    shadowGrad.addColorStop(0, skin.glow);
    shadowGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = shadowGrad;
    ctx.beginPath();
    ctx.arc(bx, by + 105, 45, 0, Math.PI * 2);
    ctx.fill();

    // 3D Printed Main Torso Structure
    ctx.fillStyle = skin.body;
    ctx.strokeStyle = skin.primary;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(bx - 68, by - 40, 136, 118, 22);
    ctx.fill();
    ctx.stroke();

    // FDM 3D Layer Line Texture Effects on Body
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.lineWidth = 1;
    for (let y = by - 32; y < by + 70; y += 6) {
      ctx.beginPath();
      ctx.moveTo(bx - 62, y);
      ctx.lineTo(bx + 62, y);
      ctx.stroke();
    }

    // Metallic Glass Chest Plate (Extruder Heatblock Style)
    ctx.fillStyle = skin.visor;
    ctx.strokeStyle = skin.primary;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(bx - 55, by - 22, 110, 76, 14);
    ctx.fill();
    ctx.stroke();

    // Direct Drive Extruder Gear Icon Animation
    const gearAngle = this.time * 2;
    ctx.save();
    ctx.translate(bx - 32, by - 4);
    ctx.rotate(gearAngle);
    ctx.fillStyle = skin.brass;
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI) / 4;
      ctx.rect(Math.cos(a) * 6 - 2, Math.sin(a) * 6 - 2, 4, 4);
    }
    ctx.fill();
    ctx.restore();

    // Glowing Nozzle Heatblock Core
    const corePulse = (Math.sin(this.time * 3) + 1) / 2;
    ctx.fillStyle = skin.brass;
    ctx.shadowColor = skin.brass;
    ctx.shadowBlur = 12 + corePulse * 8;
    ctx.beginPath();
    ctx.arc(bx, by - 6, 7, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(bx, by - 6, 11, 0, Math.PI * 2);
    ctx.stroke();

    // Channel Brand Text "ALADDIN'S LAB"
    ctx.shadowColor = skin.primary;
    ctx.shadowBlur = 8;
    ctx.fillStyle = '#ffffff';
    ctx.font = "800 11px Outfit, -apple-system, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("ALADDIN'S LAB", bx, by + 18);

    // Layer Resolution Badge "0.16mm FDM"
    ctx.shadowBlur = 0;
    ctx.fillStyle = skin.primary;
    ctx.font = "700 7.5px monospace";
    ctx.fillText("3D PRINTING • 0.16mm LAYER", bx, by + 34);

    // Stepper Motor Shoulder Joints (NEMA 17 style)
    ctx.fillStyle = skin.body;
    ctx.strokeStyle = skin.primary;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.roundRect(bx - 90, by - 18, 16, 26, 4);
    ctx.roundRect(bx + 74, by - 18, 16, 26, 4);
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }

  /* --- 3D Printer Head with Hotend Nozzle Antenna & Cooling Fans --- */
  drawRobotHead(skin) {
    const ctx = this.ctx;
    const hx = this.centerX + this.headOffset.x;
    const hy = this.centerY - 55 + this.floatOffsetY + this.headOffset.y;

    ctx.save();

    // --- Extruder Hotend Nozzle Antenna ---
    const antennaTopY = hy - 105;

    // Heatsink fins
    ctx.fillStyle = '#94a3b8';
    for (let f = 0; f < 4; f++) {
      ctx.beginPath();
      ctx.roundRect(hx - 10, hy - 65 - f * 8, 20, 5, 2);
      ctx.fill();
    }

    // Heatbreak Tube
    ctx.strokeStyle = skin.primary;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(hx, hy - 55);
    ctx.lineTo(hx, antennaTopY);
    ctx.stroke();

    // Glowing Brass V6 Extruder Nozzle Tip
    ctx.shadowColor = skin.brass;
    ctx.shadowBlur = 18 + this.antennaGlow * 12;
    ctx.fillStyle = skin.brass;
    ctx.beginPath();
    ctx.moveTo(hx - 10, antennaTopY);
    ctx.lineTo(hx + 10, antennaTopY);
    ctx.lineTo(hx, antennaTopY - 14);
    ctx.closePath();
    ctx.fill();

    // Extruded Glowing Filament Laser Pulse
    ctx.fillStyle = skin.primary;
    ctx.beginPath();
    ctx.arc(hx, antennaTopY - 16, 4 + this.antennaGlow * 2, 0, Math.PI * 2);
    ctx.fill();

    // Neck
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.roundRect(hx - 18, hy + 40, 36, 18, 5);
    ctx.fill();

    // Helmet Base
    ctx.fillStyle = skin.body;
    ctx.strokeStyle = skin.primary;
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.roundRect(hx - 95, hy - 60, 190, 115, 28);
    ctx.fill();
    ctx.stroke();

    // Horizontal Layer Lines Texture on Helmet
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.lineWidth = 1;
    for (let y = hy - 50; y < hy + 45; y += 6) {
      ctx.beginPath();
      ctx.moveTo(hx - 88, y);
      ctx.lineTo(hx + 88, y);
      ctx.stroke();
    }

    // Rotating 4010 Blower Part Cooling Fans on Sides
    ctx.fillStyle = skin.primary;
    // Left Fan Housing
    ctx.beginPath();
    ctx.roundRect(hx - 108, hy - 22, 13, 38, 4);
    ctx.fill();
    // Right Fan Housing
    ctx.beginPath();
    ctx.roundRect(hx + 95, hy - 22, 13, 38, 4);
    ctx.fill();

    // Rotating Fan Blades Visual
    const fanAngle = this.time * 6;
    ctx.save();
    ctx.translate(hx - 101, hy - 3);
    ctx.rotate(fanAngle);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-4, 0); ctx.lineTo(4, 0);
    ctx.moveTo(0, -4); ctx.lineTo(0, 4);
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.translate(hx + 101, hy - 3);
    ctx.rotate(-fanAngle);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-4, 0); ctx.lineTo(4, 0);
    ctx.moveTo(0, -4); ctx.lineTo(0, 4);
    ctx.stroke();
    ctx.restore();

    // Glass Visor Screen
    ctx.fillStyle = skin.visor;
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(hx - 76, hy - 42, 152, 76, 18);
    ctx.fill();
    ctx.stroke();

    // Eye Tracking Positioning
    const eyeSpacing = 40;
    const eyeY = hy - 4;
    const leftEyeX = hx - eyeSpacing + this.eyeOffset.x;
    const rightEyeX = hx + eyeSpacing + this.eyeOffset.x;
    const eyeOffsetY = eyeY + this.eyeOffset.y;

    let blinkScale = 1;
    if (this.isBlinking) {
      blinkScale = Math.abs(Math.cos(this.blinkProgress));
    }

    ctx.shadowColor = skin.primary;
    ctx.shadowBlur = 16;
    ctx.fillStyle = skin.primary;

    if (this.expression === 'HAPPY') {
      ctx.lineWidth = 4;
      ctx.strokeStyle = skin.primary;
      ctx.beginPath();
      ctx.arc(leftEyeX, eyeOffsetY, 13, Math.PI, 0);
      ctx.arc(rightEyeX, eyeOffsetY, 13, Math.PI, 0);
      ctx.stroke();

    } else if (this.expression === 'SURPRISED') {
      ctx.beginPath();
      ctx.arc(leftEyeX, eyeOffsetY, 20 * blinkScale, 0, Math.PI * 2);
      ctx.arc(rightEyeX, eyeOffsetY, 20 * blinkScale, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(leftEyeX, eyeOffsetY, 7, 0, Math.PI * 2);
      ctx.arc(rightEyeX, eyeOffsetY, 7, 0, Math.PI * 2);
      ctx.fill();

    } else {
      const eyeRadius = (this.expression === 'EXCITED') ? 17 : 15;

      ctx.beginPath();
      ctx.arc(leftEyeX, eyeOffsetY, eyeRadius * blinkScale, 0, Math.PI * 2);
      ctx.arc(rightEyeX, eyeOffsetY, eyeRadius * blinkScale, 0, Math.PI * 2);
      ctx.fill();

      if (blinkScale > 0.3) {
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(leftEyeX + 3, eyeOffsetY - 3, 5, 0, Math.PI * 2);
        ctx.arc(rightEyeX + 3, eyeOffsetY - 3, 5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Mouth Arc
    ctx.shadowBlur = 8;
    ctx.strokeStyle = skin.primary;
    ctx.lineWidth = 3;
    ctx.beginPath();
    const mouthY = hy + 20;
    const mouthWidth = 22;
    const mouthPulse = Math.sin(this.time * 8) * 2.5;

    if (this.expression === 'HAPPY' || this.expression === 'EXCITED') {
      ctx.arc(hx, mouthY - 3, 11, 0.1 * Math.PI, 0.9 * Math.PI);
    } else {
      ctx.moveTo(hx - mouthWidth, mouthY);
      ctx.lineTo(hx - mouthWidth / 2, mouthY + mouthPulse);
      ctx.lineTo(hx, mouthY - mouthPulse);
      ctx.lineTo(hx + mouthWidth / 2, mouthY + mouthPulse);
      ctx.lineTo(hx + mouthWidth, mouthY);
    }
    ctx.stroke();

    ctx.restore();
  }
}

// Global initialization (robust to Angular's async rendering)
window.AladdinRobotInstance = null;
(function initWhenReady() {
  const canvas = document.getElementById('robot-canvas');
  const dialogue = document.getElementById('robot-dialogue');
  if (canvas && dialogue && !window.AladdinRobotInstance) {
    window.AladdinRobotInstance = new AladdinRobot('robot-canvas', 'robot-dialogue');
    return;
  }
  if (!window.AladdinRobotInstance) {
    setTimeout(initWhenReady, 200);
  }
})();
