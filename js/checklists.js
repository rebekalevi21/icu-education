// ICU Interactive Checklists Engine
const ICUChecklists = {
  currentCategory: 'rsi',
  
  data: {
    rsi: {
      title: "הכנה לאינטובציה (Rapid Sequence Induction - RSI)",
      items: [
        { id: 'rsi_suction', text: 'מערכת שאיבה (Suction) מחוברת, פועלת ונמצאת בהישג יד', info: 'בטיחות' },
        { id: 'rsi_preox', text: 'מתן חמצון מוקדם (Pre-oxygenation) ב-100% חמצן למשך 3 דקות לפחות', info: 'חמצון' },
        { id: 'rsi_bag', text: 'מנשם ידני (Ambu bag) עם מסכה מחובר למקור חמצן זורם', info: 'נשימה' },
        { id: 'rsi_tube', text: 'טובוסים (ETT) במידות מתאימות מוכנים, כולל בדיקת Cuff וסטילט בפנים', info: 'ציוד' },
        { id: 'rsi_laryngoscope', text: 'לרינגוסקופ (או וידאו-לרינגוסקופ) תקין עם סוללות ואור עובד', info: 'ציוד' },
        { id: 'rsi_backup', text: 'ציוד גיבוי לנתיב אוויר קשה מוכן (Bougie, LMA, מנתבי אוויר זמניים)', info: 'בטיחות' },
        { id: 'rsi_iv', text: 'לפחות שני ורידים פריפריים פתוחים ותקינים עם נוזלים מחוברים', info: 'גישה' },
        { id: 'rsi_drugs', text: 'תרופות סדציה ושיתוק שרירים שאובות במזרקים מסומנים (Ketamine, Rocuronium וכו\')', info: 'תרופות' },
        { id: 'rsi_resusc', text: 'תרופות החייאה ושיפור ל"ד בהישג יד (Adrenaline, Ephedrine, Noradrenaline)', info: 'חירום' },
        { id: 'rsi_etco2', text: 'גלאי פחמן דו-חמצני (EtCO2) מחובר למוניטור ומוכן לשימוש מיידי', info: 'ניטור' }
      ]
    },
    cvc: {
      title: "הכנסת צנתר ורידי מרכזי (Central Venous Catheter - CVC)",
      items: [
        { id: 'cvc_consent', text: 'וידוא טופס הסכמה מדעת חתום בתיק המטופל (או אישור 2 רופאים בחירום)', info: 'רישום' },
        { id: 'cvc_timeout', text: 'ביצוע פסק זמן קבוצתי (Time-Out): שם מטופל, מיקום ההכנסה, וההליך המתוכנן', info: 'בטיחות' },
        { id: 'cvc_ppe', text: 'לבוש סטרילי מלא למבצע: מסכה, כובע, חלוק סטרילי וכפפות סטריליות', info: 'סטריליות' },
        { id: 'cvc_skin', text: 'חיטוי עור המטופל בכלורהקסידין 2% באלכוהול וייבוש מוחלט', info: 'סטריליות' },
        { id: 'cvc_drape', text: 'כיסוי המטופל בסדין סטרילי רחב המכסה את כל הגוף', info: 'סטריליות' },
        { id: 'cvc_us', text: 'מכשיר אולטרסאונד ממוקם, ומתמר האולטרסאונד עטוף בכיסוי סטרילי תקין', info: 'ציוד' },
        { id: 'cvc_flush', text: 'שטיפת כל פורטים של הצנתר המרכזי בסליין סטרילי וסגירת קליפסים', info: 'הכנה' },
        { id: 'cvc_sterile_field', text: 'סידור כל הציוד על מגש סטרילי (מחט, סיידגייד, מוביל, מרחיב, צנתר)', info: 'סטריליות' },
        { id: 'cvc_suture', text: 'אמצעי קיבוע (חוט תפירה/הדבקה) וחבישה סטרילית שקופה סגורה היטב', info: 'קיבוע' },
        { id: 'cvc_xray', text: 'הזמנת צילום חזה לאחר הפעולה לווידוא מיקום ושלילת פנאומותורקס', info: 'מעקב' }
      ]
    },
    aline: {
      title: "הכנסת ליין עורקי (Arterial Line Insertion)",
      items: [
        { id: 'aline_site', text: 'ביצוע מבחן אלן (Allen\'s test) במידה ובוחרים בעורק הרדיאלי', info: 'בטיחות' },
        { id: 'aline_transducer', text: 'מערכת מד הלחץ (Transducer) שטופה בסליין, ללא בועות אוויר ומחוברת למוניטור', info: 'ציוד' },
        { id: 'aline_sterile', text: 'חיטוי מקומי רחב בכלורהקסידין, שימוש בכפפות סטריליות ושדה סטרילי מקומי', info: 'סטריליות' },
        { id: 'aline_kit', text: 'הכנת קטטר עורקי (20G/22G) ומערכת הולכה Seldinger מוכנה', info: 'הכנה' },
        { id: 'aline_flush_test', text: 'שטיפת הליין לאחר הכנסה ואישור שאיבת דם עורקי אדום ופועם בקטטר', info: 'בדיקה' },
        { id: 'aline_secure', text: 'קיבוע בטוח של הקטטר לעור על ידי תפר או חבישה ייעודית מונעת תזוזה', info: 'קיבוע' },
        { id: 'aline_zero', text: 'איפוס מד הלחץ (Zeroing) מול גובה ה-Phlebostatic Axis (מרווח צלעי 4, קו בית שחי אמצעי)', info: 'ניטור' },
        { id: 'aline_wave', text: 'וידוא קבלת גל לחץ דם עורקי תקין (Dicrotic notch ברור) במוניטור', info: 'ניטור' }
      ]
    }
  },

  checkedStates: {},

  init() {
    this.renderChecklist();
    this.setupListeners();
  },

  renderChecklist() {
    const listData = this.data[this.currentCategory];
    const container = document.getElementById('checklistItemsContainer');
    const titleEl = document.getElementById('checklistTitle');
    
    if (!container || !titleEl) return;

    titleEl.textContent = listData.title;
    container.innerHTML = '';

    listData.items.forEach(item => {
      const isChecked = this.checkedStates[item.id] || false;
      const itemNode = document.createElement('div');
      itemNode.className = `checklist-item ${isChecked ? 'checked' : ''}`;
      itemNode.dataset.id = item.id;
      
      itemNode.innerHTML = `
        <div class="checklist-checkbox">
          ${isChecked ? '<i class="fa-solid fa-check"></i>' : ''}
        </div>
        <div class="checklist-text">${item.text}</div>
        <span class="checklist-info-pill">${item.info}</span>
      `;
      
      itemNode.addEventListener('click', () => this.toggleItem(item.id));
      container.appendChild(itemNode);
    });

    this.updateProgress();
  },

  toggleItem(id) {
    this.checkedStates[id] = !this.checkedStates[id];
    
    // Toggle active classes on nodes
    const itemNode = document.querySelector(`.checklist-item[data-id="${id}"]`);
    if (itemNode) {
      const isChecked = this.checkedStates[id];
      if (isChecked) {
        itemNode.classList.add('checked');
        itemNode.querySelector('.checklist-checkbox').innerHTML = '<i class="fa-solid fa-check"></i>';
      } else {
        itemNode.classList.remove('checked');
        itemNode.querySelector('.checklist-checkbox').innerHTML = '';
      }
    }
    
    this.updateProgress();
  },

  updateProgress() {
    const listData = this.data[this.currentCategory];
    const total = listData.items.length;
    let checkedCount = 0;
    
    listData.items.forEach(item => {
      if (this.checkedStates[item.id]) {
        checkedCount++;
      }
    });

    const percent = Math.round((checkedCount / total) * 100);
    
    const progressFill = document.getElementById('checklistProgressFill');
    const progressText = document.getElementById('checklistProgressText');
    const completeAlert = document.getElementById('checklistCompleteAlert');
    
    if (progressFill) progressFill.style.width = `${percent}%`;
    if (progressText) progressText.textContent = `הושלמו ${checkedCount} מתוך ${total} שלבים (${percent}%)`;
    
    if (completeAlert) {
      if (percent === 100) {
        completeAlert.style.display = 'block';
        completeAlert.className = 'card challenge-box pulse-glow-cyan';
        completeAlert.style.borderColor = 'var(--color-green)';
        completeAlert.style.background = 'rgba(0, 230, 118, 0.05)';
        completeAlert.innerHTML = `
          <div style="display:flex; align-items:center; gap:12px; color:var(--color-green)">
            <i class="fa-solid fa-shield-halved" style="font-size:1.5rem"></i>
            <div>
              <strong style="font-size:1.05rem">כל השלבים הושלמו בהצלחה!</strong><br>
              הפעולה מוכנה לביצוע בטוח. וידאת את כל מרכיבי הבטיחות, הציוד והסטריליות הנדרשים בטיפול נמרץ.
            </div>
          </div>
        `;
      } else {
        completeAlert.style.display = 'none';
      }
    }
  },

  setupListeners() {
    const tabs = document.querySelectorAll('.checklist-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        tabs.forEach(t => t.classList.remove('active'));
        e.currentTarget.classList.add('active');
        this.currentCategory = e.currentTarget.dataset.category;
        this.renderChecklist();
      });
    });

    document.getElementById('checklistResetBtn')?.addEventListener('click', () => {
      // Clear checked states for current category
      const listData = this.data[this.currentCategory];
      listData.items.forEach(item => {
        this.checkedStates[item.id] = false;
      });
      this.renderChecklist();
    });
  }
};

window.ICUChecklists = ICUChecklists;
