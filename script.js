// ====== تكوين عام ومصادر البيانات ======
const SHEETDB_API = "https://sheetdb.io/api/v1/pp3tkazlfqhvu"; // <--- API الذي زودتني به
// قائمة الحالات والإجراءات (يمكن تعديلها أو إضافة حالات من API لاحقًا)
const caseStepsData = {
  "نزيف": [
    "حاول إيقاف النزيف بالضغط المباشر على الجرح.",
    "ارفَع الطرف المصاب إذا أمكن لتقليل التدفق الدموي.",
    "إذا كان النزيف شديدًا ضع ضمادة محكمة واستدعِ الطوارئ."
  ],
  "كسر": [
    "ثبّت العضو المصاب بجبيرة أو أي وسيلة تثبيت مناسبة.",
    "تجنب تحريك الجزء المصاب لتفادي تفاقم الإصابة.",
    "اتصل بالطوارئ أو انقل المصاب إلى أقرب مركز طبي."
  ],
  "انخفاض السكر": [
    "أعط المصاب مشروبًا سكريًا سريع الامتصاص أو قطعة حلوى إن كان واعياً.",
    "اطلب فحص مستوى السكر وراقب الوعي.",
    "إذا فقد الوعي ضع المصاب في وضعية التعافي واستدعي الطوارئ."
  ]
};

// عناصر DOM رئيسية
const emergencyBtn = document.getElementById("emergencyBtn");
const casesList = document.getElementById("casesList");
const stepsSection = document.getElementById("stepsSection");
const caseTitle = document.getElementById("caseTitle");
const stepsList = document.getElementById("stepsList");
const playBtn = document.getElementById("playBtn");
const stopBtn = document.getElementById("stopBtn");
const backBtn = document.getElementById("backBtn");
const micStatus = document.getElementById("micStatus");
const registerForm = document.getElementById("registerForm");
const registerStatus = document.getElementById("registerStatus");
const paramedicsList = document.getElementById("paramedicsList");

// متغيرات صوت
let lastUtterance = null;
let synth = window.speechSynthesis;
let recognition = null;
let currentCase = null;

// ====== واجهة التبويبات ======
function showTab(id){
  document.querySelectorAll(".tab").forEach(t => t.classList.add("hidden"));
  const el = document.getElementById(id);
  if(el) el.classList.remove("hidden");
  // إظهار قائمة المسعفين إذا انتقلنا للتبويب
  if(id === 'paramedics') loadParamedics();
}

// ====== تهيئة عرض الحالات ======
function setupCasesList(){
  casesList.innerHTML = "";
  Object.keys(caseStepsData).forEach(name => {
    const div = document.createElement("div");
    div.className = "case-item";
    div.innerHTML = `<span>${name}</span><button onclick="showSteps('${name}')">عرض</button>`;
    casesList.appendChild(div);
  });
}
setupCasesList();

// ====== دوال العرض والتشغيل الصوتي كما في الصورة ======
function showSteps(name){
  currentCase = name;
  caseTitle.textContent = name;
  stepsList.innerHTML = "";
  (caseStepsData[name] || []).forEach((s) => {
    const li = document.createElement("li");
    li.textContent = s;
    stepsList.appendChild(li);
  });
  stepsSection.classList.remove("hidden");
}

// تفعيل قراءة الإرشادات صوتياً
function speakSteps(name = null){
  const nm = name || currentCase;
  if(!nm || !caseStepsData[nm]) return;
  const steps = caseStepsData[nm];
  const text = `${nm}. ${steps.join("، ")}`;
  stopSpeech(); // أوقف أي كلام سابق
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'ar-SA';
  u.rate = 1;
  u.onend = () => { /* يمكن إضافة متابعة بعد الانتهاء */ };
  synth.speak(u);
  lastUtterance = u;
  currentCase = nm;
  showSteps(nm);
}

// إيقاف الكلام
function stopSpeech(){
  if(synth.speaking) synth.cancel();
}

// إعادة تشغيل آخر كلام
function playLast(){
  if(lastUtterance){
    // إعادة إنشاء قول جديد بنفس النص (المتصفحات لا تسمح بإعادة تشغيل نفس الكائن غالبًا)
    const u = new SpeechSynthesisUtterance(lastUtterance.text || lastUtterance._text || '');
    u.lang = lastUtterance.lang || 'ar-SA';
    synth.speak(u);
    lastUtterance = u;
  }
}

// حدث الرجوع
backBtn.addEventListener("click", () => {
  stepsSection.classList.add("hidden");
  currentCase = null;
});

// أزرار التحكم بالصوت
playBtn.addEventListener("click", () => playLast());
stopBtn.addEventListener("click", () => stopSpeech());

// عند الضغط على زر الطوارئ: نبدأ الاستماع فورًا ونعرض نص طوارئ صوتي مختصر
emergencyBtn.addEventListener("click", () => {
  // نُعلم المستخدم وننطق جملة طوارئ عامة
  const emergencyText = "تم تفعيل وضع الطوارئ. إذا كنت تتكلم قل اسم الحالة، أو انتظر المساعدة.";
  stopSpeech();
  const u = new SpeechSynthesisUtterance(emergencyText);
  u.lang = 'ar-SA';
  synth.speak(u);
  lastUtterance = u;
  // شغّل الاستماع لضمان التقاط الكلام بعد الضغط
  startRecognition(true);
});

// ====== تهيئة/إدارة Web Speech Recognition ======
function initRecognition(){
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if(!SR){
    micStatus.textContent = "🔴 التعرف الصوتي غير مدعوم في متصفحك";
    return;
  }
  recognition = new SR();
  recognition.lang = "ar-SA"; // اللغة العربية - يمكن تغييره
  recognition.interimResults = false;
  recognition.continuous = true; // يستمر بالاستماع تلقائيًا
  recognition.maxAlternatives = 1;

  recognition.onstart = () => {
    micStatus.textContent = "🟢 الميكروفون متصل - أتكلم الآن";
  };

  recognition.onerror = (e) => {
    console.warn("Recognition error", e);
    micStatus.textContent = "🔴 فشل التعرف الصوتي (تحقق من الإذن)";
  };

  recognition.onend = () => {
    micStatus.textContent = "🟠 تم إيقاف الاستماع مؤقتاً، يحاول إعادة الاتصال...";
    // نُعيد التشغيل تلقائيًا للحفاظ على استجابة الصوت (الحساس للمواقع)
    setTimeout(() => {
      try { recognition.start(); } catch(e){ /* بعض المتصفحات تمنع البدء التلقائي */ }
    }, 500);
  };

  // **الدالة المطلوبة: recognition.onresult**
  recognition.onresult = (event) => {
    // نستخرج النص المُكتشف
    const results = event.results;
    const transcript = results[results.length - 1][0].transcript.trim();
    console.log("نتيجة التعرف:", transcript);
    micStatus.textContent = `🎤 استمع: "${transcript}"`;

    // التعرّف على اسم الحالة - نبحث عن الكلمات المفتاحية
    // نفك الحروف الزائدة ونبحث عن الحالات في caseStepsData
    const textLower = transcript.toLowerCase();

    // البحث البسيط عن أسماء الحالات (يمكن توسيعه)
    for(const name of Object.keys(caseStepsData)){
      const key = name.toLowerCase();
      if(textLower.includes(key)){
        // تم التعرف على حالة -> عرض وقراءة الإرشادات فورًا
        showSteps(name);
        speakSteps(name);
        return;
      }
    }

    // إذا لم تتطابق مع اسم حالة: نبحث كلمات محتملة (مثل "طوارئ" أو "مساعدة")
    if(/طوارئ|مساعدة|ساعدني|اسعف|كيفية/i.test(textLower)){
      const helpText = "تفضل بذكر اسم الحالة من الحالات المتاحة: نزيف، كسر، انخفاض السكر.";
      const u = new SpeechSynthesisUtterance(helpText);
      u.lang = 'ar-SA';
      stopSpeech();
      synth.speak(u);
      lastUtterance = u;
    }
  };
}

// يبدأ الاستماع (forceStart=true يحاول البدء فورًا)
function startRecognition(forceStart = false){
  if(!recognition) initRecognition();
  if(!recognition) return;
  try {
    recognition.start();
    if(forceStart) {
      // بعض المتصفحات تحتاج محاولة ثانية
      setTimeout(()=>{ try{ recognition.start(); }catch(e){} }, 300);
    }
  } catch(e){
    console.warn("startRecognition error", e);
  }
}
initRecognition();
startRecognition(); // يبدأ الاستماع تلقائيًا عند فتح الصفحة

// ====== تسجيل البيانات فورًا في SheetDB عند ارسال الفورم ======
registerForm.addEventListener("submit", async (ev) => {
  ev.preventDefault();
  const formData = new FormData(registerForm);
  // تحويل الحقول إلى كائن يتناسب مع SheetDB — نستخدم أسماء أعمدة إنجليزية بسيطة
  const payload = {
    data: {}
  };
  // map fields (استخدم أسماء الحقول التي تريدها في الجدول)
  payload.data.name = formData.get("name") || "";
  payload.data.medical_history = formData.get("medical_history") || "";
  payload.data.phone = formData.get("phone") || "";
  payload.data.emergency_agency = formData.get("emergency_agency") || "";
  payload.data.license_type = formData.get("license_type") || "";
  payload.data.address = formData.get("address") || "";

  registerStatus.textContent = "جارٍ الإرسال...";
  try {
    const resp = await fetch(SHEETDB_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if(resp.ok){
      registerStatus.textContent = "تم التسجيل بنجاح ✅";
      registerForm.reset();
      // بعد التسجيل نعرض المسعفين (تحديث القائمة)
      loadParamedics();
    } else {
      const txt = await resp.text();
      registerStatus.textContent = "خطأ في التسجيل: " + resp.status;
      console.error("SheetDB resp:", resp.status, txt);
    }
  } catch(err){
    console.error(err);
    registerStatus.textContent = "فشل الاتصال بقاعدة البيانات.";
  }
});

// ====== تحميل بيانات المسعفين (مؤقت: نقرأ الورقة كلها من الـ API) ======
async function loadParamedics(){
  paramedicsList.innerHTML = "جارٍ جلب البيانات...";
  try {
    const resp = await fetch(SHEETDB_API);
    if(!resp.ok) throw new Error("fetch failed " + resp.status);
    const data = await resp.json();
    // data قد تكون مصفوفة كائنات — نعرض بعض الحقول
    if(!Array.isArray(data) || data.length === 0){
      paramedicsList.innerHTML = "<div class='paramedic-item'>لا توجد بيانات لعرضها حالياً.</div>";
      return;
    }
    paramedicsList.innerHTML = "";
    data.forEach(row => {
      const div = document.createElement("div");
      div.className = "paramedic-item";
      div.innerHTML = `<strong>${row.name || "غير محدد"}</strong> — ${row.license_type || "نوع رخصة غير محدد"}<br/><small>📞 ${row.phone || "لا يوجد"} • ${row.address || ""}</small>`;
      paramedicsList.appendChild(div);
    });
  } catch (e){
    console.warn("loadParamedics failed", e);
    paramedicsList.innerHTML = "<div class='paramedic-item'>حصل خطأ أثناء جلب البيانات.</div>";
  }
}

// ====== اختياري: إعادة تحميل المسعفين دورياً لو أردت ======
// setInterval(loadParamedics, 60_000); // كل دقيقة (غير مفعل افتراضياً)
