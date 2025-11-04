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
    "أعط المصاب شيئاً يحتوي على سكر سريع مثل العصير.",
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
const casesList = document.getElementById("casesList");

let currentSteps = [];

// عرض الكارد
function showCard(caseName, steps) {
  caseTitle.textContent = caseName;
  stepsList.innerHTML = "";
  currentSteps = steps;
  steps.forEach(step => {
    const li = document.createElement("li");
    li.textContent = step;
    if (step.includes("997")) {
      const link = document.createElement("a");
      link.textContent = "997";
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
  showTab('home');
  window.speechSynthesis.cancel();
};

function showTab(tabId) {
  document.querySelectorAll(".tab").forEach(t => t.classList.add("hidden"));
  document.getElementById(tabId).classList.remove("hidden");
}

// عرض الحالات في تبويب الحالات
Object.entries(CASES).forEach(([name, steps]) => {
  const box = document.createElement("div");
  box.className = "case-box";
  box.innerHTML = `<h3>${name}</h3><ul>${steps.map(s=>`<li>${s}</li>`).join('')}</ul>`;
  casesList.appendChild(box);
});

// إرسال البيانات لقاعدة البيانات
document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target).entries());
  await fetch(API_URL, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({data})
  });
  alert("تم إرسال البيانات بنجاح!");
  e.target.reset();
});

// التعرف الصوتي
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

  // يبدأ تلقائياً عند فتح الصفحة
  recog.start();
  // أو عند النقر على الزر
  emergencyBtn.onclick = () => recog.start();

} else {
  alert("المتصفح لا يدعم خاصية التعرف على الصوت.");
}
