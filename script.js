// ================== البيانات (مؤقت محلياً) ==================
const CASES = {
  "نزيف": [
    "اضغط على مكان النزيف مباشرة بقطعة قماش نظيفة.",
    "ارفع الجزء المصاب فوق مستوى القلب.",
    "لا تزل الأجسام العالقة في الجرح.",
    "اتصل بالإسعاف فوراً على 997"
  ],
  "كسر": [
    "لا تحرك الجزء المصاب.",
    "ثبت المنطقة باستخدام جبيرة مؤقتة.",
    "ضع ثلجاً ملفوفاً لتقليل التورم.",
    "اتصل بالإسعاف فوراً على 997"
  ],
  "انخفاض السكر": [
    "أعط المصاب شيئاً يحتوي على سكر سريع مثل العصير.",
    "إذا فقد وعيه لا تعطه شيئاً عن طريق الفم.",
    "راقب تنفسه حتى تصل المساعدة.",
    "اتصل بالإسعاف فوراً على 997"
  ]
};

// ================== عناصر DOM ==================
const emergencyBtn = document.getElementById("emergencyBtn");
const casesContainer = document.getElementById("casesContainer");
const caseCard = document.getElementById("caseCard");
const caseTitle = document.getElementById("caseTitle");
const stepsList = document.getElementById("stepsList");
const playBtn = document.getElementById("playBtn");
const stopBtn = document.getElementById("stopBtn");
const backBtn = document.getElementById("backBtn");
const callBtn = document.getElementById("callBtn");

let currentSteps = [];
let currentCaseName = "";
let synth = window.speechSynthesis;
let recognition = null;

// ================== توليد الكروت الأفقية (مركزه) ==================
function renderCases(){
  casesContainer.innerHTML = "";
  for(const [caseName, steps] of Object.entries(CASES)){
    const card = document.createElement("div");
    card.className = "case-card";

    const h = document.createElement("h3");
    h.textContent = caseName;

    const ul = document.createElement("ul");
    ul.className = "mini-steps";
    steps.slice(0,3).forEach((s, i) => { // عرض ثلاثة أسطر مختصر
      const li = document.createElement("li");
      li.textContent = `${i+1}. ${s}`;
      ul.appendChild(li);
    });

    // أزرار داخل كل كارد: فتح (عرض كامل)، إعادة، إيقاف، اتصال
    const controls = document.createElement("div");
    controls.className = "card-controls";

    const openBtn = document.createElement("button");
    openBtn.textContent = "📋 عرض";
    openBtn.onclick = () => showSteps(caseName, steps);

    const replayBtn = document.createElement("button");
    replayBtn.textContent = "🔄";
    replayBtn.title = "إعادة استماع";
    replayBtn.onclick = () => speakSteps(steps);

    const stopLocal = document.createElement("button");
    stopLocal.textContent = "⏹";
    stopLocal.title = "إيقاف";
    stopLocal.onclick = stopSpeech;

    const callLocal = document.createElement("a");
    callLocal.textContent = "📞";
    callLocal.className = "call-btn";
    callLocal.href = "tel:997";
    callLocal.onclick = (e) => {
      // تأكيد قبل الاتصال — على سطح المكتب قد لا يعمل tel:
      if(!confirm("هل تريد الاتصال بالطوارئ 997؟")) e.preventDefault();
    };

    controls.append(openBtn, replayBtn, stopLocal, callLocal);
    card.appendChild(h);
    card.appendChild(ul);
    card.appendChild(controls);
    casesContainer.appendChild(card);
  }
}

// ================== عرض كارد الخطوات المفصل ==================
function showSteps(caseName, steps){
  currentCaseName = caseName;
  currentSteps = steps.slice(); // انسخ
  caseTitle.textContent = caseName;
  stepsList.innerHTML = "";

  steps.forEach((step, idx) => {
    const div = document.createElement("div");
    div.className = "step";
    div.dataset.index = idx;
    div.innerHTML = `<strong>${idx+1}.</strong> ${step}`;
    // عند النقر على الخطوة -> تبديل اللون (تم) أو الاتصال عند النقر على رقم
    div.addEventListener("click", (ev) => {
      // إذا النقر كان على الرقم (نعتبر النقر العام يؤدي لتأكيد اتصال)
      if(confirm("هل تريد الاتصال بالإسعاف 997 الآن؟")) {
        window.location.href = "tel:997";
        return;
      }
      div.classList.toggle("done");
    });
    stepsList.appendChild(div);
  });

  // ضبط رابط زر الاتصال في الكارد ليحمل رقم الطوارئ من آخر خطوة أو ثابت
  callBtn.href = "tel:997";
  caseCard.classList.remove("hidden");
  // تشغيل القراءة فوراً
  speakSteps(steps);
}

// ================== القراءة الصوتية ==================
function speakSteps(steps = currentSteps){
  if(!("speechSynthesis" in window)) return;
  stopSpeech();
  const utter = new SpeechSynthesisUtterance(steps.join("، ثم "));
  utter.lang = "ar-SA";
  synth.speak(utter);
}

// ================== إيقاف الصوت ==================
function stopSpeech(){
  if(synth && synth.speaking) synth.cancel();
}

// ================== أزرار كارد التحكم */}
playBtn.addEventListener("click", () => speakSteps());
stopBtn.addEventListener("click", stopSpeech);
backBtn.addEventListener("click", () => {
  stopSpeech();
  caseCard.classList.add("hidden");
  currentSteps = [];
  currentCaseName = "";
});

// ================== التبويبات (nav) ==================
document.querySelectorAll("nav button").forEach(btn => {
  btn.addEventListener("click", () => {
    const tab = btn.getAttribute("data-tab");
    document.querySelectorAll(".tab").forEach(t => t.classList.add("hidden"));
    document.getElementById(tab).classList.remove("hidden");
    if(tab === "firstaid") renderCases();
  });
});

// ================== تشغيل التعرّف الصوتي (Recognition) تلقائياً في الخلفية ==================
function initRecognition(){
  if(!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
    console.warn("المتصفح لا يدعم التعرف على الصوت");
    return;
  }
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SR();
  recognition.lang = "ar-SA";
  recognition.continuous = true;
  recognition.interimResults = false;

  recognition.onresult = function(e){
    const text = e.results[e.results.length - 1][0].transcript.trim();
    // لا تستخدم تنبيهات مزعجة — فقط استجب مباشرة
    for(const [caseName, steps] of Object.entries(CASES)){
      if(text.includes(caseName)){
        // عرض الكارد وتشغيل الكلام
        showSteps(caseName, steps);
        return;
      }
    }
  };

  recognition.onerror = function(err){
    console.warn("recognition error:", err);
    // في بعض المتصفحات يمكن إعادة التشغيل تلقائياً
    // لا نعرض تنبيه للمستخدم هنا
  };

  // ابدء التعرف تلقائياً
  try { recognition.start(); } catch(e){ /* بعض المتصفحات ترمي خطأ لو بدأ مسبقاً */ }
}

// عند تحميل الصفحة
window.addEventListener("load", () => {
  renderCases();
  initRecognition();
});

// زر الطوارئ يفعّل التعرف أو يطلب إذن الميكروفون (يعمل أيضاً كـ start)
emergencyBtn.addEventListener("click", () => {
  if(recognition) {
    try { recognition.start(); } catch(e){}
  } else {
    initRecognition();
  }
});
