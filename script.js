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
const cardContainer = document.getElementById("cardContainer");
const caseTitle = document.getElementById("caseTitle");
const stepsList = document.getElementById("stepsList");
const playBtn = document.getElementById("playBtn");
const stopBtn = document.getElementById("stopBtn");
const backBtn = document.getElementById("backBtn");
const emergencyBtn = document.getElementById("emergencyBtn");

// ================== متغيرات مساعدة ==================
let currentSteps = [];
let lastSpokenSteps = "";

// ================== عرض تبويب ==================
function showTab(tabId) {
  document.querySelectorAll(".tab").forEach(t => t.classList.add("hidden"));
  document.getElementById(tabId).classList.remove("hidden");
}

// ================== عرض خطوات الحالة ==================
function showSteps(caseName, steps) {
  caseTitle.textContent = caseName;
  stepsList.innerHTML = "";
  currentSteps = steps;
  lastSpokenSteps = steps.join("، ثم ");
  steps.forEach(step => {
    const li = document.createElement("li");
    li.textContent = step;
    stepsList.appendChild(li);
  });
  cardContainer.classList.remove("hidden");
  speakSteps();
}

// ================== قراءة الخطوات صوتياً ==================
function speakSteps() {
  if (!("speechSynthesis" in window)) return;
  const utterance = new SpeechSynthesisUtterance(lastSpokenSteps);
  utterance.lang = "ar-SA";
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

// ================== إيقاف الصوت ==================
function stopSpeech() {
  window.speechSynthesis.cancel();
}

// ================== إعادة تشغيل آخر قراءة ==================
function playLast() {
  speakSteps();
}

// ================== زر العودة ==================
backBtn.onclick = () => {
  cardContainer.classList.add("hidden");
  showTab('firstaid');
  stopSpeech();
};

// ================== زر الطوارئ ==================
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SR();
  recognition.lang = "ar-SA";
  recognition.continuous = true;

  // ================== التعرف على الصوت ==================
  recognition.onresult = function(e) {
    const text = e.results[e.results.length - 1][0].transcript.trim();
    for (const [key, steps] of Object.entries(CASES)) {
      if (text.includes(key)) {
        showSteps(key, steps);
        return;
      }
    }
  };

  // يبدأ التعرف عند الضغط على زر الطوارئ
  emergencyBtn.onclick = () => recognition.start();

  // تشغيل التعرف تلقائياً عند فتح الموقع
  recognition.start();

} else {
  alert("المتصفح لا يدعم خاصية التعرف على الصوت.");
}

// ================== أزرار التحكم الصوتي ==================
playBtn.onclick = playLast;
stopBtn.onclick = stopSpeech;

// ================== نموذج التسجيل ==================
document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = Object.fromEntries(new FormData(e.target).entries());
  const API_URL = "https://sheetdb.io/api/v1/pp3tkazlfqhvu"; // عدلي حسب قاعدة بياناتك
  await fetch(API_URL, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({data: formData})
  });
  alert("تم إرسال البيانات بنجاح!");
  e.target.reset();
});
