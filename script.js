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

const cardContainer = document.getElementById("cardContainer");
const caseTitle = document.getElementById("caseTitle");
const stepsList = document.getElementById("stepsList");
const playBtn = document.getElementById("playBtn");
const stopBtn = document.getElementById("stopBtn");
const backBtn = document.getElementById("backBtn");
const emergencyBtn = document.getElementById("emergencyBtn");

let currentSteps = [];

function showTab(id) {
  document.querySelectorAll(".tab").forEach(t => t.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

function showCard(caseName, steps) {
  caseTitle.textContent = caseName;
  stepsList.innerHTML = "";
  currentSteps = steps;
  steps.forEach(step => {
    const li = document.createElement("li");
    li.textContent = step;
    stepsList.appendChild(li);
  });
  cardContainer.classList.remove("hidden");
  speakSteps();
}

function speakSteps() {
  if (!("speechSynthesis" in window)) return;
  const utterance = new SpeechSynthesisUtterance(currentSteps.join("، ثم "));
  utterance.lang = "ar-SA";
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

playBtn.onclick = speakSteps;
stopBtn.onclick = () => window.speechSynthesis.cancel();
backBtn.onclick = () => {
  cardContainer.classList.add("hidden");
  showTab('firstaid');
  window.speechSynthesis.cancel();
};

// التعرف الصوتي عند الضغط على زر الطوارئ
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recog = new SR();
  recog.lang = "ar-SA";
  recog.continuous = true;

  recog.onresult = (e) => {
    const text = e.results[e.results.length - 1][0].transcript.trim();
    for (const [key, steps] of Object.entries(CASES)) {
      if (text.includes(key)) {
        showCard(key, steps);
        return;
      }
    }
  };

  emergencyBtn.onclick = () => recog.start();
  recog.start();
} else {
  alert("المتصفح لا يدعم خاصية التعرف على الصوت.");
}

// إرسال البيانات للنموذج (مثال مع SheetDB)
document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = Object.fromEntries(new FormData(e.target).entries());
  // رابط API لقاعدة البيانات
  const API_URL = "https://sheetdb.io/api/v1/pp3tkazlfqhvu";
  await fetch(API_URL, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({data: formData})
  });
  alert("تم إرسال البيانات بنجاح!");
  e.target.reset();
});
