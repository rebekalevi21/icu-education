// ICU Clinical Scenarios Database and Controller
const ICUScenarios = {
  currentScenario: null,
  currentStep: null,
  
  data: {
    sepsis: {
      id: 'sepsis',
      title: "שוק ספטי (Septic Shock)",
      subtitle: "ייצוב המודינמי וניהול ספסל טיפול בספסיס",
      description: "מטופל בן 68, יומיים לאחר ניתוח כריתת מעי, מציג בלבול קל, חום גבוה ועור חם ולח. ניתנת לך הזדמנות לנהל את הדקות הראשונות והקריטיות של הטיפול.",
      difficulty: "בינוני",
      icon: "fa-shield-virus",
      
      steps: {
        start: {
          narrative: `המטופל מנומנם אך מגיב לקול. עורו חם, סמוק ולח. מד חום מראה 38.9°C.
          <strong>סימנים חיוניים נוכחיים:</strong><br>
          לחץ דם: 82/40 ממ"כ (MAP 54) - תת לחץ דם משמעותי.<br>
          קצב לב: 112 פעימות לדקה (טכיקרדיה).<br>
          סטורציה: 93% באוויר חדר.<br>
          קצב נשימה: 22 נשימות לדקה.<br>
          מהי הפעולה הראשונה הנדרשת בתוך שעת הזהב?`,
          vitals: { hr: 112, sbp: 82, dbp: 40, spo2: 93, rr: 22, etco2: 32, temp: 38.9, alarmActive: true },
          choices: [
            {
              letter: "A",
              text: "מתן חמצן במסכה, לקיחת תרביות דם ומתן נוזלים מהיר (Crystalloids) בנפח של 30 מ\"ל/ק\"ג (כ-2.5 ליטר) יחד עם אנטיביוטיקה רחבת טווח (Ceftriaxone + Metronidazole).",
              nextStep: "fluid_given",
              isCorrect: true
            },
            {
              letter: "B",
              text: "מתן מנת נוזלים קטנה של 250 מ\"ל סליין והמתנה לתוצאות תרביות מעבדה מלאות לפני מתן אנטיביוטיקה כדי לא למסך את הזיהום.",
              nextStep: "delay_sepsis",
              isCorrect: false
            },
            {
              letter: "C",
              text: "התחלה מיידית של הזלפת Noradrenaline במינון גבוה דרך ליין ורידי פריפרי קטן ללא מתן נוזלים מקדים.",
              nextStep: "vasopressor_first",
              isCorrect: false
            }
          ]
        },
        delay_sepsis: {
          narrative: `החלטת להמתין. בחלוף 45 דקות, מצב ההכרה של המטופל מדרדר עוד יותר, והוא אינו מגיב לקול אלא רק לגירוי כאב.
          אנטיביוטיקה ונוזלים לא ניתנו בזמן.
          <strong>הסימנים החיוניים התדרדרו:</strong><br>
          לחץ דם: 70/32 ממ"כ (MAP 44).<br>
          קצב לב: 128 פעימות לדקה.<br>
          סטורציה: 90% באוויר חדר.<br>
          לקטט בדם עלה ל-5.1 mmol/L.<br>
          אתה חייב לפעול מיד!`,
          vitals: { hr: 128, sbp: 70, dbp: 32, spo2: 90, rr: 25, etco2: 28, temp: 38.7, alarmActive: true },
          choices: [
            {
              letter: "A",
              text: "החזר נוזלים מהיר אגרסיבי של 30 מ\"ל/ק\"ג סליין סטרילי, מתן מיידי של אנטיביוטיקה אמפירית רחבת טווח, ונטילת תרביות דם דחופות.",
              nextStep: "fluid_given",
              isCorrect: true
            },
            {
              letter: "B",
              text: "ביצוע אינטובציה דחופה והרדמה מלאה כדי להפחית את העומס המטבולי של המטופל.",
              nextStep: "intubate_crash",
              isCorrect: false
            }
          ]
        },
        vasopressor_first: {
          narrative: `התחלת Noradrenaline ללא נפח נוזלים מקדים. המטופל מציג כיווץ כלי דם קיצוני. לחץ הדם עולה באופן זמני, אך אספקת הדם לאיברים חיוניים (מיקרו-סירקולציה) נפגעת קשות בשל חוסר מילוי נפח הדם. הלקטט עולה ל-4.8 mmol/L, ותפוקת השתן אפסית.
          יש לתקן את חוסר הנוזלים הבסיסי.`,
          vitals: { hr: 118, sbp: 98, dbp: 52, spo2: 91, rr: 24, etco2: 30, temp: 38.8, alarmActive: true },
          choices: [
            {
              letter: "A",
              text: "מתן 30 מ\"ל/ק\"ג נוזלים קריסטלואידים בדחיפות להחזרת נפח תוך-כלי, במקביל להמשך אנטיביוטיקה.",
              nextStep: "fluid_given",
              isCorrect: true
            },
            {
              letter: "B",
              text: "הוספת תרופה תומכת כיווץ שנייה כמו Adrenaline במינון גבוה.",
              nextStep: "vaso_overload",
              isCorrect: false
            }
          ]
        },
        intubate_crash: {
          narrative: `הנשמת המטופל בשוק ספטי עמוק ללא החזר נוזלים מקדים הובילה לקריסה המודינמית מלאה (Hypotensive arrest) בשל השפעת תרופות ההרדמה והפחתת ההחזר הורידי בעקבות הנשמה בלחץ חיובי. בוצעה החייאה מהירה והמטופל מונשם אך לא יציב לחלוטין.
          חובה לתת נוזלים ולתקן נפח כעת.`,
          vitals: { hr: 130, sbp: 62, dbp: 28, spo2: 92, rr: 14, etco2: 34, temp: 38.2, alarmActive: true },
          choices: [
            {
              letter: "A",
              text: "מתן נוזלים מהיר של 30 מ\"ל/ק\"ג, והתחלת תמיכה וזופרסורית מבוקרת.",
              nextStep: "fluid_given",
              isCorrect: true
            }
          ]
        },
        vaso_overload: {
          narrative: `שני וזופרסורים במינון גבוה ללא נוזלים גרמו לטכיקרדיה קשה (145) ואיסכמיה היקפית (קצות אצבעות כחולות).
          עליך לעצור ולבצע החזר נוזלים מיידי!`,
          vitals: { hr: 145, sbp: 80, dbp: 40, spo2: 88, rr: 26, etco2: 26, temp: 38.8, alarmActive: true },
          choices: [
            {
              letter: "A",
              text: "הפחתת מינון הווזופרסורים והתחלת מתן נוזלים קריסטלואידים בנפח של 30 מ\"ל/ק\"ג במהירות.",
              nextStep: "fluid_given",
              isCorrect: true
            }
          ]
        },
        fluid_given: {
          narrative: `החולה קיבל 2.5 ליטר נוזלים ואנטיביוטיקה מתאימה הוחלפה. תרביות נלקחו. ה-pH כעת הוא 7.28, והלקטט ירד במעט ל-3.9 mmol/L.
          <strong>סימנים חיוניים כעת:</strong><br>
          לחץ דם: 90/46 ממ"כ (MAP 61) - עדיין מתחת ליעד של 65 ממ"כ.<br>
          קצב לב: 104 פעימות לדקה.<br>
          סטורציה: 96% עם חמצן 4 ליטר במסכת משקפיים.<br>
          קצב נשימה: 18 נשימות לדקה.<br>
          מהו הצעד הבא להשגת יעד MAP >= 65 ממ"כ?`,
          vitals: { hr: 104, sbp: 90, dbp: 46, spo2: 96, rr: 18, etco2: 35, temp: 38.4, alarmActive: true },
          choices: [
            {
              letter: "A",
              text: "הכנסת צנתר ורידי מרכזי (CVC) וליין עורקי (A-Line), התחלת הזלפת Noradrenaline (וזופרסור ראשון) וטיטרציה להשגת לחץ דם ממוצע MAP >= 65 ממ\"כ.",
              nextStep: "stabilized",
              isCorrect: true
            },
            {
              letter: "B",
              text: "מתן מנה נוספת של 3 ליטר נוזלים במהירות, ללא שימוש בווזופרסורים.",
              nextStep: "fluid_overload",
              isCorrect: false
            },
            {
              letter: "C",
              text: "התחלת הזלפת Dobutamine (אינוטרופ) במינון של 10 מק\"ג/ק\"ג/דקה.",
              nextStep: "dobutamine_drop",
              isCorrect: false
            }
          ]
        },
        fluid_overload: {
          narrative: `מתן נוזלים עודף ללא וזופרסורים הוביל לעומס נוזלים ריאתי קשה (Pulmonary edema). המטופל מפתח קוצר נשימה קשה, חרחורים בריאות, והסטורציה שלו צונחת ל-82% עם חמצן.
          <strong>סימנים חיוניים:</strong><br>
          לחץ דם: 86/42 ממ"כ.<br>
          קצב לב: 118 פעימות לדקה.<br>
          סטורציה: 82% (היפוקסמיה קשה).<br>
          אינך יכול להמשיך לתת נוזלים. עליך להתחיל וזופרסור ולהנשים!`,
          vitals: { hr: 118, sbp: 86, dbp: 42, spo2: 82, rr: 28, etco2: 44, temp: 38.2, alarmActive: true },
          choices: [
            {
              letter: "A",
              text: "התחלת Noradrenaline דרך ליין ורידי, עצירת נוזלים, וביצוע הנשמה לא פולשנית (NIV/CPAP) או אינטובציה במידת הצורך.",
              nextStep: "stabilized",
              isCorrect: true
            }
          ]
        },
        dobutamine_drop: {
          narrative: `הזלפת Dobutamine גרמה להרחבת כלי דם היקפית נוספת (Vasodilation), מה שהוביל לצניחה נוספת בלחץ הדם.
          <strong>סימנים חיוניים כעת:</strong><br>
          לחץ דם: 72/35 ממ"כ (MAP 47).<br>
          קצב לב: 122 פעימות לדקה.<br>
          עליך להפסיק את ה-Dobutamine ולהתחיל מיד בווזופרסור מכווץ כלי דם.`,
          vitals: { hr: 122, sbp: 72, dbp: 35, spo2: 94, rr: 20, etco2: 33, temp: 38.3, alarmActive: true },
          choices: [
            {
              letter: "A",
              text: "הפסקת Dobutamine, הכנסת צנתר מרכזי, והתחלת הזלפת Noradrenaline לטיטרציה ליעד MAP >= 65 ממ\"כ.",
              nextStep: "stabilized",
              isCorrect: true
            }
          ]
        },
        stabilized: {
          narrative: `מצוין! תחת הזלפת Noradrenaline בטיטרציה מבוקרת דרך צנתר ורידי מרכזי, לחץ הדם של המטופל התייצב.
          <strong>סימנים חיוניים יציבים:</strong><br>
          לחץ דם: 112/68 ממ"כ (MAP 82) - בטווח היעד התקין.<br>
          קצב לב: 88 פעימות לדקה (קצב הלב ירד לאחר ייצוב המודינמי).<br>
          סטורציה: 97% עם חמצן תקין.<br>
          רמות הלקטט במגמת ירידה ל-2.1 mmol/L.<br>
          ייצבת את המטופל בהצלחה!`,
          vitals: { hr: 88, sbp: 112, dbp: 68, spo2: 97, rr: 16, etco2: 38, temp: 37.9, alarmActive: false },
          debrief: `<strong>סיכום ודיבייט קליני:</strong><br>
          השגת יציבות המודינמית מוצלחת בספסל טיפול בספסיס (Surviving Sepsis Campaign):
          <ul>
            <li><strong>שעת הזהב (Hour-1 Bundle):</strong> טיפול מוקדם באמצעות אנטיביוטיקה רחבת טווח ותרביות דם מונע תמותה בצורה משמעותית (כל עיכוב של שעה במתן אנטיביוטיקה מעלה את התמותה בכ-7.6%).</li>
            <li><strong>החזר נוזלים:</strong> 30 מ"ל/ק"ג של קריסטלואידים הם אבן היסוד הראשונית לתיקון תת-נפח יחסי בשל הרחבת כלי דם ספטית.</li>
            <li><strong>בחירת וזופרסור:</strong> Noradrenaline הוא הבחירה הראשונה להשגת לחץ דם ממוצע MAP >= 65 ממ"כ במטופלים שאינם מגיבים לנוזלים. שימוש באינוטרופים (כמו Dobutamine) שמור למקרים של כשל לבבי משולב (Cardiogenic dysfunction).</li>
          </ul><br>
          <em>מקורות: Surviving Sepsis Campaign: Guidelines on the Management of Adults with Coronavirus Disease 2019 (COVID-19) / Sepsis-3 definitions (JAMA 2016).</em>`
        }
      }
    },
    arrhythmia: {
      id: 'arrhythmia',
      title: "הפרעות קצב בטיפול נמרץ (Cardiac Arrhythmias)",
      subtitle: "ניהול הפרעות קצב מהירות ויציבות/לא יציבות",
      description: "מטופלת בת 56 מאושפזת בטיפול נמרץ, מתלוננת פתאום על דפיקות לב חזקות, לחץ בחזה וקוצר נשימה חריף. המוניטור מצפצף ומציג קצב מהיר ולא סדיר.",
      difficulty: "קשה",
      icon: "fa-heart-pulse",
      
      steps: {
        start: {
          narrative: `המטופלת נסערת, מזיעה ונושמת בכבדות. היא מדווחת על כאב לוחץ בחזה.
          המוניטור מציג גל ECG של Atrial Fibrillation (פרפור פרוזדורים) מהיר מאוד.
          <strong>סימנים חיוניים נוכחיים:</strong><br>
          לחץ דם: 88/44 ממ"כ (MAP 58) - לחץ דם נמוך מאוד.<br>
          קצב לב: 165 פעימות לדקה (טכיאריתמיה קשה).<br>
          סטורציה: 91% באוויר חדר.<br>
          מהו הצעד הטיפולי המיידי הנדרש?`,
          vitals: { hr: 165, sbp: 88, dbp: 44, spo2: 91, rr: 26, etco2: 30, temp: 36.6, alarmActive: true },
          choices: [
            {
              letter: "A",
              text: "ביצוע היפוך חשמלי מסונכרן מיידי (Synchronized Cardioversion) ב-120-200 ג'אול, תחת סדציה קלה במידת האפשר.",
              nextStep: "cardioverted",
              isCorrect: true
            },
            {
              letter: "B",
              text: "מתן מנת העמסה של Amiodarone 150 מ\"ג בעירוי תוך-ורידי במשך 10 דקות.",
              nextStep: "amiodarone_shock",
              isCorrect: false
            },
            {
              letter: "C",
              text: "התחלת הזלפת Diltiazem (Cardizem) דרך הווריד לקצב של 5 מ\"ג לשעה לצורך בקרת קצב הלב.",
              nextStep: "diltiazem_arrest",
              isCorrect: false
            }
          ]
        },
        amiodarone_shock: {
          narrative: `בזמן שהמתנת להכנת ה-Amiodarone, לחץ הדם של המטופלת צנח עוד יותר ל-76/38 ממ"כ. היא מתחילה לאבד את הכרתה ואינה מגיבה.
          הפרעה קצב מהירה ולא יציבה מחייבת היפוך חשמלי מיידי ולא תרופתי!`,
          vitals: { hr: 170, sbp: 76, dbp: 38, spo2: 87, rr: 28, etco2: 28, temp: 36.5, alarmActive: true },
          choices: [
            {
              letter: "A",
              text: "ביצוע היפוך חשמלי מסונכרן מיידי (Synchronized Cardioversion) ללא דיחוי.",
              nextStep: "cardioverted",
              isCorrect: true
            }
          ]
        },
        diltiazem_arrest: {
          narrative: `מתן Diltiazem (חוסם תעלות סידן עם אפקט אינוטרופי שלילי) במטופלת לא יציבה גרם להרחבת כלי דם ודיכוי לבבי קשה. לחץ הדם קרס לחלוטין.
          עליך לבצע היפוך חשמלי דחוף כעת!`,
          vitals: { hr: 155, sbp: 60, dbp: 30, spo2: 85, rr: 24, etco2: 25, temp: 36.5, alarmActive: true },
          choices: [
            {
              letter: "A",
              text: "הפסקת התרופה וביצוע היפוך חשמלי מסונכרן מיידי ב-150-200 ג'אול.",
              nextStep: "cardioverted",
              isCorrect: true
            }
          ]
        },
        cardioverted: {
          narrative: `בוצע היפוך חשמלי מסונכרן בהצלחה ב-150 ג'אול. המוניטור מראה קצב סינוס יציב של 85 פעימות לדקה, ולחץ הדם עלה ל-120/75.
          אולם, פתאום החולה מאבדת הכרה, המוניטור מצפצף ברעש חזק ומציג קצב רחב ומהיר מאוד של Ventricular Tachycardia (טכיקרדיה חדרית - VT).
          <strong>בדיקת דופק מהירה: אין דופק קרוטידי!</strong>
          <strong>סימנים חיוניים כעת:</strong><br>
          לחץ דם: 0 (קו שטוח בליין העורקי).<br>
          קצב לב: 185 פעימות לדקה (גל VT מהיר).<br>
          סטורציה: 0% (אין זרימת דם).<br>
          מהו הטיפול המיידי הנדרש?`,
          vitals: { hr: 185, sbp: 0, dbp: 0, spo2: 0, rr: 0, etco2: 0, temp: 36.5, alarmActive: true },
          choices: [
            {
              letter: "A",
              text: "התחלת עיסויי חזה (CPR) מיידיים, טעינת דפיברילטור ל-200 ג'אול ומתן שוק לא מסונכרן (Defibrillation) בהקדם האפשרי.",
              nextStep: "defibrillated",
              isCorrect: true
            },
            {
              letter: "B",
              text: "ביצוע היפוך חשמלי מסונכרן (Synchronized Cardioversion) ב-100 ג'אול כדי למנוע פגיעה בשריר הלב.",
              nextStep: "sync_delay",
              isCorrect: false
            },
            {
              letter: "C",
              text: "הזרקה ורידית מהירה (IV Push) של Adenosine 6 מ\"ג, ולאחר מכן שטיפה מהירה של סליין.",
              nextStep: "adenosine_dead",
              isCorrect: false
            }
          ]
        },
        sync_delay: {
          narrative: `ניסיון לבצע היפוך מסונכרן במצב של VT ללא דופק גרם לעיכוב במתן השוק. המכשיר לא הצליח לזהות גלי R ברורים כדי לסנכרן וסירב לפרוק את השוק. הזמן עובר והמטופלת נמצאת בדום לב מלא!
          במצב של VT ללא דופק חובה לתת שוק לא מסונכרן (Defibrillation) מיידי!`,
          vitals: { hr: 190, sbp: 0, dbp: 0, spo2: 0, rr: 0, etco2: 0, temp: 36.4, alarmActive: true },
          choices: [
            {
              letter: "A",
              text: "העברת הדפיברילטור למצב לא מסונכרן (Asynchronized/Defib), טעינה ל-200 ג'אול ומתן שוק מיידי יחד עם CPR.",
              nextStep: "defibrillated",
              isCorrect: true
            }
          ]
        },
        adenosine_dead: {
          narrative: `Adenosine מיועד לטכיקרדיה על-חדרית (SVT) יציבה בלבד! לחולה אין דופק והיא בדום לב. מתן Adenosine אינו מועיל וגרם לאובדן זמן יקר בהחייאה.
          חובה לתת שוק דפיברילציה מיידי!`,
          vitals: { hr: 195, sbp: 0, dbp: 0, spo2: 0, rr: 0, etco2: 0, temp: 36.4, alarmActive: true },
          choices: [
            {
              letter: "A",
              text: "התחלת עיסויי חזה ומתן שוק דפיברילציה דחוף ב-200 ג'אול במצב לא מסונכרן.",
              nextStep: "defibrillated",
              isCorrect: true
            }
          ]
        },
        defibrillated: {
          narrative: `שוק הדפיברילציה (שוק לא מסונכרן) ניתן במהירות. מיד לאחר השוק בוצעו שתי דקות של עיסויי חזה והנשמות.
          בבדיקת קצב חוזרת: המטופלת נושמת עצמונית, פוקחת עיניים.
          <strong>סימנים חיוניים נוכחיים (ROSC - חזרת דופק עצמוני):</strong><br>
          לחץ דם: 118/74 ממ"כ.<br>
          קצב לב: 82 פעימות לדקה (קצב סינוס תקין!).<br>
          סטורציה: 96% עם חמצן במסכה.<br>
          קצב נשימה: 14 נשימות לדקה.<br>
          המטופלת התעוררה והוצלה בהצלחה!`,
          vitals: { hr: 82, sbp: 118, dbp: 74, spo2: 96, rr: 14, etco2: 38, temp: 36.6, alarmActive: false },
          debrief: `<strong>סיכום ודיבייט קליני:</strong><br>
          הפרעות קצב בטיפול נמרץ דורשות קבלת החלטות מהירה המבוססת על יציבות המודינמית (ACLS Guidelines):
          <ul>
            <li><strong>יציב מול לא יציב:</strong> מטופל עם טכיאריתמיה (כמו AFib מהיר) שמציג סימני אי-יציבות (תת לחץ דם, כאב בחזה, קוצר נשימה קשה, ירידה במצב ההכרה) מחייב <strong>היפוך חשמלי מסונכרן מיידי</strong>. טיפול תרופתי (כמו Amiodarone או Diltiazem) שמור למטופלים יציבים בלבד.</li>
            <li><strong>סנכרון (Synchronized) מול דפיברילציה (Defibrillation):</strong>
              <ul>
                <li><strong>היפוך מסונכרן (Cardioversion):</strong> המכשיר נותן את השוק בדיוק על גל ה-R של ה-ECG כדי למנוע שוק בזמן גל ה-T (דבר שעלול לגרום ל-VF/דום לב). מיועד לקצבים עם דופק (AFib, SVT, VT יציב).</li>
                <li><strong>שוק לא מסונכרן (Defibrillation):</strong> שוק מיידי ללא סנכרון. מיועד למצבי דום לב ללא דופק (Ventricular Fibrillation ו-Pulseless VT).</li>
              </ul>
            </li>
          </ul><br>
          <em>מקורות: Advanced Cardiovascular Life Support (ACLS) Guidelines / American Heart Association (AHA) 2020.</em>`
        }
      }
    },
    ards: {
      id: 'ards',
      title: "ARDS קשה והנשמה מגינה (Severe ARDS & LTVV)",
      subtitle: "הנשמה מגינת ריאות וניהול כשל נשימתי היפוקסמי קשה",
      description: "מטופלת בת 44 מאושפזת בשל דלקת ריאות חיידקית קשה. היא מונשמת בהנשמה פולשנית במצב Volume Control (הנשמה בנפח), אך מדדי הלחץ ומצב הריאות קריטיים.",
      difficulty: "קשה",
      icon: "fa-lungs",
      
      steps: {
        start: {
          narrative: `המטופלת מורדמת ומונשמת במצב VC-AC (נפח מבוקר).
          <strong>נתוני הנשמה נוכחיים:</strong><br>
          נפח הנשמה (Tidal Volume): 500 מ"ל (כ-9 מ"ל/ק"ג ממשקל גוף אידיאלי).<br>
          PEEP: 5 cmH2O | FiO2: 60% | קצב נשימה במכונה: 16.<br><br>
          <strong>סימנים חיוניים וניטור ריאות:</strong><br>
          לחץ דם: 110/65 ממ"כ.<br>
          קצב לב: 98 פעימות לדקה.<br>
          סטורציה: 88% (היפוקסמיה).<br>
          לחץ שיא במערכת הנשימה (PIP): 38 cmH2O (תקין < 35).<br>
          לחץ פלאטו (Plateau Pressure): 34 cmH2O (יעד מונע נזק < 30).<br>
          יחס P/F הוא 110 (ARDS בינוני-קשה).<br>
          מהו הצעד הראשון לשיפור החמצון ומניעת נזק ריאתי מהנשמה (VILI)?`,
          vitals: { hr: 98, sbp: 110, dbp: 65, spo2: 88, rr: 16, etco2: 46, temp: 37.5, alarmActive: true },
          choices: [
            {
              letter: "A",
              text: "יישום פרוטוקול הנשמה מגינת ריאות (ARDSNet): הפחתת נפח ההנשמה ל-6 מ\"ל/ק\"ג (330 מ\"ל), העלאת ה-PEEP ל-12 cmH2O, והעלאת ה-FiO2 ל-70% לשיפור הדיפוסיה.",
              nextStep: "ltvv_applied",
              isCorrect: true
            },
            {
              letter: "B",
              text: "העלאת נפח ההנשמה ל-600 מ\"ל כדי לבצע 'שטיפת פחמן דו-חמצני' טובה יותר ולפתוח את הריאות שקרסו.",
              nextStep: "barotrauma",
              isCorrect: false
            },
            {
              letter: "C",
              text: "ניתוק מיידי מהמנשם ומעבר להנשמה ידנית אגרסיבית במפוח (Ambu Bag) בלחץ חופשי.",
              nextStep: "derecruitment",
              isCorrect: false
            }
          ]
        },
        barotrauma: {
          narrative: `העלאת נפח הנשמה ל-600 מ"ל הגדילה את מתח המתיחה בריאות. לחץ הפלאטו זינק ל-39 cmH2O. פתאום נשמעת אזעקת לחץ גבוה חריפה, סטורציה צונחת ל-78%, ולחץ הדם צונח ל-80/40.
          פיתחת pneumothorax (חזה אוויר בלחץ) עקב ברוטראומה! בוצע נקז חזה דחוף והמטופלת יציבה חלקית.
          עליך להפחית נפח הנשמה מיד כדי להגן על הריאות!`,
          vitals: { hr: 120, sbp: 80, dbp: 40, spo2: 78, rr: 18, etco2: 50, temp: 37.6, alarmActive: true },
          choices: [
            {
              letter: "A",
              text: "הפחתת נפח הנשמה ל-6 מ\"ל/ק\"ג (330 מ\"ל), הגדלת PEEP ל-12 cmH2O, והעלאת FiO2 ל-70%.",
              nextStep: "ltvv_applied",
              isCorrect: true
            }
          ]
        },
        derecruitment: {
          narrative: `ניתוק מהמנשם ומעבר להנשמה ידנית ללא PEEP גרם לקריסה מיידית של מיליוני נאדיות ריאה (Alveolar derecruitment). הסטורציה צנחה ל-72% והחולה פיתחה ברדיקרדיה משנית להיפוקסיה (קצב 48).
          חזרת מיד להנשמה פולשנית במנשם. עליך לבצע הגנה ריאתית וגיוס נאדיות תקין עם PEEP!`,
          vitals: { hr: 48, sbp: 90, dbp: 50, spo2: 72, rr: 16, etco2: 52, temp: 37.4, alarmActive: true },
          choices: [
            {
              letter: "A",
              text: "ייצוב המטופלת, החזרת PEEP גבוה (12 cmH2O), והתאמת נפח הנשמה נמוך של 6 מ\"ל/ק\"ג.",
              nextStep: "ltvv_applied",
              isCorrect: true
            }
          ]
        },
        ltvv_applied: {
          narrative: `יושם פרוטוקול LTVV בהצלחה. נפח ההנשמה הופחת ל-330 מ"ל, ה-PEEP הועלה ל-12, והחמצן הועלה ל-70%.
          לחץ השיא ירד ל-31 cmH2O, ולחץ הפלאטו התייצב על 28 cmH2O (מתחת לרמת היעד הבטוחה של 30).
          <strong>אולם המטופלת מציגה חוסר תיאום קשה עם המנשם (Ventilator fighting/dyssynchrony).</strong> היא נושמת בניגוד למנשם ויוצרת לחצים גבוהים זמניים. הסטורציה כעת היא 92% ויחס ה-P/F הוא 85 (ARDS קשה מאוד).
          מהו הצעד הבא לשיפור תאימות ההנשמה והחמצון ב-ARDS קשה?`,
          vitals: { hr: 106, sbp: 115, dbp: 70, spo2: 92, rr: 24, etco2: 42, temp: 37.5, alarmActive: true },
          choices: [
            {
              letter: "A",
              text: "מתן בולוס של משתק שרירים (Cisatracurium/Nimbex) והתחלת הזלפה רציפה שלו, במקביל להעברת המטופלת למצב Prone Position (שכיבה על הבטן) למשך 16 שעות לפחות.",
              nextStep: "stabilized_prone",
              isCorrect: true
            },
            {
              letter: "B",
              text: "ביצוע תמרון גיוס ריאתי (Recruitment maneuver) אגרסיבי על ידי החזקת לחץ קבוע של 40 cmH2O למשך 40 שניות.",
              nextStep: "hemodynamic_crash",
              isCorrect: false
            },
            {
              letter: "C",
              text: "העברת המטופלת באופן מיידי לניתוח פיום קנה (Tracheostomy) דחוף במיטה.",
              nextStep: "trach_delay",
              isCorrect: false
            }
          ]
        },
        hemodynamic_crash: {
          narrative: `תמרון גיוס ריאתי אגרסיבי של 40 cmH2O גרם ללחץ תוך-חזי עצום, דבר שחסם את ההחזר הורידי ללב (Reduced preload) והוביל לצניחה מיידית בלחץ הדם (70/35 ממ"כ) וחשש לקרע בריאה. התמרון הופסק מיד.
          עליך להשתמש בשיטות בטוחות יותר לשיפור היחס בין זרימת דם לחמצון (V/Q Matching).`,
          vitals: { hr: 122, sbp: 70, dbp: 35, spo2: 88, rr: 20, etco2: 38, temp: 37.4, alarmActive: true },
          choices: [
            {
              letter: "A",
              text: "טיפול בשיתוק שרירים למניעת מאבק במנשם והעברה למנח Prone Position לשפר חמצון בבטחה.",
              nextStep: "stabilized_prone",
              isCorrect: true
            }
          ]
        },
        trach_delay: {
          narrative: `ביצוע פיום קנה (Tracheostomy) הוא הליך אלקטיבי המיועד לגמילה ארוכת טווח ואינו מטפל בבעיית השורש של כשל נשימתי היפוקסמי חריף ויחס P/F נמוך. המצב ממשיך להתדרדר עקב חוסר גיוס ריאתי אחורי.
          חובה לשפר את גיוס הריאה מיידית!`,
          vitals: { hr: 114, sbp: 108, dbp: 62, spo2: 89, rr: 25, etco2: 40, temp: 37.5, alarmActive: true },
          choices: [
            {
              letter: "A",
              text: "התחלת משתקי שרירים רציפים והעברה לשכיבה על הבטן (Proning) בדחיפות.",
              nextStep: "stabilized_prone",
              isCorrect: true
            }
          ]
        },
        stabilized_prone: {
          narrative: `נפלא! המטופלת שותקה באופן זמני, דבר שפתר לחלוטין את הדיס-סינכרוניזציה במנשם.
          העברת המטופלת למנח Prone (שכיבה על הבטן) פתחה את האזורים האחוריים בריאות (Atelectasis resolvation) ושיפרה דרמטית את התאמת האוורור/זילוח (V/Q mismatch).
          <strong>סימנים חיוניים התייצבו:</strong><br>
          לחץ דם: 115/70 ממ"כ.<br>
          קצב לב: 78 פעימות לדקה.<br>
          סטורציה: 97% תחת תנאי הנשמה מגינים ובטוחים.<br>
          לחצי פלאטו נותרו תקינים (25 cmH2O).<br>
          הצלת את המטופלת מנזק ריאתי חמור ואי-ספיקה נשימתית!`,
          vitals: { hr: 78, sbp: 115, dbp: 70, spo2: 97, rr: 16, etco2: 40, temp: 37.2, alarmActive: false },
          debrief: `<strong>סיכום ודיבייט קליני:</strong><br>
          הטיפול ב-ARDS קשה (Severe ARDS) מבוסס על אסטרטגיה מניעתית של נזק ריאתי משני (VILI):
          <ul>
            <li><strong>הנשמה מגינת ריאות (ARDSNet Protocol):</strong> שימוש בנפחי הנשמה נמוכים (6 מ"ל/ק"ג של משקל גוף אידיאלי - IBW) ושמירה על לחצי פלאטו (Plateau Pressures) מתחת ל-30 cmH2O מונעים מתיחת יתר של נאדיות הריאה (Volutrauma) וקריעה שלהן (Barotrauma).</li>
            <li><strong>שכיבה על הבטן (Prone Positioning):</strong> מומלצת מאוד ל-ARDS קשה (יחס PaO2/FiO2 < 150). המעבר ל-Prone משפר את גיוס הריאה הדורסלית (האחורית), מפחית את הלחץ של הלב על הריאות, ומביא לאוורור אחיד יותר. יש לבצע זאת למשך 12-16 שעות ביום.</li>
            <li><strong>משתקי שרירים (Neuromuscular Blockade):</strong> שימוש רציף ב-Cisatracurium ב-ARDS קשה מונע מאבק במכונה, מפחית דלקת ריאתית ומוריד תמותה בטיפול של 48 השעות הראשונות.</li>
          </ul><br>
          <em>מקורות: ARDS Clinical Trials Network (N Engl J Med 2000) / PROSEVA trial (N Engl J Med 2013).</em>`
        }
      }
    }
  },

  init() {
    this.renderCatalog();
  },

  renderCatalog() {
    const container = document.getElementById('appView');
    if (!container) return;

    // Render Scenarios Catalog selection view
    let cardsHtml = '';
    for (let key in this.data) {
      const item = this.data[key];
      cardsHtml += `
        <div class="card module-card" onclick="ICUScenarios.startScenario('${item.id}')">
          <div class="module-icon"><i class="fa-solid ${item.icon}"></i></div>
          <h3 class="card-title">${item.title}</h3>
          <p style="color:var(--text-secondary); font-size:0.9rem; min-height:60px; margin-bottom:12px;">${item.description}</p>
          <div class="module-stats">
            <span>רמת קושי: <strong>${item.difficulty}</strong></span>
            <span style="color:var(--color-cyan)">התחל סימולציה <i class="fa-solid fa-arrow-left"></i></span>
          </div>
        </div>
      `;
    }

    container.innerHTML = `
      <div class="top-bar">
        <div class="page-title">
          <h1>תרחישים קליניים</h1>
          <p>קבלת החלטות מבוססת הנחיות רפואיות בטיפול נמרץ בזמן אמת</p>
        </div>
      </div>
      <div class="dashboard-grid">
        ${cardsHtml}
      </div>
    `;

    // Ensure top vitals monitor panel is reset to baseline when choosing scenarios
    VitalsState.alarmActive = false;
    if (window.vitalsEngine) window.vitalsEngine.updateNumericDisplay();
  },

  startScenario(id) {
    this.currentScenario = this.data[id];
    this.currentStep = 'start';
    this.renderStep();
  },

  renderStep() {
    const stepData = this.currentScenario.steps[this.currentStep];
    const container = document.getElementById('appView');
    if (!container || !stepData) return;

    // Update global vitals parameters
    if (stepData.vitals) {
      for (let key in stepData.vitals) {
        VitalsState[key] = stepData.vitals[key];
      }
      // Trigger update on ECG graphics and numerical box
      if (window.vitalsEngine) {
        window.vitalsEngine.updateNumericDisplay();
      }
    }

    // Is it a completion step (debrief exists, choices empty)
    const isDebrief = !!stepData.debrief;

    let choicesHtml = '';
    if (!isDebrief && stepData.choices) {
      stepData.choices.forEach((choice, index) => {
        choicesHtml += `
          <button class="choice-btn" onclick="ICUScenarios.makeChoice(${index})">
            <span class="choice-letter">${choice.letter}</span>
            <span class="choice-text">${choice.text}</span>
          </button>
        `;
      });
    }

    let debriefHtml = '';
    if (isDebrief) {
      debriefHtml = `
        <div class="debrief-box card challenge-box pulse-glow-cyan" style="border-right-color: var(--color-green); background: rgba(0, 230, 118, 0.02); margin-top:20px;">
          <h3 style="color: var(--color-green); margin-bottom: 12px; display:flex; align-items:center; gap:8px;">
            <i class="fa-solid fa-circle-check"></i> תרחיש הושלם בהצלחה!
          </h3>
          <div style="line-height:1.6; font-size:0.95rem;">${stepData.debrief}</div>
          <button class="btn btn-primary" style="margin-top: 20px;" onclick="ICUScenarios.renderCatalog()">
            חזרה לקטלוג התרחישים
          </button>
        </div>
      `;
    }

    container.innerHTML = `
      <!-- ICU Active Bedside Vitals Monitor in Scenario -->
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
              <div class="vital-value" id="monitorHR">--</div>
            </div>
            <div class="vital-box red">
              <div class="vital-meta">
                <span class="vital-title">BP</span>
                <span class="vital-limit">120/80</span>
              </div>
              <div class="vital-value" id="monitorBP" style="font-size:1.6rem">--/--</div>
            </div>
            <div class="vital-box cyan">
              <div class="vital-meta">
                <span class="vital-title">SpO₂</span>
                <span class="vital-limit">95-100</span>
              </div>
              <div class="vital-value" id="monitorSpO2">--</div>
            </div>
            <div class="vital-box yellow">
              <div class="vital-meta">
                <span class="vital-title">RR</span>
                <span class="vital-limit">12-20</span>
              </div>
              <div class="vital-value" id="monitorRR">--</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Narrative & Interaction UI -->
      <div class="scenario-layout card">
        <div class="scenario-header">
          <div class="scenario-title">
            <i class="fa-solid ${this.currentScenario.icon} icon-accent" style="color:var(--color-cyan); margin-left:8px;"></i>
            <span>${this.currentScenario.title} - ${this.currentScenario.subtitle}</span>
          </div>
          <button class="btn btn-secondary btn-outline-cyan" onclick="ICUScenarios.renderCatalog()">
            <i class="fa-solid fa-arrow-right"></i> צא מהתרחיש
          </button>
        </div>
        
        <div class="scenario-narrative">
          <p>${stepData.narrative}</p>
        </div>

        <div class="scenario-choices">
          ${choicesHtml}
        </div>

        ${debriefHtml}
      </div>
    `;

    // Re-initialize Vitals Engine canvases for the active scenario view
    if (window.vitalsEngine) {
      window.vitalsEngine.canvases = {
        ecg: document.getElementById('ecgCanvas'),
        spo2: document.getElementById('spo2Canvas'),
        co2: document.getElementById('co2Canvas')
      };
      window.vitalsEngine.init();
      window.vitalsEngine.updateNumericDisplay();
    }
  },

  makeChoice(choiceIndex) {
    const stepData = this.currentScenario.steps[this.currentStep];
    const choice = stepData.choices[choiceIndex];
    
    if (choice.isCorrect) {
      this.currentStep = choice.nextStep;
      this.renderStep();
    } else {
      // Correcting path, we route them but display the intermediate consequence
      this.currentStep = choice.nextStep;
      this.renderStep();
    }
  }
};

window.ICUScenarios = ICUScenarios;
