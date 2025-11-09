// ================== البيانات الأساسية للحالات ==================
const CASES = {
  "إجراءات الطوارئ في حالة الحروق": [
    "حروق الدرجة الأولى (الخفيفة):",
    "إجراءات إسعافية:",
    "افعل (√):",
    "تبريد الحرق للمساعدة في تهدئة الألم بوضع المنطقة المصابة تحت ماء جاري معتدل البرودة لمدة 10-15 دقيقة.",
    "إزالة الإكسسوارات والملابس الضيقة قبل انتفاخ المنطقة.",
    "تغطية منطقة الحرق بضمادة رطبة أو قطعة قماش نظيفة.",
    "أخذ مسكن الألم إذا لزم الأمر.",
    "لا تفعل (X):",
    "لا تحاول لمس الفقاعات.",
    "لا تضع أي مراهم أو زبدة أو معجون أسنان على الحرق.",
    "لا تستخدم الثلج مباشرة.",
    "اتصل بالإسعاف فوراً على 997."
  ],
  "إجراءات الطوارئ للمصابين بالصرع": [
    "لاحظ الوقت المستغرق في النوبة.",
    "احمِ المصاب من الأجسام المحيطة.",
    "أبعد النظارات إن كان يرتديها.",
    "ادعم رأس المصاب بقطعة قماش أو جاكيت.",
    "إذا استمرت النوبة أكثر من 5 دقائق، اطلب الإسعاف فوراً.",
    "لا تقيّد حركات المصاب ولا تضع شيء في فمه.",
    "بعد انتهاء النوبة، ضع المصاب على جانبه.",
    "ابقَ معه حتى يستعيد وعيه.",
    "اتصل بالإسعاف فوراً على 997 إذا لم يستعد وعيه."
  ],
  "إجراءات الطوارئ في حالة انخفاض السكر": [
    "أعط المصاب شيئًا يحتوي على سكر سريع مثل العصير أو الحلوى.",
    "إذا فقد وعيه لا تعطه شيئًا عن طريق الفم.",
    "راقب تنفسه ونبضه.",
    "اتصل بالإسعاف فوراً على 997."
  ],
  "إجراءات الطوارئ في حالة الاختناق": [
    "الوقوف خلف الشخص المصاب.",
    "ضع إحدى قدميك أمام الأخرى لتحقيق التوازن.",
    "لف ذراعيك حول خصر الشخص المصاب.",
    "أمل رأسه للأمام قليلاً.",
    "اصنع قبضة وضعها فوق السرة.",
    "اضغط بالقبضة الأخرى بقوة وسرعة نحو الأعلى.",
    "كرر من 6 إلى 10 مرات حتى يزول الجسم العالق.",
    "إذا فقد وعيه، ابدأ بالإنعاش القلبي الرئوي فوراً.",
    "اتصل بالإسعاف فوراً على 997."
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

// ================== دوال مساعدة للصوت ==================
function speakSteps(steps = currentSteps) {
  if (!("speechSynthesis" in window)) return;
  // نضمن إلغاء أي كلام سابق قبل بدء الجديد
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(steps.join("، ثم "));
  utter.lang = "ar-SA";
  window.speechSynthesis.speak(utter);
}

function stopSpeech() {
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
}

// ================== التبويبات ==================
function showTab(tabId) {
  // إخفاء كل التبويبات
  document.querySelectorAll(".tab").forEach(tab => tab.classList.add("hidden"));
  // إظهار التبويب المطلوب
  const el = document.getElementById(tabId);
  if (el) el.classList.remove("hidden");

  // **مهم**: عند الانتقال لأي تبويب نغلق كارد الخطوات ونوقف الصوت فوراً
  caseCard.classList.add("hidden");
  stopSpeech();

  // لو التبويب هو firstaid نعيد توليد الكروت (أو نعرضها فقط)
  if (tabId === "firstaid") renderCases();
}

// اربط أزرار التبويبات
document.querySelectorAll("nav button").forEach(btn => {
  btn.addEventListener("click", () => {
    const tabId = btn.getAttribute("data-tab");
    showTab(tabId);
  });
});

// ================== توليد كروت الحالات ==================
function renderCases() {
  casesContainer.innerHTML = "";
  for (const [caseName, steps] of Object.entries(CASES)) {
    const card = document.createElement("div");
    card.className = "case-card";

    const title = document.createElement("h3");
    title.textContent = caseName;

    const miniList = document.createElement("ul");
    miniList.className = "mini-steps";
    // نعرض أول سطرين ملخّصين داخل الكارد
    steps.slice(0, 2).forEach((s, i) => {
      const li = document.createElement("li");
      li.textContent = `${i + 1}. ${s}`;
      miniList.appendChild(li);
    });

    card.append(title, miniList);

    // عند النقر على الكارد نعرض الخطوات التفصيلية
    card.addEventListener("click", (ev) => {
      // منع أي سلوك متداخل
      ev.stopPropagation();
      showSteps(caseName, steps);
    });

    casesContainer.appendChild(card);
  }
}

// ================== عرض خطوات الحالة (المفصل) ==================
function showSteps(caseName, steps) {
  currentSteps = steps;

  // اظهار عنوان واضح يدل انها "خطوات"
  caseTitle.textContent = `خطوات الإسعاف — ${caseName}`;

  // ملء قائمة الخطوات
  stepsList.innerHTML = "";
  steps.forEach((step, idx) => {
    const li = document.createElement("li");
    li.textContent = `${idx + 1}. ${step}`;

    // عند الضغط على خطوة يمكن تمييزها كـ "مكتملة" (تغيير الستايل)
    li.addEventListener("mousedown", (e) => {
      e.stopPropagation();
      li.classList.toggle("done");
    });

    // عند الضغط على الخطوة سؤال اتصال (اختياري)
    li.addEventListener("click", (e) => {
      e.stopPropagation();
      if (step.includes("اتصل") || step.includes("997")) {
        if (confirm("هل تريد الاتصال بالإسعاف 997؟")) window.location.href = "tel:997";
      }
    });

    stepsList.appendChild(li);
  });

  // إظهار الكارد ثم تشغيل القراءة الصوتية
  caseCard.classList.remove("hidden");
  speakSteps(steps);
}

// ================== أزرار التحكم داخل الكارد ==================
playBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  if (currentSteps && currentSteps.length) speakSteps(currentSteps);
});

stopBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  stopSpeech();
});

backBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  caseCard.classList.add("hidden");
  stopSpeech();
});

callBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  if (confirm("هل تريد الاتصال بالإسعاف 997؟")) window.location.href = "tel:997";
});

// إذا نقر المستخدم في أي مكان بخارج الكارد نخفيه (اختياري، يحسّن UX)
document.addEventListener("click", (e) => {
  // إذا الكارد ظاهر ونقر المستخدم خارج الكارد، اخفاءه وإيقاف الصوت
  if (!caseCard.classList.contains("hidden")) {
    const inside = caseCard.contains(e.target);
    if (!inside) {
      caseCard.classList.add("hidden");
      stopSpeech();
    }
  }
});

// ================== التعرف الصوتي (SpeechRecognition) ==================
let recognition = null;
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SR();
  recognition.lang = "ar-SA";
  recognition.continuous = true;
  recognition.interimResults = false;

  recognition.onresult = function (e) {
    const text = e.results[e.results.length - 1][0].transcript.trim().toLowerCase();
    // نبحث عن الكلمة المفتاحية داخل مفاتيح CASES (بصيغة مبسطة)
    for (const caseName of Object.keys(CASES)) {
      // نستخدم مقارنة على هيئة lowercase و presence
      if (text.includes(caseName.replace(/[^ء-ي\s]/g, '').toLowerCase()) ||
          // أو نسمح بالمفردات الأساسية (مثلاً "صرع" داخل "إجراءات الطوارئ للمصابين بالصرع")
          (caseName.includes("صرع") && text.includes("صرع")) ||
          (caseName.includes("حروق") && text.includes("حرق")) ||
          (caseName.includes("اختناق") && text.includes("اختناق")) ||
          (caseName.includes("انخفاض السكر") && (text.includes("سكر") || text.includes("انخفاض")))) {
        showSteps(caseName, CASES[caseName]);
        // إذا أردنا الانتقال تلقائياً لتبويب "الإسعافات الأولية" عند التعرف:
        showTab('firstaid');
        return;
      }
    }
  };

  recognition.onerror = function (err) {
    // لا نزعج المستخدم بتنبيهات كثيرة، لكن يمكن تسجيل الخطأ في الكونسول
    console.warn("Recognition error:", err);
  };

  // نبدأ التعرّف تلقائياً (إذا سمح المتصفح والمستخدم)
  try {
    recognition.start();
  } catch (e) {
    // بعض المتصفحات لا تسمح بإعادة start() بدون توقف -> نتجاهل
  }

  // زر الطوارئ يبدأ الاستماع (أعيد الربط)
  emergencyBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    try { recognition.start(); } catch (err) { /* ignore */ }
  });
} else {
  // المتصفح لا يدعم Recognition — يمكن إعلام المستخدم أو الاحتفاظ بالزر كخيار يدوي
  emergencyBtn.addEventListener("click", () => alert("المتصفح لا يدعم التعرف الصوتي."));
}

// نفّذ render للمرة الأولى إذا كان المستخدم فتح تبويب الإسعافات أو لتجهيز الواجهة
renderCases();
