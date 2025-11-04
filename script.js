const CASES = {
  "نزيف": [
    "أوقف النزيف بالضغط المباشر على الجرح.",
    "ارفع العضو المصاب فوق مستوى القلب.",
    "لا تزل الجسم العالق إن وُجد.",
    "اتصل بالإسعاف فوراً."
  ],
  "كسر": [
    "ثبّت الطرف المصاب دون تحريكه.",
    "ضع كمادات باردة لتخفيف الألم.",
    "لا تحاول إعادة العظم لمكانه.",
    "اتصل بالإسعاف فوراً."
  ],
  "انخفاض السكر": [
    "أعطِ المريض شيئاً يحتوي على سكر سريع مثل العصير أو العسل.",
    "راقب التنفس والوعي.",
    "اطلب المساعدة الطبية إن لم يتحسن خلال دقائق.",
    "اتصل بالإسعاف فوراً."
  ]
};

const API_URL = "https://sheetdb.io/api/v1/pp3tkazlfqhvu";

const tabs = document.querySelectorAll(".tab");
function showTab(id) {
  tabs.forEach(tab => tab.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

showTab("home");


function speak(text) {
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "ar-SA";
  u.rate = 0.95;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
}


function showSteps(caseName) {
  const stepsSection = document.getElementById("stepsSection");
  const caseTitle = document.getElementById("caseTitle");
  const stepsList = document.getElementById("stepsList");
  stepsSection.classList.remove("hidden");

  caseTitle.textContent = caseName;
  stepsList.innerHTML = "";
  CASES[caseName].forEach(step => {
    const li = document.createElement("li");
    li.textContent = step;
    stepsList.appendChild(li);
  });

  speak(CASES[caseName].join("، ثم "));
}


document.getElementById("backBtn").onclick = () => {
  document.getElementById("stepsSection").classList.add("hidden");
};


document.getElementById("callBtn").onclick = () => {
  if (confirm("هل الحالة طارئة فعلاً وتريد الاتصال بالإسعاف؟")) {
    window.location.href = "tel:997";
  }
};


function initVoice() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) return alert("المتصفح لا يدعم التعرف على الصوت.");

  const recognition = new SpeechRecognition();
  recognition.lang = "ar-SA";
  recognition.continuous = true;

  recognition.onresult = e => {
    const text = e.results[e.resultIndex][0].transcript.trim();
    document.getElementById("status").textContent = `🔊 تم التعرف على: ${text}`;
    for (const name in CASES) {
      if (text.includes(name)) {
        showTab("cases");
        showSteps(name);
        break;
      }
    }
  };

  recognition.start();
}

initVoice();

document.getElementById("registerForm").addEventListener("submit", async e => {
  e.preventDefault();
  const formData = Object.fromEntries(new FormData(e.target).entries());

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ data: formData })
  });

  if (res.ok) {
    alert("✅ تم تسجيل الحالة بنجاح!");
    e.target.reset();
  } else {
    alert("❌ حدث خطأ أثناء التسجيل.");
  }
});

