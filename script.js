// ================== الحالات الإسعافية ==================
const CASES = {
  "الحروق": [
    "حروق الدرجة الأولى (الخفيفة):",
    "تبريد الحرق بماء جاري معتدل لمدة 10-15 دقيقة.",
    "إزالة الإكسسوارات والملابس الضيقة قبل الانتفاخ.",
    "تغطية منطقة الحرق بضمادة رطبة أو قطعة قماش نظيفة.",
    "لا تلمس الفقاعات أو تضع مراهم أو ثلج مباشرة.",
    "اتصل بالإسعاف فوراً على 997."
  ],
  "الصرع": [
    "لاحظ وقت النوبة واحمِ المصاب من الأجسام المحيطة.",
    "ادعم رأس المصاب بقطعة قماش أو جاكيت.",
    "لا تضع شيئًا في فمه.",
    "بعد انتهاء النوبة ضع المصاب على جانبه.",
    "اتصل بالإسعاف فوراً على 997."
  ],
  "انخفاض الضغط": [
    "مدد المصاب على ظهره وارفع قدميه قليلاً.",
    "افتح ملابسه الضيقة.",
    "قدم له سوائل إذا كان واعيًا.",
    "اتصل بالإسعاف فوراً على 997."
  ],
  "الاختناق": [
    "قف خلف الشخص المصاب وضع إحدى قدميك أمام الأخرى.",
    "لف ذراعيك حول خصره.",
    "اصنع قبضة وضعها فوق السرة.",
    "اضغط بقوة للأعلى من 6 إلى 10 مرات.",
    "إذا فقد وعيه ابدأ بالإنعاش القلبي الرئوي.",
    "اتصل بالإسعاف فوراً على 997."
  ]
};

// ================== التبويبات ==================
const tabs = document.querySelectorAll(".tab");
const tabButtons = document.querySelectorAll(".tab-btn");
const casesList = document.getElementById("casesList");

tabButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    tabs.forEach(tab => tab.classList.remove("active"));
    document.getElementById(btn.dataset.target).classList.add("active");
    document.getElementById("hint").textContent = "تحدث أو انقر على الزر لذكر الحالة";
    stopSpeech();
  });
});

// ================== عرض الحالات ==================
function showCases() {
  casesList.innerHTML = "";
  Object.keys(CASES).forEach(caseName => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <h3>${caseName}</h3>
      <ul>${CASES[caseName].map(s => `<li>${s}</li>`).join("")}</ul>
      <button onclick="confirmCall()">📞 اتصال بالإسعاف</button>
    `;
    casesList.appendChild(card);
  });
}
showCases();

// ================== خاصية الاتصال ==================
function confirmCall() {
  if (confirm("هل ترغب في الاتصال بالإسعاف الآن؟")) {
    window.location.href = "tel:997";
  }
}

// ================== التعرف الصوتي ==================
const emergencyBtn = document.getElementById("emergencyBtn");
let recognition;
if ("webkitSpeechRecognition" in window) {
  recognition = new webkitSpeechRecognition();
  recognition.lang = "ar-SA";
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onresult = (event) => {
    const result = event.results[0][0].transcript.trim();
    handleVoice(result);
  };
}

function handleVoice(command) {
  for (let caseName in CASES) {
    if (command.includes(caseName)) {
      speakSteps(CASES[caseName], caseName);
      return;
    }
  }
  alert("لم يتم التعرف على الحالة، حاول مرة أخرى.");
}

emergencyBtn.addEventListener("click", () => recognition.start());

// ================== نطق الخطوات ==================
let synth = window.speechSynthesis;
let lastSteps = [];

function speakSteps(steps, title) {
  stopSpeech();
  lastSteps = steps;
  let message = new SpeechSynthesisUtterance("خطوات الإسعاف في حالة " + title + ": " + steps.join(". "));
  message.lang = "ar-SA";
  synth.speak(message);
}

function stopSpeech() {
  synth.cancel();
}

function playLast() {
  if (lastSteps.length > 0) speakSteps(lastSteps);
}
