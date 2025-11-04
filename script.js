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
    "ثبت المنطقة باستخدام جبيرة مؤقتة.",
    "ضع ثلجاً ملفوفاً لتقليل التورم.",
    "اتصل بالإسعاف فوراً. (997)"
  ],
  "انخفاض السكر": [
    "أعطِ المصاب شيئاً يحتوي على سكر سريع مثل العصير.",
    "إذا فقد وعيه لا تعطه شيئاً عن طريق الفم.",
    "راقب تنفسه حتى تصل المساعدة.",
    "اتصل بالإسعاف فوراً. (997)"
  ]
};

const emergencyBtn = document.getElementById("emergencyBtn");
const cardContainer = document.getElementById("cardContainer");
const caseTitle = document.getElementById("caseTitle");
const stepsList = document.getElementById("stepsList");
const playBtn = document.getElementById("playBtn");
const stopBtn = document.getElementById("stopBtn");
const backBtn = document.getElementById("backBtn");

let currentSteps = [];

function showCard(caseName, steps) {
  caseTitle.textContent = caseName;
  stepsList.innerHTML = "";
  currentSteps = steps;
  steps.forEach(step => {
    const li = document.createElement("li");
    li.textContent = step;
    if (step.includes("997")) {
      const link = document.createElement("a");
      link.textContent = "📞 997";
      link.href = "#";
      link.onclick = () => {
        alert("هل الحالة طارئة فعلاً؟ سيتم تحويلك لطلب الإسعاف.");
        window.location.href = "tel:997";
      };
      li.appendChild(document.createElement("br"));
      li.appendChild(link);
    }
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
  window.speechSynthesis.cancel();
};

function showTab(tabId) {
  document.querySelectorAll(".tab").forEach(t => t.classList.add("hidden"));
  document.getElementById(tabId).classList.remove("hidden");
}

async function sendForm(e) {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target).entries());
  await fetch(API_URL, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({data})
  });
  alert("✅ تم إرسال البيانات بنجاح!");
  e.target.reset();
}
document.getElementById("registerForm").addEventListener("submit", sendForm);

if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recog = new SR();
  recog.lang = "ar-SA";
  recog.continuous = false;

  recog.onresult = (e) => {
    const text = e.results[0][0].transcript;
    for (const [key, steps] of Object.entries(CASES)) {
      if (text.includes(key)) {
        showCard(key, steps);
        return;
      }
    }
  };
  emergencyBtn.onclick = () => recog.start();
} else {
  alert("❌ متصفحك لا يدعم التعرف على الصوت.");
}
