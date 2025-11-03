const emergencyBtn = document.getElementById("emergencyBtn");
const showCasesBtn = document.getElementById("showCasesBtn");
const casesList = document.getElementById("casesList");
const stepsSection = document.getElementById("stepsSection");
const caseTitle = document.getElementById("caseTitle");
const stepsList = document.getElementById("stepsList");
const stopBtn = document.getElementById("stopBtn");
const playBtn = document.getElementById("playBtn");
const callBtn = document.getElementById("callBtn");
const backBtn = document.getElementById("back");
const instruction = document.getElementById("instruction");
const hint = document.getElementById("hint");

const synth = window.speechSynthesis;
let recognition = null;
let currentUtterance = null;
let cases = [];

// جلب البيانات من SheetDB
fetch("https://sheetdb.io/api/v1/pp3tkazlfqhvu")
  .then(res => res.json())
  .then(data => {
    cases = data.map(row => ({
      name: row.case,
      steps: row.steps ? row.steps.split('|') : [],
      info: row.info || ''
    }));
    renderCases();
  })
  .catch(err => console.error("خطأ في جلب البيانات:", err));

// عرض الحالات كبطاقات
function renderCases() {
  casesList.innerHTML = "";
  cases.forEach(c => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `<h3>${c.name}</h3><p>${c.info}</p>`;
    card.onclick = () => showSteps(c);
    casesList.appendChild(card);
  });
  casesList.classList.remove("hidden");
}

// عرض الخطوات وقراءتها صوتيًا
function showSteps(c) {
  stepsSection.style.display = "block";
  caseTitle.textContent = c.name;
  stepsList.innerHTML = "";
  c.steps.forEach(s => {
    const li = document.createElement("li");
    li.textContent = s;
    stepsList.appendChild(li);
  });
  speakSteps(c.steps);
  emergencyBtn.style.display = "none";
  showCasesBtn.style.display = "none";
  hint.style.display = "none";
}

function speakSteps(steps) {
  if (synth.speaking) synth.cancel();
  currentUtterance = new SpeechSynthesisUtterance(steps.join(". "));
  currentUtterance.lang = "ar-SA";
  synth.speak(currentUtterance);
}

function playLast() {
  if (currentUtterance) {
    if (synth.speaking) synth.cancel();
    synth.speak(currentUtterance);
  }
}

function stopSpeech() {
  if (synth.speaking) synth.cancel();
}

// الاتصال بالطوارئ
callBtn.addEventListener("click", () => {
  window.location.href = "tel:997";
});

// عرض الحالات
showCasesBtn.addEventListener("click", renderCases);

// التعرف على الصوت تلقائيًا
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.lang = "ar-SA";
  recognition.continuous = true;
  recognition.interimResults = false;

  recognition.onresult = function(event) {
    const last = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
    const found = cases.find(c => last.includes(c.name.toLowerCase()));
    if (found) showSteps(found);
  };

  recognition.onerror = function(e) {
    console.log("خطأ في التعرف الصوتي:", e);
  };

  recognition.start(); // يبدأ تلقائيًا
}

// زر الطوارئ لتفعيل المايك
emergencyBtn.addEventListener("click", () => {
  if (recognition) recognition.start();
});

// التحكم بالصوت
stopBtn.addEventListener("click", stopSpeech);
playBtn.addEventListener("click", playLast);

// الرجوع للشاشة الرئيسية
backBtn.addEventListener("click", () => {
  stepsSection.style.display = "none";
  if (synth.speaking) synth.cancel();
  emergencyBtn.style.display = "inline-block";
  showCasesBtn.style.display = "inline-block";
  hint.style.display = "block";
  instruction.textContent = "اضغط زر الطوارئ للبدء";
});
