const API_URL = "https://sheetdb.io/api/v1/pp3tkazlfqhvu";

const CASES = {
  "نزيف": [
    "اضغط على مكان النزيف مباشرة بقطعة قماش نظيفة.",
    "ارفع الجزء المصاب فوق مستوى القلب.",
    "لا تزل الأجسام العالقة في الجرح.",
    "اتصل بالإسعاف فوراً. (997)"
  ],
  "كسر": [
    "لا تحرك الجزء المصاب.",
    "ثبت المنطقة جيداً باستخدام جبيرة مؤقتة.",
    "ضع ثلجاً ملفوفاً لتقليل التورم.",
    "اتصل بالإسعاف فوراً. (997)"
  ],
  "انخفاض السكر": [
    "أعطِ المصاب شيئاً يحتوي على سكر سريع مثل العصير أو الحلوى.",
    "إذا فقد وعيه لا تعطه شيئاً عن طريق الفم.",
    "راقب تنفسه حتى تصل المساعدة.",
    "اتصل بالإسعاف فوراً. (997)"
  ]
};

const emergencyBtn = document.getElementById("emergencyBtn");
const casesList = document.getElementById("casesList");
const stepsSection = document.getElementById("stepsSection");
const caseTitle = document.getElementById("caseTitle");
const stepsList = document.getElementById("stepsList");

const playBtn = document.getElementById("playBtn");
const stopBtn = document.getElementById("stopBtn");
const backBtn = document.getElementById("backBtn");

let currentSpeech = null;
let currentSteps = [];

function showTab(tabId) {
  document.querySelectorAll(".tab").forEach(t => t.classList.add("hidden"));
  document.getElementById(tabId).classList.remove("hidden");
  if (tabId === "cases") renderCases();
}

function renderCases() {
  casesList.innerHTML = "";
  for (const [key, steps] of Object.entries(CASES)) {
    const btn = document.createElement("button");
    btn.textContent = key;
    btn.className = "main-btn";
    btn.onclick = () => showSteps(key, steps);
    casesList.appendChild(btn);
  }
}

function showSteps(name, steps) {
  caseTitle.textContent = name;
  stepsList.innerHTML = "";
  currentSteps = steps;
  steps.forEach(s => {
    const li = document.createElement("li");
    li.textContent = s;
    if (s.includes("997")) {
      const link = document.createElement("a");
      link.href = "#";
      link.textContent = "📞 997";
      link.onclick = () => {
        alert("هل الحالة طارئة فعلاً؟ سيتم تحويلك لطلب الإسعاف.");
        window.location.href = "tel:997";
      };
      li.appendChild(document.createElement("br"));
      li.appendChild(link);
    }
    stepsList.appendChild(li);
  });
  casesList.classList.add("hidden");
  stepsSection.classList.remove("hidden");
}

function speakText(text) {
  if (!("speechSynthesis" in window)) return;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "ar-SA";
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
  currentSpeech = u;
}

playBtn.onclick = () => speakText(currentSteps.join("، ثم "));
stopBtn.onclick = () => window.speechSynthesis.cancel();
backBtn.onclick = () => {
  stepsSection.classList.add("hidden");
  casesList.classList.remove("hidden");
  window.speechSynthesis.cancel();
};

async function sendForm(e) {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target).entries());
  await fetch(API_URL, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({data: data})
  });
  alert("✅ تم إرسال البيانات بنجاح!");
  e.target.reset();
}
document.getElementById("registerForm").addEventListener("submit", sendForm);

if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recog = new SpeechRecognition();
  recog.lang = "ar-SA";
  recog.continuous = false;

  recog.onresult = e => {
    const text = e.results[0][0].transcript;
    for (const [key, steps] of Object.entries(CASES)) {
      if (text.includes(key)) {
        showTab("cases");
        showSteps(key, steps);
        speakText(steps.join("، ثم "));
        return;
      }
    }
  };

  emergencyBtn.onclick = () => recog.start();
} else {
  alert("❌ متصفحك لا يدعم ميزة التعرف على الصوت.");
}
