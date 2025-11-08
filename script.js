// ================== البيانات الأساسية للحالات ==================
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

let currentSteps = [];
let lastSpokenSteps = "";

// ================== التبويبات ==================
function showTab(tabId) {
  document.querySelectorAll(".tab").forEach(t => t.classList.add("hidden"));
  document.getElementById(tabId).classList.remove("hidden");
  if(tabId === "firstaid") renderCases();
}

// ================== توليد كروت الحالات ==================
function renderCases() {
  casesContainer.innerHTML = "";
  for (const [caseName, steps] of Object.entries(CASES)) {
    const card = document.createElement("div");
    card.className = "case-card";

    const title = document.createElement("h3");
    title.textContent = caseName;

    const list = document.createElement("ul");
    steps.forEach((step, index) => {
      const li = document.createElement("li");
      li.textContent = `${index + 1}. ${step}`;
      li.onclick = () => window.location.href = "tel:997";
      li.onmousedown = () => li.classList.toggle("highlight");
      list.appendChild(li);
    });

    const playBtn = document.createElement("button");
    playBtn.textContent = "🔄 إعادة";
    playBtn.onclick = () => speakSteps(steps);

    const stopBtn = document.createElement("button");
    stopBtn.textContent = "⏹ إيقاف";
    stopBtn.onclick = stopSpeech;

    const backBtn = document.createElement("button");
    backBtn.textContent = "⬅ رجوع";
    backBtn.onclick = () => card.remove();

    card.append(title, list, playBtn, stopBtn, backBtn);
    casesContainer.appendChild(card);
  }
}

// ================== عرض خطوات الحالة ==================
function showSteps(caseName, steps) {
  caseTitle.textContent = caseName;
  stepsList.innerHTML = "";
  currentSteps = steps;
  lastSpokenSteps = steps.join("، ثم ");
  steps.forEach((step, index) => {
    const li = document.createElement("li");
    li.textContent = `${index + 1}. ${step}`;
    li.onclick = () => window.location.href = "tel:997";
    li.onmousedown = () => li.classList.toggle("highlight");
    stepsList.appendChild(li);
  });
  caseCard.classList.remove("hidden");
  speakSteps(steps);
}

// ================== القراءة الصوتية ==================
function speakSteps(steps = currentSteps) {
  if (!("speechSynthesis" in window)) return;
  const utter = new SpeechSynthesisUtterance(steps.join("، ثم "));
  utter.lang = "ar-SA";
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utter);
}

// ================== إيقاف الصوت ==================
function stopSpeech() {
  window.speechSynthesis.cancel();
}

// ================== إعادة تشغيل آخر قراءة ==================
function playLast() {
  speakSteps();
}

// ================== التبويبات تعمل على النقر واللمس ==================
document.querySelectorAll("nav button").forEach(btn => {
  btn.addEventListener("click", () => {
    const tabId = btn.getAttribute("data-tab");
    showTab(tabId);
  });
});

// ================== زر الطوارئ والتعرف الصوتي ==================
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SR();
  recognition.lang = "ar-SA";
  recognition.continuous = true;

  recognition.onresult = function(e) {
    const text = e.results[e.results.length - 1][0].transcript.trim();
    for (const [caseName, steps] of Object.entries(CASES)) {
      if (text.includes(caseName)) {
        showSteps(caseName, steps); // الاستجابة الصوتية مباشرة
        return;
      }
    }
  };

  emergencyBtn.onclick = () => recognition.start();
} else {
  alert("المتصفح لا يدعم خاصية التعرف على الصوت.");
}

// ================== نموذج التسجيل ==================
document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = Object.fromEntries(new FormData(e.target).entries());
  const API_URL = "https://sheetdb.io/api/v1/pp3tkazlfqhvu";
  await fetch(API_URL, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({data: formData})
  });
  alert("تم إرسال البيانات بنجاح!");
  e.target.reset();
});
