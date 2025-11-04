const SHEETDB_API = "https://sheetdb.io/api/v1/pp3tkazlfqhvu";

const caseStepsData = {
  "نزيف": ["اضغط على الجرح لوقف النزيف", "ارفع العضو المصاب", "ضع ضمادة واستدعِ الطوارئ فوراً"],
  "كسر": ["ثبّت الجزء المصاب", "تجنب تحريكه", "اتصل بالإسعاف فوراً"],
  "انخفاض السكر": ["أعط المصاب سكريات", "راقب وعيه", "استدعِ الطوارئ إذا فقد الوعي"]
};

// عناصر الواجهة
const emergencyBtn = document.getElementById("emergencyBtn");
const micStatus = document.getElementById("micStatus");
const stepsSection = document.getElementById("stepsSection");
const caseTitle = document.getElementById("caseTitle");
const stepsList = document.getElementById("stepsList");
const playBtn = document.getElementById("playBtn");
const stopBtn = document.getElementById("stopBtn");
const backBtn = document.getElementById("backBtn");
const paramedicsList = document.getElementById("paramedicsList");

let recognition;
let synth = window.speechSynthesis;
let lastSpoken = null;

// تشغيل التبويبات
document.querySelectorAll(".nav-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(t => t.classList.add("hidden"));
    document.getElementById(btn.dataset.tab).classList.remove("hidden");
    document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
  });
});

// عرض خطوات الحالة
function showSteps(name) {
  stepsSection.classList.remove("hidden");
  caseTitle.textContent = name;
  stepsList.innerHTML = "";
  caseStepsData[name].forEach(s => {
    const li = document.createElement("li");
    li.textContent = s;
    stepsList.appendChild(li);
  });
  speakSteps(name);
}

function speakSteps(name) {
  const text = caseStepsData[name]?.join("، ");
  if (!text) return;
  stopSpeech();
  const utter = new SpeechSynthesisUtterance(`${text}`);
  utter.lang = "ar-SA";
  synth.speak(utter);
  lastSpoken = utter;
}

function stopSpeech() {
  if (synth.speaking) synth.cancel();
}

function playLast() {
  if (lastSpoken) synth.speak(lastSpoken);
}

backBtn.onclick = () => stepsSection.classList.add("hidden");
playBtn.onclick = playLast;
stopBtn.onclick = stopSpeech;

// تعرف صوتي مباشر
function startRecognition() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) {
    micStatus.textContent = "❌ المتصفح لا يدعم التعرف الصوتي";
    return;
  }

  recognition = new SR();
  recognition.lang = "ar-SA";
  recognition.continuous = true;
  recognition.interimResults = false;

  recognition.onstart = () => micStatus.textContent = "🎤 قيد الاستماع...";
  recognition.onend = () => {
    micStatus.textContent = "🔴 متوقف، اضغط لإعادة التشغيل";
    recognition.start(); // يعيد التشغيل تلقائيًا
  };

  recognition.onresult = (event) => {
    const text = event.results[event.resultIndex][0].transcript.trim();
    console.log("سمع:", text);
    for (const key in caseStepsData) {
      if (text.includes(key)) {
        showSteps(key);
        return;
      }
    }
  };

  recognition.start();
}

// زر الطوارئ لتفعيل الميكروفون يدويًا
emergencyBtn.addEventListener("click", () => {
  if (!recognition) startRecognition();
  micStatus.textContent = "🎤 الميكروفون نشط";
});

// يبدأ تلقائي بعد فتح الصفحة
window.onload = () => {
  startRecognition();
  loadParamedics();
};

// تحميل المسعفين
async function loadParamedics() {
  try {
    const res = await fetch(SHEETDB_API);
    const data = await res.json();
    paramedicsList.innerHTML = "";
    data.forEach(p => {
      const card = document.createElement("div");
      card.className = "paramedic-card";
      card.innerHTML = `
        <strong>${p.name || "غير معروف"}</strong>
        <span>${p.license_type || "غير محدد"}</span>
        <span>${p.address || ""}</span>
      `;
      paramedicsList.appendChild(card);
    });
  } catch {
    paramedicsList.textContent = "⚠️ تعذر تحميل قائمة المسعفين";
  }
}
