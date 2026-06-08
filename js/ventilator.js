// ICU Ventilator Simulator Engine & Physiology Model
const VentSim = {
  // Ventilator Settings (Inputs)
  settings: {
    mode: 'vc',       // vc, pc, psv
    vt: 450,          // tidal volume (ml)
    rr: 14,           // resp rate (bpm)
    peep: 5,          // peep (cmH2O)
    fio2: 40,         // fraction of inspired oxygen (%)
    pi: 15,           // pressure control level (cmH2O)
    ps: 10,           // pressure support level (cmH2O)
    flow: 60,         // inspiratory flow rate (L/min)
  },

  // Patient Lung Physiology (States)
  patient: {
    compliance: 50,   // mL/cmH2O (normal ~50, ARDS ~15-30)
    resistance: 10,   // cmH2O/(L/s) (normal ~5-10, bronchospasm/plug ~25-40)
    ibw: 60,          // Ideal Body Weight (kg)
    hco3: 24,         // arterial bicarbonate (mEq/L)
    spontaneousEffort: false,
    secretionPlug: false,
    bronchospasm: false,
  },

  // Active Challenge Mode
  challenge: null, // null, 'ards', 'alarm'
  challengeSolved: false,

  init() {
    this.setupListeners();
    this.resetPatientToNormal();
    this.updateOutputs();
  },

  resetPatientToNormal() {
    this.patient.compliance = 50;
    this.patient.resistance = 10;
    this.patient.ibw = 60;
    this.patient.hco3 = 24;
    this.patient.spontaneousEffort = false;
    this.patient.secretionPlug = false;
    this.patient.bronchospasm = false;
    this.challengeSolved = false;
  },

  setupListeners() {
    // 1. Controls Change (Sliders & Radios)
    const inputs = ['ventVt', 'ventRR', 'ventPEEP', 'ventFiO2', 'ventPi', 'ventPs', 'ventFlow'];
    inputs.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', (e) => {
          const key = e.target.id.replace('vent', '').toLowerCase();
          // Normalize key naming
          let settingKey = key;
          if (key === 'vt') settingKey = 'vt';
          else if (key === 'rr') settingKey = 'rr';
          else if (key === 'peep') settingKey = 'peep';
          else if (key === 'fio2') settingKey = 'fio2';
          else if (key === 'pi') settingKey = 'pi';
          else if (key === 'ps') settingKey = 'ps';
          else if (key === 'flow') settingKey = 'flow';

          this.settings[settingKey] = parseFloat(e.target.value);
          
          // Update visual bubble values
          const valEl = document.getElementById(e.target.id + 'Val');
          if (valEl) valEl.textContent = e.target.value;

          this.updateOutputs();
        });
      }
    });

    // 2. Mode Change Tiles
    const modeTiles = document.querySelectorAll('input[name="ventMode"]');
    modeTiles.forEach(tile => {
      tile.addEventListener('change', (e) => {
        this.settings.mode = e.target.value;
        this.toggleControlVisibility();
        this.updateOutputs();
      });
    });

    // 3. Challenge selections
    document.getElementById('challengeNormalBtn')?.addEventListener('click', () => this.startChallenge(null));
    document.getElementById('challengeARDSBtn')?.addEventListener('click', () => this.startChallenge('ards'));
    document.getElementById('challengeAlarmBtn')?.addEventListener('click', () => this.startChallenge('alarm'));

    // 4. Clinical Intervention Action buttons
    document.getElementById('actionSuctionBtn')?.addEventListener('click', () => this.performIntervention('suction'));
    document.getElementById('actionDilatorBtn')?.addEventListener('click', () => this.performIntervention('dilator'));
    document.getElementById('actionBiteBlockBtn')?.addEventListener('click', () => this.performIntervention('biteblock'));
  },

  toggleControlVisibility() {
    const vcGroup = document.getElementById('vcControlsGroup');
    const pcGroup = document.getElementById('pcControlsGroup');
    const psvGroup = document.getElementById('psvControlsGroup');

    if (vcGroup) vcGroup.style.display = this.settings.mode === 'vc' ? 'block' : 'none';
    if (pcGroup) pcGroup.style.display = this.settings.mode === 'pc' ? 'block' : 'none';
    if (psvGroup) psvGroup.style.display = this.settings.mode === 'psv' ? 'block' : 'none';
  },

  startChallenge(type) {
    this.challenge = type;
    this.challengeSolved = false;
    this.resetPatientToNormal();

    // Toggle active classes on challenge items
    const challenges = ['Normal', 'ARDS', 'Alarm'];
    challenges.forEach(c => {
      const el = document.getElementById(`challenge${c}Btn`);
      if (el) {
        if (c.toLowerCase() === (type || 'normal')) el.classList.add('active');
        else el.classList.remove('active');
      }
    });

    const interventionCard = document.getElementById('ventInterventionCard');
    const promptCard = document.getElementById('ventChallengePrompt');

    if (type === 'ards') {
      this.patient.compliance = 18; // Very stiff lungs (severe ARDS)
      this.patient.ibw = 55; // 55 kg ideal body weight
      this.patient.hco3 = 24;

      // Adjust settings to poor starting values for ARDS
      this.settings.mode = 'vc';
      this.settings.vt = 520; // 9.5 mL/kg (excessive)
      this.settings.peep = 5; // too low, leads to collapse
      this.settings.fio2 = 60;
      this.settings.rr = 14;

      // Update UI sliders to match
      this.syncSlidersToSettings();
      this.toggleControlVisibility();

      if (interventionCard) interventionCard.style.display = 'none';
      if (promptCard) {
        promptCard.style.display = 'block';
        promptCard.innerHTML = `
          <div style="color:var(--color-yellow); font-weight:600; margin-bottom:8px;">משימה: הנשמה מגינת ריאות ל-ARDS</div>
          <p style="font-size:0.85rem; line-height:1.5;">
            לפניך מטופלת השוקלת <strong>55 ק"ג (משקל אידיאלי - IBW)</strong> עם תסמונת כשל נשימתי קשה.
            הלחצים בריאות גבוהים מאוד ($P_{plat}$ מעל 30) והחמצון לקוי.
            <strong>יעדי הטיפול:</strong><br>
            1. הפחת את נפח ההנשמה ($V_t$) לטווח בטוח של <strong>6 מ"ל/ק"ג IBW</strong> (סביב 330 מ"ל).<br>
            2. העלה את ה-PEEP (לפחות ל-12 cmH2O) כדי לגייס נאדיות ריאה.<br>
            3. שמור על לחץ פלאטו ($P_{plat}$) <strong>קטן או שווה ל-30 cmH2O</strong>.<br>
            4. שמור על סטורציה ($SpO_2$) <strong>מעל 88%</strong>.
          </p>
        `;
      }
    } else if (type === 'alarm') {
      this.patient.compliance = 45;
      this.patient.resistance = 38; // sudden extreme airway resistance (secretions + bronchospasm)
      this.patient.secretionPlug = true;
      this.patient.bronchospasm = true;
      this.patient.ibw = 70;

      this.settings.mode = 'vc';
      this.settings.vt = 500;
      this.settings.peep = 5;
      this.settings.flow = 60; // 1 L/s flow rate
      this.settings.rr = 14;

      this.syncSlidersToSettings();
      this.toggleControlVisibility();

      if (interventionCard) interventionCard.style.display = 'block';
      if (promptCard) {
        promptCard.style.display = 'block';
        promptCard.innerHTML = `
          <div style="color:var(--color-red); font-weight:600; margin-bottom:8px;">משימה: פתרון אזעקת לחץ שיא גבוה (High PIP)</div>
          <p style="font-size:0.85rem; line-height:1.5;">
            הנשם מצפצף ללא הפסקה עקב לחצי הנשמה גבוהים מאוד.
            <strong>לחץ השיא (PIP) מעל 40 cmH2O</strong>, המאיים לקרוע את הריאה.
            נראה כי יש חסימה בדרכי האוויר.
            השתמש בכפתורי הפעולות הקליניות משמאל כדי לזהות ולפתור את הבעיה:
            שאב הפרשות, תן מרחיבי סימפונות, ובדוק את הצינור.
          </p>
        `;
      }
    } else {
      // Normal state
      if (interventionCard) interventionCard.style.display = 'none';
      if (promptCard) promptCard.style.display = 'none';
    }

    this.updateOutputs();
  },

  syncSlidersToSettings() {
    const mapping = {
      ventVt: this.settings.vt,
      ventRR: this.settings.rr,
      ventPEEP: this.settings.peep,
      ventFiO2: this.settings.fio2,
      ventPi: this.settings.pi,
      ventPs: this.settings.ps,
      ventFlow: this.settings.flow
    };

    for (let id in mapping) {
      const slider = document.getElementById(id);
      const valBox = document.getElementById(id + 'Val');
      if (slider) slider.value = mapping[id];
      if (valBox) valBox.textContent = mapping[id];
    }
    
    // Sync mode radio tiles
    const radio = document.querySelector(`input[name="ventMode"][value="${this.settings.mode}"]`);
    if (radio) radio.checked = true;
  },

  performIntervention(action) {
    if (this.challenge !== 'alarm') return;

    const feedbackText = document.getElementById('interventionFeedback');
    
    if (action === 'suction') {
      if (this.patient.secretionPlug) {
        this.patient.secretionPlug = false;
        this.patient.resistance -= 15; // reduce resistance
        feedbackText.innerHTML = '<span style="color:var(--color-green)">שאבת הפרשות סמיכות מתוך הטובוס בהצלחה. ההתנגדות פחתה!</span>';
      } else {
        feedbackText.innerHTML = '<span style="color:var(--text-secondary)">שאבת את הצינור, אך לא יצאו הפרשות משמעותיות.</span>';
      }
    } else if (action === 'dilator') {
      if (this.patient.bronchospasm) {
        this.patient.bronchospasm = false;
        this.patient.resistance -= 13; // reduce resistance
        feedbackText.innerHTML = '<span style="color:var(--color-green)">נתת אינהלציה של Salbutamol (מרחיב סימפונות). קולות הצפצוף בריאות פחתו והסימפונות התרחבו!</span>';
      } else {
        feedbackText.innerHTML = '<span style="color:var(--text-secondary)">נתת מרחיבי סימפונות, אך החולה לא סבלה מברונכוספאזם.</span>';
      }
    } else if (action === 'biteblock') {
      feedbackText.innerHTML = '<span style="color:var(--text-secondary)">בדקת את הצינור והנחת מנתב מונע נשיכה. הצינור אינו חסום על ידי שיני המטופלת.</span>';
    }

    this.updateOutputs();
  },

  // Core Math Physiology Model
  updateOutputs() {
    const { mode, vt, rr, peep, fio2, pi, ps, flow } = this.settings;
    const { compliance, resistance, hco3 } = this.patient;

    let outVt = vt;
    let outPIP = 0;
    let outPplat = 0;
    let outVe = 0;

    // Convert flow from L/min to L/s
    const flowLps = flow / 60;

    // Mode-specific math
    if (mode === 'vc') {
      outVt = vt;
      outPplat = peep + (outVt / compliance);
      outPIP = outPplat + (flowLps * resistance);
      outVe = (outVt * rr) / 1000;
    } else if (mode === 'pc') {
      // PIP is set directly by pressure control
      outPIP = peep + pi;
      outPplat = outPIP;
      // Tidal volume is calculated based on pressure change and compliance
      outVt = Math.round(pi * compliance);
      outVe = (outVt * rr) / 1000;
    } else if (mode === 'psv') {
      // Pressure support ventilation (spontaneous breathing)
      outPIP = peep + ps;
      outPplat = outPIP;
      outVt = Math.round(ps * compliance);
      // Spontaneous rate assumed slightly higher
      const sptRR = rr + 4;
      outVe = (outVt * sptRR) / 1000;
    }

    // ARDS/Physiological Arterial Blood Gas predictions
    // Calculate oxygenation (PaO2)
    // Decreases if compliance is low (stiff lungs/ARDS) unless PEEP and FiO2 are increased
    const normCompliance = compliance / 50; // fraction of normal compliance
    const peepFactor = Math.min(1.5, 0.4 + (peep / 15)); // oxygenation benefit from PEEP (recruit alveoli)
    
    let pao2 = (fio2 / 100) * 500 * normCompliance * peepFactor;
    pao2 = Math.min(550, Math.max(30, pao2));

    // Calculate SpO2 using oxygen-hemoglobin dissociation curve sigmoid approximation
    let spo2 = Math.round(100 * (Math.pow(pao2, 3) / (Math.pow(pao2, 3) + 150000)));
    spo2 = Math.min(100, Math.max(35, spo2));

    // Calculate carbon dioxide (PaCO2)
    // Inversely proportional to minute ventilation
    let paco2 = 40 * (6.0 / outVe);
    // Add effect of fever or sepsis on CO2 production
    if (this.challenge === 'ards') paco2 += 4; // slight sepsis increase
    paco2 = Math.min(110, Math.max(15, paco2));

    // Calculate arterial pH using Henderson-Hasselbalch equation: pH = 6.1 + log10(HCO3 / (0.03 * PaCO2))
    let ph = 6.1 + Math.log10(hco3 / (0.03 * paco2));
    ph = Math.min(7.8, Math.max(6.8, ph));

    // Render results in ventilator display
    this.renderDigitalVal('valVt', outVt, 'mL');
    this.renderDigitalVal('valPIP', Math.round(outPIP), 'cmH₂O');
    this.renderDigitalVal('valPplat', Math.round(outPplat), 'cmH₂O');
    this.renderDigitalVal('valVe', outVe.toFixed(1), 'L/min');
    
    this.renderDigitalVal('valPH', ph.toFixed(2), '');
    this.renderDigitalVal('valPaCO2', Math.round(paco2), 'mmHg');
    this.renderDigitalVal('valPaO2', Math.round(pao2), 'mmHg');
    this.renderDigitalVal('valSpO2', spo2, '%');

    // Update global vitals parameters for active syncing
    VitalsState.hr = (this.challenge === 'ards') ? 104 : 75;
    VitalsState.sbp = (this.challenge === 'ards') ? 112 : 120;
    VitalsState.dbp = (this.challenge === 'ards') ? 68 : 80;
    VitalsState.spo2 = spo2;
    VitalsState.rr = (mode === 'psv') ? rr + 4 : rr;
    VitalsState.etco2 = Math.round(paco2 - 2); // EtCO2 is typically 2-5 mmHg lower than PaCO2
    
    // Set alarm statuses based on thresholds
    let alarm = false;
    if (outPIP > 40) {
      alarm = true;
      document.getElementById('valPIP')?.classList.add('red');
    } else {
      document.getElementById('valPIP')?.classList.remove('red');
    }

    if (outPplat > 30) {
      document.getElementById('valPplat')?.classList.add('yellow');
    } else {
      document.getElementById('valPplat')?.classList.remove('yellow');
    }

    if (spo2 < 90) {
      alarm = true;
      document.getElementById('valSpO2')?.classList.add('red');
    } else {
      document.getElementById('valSpO2')?.classList.remove('red');
    }

    VitalsState.alarmActive = alarm;
    if (window.vitalsEngine) {
      window.vitalsEngine.updateNumericDisplay();
    }

    // Evaluate Challenges criteria
    this.evaluateChallengeCriteria(outVt, outPplat, spo2);
  },

  renderDigitalVal(id, val, unit) {
    const el = document.getElementById(id);
    if (el) {
      el.innerHTML = `${val} <span class="vent-metric-unit">${unit}</span>`;
    }
  },

  evaluateChallengeCriteria(outVt, outPplat, spo2) {
    if (this.challengeSolved) return;

    const feedbackBox = document.getElementById('ventChallengeFeedback');

    if (this.challenge === 'ards') {
      const vtPerKg = outVt / this.patient.ibw;
      
      const isVtSafe = vtPerKg <= 6.5; // safe tidal volume (around 6 mL/kg)
      const isPplatSafe = outPplat <= 30; // Plateau pressure safe
      const isPEEPSufficient = this.settings.peep >= 12; // High PEEP strategy
      const isOxygenationSafe = spo2 >= 88; // Satisfactory SpO2 target

      if (isVtSafe && isPplatSafe && isPEEPSufficient && isOxygenationSafe) {
        this.challengeSolved = true;
        if (feedbackBox) {
          feedbackBox.className = 'card challenge-box pulse-glow-cyan';
          feedbackBox.style.borderColor = 'var(--color-green)';
          feedbackBox.style.background = 'rgba(0, 230, 118, 0.05)';
          feedbackBox.style.display = 'block';
          feedbackBox.innerHTML = `
            <div style="display:flex; align-items:center; gap:12px; color:var(--color-green)">
              <i class="fa-solid fa-circle-check" style="font-size:2rem"></i>
              <div>
                <strong style="font-size:1.1rem">משימת ARDS הושלמה בהצלחה!</strong><br>
                החלת אסטרטגיית הנשמה מגינת ריאות (Protective Ventilation):<br>
                - הגבלת את נפח ההנשמה ל-<strong>${vtPerKg.toFixed(1)} מ"ל/ק"ג IBW</strong> (נפח בטוח).<br>
                - הגנת על הריאות ממתח מתיחה גבוה ($P_{plat} = ${Math.round(outPplat)} \\le 30$ cmH2O).<br>
                - גייסת נאדיות ריאה קורסות באמצעות PEEP מספק (${this.settings.peep} cmH2O).<br>
                החולה יציבה ומאוזנת היטב.
              </div>
            </div>
          `;
        }
      } else {
        if (feedbackBox) feedbackBox.style.display = 'none';
      }
    } else if (this.challenge === 'alarm') {
      const isPIPNormal = this.settings.mode === 'vc' ? (this.patient.resistance <= 10) : true;
      
      if (isPIPNormal && !this.patient.secretionPlug && !this.patient.bronchospasm) {
        this.challengeSolved = true;
        if (feedbackBox) {
          feedbackBox.className = 'card challenge-box pulse-glow-cyan';
          feedbackBox.style.borderColor = 'var(--color-green)';
          feedbackBox.style.background = 'rgba(0, 230, 118, 0.05)';
          feedbackBox.style.display = 'block';
          feedbackBox.innerHTML = `
            <div style="display:flex; align-items:center; gap:12px; color:var(--color-green)">
              <i class="fa-solid fa-circle-check" style="font-size:2rem"></i>
              <div>
                <strong style="font-size:1.1rem">אזעקת לחץ שיא גבוה נפתרה בהצלחה!</strong><br>
                פתרת את בעיות החסימה בדרכי האוויר:<br>
                - ביצעת סקשן לטובוס וסילקת הפרשות חוסמות.<br>
                - נתת מרחיבי סימפונות והקלת על ברונכוספאזם חריף.<br>
                לחץ השיא (PIP) ירד לערך תקין ובטוח של <strong>${Math.round(this.settings.peep + (this.settings.vt / this.patient.compliance) + (this.settings.flow/60 * this.patient.resistance))} cmH2O</strong>. האזעקות הופסקו.
              </div>
            </div>
          `;
        }
      } else {
        if (feedbackBox) feedbackBox.style.display = 'none';
      }
    }
  }
};

window.VentSim = VentSim;
