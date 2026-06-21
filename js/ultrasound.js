// ICU Sim-Learn Ultrasound (POCUS) Simulator Coordinator
const ICUUltrasound = {
  activeCase: 'shock', // 'shock', 'hypoxia', 'crackles'
  activeHotspot: null, // 'plax', 'lung_ant', 'lung_base'
  selectedDiagnosis: '',
  gameState: 'scanning', // 'scanning', 'submitted_correct', 'submitted_incorrect'
  
  hasScanned: {
    plax: false,
    lung_ant: false,
    lung_base: false
  },
  
  cases: {
    shock: {
      title: 'הערכת הלם (Shock Assessment)',
      description: 'החולה MORTON קרס עם לחץ דם נמוך (85/45) וסימני הלם קשה. בצע סריקת אולטרסאונד כדי לאבחן את סוג ההלם (קרדיוגני לעומת היפוולמי/ספטי) וקבע טיפול מתאים.',
      vitals: { hr: 120, bp: '85/45', spo2: 93, rr: 24, etco2: 32, temp: 39.1 },
      findings: {
        plax: 'לב היפר-דינמי (Hyperdynamic LV). הדפנות כמעט נושקות זו לזו בסיסטולה ("Kissing Papillary Muscles"). מרמז על שוק ספטי או היפוולמי.',
        lung_ant: 'החלקה ריאתית תקינה (Lung Sliding). אין עדות לחזה אוויר.',
        lung_base: 'שטיפת אוויר תקינה, ללא עדות לתפליט פלורלי.'
      },
      correctDiagnosis: 'opt3',
      correctFeedback: 'תשובה נכונה! הממצאים של לב היפר-דינמי והחלקה ריאתית תקינה שוללים שוק קרדיוגני וחזה אוויר, ותומכים באבחנה של שוק ספטי (היפר-דינמי/דיסטריבוטיבי) עקב דלקת ריאות.',
      options: [
        { id: 'opt1', label: 'שוק קרדיוגני עקב אוטם חריף בשריר הלב (Cardiogenic Shock)' },
        { id: 'opt2', label: 'שוק חסימתי עקב חזה אוויר בלחץ (Obstructive Shock / Pneumothorax)' },
        { id: 'opt3', label: 'שוק ספטי (Septic Shock / Distributive) עקב זיהום ריאתי' },
        { id: 'opt4', label: 'אי ספיקת כליות ועודף נוזלים קיצוני (Volume Overload)' }
      ]
    },
    hypoxia: {
      title: 'היפוקסמיה פתאומית (Sudden Desaturation)',
      description: 'המטופל מנותק זמנית מהמנשם, והסטורציה שלו צונחת פתאומית ל-88%. קולות הנשימה מימין מופחתים. בצע סריקת אולטרסאונד מהירה של הריאות והלב.',
      vitals: { hr: 115, bp: '105/70', spo2: 88, rr: 28, etco2: 45, temp: 37.2 },
      findings: {
        plax: 'תפקוד לבבי תקין (Normal LV contractility).',
        lung_ant: 'החלקה ריאתית חסרה (Absent Lung Sliding) בריאה הימנית עם קווים סטטיים. סימן חיובי לחזה אוויר (Pneumothorax).',
        lung_base: 'שטיפת אוויר תקינה, ללא נוזל פלורלי.'
      },
      correctDiagnosis: 'opt2',
      correctFeedback: 'תשובה נכונה! היעדר החלקה ריאתית (Absent Lung Sliding) בריאה ימין עם תפקוד לבבי תקין מחזק את האבחנה של חזה אוויר ימני (Right Pneumothorax). נדרש ניקוז אוויר דחוף.',
      options: [
        { id: 'opt1', label: 'תפליט פלורלי מסיבי דו-צדדי (Massive Pleural Effusion)' },
        { id: 'opt2', label: 'חזה אוויר בריאה ימנית (Right Pneumothorax)' },
        { id: 'opt3', label: 'שוק ספטי מפושט (Septic Shock)' },
        { id: 'opt4', label: 'תסחיף ריאתי חריף (Acute Pulmonary Embolism)' }
      ]
    },
    crackles: {
      title: 'קוצר נשימה וחרחורים (Dyspnea & Crackles)',
      description: 'המטופל מפתח קוצר נשימה קשה, לחץ דם גבוה (160/95) וחרחורים גסים בשתי הריאות. בצע סריקת אולטרסאונד POCUS להערכת תפקוד הלב ונוזלים בריאות.',
      vitals: { hr: 92, bp: '160/95', spo2: 90, rr: 26, etco2: 38, temp: 36.8 },
      findings: {
        plax: 'לב היפו-דינמי קשה (Hypodynamic LV). התכווצות ירודה מאוד של דפנות החדר השמאלי (EF < 20%). סימן לאי-ספיקת לב קשה.',
        lung_ant: 'החלקה ריאתית תקינה, אך נראים קווי B (B-lines) מרובים המעידים על גודש ריאתי.',
        lung_base: 'תפליט פלורלי (Pleural Effusion) - מרווח אקוגני שחור (נוזל) מעל הסרעפת עם ריאה צפה ("סימן המדוזה").',
      },
      correctDiagnosis: 'opt4',
      correctFeedback: 'תשובה נכונה! לב היפו-דינמי קשה עם תפליט פלורלי מעל הסרעפת מתאים לאבחנה של אי-ספיקת לב חריפה עם עודף נוזלים ותפליט פלורלי. הטיפול הנדרש הוא משתנים (Furosemide) ותמיכה נשימתית.',
      options: [
        { id: 'opt1', label: 'חזה אוויר חריף בריאה ימנית (Pneumothorax)' },
        { id: 'opt2', label: 'הלם ספטי עם לב היפר-דינמי (Septic Shock)' },
        { id: 'opt3', label: 'תסחיף ריאתי עם לב ימין מורחב (Pulmonary Embolism)' },
        { id: 'opt4', label: 'אי ספיקת לב חריפה (Cardiogenic) ותפליט פלורלי עקב עודף נוזלים' }
      ]
    }
  },
  
  // Animation Loop variables
  canvas: null,
  ctx: null,
  animationId: null,
  
  init() {
    this.gameState = 'scanning';
    this.selectedDiagnosis = '';
    this.activeHotspot = null;
    this.hasScanned = { plax: false, lung_ant: false, lung_base: false };
    
    this.renderCasesList();
    this.selectCase(this.activeCase);
    this.setupProbeDrag();
    this.setupDiagnosisSubmit();
    this.initCanvas();
  },
  
  initCanvas() {
    this.canvas = document.getElementById('pocusCanvas');
    if (!this.canvas) return;
    
    this.ctx = this.canvas.getContext('2d');
    
    // Scale canvas for retina displays
    const rect = this.canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.ctx.scale(dpr, dpr);
    
    // Start animation loop
    if (this.animationId) cancelAnimationFrame(this.animationId);
    this.animate();
  },
  
  animate() {
    if (!this.ctx || !this.canvas) return;
    
    const w = this.canvas.width / (window.devicePixelRatio || 1);
    const h = this.canvas.height / (window.devicePixelRatio || 1);
    const t = Date.now() / 1000;
    
    this.ctx.clearRect(0, 0, w, h);
    
    if (this.activeHotspot) {
      // Show scan overlay values
      document.getElementById('pocusOverlayPanel').style.display = 'block';
      document.getElementById('pocusOverlayLeftPanel').style.display = 'block';
      
      const depthEl = document.getElementById('pocusDepthText');
      const freqEl = document.getElementById('pocusFreqText');
      
      if (this.activeHotspot === 'plax') {
        if (depthEl) depthEl.textContent = 'D: 16cm';
        if (freqEl) freqEl.textContent = 'F: 2.5MHz';
        this.drawPLAX(this.ctx, w, h, t, this.activeCase);
      } else if (this.activeHotspot === 'lung_ant') {
        if (depthEl) depthEl.textContent = 'D: 6cm';
        if (freqEl) freqEl.textContent = 'F: 7.5MHz';
        this.drawAnteriorLung(this.ctx, w, h, t, this.activeCase);
      } else if (this.activeHotspot === 'lung_base') {
        if (depthEl) depthEl.textContent = 'D: 12cm';
        if (freqEl) freqEl.textContent = 'F: 5.0MHz';
        this.drawLungBase(this.ctx, w, h, t, this.activeCase);
      }
    } else {
      // No hotspot: render blank snow/noise static screen
      document.getElementById('pocusOverlayPanel').style.display = 'none';
      document.getElementById('pocusOverlayLeftPanel').style.display = 'none';
      
      // Draw static noise
      this.ctx.fillStyle = '#020202';
      this.ctx.fillRect(0, 0, w, h);
      this.drawNoiseOverlay(this.ctx, w, h);
    }
    
    this.animationId = requestAnimationFrame(() => this.animate());
  },
  
  drawNoiseOverlay(ctx, w, h) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    for (let i = 0; i < 500; i++) {
      let nx = Math.random() * w;
      let ny = Math.random() * h;
      ctx.fillRect(nx, ny, 1.2, 1.2);
    }
  },
  
  // =========================================================================
  // CANVAS ANIMATED ULTRASOUND SCHEMATICS
  // =========================================================================
  drawPLAX(ctx, w, h, t, caseType) {
    ctx.save();
    // Clip to sector fan
    ctx.beginPath();
    ctx.moveTo(w/2, 10);
    ctx.arc(w/2, 10, h - 25, Math.PI/2 - Math.PI/6, Math.PI/2 + Math.PI/6);
    ctx.closePath();
    ctx.clip();
    
    ctx.fillStyle = '#010103';
    ctx.fillRect(0, 0, w, h);
    
    // Sector gradient light
    let radGrad = ctx.createRadialGradient(w/2, 10, 10, w/2, 10, h - 25);
    radGrad.addColorStop(0, 'rgba(255,255,255,0.06)');
    radGrad.addColorStop(1, 'rgba(255,255,255,0.01)');
    ctx.fillStyle = radGrad;
    ctx.beginPath();
    ctx.moveTo(w/2, 10);
    ctx.arc(w/2, 10, h - 25, Math.PI/2 - Math.PI/6, Math.PI/2 + Math.PI/6);
    ctx.fill();
    
    let hr = 75;
    let contractility = 0.22; // LV wall contractility
    let epss = 10; // E-point septal separation (normal)
    
    if (caseType === 'shock') {
      hr = 120;
      contractility = 0.45; // hyperdynamic walls kissing
      epss = 2;
    } else if (caseType === 'crackles') {
      hr = 92;
      contractility = 0.04; // hypodynamic cardiogenic shock
      epss = 26; // restricted Mitral Valve opening
    }
    
    let cycle = (t * (hr / 60)) % 1.0;
    let beatFactor = Math.sin(cycle * Math.PI * 2);
    if (beatFactor < 0) beatFactor *= 0.35; // slow filling phase
    let contraction = beatFactor * contractility;
    
    let lvcY = h * 0.53;
    let ivsY = lvcY - 20 + (contraction * 15);
    let lvpwY = lvcY + 45 - (contraction * 25);
    
    ctx.strokeStyle = 'rgba(255,255,255,0.6)';
    ctx.lineWidth = 3.2;
    ctx.shadowColor = 'rgba(255,255,255,0.2)';
    ctx.shadowBlur = 4;
    
    // Draw Interventricular Septum (IVS)
    ctx.beginPath();
    ctx.moveTo(w/2 - 105, ivsY - 8);
    ctx.quadraticCurveTo(w/2 - 30, ivsY, w/2 + 50, ivsY - 8);
    ctx.stroke();
    
    // Draw Left Ventricle Posterior Wall (LVPW)
    ctx.beginPath();
    ctx.moveTo(w/2 - 95, lvpwY);
    ctx.quadraticCurveTo(w/2 - 30, lvpwY + 5, w/2 + 40, lvpwY - 5);
    ctx.stroke();
    
    // Draw Aorta (Ao) walls
    ctx.beginPath();
    ctx.moveTo(w/2 + 50, ivsY - 8);
    ctx.lineTo(w/2 + 120, ivsY - 25);
    ctx.moveTo(w/2 + 40, lvpwY - 5);
    ctx.lineTo(w/2 + 110, lvpwY - 22);
    ctx.stroke();
    
    // Draw Left Atrium (LA) cavity
    ctx.beginPath();
    ctx.moveTo(w/2 + 110, lvpwY - 22);
    ctx.quadraticCurveTo(w/2 + 140, lvpwY + 15, w/2 + 80, lvpwY + 30);
    ctx.stroke();
    
    // Draw Mitral Valve (MV) leaflet (Anterior)
    let mvOpenState = beatFactor < 0 ? Math.abs(beatFactor) : 0;
    let antMvAngle = -Math.PI/6 - (mvOpenState * (Math.PI/3 * (1 - epss/30)));
    
    ctx.save();
    ctx.translate(w/2 + 20, ivsY + 12);
    ctx.rotate(antMvAngle);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-28, 0);
    ctx.stroke();
    ctx.restore();
    
    // Draw Aortic Valve (AV)
    let avOpenState = beatFactor > 0 ? beatFactor : 0;
    let avAngle = avOpenState * Math.PI/4;
    
    // Upper leaflet
    ctx.save();
    ctx.translate(w/2 + 65, ivsY - 11);
    ctx.rotate(-avAngle);
    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.lineTo(15, 0);
    ctx.stroke();
    ctx.restore();
    
    // Lower leaflet
    ctx.save();
    ctx.translate(w/2 + 62, lvpwY - 18);
    ctx.rotate(avAngle);
    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.lineTo(15, 0);
    ctx.stroke();
    ctx.restore();
    
    // Labels
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.font = '9px var(--font-mono)';
    ctx.fillText("RV", w/2 - 20, ivsY - 18);
    ctx.fillText("LV", w/2 - 30, lvcY + 15);
    ctx.fillText("LA", w/2 + 85, lvpwY + 10);
    ctx.fillText("Ao", w/2 + 85, ivsY - 24);
    
    this.drawNoiseOverlay(ctx, w, h);
    ctx.restore();
  },
  
  drawAnteriorLung(ctx, w, h, t, caseType) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(w/2, 10);
    ctx.arc(w/2, 10, h - 25, Math.PI/2 - Math.PI/6, Math.PI/2 + Math.PI/6);
    ctx.closePath();
    ctx.clip();
    
    ctx.fillStyle = '#010103';
    ctx.fillRect(0, 0, w, h);
    
    let radGrad = ctx.createRadialGradient(w/2, 10, 10, w/2, 10, h - 25);
    radGrad.addColorStop(0, 'rgba(255,255,255,0.06)');
    radGrad.addColorStop(1, 'rgba(255,255,255,0.01)');
    ctx.fillStyle = radGrad;
    ctx.beginPath();
    ctx.moveTo(w/2, 10);
    ctx.arc(w/2, 10, h - 25, Math.PI/2 - Math.PI/6, Math.PI/2 + Math.PI/6);
    ctx.fill();
    
    let hasSliding = (caseType !== 'hypoxia');
    let hasBLines = (caseType === 'crackles');
    
    // Subcutaneous layers
    ctx.strokeStyle = 'rgba(255,255,255,0.12)';
    ctx.lineWidth = 1;
    for (let y = 30; y < 80; y += 12) {
      ctx.beginPath();
      ctx.moveTo(w/2 - 120, y + Math.sin(y + t)*2);
      ctx.lineTo(w/2 + 120, y + Math.cos(y + t)*2);
      ctx.stroke();
    }
    
    // Rib Shadows (Left & Right Ribs)
    let ribL_X = w/2 - 80;
    let ribR_X = w/2 + 80;
    let ribY = 90;
    
    ctx.strokeStyle = 'rgba(255,255,255,0.6)';
    ctx.lineWidth = 3.5;
    ctx.shadowColor = 'rgba(255,255,255,0.2)';
    ctx.shadowBlur = 3;
    
    ctx.beginPath();
    ctx.arc(ribL_X, ribY, 12, Math.PI, 0);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(ribR_X, ribY, 12, Math.PI, 0);
    ctx.stroke();
    
    // Draw rib shadow casts
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#000000';
    ctx.fillRect(ribL_X - 22, ribY, 44, h - ribY);
    ctx.fillRect(ribR_X - 22, ribY, 44, h - ribY);
    
    // Pleural Line (y = 95)
    let pleuraY = 95;
    ctx.strokeStyle = 'rgba(255,255,255,0.8)';
    ctx.lineWidth = 2.5;
    ctx.shadowColor = 'rgba(255,255,255,0.4)';
    ctx.shadowBlur = 4;
    
    ctx.beginPath();
    ctx.moveTo(ribL_X + 15, pleuraY);
    ctx.lineTo(ribR_X - 15, pleuraY);
    ctx.stroke();
    
    ctx.shadowBlur = 0;
    
    // Lung sliding shimmer
    if (hasSliding) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      let startX = ribL_X + 18;
      let endX = ribR_X - 18;
      for (let i = 0; i < 30; i++) {
        let dx = startX + (Math.random() * (endX - startX));
        let dy = pleuraY + (Math.random() * 3 - 1.5);
        ctx.fillRect(dx, dy, 1.8, 1.8);
      }
    }
    
    if (hasBLines) {
      // B-Lines: vertical bright laser-like beams originating from pleural line to bottom
      // Sweep dynamically with respiration
      let breathPos = Math.sin(t * 1.5) * 25;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      
      const drawBLine = (bx) => {
        let grad = ctx.createLinearGradient(bx, pleuraY, bx, h - 20);
        grad.addColorStop(0, 'rgba(255,255,255,0.45)');
        grad.addColorStop(1, 'rgba(255,255,255,0.02)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(bx - 4, pleuraY);
        ctx.lineTo(bx + 4, pleuraY);
        ctx.lineTo(bx + 18, h - 20);
        ctx.lineTo(bx - 18, h - 20);
        ctx.closePath();
        ctx.fill();
      };
      
      drawBLine(w/2 - 20 + breathPos);
      drawBLine(w/2 + 25 + breathPos);
    } else {
      // A-Lines: faint horizontal repetitions of pleural line
      ctx.strokeStyle = 'rgba(255,255,255,0.1)';
      ctx.lineWidth = 1.5;
      for (let y = pleuraY + 50; y < h - 20; y += 50) {
        ctx.beginPath();
        ctx.moveTo(ribL_X + 15, y);
        ctx.lineTo(ribR_X - 15, y);
        ctx.stroke();
      }
    }
    
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.font = '8px var(--font-mono)';
    ctx.fillText("PLEURA", w/2 - 18, pleuraY - 8);
    
    this.drawNoiseOverlay(ctx, w, h);
    ctx.restore();
  },
  
  drawLungBase(ctx, w, h, t, caseType) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(w/2, 10);
    ctx.arc(w/2, 10, h - 25, Math.PI/2 - Math.PI/6, Math.PI/2 + Math.PI/6);
    ctx.closePath();
    ctx.clip();
    
    ctx.fillStyle = '#010103';
    ctx.fillRect(0, 0, w, h);
    
    let radGrad = ctx.createRadialGradient(w/2, 10, 10, w/2, 10, h - 25);
    radGrad.addColorStop(0, 'rgba(255,255,255,0.06)');
    radGrad.addColorStop(1, 'rgba(255,255,255,0.01)');
    ctx.fillStyle = radGrad;
    ctx.beginPath();
    ctx.moveTo(w/2, 10);
    ctx.arc(w/2, 10, h - 25, Math.PI/2 - Math.PI/6, Math.PI/2 + Math.PI/6);
    ctx.fill();
    
    let hasEffusion = (caseType === 'crackles');
    
    let diagY_L = h * 0.45;
    let diagY_R = h * 0.65;
    ctx.strokeStyle = 'rgba(255,255,255,0.65)';
    ctx.lineWidth = 3;
    ctx.shadowColor = 'rgba(255,255,255,0.25)';
    ctx.shadowBlur = 4;
    
    ctx.beginPath();
    ctx.moveTo(w/2 - 120, diagY_L);
    ctx.quadraticCurveTo(w/2 - 20, diagY_L + 10, w/2 + 100, diagY_R);
    ctx.stroke();
    ctx.shadowBlur = 0;
    
    // Liver below diaphragm
    ctx.fillStyle = 'rgba(255,255,255,0.04)';
    ctx.beginPath();
    ctx.moveTo(w/2 - 120, diagY_L);
    ctx.quadraticCurveTo(w/2 - 20, diagY_L + 10, w/2 + 100, diagY_R);
    ctx.lineTo(w/2 + 100, h);
    ctx.lineTo(w/2 - 120, h);
    ctx.closePath();
    ctx.fill();
    
    // Liver parenchymal dots
    ctx.fillStyle = 'rgba(255,255,255,0.06)';
    for (let i = 0; i < 120; i++) {
      let lx = w/2 - 100 + Math.random() * 200;
      let ly = h * 0.58 + Math.random() * 90;
      if (ly > diagY_L + 10) {
        ctx.fillRect(lx, ly, 1.2, 1.2);
      }
    }
    
    if (hasEffusion) {
      // Pleural Effusion: black fluid above diaphragm
      ctx.fillStyle = '#010204';
      ctx.beginPath();
      ctx.moveTo(w/2 - 120, 30);
      ctx.lineTo(w/2 + 100, 30);
      ctx.lineTo(w/2 + 100, diagY_R);
      ctx.quadraticCurveTo(w/2 - 20, diagY_L + 10, w/2 - 120, diagY_L);
      ctx.closePath();
      ctx.fill();
      
      // Positive Spine sign: vertebral bodies visible above diaphragm
      ctx.strokeStyle = 'rgba(255,255,255,0.6)';
      ctx.lineWidth = 4.5;
      for (let sy = 50; sy < h - 40; sy += 30) {
        ctx.beginPath();
        ctx.moveTo(w/2 - 95, sy);
        ctx.lineTo(w/2 - 75, sy + 5);
        ctx.stroke();
      }
      
      // Floating consolidated lung tip (Jellyfish sign) sways
      let swing = Math.sin(t * 1.5) * 12;
      ctx.fillStyle = 'rgba(255,255,255,0.2)';
      ctx.strokeStyle = 'rgba(255,255,255,0.4)';
      ctx.lineWidth = 1.5;
      
      ctx.beginPath();
      ctx.moveTo(w/2 - 40 + swing, diagY_L - 30);
      ctx.quadraticCurveTo(w/2 - 10 + swing, diagY_L - 45, w/2 + 20 + swing, diagY_L - 10);
      ctx.quadraticCurveTo(w/2 - 10 + swing, diagY_L - 5, w/2 - 40 + swing, diagY_L - 30);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.font = '8px var(--font-mono)';
      ctx.fillText("FLUID", w/2 - 10, diagY_L - 60);
      ctx.fillText("LUNG", w/2 - 20 + swing, diagY_L - 25);
    } else {
      // Normal lung base - air artifact mirror image
      ctx.fillStyle = 'rgba(255,255,255,0.02)';
      ctx.beginPath();
      ctx.moveTo(w/2 - 120, 30);
      ctx.lineTo(w/2 + 100, 30);
      ctx.lineTo(w/2 + 100, diagY_R);
      ctx.quadraticCurveTo(w/2 - 20, diagY_L + 10, w/2 - 120, diagY_L);
      ctx.closePath();
      ctx.fill();
      
      // Faint mirrored particles
      ctx.fillStyle = 'rgba(255,255,255,0.03)';
      for (let i = 0; i < 60; i++) {
        let lx = w/2 - 100 + Math.random() * 180;
        let ly = h * 0.25 + Math.random() * 70;
        if (ly < diagY_L - 10) {
          ctx.fillRect(lx, ly, 1.2, 1.2);
        }
      }
      
      // Spine blocks ONLY below diaphragm
      ctx.strokeStyle = 'rgba(255,255,255,0.55)';
      ctx.lineWidth = 4.5;
      for (let sy = 50; sy < h - 40; sy += 30) {
        if (sy > diagY_L) {
          ctx.beginPath();
          ctx.moveTo(w/2 - 95, sy);
          ctx.lineTo(w/2 - 75, sy + 5);
          ctx.stroke();
        }
      }
      
      ctx.fillStyle = 'rgba(255,255,255,0.12)';
      ctx.font = '8px var(--font-mono)';
      ctx.fillText("AIR SHADOW", w/2 - 25, diagY_L - 35);
    }
    
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.font = '8px var(--font-mono)';
    ctx.fillText("DIAPHRAGM", w/2 + 25, diagY_R - 12);
    ctx.fillText("LIVER", w/2 + 50, diagY_R + 30);
    
    this.drawNoiseOverlay(ctx, w, h);
    ctx.restore();
  },
  
  // =========================================================================
  // UI LOGIC & DATA COORDINATION
  // =========================================================================
  renderCasesList() {
    const listEl = document.getElementById('pocusCasesList');
    if (!listEl) return;
    
    listEl.innerHTML = '';
    
    Object.keys(this.cases).forEach(key => {
      const c = this.cases[key];
      const btn = document.createElement('button');
      btn.className = `pocus-case-btn ${key === this.activeCase ? 'active' : ''}`;
      btn.id = `caseBtn_${key}`;
      
      btn.innerHTML = `
        <div>
          <strong>${c.title}</strong>
          <div style="font-size:0.75rem; color:var(--text-secondary); margin-top:2px;">קושי: בינוני</div>
        </div>
        <i class="fa-solid fa-circle-play" style="font-size:1.1rem; color:var(--color-cyan)"></i>
      `;
      
      btn.addEventListener('click', () => {
        this.selectCase(key);
      });
      
      listEl.appendChild(btn);
    });
  },
  
  selectCase(key) {
    this.activeCase = key;
    this.gameState = 'scanning';
    this.selectedDiagnosis = '';
    this.activeHotspot = null;
    this.hasScanned = { plax: false, lung_ant: false, lung_base: false };
    
    // Toggle active classes on case buttons
    document.querySelectorAll('.pocus-case-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    const activeBtn = document.getElementById(`caseBtn_${key}`);
    if (activeBtn) activeBtn.classList.add('active');
    
    // Update active case description card
    const c = this.cases[key];
    const descEl = document.getElementById('pocusCaseDesc');
    if (descEl) descEl.innerHTML = `
      <h3 style="font-family:var(--font-header); color:var(--color-cyan); margin-bottom:8px;">${c.title}</h3>
      <p style="font-size:0.9rem; line-height:1.5; color:var(--text-secondary);">${c.description}</p>
    `;
    
    // Update global vitals to sync bedside monitor
    VitalsState.hr = c.vitals.hr;
    VitalsState.spo2 = c.vitals.spo2;
    VitalsState.rr = c.vitals.rr;
    VitalsState.etco2 = c.vitals.etco2;
    VitalsState.temp = c.vitals.temp;
    
    const sbp = parseInt(c.vitals.bp.split('/')[0]);
    const dbp = parseInt(c.vitals.bp.split('/')[1]);
    VitalsState.sbp = sbp;
    VitalsState.dbp = dbp;
    
    if (window.vitalsEngine) {
      window.vitalsEngine.updateNumericDisplay();
    }
    
    // Reset scanner interpretations
    this.updateFindingsUI();
    this.renderDiagnosisOptions();
  },
  
  updateFindingsUI() {
    const box = document.getElementById('pocusFindingsBox');
    if (!box) return;
    
    const sc = this.hasScanned;
    
    box.innerHTML = `
      <div style="font-size:0.8rem; font-weight:600; color:var(--text-secondary); margin-bottom:8px;">דוח ממצאי סריקה (Scanner Log):</div>
      <ul style="padding-right:20px; font-size:0.85rem; line-height:1.5; margin:0; display:flex; flex-direction:column; gap:6px;">
        <li style="color:${sc.plax ? 'var(--color-green)' : 'var(--text-secondary)'}">
          <i class="fa-solid ${sc.plax ? 'fa-square-check' : 'fa-square'}"></i>
          סריקת לב (PLAX): ${sc.plax ? this.cases[this.activeCase].findings.plax : 'ממתין לסריקה...'}
        </li>
        <li style="color:${sc.lung_ant ? 'var(--color-green)' : 'var(--text-secondary)'}">
          <i class="fa-solid ${sc.lung_ant ? 'fa-square-check' : 'fa-square'}"></i>
          סריקת ריאה עליונה: ${sc.lung_ant ? this.cases[this.activeCase].findings.lung_ant : 'ממתין לסריקה...'}
        </li>
        <li style="color:${sc.lung_base ? 'var(--color-green)' : 'var(--text-secondary)'}">
          <i class="fa-solid ${sc.lung_base ? 'fa-square-check' : 'fa-square'}"></i>
          סריקת בסיס הריאה: ${sc.lung_base ? this.cases[this.activeCase].findings.lung_base : 'ממתין לסריקה...'}
        </li>
      </ul>
    `;
    
    // Highlight torso hotspots that have been scanned
    ['plax', 'lung_ant', 'lung_base'].forEach(id => {
      const h = document.getElementById(`hotspot_${id}`);
      if (h) {
        if (sc[id]) {
          h.classList.add('active');
        } else {
          h.classList.remove('active');
        }
      }
    });
  },
  
  renderDiagnosisOptions() {
    const panel = document.getElementById('pocusDiagnosisPanel');
    const submitBtn = document.getElementById('pocusSubmitBtn');
    const feedbackEl = document.getElementById('pocusFeedbackArea');
    
    if (!panel || !submitBtn || !feedbackEl) return;
    
    // Reset submission state
    submitBtn.disabled = true;
    feedbackEl.style.display = 'none';
    
    panel.innerHTML = `
      <div style="font-size:0.9rem; font-weight:600; color:var(--text-secondary); margin-bottom:10px;">בחר את האבחנה הנכונה והטיפול המתאים:</div>
      <div style="display:flex; flex-direction:column; gap:8px;">
        ${this.cases[this.activeCase].options.map(opt => `
          <label class="radio-tiles-vertical" style="display:flex; align-items:center; border:1px solid var(--border-color); padding:10px; border-radius:6px; cursor:pointer; background:rgba(255,255,255,0.01); transition:all 0.3s ease;" id="lbl_${opt.id}">
            <input type="radio" name="pocusDiag" value="${opt.id}" style="margin-left:10px; width:16px; height:16px;" class="pocus-diag-radio">
            <span style="font-size:0.85rem;">${opt.label}</span>
          </label>
        `).join('')}
      </div>
    `;
    
    // Bind selection triggers
    document.querySelectorAll('.pocus-diag-radio').forEach(radio => {
      radio.addEventListener('change', () => {
        // Clear all highlights
        document.querySelectorAll('.radio-tiles-vertical').forEach(l => {
          l.style.borderColor = 'var(--border-color)';
          l.style.background = 'rgba(255,255,255,0.01)';
        });
        
        // Highlight selected
        const lbl = document.getElementById(`lbl_${radio.value}`);
        if (lbl) {
          lbl.style.borderColor = 'var(--color-cyan)';
          lbl.style.background = 'rgba(0, 229, 255, 0.05)';
        }
        
        this.selectedDiagnosis = radio.value;
        submitBtn.disabled = false;
      });
    });
  },
  
  setupDiagnosisSubmit() {
    const submitBtn = document.getElementById('pocusSubmitBtn');
    const feedbackEl = document.getElementById('pocusFeedbackArea');
    
    submitBtn?.addEventListener('click', () => {
      if (!this.selectedDiagnosis) return;
      
      const c = this.cases[this.activeCase];
      feedbackEl.style.display = 'block';
      
      if (this.selectedDiagnosis === c.correctDiagnosis) {
        // Success
        this.gameState = 'submitted_correct';
        feedbackEl.className = 'debrief-box';
        feedbackEl.style.borderColor = 'var(--color-green)';
        feedbackEl.style.background = 'rgba(0, 230, 118, 0.05)';
        feedbackEl.innerHTML = `
          <strong style="color:var(--color-green);"><i class="fa-solid fa-circle-check"></i> אבחון נכון!</strong>
          <p style="font-size:0.85rem; line-height:1.5; margin-top:6px;">${c.correctFeedback}</p>
        `;
        
        // Mark case button as completed
        const btn = document.getElementById(`caseBtn_${this.activeCase}`);
        if (btn) {
          btn.classList.add('completed');
          btn.querySelector('i').className = 'fa-solid fa-circle-check';
          btn.querySelector('i').style.color = 'var(--color-green)';
        }
      } else {
        // Fail
        this.gameState = 'submitted_incorrect';
        feedbackEl.className = 'debrief-box';
        feedbackEl.style.borderColor = 'var(--color-red)';
        feedbackEl.style.background = 'rgba(255, 23, 68, 0.05)';
        feedbackEl.innerHTML = `
          <strong style="color:var(--color-red);"><i class="fa-solid fa-triangle-exclamation"></i> אבחנה שגויה!</strong>
          <p style="font-size:0.85rem; line-height:1.5; margin-top:6px;">
            הממצאים שסרקת אינם מתאימים לקביעה הזו. נסה שוב לסרוק את כל שלוש הנקודות בעיון (לב, ריאה עליונה, ריאה תחתונה).
          </p>
        `;
        // Trigger red flash animation
        feedbackEl.classList.add('pulse-glow-red');
        setTimeout(() => feedbackEl.classList.remove('pulse-glow-red'), 1000);
      }
    });
  },
  
  setupProbeDrag() {
    const probe = document.getElementById('pocusProbe');
    const torso = document.getElementById('pocusTorso');
    const dock = document.getElementById('pocusDock');
    if (!probe || !torso || !dock) return;
    
    let dragging = false;
    let startX = 0, startY = 0;
    let probeX = 0, probeY = 0;
    
    const dragStart = (e) => {
      dragging = true;
      const clientX = e.clientX || e.touches[0].clientX;
      const clientY = e.clientY || e.touches[0].clientY;
      
      const rect = probe.getBoundingClientRect();
      startX = clientX - rect.left;
      startY = clientY - rect.top;
      
      probe.style.transition = 'none';
      probe.style.cursor = 'grabbing';
      
      // Stop canvas auscultation sounds if any
      if (window.ICEscapeRoom) window.ICEscapeRoom.stopAuscultation();
    };
    
    const dragMove = (e) => {
      if (!dragging) return;
      e.preventDefault();
      
      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      const clientY = e.clientY || (e.touches && e.touches[0].clientY);
      
      const torsoRect = torso.getBoundingClientRect();
      
      // Calculate position relative to torso
      let x = clientX - torsoRect.left - startX;
      let y = clientY - torsoRect.top - startY;
      
      // Clamp bounds slightly to keep inside panel
      probe.style.left = `${x}px`;
      probe.style.top = `${y}px`;
      
      // Check collision/proximity with hotspots
      this.checkHotspotProximity(x + 25, y + 25);
    };
    
    const dragEnd = () => {
      if (!dragging) return;
      dragging = false;
      
      probe.style.transition = 'all 0.2s ease';
      probe.style.cursor = 'grab';
      
      if (this.activeHotspot) {
        // Snap to hotspot
        const hotspotEl = document.getElementById(`hotspot_${this.activeHotspot}`);
        if (hotspotEl) {
          probe.style.left = hotspotEl.style.left;
          probe.style.top = hotspotEl.style.top;
          
          // Mark scanned
          this.hasScanned[this.activeHotspot] = true;
          this.updateFindingsUI();
        }
      } else {
        // Snap back to dock
        this.resetProbeToDock();
      }
    };
    
    // Bind Mouse Events
    probe.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', dragMove);
    document.addEventListener('mouseup', dragEnd);
    
    // Bind Touch Events
    probe.addEventListener('touchstart', dragStart, { passive: false });
    document.addEventListener('touchmove', dragMove, { passive: false });
    document.addEventListener('touchend', dragEnd);
  },
  
  checkHotspotProximity(probeCenterX, probeCenterY) {
    const hotspots = {
      plax: { x: 147, y: 157 },       // center coordinates on torso (125px + 22px, 135px + 22px)
      lung_ant: { x: 275 + 22, y: 90 + 22 }, // right anterior chest
      lung_base: { x: 231 + 22, y: 250 + 22 } // right costophrenic angle
    };
    
    // Adjusted hotspot coordinates relative to the 320x400 torso box
    const targets = [
      { id: 'plax', x: 147, y: 157 },
      { id: 'lung_ant', x: 263, y: 112 }, // coordinates matched with CSS top/left
      { id: 'lung_base', x: 297, y: 272 }
    ];
    
    let closestTarget = null;
    let minDistance = 35; // activation radius (pixels)
    
    targets.forEach(t => {
      const dx = probeCenterX - t.x;
      const dy = probeCenterY - t.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      
      if (dist < minDistance) {
        closestTarget = t.id;
      }
    });
    
    // Trigger activation state
    if (closestTarget !== this.activeHotspot) {
      // Clear previous active states
      document.querySelectorAll('.us-hotspot').forEach(h => h.classList.remove('active'));
      
      this.activeHotspot = closestTarget;
      
      if (closestTarget) {
        const activeEl = document.getElementById(`hotspot_${closestTarget}`);
        if (activeEl) activeEl.classList.add('active');
        
        // Trigger pulse beep sound on heartbeat beep if audio enabled
        this.playProbeContactBeep();
      }
    }
  },
  
  playProbeContactBeep() {
    if (!VitalsState.audioEnabled || !VitalsState.audioCtx) return;
    try {
      const ctx = VitalsState.audioCtx;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.06);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.07);
    } catch (e) {}
  },
  
  resetProbeToDock() {
    const probe = document.getElementById('pocusProbe');
    if (!probe) return;
    
    // Coordinates corresponding to probe-dock placement at bottom of torso pane
    probe.style.left = '135px';
    probe.style.top = '445px'; // sits on dock
    
    this.activeHotspot = null;
    document.querySelectorAll('.us-hotspot').forEach(h => h.classList.remove('active'));
  },
  
  cleanup() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    this.activeHotspot = null;
  }
};

// Bind to window
window.ICUUltrasound = ICUUltrasound;
