// ABG Game Manager
const ABGGame = {
  currentABG: {
    pH: 7.40,
    pCO2: 40,
    hco3: 24,
    pO2: 95
  },
  
  // User answers
  answers: {
    primary: null,       // acidosis / alkalosis / normal
    origin: null,        // respiratory / metabolic / normal
    compensation: null,  // none / partial / full / normal
    oxygenation: null    // normal / mild / moderate / severe
  },
  
  score: 0,
  streak: 0,
  highScore: 0,
  
  // Game modes
  templates: [
    {
      name: "Normal (תקין)",
      gen: () => {
        return {
          pH: parseFloat((7.36 + Math.random() * 0.08).toFixed(2)),
          pCO2: Math.round(36 + Math.random() * 8),
          hco3: Math.round(22 + Math.random() * 4),
          pO2: Math.round(85 + Math.random() * 15)
        };
      }
    },
    {
      name: "Acute Uncompensated Respiratory Acidosis (חמצת נשימתית חריפה ללא פיצוי)",
      gen: () => {
        return {
          pH: parseFloat((7.15 + Math.random() * 0.15).toFixed(2)),
          pCO2: Math.round(52 + Math.random() * 18),
          hco3: Math.round(23 + Math.random() * 2), // normal
          pO2: Math.round(50 + Math.random() * 25)
        };
      }
    },
    {
      name: "Partially Compensated Respiratory Acidosis (חמצת נשימתית עם פיצוי חלקי)",
      gen: () => {
        return {
          pH: parseFloat((7.24 + Math.random() * 0.09).toFixed(2)),
          pCO2: Math.round(58 + Math.random() * 14),
          hco3: Math.round(28 + Math.random() * 5), // high compensation
          pO2: Math.round(55 + Math.random() * 20)
        };
      }
    },
    {
      name: "Fully Compensated Respiratory Acidosis (חמצת נשימתית עם פיצוי מלא)",
      gen: () => {
        return {
          pH: parseFloat((7.35 + Math.random() * 0.04).toFixed(2)), // normal but acidic side
          pCO2: Math.round(55 + Math.random() * 12),
          hco3: Math.round(30 + Math.random() * 4), // high compensation
          pO2: Math.round(60 + Math.random() * 25)
        };
      }
    },
    {
      name: "Uncompensated Metabolic Acidosis (חמצת מטבולית ללא פיצוי)",
      gen: () => {
        return {
          pH: parseFloat((7.12 + Math.random() * 0.16).toFixed(2)),
          pCO2: Math.round(36 + Math.random() * 8), // normal
          hco3: Math.round(10 + Math.random() * 8),
          pO2: Math.round(80 + Math.random() * 18)
        };
      }
    },
    {
      name: "Partially Compensated Metabolic Acidosis (חמצת מטבולית עם פיצוי חלקי)",
      gen: () => {
        return {
          pH: parseFloat((7.20 + Math.random() * 0.12).toFixed(2)),
          pCO2: Math.round(22 + Math.random() * 10), // compensating down
          hco3: Math.round(12 + Math.random() * 6),
          pO2: Math.round(80 + Math.random() * 18)
        };
      }
    },
    {
      name: "Fully Compensated Metabolic Acidosis (חמצת מטבולית עם פיצוי מלא)",
      gen: () => {
        return {
          pH: parseFloat((7.35 + Math.random() * 0.04).toFixed(2)), // normal but acidic side
          pCO2: Math.round(24 + Math.random() * 6), // compensating down
          hco3: Math.round(14 + Math.random() * 4),
          pO2: Math.round(85 + Math.random() * 12)
        };
      }
    },
    {
      name: "Acute Uncompensated Respiratory Alkalosis (בססת נשימתית חריפה ללא פיצוי)",
      gen: () => {
        return {
          pH: parseFloat((7.50 + Math.random() * 0.10).toFixed(2)),
          pCO2: Math.round(20 + Math.random() * 10),
          hco3: Math.round(23 + Math.random() * 2), // normal
          pO2: Math.round(85 + Math.random() * 15)
        };
      }
    },
    {
      name: "Partially Compensated Respiratory Alkalosis (בססת נשימתית עם פיצוי חלקי)",
      gen: () => {
        return {
          pH: parseFloat((7.46 + Math.random() * 0.05).toFixed(2)),
          pCO2: Math.round(22 + Math.random() * 8),
          hco3: Math.round(16 + Math.random() * 4), // compensating down
          pO2: Math.round(90 + Math.random() * 10)
        };
      }
    },
    {
      name: "Uncompensated Metabolic Alkalosis (בססת מטבולית ללא פיצוי)",
      gen: () => {
        return {
          pH: parseFloat((7.48 + Math.random() * 0.08).toFixed(2)),
          pCO2: Math.round(38 + Math.random() * 6), // normal
          hco3: Math.round(30 + Math.random() * 6),
          pO2: Math.round(85 + Math.random() * 12)
        };
      }
    },
    {
      name: "Partially Compensated Metabolic Alkalosis (בססת מטבולית עם פיצוי חלקי)",
      gen: () => {
        return {
          pH: parseFloat((7.46 + Math.random() * 0.04).toFixed(2)),
          pCO2: Math.round(48 + Math.random() * 6), // compensating up
          hco3: Math.round(32 + Math.random() * 5),
          pO2: Math.round(80 + Math.random() * 15)
        };
      }
    }
  ],

  init() {
    // Load high score from localStorage
    this.highScore = parseInt(localStorage.getItem('abgHighScore')) || 0;
    this.updateScoreUI();
    this.generateNewABG();
    this.setupListeners();
  },

  generateNewABG() {
    // Select template at random
    const randTemplate = this.templates[Math.floor(Math.random() * this.templates.length)];
    this.currentABG = randTemplate.gen();
    
    // Reset answers
    this.answers = { primary: null, origin: null, compensation: null, oxygenation: null };
    
    // Clear selection UI
    const inputs = document.querySelectorAll('.abg-pill-input');
    inputs.forEach(input => {
      input.checked = false;
      const label = input.nextElementSibling;
      if (label) {
        label.style.borderColor = '';
        label.style.backgroundColor = '';
      }
    });
    
    const feedbackBox = document.getElementById('abgFeedback');
    if (feedbackBox) {
      feedbackBox.style.display = 'none';
      feedbackBox.className = 'abg-feedback-box';
      feedbackBox.innerHTML = '';
    }

    const checkBtn = document.getElementById('abgCheckBtn');
    if (checkBtn) {
      checkBtn.style.display = 'block';
    }
    const nextBtn = document.getElementById('abgNextBtn');
    if (nextBtn) {
      nextBtn.style.display = 'none';
    }

    // Render ABG values on display board
    document.getElementById('abgValPH').textContent = this.currentABG.pH.toFixed(2);
    document.getElementById('abgValPCO2').textContent = this.currentABG.pCO2;
    document.getElementById('abgValHCO3').textContent = this.currentABG.hco3;
    document.getElementById('abgValPO2').textContent = this.currentABG.pO2;
    
    // Set clinical range colors
    this.setRangeColor('abgValPH', this.currentABG.pH, 7.35, 7.45);
    this.setRangeColor('abgValPCO2', this.currentABG.pCO2, 35, 45, true); // true = inverted response (high is respiratory acid)
    this.setRangeColor('abgValHCO3', this.currentABG.hco3, 22, 26);
    this.setRangeColor('abgValPO2', this.currentABG.pO2, 80, 100);
  },

  setRangeColor(id, val, min, max, invert = false) {
    const el = document.getElementById(id);
    if (!el) return;
    
    el.className = 'abg-card-value ';
    if (val < min) {
      el.className += invert ? 'cyan' : 'red'; // below range
    } else if (val > max) {
      el.className += invert ? 'red' : 'cyan'; // above range
    } else {
      el.className += 'green'; // normal
    }
  },

  setupListeners() {
    // Collect button selections
    const pillGroups = document.querySelectorAll('.abg-pill-group');
    pillGroups.forEach(group => {
      // Remove any existing event listeners by cloning if necessary or just bind if new view
      // Since SPA replaces innerHTML, listeners are cleared automatically when node is removed.
      group.addEventListener('change', (e) => {
        if (e.target.classList.contains('abg-pill-input')) {
          const category = e.target.name; // primary, origin, compensation, oxygenation
          this.answers[category] = e.target.value;
        }
      });
    });

    document.getElementById('abgCheckBtn')?.addEventListener('click', () => this.checkUserAnswers());
    document.getElementById('abgNextBtn')?.addEventListener('click', () => this.generateNewABG());
  },

  // Calculate correct diagnosis based on clinical guidelines
  getCorrectDiagnosis() {
    const { pH, pCO2, hco3, pO2 } = this.currentABG;
    let primary, origin, compensation, oxygenation;

    // 1. Primary acidosis/alkalosis
    if (pH < 7.35) {
      primary = 'acidosis';
    } else if (pH > 7.45) {
      primary = 'alkalosis';
    } else {
      primary = 'normal'; // default, might change to fully compensated
    }

    // 2. Determine Respiratory or Metabolic origin
    if (primary === 'acidosis') {
      // Look for the source of acidosis
      if (pCO2 > 45 && hco3 < 22) {
        origin = 'mixed'; // mixed acidosis
      } else if (pCO2 > 45) {
        origin = 'respiratory';
      } else {
        origin = 'metabolic';
      }
    } else if (primary === 'alkalosis') {
      // Look for source of alkalosis
      if (pCO2 < 35 && hco3 > 26) {
        origin = 'mixed';
      } else if (pCO2 < 35) {
        origin = 'respiratory';
      } else {
        origin = 'metabolic';
      }
    } else {
      // pH is normal (7.35 to 7.45). Let's check for fully compensated states
      if (pCO2 > 45 && hco3 > 26) {
        // High CO2 (acidic) and High HCO3 (basic)
        primary = pH < 7.40 ? 'acidosis' : 'alkalosis';
        origin = pH < 7.40 ? 'respiratory' : 'metabolic';
      } else if (pCO2 < 35 && hco3 < 22) {
        // Low CO2 (basic) and Low HCO3 (acidic)
        primary = pH < 7.40 ? 'acidosis' : 'alkalosis';
        origin = pH < 7.40 ? 'metabolic' : 'respiratory';
      } else {
        primary = 'normal';
        origin = 'normal';
      }
    }

    // 3. Compensation state
    if (primary === 'normal') {
      compensation = 'normal';
    } else {
      // Acidosis or Alkalosis
      if (origin === 'respiratory') {
        if (primary === 'acidosis') {
          if (hco3 <= 26) compensation = 'none';
          else if (pH < 7.35) compensation = 'partial';
          else compensation = 'full';
        } else { // alkalosis
          if (hco3 >= 22) compensation = 'none';
          else if (pH > 7.45) compensation = 'partial';
          else compensation = 'full';
        }
      } else if (origin === 'metabolic') {
        if (primary === 'acidosis') {
          if (pCO2 >= 35) compensation = 'none';
          else if (pH < 7.35) compensation = 'partial';
          else compensation = 'full';
        } else { // alkalosis
          if (pCO2 <= 45) compensation = 'none';
          else if (pH > 7.45) compensation = 'partial';
          else compensation = 'full';
        }
      } else {
        compensation = 'none'; // mixed has no simple compensation
      }
    }

    // 4. Oxygenation
    if (pO2 >= 80) oxygenation = 'normal';
    else if (pO2 >= 60) oxygenation = 'mild';
    else if (pO2 >= 45) oxygenation = 'moderate';
    else oxygenation = 'severe';

    return { primary, origin, compensation, oxygenation };
  },

  checkUserAnswers() {
    // Verify user filled everything
    if (!this.answers.primary || !this.answers.origin || !this.answers.compensation || !this.answers.oxygenation) {
      alert("נא לבחור את כל ארבעת חלקי האבחנה לפני הבדיקה!");
      return;
    }

    const correct = this.getCorrectDiagnosis();
    
    const isPrimaryCorrect = this.answers.primary === correct.primary;
    const isOriginCorrect = this.answers.origin === correct.origin;
    const isCompensationCorrect = this.answers.compensation === correct.compensation;
    const isOxygenationCorrect = this.answers.oxygenation === correct.oxygenation;

    const isAllCorrect = isPrimaryCorrect && isOriginCorrect && isCompensationCorrect && isOxygenationCorrect;
    
    const feedbackBox = document.getElementById('abgFeedback');
    
    if (isAllCorrect) {
      this.score += 10;
      this.streak += 1;
      if (this.streak > this.highScore) {
        this.highScore = this.streak;
        localStorage.setItem('abgHighScore', this.highScore);
      }
      
      feedbackBox.className = 'abg-feedback-box correct';
      feedbackBox.innerHTML = `
        <strong><i class="fa-solid fa-circle-check"></i> נכון מאוד! (+10 נקודות)</strong><br>
        האבחנה המדויקת היא: 
        ${this.translateAnswer('primary', correct.primary)} | 
        ${this.translateAnswer('origin', correct.origin)} | 
        ${this.translateAnswer('compensation', correct.compensation)} | 
        ${this.translateAnswer('oxygenation', correct.oxygenation)}.<br>
        <p style="font-size:0.85rem; margin-top:8px; opacity:0.95;">
          ${this.getClinicalExplanation(this.currentABG, correct)}
        </p>
      `;
    } else {
      this.streak = 0;
      feedbackBox.className = 'abg-feedback-box incorrect';
      feedbackBox.innerHTML = `
        <strong><i class="fa-solid fa-circle-xmark"></i> לא מדויק, נסה שוב! (הסדרה אופסה)</strong><br>
        האבחנה הנכונה היא: <br>
        <span style="color:var(--color-cyan)">
          ${this.translateAnswer('primary', correct.primary)} | 
          ${this.translateAnswer('origin', correct.origin)} | 
          ${this.translateAnswer('compensation', correct.compensation)} | 
          ${this.translateAnswer('oxygenation', correct.oxygenation)}
        </span><br>
        <p style="font-size:0.85rem; margin-top:8px; opacity:0.95;">
          ${this.getClinicalExplanation(this.currentABG, correct)}
        </p>
      `;
    }

    this.updateScoreUI();
    
    // Toggle buttons
    document.getElementById('abgCheckBtn').style.display = 'none';
    document.getElementById('abgNextBtn').style.display = 'block';

    // Highlight correct pills and mark incorrect ones
    this.highlightCorrectPills(correct);
  },

  highlightCorrectPills(correct) {
    const categories = ['primary', 'origin', 'compensation', 'oxygenation'];
    categories.forEach(cat => {
      const inputs = document.querySelectorAll(`input[name="${cat}"]`);
      inputs.forEach(input => {
        const label = input.nextElementSibling;
        if (input.value === correct[cat]) {
          label.style.borderColor = 'var(--color-green)';
          label.style.backgroundColor = 'rgba(0, 230, 118, 0.1)';
        } else if (input.checked) {
          label.style.borderColor = 'var(--color-red)';
          label.style.backgroundColor = 'rgba(255, 23, 68, 0.1)';
        }
      });
    });
  },

  translateAnswer(category, value) {
    const translations = {
      primary: {
        normal: 'תקין',
        acidosis: 'חמצת (Acidosis)',
        alkalosis: 'בססת (Alkalosis)'
      },
      origin: {
        normal: 'תקין',
        respiratory: 'נשימתי (Respiratory)',
        metabolic: 'מטבולי (Metabolic)',
        mixed: 'מעורב (Mixed)'
      },
      compensation: {
        normal: 'ללא הפרעה',
        none: 'ללא פיצוי (Uncompensated)',
        partial: 'פיצוי חלקי (Partially Compensated)',
        full: 'פיצוי מלא (Fully Compensated)'
      },
      oxygenation: {
        normal: 'חמצון תקין',
        mild: 'היפוקסמיה קלה (Mild)',
        moderate: 'היפוקסמיה בינונית (Moderate)',
        severe: 'היפוקסמיה קשה (Severe)'
      }
    };
    return translations[category][value] || value;
  },

  getClinicalExplanation(abg, correct) {
    let text = "";
    if (correct.primary === 'normal' && correct.origin === 'normal') {
      return "כל המדדים (pH, pCO2, HCO3, pO2) נמצאים בטווח התקין. המטופל מאוזן מבחינה נשימתית ומטבולית.";
    }

    text += `ה-pH הוא ${abg.pH.toFixed(2)} (${abg.pH < 7.35 ? 'חומצי, מתחת ל-7.35' : abg.pH > 7.45 ? 'בסיסי, מעל ל-7.45' : 'בטווח התקין 7.35-7.45 אך נוטה לכיוון ה' + (abg.pH < 7.40 ? 'חומצי' : 'בסיסי')}). `;

    if (correct.origin === 'respiratory') {
      text += `הגורם הראשוני הוא נשימתי מכיוון שערך ה-pCO2 של ${abg.pCO2} ממ"כ כיוון את ה-pH לכיוון ה${correct.primary === 'acidosis' ? 'חומצי (pCO2 גבוה מהתקין של 35-45)' : 'בסיסי (pCO2 נמוך מהתקין)'}. `;
      
      if (correct.compensation === 'none') {
        text += `הכליות טרם הגיבו וה-HCO3 הוא ${abg.hco3} (בטווח התקין 22-26), ולכן מדובר במצב ללא פיצוי.`;
      } else if (correct.compensation === 'partial') {
        text += `הכליות החלו לפצות על ידי שינוי רמת ה-HCO3 ל-${abg.hco3} (מחוץ לטווח התקין), אך ה-pH עדיין לא חזר לטווח התקין.`;
      } else if (correct.compensation === 'full') {
        text += `הכליות ביצעו פיצוי מלא על ידי שינוי ה-HCO3 ל-${abg.hco3}, מה שהחזיר את ה-pH לטווח התקין (${abg.pH.toFixed(2)}).`;
      }
    } else if (correct.origin === 'metabolic') {
      text += `הגורם הראשוני הוא מטבולי מכיוון שערך ה-HCO3 של ${abg.hco3} מאק/ליטר כיוון את ה-pH לכיוון ה${correct.primary === 'acidosis' ? 'חומצי (HCO3 נמוך מהתקין של 22-26)' : 'בסיסי (HCO3 גבוה מהתקין)'}. `;
      
      if (correct.compensation === 'none') {
        text += `הריאות טרם הגיבו (pCO2 בטווח התקין 35-45 של ${abg.pCO2}), ולכן אין פיצוי.`;
      } else if (correct.compensation === 'partial') {
        text += `הריאות החלו לפצות על ידי שינוי קצב הנשימה (pCO2 הוא ${abg.pCO2}), אך ה-pH עדיין מחוץ לטווח התקין.`;
      } else if (correct.compensation === 'full') {
        text += `הריאות ביצעו פיצוי מלא על ידי שינוי ה-pCO2 ל-${abg.pCO2}, מה שהחזיר את ה-pH לטווח התקין (${abg.pH.toFixed(2)}).`;
      }
    }

    if (abg.pO2 < 80) {
      text += ` בנוסף, ה-pO2 נמוך (${abg.pO2} ממ"כ), דבר המעיד על היפוקסמיה ברמת חומרה ${correct.oxygenation === 'mild' ? 'קלה' : correct.oxygenation === 'moderate' ? 'בינונית' : 'קשה'}.`;
    } else {
      text += ` רמת החמצן בדם תקינה (pO2 = ${abg.pO2} ממ"כ).`;
    }

    return text;
  },

  updateScoreUI() {
    const scoreVal = document.getElementById('abgScoreVal');
    const streakVal = document.getElementById('abgStreakVal');
    const highScoreVal = document.getElementById('abgHighScoreVal');
    
    if (scoreVal) scoreVal.textContent = this.score;
    if (streakVal) streakVal.textContent = this.streak;
    if (highScoreVal) highScoreVal.textContent = this.highScore;
  }
};

window.ABGGame = ABGGame;
