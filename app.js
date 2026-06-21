// ICU Sim-Learn Main Application Coordinator
const App = {
  activeView: '',
  
  // View HTML Templates
  templates: {
    dashboard: `
      <!-- ICU Bedside Vitals Monitor Widget -->
      <div class="vitals-monitor-panel" id="vitalsMonitorPanel" style="margin-bottom:24px;">
        <div class="monitor-waveforms">
          <div class="waveform-channel">
            <span class="waveform-label label-ecg"><i class="fa-solid fa-heart pulse-glow-cyan heartbeat-icon"></i> ECG (קצב לב)</span>
            <canvas id="ecgCanvas" class="waveform-canvas"></canvas>
          </div>
          <div class="waveform-channel">
            <span class="waveform-label label-spo2"><i class="fa-solid fa-wave-square"></i> SpO₂ (סטורציה)</span>
            <canvas id="spo2Canvas" class="waveform-canvas"></canvas>
          </div>
          <div class="waveform-channel">
            <span class="waveform-label label-resp"><i class="fa-solid fa-lungs"></i> Resp (קצב נשימה)</span>
            <canvas id="co2Canvas" class="waveform-canvas"></canvas>
          </div>
        </div>
        <div class="monitor-numeric">
          <div class="vitals-grid-sidebar">
            <div class="vital-box green">
              <div class="vital-meta">
                <span class="vital-title">HR</span>
                <span class="vital-limit">60-100</span>
              </div>
              <div class="vital-value" id="monitorHR">75</div>
            </div>
            <div class="vital-box red">
              <div class="vital-meta">
                <span class="vital-title">BP</span>
                <span class="vital-limit">120/80</span>
              </div>
              <div class="vital-value" id="monitorBP" style="font-size:1.6rem">120/80</div>
            </div>
            <div class="vital-box cyan">
              <div class="vital-meta">
                <span class="vital-title">SpO₂</span>
                <span class="vital-limit">95-100</span>
              </div>
              <div class="vital-value" id="monitorSpO2">98</div>
            </div>
            <div class="vital-box yellow">
              <div class="vital-meta">
                <span class="vital-title">RR</span>
                <span class="vital-limit">12-20</span>
              </div>
              <div class="vital-value" id="monitorRR">14</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Dashboard Modules Grid -->
      <h2 style="font-family:var(--font-header); margin-top:30px;">פעילויות וסימולציות למידה</h2>
      <div class="dashboard-grid">
        
        <div class="card module-card" onclick="location.hash = '#ventilator'">
          <div class="module-icon"><i class="fa-solid fa-wind"></i></div>
          <h3 class="card-title">סימולטור מכונת הנשמה</h3>
          <p style="color:var(--text-secondary); font-size:0.9rem; min-height:60px; margin-bottom:12px;">תרגול שליטה בפרמטרים של הנשמה (Volume, Pressure, PEEP, FiO2), פתרון אתגרים קליניים ומניעת נזק ריאתי (VILI).</p>
          <div class="module-stats">
            <span>קושי: <strong>בינוני</strong></span>
            <span style="color:var(--color-cyan)">היכנס לסימולטור <i class="fa-solid fa-arrow-left"></i></span>
          </div>
        </div>

        <div class="card module-card" onclick="location.hash = '#scenarios'">
          <div class="module-icon"><i class="fa-solid fa-user-doctor"></i></div>
          <h3 class="card-title">תרחישים קליניים</h3>
          <p style="color:var(--text-secondary); font-size:0.9rem; min-height:60px; margin-bottom:12px;">ניהול תיקים קליניים מסתעפים בזמן אמת: שוק ספטי, הפרעות קצב מסכנות חיים וניהול ARDS קשה.</p>
          <div class="module-stats">
            <span>קושי: <strong>קשה</strong></span>
            <span style="color:var(--color-cyan)">התחל תרחיש <i class="fa-solid fa-arrow-left"></i></span>
          </div>
        </div>

        <div class="card module-card" onclick="location.hash = '#abg'">
          <div class="module-icon"><i class="fa-solid fa-droplet"></i></div>
          <h3 class="card-title">תרגול גזים בדם (ABG)</h3>
          <p style="color:var(--text-secondary); font-size:0.9rem; min-height:60px; margin-bottom:12px;">משחק אינטראקטיבי לתרגול פענוח מהיר של בדיקות גזים בדם עורקי (חמצת, בססת, פיצוי ריאתי ומטבולי).</p>
          <div class="module-stats">
            <span>קושי: <strong>קל-בינוני</strong></span>
            <span style="color:var(--color-cyan)">שחק כעת <i class="fa-solid fa-arrow-left"></i></span>
          </div>
        </div>

        <div class="card module-card" onclick="location.hash = '#calculators'">
          <div class="module-icon"><i class="fa-solid fa-calculator"></i></div>
          <h3 class="card-title">מחשבוני טיפול נמרץ</h3>
          <p style="color:var(--text-secondary); font-size:0.9rem; min-height:60px; margin-bottom:12px;">חישוב נפחי הנשמה לפי משקל גוף אידיאלי (IBW), קצבי הזלפה לווזופרסורים, יחס P/F ל-ARDS, ומחשבון GCS.</p>
          <div class="module-stats">
            <span>שימושי וקליני</span>
            <span style="color:var(--color-cyan)">פתח מחשבונים <i class="fa-solid fa-arrow-left"></i></span>
          </div>
        </div>

        <div class="card module-card" onclick="location.hash = '#checklists'">
          <div class="module-icon"><i class="fa-solid fa-list-check"></i></div>
          <h3 class="card-title">צ'קליסטים לפעולות</h3>
          <p style="color:var(--text-secondary); font-size:0.9rem; min-height:60px; margin-bottom:12px;">רשימות תיוג מבוססות בטיחות לפעולות מורכבות: הכנה לאינטובציה (RSI), ליין עורקי וצנתר מרכזי (CVC).</p>
          <div class="module-stats">
            <span>לימוד והנחיות</span>
            <span style="color:var(--color-cyan)">פתח צ'קליסטים <i class="fa-solid fa-arrow-left"></i></span>
          </div>
        </div>

      </div>
    `,
    
    ventilator: `
      <div class="sim-grid">
        
        <!-- Left Column: Controls panel -->
        <div class="control-panel card">
          <div class="card-title"><i class="fa-solid fa-sliders" style="color:var(--color-cyan)"></i> הגדרות מכונת הנשמה</div>
          
          <!-- Vent Mode selection tiles -->
          <div class="form-group">
            <label>מצב הנשמה (Ventilation Mode)</label>
            <div class="radio-tiles">
              <div>
                <input type="radio" id="modeVC" name="ventMode" value="vc" checked class="radio-tile-input">
                <label for="modeVC" class="radio-tile-label">VC-AC<br><span style="font-size:0.65rem;opacity:0.8;">נפח מבוקר</span></label>
              </div>
              <div>
                <input type="radio" id="modePC" name="ventMode" value="pc" class="radio-tile-input">
                <label for="modePC" class="radio-tile-label">PC-AC<br><span style="font-size:0.65rem;opacity:0.8;">לחץ מבוקר</span></label>
              </div>
              <div>
                <input type="radio" id="modePSV" name="ventMode" value="psv" class="radio-tile-input">
                <label for="modePSV" class="radio-tile-label">PSV<br><span style="font-size:0.65rem;opacity:0.8;">תמיכת לחץ</span></label>
              </div>
            </div>
          </div>

          <!-- VC settings group -->
          <div id="vcControlsGroup">
            <div class="form-group setting-slider">
              <div class="slider-header">
                <span>נפח הנשמה (Tidal Volume)</span>
                <span class="slider-val"><span id="ventVtVal">450</span> מ"ל</span>
              </div>
              <input type="range" id="ventVt" class="form-control-range" min="150" max="800" step="10" value="450">
            </div>
            
            <div class="form-group setting-slider">
              <div class="slider-header">
                <span>קצב זרימה (Inspiratory Flow)</span>
                <span class="slider-val"><span id="ventFlowVal">60</span> ל/דקה</span>
              </div>
              <input type="range" id="ventFlow" class="form-control-range" min="30" max="120" step="5" value="60">
            </div>
          </div>

          <!-- PC settings group -->
          <div id="pcControlsGroup" style="display:none;">
            <div class="form-group setting-slider">
              <div class="slider-header">
                <span>בקרת לחץ (Pressure Control limit)</span>
                <span class="slider-val"><span id="ventPiVal">15</span> cmH₂O</span>
              </div>
              <input type="range" id="ventPi" class="form-control-range" min="5" max="40" step="1" value="15">
            </div>
          </div>

          <!-- PSV settings group -->
          <div id="psvControlsGroup" style="display:none;">
            <div class="form-group setting-slider">
              <div class="slider-header">
                <span>תמיכת לחץ (Pressure Support)</span>
                <span class="slider-val"><span id="ventPsVal">10</span> cmH₂O</span>
              </div>
              <input type="range" id="ventPs" class="form-control-range" min="5" max="30" step="1" value="10">
            </div>
          </div>

          <!-- Common settings -->
          <div class="control-group-title">פרמטרים משותפים</div>
          
          <div class="form-group setting-slider">
            <div class="slider-header">
              <span>קצב נשימה במנשם (Respiratory Rate)</span>
              <span class="slider-val"><span id="ventRRVal">14</span> נשימות/דקה</span>
            </div>
            <input type="range" id="ventRR" class="form-control-range" min="4" max="40" step="1" value="14">
          </div>

          <div class="form-group setting-slider">
            <div class="slider-header">
              <span>לחץ סוף-נשיפתי חיובי (PEEP)</span>
              <span class="slider-val"><span id="ventPEEPVal">5</span> cmH₂O</span>
            </div>
            <input type="range" id="ventPEEP" class="form-control-range" min="0" max="24" step="1" value="5">
          </div>

          <div class="form-group setting-slider">
            <div class="slider-header">
              <span>אחוז חמצן באוויר (FiO₂)</span>
              <span class="slider-val"><span id="ventFiO2Val">40</span>%</span>
            </div>
            <input type="range" id="ventFiO2" class="form-control-range" min="21" max="100" step="1" value="40">
          </div>

        </div>

        <!-- Right Column: Display Screen and challenge options -->
        <div class="simulator-display">
          
          <!-- Vent parameters digital panel -->
          <div class="card" style="background:#05070c; border-color:var(--border-color)">
            <div class="card-title" style="margin-bottom:20px; font-size:1.05rem;"><i class="fa-solid fa-tv" style="color:var(--color-cyan)"></i> צג נתוני מנשם ומדדים פיזיולוגיים</div>
            
            <div class="vent-metrics-grid">
              <div class="vent-metric-box">
                <div class="vent-metric-label">נפח נשמה (Vt)</div>
                <div class="vent-metric-value cyan" id="valVt">450 <span class="vent-metric-unit">mL</span></div>
              </div>
              <div class="vent-metric-box">
                <div class="vent-metric-label">לחץ שיא (PIP)</div>
                <div class="vent-metric-value green" id="valPIP">25 <span class="vent-metric-unit">cmH₂O</span></div>
              </div>
              <div class="vent-metric-box">
                <div class="vent-metric-label">לחץ פלאטו (Pplat)</div>
                <div class="vent-metric-value green" id="valPplat">14 <span class="vent-metric-unit">cmH₂O</span></div>
              </div>
              <div class="vent-metric-box">
                <div class="vent-metric-label">נפח דקה (Ve)</div>
                <div class="vent-metric-value cyan" id="valVe">6.3 <span class="vent-metric-unit">L/min</span></div>
              </div>
            </div>

            <!-- Physiological ABG feedback -->
            <div class="control-group-title" style="margin-top:24px; margin-bottom:12px;">ניטור גזים בדם עורקי וסלקטיבי (ABG & Oxygenation)</div>
            
            <div class="vent-metrics-grid">
              <div class="vent-metric-box">
                <div class="vent-metric-label">pH עורקי</div>
                <div class="vent-metric-value green" id="valPH">7.40</div>
              </div>
              <div class="vent-metric-box">
                <div class="vent-metric-label">פחמן דו-חמצני (PaCO₂)</div>
                <div class="vent-metric-value green" id="valPaCO2">40 <span class="vent-metric-unit">mmHg</span></div>
              </div>
              <div class="vent-metric-box">
                <div class="vent-metric-label">לחץ חמצן (PaO₂)</div>
                <div class="vent-metric-value cyan" id="valPaO2">98 <span class="vent-metric-unit">mmHg</span></div>
              </div>
              <div class="vent-metric-box">
                <div class="vent-metric-label">ריווח חמצן (SpO₂)</div>
                <div class="vent-metric-value green" id="valSpO2">98 <span class="vent-metric-unit">%</span></div>
              </div>
            </div>
          </div>

          <!-- Action challenges cards -->
          <div class="card">
            <div class="card-title"><i class="fa-solid fa-graduation-cap" style="color:var(--color-blue)"></i> אתגרי למידה בסימולטור</div>
            <div class="challenge-list">
              <div class="challenge-item active" id="challengeNormalBtn">
                <div>
                  <strong>מצב אימון חופשי (Free Practice)</strong>
                  <div style="font-size:0.75rem; color:var(--text-secondary); margin-top:2px;">תרגול ללא תקלות, ריאות עם היענות ותנגודת תקינות.</div>
                </div>
                <i class="fa-solid fa-dumbbell" style="color:var(--text-secondary)"></i>
              </div>
              
              <div class="challenge-item" id="challengeARDSBtn">
                <div>
                  <strong>אתגר 1: הנשמת מטופלת ARDS קשה</strong>
                  <div style="font-size:0.75rem; color:var(--text-secondary); margin-top:2px;">ריאות קשיחות (Compliance=18). בצע הנשמה מגינה בהצלחה.</div>
                </div>
                <i class="fa-solid fa-lungs" style="color:var(--color-yellow)"></i>
              </div>

              <div class="challenge-item" id="challengeAlarmBtn">
                <div>
                  <strong>אתגר 2: פתרון אזעקת לחץ הנשמה גבוה</strong>
                  <div style="font-size:0.75rem; color:var(--text-secondary); margin-top:2px;">אזעקת לחץ שיא עקב חסימת דרכי אוויר קשה. בצע אבחנה וטיפול.</div>
                </div>
                <i class="fa-solid fa-bell" style="color:var(--color-red)"></i>
              </div>
            </div>

            <!-- Dynamic prompt card based on challenge selected -->
            <div id="ventChallengePrompt" class="debrief-reference" style="display:none; margin-top:16px;"></div>

            <!-- Interventions for troubleshooting (only visible in Alarm challenge) -->
            <div id="ventInterventionCard" class="debrief-box" style="display:none; border-top: 1px solid var(--border-color); padding-top:16px;">
              <div style="font-size:0.85rem; font-weight:600; color:var(--text-secondary); margin-bottom:10px;">פעולות התערבות קליניות</div>
              <div style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:12px;">
                <button class="btn btn-secondary" id="actionSuctionBtn"><i class="fa-solid fa-pump-medical"></i> שאב הפרשות (Suction)</button>
                <button class="btn btn-secondary" id="actionDilatorBtn"><i class="fa-solid fa-spray-can"></i> תן מרחיבי סימפונות (Salbutamol)</button>
                <button class="btn btn-secondary" id="actionBiteBlockBtn"><i class="fa-solid fa-mask-face"></i> בדק מנשך (Bite Block)</button>
              </div>
              <div id="interventionFeedback" style="font-size:0.85rem; padding:8px 12px; background:rgba(255,255,255,0.02); border-radius:4px;"></div>
            </div>

            <!-- Challenge Complete Success Box -->
            <div id="ventChallengeFeedback" style="display:none; margin-top:20px;"></div>
          </div>

        </div>
      </div>
    `,
    
    scenarios: `
      <!-- Dynamic scenarios list or active scenario container, managed by js/scenarios.js -->
      <div id="scenarioAppTarget"></div>
    `,
    
    abg: `
      <div class="abg-layout">
        
        <!-- Left: Game board & selections -->
        <div class="abg-display-area">
          <div class="abg-display-board card">
            <div class="card-title" style="margin-bottom:8px;"><i class="fa-solid fa-vial" style="color:var(--color-cyan)"></i> צג בדיקת גזים בדם עורקי (Arterial Blood Gas)</div>
            
            <div class="abg-vitals-row">
              <div class="abg-card">
                <div class="abg-card-label">pH</div>
                <div class="abg-card-value green" id="abgValPH">7.40</div>
                <div class="abg-card-unit">7.35 - 7.45</div>
              </div>
              <div class="abg-card">
                <div class="abg-card-label">pCO₂</div>
                <div class="abg-card-value green" id="abgValPCO2">40</div>
                <div class="abg-card-unit">35 - 45 mmHg</div>
              </div>
              <div class="abg-card">
                <div class="abg-card-label">HCO₃⁻</div>
                <div class="abg-card-value green" id="abgValHCO3">24</div>
                <div class="abg-card-unit">22 - 26 mEq/L</div>
              </div>
              <div class="abg-card">
                <div class="abg-card-label">pO₂</div>
                <div class="abg-card-value green" id="abgValPO2">95</div>
                <div class="abg-card-unit">80 - 100 mmHg</div>
              </div>
            </div>

            <!-- Interactive Question pills selection -->
            <div class="abg-inputs-panel">
              
              <!-- Question 1: pH status -->
              <div class="abg-input-section">
                <div class="abg-input-label">1. מצב ה-pH הבסיסי:</div>
                <div class="abg-pill-group">
                  <input type="radio" id="pH_normal" name="primary" value="normal" class="abg-pill-input">
                  <label for="pH_normal" class="abg-pill-label">תקין (Normal)</label>
                  
                  <input type="radio" id="pH_acid" name="primary" value="acidosis" class="abg-pill-input">
                  <label for="pH_acid" class="abg-pill-label">חמצת (Acidosis)</label>
                  
                  <input type="radio" id="pH_alk" name="primary" value="alkalosis" class="abg-pill-input">
                  <label for="pH_alk" class="abg-pill-label">בססת (Alkalosis)</label>
                </div>
              </div>

              <!-- Question 2: Origin -->
              <div class="abg-input-section">
                <div class="abg-input-label">2. מקור ההפרעה (Origin):</div>
                <div class="abg-pill-group">
                  <input type="radio" id="orig_norm" name="origin" value="normal" class="abg-pill-input">
                  <label for="orig_norm" class="abg-pill-label">תקין (Normal)</label>
                  
                  <input type="radio" id="orig_resp" name="origin" value="respiratory" class="abg-pill-input">
                  <label for="orig_resp" class="abg-pill-label">נשימתי (Respiratory)</label>
                  
                  <input type="radio" id="orig_meta" name="origin" value="metabolic" class="abg-pill-input">
                  <label for="orig_meta" class="abg-pill-label">מטבולי (Metabolic)</label>
                </div>
              </div>

              <!-- Question 3: Compensation -->
              <div class="abg-input-section">
                <div class="abg-input-label">3. מנגנון פיצוי (Compensation):</div>
                <div class="abg-pill-group">
                  <input type="radio" id="comp_norm" name="compensation" value="normal" class="abg-pill-input">
                  <label for="comp_norm" class="abg-pill-label">אין הפרעה</label>
                  
                  <input type="radio" id="comp_none" name="compensation" value="none" class="abg-pill-input">
                  <label for="comp_none" class="abg-pill-label">ללא פיצוי (Uncompensated)</label>
                  
                  <input type="radio" id="comp_part" name="compensation" value="partial" class="abg-pill-input">
                  <label for="comp_part" class="abg-pill-label">פיצוי חלקי (Partially)</label>
                  
                  <input type="radio" id="comp_full" name="compensation" value="full" class="abg-pill-input">
                  <label for="comp_full" class="abg-pill-label">פיצוי מלא (Fully)</label>
                </div>
              </div>

              <!-- Question 4: Oxygenation -->
              <div class="abg-input-section">
                <div class="abg-input-label">4. רמת החמצון (Oxygenation):</div>
                <div class="abg-pill-group">
                  <input type="radio" id="oxy_norm" name="oxygenation" value="normal" class="abg-pill-input">
                  <label for="oxy_norm" class="abg-pill-label">חמצון תקין</label>
                  
                  <input type="radio" id="oxy_mild" name="oxygenation" value="mild" class="abg-pill-input">
                  <label for="oxy_mild" class="abg-pill-label">היפוקסמיה קלה (Mild)</label>
                  
                  <input type="radio" id="oxy_mod" name="oxygenation" value="moderate" class="abg-pill-input">
                  <label for="oxy_mod" class="abg-pill-label">היפוקסמיה בינונית (Moderate)</label>
                  
                  <input type="radio" id="oxy_sev" name="oxygenation" value="severe" class="abg-pill-input">
                  <label for="oxy_sev" class="abg-pill-label">היפוקסמיה קשה (Severe)</label>
                </div>
              </div>

            </div>

            <!-- Action buttons -->
            <button class="btn btn-primary" id="abgCheckBtn" style="margin-top:24px; width:200px;">בדוק אבחנה</button>
            <button class="btn btn-primary" id="abgNextBtn" style="margin-top:24px; width:200px; display:none; background:var(--color-green); color:#000;">הבא (ABG חדש) <i class="fa-solid fa-arrow-left"></i></button>
            
            <!-- Explanatory feedback box -->
            <div id="abgFeedback" class="abg-feedback-box" style="margin-top:20px; width:100%;"></div>
          </div>
        </div>

        <!-- Right Scoreboard -->
        <div class="score-panel">
          <div class="card">
            <div class="card-title"><i class="fa-solid fa-trophy" style="color:var(--color-yellow)"></i> לוח נקודות והצלחה</div>
            <div class="score-stats">
              <div class="score-stat-box">
                <div class="score-stat-title">ניקוד מצטבר</div>
                <div class="score-stat-value" id="abgScoreVal">0</div>
              </div>
              <div class="score-stat-box">
                <div class="score-stat-title">רצף נוכחי</div>
                <div class="score-stat-value" id="abgStreakVal" style="color:var(--color-cyan)">0</div>
              </div>
            </div>
            
            <div style="margin-top:16px; font-size:0.9rem; text-align:center;">
              שיא רצף אישי: <strong id="abgHighScoreVal" style="color:var(--color-yellow)">0</strong> הצלחות ברצף
            </div>
          </div>

          <div class="card">
            <div class="card-title"><i class="fa-solid fa-circle-question" style="color:var(--color-blue)"></i> עזר פענוח מהיר</div>
            <p style="font-size:0.8rem; line-height:1.5; color:var(--text-secondary)">
              <strong>טווחים תקינים:</strong><br>
              pH: 7.35 - 7.45 (מתחת חומצי, מעל בסיסי)<br>
              pCO₂: 35 - 45 mmHg (נשימתי, הפוך ל-pH)<br>
              HCO₃⁻: 22 - 26 mEq/L (מטבולי, תואם ל-pH)<br>
              pO₂: 80 - 100 mmHg (חמצון)<br><br>
              <strong>כלל פיצוי מלא:</strong> pH חזר לטווח 7.35-7.45 אך אחד הגורמים האחרים נותר פתולוגי.
            </p>
          </div>
        </div>
      </div>
    `,
    
    calculators: `
      <div class="calc-layout">
        
        <!-- Calculator 1: Syringe pump Infusion rate -->
        <div class="card">
          <div class="card-title"><i class="fa-solid fa-syringe" style="color:var(--color-cyan)"></i> הזלפת תרופות (Syringe Pump Rate)</div>
          
          <div class="form-group">
            <label>מינון מבוקש (Dose)</label>
            <div style="display:grid; grid-template-columns: 1fr 120px; gap:8px;">
              <input type="number" id="doseVal" class="form-control" value="0.1" step="0.05" min="0">
              <select id="doseUnitSelect" class="form-control">
                <option value="mcg_kg_min" selected>מק"ג/ק"ג/דקה</option>
                <option value="mcg_min">מק"ג/דקה</option>
                <option value="mg_hr">מ"ג/שעה</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label>משקל מטופל (Patient Weight)</label>
            <input type="number" id="doseWeight" class="form-control" value="70" min="20" max="200">
          </div>

          <div class="form-group">
            <label>סך חומר פעיל במזרק (Total Drug - mg)</label>
            <input type="number" id="doseDrugAmt" class="form-control" value="4" min="0">
          </div>

          <div class="form-group">
            <label>סך נפח מזרק/תמיסה (Total Volume - mL)</label>
            <input type="number" id="doseBagVol" class="form-control" value="50" min="1">
          </div>

          <div class="calc-result-box">
            <div class="calc-result-label">קצב הזלפה במשאבה</div>
            <div class="calc-result-value" id="doseResultVal">0.0</div>
            <div style="font-size:0.75rem; opacity:0.8;">מ"ל/שעה (mL/hr)</div>
            <div class="calc-interpretation" id="doseInterp">ריכוז: -</div>
          </div>
        </div>

        <!-- Calculator 2: PaO2/FiO2 Ratio -->
        <div class="card">
          <div class="card-title"><i class="fa-solid fa-lungs" style="color:var(--color-blue)"></i> יחס P/F ודירוג כשל נשימתי (ARDS)</div>
          
          <div class="form-group">
            <label>PaO₂ מתוך גזים בדם (mmHg)</label>
            <input type="number" id="pfPaO2" class="form-control" value="75" min="20" max="600">
          </div>

          <div class="form-group">
            <label>אחוז חמצן מונשם FiO₂ (%)</label>
            <input type="number" id="pfFiO2" class="form-control" value="50" min="21" max="100">
          </div>

          <div class="calc-result-box" style="margin-top:85px;">
            <div class="calc-result-label">יחס PaO₂/FiO₂ Ratio</div>
            <div class="calc-result-value green" id="pfResultVal">150</div>
            <div class="calc-interpretation" id="pfInterp">הערכה: -</div>
          </div>
        </div>

        <!-- Calculator 3: GCS -->
        <div class="card" style="grid-column:span 1;">
          <div class="card-title"><i class="fa-solid fa-brain" style="color:var(--color-yellow)"></i> Glasgow Coma Scale (GCS)</div>
          
          <div class="gcs-selector">
            <!-- Eye Response -->
            <div class="gcs-group-title">פתיחת עיניים (Eye Opening)</div>
            <div class="gcs-options">
              <div>
                <input type="radio" id="e4" name="gcsEye" value="4" checked class="gcs-option-input">
                <label for="e4" class="gcs-option-label"><span>פתיחה ספונטנית</span> <span>4</span></label>
              </div>
              <div>
                <input type="radio" id="e3" name="gcsEye" value="3" class="gcs-option-input">
                <label for="e3" class="gcs-option-label"><span>פתיחה לקול/ציווי</span> <span>3</span></label>
              </div>
              <div>
                <input type="radio" id="e2" name="gcsEye" value="2" class="gcs-option-input">
                <label for="e2" class="gcs-option-label"><span>פתיחה לכאב</span> <span>2</span></label>
              </div>
              <div>
                <input type="radio" id="e1" name="gcsEye" value="1" class="gcs-option-input">
                <label for="e1" class="gcs-option-label"><span>ללא תגובה</span> <span>1</span></label>
              </div>
            </div>

            <!-- Verbal Response -->
            <div class="gcs-group-title">תגובה מילולית (Verbal Response)</div>
            <div class="gcs-options">
              <div>
                <input type="radio" id="v5" name="gcsVerbal" value="5" checked class="gcs-option-input">
                <label for="v5" class="gcs-option-label"><span>התמצאות מלאה, שיחה תקינה</span> <span>5</span></label>
              </div>
              <div>
                <input type="radio" id="v4" name="gcsVerbal" value="4" class="gcs-option-input">
                <label for="v4" class="gcs-option-label"><span>שיחה מבולבלת</span> <span>4</span></label>
              </div>
              <div>
                <input type="radio" id="v3" name="gcsVerbal" value="3" class="gcs-option-input">
                <label for="v3" class="gcs-option-label"><span>מילים לא מתאימות</span> <span>3</span></label>
              </div>
              <div>
                <input type="radio" id="v2" name="gcsVerbal" value="2" class="gcs-option-input">
                <label for="v2" class="gcs-option-label"><span>קולות בלתי מובנים (הברות)</span> <span>2</span></label>
              </div>
              <div>
                <input type="radio" id="v1" name="gcsVerbal" value="1" class="gcs-option-input">
                <label for="v1" class="gcs-option-label"><span>ללא תגובה</span> <span>1</span></label>
              </div>
            </div>

            <!-- Motor Response -->
            <div class="gcs-group-title">תגובה מוטורית (Motor Response)</div>
            <div class="gcs-options">
              <div>
                <input type="radio" id="m6" name="gcsMotor" value="6" checked class="gcs-option-input">
                <label for="m6" class="gcs-option-label"><span>ממלא פקודות</span> <span>6</span></label>
              </div>
              <div>
                <input type="radio" id="m5" name="gcsMotor" value="5" class="gcs-option-input">
                <label for="m5" class="gcs-option-label"><span>מזהה וממקד גירוי כאב</span> <span>5</span></label>
              </div>
              <div>
                <input type="radio" id="m4" name="gcsMotor" value="4" class="gcs-option-input">
                <label for="m4" class="gcs-option-label"><span>רפלקס נסיגה מכאב</span> <span>4</span></label>
              </div>
              <div>
                <input type="radio" id="m3" name="gcsMotor" value="3" class="gcs-option-input">
                <label for="m3" class="gcs-option-label"><span>כיפוף אבנורמלי (Decorticate)</span> <span>3</span></label>
              </div>
              <div>
                <input type="radio" id="m2" name="gcsMotor" value="2" class="gcs-option-input">
                <label for="m2" class="gcs-option-label"><span>יישור אבנורמלי (Decerebrate)</span> <span>2</span></label>
              </div>
              <div>
                <input type="radio" id="m1" name="gcsMotor" value="1" class="gcs-option-input">
                <label for="m1" class="gcs-option-label"><span>ללא תגובה</span> <span>1</span></label>
              </div>
            </div>
          </div>

          <div class="calc-result-box">
            <div class="calc-result-label">סך מדד Glasgow Coma Scale</div>
            <div class="calc-result-value green" id="gcsResultVal">15</div>
            <div class="calc-interpretation" id="gcsInterp">הערכה: מצב הכרה שמור</div>
          </div>
        </div>

        <!-- Calculator 4: Ideal Body Weight and Vt target -->
        <div class="card" style="align-self:start;">
          <div class="card-title"><i class="fa-solid fa-scale-balanced" style="color:var(--color-green)"></i> משקל גוף אידיאלי (IBW) ונפחי הנשמה</div>
          
          <div class="form-group">
            <label>מין ביולוגי (Biological Sex)</label>
            <div style="display:flex; gap:16px;">
              <div>
                <input type="radio" id="vtGenderM" name="vtGender" value="male" checked>
                <label for="vtGenderM">גבר (Male)</label>
              </div>
              <div>
                <input type="radio" id="vtGenderF" name="vtGender" value="female">
                <label for="vtGenderF">אישה (Female)</label>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label>גובה המטופל (בסנטימטרים - cm)</label>
            <input type="number" id="vtHeight" class="form-control" value="175" min="100" max="240">
          </div>

          <div class="calc-result-box" style="margin-top:60px;">
            <div class="calc-result-label">משקל גוף אידיאלי (IBW)</div>
            <div class="calc-result-value green" id="vtResultVal">70.3 ק"ג</div>
            <div class="calc-interpretation" id="vtInterp" style="line-height:1.6; text-align:right;">נפח מומלץ למניעת VILI: -</div>
          </div>
        </div>

      </div>
    `,
    
    checklists: `
      <div id="checklistAppTarget" style="min-height:500px; display:flex; align-items:center; justify-content:center;">
        <div style="color:var(--text-secondary);"><i class="fa-solid fa-spinner fa-spin" style="font-size:2rem; margin-bottom:12px; display:block; text-align:center;"></i>טוען צ'קליסטים...</div>
      </div>
    `,
    
    escape: `
      <div class="escape-layout">
        <!-- Dashboard bar -->
        <div class="escape-dashboard-bar" style="margin-bottom: 24px;">
          <div class="escape-station-title" id="escapeStationTitle">
            <i class="fa-solid fa-door-open"></i>
            <span>תחנה 1: ייצוב נשימתי ופתיחת חסימת הציוד</span>
          </div>
          <div style="display:flex; align-items:center; gap:20px;">
            <div class="escape-sound-widget">
              <button class="btn btn-secondary" id="escapeAudioToggle" style="padding:6px 12px; font-size:0.85rem; display:flex; align-items:center; gap:6px;">
                <i class="fa-solid fa-volume-xmark" id="escapeAudioIcon"></i>
                <span id="escapeAudioText">צלילים מושתקים</span>
              </button>
            </div>
            <div class="escape-timer" id="escapeTimer">20:00</div>
          </div>
        </div>

        <!-- Introduction Overlay (Only shown before starting) -->
        <div id="escapeIntroOverlay" class="card" style="text-align:center; padding:40px; max-width:650px; margin:20px auto;">
          <div style="font-size:3rem; color:#ffab00; margin-bottom:20px;"><i class="fa-solid fa-hourglass-start"></i></div>
          <h2 style="font-family:var(--font-header); margin-bottom:16px; color:var(--text-primary);">משמרת חירום - חדר בריחה טיפול נמרץ</h2>
          <p style="color:var(--text-secondary); line-height:1.6; margin-bottom:24px; text-align:right;">
            <strong>ברוכים הבאים לסימולציית חדר הבריחה הלימודי של טיפול נמרץ!</strong><br><br>
            אתה מתחיל משמרת לילה סוערת ביחידה. במיטה 480 שוכב המטופל <strong>MORTON</strong>, מונשם מזה יומיים.
            לפתע המוניטור מתחיל לצפצף – הסטורציה צונחת ל-87%, הדופק עולה ל-110, והמטופל במצוקה קשה.<br><br>
            עליך לפעול במהירות לייצוב המטופל בתוך <strong>20 דקות בלבד</strong>. 
            הדרך היחידה להצילו ולפתוח את החדר היא לעבור בהצלחה את 3 התחנות:
          </p>
          <ul style="color:var(--text-secondary); text-align:right; margin:0 auto 24px auto; max-width:450px; line-height:1.6;">
            <li><strong>תחנה 1:</strong> פתיחת ארון הציוד הנעול וביצוע פעולות הנשמה דחופות (שסתום PEEP, סקשן ואמבו).</li>
            <li><strong>תחנה 2:</strong> זיהוי המצוקה ומתן תרופת סדציה בפרוטוקול אימות כפול (Fentanyl).</li>
            <li><strong>תחנה 3:</strong> האזנה לריאות, פענוח גזים בדם (ABG) והזנת מפתח הבריחה הדיגיטלי.</li>
          </ul>
          <button class="btn btn-primary" id="escapeStartBtn" style="font-size:1.1rem; padding:12px 32px;"><i class="fa-solid fa-play"></i> התחל משמרת חירום</button>
        </div>

        <!-- Main Game Area (Hidden initially) -->
        <div id="escapeGameArea" style="display:none;">
          <!-- Bedside Vitals Monitor (synced to the escape game) -->
          <div class="vitals-monitor-panel" id="vitalsMonitorPanel" style="margin-bottom:24px;">
            <div class="monitor-waveforms">
              <div class="waveform-channel">
                <span class="waveform-label label-ecg"><i class="fa-solid fa-heart pulse-glow-cyan heartbeat-icon"></i> ECG (קצב לב) - מיטה 480 - MORTON</span>
                <canvas id="ecgCanvas" class="waveform-canvas"></canvas>
              </div>
              <div class="waveform-channel">
                <span class="waveform-label label-spo2"><i class="fa-solid fa-wave-square"></i> SpO₂ (סטורציה)</span>
                <canvas id="spo2Canvas" class="waveform-canvas"></canvas>
              </div>
              <div class="waveform-channel">
                <span class="waveform-label label-resp"><i class="fa-solid fa-lungs"></i> Resp (קצב נשימה)</span>
                <canvas id="co2Canvas" class="waveform-canvas"></canvas>
              </div>
            </div>
            <div class="monitor-numeric">
              <div class="vitals-grid-sidebar">
                <div class="vital-box green">
                  <div class="vital-meta">
                    <span class="vital-title">HR</span>
                    <span class="vital-limit">60-100</span>
                  </div>
                  <div class="vital-value" id="monitorHR">110</div>
                </div>
                <div class="vital-box red">
                  <div class="vital-meta">
                    <span class="vital-title">BP</span>
                    <span class="vital-limit">120/80</span>
                  </div>
                  <div class="vital-value" id="monitorBP" style="font-size:1.6rem">135/85</div>
                </div>
                <div class="vital-box cyan">
                  <div class="vital-meta">
                    <span class="vital-title">SpO₂</span>
                    <span class="vital-limit">95-100</span>
                  </div>
                  <div class="vital-value" id="monitorSpO2">87</div>
                </div>
                <div class="vital-box yellow">
                  <div class="vital-meta">
                    <span class="vital-title">RR</span>
                    <span class="vital-limit">12-20</span>
                  </div>
                  <div class="vital-value" id="monitorRR">30</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Active Station Content Panel -->
          <div id="escapeStationPanel"></div>
        </div>

        <!-- Success Screen Overlay -->
        <div id="escapeSuccessOverlay" class="escape-success-overlay" style="display:none;">
          <div class="escape-success-content">
            <div class="escape-badge"><i class="fa-solid fa-trophy"></i></div>
            <h2 style="font-family:var(--font-header); margin-bottom:16px; color:var(--color-green);">עברת את משמרת החירום בהצלחה!</h2>
            <p style="font-size:1.1rem; line-height:1.6; margin-bottom:24px;">
              הצלחת לייצב את המטופל <strong>MORTON</strong>, לפענח את הבעיה הריאתית שלו ולפתוח את חדר הבריחה בזמן!
            </p>
            <div class="score-stats" style="margin-bottom:24px;">
              <div class="score-stat-box">
                <div class="score-stat-title">זמן שנותר</div>
                <div class="score-stat-value" id="escapeSuccessTime" style="color:var(--color-cyan)">00:00</div>
              </div>
              <div class="score-stat-box">
                <div class="score-stat-title">תקלות ועיכובים</div>
                <div class="score-stat-value" id="escapeSuccessDeductions" style="color:var(--color-green)">אפס!</div>
              </div>
            </div>
            <div class="debrief-box" style="text-align:right; margin-bottom:24px; padding:16px; background:rgba(255,255,255,0.02); border-radius:8px;">
              <strong style="color:var(--color-cyan)">סיכום רפואי ונקודות מפתח:</strong>
              <ul style="margin-top:10px; line-height:1.6; font-size:0.9rem; padding-right:20px;">
                <li>הפרעה נשימתית מורכבת: שילוב של <strong>חמצת נשימתית (Respiratory Acidosis)</strong>, <strong>היפוקסמיה קשה (Hypoxemia)</strong> ו<strong>דלקת ריאות מצד ימין (Right Pneumonia)</strong>.</li>
                <li>פתיחת צינור קנה חסום וחיבור למערכת ידנית Ambu עם שסתום PEEP מסייעים מיידית בריווח החמצן ושיפור הסטורציה.</li>
                <li>סדציה כגון פנטניל חיונית למניעת אי שקט קיצוני ומלחמה במנשם, במיוחד תחת פרוטוקול בטיחות של תרופות בסיכון גבוה (Double Verification).</li>
              </ul>
            </div>
            <button class="btn btn-primary" onclick="location.hash = '#dashboard'"><i class="fa-solid fa-house"></i> חזור ללוח הבקרה</button>
          </div>
        </div>

        <!-- Failure Screen Overlay -->
        <div id="escapeFailureOverlay" class="escape-success-overlay" style="display:none; background:rgba(5, 7, 12, 0.98);">
          <div class="escape-success-content" style="border-color:var(--color-red); box-shadow: 0 0 40px rgba(255,23,68,0.25);">
            <div class="escape-badge" style="background:var(--color-red);"><i class="fa-solid fa-triangle-exclamation"></i></div>
            <h2 style="font-family:var(--font-header); margin-bottom:16px; color:var(--color-red);">הזמן תם! המטופל קרס.</h2>
            <p style="font-size:1.1rem; line-height:1.6; margin-bottom:24px;">
              לא הצלחת להשלים את פעולות ההצלה בתוך 20 דקות.
            </p>
            <button class="btn btn-primary" id="escapeRestartBtn" style="background:var(--color-red); color:#fff;"><i class="fa-solid fa-rotate-left"></i> נסה שוב</button>
          </div>
        </div>
      </div>
    `
  },

  init() {
    this.setupRouter();
    this.setupMobileMenu();
    this.navigate(); // Initial navigation based on current hash
  },

  setupRouter() {
    window.addEventListener('hashchange', () => this.navigate());
    
    // Bind sidebar clicks to hash updating
    const menuItems = document.querySelectorAll('.sidebar-menu .menu-item');
    menuItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const view = item.dataset.view;
        location.hash = '#' + view;
        
        // Mobile sidebar close on click
        const sidebar = document.getElementById('appSidebar');
        if (sidebar) sidebar.classList.remove('open');
      });
    });
  },

  setupMobileMenu() {
    const btn = document.getElementById('menuToggleBtn');
    const sidebar = document.getElementById('appSidebar');
    
    btn?.addEventListener('click', () => {
      sidebar?.classList.toggle('open');
    });
    
    // Close sidebar clicking outside on mobile
    document.addEventListener('click', (e) => {
      if (sidebar && sidebar.classList.contains('open') && 
          !sidebar.contains(e.target) && 
          !btn.contains(e.target)) {
        sidebar.classList.remove('open');
      }
    });
  },

  navigate() {
    let hash = location.hash.replace('#', '') || 'dashboard';
    
    // Verify view exists, fallback to dashboard
    if (!this.templates[hash]) {
      hash = 'dashboard';
    }

    this.activeView = hash;
    this.renderView();
  },

  renderView() {
    const appView = document.getElementById('appView');
    if (!appView) return;

    // Set page headings based on active view
    const titleEl = document.getElementById('viewTitle');
    const subtitleEl = document.getElementById('viewSubtitle');
    
    const headings = {
      dashboard: { title: 'לוח בקרה', subtitle: 'סקירת ביצועים וסימנים חיוניים בטיפול נמרץ' },
      ventilator: { title: 'סימולטור מכונת הנשמה', subtitle: 'סימולציה של מכניקת ריאות, תגובות פיזיולוגיות ואתגרים' },
      scenarios: { title: 'תרחישים קליניים', subtitle: 'קבלת החלטות מבוססת הנחיות רפואיות בטיפול נמרץ בזמן אמת' },
      abg: { title: 'משחק גזים בדם (ABG)', subtitle: 'תרגול מהיר של בדיקות גזים בדם עורקי ופיצויים' },
      calculators: { title: 'מחשבוני טיפול נמרץ', subtitle: 'מחשבונים ונוסחאות רפואיות שימושיות לשימוש קליני' },
      checklists: { title: 'צ\'קליסטים לפעולות', subtitle: 'רשימות תיוג לפעולות מורכבות למניעת סיבוכים וזיהומים' },
      escape: { title: 'חדר בריחה (משמרת חירום)', subtitle: 'פתור את מקרה החירום של MORTON (מיטה 480) בתוך 20 דקות' }
    };

    if (titleEl && headings[this.activeView]) {
      titleEl.textContent = headings[this.activeView].title;
      subtitleEl.textContent = headings[this.activeView].subtitle;
    }

    // Toggle active classes in sidebar menu
    const menuItems = document.querySelectorAll('.sidebar-menu .menu-item');
    menuItems.forEach(item => {
      if (item.dataset.view === this.activeView) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Stop and clear previous view engines / loops
    if (window.vitalsEngine) {
      window.vitalsEngine.stopAlarmLoop();
      VitalsState.alarmActive = false;
    }
    if (window.ICEscapeRoom) {
      window.ICEscapeRoom.cleanup();
    }

    // Inject View HTML
    appView.innerHTML = this.templates[this.activeView];

    // Initialize specific View JavaScript Engine
    this.initializeViewScript();
  },

  initializeViewScript() {
    // 1. Dashboard initialization
    if (this.activeView === 'dashboard') {
      VitalsState.hr = 75;
      VitalsState.sbp = 120;
      VitalsState.dbp = 80;
      VitalsState.spo2 = 98;
      VitalsState.rr = 14;
      VitalsState.etco2 = 38;
      VitalsState.temp = 36.8;
      
      if (window.vitalsEngine) {
        window.vitalsEngine.canvases = {
          ecg: document.getElementById('ecgCanvas'),
          spo2: document.getElementById('spo2Canvas'),
          co2: document.getElementById('co2Canvas')
        };
        window.vitalsEngine.init();
        window.vitalsEngine.updateNumericDisplay();
      }
    }
    
    // 2. Ventilator initialization
    else if (this.activeView === 'ventilator') {
      if (window.VentSim) {
        window.VentSim.init();
      }
    }
    
    // 3. Scenarios initialization
    else if (this.activeView === 'scenarios') {
      if (window.ICUScenarios) {
        window.ICUScenarios.init();
      }
    }
    
    // 4. ABG game initialization
    else if (this.activeView === 'abg') {
      if (window.ABGGame) {
        window.ABGGame.init();
      }
    }
    
    // 5. Calculators initialization
    else if (this.activeView === 'calculators') {
      if (window.ICUCalcs) {
        window.ICUCalcs.init();
      }
    }
    
    // 6. Checklists initialization
    else if (this.activeView === 'checklists') {
      if (window.ICUChecklists) {
        window.ICUChecklists.init();
      }
    }
    
    // 7. Escape Room initialization
    else if (this.activeView === 'escape') {
      if (window.ICEscapeRoom) {
        window.ICEscapeRoom.init();
      }
    }
  }
};

// Start the Application when DOM is fully ready
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
