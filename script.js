const emergencyBtn = document.getElementById("emergencyBtn");
const instruction = document.getElementById("instruction");
const casesList = document.getElementById("casesList");

const synth = window.speechSynthesis;
let recognition = null;
let currentUtterance = null;
let cases = [];

// عرض التبويبات
function showTab(tabId) {
  document.querySelectorAll(".tab").forEach(tab => tab.classList.add("hidden"));
  document.getElementById(tabId + "Tab").classList.remove("hidden");
}

// جلب الحالات من ورقة "الحالات" في SheetDB
fetch("https://sheetdb.io/api/v1/pp3tkazlfqhvu?sheet=الحالات")
  .then(res => res.json())
  .then(data => {
    cases = data.map(row => ({
      name: row["الحالة"],
      steps: row["الخطوات"] ? row["الخطوات"].split('|') : []
    }));
    renderCases();
  })
  .catch(err => console.error("❌ خطأ في جلب الحالات:", err));

// عرض الحالات بكروت أفقية
function renderCases() {
  casesList.innerHTML = "";
  cases.forEach(c => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `<h3>${c.name}</h3><ul></ul>`;
    const ul = card.querySelector("ul");

    c.steps.forEach((step, index) => {
      const li = document.createElement("li");
      li.textContent = step;
      ul.appendChild(li);
    });

    // زر الاتصال 997 في نهاية الكرت
    const callBtn = document.createElement("button");
    callBtn.textContent = "📞 الاتصال 997";
    callBtn.onclick = () => {
      if (confirm("⚠️ سيتم إجراء مكالمة طوارئ الآن")) {
        window.location.href = "tel:997";
      }
    };
    card.appendChild(callBtn);

    casesList.appendChild(card);
  });
}

// التفاعل الصوتي
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.lang = "ar-SA";
  recognition.continuous = true;
  recognition.interimResults = false;

  recognition.onresult = function(event) {
    const last = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
    const found = cases.find(c => last.includes(c.name.toLowerCase()));
    if (found) speakSteps(found.steps);
  };

  recognition.onerror = function(e) {
    console.log("🎤 خطأ في التعرف الصوتي:", e);
  };

  // يبدأ تلقائيًا عند تحميل الصفحة
  window.addEventListener("load", () => {
    recognition.start();
  });
}

// قراءة الخطوات صوتيًا
function speakSteps(steps) {
  if (synth.speaking) synth.cancel();
  currentUtterance = new SpeechSynthesisUtterance(steps.join(". "));
  currentUtterance.lang = "ar-SA";
  synth.speak(currentUtterance);
}

// زر الطوارئ يعيد تنشيط المايك
emergencyBtn.addEventListener("click", () => {
  if (recognition) recognition.start();
  instruction.textContent = "🎙️ جاري الاستماع... قل اسم الحالة";
  setTimeout(() => {
    instruction.textContent = "🚨 قل اسم الحالة أو اضغط زر الطوارئ للبدء";
  }, 5000);
});
