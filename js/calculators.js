// ICU Calculators Engine
const ICUCalcs = {
  init() {
    this.setupListeners();
    this.calculateDose();
    this.calculatePF();
    this.calculateGCS();
    this.calculateVt();
  },

  setupListeners() {
    // 1. Infusion Rate Calculator listeners
    const doseInputs = ['doseVal', 'doseWeight', 'doseDrugAmt', 'doseBagVol', 'doseUnitSelect'];
    doseInputs.forEach(id => {
      document.getElementById(id)?.addEventListener('input', () => this.calculateDose());
      document.getElementById(id)?.addEventListener('change', () => this.calculateDose());
    });

    // 2. P/F Ratio listeners
    document.getElementById('pfPaO2')?.addEventListener('input', () => this.calculatePF());
    document.getElementById('pfFiO2')?.addEventListener('input', () => this.calculatePF());

    // 3. GCS listeners
    const gcsOptions = document.querySelectorAll('.gcs-option-input');
    gcsOptions.forEach(opt => {
      opt.addEventListener('change', () => this.calculateGCS());
    });

    // 4. Ideal Body Weight Vt listeners
    document.getElementById('vtHeight')?.addEventListener('input', () => this.calculateVt());
    const vtGenders = document.querySelectorAll('input[name="vtGender"]');
    vtGenders.forEach(opt => {
      opt.addEventListener('change', () => this.calculateVt());
    });
  },

  // 1. Infusion Rate Calculation
  calculateDose() {
    const doseVal = parseFloat(document.getElementById('doseVal')?.value) || 0;
    const weight = parseFloat(document.getElementById('doseWeight')?.value) || 70;
    const drugAmt = parseFloat(document.getElementById('doseDrugAmt')?.value) || 0; // in mg
    const bagVol = parseFloat(document.getElementById('doseBagVol')?.value) || 100; // in ml
    const unit = document.getElementById('doseUnitSelect')?.value || 'mcg_kg_min';

    const resultValEl = document.getElementById('doseResultVal');
    const interpEl = document.getElementById('doseInterp');

    if (!resultValEl || drugAmt <= 0 || bagVol <= 0) {
      if (resultValEl) resultValEl.textContent = '0.0';
      return;
    }

    let rate = 0; // ml/hr
    const concMgMl = drugAmt / bagVol; // mg/ml
    const concMcgMl = concMgMl * 1000; // mcg/ml

    if (unit === 'mcg_kg_min') {
      // Rate = (dose * weight * 60) / concentration_mcg_ml
      rate = (doseVal * weight * 60) / concMcgMl;
    } else if (unit === 'mcg_min') {
      // Rate = (dose * 60) / concentration_mcg_ml
      rate = (doseVal * 60) / concMcgMl;
    } else if (unit === 'mg_hr') {
      // Rate = dose_mg_hr / concentration_mg_ml
      rate = doseVal / concMgMl;
    }

    resultValEl.textContent = rate.toFixed(1);
    
    if (interpEl) {
      interpEl.innerHTML = `ריכוז תרופה בתמיסה: <strong>${concMgMl.toFixed(2)} מ"ג/מ"ל</strong> (${concMcgMl.toFixed(0)} מק"ג/מ"ל)`;
    }
  },

  // 2. PaO2/FiO2 Ratio Calculation
  calculatePF() {
    const pao2 = parseFloat(document.getElementById('pfPaO2')?.value) || 0;
    const fio2Percent = parseFloat(document.getElementById('pfFiO2')?.value) || 21; // 21 - 100
    
    const resultValEl = document.getElementById('pfResultVal');
    const interpEl = document.getElementById('pfInterp');

    if (!resultValEl) return;

    if (pao2 <= 0 || fio2Percent < 21 || fio2Percent > 100) {
      resultValEl.textContent = '---';
      if (interpEl) interpEl.textContent = 'נא להזין ערכים תקינים';
      return;
    }

    const fio2Dec = fio2Percent / 100;
    const pfRatio = Math.round(pao2 / fio2Dec);

    resultValEl.textContent = pfRatio;
    
    if (interpEl) {
      resultValEl.className = 'calc-result-value ';
      if (pfRatio >= 300) {
        resultValEl.className += 'green';
        interpEl.innerHTML = '<span style="color:var(--color-green)">חמצון תקין / ללא ARDS (יחס P/F > 300)</span>';
      } else if (pfRatio >= 200) {
        resultValEl.className += 'yellow';
        interpEl.innerHTML = '<span style="color:var(--color-yellow)">תסמונת כשל נשימתי קלה - Mild ARDS (יחס P/F 200-300)</span>';
      } else if (pfRatio >= 100) {
        resultValEl.className += 'red';
        interpEl.innerHTML = '<span style="color:var(--color-red); font-weight:600">תסמונת כשל נשימתי בינונית - Moderate ARDS (יחס P/F 100-200)</span>';
      } else {
        resultValEl.className += 'red';
        interpEl.innerHTML = '<span style="color:var(--color-red); font-weight:700">תסמונת כשל נשימתי קשה - Severe ARDS (יחס P/F < 100)</span>';
      }
    }
  },

  // 3. Glasgow Coma Scale Calculation
  calculateGCS() {
    const getCheckedVal = (name) => {
      const checked = document.querySelector(`input[name="${name}"]:checked`);
      return checked ? parseInt(checked.value) : 0;
    };

    const eye = getCheckedVal('gcsEye');
    const verbal = getCheckedVal('gcsVerbal');
    const motor = getCheckedVal('gcsMotor');

    const total = eye + verbal + motor;
    const resultValEl = document.getElementById('gcsResultVal');
    const interpEl = document.getElementById('gcsInterp');

    if (!resultValEl) return;

    if (eye === 0 || verbal === 0 || motor === 0) {
      resultValEl.textContent = '---';
      if (interpEl) interpEl.textContent = 'נא לבחור אפשרות מכל קטגוריה';
      return;
    }

    resultValEl.textContent = `E${eye} V${verbal} M${motor} = ${total}`;
    
    if (interpEl) {
      resultValEl.className = 'calc-result-value ';
      if (total >= 13) {
        resultValEl.className += 'green';
        interpEl.innerHTML = '<span style="color:var(--color-green)">פגיעת ראש קלה / מצב הכרה שמור (GCS 13-15)</span>';
      } else if (total >= 9) {
        resultValEl.className += 'yellow';
        interpEl.innerHTML = '<span style="color:var(--color-yellow)">פגיעת ראש בינונית (GCS 9-12)</span>';
      } else {
        resultValEl.className += 'red';
        interpEl.innerHTML = '<span style="color:var(--color-red); font-weight:600">פגיעת ראש קשה / תרדמת (GCS 3-8) <br> * שקול אבטחת נתיב אוויר (אינטובציה)</span>';
      }
    }
  },

  // 4. Ideal Body Weight Vt Calculation
  calculateVt() {
    const height = parseFloat(document.getElementById('vtHeight')?.value) || 0;
    const genderEl = document.querySelector('input[name="vtGender"]:checked');
    const gender = genderEl ? genderEl.value : 'male';

    const resultValEl = document.getElementById('vtResultVal');
    const interpEl = document.getElementById('vtInterp');

    if (!resultValEl) return;

    if (height < 100 || height > 250) {
      resultValEl.textContent = '---';
      if (interpEl) interpEl.textContent = 'נא להזין גובה תקין בס"מ';
      return;
    }

    // Devine formula for IBW (height in inches)
    const heightInches = height / 2.54;
    const inchesOver5Feet = Math.max(0, heightInches - 60);
    
    let ibw = 0;
    if (gender === 'male') {
      ibw = 50.0 + 2.3 * inchesOver5Feet;
    } else {
      ibw = 45.5 + 2.3 * inchesOver5Feet;
    }

    const vt6 = Math.round(ibw * 6);
    const vt8 = Math.round(ibw * 8);

    resultValEl.textContent = `${ibw.toFixed(1)} ק"ג`;
    
    if (interpEl) {
      interpEl.innerHTML = `
        טווח נפח הנשמה מומלץ (Tidal Volume) למניעת VILI:<br>
        6 מ"ל/ק"ג (הנשמה מגינה ל-ARDS): <strong>${vt6} מ"ל</strong><br>
        8 מ"ל/ק"ג (הנשמה רגילה): <strong>${vt8} מ"ל</strong>
      `;
    }
  }
};

window.ICUCalcs = ICUCalcs;
