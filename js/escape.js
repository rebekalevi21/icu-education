// ICU Sim-Learn Escape Room Simulation Coordinator
const ICEscapeRoom = {
  timer: 1200, // 20 minutes in seconds
  timerInterval: null,
  activeStation: 1, // 1, 2, or 3
  gameState: 'intro', // 'intro', 'playing', 'success', 'failure'
  audioEnabled: false,
  timeElapsed: 0,
  deductions: 0,
  
  // Audio context and nodes
  audioCtx: null,
  droneOsc1: null,
  droneOsc2: null,
  droneGain: null,
  
  // Lung Sound nodes & intervals
  auscultationInterval: null,
  auscultationSource: null,
  auscultationFilter: null,
  auscultationGain: null,
  auscultationActive: false,
  auscultationSide: null,
  
  // Checklists and state variables
  station1Checklist: {
    ett: false,
    circuit: false,
    suction: false,
    ambu: false
  },
  
  station2State: {
    declared: false,
    witnessSigned: false,
    witnessName: '',
    codeEntered: false,
    drugDrawn: false,
    drugInjected: false
  },
  
  station3State: {
    listenedLeft: false,
    listenedRight: false,
    abgTaken: false,
    codeEntered: false,
    selectedDiagnosis: ''
  },
  
  init() {
    this.timer = 1200;
    this.timeElapsed = 0;
    this.deductions = 0;
    this.activeStation = 1;
    this.gameState = 'intro';
    this.audioEnabled = false;
    this.resetStates();
    
    // UI initial setup
    const introOverlay = document.getElementById('escapeIntroOverlay');
    const gameArea = document.getElementById('escapeGameArea');
    const successOverlay = document.getElementById('escapeSuccessOverlay');
    const failureOverlay = document.getElementById('escapeFailureOverlay');
    
    if (introOverlay) introOverlay.style.display = 'block';
    if (gameArea) gameArea.style.display = 'none';
    if (successOverlay) successOverlay.style.display = 'none';
    if (failureOverlay) failureOverlay.style.display = 'none';
    
    this.updateAudioToggleUI();
    this.setupListeners();
  },
  
  resetStates() {
    this.station1Checklist = { ett: false, circuit: false, suction: false, ambu: false };
    this.station2State = { declared: false, witnessSigned: false, witnessName: '', codeEntered: false, drugDrawn: false, drugInjected: false };
    this.station3State = { listenedLeft: false, listenedRight: false, abgTaken: false, codeEntered: false, selectedDiagnosis: '' };
  },
  
  setupListeners() {
    // Start button
    const startBtn = document.getElementById('escapeStartBtn');
    startBtn?.addEventListener('click', () => this.startGame());
    
    // Restart button
    const restartBtn = document.getElementById('escapeRestartBtn');
    restartBtn?.addEventListener('click', () => this.init());
    
    // Audio toggle button
    const audioBtn = document.getElementById('escapeAudioToggle');
    audioBtn?.addEventListener('click', () => this.toggleAudio());
  },
  
  startGame() {
    this.gameState = 'playing';
    
    // Toggle overlays
    const introOverlay = document.getElementById('escapeIntroOverlay');
    const gameArea = document.getElementById('escapeGameArea');
    if (introOverlay) introOverlay.style.display = 'none';
    if (gameArea) gameArea.style.display = 'block';
    
    // Set initial physiological state for Morton (מיטה 480)
    VitalsState.hr = 110;
    VitalsState.spo2 = 87;
    VitalsState.rr = 30;
    VitalsState.etco2 = 40;
    VitalsState.temp = 38.7;
    VitalsState.sbp = 135;
    VitalsState.dbp = 85;
    VitalsState.alarmActive = true;
    VitalsState.alarmReason = "היפוקסמיה וטכיקרדיה קשה";
    
    // Initialize vitals monitor canvas elements
    if (window.vitalsEngine) {
      window.vitalsEngine.canvases = {
        ecg: document.getElementById('ecgCanvas'),
        spo2: document.getElementById('spo2Canvas'),
        co2: document.getElementById('co2Canvas')
      };
      window.vitalsEngine.init();
      window.vitalsEngine.updateNumericDisplay();
    }
    
    // Initialize Web Audio Context if not done
    if (!VitalsState.audioCtx) {
      VitalsState.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    this.audioCtx = VitalsState.audioCtx;
    
    // Start Audio
    this.audioEnabled = true;
    VitalsState.audioEnabled = true;
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    this.startDrone();
    if (window.vitalsEngine) {
      window.vitalsEngine.startAlarmLoop();
    }
    this.updateAudioToggleUI();
    
    // Start timer interval
    this.timer = 1200;
    this.timeElapsed = 0;
    this.updateTimerDisplay();
    
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      this.tick();
    }, 1000);
    
    // Render Station 1
    this.renderStation();
  },
  
  tick() {
    if (this.gameState !== 'playing') return;
    
    this.timer--;
    this.timeElapsed++;
    this.updateTimerDisplay();
    
    // Tick sound beat
    if (this.audioEnabled && this.audioCtx) {
      this.playTickSound();
    }
    
    if (this.timer <= 0) {
      this.endGame(false);
    }
  },
  
  updateTimerDisplay() {
    const timerEl = document.getElementById('escapeTimer');
    if (!timerEl) return;
    
    const minutes = Math.floor(this.timer / 60);
    const seconds = this.timer % 60;
    const formatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    timerEl.textContent = formatted;
    
    // Pulsate timer when less than 3 minutes
    if (this.timer < 180) {
      timerEl.style.color = '#ff1744';
      timerEl.style.textShadow = '0 0 15px rgba(255, 23, 68, 0.8)';
      timerEl.classList.add('pulse-glow-red');
    } else {
      timerEl.style.color = '#ffab00';
      timerEl.style.textShadow = '0 0 15px rgba(255, 171, 0, 0.5)';
      timerEl.classList.remove('pulse-glow-red');
    }
  },
  
  toggleAudio() {
    this.audioEnabled = !this.audioEnabled;
    VitalsState.audioEnabled = this.audioEnabled;
    
    if (this.audioEnabled) {
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      this.startDrone();
      if (window.vitalsEngine) {
        window.vitalsEngine.startAlarmLoop();
      }
    } else {
      this.stopDrone();
      if (window.vitalsEngine) {
        window.vitalsEngine.stopAlarmLoop();
      }
      this.stopAuscultation();
    }
    this.updateAudioToggleUI();
    
    // Sync the top bar audio toggle button state
    const audioBtn = document.getElementById('audioToggleBtn');
    if (audioBtn) {
      if (this.audioEnabled) {
        audioBtn.classList.add('active');
        audioBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
      } else {
        audioBtn.classList.remove('active');
        audioBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
      }
    }
  },
  
  updateAudioToggleUI() {
    const btn = document.getElementById('escapeAudioToggle');
    const icon = document.getElementById('escapeAudioIcon');
    const text = document.getElementById('escapeAudioText');
    if (!btn || !icon || !text) return;
    
    if (this.audioEnabled) {
      btn.classList.add('active');
      btn.classList.remove('btn-secondary');
      btn.classList.add('btn-primary');
      icon.className = 'fa-solid fa-volume-high';
      text.textContent = 'צלילים פעילים';
    } else {
      btn.classList.remove('active');
      btn.classList.add('btn-secondary');
      btn.classList.remove('btn-primary');
      icon.className = 'fa-solid fa-volume-xmark';
      text.textContent = 'צלילים מושתקים';
    }
  },
  
  playTickSound() {
    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, this.audioCtx.currentTime); // low pitch tick
      
      gain.gain.setValueAtTime(0, this.audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.015, this.audioCtx.currentTime + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.025);
      
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      
      osc.start(this.audioCtx.currentTime);
      osc.stop(this.audioCtx.currentTime + 0.03);
    } catch (e) {
      console.warn("Could not play tick sound:", e);
    }
  },
  
  startDrone() {
    try {
      if (!this.audioCtx) return;
      this.stopDrone();
      
      this.droneOsc1 = this.audioCtx.createOscillator();
      this.droneOsc2 = this.audioCtx.createOscillator();
      this.droneGain = this.audioCtx.createGain();
      
      this.droneOsc1.type = 'sine';
      this.droneOsc1.frequency.setValueAtTime(55, this.audioCtx.currentTime); // 55Hz (A1)
      
      this.droneOsc2.type = 'sine';
      this.droneOsc2.frequency.setValueAtTime(56, this.audioCtx.currentTime); // 56Hz (beating drone)
      
      // Low volume ambient drone
      this.droneGain.gain.setValueAtTime(0, this.audioCtx.currentTime);
      this.droneGain.gain.linearRampToValueAtTime(0.12, this.audioCtx.currentTime + 1.0);
      
      this.droneOsc1.connect(this.droneGain);
      this.droneOsc2.connect(this.droneGain);
      this.droneGain.connect(this.audioCtx.destination);
      
      this.droneOsc1.start();
      this.droneOsc2.start();
    } catch (e) {
      console.warn("Drone audio failed to start:", e);
    }
  },
  
  stopDrone() {
    try {
      if (this.droneOsc1) {
        this.droneOsc1.stop();
        this.droneOsc1.disconnect();
        this.droneOsc1 = null;
      }
      if (this.droneOsc2) {
        this.droneOsc2.stop();
        this.droneOsc2.disconnect();
        this.droneOsc2 = null;
      }
      if (this.droneGain) {
        this.droneGain.disconnect();
        this.droneGain = null;
      }
    } catch (e) {}
  },
  
  renderStation() {
    const panel = document.getElementById('escapeStationPanel');
    const titleEl = document.getElementById('escapeStationTitle');
    if (!panel) return;
    
    // Stop any auscultation active when rendering/re-rendering
    this.stopAuscultation();
    
    if (this.activeStation === 1) {
      titleEl.innerHTML = '<i class="fa-solid fa-lungs"></i> <span>תחנה 1: ייצוב נשימתי ופתיחת חסימת הציוד</span>';
      panel.innerHTML = this.getStation1HTML();
      this.bindStation1Events();
    } else if (this.activeStation === 2) {
      titleEl.innerHTML = '<i class="fa-solid fa-syringe"></i> <span>תחנה 2: פרוטוקול תרופות בסיכון גבוה (Fentanyl)</span>';
      panel.innerHTML = this.getStation2HTML();
      this.bindStation2Events();
    } else if (this.activeStation === 3) {
      titleEl.innerHTML = '<i class="fa-solid fa-stethoscope"></i> <span>תחנה 3: אומדן ריאתי מתקדם ופיענוח מפתח הבריחה</span>';
      panel.innerHTML = this.getStation3HTML();
      this.bindStation3Events();
    }
  },
  
  // =========================================================================
  // STATION 1 LOGIC
  // =========================================================================
  getStation1HTML() {
    return `
      <div class="escape-station-card card">
        <h3 style="font-family:var(--font-header); margin-bottom:12px; color:var(--color-cyan);">תחנה 1: פתיחת ארון הציוד ואיטום נתיב האוויר</h3>
        <p style="color:var(--text-secondary); font-size:0.95rem; margin-bottom:20px; line-height:1.6; text-align:right;">
          ארון ההנשמה וציוד החירום נעול במנעול קוד בן 3 ספרות. שסתום ה-PEEP ומערכת הסקשן נמצאים בפנים.
          על שולחן המטופל מונח דף קבלה קרוע בחלקו – אולי מספר הזיהוי או מספר המיטה של המטופל הוא המפתח?
        </p>
        
        <div style="display:flex; justify-content:center; gap:20px; align-items:center; flex-wrap:wrap; margin-bottom:24px;">
          <!-- Clue Sheet -->
          <div class="card" id="clueSheetBtn" style="cursor:pointer; border:1px dashed var(--color-cyan); padding:16px; background:rgba(0, 229, 255, 0.03); text-align:center; max-width:200px; transition:all 0.3s ease;">
            <i class="fa-solid fa-file-invoice" style="font-size:2rem; color:var(--color-cyan); margin-bottom:8px;"></i>
            <div><strong>דף קבלה קרוע</strong></div>
            <span style="font-size:0.75rem; color:var(--text-secondary)">לחץ לצפייה ברמז</span>
          </div>

          <!-- Padlock Lock Box -->
          <div class="escape-lock-box locked" id="station1LockBox" style="margin:0;">
            <div style="font-size:1.1rem; font-weight:600;"><i class="fa-solid fa-lock"></i> מנעול קומבינציה</div>
            <div class="escape-lock-dials">
              <input type="text" maxlength="1" class="escape-lock-input" id="s1_d1" placeholder="0">
              <input type="text" maxlength="1" class="escape-lock-input" id="s1_d2" placeholder="0">
              <input type="text" maxlength="1" class="escape-lock-input" id="s1_d3" placeholder="0">
            </div>
            <button class="btn btn-primary" id="s1UnlockBtn" style="padding:6px 16px; font-size:0.9rem; margin-top:8px;">פתח מנעול</button>
            <div id="s1LockFeedback" style="font-size:0.85rem; min-height:20px; margin-top:4px;"></div>
          </div>
        </div>

        <!-- Clue Modal (Initially Hidden) -->
        <div id="clueModal" style="display:none; background:rgba(10,15,30,0.95); border:1px solid var(--color-cyan); border-radius:8px; padding:16px; margin-bottom:20px; text-align:right;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
            <strong style="color:var(--color-cyan)"><i class="fa-solid fa-circle-question"></i> דף קבלה רפואי - יחידת טיפול נמרץ</strong>
            <button class="btn btn-secondary" id="closeClueBtn" style="padding:2px 8px; font-size:0.75rem;">סגור</button>
          </div>
          <div style="font-family:var(--font-mono); font-size:0.9rem; line-height:1.6; border-top:1px solid rgba(255,255,255,0.1); padding-top:10px;">
            שם המטופל: MORTON<br>
            תאריך קבלה: 19/06/2026<br>
            אבחנה משוערת: ARDS / כשל נשימתי חריף<br>
            מיקום: <span style="background:var(--color-yellow); color:#000; padding:2px 6px; font-weight:700; border-radius:3px;">מיטה 480</span><br>
            <span style="color:var(--text-secondary); font-size:0.8rem;">(שאר הדף קרוע ומוכתם בדם...)</span>
          </div>
        </div>

        <!-- Station 1 Checklists (Initially Hidden until lock opened) -->
        <div id="s1ChecklistArea" style="display:none; border-top:1px solid var(--border-color); padding-top:20px; text-align:right;">
          <div style="color:var(--color-green); font-weight:600; margin-bottom:16px; font-size:1.1rem;">
            <i class="fa-solid fa-lock-open"></i> הארון פתוח! הציוד זמין. בצע את הפעולות הבאות לפי הסדר:
          </div>
          
          <div class="checkbox-scenarios" style="display:flex; flex-direction:column; gap:12px; margin-bottom:24px;">
            <label class="checkbox-container" style="display:flex; align-items:center; gap:12px; cursor:pointer;">
              <input type="checkbox" id="s1_cb1" style="width:20px; height:20px;">
              <span>הערכת צינור קנה (ETT) - בדיקת סימון השפתיים ב-22 ס"מ, קיבוע תקין, ולחץ בלונית (Cuff) של 25 cmH2O באמצעות מנומטר.</span>
            </label>
            <label class="checkbox-container" style="display:flex; align-items:center; gap:12px; cursor:pointer;">
              <input type="checkbox" id="s1_cb2" style="width:20px; height:20px;">
              <span>בדיקת שלמות מעגל ההנשמה (Circuit) - וידוא חיבורים הרמטיים וניקוז מעלי מים מצטברים בצינורות.</span>
            </label>
            <label class="checkbox-container" style="display:flex; align-items:center; gap:12px; cursor:pointer;">
              <input type="checkbox" id="s1_cb3" style="width:20px; height:20px;">
              <span>ביצוע סקשן (Suction) - שאיבת הפרשות צמיגות מקנה הנשימה להסרת החסימה הפיזית.</span>
            </label>
            <label class="checkbox-container" style="display:flex; align-items:center; gap:12px; cursor:pointer;">
              <input type="checkbox" id="s1_cb4" style="width:20px; height:20px;">
              <span>ניתוק מהמכונה וחיבור למפוח אמבו ידני (Ambu Bag) עם שסתום PEEP מכוון ל-10 cmH2O וחיבור ל-100% חמצן (15 ליטר/דקה).</span>
            </label>
          </div>
          
          <button class="btn btn-primary" id="s1SubmitBtn" disabled style="width:100%;"><i class="fa-solid fa-circle-check"></i> חבר למפוח ידני עם PEEP וייצב נשימה</button>
        </div>

        <!-- Transition Button to Station 2 -->
        <div id="s1TransitionArea" style="display:none; text-align:center; border-top:1px solid var(--border-color); padding-top:20px; margin-top:20px;">
          <div class="debrief-box" style="margin-bottom:20px; text-align:right; border-color:var(--color-yellow); background:rgba(255,171,0,0.05);">
            <strong style="color:var(--color-yellow);"><i class="fa-solid fa-circle-info"></i> עדכון פיזיולוגי:</strong><br>
            חיבור מפוח האמבו וה-PEEP הציל את המטופל ממוות מוחי – הסטורציה במוניטור עלתה ל-92%. <br>
            אך כעת, ככל שהחמצן מגיע למוח, המטופל מתחיל לגלות אי שקט מוטורי קיצוני ונלחם בצינור ההנשמה! לחצי השיא (PIP) במוניטור זינקו ל-45 סמ"מ מים וישנה סכנה מיידית לקרע של נאדיות הריאה (Pneumothorax). <br>
            עליך לעבור לתחנה 2 לייצוב סדציה דחופה.
          </div>
          <button class="btn btn-primary" id="s1GoToS2Btn" style="font-size:1.1rem; padding:10px 24px;">מעבר לתחנה 2: פרוטוקול סדציה <i class="fa-solid fa-arrow-left"></i></button>
        </div>
      </div>
    `;
  },
  
  bindStation1Events() {
    const d1 = document.getElementById('s1_d1');
    const d2 = document.getElementById('s1_d2');
    const d3 = document.getElementById('s1_d3');
    const unlockBtn = document.getElementById('s1UnlockBtn');
    const feedback = document.getElementById('s1LockFeedback');
    
    // Auto focus transitions for input fields
    [d1, d2, d3].forEach((input, index, arr) => {
      input.addEventListener('input', (e) => {
        input.value = input.value.replace(/[^0-9]/g, '');
        if (input.value && index < arr.length - 1) {
          arr[index + 1].focus();
        }
      });
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !input.value && index > 0) {
          arr[index - 1].focus();
        }
      });
    });
    
    // Clue sheet toggle
    const clueBtn = document.getElementById('clueSheetBtn');
    const clueModal = document.getElementById('clueModal');
    clueBtn?.addEventListener('click', () => {
      clueModal.style.display = clueModal.style.display === 'none' ? 'block' : 'none';
    });
    document.getElementById('closeClueBtn')?.addEventListener('click', () => {
      clueModal.style.display = 'none';
    });
    
    // Unlock Padlock action
    unlockBtn?.addEventListener('click', () => {
      const code = `${d1.value}${d2.value}${d3.value}`;
      if (code === '480') {
        // Unlock Success
        feedback.innerHTML = '<span style="color:var(--color-green)">קוד נכון! הארון נפתח.</span>';
        document.getElementById('station1LockBox').className = 'escape-lock-box unlocked';
        
        // Hide inputs and button
        d1.disabled = d2.disabled = d3.disabled = true;
        unlockBtn.style.display = 'none';
        
        // Show Checklist Area
        document.getElementById('s1ChecklistArea').style.display = 'block';
      } else {
        // Unlock Fail
        feedback.innerHTML = '<span style="color:var(--color-red)">קוד שגוי! נסה שוב.</span>';
        this.triggerRedFlash(feedback);
        this.deductions += 10; // add minor time penalty or track mistakes
      }
    });
    
    // Checklist inputs trigger submit validation
    const cbs = ['s1_cb1', 's1_cb2', 's1_cb3', 's1_cb4'].map(id => document.getElementById(id));
    const submitBtn = document.getElementById('s1SubmitBtn');
    
    cbs.forEach((cb, idx) => {
      cb?.addEventListener('change', () => {
        const key = Object.keys(this.station1Checklist)[idx];
        this.station1Checklist[key] = cb.checked;
        
        // Enable submit button if all checked
        const allChecked = Object.values(this.station1Checklist).every(val => val);
        submitBtn.disabled = !allChecked;
      });
    });
    
    // Connect Ambu action
    submitBtn?.addEventListener('click', () => {
      // Transition patient physiology
      VitalsState.spo2 = 92;
      VitalsState.rr = 35; // tachypnea as they fight
      VitalsState.hr = 120; // rising heart rate
      VitalsState.alarmActive = true;
      VitalsState.alarmReason = "לחץ הנשמה גבוה במיוחד / לחימה במנשם";
      
      if (window.vitalsEngine) {
        window.vitalsEngine.updateNumericDisplay();
      }
      
      // Display transition block
      document.getElementById('s1ChecklistArea').style.display = 'none';
      document.getElementById('s1TransitionArea').style.display = 'block';
    });
    
    // Transition to Station 2 button
    document.getElementById('s1GoToS2Btn')?.addEventListener('click', () => {
      this.activeStation = 2;
      this.renderStation();
    });
  },
  
  // =========================================================================
  // STATION 2 LOGIC
  // =========================================================================
  getStation2HTML() {
    return `
      <div class="escape-station-card card">
        <h3 style="font-family:var(--font-header); margin-bottom:12px; color:var(--color-cyan);">תחנה 2: פרוטוקול תרופות בסיכון גבוה (High-Alert Medication)</h3>
        <p style="color:var(--text-secondary); font-size:0.95rem; margin-bottom:20px; line-height:1.6; text-align:right;">
          המטופל באי שקט קיצוני ונלחם במנשם. לחצי השיא (PIP) במוניטור עומדים על 45 cmH2O! 
          הרופא מורה על מתן דחוף של <strong>בולוס פנטניל (Fentanyl) 100 מק"ג IV</strong> להרגעת המטופל וסנכרונו.
          פנטניל מוגדר כתרופה בסיכון גבוה (High-Alert), ועל פי נהלי בטיחות המטופל ביחידה, חובה לבצע <strong>פרוטוקול אימות כפול (Double Verification)</strong>.
        </p>

        <div class="debrief-reference" style="margin-bottom:20px; text-align:right; border-color:var(--color-cyan);">
          <strong>נהלי האימות הכפול הנדרשים:</strong>
          <ol style="margin-top:6px; padding-right:20px; font-size:0.9rem; line-height:1.6;">
            <li>הכרזה בקול רם על המילה <strong>"טוקסיקה!"</strong> (לזיהוי תרופה בסיכון גבוה).</li>
            <li>החתמת איש צוות נוסף כעד (Double Verification) דיגיטלי במערכת.</li>
            <li>פתיחת מגירת הנרקוטיקה במנעול (קוד הנרקוטיקה מבוסס על <strong>מינון הפנטניל שהוזמן במק"ג</strong>).</li>
          </ol>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-bottom:24px; text-align:right;" class="station2-grid">
          <!-- Verification Steps Box -->
          <div class="card" style="padding:16px; margin:0;">
            <h4 style="color:var(--color-cyan); margin-bottom:16px;"><i class="fa-solid fa-clipboard-check"></i> שלבי בקרת הבטיחות</h4>
            <div style="display:flex; flex-direction:column; gap:16px;">
              <!-- Step 1: Declare Toxica -->
              <div>
                <button class="btn btn-secondary" id="s2DeclareBtn" style="width:100%; text-align:right; display:flex; justify-content:space-between; align-items:center; padding:10px 16px;">
                  <span>1. הכרז "טוקסיקה" בקול רם</span>
                  <i class="fa-solid fa-microphone" id="s2DeclareIcon" style="color:var(--text-secondary)"></i>
                </button>
                <div id="s2DeclareFeedback" style="font-size:0.85rem; color:var(--color-green); margin-top:6px; display:none;">
                  <i class="fa-solid fa-circle-check"></i> הוכרז בהצלחה! ("טוקסיקה!" נרשם במערכת).
                </div>
              </div>

              <!-- Step 2: Witness Signature -->
              <div>
                <button class="btn btn-secondary" id="s2SignBtn" disabled style="width:100%; text-align:right; display:flex; justify-content:space-between; align-items:center; padding:10px 16px;">
                  <span>2. בקש חתימת עד (Double Verification)</span>
                  <i class="fa-solid fa-signature" id="s2SignIcon"></i>
                </button>
                <div id="s2SignFeedback" style="font-size:0.85rem; color:var(--color-green); margin-top:6px; display:none;">
                  <i class="fa-solid fa-circle-check"></i> חתימה מאושרת על ידי העד: <strong id="s2WitnessNameDisplay"></strong>.
                </div>
              </div>
            </div>
          </div>

          <!-- Padlock for narcotics drawer -->
          <div class="escape-lock-box locked" id="station2LockBox" style="margin:0; width:100%; max-width:100%;">
            <div style="font-size:1.1rem; font-weight:600;"><i class="fa-solid fa-lock"></i> מנעול נרקוטיקה (3 ספרות)</div>
            <div style="font-size:0.8rem; color:var(--text-secondary); margin-bottom:8px; line-height:1.4;">
              הקוד מורכב ממינון הפנטניל המבוקש במק"ג (3 ספרות, השתמש באפסים מובילים במידת הצורך).
            </div>
            <div class="escape-lock-dials">
              <input type="text" maxlength="1" class="escape-lock-input" id="s2_d1" placeholder="0" disabled>
              <input type="text" maxlength="1" class="escape-lock-input" id="s2_d2" placeholder="0" disabled>
              <input type="text" maxlength="1" class="escape-lock-input" id="s2_d3" placeholder="0" disabled>
            </div>
            <button class="btn btn-primary" id="s2UnlockBtn" disabled style="padding:6px 16px; font-size:0.9rem; margin-top:8px;">פתח מנעול</button>
            <div id="s2LockFeedback" style="font-size:0.85rem; min-height:20px; margin-top:4px;"></div>
          </div>
        </div>

        <!-- Witness Signature Canvas/Dialog overlay (Initially Hidden) -->
        <div id="signatureModal" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.85); z-index:1000; align-items:center; justify-content:center;">
          <div class="card" style="max-width:400px; width:90%; padding:24px; text-align:right; border: 1px solid var(--color-cyan);">
            <h3 style="color:var(--color-cyan); margin-bottom:16px;"><i class="fa-solid fa-signature"></i> חתימת עד מאמת (Double Verification)</h3>
            
            <div class="form-group" style="margin-bottom:16px;">
              <label>שם עד מאמת (אחות מוסמכת נוספת):</label>
              <input type="text" id="witnessNameInput" class="form-control" placeholder="למשל: יעל כהן, אח מוסמך" style="margin-top:8px; width:100%;">
            </div>
            
            <div class="form-group" style="margin-bottom:20px;">
              <label>חתימת העד (לחץ וגרור כדי לחתום):</label>
              <div style="border:1px dashed var(--border-color); height:120px; background:#000; border-radius:6px; margin-top:8px; display:flex; align-items:center; justify-content:center; color:var(--text-secondary); cursor:crosshair; position:relative; overflow:hidden;" id="signatureAreaSim">
                <canvas id="signatureCanvas" style="position:absolute; inset:0; width:100%; height:100%;"></canvas>
                <span id="signaturePlaceholder" style="pointer-events:none;">חתום כאן באמצעות העכבר/מגע</span>
              </div>
            </div>
            
            <div style="display:flex; justify-content:flex-end; gap:10px;">
              <button class="btn btn-secondary" id="closeSigModalBtn" style="padding:6px 12px;">ביטול</button>
              <button class="btn btn-primary" id="submitSigBtn" style="padding:6px 16px;">אשר חתימה</button>
            </div>
          </div>
        </div>

        <!-- Action Drawer: Draw and inject (Initially Hidden until lock opened) -->
        <div id="s2ActionArea" style="display:none; border-top:1px solid var(--border-color); padding-top:20px; text-align:center;">
          <div style="color:var(--color-green); font-weight:600; margin-bottom:16px; font-size:1.1rem; text-align:right;">
            <i class="fa-solid fa-lock-open"></i> ארון נרקוטיקה פתוח! הכן את התרופה והזרק אותה.
          </div>
          
          <div style="display:flex; gap:16px; justify-content:center; flex-wrap:wrap; margin-bottom:20px;">
            <button class="btn btn-secondary" id="s2DrawBtn" style="font-size:1rem; padding:10px 20px;"><i class="fa-solid fa-syringe"></i> 1. שאב 100 מק"ג פנטניל במזרק</button>
            <button class="btn btn-primary" id="s2InjectBtn" disabled style="font-size:1rem; padding:10px 20px; background:var(--color-yellow); color:#000;"><i class="fa-solid fa-circle-check"></i> 2. הזרק פנטניל לוריד (IV Bolus)</button>
          </div>
          <div id="s2ActionFeedback" style="font-size:0.95rem; min-height:24px; color:var(--text-secondary); text-align:right;"></div>
        </div>

        <!-- Transition Button to Station 3 -->
        <div id="s2TransitionArea" style="display:none; text-align:center; border-top:1px solid var(--border-color); padding-top:20px; margin-top:20px;">
          <div class="debrief-box" style="margin-bottom:20px; text-align:right; border-color:var(--color-green); background:rgba(0,230,118,0.05);">
            <strong style="color:var(--color-green);"><i class="fa-solid fa-circle-check"></i> פנטניל הוזרק – המטופל נרגע!</strong><br>
            פעולת הסדציה התחילה להשפיע. אי השקט חלף, השרירים רפו, והמאבק בצינור ההנשמה נפסק. <br>
            המטופל מחובר כעת בצורה תקינה חזרה למנשם ההנשמה.<br>
            <strong>סימנים חיוניים נוכחיים:</strong> דופק 80 לדקה, קצב נשימה 16 לדקה, סטורציה 92%. האזעקות כבו כעת. <br>
            הבעיה האקוטית נפתרה, אך סטורציה של 92% תחת 100% חמצן איננה תקינה! עליך לעבור לתחנה 3 לאבחון מתקדם כדי לגלות את סיבת השורש לקריסה.
          </div>
          <button class="btn btn-primary" id="s2GoToS3Btn" style="font-size:1.1rem; padding:10px 24px;">מעבר לתחנה 3: אומדן מתקדם ופיענוח <i class="fa-solid fa-arrow-left"></i></button>
        </div>
      </div>
    `;
  },
  
  bindStation2Events() {
    const declareBtn = document.getElementById('s2DeclareBtn');
    const declareIcon = document.getElementById('s2DeclareIcon');
    const declareFeedback = document.getElementById('s2DeclareFeedback');
    
    const signBtn = document.getElementById('s2SignBtn');
    const signFeedback = document.getElementById('s2SignFeedback');
    const sigModal = document.getElementById('signatureModal');
    
    const d1 = document.getElementById('s2_d1');
    const d2 = document.getElementById('s2_d2');
    const d3 = document.getElementById('s2_d3');
    const unlockBtn = document.getElementById('s2UnlockBtn');
    const lockFeedback = document.getElementById('s2LockFeedback');
    
    // Step 1: Declare "טוקסיקה!"
    declareBtn?.addEventListener('click', () => {
      this.station2State.declared = true;
      declareIcon.className = 'fa-solid fa-microphone-lines pulse-glow-cyan';
      declareIcon.style.color = 'var(--color-cyan)';
      declareFeedback.style.display = 'block';
      declareBtn.disabled = true;
      
      // Enable next step
      signBtn.disabled = false;
    });
    
    // Step 2: Witness Signature Modal
    signBtn?.addEventListener('click', () => {
      sigModal.style.display = 'flex';
      this.initSignatureCanvas();
    });
    
    document.getElementById('closeSigModalBtn')?.addEventListener('click', () => {
      sigModal.style.display = 'none';
    });
    
    // Submit signature
    document.getElementById('submitSigBtn')?.addEventListener('click', () => {
      const nameInput = document.getElementById('witnessNameInput');
      if (!nameInput.value.trim()) {
        alert("חובה להזין שם עד מאמת!");
        return;
      }
      
      this.station2State.witnessSigned = true;
      this.station2State.witnessName = nameInput.value.trim();
      
      sigModal.style.display = 'none';
      signBtn.disabled = true;
      
      // Update UI feedback
      signFeedback.style.display = 'block';
      document.getElementById('s2WitnessNameDisplay').textContent = this.station2State.witnessName;
      
      // Enable Combination inputs and unlock button
      d1.disabled = d2.disabled = d3.disabled = false;
      unlockBtn.disabled = false;
      d1.focus();
    });
    
    // Lock Dials behaviors
    [d1, d2, d3].forEach((input, index, arr) => {
      input.addEventListener('input', (e) => {
        input.value = input.value.replace(/[^0-9]/g, '');
        if (input.value && index < arr.length - 1) {
          arr[index + 1].focus();
        }
      });
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !input.value && index > 0) {
          arr[index - 1].focus();
        }
      });
    });
    
    // Unlock narcotics box (code is Fentanyl dose: 100)
    unlockBtn?.addEventListener('click', () => {
      const code = `${d1.value}${d2.value}${d3.value}`;
      if (code === '100') {
        this.station2State.codeEntered = true;
        lockFeedback.innerHTML = '<span style="color:var(--color-green)">קוד נכון! מגירת הנרקוטיקה נפתחה.</span>';
        document.getElementById('station2LockBox').className = 'escape-lock-box unlocked';
        
        d1.disabled = d2.disabled = d3.disabled = true;
        unlockBtn.style.display = 'none';
        
        // Show syringe actions
        document.getElementById('s2ActionArea').style.display = 'block';
      } else {
        lockFeedback.innerHTML = '<span style="color:var(--color-red)">קוד שגוי! בדוק את מינון המזרק הנדרש.</span>';
        this.triggerRedFlash(lockFeedback);
        this.deductions += 10;
      }
    });
    
    // Syringe preparation
    const drawBtn = document.getElementById('s2DrawBtn');
    const injectBtn = document.getElementById('s2InjectBtn');
    const actionFeedback = document.getElementById('s2ActionFeedback');
    
    drawBtn?.addEventListener('click', () => {
      this.station2State.drugDrawn = true;
      actionFeedback.innerHTML = '<strong>המזרק מוכן:</strong> נשאבו 100 מק"ג של פנטניל במזרק סטרילי (2 מ"ל בריכוז 50 מק"ג למ"ל).';
      drawBtn.disabled = true;
      injectBtn.disabled = false;
    });
    
    injectBtn?.addEventListener('click', () => {
      this.station2State.drugInjected = true;
      actionFeedback.innerHTML = '<span style="color:var(--color-green); font-weight:600;">הפנטניל הוזרק לוריד!</span> עוקב אחר סימנים חיוניים...';
      injectBtn.disabled = true;
      
      // Physiology updates: Patient relaxes!
      VitalsState.hr = 80;
      VitalsState.rr = 16;
      VitalsState.spo2 = 92; // stable but needs investigation
      VitalsState.sbp = 122;
      VitalsState.dbp = 78;
      VitalsState.alarmActive = false; // Alarms turn off!
      VitalsState.alarmReason = "";
      
      if (window.vitalsEngine) {
        window.vitalsEngine.updateNumericDisplay();
        window.vitalsEngine.stopAlarmLoop();
      }
      
      // Delay slightly then show transitions
      setTimeout(() => {
        document.getElementById('s2ActionArea').style.display = 'none';
        document.getElementById('s2TransitionArea').style.display = 'block';
      }, 1500);
    });
    
    // Go to station 3
    document.getElementById('s2GoToS3Btn')?.addEventListener('click', () => {
      this.activeStation = 3;
      this.renderStation();
    });
  },
  
  initSignatureCanvas() {
    const canvas = document.getElementById('signatureCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const placeholder = document.getElementById('signaturePlaceholder');
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#00e5ff';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    
    let drawing = false;
    
    const startDrawing = (e) => {
      drawing = true;
      if (placeholder) placeholder.style.display = 'none';
      
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX || e.touches[0].clientX) - rect.left;
      const y = (e.clientY || e.touches[0].clientY) - rect.top;
      
      ctx.beginPath();
      ctx.moveTo(x, y);
    };
    
    const draw = (e) => {
      if (!drawing) return;
      e.preventDefault();
      
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
      const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;
      
      ctx.lineTo(x, y);
      ctx.stroke();
    };
    
    const stopDrawing = () => {
      drawing = false;
    };
    
    // Canvas dimensions sync
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    
    // Mouse listeners
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    
    // Touch listeners
    canvas.addEventListener('touchstart', startDrawing);
    canvas.addEventListener('touchmove', draw);
    canvas.addEventListener('touchend', stopDrawing);
  },
  
  // =========================================================================
  // STATION 3 LOGIC
  // =========================================================================
  getStation3HTML() {
    return `
      <div class="escape-station-card card">
        <h3 style="font-family:var(--font-header); margin-bottom:12px; color:var(--color-cyan);">תחנה 3: אומדן ריאתי מתקדם ופענוח מפתח הבריחה</h3>
        <p style="color:var(--text-secondary); font-size:0.95rem; margin-bottom:20px; line-height:1.6; text-align:right;">
          המטופל כעת רגוע ומסונכרן עם מכונת ההנשמה, אך ריווח החמצן שלו (SpO₂) תקוע על 92% למרות אספקת חמצן גבוהה. 
          עלינו לגלות את הגורם הקליני המשבש את החמצון בריאותיו. 
          בצע האזנה לריאות (Auscultation) ובקש בדיקת גזים בדם עורקי (ABG) כדי לפתוח את תיק המטופל המחשבי הנעול.
        </p>

        <div style="display:grid; grid-template-columns: 1.1fr 0.9fr; gap:20px; margin-bottom:24px; text-align:right;" class="station3-grid">
          <!-- Lung Auscultation Widget -->
          <div class="card" style="padding:16px; text-align:center; margin:0;">
            <h4 style="color:var(--color-cyan); margin-bottom:12px; text-align:right;"><i class="fa-solid fa-stethoscope"></i> האזנה לריאות (Lung Auscultation)</h4>
            <p style="color:var(--text-secondary); font-size:0.8rem; margin-bottom:16px; text-align:right;">
              לחץ על נקודות ההאזנה (Hotspots) כדי להצמיד את הסטטוסקופ ולהאזין לריאות של MORTON.
            </p>
            
            <div class="stethoscope-body">
              <div class="stethoscope-spot spot-right-lung" id="spotRightLung" title="ריאה ימנית (Right Lung)">
                <i class="fa-solid fa-stethoscope"></i>
              </div>
              <div class="stethoscope-spot spot-left-lung" id="spotLeftLung" title="ריאה שמאלית (Left Lung)">
                <i class="fa-solid fa-stethoscope"></i>
              </div>
            </div>
            
            <div id="auscultationFeedback" style="font-size:0.85rem; min-height:45px; color:var(--text-secondary); padding:10px; background:rgba(255,255,255,0.02); border-radius:6px; text-align:right; border:1px solid rgba(255,255,255,0.05); line-height:1.4;">
              הצמד את הסטטוסקופ על אחת הריאות כדי להתחיל בהאזנה קלינית...
            </div>
          </div>

          <!-- ABG & Lock Box Card -->
          <div class="card" style="padding:16px; margin:0;">
            <h4 style="color:var(--color-cyan); margin-bottom:12px;"><i class="fa-solid fa-vial"></i> בדיקת גזים בדם עורקי (ABG)</h4>
            <button class="btn btn-secondary" id="s3ABGBtn" style="width:100%; margin-bottom:16px; padding:10px 16px;"><i class="fa-solid fa-droplet" style="color:var(--color-red)"></i> קח דגימת גזים בדם עורקי</button>
            
            <!-- ABG Slip (Initially Hidden) -->
            <div id="s3ABGSlip" style="display:none; background:#000; border:1px solid var(--border-color); padding:14px; border-radius:6px; font-family:var(--font-mono); font-size:0.85rem; line-height:1.6; margin-bottom:16px;">
              <div style="color:var(--color-yellow); border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:6px; margin-bottom:6px; font-weight:700;">בדיקת מעבדה - גזים בדם עורקי</div>
              <strong>pH:</strong> 7.25 &nbsp; (חומצי)<br>
              <strong>pCO₂:</strong> 60 mmHg &nbsp; (גבוה - היפרקפניה)<br>
              <strong>pO₂:</strong> 55 mmHg &nbsp; (נמוך - היפוקסמיה קשה)<br>
              <strong>HCO₃⁻:</strong> 22 mEq/L &nbsp; (בטווח תקין)<br>
              <strong>BE:</strong> -5.3 mEq/L<br>
            </div>

            <!-- Lock Box to open computerized file -->
            <div class="escape-lock-box locked" id="station3LockBox" style="margin:0; width:100%; max-width:100%; padding:14px; gap:12px;">
              <div style="font-size:0.95rem; font-weight:600;"><i class="fa-solid fa-lock"></i> נעילת תיק מטופל מחשבי (5 ספרות)</div>
              <div style="font-size:0.75rem; color:var(--text-secondary); margin-bottom:4px; line-height:1.4;">
                מפתח לפתיחת המחשב מבוסס על שילוב של ערכי ה-<strong>pH</strong> (ללא נקודה) וה-<strong>pCO₂</strong> ברצף מתוך כרטיסיית המעבדה.
              </div>
              <div class="escape-lock-dials" style="gap:6px;">
                <input type="text" maxlength="1" class="escape-lock-input" id="s3_d1" style="width:36px; height:45px; font-size:1.4rem;" placeholder="0">
                <input type="text" maxlength="1" class="escape-lock-input" id="s3_d2" style="width:36px; height:45px; font-size:1.4rem;" placeholder="0">
                <input type="text" maxlength="1" class="escape-lock-input" id="s3_d3" style="width:36px; height:45px; font-size:1.4rem;" placeholder="0">
                <input type="text" maxlength="1" class="escape-lock-input" id="s3_d4" style="width:36px; height:45px; font-size:1.4rem;" placeholder="0">
                <input type="text" maxlength="1" class="escape-lock-input" id="s3_d5" style="width:36px; height:45px; font-size:1.4rem;" placeholder="0">
              </div>
              <button class="btn btn-primary" id="s3UnlockBtn" style="padding:6px 16px; font-size:0.85rem; margin-top:8px;">פתח תיק מחשבי</button>
              <div id="s3LockFeedback" style="font-size:0.8rem; min-height:18px; margin-top:4px;"></div>
            </div>
          </div>
        </div>

        <!-- Chest X-Ray and Diagnosis Panel (Initially Hidden until lock opened) -->
        <div id="s3DiagnosisArea" style="display:none; border-top:1px solid var(--border-color); padding-top:20px; text-align:right;">
          <div style="color:var(--color-green); font-weight:600; margin-bottom:16px; font-size:1.1rem;">
            <i class="fa-solid fa-lock-open"></i> התיק המחשבי פתוח! צילום החזה של MORTON נטען במערכת:
          </div>

          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px; align-items:center; margin-bottom:24px;" class="station3-diagnosis-grid">
            <!-- Chest X-Ray -->
            <div class="card" style="padding:16px; background:#040608; border-color:var(--color-cyan); text-align:center; margin:0;">
              <h4 style="color:var(--color-cyan); margin-bottom:12px; text-align:right;"><i class="fa-solid fa-image"></i> צילום חזה מהמיטה (Bedside Chest X-Ray)</h4>
              
              <!-- Styled simulated X-Ray -->
              <div style="width:100%; height:200px; background:#000; border:1px solid #112; position:relative; overflow:hidden; border-radius:6px;">
                <!-- Rib cage curves -->
                <div style="position:absolute; top:25px; bottom:20px; left:15%; right:15%; border:2px solid rgba(255,255,255,0.06); border-radius:50% 50% 15% 15%;"></div>
                <!-- Spine line -->
                <div style="position:absolute; top:20px; bottom:20px; left:50%; width:8px; transform:translateX(-50%); background:rgba(255,255,255,0.08); border-radius:4px;"></div>
                <!-- Clavicles -->
                <div style="position:absolute; top:35px; left:15%; right:51%; height:6px; background:rgba(255,255,255,0.09); border-radius:3px; transform:rotate(-5deg);"></div>
                <div style="position:absolute; top:35px; right:15%; left:51%; height:6px; background:rgba(255,255,255,0.09); border-radius:3px; transform:rotate(5deg);"></div>
                
                <!-- Left lung field (normal - darker with slight rib lines) -->
                <div style="position:absolute; top:40px; bottom:30px; left:18%; right:53%; background:rgba(255,255,255,0.02); border-radius:100px 30px 30px 100px;"></div>
                <!-- Right lung field (consolidation - dense clouding) -->
                <div style="position:absolute; top:40px; bottom:30px; right:18%; left:53%; background:radial-gradient(circle at 60% 60%, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.14) 60%, rgba(255,255,255,0.02) 100%); border-radius:30px 100px 100px 30px;"></div>
                <!-- Trachea and ETT Tube -->
                <div style="position:absolute; top:20px; height:65px; left:49.5%; width:2.5px; background:rgba(0,229,255,0.4);" title="טובוס ETT ממוקם 3 ס"מ מעל הקרינה"></div>
                
                <div style="position:absolute; bottom:8px; left:0; right:0; font-size:0.75rem; color:#ffab00; background:rgba(0,0,0,0.75); padding:4px;">
                   ממצא: תסנין ריאתי אלבאולרי קשה והצללה באונה התחתונה הימנית. טובוס במיקום תקין.
                </div>
              </div>
            </div>

            <!-- Multiple choice diagnosis -->
            <div>
              <h4 style="color:var(--color-cyan); margin-bottom:12px;"><i class="fa-solid fa-clipboard-question"></i> קבע את האבחנה המשולבת הנכונה על סמך כל הממצאים:</h4>
              <div style="display:flex; flex-direction:column; gap:10px; margin-bottom:20px;">
                <label class="radio-tiles-vertical" style="display:flex; align-items:center; border:1px solid var(--border-color); padding:10px; border-radius:6px; cursor:pointer; background:rgba(255,255,255,0.01); transition:all 0.3s ease;" id="diag_opt1_lbl">
                  <input type="radio" name="diagnosisOption" value="opt1" id="diag_opt1" style="margin-left:10px; width:16px; height:16px;">
                  <span>Respiratory Alkalosis + Hyperoxemia + Pulmonary Embolism</span>
                </label>
                <label class="radio-tiles-vertical" style="display:flex; align-items:center; border:1px solid var(--border-color); padding:10px; border-radius:6px; cursor:pointer; background:rgba(255,255,255,0.01); transition:all 0.3s ease;" id="diag_opt2_lbl">
                  <input type="radio" name="diagnosisOption" value="opt2" id="diag_opt2" style="margin-left:10px; width:16px; height:16px;">
                  <span>Metabolic Acidosis + Hypoxemia + Left Pneumothorax</span>
                </label>
                <label class="radio-tiles-vertical" style="display:flex; align-items:center; border:1px solid var(--border-color); padding:10px; border-radius:6px; cursor:pointer; background:rgba(255,255,255,0.01); transition:all 0.3s ease;" id="diag_opt3_lbl">
                  <input type="radio" name="diagnosisOption" value="opt3" id="diag_opt3" style="margin-left:10px; width:16px; height:16px;">
                  <span><strong>Respiratory Acidosis + Hypoxemia + Right Pneumonia</strong></span>
                </label>
                <label class="radio-tiles-vertical" style="display:flex; align-items:center; border:1px solid var(--border-color); padding:10px; border-radius:6px; cursor:pointer; background:rgba(255,255,255,0.01); transition:all 0.3s ease;" id="diag_opt4_lbl">
                  <input type="radio" name="diagnosisOption" value="opt4" id="diag_opt4" style="margin-left:10px; width:16px; height:16px;">
                  <span>Metabolic Alkalosis + Normal Oxygenation + Heart Failure</span>
                </label>
              </div>
              
              <button class="btn btn-primary" id="s3SubmitDiagnosisBtn" style="width:100%; background:var(--color-green); color:#000; font-size:1.1rem; padding:10px 20px;"><i class="fa-solid fa-key"></i> אשר אבחנה וסיים משמרת חירום</button>
              <div id="s3DiagFeedback" style="font-size:0.85rem; color:var(--color-red); margin-top:8px; min-height:20px;"></div>
            </div>
          </div>
        </div>
      </div>
    `;
  },
  
  bindStation3Events() {
    const rLung = document.getElementById('spotRightLung');
    const lLung = document.getElementById('spotLeftLung');
    const feedback = document.getElementById('auscultationFeedback');
    
    const abgBtn = document.getElementById('s3ABGBtn');
    const abgSlip = document.getElementById('s3ABGSlip');
    
    const d1 = document.getElementById('s3_d1');
    const d2 = document.getElementById('s3_d2');
    const d3 = document.getElementById('s3_d3');
    const d4 = document.getElementById('s3_d4');
    const d5 = document.getElementById('s3_d5');
    const unlockBtn = document.getElementById('s3UnlockBtn');
    const lockFeedback = document.getElementById('s3LockFeedback');
    
    // Auscultation clicks
    rLung?.addEventListener('click', () => {
      this.station3State.listenedRight = true;
      rLung.classList.add('active');
      feedback.innerHTML = '<strong style="color:var(--color-yellow)">האזנה לריאה ימנית:</strong> כניסת אוויר מופחתת בבסיס הריאה, ונשמעים <strong>חרחורים גסים (rales)</strong> משמעותיים בהשראה.';
      this.startAuscultationSound('right');
    });
    
    lLung?.addEventListener('click', () => {
      this.station3State.listenedLeft = true;
      lLung.classList.add('active');
      feedback.innerHTML = '<strong style="color:var(--color-green)">האזנה לריאה שמאלית:</strong> כניסת אוויר תקינה ונקייה דו-צדדית, ללא קולות נשימה פתולוגיים או חרחורים.';
      this.startAuscultationSound('left');
    });
    
    // Request ABG
    abgBtn?.addEventListener('click', () => {
      this.station3State.abgTaken = true;
      abgSlip.style.display = 'block';
      abgBtn.disabled = true;
    });
    
    // Lock Dials input movements
    [d1, d2, d3, d4, d5].forEach((input, index, arr) => {
      input.addEventListener('input', (e) => {
        input.value = input.value.replace(/[^0-9]/g, '');
        if (input.value && index < arr.length - 1) {
          arr[index + 1].focus();
        }
      });
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !input.value && index > 0) {
          arr[index - 1].focus();
        }
      });
    });
    
    // Unlock Computer File: code is pH (7.25) + pCO2 (60) without decimal point -> 72560
    unlockBtn?.addEventListener('click', () => {
      const code = `${d1.value}${d2.value}${d3.value}${d4.value}${d5.value}`;
      if (code === '72560') {
        this.station3State.codeEntered = true;
        lockFeedback.innerHTML = '<span style="color:var(--color-green)">קוד נכון! התיק המחשבי פתוח.</span>';
        document.getElementById('station3LockBox').className = 'escape-lock-box unlocked';
        
        // Disable dials and hide button
        [d1, d2, d3, d4, d5].forEach(el => el.disabled = true);
        unlockBtn.style.display = 'none';
        
        // Stop any lung sounds
        this.stopAuscultation();
        
        // Show Diagnosis Area
        document.getElementById('s3DiagnosisArea').style.display = 'block';
        this.bindDiagnosisEvents();
      } else {
        lockFeedback.innerHTML = '<span style="color:var(--color-red)">קוד שגוי! בדוק את ערכי ה-pH וה-pCO2 בבדיקת הגזים.</span>';
        this.triggerRedFlash(lockFeedback);
        this.deductions += 10;
      }
    });
  },
  
  bindDiagnosisEvents() {
    const opts = ['diag_opt1', 'diag_opt2', 'diag_opt3', 'diag_opt4'];
    const diagFeedback = document.getElementById('s3DiagFeedback');
    
    opts.forEach(id => {
      const input = document.getElementById(id);
      const label = document.getElementById(id + '_lbl');
      
      input?.addEventListener('change', () => {
        // Clear highlights
        opts.forEach(optId => {
          const l = document.getElementById(optId + '_lbl');
          if (l) {
            l.style.borderColor = 'var(--border-color)';
            l.style.background = 'rgba(255,255,255,0.01)';
          }
        });
        
        // Highlight active selection
        if (input.checked && label) {
          label.style.borderColor = 'var(--color-cyan)';
          label.style.background = 'rgba(0, 229, 255, 0.05)';
          this.station3State.selectedDiagnosis = input.value;
        }
      });
    });
    
    // Submit Final Diagnosis
    const submitDiagBtn = document.getElementById('s3SubmitDiagnosisBtn');
    submitDiagBtn?.addEventListener('click', () => {
      if (this.station3State.selectedDiagnosis === 'opt3') {
        // Correct diagnosis: wins!
        this.endGame(true);
      } else {
        // Incorrect diagnosis
        diagFeedback.innerHTML = 'אבחנה לא מדויקת! בצע אומדן חוזר של צילום החזה, ה-ABG והחרחורים בריאה הימנית.';
        this.triggerRedFlash(diagFeedback);
        this.deductions += 30; // higher penalty for wrong clinical diagnosis
      }
    });
  },
  
  // =========================================================================
  // CLINICAL AUDIO AUSCULTATION SYNTHESIZER
  // =========================================================================
  startAuscultationSound(side) {
    if (!this.audioEnabled || !this.audioCtx) return;
    this.stopAuscultation();
    this.auscultationActive = true;
    this.auscultationSide = side;
    
    try {
      // 1. Generate White Noise Buffer
      const bufferSize = this.audioCtx.sampleRate * 2; // 2 seconds loop
      const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      
      // 2. Setup Noise Source
      this.auscultationSource = this.audioCtx.createBufferSource();
      this.auscultationSource.buffer = buffer;
      this.auscultationSource.loop = true;
      
      // 3. Bandpass filter to match breath sounds (muffled rumble)
      this.auscultationFilter = this.audioCtx.createBiquadFilter();
      this.auscultationFilter.type = 'bandpass';
      this.auscultationFilter.Q.setValueAtTime(1.5, this.audioCtx.currentTime);
      this.auscultationFilter.frequency.setValueAtTime(250, this.audioCtx.currentTime);
      
      // 4. Gain Node for breath modulation
      this.auscultationGain = this.audioCtx.createGain();
      this.auscultationGain.gain.setValueAtTime(0.01, this.audioCtx.currentTime);
      
      // Connect nodes
      this.auscultationSource.connect(this.auscultationFilter);
      this.auscultationFilter.connect(this.auscultationGain);
      this.auscultationGain.connect(this.audioCtx.destination);
      
      // Start noise source
      this.auscultationSource.start();
      
      // 5. Breathing modulation cycle (Period = 3.5 seconds: 1.5s inhale, 2.0s exhale)
      let startTime = Date.now();
      
      this.auscultationInterval = setInterval(() => {
        if (!this.auscultationActive || !this.audioCtx) return;
        
        const elapsed = (Date.now() - startTime) / 1000;
        const cyclePos = elapsed % 3.5;
        
        let targetGain = 0.01;
        let targetFreq = 200;
        
        if (cyclePos < 1.5) {
          // Inhale (amplitude and frequency rise)
          const ratio = cyclePos / 1.5;
          targetGain = 0.01 + (ratio * 0.09);
          targetFreq = 200 + (ratio * 150); // goes up to 350Hz
          
          // Crackles/Rales: generate random clicks on Inhale only for pneumonia side
          if (this.auscultationSide === 'right' && Math.random() < 0.28) {
            this.playCrackClick();
          }
        } else {
          // Exhale (gradual fall)
          const ratio = (cyclePos - 1.5) / 2.0;
          targetGain = 0.10 - (ratio * 0.09);
          targetFreq = 350 - (ratio * 200); // drops to 150Hz
        }
        
        // Apply ramp targets smoothly
        if (this.auscultationGain && this.auscultationFilter) {
          this.auscultationGain.gain.setTargetAtTime(targetGain, this.audioCtx.currentTime, 0.05);
          this.auscultationFilter.frequency.setTargetAtTime(targetFreq, this.audioCtx.currentTime, 0.05);
        }
      }, 50);
      
    } catch (e) {
      console.warn("Auscultation synthesizer failed:", e);
    }
  },
  
  playCrackClick() {
    try {
      if (!this.audioCtx) return;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      const filter = this.audioCtx.createBiquadFilter();
      
      osc.type = 'sine';
      // High pitch click for crackle
      osc.frequency.setValueAtTime(1400 + Math.random() * 600, this.audioCtx.currentTime);
      
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(1000, this.audioCtx.currentTime);
      
      gain.gain.setValueAtTime(0, this.audioCtx.currentTime);
      // Extremely quick click envelope (5ms)
      gain.gain.linearRampToValueAtTime(0.08 + Math.random() * 0.08, this.audioCtx.currentTime + 0.001);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.006);
      
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.audioCtx.destination);
      
      osc.start(this.audioCtx.currentTime);
      osc.stop(this.audioCtx.currentTime + 0.008);
    } catch (e) {}
  },
  
  stopAuscultation() {
    this.auscultationActive = false;
    this.auscultationSide = null;
    
    if (this.auscultationInterval) {
      clearInterval(this.auscultationInterval);
      this.auscultationInterval = null;
    }
    
    try {
      if (this.auscultationSource) {
        this.auscultationSource.stop();
        this.auscultationSource.disconnect();
        this.auscultationSource = null;
      }
      if (this.auscultationFilter) {
        this.auscultationFilter.disconnect();
        this.auscultationFilter = null;
      }
      if (this.auscultationGain) {
        this.auscultationGain.disconnect();
        this.auscultationGain = null;
      }
    } catch (e) {}
  },
  
  // =========================================================================
  // UTILITIES & GAME STATE MANAGEMENT
  // =========================================================================
  triggerRedFlash(element) {
    if (!element) return;
    element.classList.add('pulse-glow-red');
    setTimeout(() => {
      element.classList.remove('pulse-glow-red');
    }, 1000);
  },
  
  endGame(success) {
    this.gameState = success ? 'success' : 'failure';
    
    // Clear interval
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    
    // Clean up sounds
    this.stopDrone();
    this.stopAuscultation();
    if (window.vitalsEngine) {
      window.vitalsEngine.stopAlarmLoop();
      VitalsState.alarmActive = false;
    }
    
    // Show overlay
    if (success) {
      const minutes = Math.floor(this.timer / 60);
      const seconds = this.timer % 60;
      const timeRemainingStr = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      
      const successTime = document.getElementById('escapeSuccessTime');
      const successDeductions = document.getElementById('escapeSuccessDeductions');
      const successOverlay = document.getElementById('escapeSuccessOverlay');
      
      if (successTime) successTime.textContent = timeRemainingStr;
      
      // Calculate clinical performance rating based on deductions/mistakes
      if (successDeductions) {
        if (this.deductions === 0) {
          successDeductions.textContent = 'מצויין! (ללא תקלות)';
          successDeductions.style.color = 'var(--color-green)';
        } else if (this.deductions <= 20) {
          successDeductions.textContent = 'טוב מאוד (טעויות קלות)';
          successDeductions.style.color = 'var(--color-cyan)';
        } else {
          successDeductions.textContent = 'עובר (דורש שיפור)';
          successDeductions.style.color = 'var(--color-yellow)';
        }
      }
      
      if (successOverlay) successOverlay.style.display = 'flex';
      
    } else {
      const failureOverlay = document.getElementById('escapeFailureOverlay');
      if (failureOverlay) failureOverlay.style.display = 'flex';
    }
  },
  
  cleanup() {
    // Stops everything when user navigates to another view
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    this.stopDrone();
    this.stopAuscultation();
    this.gameState = 'intro';
  }
};

// Expose to window
window.ICEscapeRoom = ICEscapeRoom;
