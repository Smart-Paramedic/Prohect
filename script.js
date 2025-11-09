const tabs = document.querySelectorAll(".tab-btn");
const contents = document.querySelectorAll(".tab-content");
const emergencyBtn = document.getElementById("emergencyBtn");
const hint = document.getElementById("hint");
const stepsCard = document.getElementById("stepsCard");
const caseTitle = document.getElementById("caseTitle");
const stepsText = document.getElementById("stepsText");

const synth = window.speechSynthesis;
let recognition;

// 🎯 تفعيل التبويبات
tabs.forEach(btn => {
  btn.addEventListener("click", () => {
    tabs.forEach(b => b.classList.remove("active"));
    contents.forEach(c => c.classList.remove("active"));
    stepsCard.classList.add("hidden");
    btn.classList.add("active");
    document.getElementById(btn.dataset.tab).classList.add("active");
  });
});

// 🔊 تعريف الحالات الصوتية
const casesMap = {
  "الحروق": 1,
  "الصرع": 2,
  "انخفاض الضغط": 3,
  "الاختناق": 4
};

// 🚨 زر الطوارئ
emergencyBtn.addEventListener("click", () => {
  if (!("webkitSpeechRecognition" in window)) {
    alert("المتصفح لا يدعم الأوامر الصوتية.");
    return;
  }
  recognition = new webkitSpeechRecognition();
  recognition.lang = "ar-SA";
  recognition.start();

  hint.textContent = "🎙 تحدث الآن...";
  
  recognition.onresult = async (event) => {
    const result = event.results[0][0].transcript.trim();
    hint.textContent = `🔍 تم التعرف على: ${result}`;
    
    for (const [key, id] of Object.entries(casesMap)) {
      if (result.includes(key)) {
        await loadCaseFromDB(id);
        break;
      }
    }
  };
});

// 🩺 جلب الحالة من قاعدة البيانات
async function loadCaseFromDB(caseId) {
  const res = await fetch(`api/get_case_details.php?case_id=${caseId}`);
  const data = await res.json();

  caseTitle.textContent = `🩺 ${data.caseName}`;
  stepsText.innerHTML = data.steps.map(s => `<p>${s}</p>`).join("");
  stepsCard.classList.remove("hidden");

  const textToSpeak = data.steps.join("، ");
  speak(textToSpeak);
}

// 🔈 النطق
function speak(text) {
  synth.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "ar-SA";
  synth.speak(utter);
}
