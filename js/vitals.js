// Vitals Monitor State & Drawing Engine
const VitalsState = {
  hr: 75,
  sbp: 120,
  dbp: 80,
  spo2: 98,
  rr: 14,
  etco2: 38,
  temp: 36.8,
  
  alarmActive: false,
  alarmReason: "",
  
  // Waveform drawing parameters
  ecgX: 0,
  spo2X: 0,
  co2X: 0,
  
  // Audio settings
  audioEnabled: false,
  audioCtx: null,
  nextBeepTime: 0,
  lastBeepTime: 0,
  alarmInterval: null,
};

// Vitals Monitor Visual Coordinator
class VitalsMonitor {
  constructor() {
    this.canvases = {
      ecg: document.getElementById('ecgCanvas'),
      spo2: document.getElementById('spo2Canvas'),
      co2: document.getElementById('co2Canvas')
    };
    
    this.ctxs = {};
    this.animationFrameId = null;
    this.sweepSpeed = 2.0; // horizontal speed (px per frame)
  }

  init() {
    // Check if canvases exist in the DOM
    for (let key in this.canvases) {
      if (this.canvases[key]) {
        this.ctxs[key] = this.canvases[key].getContext('2d');
        this.resizeCanvas(this.canvases[key]);
      }
    }
    
    // Clear and draw grid backgrounds
    this.clearAll();
    
    // Start drawing loop
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    this.animate();
    
    // Setup Audio listeners
    this.setupAudio();
  }

  resizeCanvas(canvas) {
    // Set internal resolution matching display resolution multiplied by device pixel ratio for crisp lines
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
  }

  clearAll() {
    for (let key in this.ctxs) {
      const ctx = this.ctxs[key];
      const canvas = this.canvases[key];
      const w = canvas.width / (window.devicePixelRatio || 1);
      const h = canvas.height / (window.devicePixelRatio || 1);
      
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, w, h);
      this.drawGrid(ctx, w, h);
    }
    VitalsState.ecgX = 0;
    VitalsState.spo2X = 0;
    VitalsState.co2X = 0;
  }

  drawGrid(ctx, w, h) {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    
    // Vertical grid lines
    for (let x = 0; x < w; x += 15) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    // Horizontal grid lines
    for (let y = 0; y < h; y += 15) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
  }

  animate() {
    this.drawECG();
    this.drawSpO2();
    this.drawCO2();
    this.checkAlarmsAndBeeps();
    
    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }

  drawECG() {
    const ctx = this.ctxs.ecg;
    if (!ctx) return;
    
    const canvas = this.canvases.ecg;
    const w = canvas.width / (window.devicePixelRatio || 1);
    const h = canvas.height / (window.devicePixelRatio || 1);
    
    // Sweep-bar behavior
    const x = VitalsState.ecgX;
    const nextX = (x + this.sweepSpeed) % w;
    
    // Erase a small section ahead of the drawing cursor
    ctx.fillStyle = '#000000';
    ctx.fillRect(x, 0, 16, h);
    this.drawGridSlice(ctx, x, 16, h);
    
    // Calculate the ECG curve shape
    // ECG cycle frequency based on HR (cycles per second)
    const hr = VitalsState.hr;
    const cycleDuration = 60 / hr; // seconds per beat
    const fps = 60; // assumed
    const cycleSamples = cycleDuration * fps; 
    
    // Calculate position in the current cardiac cycle (0 to 1)
    const timeInSec = (Date.now() / 1000);
    const cyclePos = (timeInSec / cycleDuration) % 1.0;
    
    let yVal = 0.5 * h; // baseline
    
    // Synthesize idealized P-Q-R-S-T waveform
    if (cyclePos < 0.08) {
      // P wave (small bump)
      const pPos = cyclePos / 0.08;
      yVal -= Math.sin(pPos * Math.PI) * 5;
    } else if (cyclePos >= 0.10 && cyclePos < 0.13) {
      // Q wave (slight dip before R)
      const qPos = (cyclePos - 0.10) / 0.03;
      yVal += qPos * 4;
    } else if (cyclePos >= 0.13 && cyclePos < 0.17) {
      // R wave (huge sharp spike)
      const rPos = (cyclePos - 0.13) / 0.04;
      if (rPos < 0.5) {
        yVal -= (rPos / 0.5) * (h * 0.4);
      } else {
        yVal -= (h * 0.4) - ((rPos - 0.5) / 0.5) * (h * 0.45);
      }
    } else if (cyclePos >= 0.17 && cyclePos < 0.20) {
      // S wave (slight dip below baseline)
      const sPos = (cyclePos - 0.17) / 0.03;
      yVal += (1.0 - sPos) * 5;
    } else if (cyclePos >= 0.30 && cyclePos < 0.48) {
      // T wave (medium dome)
      const tPos = (cyclePos - 0.30) / 0.18;
      yVal -= Math.sin(tPos * Math.PI) * 12;
    }
    
    // Render connection line
    ctx.strokeStyle = VitalsState.alarmActive ? '#ff1744' : '#00e676';
    ctx.shadowColor = VitalsState.alarmActive ? 'rgba(255, 23, 68, 0.4)' : 'rgba(0, 230, 118, 0.4)';
    ctx.shadowBlur = 4;
    ctx.lineWidth = 2.0;
    
    ctx.beginPath();
    // We keep track of the previous point to draw a line
    if (this.lastEcgY === undefined) this.lastEcgY = yVal;
    ctx.moveTo((x - this.sweepSpeed + w) % w, this.lastEcgY);
    ctx.lineTo(x, yVal);
    ctx.stroke();
    
    ctx.shadowBlur = 0; // reset shadow
    this.lastEcgY = yVal;
    VitalsState.ecgX = nextX;
  }

  drawSpO2() {
    const ctx = this.ctxs.spo2;
    if (!ctx) return;
    
    const canvas = this.canvases.spo2;
    const w = canvas.width / (window.devicePixelRatio || 1);
    const h = canvas.height / (window.devicePixelRatio || 1);
    
    const x = VitalsState.spo2X;
    const nextX = (x + this.sweepSpeed) % w;
    
    ctx.fillStyle = '#000000';
    ctx.fillRect(x, 0, 16, h);
    this.drawGridSlice(ctx, x, 16, h);
    
    // SpO2 waveform - pulse plethysmogram (synchronized with HR)
    const hr = VitalsState.hr;
    const cycleDuration = 60 / hr;
    const timeInSec = (Date.now() / 1000);
    const cyclePos = (timeInSec / cycleDuration) % 1.0;
    
    let yVal = 0.6 * h;
    
    // Synthesis: steep systolic rise, dicrotic notch, gradual diastolic decay
    if (cyclePos >= 0.12 && cyclePos < 0.30) {
      // Systolic rise
      const risePos = (cyclePos - 0.12) / 0.18;
      yVal -= Math.sin(risePos * Math.PI / 2) * (h * 0.35);
    } else if (cyclePos >= 0.30 && cyclePos < 0.42) {
      // Dicrotic notch drop
      const dropPos = (cyclePos - 0.30) / 0.12;
      yVal -= (h * 0.35) - Math.sin(dropPos * Math.PI) * (h * 0.08) - (dropPos * (h * 0.10));
    } else if (cyclePos >= 0.42 && cyclePos < 0.90) {
      // Diastolic decay
      const decayPos = (cyclePos - 0.42) / 0.48;
      const startY = 0.6 * h - (h * 0.17);
      yVal = startY + decayPos * (h * 0.17);
    }
    
    ctx.strokeStyle = VitalsState.alarmActive ? '#ff1744' : '#00e5ff';
    ctx.shadowColor = VitalsState.alarmActive ? 'rgba(255, 23, 68, 0.3)' : 'rgba(0, 229, 255, 0.3)';
    ctx.shadowBlur = 4;
    ctx.lineWidth = 1.8;
    
    ctx.beginPath();
    if (this.lastSpo2Y === undefined) this.lastSpo2Y = yVal;
    ctx.moveTo((x - this.sweepSpeed + w) % w, this.lastSpo2Y);
    ctx.lineTo(x, yVal);
    ctx.stroke();
    
    ctx.shadowBlur = 0;
    this.lastSpo2Y = yVal;
    VitalsState.spo2X = nextX;
  }

  drawCO2() {
    const ctx = this.ctxs.co2;
    if (!ctx) return;
    
    const canvas = this.canvases.co2;
    const w = canvas.width / (window.devicePixelRatio || 1);
    const h = canvas.height / (window.devicePixelRatio || 1);
    
    const x = VitalsState.co2X;
    const nextX = (x + this.sweepSpeed) % w;
    
    ctx.fillStyle = '#000000';
    ctx.fillRect(x, 0, 16, h);
    this.drawGridSlice(ctx, x, 16, h);
    
    // Capnography curve: dependent on RR
    const rr = VitalsState.rr;
    const cycleDuration = 60 / rr; // seconds per breath
    const timeInSec = (Date.now() / 1000);
    const cyclePos = (timeInSec / cycleDuration) % 1.0;
    
    let yVal = 0.85 * h; // baseline CO2 = 0
    
    // Waveform: square-ish (expiration has plateau, inspiration drops rapidly to 0)
    // Expiration: 0.1 to 0.6 of cycle
    if (cyclePos >= 0.10 && cyclePos < 0.20) {
      // Expiratory upstroke (phase II)
      const risePos = (cyclePos - 0.10) / 0.10;
      yVal -= risePos * (h * 0.55);
    } else if (cyclePos >= 0.20 && cyclePos < 0.60) {
      // Expiratory plateau (phase III)
      const plateauPos = (cyclePos - 0.20) / 0.40;
      const slope = plateauPos * (h * 0.05); // slight rise during expiration
      yVal -= (h * 0.55) + slope;
    } else if (cyclePos >= 0.60 && cyclePos < 0.70) {
      // Inspiratory downstroke (phase IV)
      const fallPos = (cyclePos - 0.60) / 0.10;
      yVal -= (h * 0.60) - (fallPos * (h * 0.60));
    }
    
    ctx.strokeStyle = '#ffd600';
    ctx.lineWidth = 1.8;
    
    ctx.beginPath();
    if (this.lastCo2Y === undefined) this.lastCo2Y = yVal;
    ctx.moveTo((x - this.sweepSpeed + w) % w, this.lastCo2Y);
    ctx.lineTo(x, yVal);
    ctx.stroke();
    
    this.lastCo2Y = yVal;
    VitalsState.co2X = nextX;
  }

  drawGridSlice(ctx, x, width, h) {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    // Redraw grid slice so that scrolling doesn't leave solid black columns
    for (let gx = Math.floor(x/15)*15; gx < x + width; gx += 15) {
      if (gx >= x && gx < x + width) {
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, h);
        ctx.stroke();
      }
    }
    for (let gy = 0; gy < h; gy += 15) {
      ctx.beginPath();
      ctx.moveTo(x, gy);
      ctx.lineTo(x + width, gy);
      ctx.stroke();
    }
  }

  // AUDIO & PHYSIOLOGICAL BEEP SYNTHESIZER
  setupAudio() {
    const audioBtn = document.getElementById('audioToggleBtn');
    if (!audioBtn) return;
    
    audioBtn.addEventListener('click', () => {
      VitalsState.audioEnabled = !VitalsState.audioEnabled;
      
      if (VitalsState.audioEnabled) {
        audioBtn.classList.add('active');
        audioBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
        
        // Initialize AudioContext if not already initialized
        if (!VitalsState.audioCtx) {
          VitalsState.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (VitalsState.audioCtx.state === 'suspended') {
          VitalsState.audioCtx.resume();
        }
        
        // Start alarm checker
        this.startAlarmLoop();
      } else {
        audioBtn.classList.remove('active');
        audioBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
        this.stopAlarmLoop();
      }
    });
  }

  playHeartBeep() {
    if (!VitalsState.audioEnabled || !VitalsState.audioCtx) return;
    
    const ctx = VitalsState.audioCtx;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    
    // Dynamic Pitch: Depends on SpO2! Lower SpO2 -> lower tone.
    // normal SpO2=100% -> 900Hz, SpO2=90% -> 700Hz, SpO2=80% -> 500Hz, SpO2=70% -> 380Hz
    const baseFreq = 300; 
    const spo2Factor = Math.max(0, (VitalsState.spo2 - 60) / 40); // 0 to 1 between 60% and 100%
    const frequency = baseFreq + (spo2Factor * 600); // 300Hz to 900Hz
    
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    
    // Envelope for clinical beep: quick rise, quick decay
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.09);
  }

  playAlarmBeep() {
    if (!VitalsState.audioEnabled || !VitalsState.audioCtx || !VitalsState.alarmActive) return;
    
    const ctx = VitalsState.audioCtx;
    // Play two high-pitched pulsing warning beeps
    const playTone = (delay, freq, duration) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
      
      gain.gain.setValueAtTime(0, ctx.currentTime + delay);
      gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + delay + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + delay + duration - 0.01);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + duration);
    };
    
    // Dual frequency medical warning alarms
    playTone(0, 950, 0.15);
    playTone(0.2, 950, 0.15);
  }

  startAlarmLoop() {
    if (VitalsState.alarmInterval) clearInterval(VitalsState.alarmInterval);
    
    VitalsState.alarmInterval = setInterval(() => {
      if (VitalsState.alarmActive) {
        this.playAlarmBeep();
      }
    }, 2000); // alarm repeats every 2 seconds
  }

  stopAlarmLoop() {
    if (VitalsState.alarmInterval) {
      clearInterval(VitalsState.alarmInterval);
      VitalsState.alarmInterval = null;
    }
  }

  checkAlarmsAndBeeps() {
    const hr = VitalsState.hr;
    const interval = 60000 / hr; // ms per beat
    const now = Date.now();
    
    // Trigger beep on the R-wave
    // Periodically based on HR
    if (now - VitalsState.lastBeepTime >= interval) {
      this.playHeartBeep();
      VitalsState.lastBeepTime = now;
      
      // Animate heart rate monitor number slightly (micro-animation heartbeat)
      const hrBoxNode = document.querySelector('.vital-box.green');
      if (hrBoxNode) {
        hrBoxNode.style.transform = 'scale(1.05)';
        setTimeout(() => {
          hrBoxNode.style.transform = 'scale(1)';
        }, 100);
      }
    }
    
    // Visual Alarm Flashing and Audio alarm trigger
    const panel = document.getElementById('vitalsMonitorPanel');
    const soundWave = document.getElementById('alarmSoundWave');
    if (panel) {
      if (VitalsState.alarmActive) {
        panel.classList.add('monitor-alarm-active');
        if (soundWave) soundWave.style.display = 'flex';
      } else {
        panel.classList.remove('monitor-alarm-active');
        if (soundWave) soundWave.style.display = 'none';
      }
    }
  }

  // Update dynamic values in the DOM
  updateNumericDisplay() {
    const updateVal = (id, val, textNode = null) => {
      const el = document.getElementById(id);
      if (el) {
        el.textContent = val;
      }
    };
    
    updateVal('monitorHR', VitalsState.hr);
    updateVal('monitorBP', `${VitalsState.sbp}/${VitalsState.dbp}`);
    updateVal('monitorSpO2', VitalsState.spo2);
    updateVal('monitorRR', VitalsState.rr);
    updateVal('monitorEtCO2', VitalsState.etco2);
    updateVal('monitorTemp', VitalsState.temp.toFixed(1));
    
    // Dynamically adjust alarm states based on thresholds
    let alarm = false;
    let reason = "";
    
    if (VitalsState.hr > 120) { alarm = true; reason = "טכיקרדיה קשה"; }
    else if (VitalsState.hr < 45) { alarm = true; reason = "ברדיקרדיה קשה"; }
    else if (VitalsState.spo2 < 90) { alarm = true; reason = "היפוקסמיה קשה"; }
    else if (VitalsState.sbp > 180 || VitalsState.sbp < 85) { alarm = true; reason = "לחץ דם לא תקין"; }
    
    VitalsState.alarmActive = alarm;
    VitalsState.alarmReason = reason;
  }
}

// Global hook for other modules to modify vitals and trigger rendering updates
window.VitalsState = VitalsState;
window.vitalsEngine = new VitalsMonitor();
