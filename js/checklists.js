// ICU Interactive Checklists Database & Engine
const ICUChecklists = {
  currentCategory: 'rsi',
  checkedStates: {},
  searchQuery: '',

  data: {
    rsi: {
      title: "הכנת אינטובציה (RSI / Intubation)",
      image: "assets/pdf_images/page_13_img_6_Im73.jpg",
      info: "הכנה בטוחה לאינטובציה וביצוע השראת הרדמה מהירה",
      items: [
        { id: 'rsi_tubes', text: 'טובוסים (ETT) במידות מתאימות (בד"כ 7.5-8) מוכנים, כולל בדיקת בלון (Cuff) וסטילט בפנים', info: 'טובוס' },
        { id: 'rsi_laryn', text: 'לרינגוסקופ (Laryngoscope) או וידאו-לרינגוסקופ תקין עם סוללות ואור עובד', info: 'לרינגוסקופ' },
        { id: 'rsi_gel', text: 'ג\'ל לידוקאין לסיכוך (Lidocaine gel)', info: 'אלחוש' },
        { id: 'rsi_ambu', text: 'מנשם ידני (Ambu bag) עם מסכה מחובר למקור חמצן זורם + מנתב אוויר (Airway)', info: 'הנשמה' },
        { id: 'rsi_cup', text: 'כוסית אינהלציה מוכנה', info: 'אינהלציה' },
        { id: 'rsi_secure', text: 'שרוך לטובוס או מתקן קיבוע ייחודי לטובוס', info: 'קיבוע' },
        { id: 'rsi_vent_setup', text: 'מנשם מחובר ל: צנרת הנשמה, 3 פילטרים, קפנוגרף (EtCO2), וחיישני זרימה (Flow sensors) המכוונים על שיטת הנשמה', info: 'מנשם' },
        { id: 'rsi_cart', text: 'עגלת החייאה בקרבת מקום: דפיברילטור עובד ומגש תרופות החייאה שאובות ומוכנות', info: 'בטיחות' }
      ]
    },
    cvc: {
      title: "הכנסת קטטר מרכזי (CVC Insertion)",
      image: "assets/pdf_images/page_2_img_3_Im11.jpg",
      info: "הכנת ציוד סטרילי להכנסת צנתר ורידי מרכזי תחת הנחיית US",
      items: [
        { id: 'cvc_kit_spec', text: 'ערכת CVC ייעודית (ערכה של CVC 15/20) סטרילית', info: 'צנתר' },
        { id: 'cvc_sterile_pack', text: 'ערכה סטרילית מלאה: חלוק, מסכה, כובע, כפפות סטריליות, גזות, סדינים סטריליים וכלי מתכת', info: 'סטריליות' },
        { id: 'cvc_us_cover', text: 'שרוול סטרילי לכיסוי מתמר אולטרסאונד (US) + ג\'ל סטרילי', info: 'אולטרסאונד' },
        { id: 'cvc_prep', text: 'חיטוי עור סטרילי ChloraPrep (שני מכלים מוכנים)', info: 'סטריליות' },
        { id: 'cvc_local_anes', text: 'הרדמה מקומית: לידוקאין, מחט ורודה לשאיבה, מחט כחולה/ירוקה להזרקה ו-2 מזרקים 10 מ"ל', info: 'אלחוש' },
        { id: 'cvc_saline_flush', text: 'סליין סטרילי 0.9% (NaCl 0.9%) לשטיפה והכנת הפורטים', info: 'שטיפה' },
        { id: 'cvc_needle_seld', text: 'מחט Seldinger ללא שסתום (4-Needless Needles)', info: ' Seldinger' },
        { id: 'cvc_abg_syringe', text: 'מזרק מיוחד לבדיקת גזים (לאישור מיקום ורידי מול עורקי לפי לחצים)', info: 'גזים' },
        { id: 'cvc_sutures', text: 'חוט תפירה 2-0 (או אמצעי קיבוע מועדף אחר)', info: 'קיבוע' },
        { id: 'cvc_tegaderm', text: 'חבישה סטרילית שקופה עם כלורהקסידין Tegaderm CHG Chlorhexidine', info: 'חבישה' }
      ]
    },
    cvc_dressing: {
      title: "החלפת קיבוע CVC (CVC Dressing)",
      image: "assets/pdf_images/page_3_img_4_Im16.jpg",
      info: "פרוטוקול שמירה על אספטיקה בעת החלפת חבישת צנתר מרכזי",
      items: [
        { id: 'cvc_dress_gloves', text: 'כפפות סטריליות לשמירה קפדנית על אספטיקה', info: 'סטריליות' },
        { id: 'cvc_dress_prep', text: 'חומר חיטוי סטרילי ChloraPrep לניקוי יסודי של האזור', info: 'חיטוי' },
        { id: 'cvc_dress_sticker', text: 'מדבקת קיבוע Tegaderm CHG Chlorhexidine מיוחדת', info: 'חבישה' },
        { id: 'cvc_dress_gauze', text: 'גזה סטרילית לניקוי וייבוש העור', info: 'גזה' }
      ]
    },
    aline: {
      title: "הכנסת ליין עורקי (Arterial Line)",
      image: "assets/pdf_images/page_4_img_4_Im20.jpg",
      info: "הכנת ציוד ומערכת לחץ לניטור פולשני של לחץ דם",
      items: [
        { id: 'aline_kits', text: 'ערכת קטטר עורקי (Arterial Catheter Kit) או 2 ונפלונים במידה מתאימה', info: 'קטטר' },
        { id: 'aline_secures', text: '2 קיבועים ייעודיים לקטטר עורקי', info: 'קיבוע' },
        { id: 'aline_stickers', text: 'שתי מדבקות זיהוי אדומות של AL (Arterial Line)', info: 'סימון' },
        { id: 'aline_saline', text: 'שקית סליין NaCl 0.9% בנפח 500 מ"ל', info: 'נוזלים' },
        { id: 'aline_set', text: 'סט צנרת ומד לחץ עורקי (AL Set) ייעודי', info: 'צנרת' },
        { id: 'aline_bag_press', text: 'שקית/מנג\'טה לעירוי בלחץ (Pressure bag) מנופחת ל-300 mmHg', info: 'לחץ' },
        { id: 'aline_bag_vol', text: 'שקית נוזלים בנפח 1000 מ"ל', info: 'נוזלים' },
        { id: 'aline_tenso', text: 'חבישת Tensoplast לקיבוע יציב של הקטטר למניעת תזוזה', info: 'קיבוע' }
      ]
    },
    hfnc: {
      title: "חמצן בזרימה גבוהה (HFNC Setup)",
      image: "assets/pdf_images/page_5_img_5_Im25.jpg",
      info: "הכנת מכשיר High-Flow Nasal Cannula לטיפול באי ספיקה נשימתית",
      items: [
        { id: 'hfnc_device', text: 'מכשיר חמצן בזרימה גבוהה מותקן בצורה בטוחה על עמוד ייעודי', info: 'מכשיר' },
        { id: 'hfnc_water', text: 'שקית מים סטריליים ייעודית למערכת הלחות של המכשיר', info: 'נוזלים' },
        { id: 'hfnc_cassette', text: 'קסטת לחלוח (Water chamber/Cassette) מורכבת במכשיר', info: 'קסטה' },
        { id: 'hfnc_tubing', text: 'צנרת נשימה ייעודית ומחוממת של המערכת', info: 'צנרת' },
        { id: 'hfnc_prongs', text: 'משקפי חמצן מיוחדים (High-flow nasal prongs) במידה המתאימה למטופל', info: 'משקפיים' }
      ]
    },
    trach: {
      title: "ציוד לטרכאוסטומיה (Tracheostomy Prep)",
      image: "assets/pdf_images/page_6_img_3_Im30.png",
      info: "הכנת עגלת טיפולים לביצוע פיום קנה במיטת המטופל בטיפול נמרץ",
      items: [
        { id: 'trach_cannula', text: 'ערכת קנולה לטרכאוסטומיה במידה המתאימה (Tracheostomy tube kit)', info: 'קנולה' },
        { id: 'trach_cvc_kit', text: 'ערכת CVC סטרילית (לצורך כלים סטריליים, חלוק וסדינים)', info: 'סטריליות' },
        { id: 'trach_chloraprep', text: 'חומר חיטוי עור סטרילי ChloraPrep', info: 'חיטוי' },
        { id: 'trach_suction', text: 'מערכת סקשיין סגורה מיוחדת לטרכאוסטום (Closed suction system)', info: 'סקשיין' },
        { id: 'trach_sutures', text: '2 חוטי תפירה 2-0 לקיבוע הקנולה לעור', info: 'תפרים' },
        { id: 'trach_ambu', text: 'מנשם ידני (Ambu bag) עם מסכה מחובר למקור חמצן פעיל', info: 'הנשמה' },
        { id: 'trach_reintub', text: 'ערכת אינטובציה/רה-אינטובציה מוכנה לחירום (טובוס, לרינגוסקופ, מנדרין/Stylet)', info: 'חירום' },
        { id: 'trach_tie', text: 'שרוך ייעודי לקנולה או פלטת קיבוע (Trach collar plate)', info: 'קיבוע' }
      ]
    },
    tpn: {
      title: "הכנת TPN (TPN Prep)",
      image: "assets/pdf_images/page_7_img_5_Im38.jpg",
      info: "הכנה אספטית של הזנה תוך-ורידית ומסננים",
      items: [
        { id: 'tpn_surface', text: 'חיטוי שולחן העבודה ופריסת משטח סטרילי נקי', info: 'סטריליות' },
        { id: 'tpn_gloves_1', text: 'כפפות סטריליות למכין התמיסה', info: 'סטריליות' },
        { id: 'tpn_gauzes', text: '2 אריזות גזה סטרילית 10*10 סנטימטר', info: 'גזה' },
        { id: 'tpn_tubing', text: 'סט צנרת ייעודי למשאבת Mindray (Mindray pump tubing set)', info: 'צנרת' },
        { id: 'tpn_filter', text: 'פילטר TPN ייעודי לחיבור סמוך למיטת המטופל', info: 'פילטר' },
        { id: 'tpn_patient_prep', text: 'למיטת המטופל: פריסת משטח סטרילי, כפפות סטריליות וגזות 10*10 נוספות לחיבור לליין', info: 'חיבור' }
      ]
    },
    ct_transfer: {
      title: "ציוד העברה ל-CT (CT Transfer)",
      image: "assets/pdf_images/page_8_img_3_Im42.jpg",
      info: "רשימת בדיקה קריטית לפני העברה בטוחה של מטופל מונשם לדימות",
      items: [
        { id: 'ct_vent', text: 'מנשם העברה נייד (Transport ventilator) מכוון, תקין ופועל', info: 'מנשם' },
        { id: 'ct_ambu', text: 'מנשם ידני (Ambu bag) + מסכה + מנתב אוויר (Airway)', info: 'הנשמה' },
        { id: 'ct_tubing', text: 'צנרת הנשמה מחוברת למנשם ההעברה', info: 'צנרת' },
        { id: 'ct_etco2', text: 'קפנוגרף נייד (EtCO2 Detector/Capnograph) מחובר ומציג גל', info: 'ניטור' },
        { id: 'ct_filters', text: '2 פילטרים מורכבים במעגל ההנשמה', info: 'פילטר' },
        { id: 'ct_emergency_bag', text: 'ערכת אינטובציה מלאה + מגש תרופות החייאה עטופים בשקית אטומה', info: 'חירום' },
        { id: 'ct_oxygen', text: '2 בלוני חמצן ניידים מלאים ובדוקים', info: 'חמצן' },
        { id: 'ct_monitor', text: 'מוניטור נייד מחובר לחולה עם סוללות טעונות במלואן', info: 'מוניטור' },
        { id: 'ct_aline_setup', text: 'סט Y ומד לחץ עורקי (AL Transducer) עם נוזלים ומנג\'טת לחץ', info: 'ניטור' },
        { id: 'ct_vaso', text: 'במידה והמטופל מחובר ל-Noradrenaline או Vasopressin, וידוא מזרקים מלאים ומחוברים למשאבות ניידות', info: 'תרופות' }
      ]
    },
    ward_transfer: {
      title: "העברת מטופל למחלקה (Ward Transfer)",
      image: "assets/pdf_images/page_9_img_4_Im46.jpg",
      info: "וידוא מוכנות החולה ומסמכים להעברה למחלקה פנימית/כירורגית",
      items: [
        { id: 'ward_tr_vent', text: 'מנשם העברה נייד + אמבו + מסכה + Airway (במידה ומונשם)', info: 'הנשמה' },
        { id: 'ward_tr_ox_prongs', text: 'משקפי חמצן פריפריים (אם המטופל נושם עצמונית)', info: 'חמצן' },
        { id: 'ward_tr_em_bag', text: 'ערכת אינטובציה מלאה + מגש תרופות להחייאה לחירום', info: 'חירום' },
        { id: 'ward_tr_ox_cyl', text: '2 בלוני חמצן מלאים מורכבים במיטת המעבר', info: 'חמצן' },
        { id: 'ward_tr_monitor', text: 'מוניטור נייד מחובר ופועל', info: 'מוניטור' },
        { id: 'ward_tr_aline_check', text: 'ליין עורקי (AL): במידה והמחלקה הקולטת אינה מנטרת לחץ עורקי, יש להוציא את הקטטר העורקי למטופל לפני ההעברה וללחוץ מקומית', info: 'ליין עורקי' },
        { id: 'ward_tr_chest_drain', text: 'נקז חזה (Thoracic drain): להצטייד במלחציים (Clamp) כדי למנוע כניסת אוויר במקרה של ניתוק המערכת', info: 'נקז חזה' },
        { id: 'ward_tr_urine', text: 'שקית שתן מרוקנת ומקובעת מתחת לגובה המיטה', info: 'קתטר' },
        { id: 'ward_tr_vaso_update', text: 'תרופות וזואקטיביות (Noradrenaline / Vasopressin): לעדכן מראש את המחלקה הקולטת על המינונים הנדרשים להכנה', info: 'תרופות' },
        { id: 'ward_tr_docs', text: 'וידוא מסמכים: תיק מטופל מלא, מכתב שחרור רפואי וסיעודי, ומכתב ידון/מעבר חתום', info: 'תיעוד' }
      ]
    },
    ward_admission: {
      title: "קליטת מטופל למחלקה (ICU Admission)",
      image: "assets/pdf_images/page_10_img_3_Im55.jpg",
      info: "הכנת עמדת הטיפול בטיפול נמרץ לקבלת מטופל חדש",
      items: [
        { id: 'adm_docs', text: 'ניירת ומדבקות מטופל מוכנות (דף מדדים גדול, פרוטוקול מעקב סוכר מודפס)', info: 'תיעוד' },
        { id: 'adm_y_set', text: 'סט Y עם סליין 0.9% מחובר לצנרת מאריכה עם ברז מוכן סמוך למיטה', info: 'צנרת' },
        { id: 'adm_ivacs', text: 'משאבות נפחיות (I-Vac) משוריינות בריפודי המיטה ומחוברות לחשמל', info: 'משאבות' },
        { id: 'adm_ambu', text: 'מנשם ידני (Ambu bag) עם מסכה מונח סמוך למיטה', info: 'הנשמה' },
        { id: 'adm_sed_drugs', text: 'תרופות הרדמה וסדציה שהיו למטופל מוכנות מראש במזרקים', info: 'תרופות' },
        { id: 'adm_urine_bag', text: 'מד תפוקת שתן (אורינומטר) מותקן + אמצעי קיבוע לקטטר שתן', info: 'קתטר' },
        { id: 'adm_ventilator', text: 'מנשם ICU מורכב ופועל כולל: צנרת הנשמה, פילטר, כוסית אינהלציה, וחיישן פחמן דו-חמצני (EtCO2)', info: 'מנשם' },
        { id: 'adm_closed_suction', text: 'מערכת סקשיין סגורה מותקנת ומחוברת (מותאמת לטובוס או לטרכאוסטום)', info: 'סקשיין' },
        { id: 'adm_ett_tape', text: 'קיבוע טובוס ייחודי (ETT holder/tape) מוכן', info: 'קיבוע' },
        { id: 'adm_drawers', text: 'מגירות טיפולים מלאות: סליינים, מזרקים (5 ו-10 מ"ל), מחטים ורודות, מים סטריליים, מטוסי פה, כוס, סטיקסים לבדיקות רופא, מזרקים להאכלה/זונדה', info: 'ציוד' },
        { id: 'adm_wipes', text: 'מטושים וסמרטוטים לחיטוי המיטה והסביבה + טפסים מוכנים לתרביות', info: 'חיטוי' },
        { id: 'adm_gube_pump', text: 'משאבת הזנה (I-Vac לזונדה) + שקיות כלכלה מתאימות בהישג יד', info: 'הזנה' }
      ]
    },
    crrt_conn: {
      title: "חיבור המופילטרציה (CRRT Connection)",
      image: "assets/pdf_images/page_11_img_3_Im58.jpg",
      info: "הכנת המערכת לחיבור טיפול דיאליזה רציף (CRRT) לאחר הכנסת שיין דיאליזה",
      items: [
        { id: 'crrt_machine', text: 'מכונת המופילטרציה (Prisma Machine) מחוברת לחשמל ודלוקה', info: 'מכונה' },
        { id: 'crrt_hemo_set', text: 'סט צנרת ופילטר להמופילטרציה (Hemofiltration Set)', info: 'צנרת' },
        { id: 'crrt_effluent', text: 'סט שקיות איסוף נוזלים (Auto Effluent Set)', info: 'צנרת' },
        { id: 'crrt_thermax', text: 'מכשיר חימום נוזלים (ThermaX/טרמקס) מחובר ומורכב על המכונה', info: 'חימום' },
        { id: 'crrt_calcium_ext', text: 'מאריך ייעודי להזרקת סידן (Calcium extension line)', info: 'צנרת' },
        { id: 'crrt_calcium_syr', text: '4 מזרקים של 50 מ"ל שאובים בסידן (Calcium) המכילים אמפולות של 1gr pure', info: 'תרופות' },
        { id: 'crrt_salines', text: '2 שקיות נוזלים סליין 0.9% בנפח 1 ליטר (אחת מהולה ב-Heparin 5000 units לשטיפת המערכת)', info: 'נוזלים' },
        { id: 'crrt_trolley', text: 'עגלת ציוד ייעודית להמופילטרציה מלאה בכל חלקי החילוף והמתכלים', info: 'ציוד' },
        { id: 'crrt_rx', text: 'מרשם חתום ע"י רופא המפרט קצבים, מינוני הפרין וסיטרט', info: 'אישור' },
        { id: 'crrt_labels', text: 'מדבקת מטופל ודף פרוטוקול רישום המופילטרציה בתיק', info: 'תיעוד' },
        { id: 'crrt_dialysates', text: 'שקיות תמיסות דיאליזה ייעודיות: Hemosol B0, Citrate 18, Prism0cal', info: 'תמיסות' }
      ]
    },
    crrt_flush: {
      title: "שטיפת המופילטרציה (CRRT Flushing)",
      image: "assets/pdf_images/page_12_img_3_Im66.png",
      info: "הכנת שקיות נוזלים לשטיפת מכונת ההמופילטרציה",
      items: [
        { id: 'crrt_fl_heparin', text: 'שקית מספר 1 - סליין 0.9% מהול ב-Heparin לשטיפת הצנרת והפילטר', info: 'שקית 1' },
        { id: 'crrt_fl_pure', text: 'שקית מספר 2 - סליין 0.9% נקי לשטיפה משנית ואיזון נוזלים', info: 'שקית 2' }
      ]
    },
    lp: {
      title: "ניקור מותני (Lumbar Puncture - LP)",
      image: "assets/pdf_images/page_14_img_5_Im77.jpg",
      info: "הכנת הציוד הנדרש לניקור מותני אבחנתי או טיפולי",
      items: [
        { id: 'lp_kit', text: 'ערכת LP (Lumbar Puncture) סטרילית', info: 'ערכה' },
        { id: 'lp_needle', text: 'מחט ספינלית ייעודית (Spinal needle) במידה מתאימה', info: 'מחט' },
        { id: 'lp_disinfect', text: 'נוזל חיטוי עור סטרילי ChloraPrep', info: 'חיטוי' },
        { id: 'lp_gloves', text: 'כפפות סטריליות למבצע הפעולה', info: 'סטריליות' },
        { id: 'lp_tubes', text: '5 מבחנות סטריליות לאיסוף נוזל ה-CSF ומספורן מ-1 עד 5', info: 'מבחנות' },
        { id: 'lp_local_anes', text: 'חומר אלחוש מקומי: לידוקאין (Lidocaine)', info: 'אלחוש' },
        { id: 'lp_needles_syr', text: '2 מחטים לשאיבה והזרקה + מזרק 10 מ"ל להזרקת האלחוש', info: 'ציוד' }
      ]
    },
    rocket_drain: {
      title: "הכנסת נקז חזה Rocket (Rocket Chest Drain)",
      image: "assets/pdf_images/page_15_img_1_Im81.jp2.png",
      info: "הכנת ציוד להכנסת נקז פלאורלי Rocket לניקוז נוזל/אוויר",
      items: [
        { id: 'rock_cvc_kit', text: 'ערכה סטרילית של CVC (חלוק, סדינים וגזות)', info: 'סטריליות' },
        { id: 'rock_drain_set', text: 'סט של נקז Rocket (Rocket pleural drain set)', info: 'נקז' },
        { id: 'rock_angio', text: 'ליין אנגיוקאת (Angiocath)', info: 'צנרת' },
        { id: 'rock_chlora', text: 'נוזל חיטוי עור ChloraPrep', info: 'חיטוי' },
        { id: 'rock_gloves', text: 'כפפות סטריליות למבצע', info: 'סטריליות' },
        { id: 'rock_anes', text: 'אלחוש מקומי: Lidocaine, מזרק 10 מ"ל, מחט ורודה ומחט כחולה', info: 'אלחוש' },
        { id: 'rock_tubes', text: 'מבחנות סטריליות לאיסוף נוזל פלורלי (לפי דרישת הרופא)', info: 'מבחנות' },
        { id: 'rock_secure', text: 'חבישת קיבוע ייעודית + גזה ספוגה בוזלין (Vaseline gauze) למניעת דלף אוויר', info: 'קיבוע' },
        { id: 'rock_abg_test', text: 'מזרק לבדיקת גזים (גזים עורקיים/ורידיים) למדידת pH של הנוזל (להבחנה בין אקסודט לטרנסודט)', info: 'בדיקה' }
      ]
    },
    set_change: {
      title: "החלפת סטים ו-Needless (Needless Change)",
      image: "assets/pdf_images/page_16_img_8_Im90.jpg",
      info: "שמירה על ליין פתוח ללא זיהומים בעת החלפת מחבריNeedless וסטים",
      items: [
        { id: 'set_ch_y_set', text: 'סט Y מחובר לבקבוק NaCl 0.9% ושטוף מראש מבועות אוויר', info: 'צנרת' },
        { id: 'set_ch_needless', text: 'Needless (שסתומים חד-כיווניים) סטריליים לכל הפורטים', info: 'מחברים' },
        { id: 'set_ch_valves', text: 'ברזיות תלת-דרך (3-way stopcock) ומאריכים לפושים מהירים', info: 'ברזים' },
        { id: 'set_ch_syringe', text: 'מזרקים (Syringe) מחוברים לקצה מאריך נידלס', info: 'מזרקים' },
        { id: 'set_ch_lumens', text: 'Needless מורכבים לכל הלומנים הפעילים של המטופל', info: 'חיבור' },
        { id: 'set_ch_alcohol', text: 'גזות ספוגות באלכוהול 70% לחיטוי קפדני של החיבורים לפני פתיחה', info: 'חיטוי' },
        { id: 'set_ch_ivacs', text: 'מזרקי תרופות מחוברים לצנרת ייעודית למשאבות מזרק (I-Vac)', info: 'משאבות' }
      ]
    }
  },

  init() {
    this.renderLayout();
    this.renderCategories();
    this.renderChecklist();
    this.setupListeners();
  },

  renderLayout() {
    const container = document.getElementById('appView');
    if (!container) return;

    // Render the new three-column layout in the target SPA view
    container.innerHTML = `
      <div class="checklist-layout-grid">
        
        <!-- Column 1: Sidebar list of procedures with search -->
        <div class="checklist-sidebar card">
          <div class="card-title" style="margin-bottom:8px;">
            <i class="fa-solid fa-list-check" style="color:var(--color-cyan)"></i> פרוצדורות (15)
          </div>
          
          <div class="checklist-search-box">
            <i class="fa-solid fa-magnifying-glass"></i>
            <input type="text" id="checklistSearchInput" class="checklist-search-input" placeholder="חיפוש פרוצדורה..." value="${this.searchQuery}">
          </div>
          
          <ul class="checklist-categories-list" id="checklistCategoriesContainer">
            <!-- Rendered dynamically -->
          </ul>
        </div>

        <!-- Column 2: Active checklist container -->
        <div class="checklist-main">
          <div class="card">
            <div class="card-title" id="checklistTitle" style="font-size:1.3rem;">צ'קליסט פעולה</div>
            
            <div class="checklist-progress-bar">
              <div class="checklist-progress-fill" id="checklistProgressFill"></div>
            </div>
            
            <div id="checklistProgressText" style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:16px;">
              הושלמו 0 מתוך 0 שלבים (0%)
            </div>

            <div class="checklist-container" id="checklistItemsContainer">
              <!-- Checklist items rendered dynamically -->
            </div>
          </div>
        </div>

        <!-- Column 3: Procedural image and safety info -->
        <div class="checklist-image-card">
          
          <!-- Slide Image display card -->
          <div class="card">
            <div class="card-title" style="font-size:1rem; margin-bottom:12px;">
              <i class="fa-solid fa-circle-info" style="color:var(--color-blue)"></i> ציוד והכנה מתוך האוגדן
            </div>
            
            <div class="checklist-image-container" id="checklistImageContainer">
              <!-- Image element rendered dynamically -->
            </div>
          </div>
          
          <div class="card">
            <div class="card-title" style="font-size:1rem; margin-bottom:12px;">
              <i class="fa-solid fa-shield" style="color:var(--color-green)"></i> פרוטוקול בטיחות
            </div>
            <p style="font-size:0.8rem; line-height:1.5; color:var(--text-secondary); margin-bottom:16px;">
              הכנת הציוד המושלמת בפרוצדורות מורכבות בטיפול נמרץ מפחיתה זיהומים נרכשים (כמו CLABSI) וממקסמת את בטיחות המטופל.
              ודא שכל פריט סומן רק לאחר אימות פיזי שלו בעמדה.
            </p>
            <button class="btn btn-danger" id="checklistResetBtn" style="width:100%"><i class="fa-solid fa-rotate-left"></i> אפס רשימת תיוג</button>
          </div>

          <!-- Success Alert -->
          <div id="checklistCompleteAlert" style="display:none;"></div>
        </div>

      </div>
    `;
  },

  renderCategories() {
    const container = document.getElementById('checklistCategoriesContainer');
    if (!container) return;

    container.innerHTML = '';
    
    // Filter and display categories
    const keys = Object.keys(this.data);
    let matchedCount = 0;

    keys.forEach(key => {
      const cat = this.data[key];
      const matchSearch = cat.title.toLowerCase().includes(this.searchQuery.toLowerCase()) || 
                          cat.info.toLowerCase().includes(this.searchQuery.toLowerCase());
      
      if (matchSearch) {
        matchedCount++;
        const itemNode = document.createElement('li');
        itemNode.className = `checklist-category-item ${this.currentCategory === key ? 'active' : ''}`;
        itemNode.dataset.category = key;
        
        // Icon matching
        let icon = "fa-chevron-left";
        if (key === 'rsi') icon = "fa-wind";
        else if (key.startsWith('cvc')) icon = "fa-heart-pulse";
        else if (key === 'aline') icon = "fa-droplet";
        else if (key === 'hfnc') icon = "fa-circle-dot";
        else if (key === 'trach') icon = "fa-circle-chevron-down";
        else if (key === 'tpn') icon = "fa-prescription-bottle-medical";
        else if (key.endsWith('transfer')) icon = "fa-truck-medical";
        else if (key === 'ward_admission') icon = "fa-hospital-user";
        else if (key.startsWith('crrt')) icon = "fa-fill-drip";
        else if (key === 'lp') icon = "fa-kit-medical";
        else if (key === 'rocket_drain') icon = "fa-lungs";
        else if (key === 'set_change') icon = "fa-recycle";

        itemNode.innerHTML = `
          <div style="display:flex; align-items:center; gap:10px;">
            <i class="fa-solid ${icon}"></i>
            <div style="text-align:right;">
              <div style="font-weight:600;">${cat.title}</div>
              <div style="font-size:0.7rem; opacity:0.7; max-width:180px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${cat.info}</div>
            </div>
          </div>
          <i class="fa-solid fa-chevron-left" style="font-size:0.75rem;"></i>
        `;

        itemNode.addEventListener('click', () => {
          this.currentCategory = key;
          this.renderCategories();
          this.renderChecklist();
        });

        container.appendChild(itemNode);
      }
    });

    if (matchedCount === 0) {
      container.innerHTML = `
        <div style="font-size:0.85rem; color:var(--text-secondary); text-align:center; padding:24px;">
          אין תוצאות מתאימות לחיפוש
        </div>
      `;
    }
  },

  renderChecklist() {
    const listData = this.data[this.currentCategory];
    const container = document.getElementById('checklistItemsContainer');
    const titleEl = document.getElementById('checklistTitle');
    const imageContainer = document.getElementById('checklistImageContainer');
    
    if (!listData || !container || !titleEl) return;

    titleEl.textContent = listData.title;
    container.innerHTML = '';

    // Render items list
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

    // Render procedural image
    if (imageContainer) {
      if (listData.image) {
        imageContainer.innerHTML = `
          <img src="${listData.image}" alt="${listData.title}" onerror="ICUChecklists.handleImageError(this)">
        `;
      } else {
        imageContainer.innerHTML = `
          <div class="checklist-image-placeholder">
            <i class="fa-solid fa-image"></i>
            <span>אין תמונה מוגדרת לפרוצדורה זו</span>
          </div>
        `;
      }
    }

    this.updateProgress();
  },

  handleImageError(img) {
    // Falls back to nice placeholder if image file is missing or blocked
    const container = img.parentElement;
    if (container) {
      container.innerHTML = `
        <div class="checklist-image-placeholder">
          <i class="fa-solid fa-triangle-exclamation" style="color:var(--color-yellow)"></i>
          <span>התמונה לא נטענה (${img.src.split('/').pop()})</span>
        </div>
      `;
    }
  },

  toggleItem(id) {
    this.checkedStates[id] = !this.checkedStates[id];
    
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
        completeAlert.style.marginTop = '12px';
        completeAlert.innerHTML = `
          <div style="display:flex; align-items:center; gap:12px; color:var(--color-green)">
            <i class="fa-solid fa-shield-halved" style="font-size:1.5rem"></i>
            <div>
              <strong style="font-size:1.02rem">כל הציוד והשלבים אומתו!</strong><br>
              <span style="font-size:0.8rem">הפרוצדורה מוכנה לביצוע בטוח. וידאת את כל מרכיבי הבטיחות, הציוד והסטריליות הנדרשים לפי אוגדן טיפול נמרץ.</span>
            </div>
          </div>
        `;
      } else {
        completeAlert.style.display = 'none';
      }
    }
  },

  setupListeners() {
    // 1. Search Bar listener
    const searchInput = document.getElementById('checklistSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        this.renderCategories();
      });
    }

    // 2. Reset Button listener
    document.getElementById('checklistResetBtn')?.addEventListener('click', () => {
      const listData = this.data[this.currentCategory];
      if (listData) {
        listData.items.forEach(item => {
          this.checkedStates[item.id] = false;
        });
        this.renderChecklist();
      }
    });
  }
};

window.ICUChecklists = ICUChecklists;
