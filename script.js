// ===================== الحالات =====================
const CASES = {
  "الحروق": [
    "تبريد الحرق تحت ماء جاري لمدة 10 إلى 15 دقيقة.",
    "إزالة الملابس الضيقة أو الإكسسوارات حول المنطقة.",
    "تغطية الحرق بضمادة نظيفة.",
    "عدم وضع أي مراهم أو ثلج مباشرة.",
    "الاتصال بالإسعاف فوراً على 997 إذا كان الحرق شديداً."
  ],
  "الصرع": [
    "لاحظ وقت النوبة واحمِ المصاب من الأجسام الحادة.",
    "ادعم رأس المصاب بشيء ناعم.",
    "لا تضع أي شيء في فمه.",
    "بعد انتهاء النوبة، ضع المصاب على جانبه بهدوء."
  ],
  "انخفاض الضغط": [
    "اجعل المصاب يجلس أو يستلقي.",
    "ارفع قدميه قليلاً لتحسين تدفق الدم.",
    "أعطه ماء إذا كان واعياً.",
    "اتصل بالإسعاف إذا لم يتحسن سريعاً."
  ],
  "الاختناق": [
    "قف خلف المصاب ولف ذراعيك حول خصره.",
    "اضغط بقوة نحو الأعلى عدة مرات.",
    "إذا فقد وعيه، ابدأ بالإنعاش القلبي الرئوي.",
    "اتصل بالإسعاف فوراً."
  ]
};

// ===================== الكلام =====================
let synth = window.speechSynthesis;
let currentUtterance;
let lastSteps = [];

function speakSteps(steps) {
  stopSpeech();
  lastSteps = steps;
  currentUtterance = new SpeechSynthesisUtterance(steps.join(". "));
  currentUtterance.lang = "ar-SA";
  synth.speak(currentUtterance);
}
function stopSpeech() {
  if (synth.speaking) synth.cancel();
}
function repeatSpeech() {
  if (lastSteps.length > 0) speakSteps(lastSteps);
}

// ===================== عرض الحالات =====================
function renderCases(filter = null) {
  const container = document.getElementById("cases-container");
  container.innerHTML = "";

  const show = filter ? { [filter]: CASES[filter] } : CASES;

  for (let caseName in show) {
    const card = document.createElement("div");
    card.className = "case-card";
    const steps = show[caseName];

    card.innerHTML = `
      <h3>${caseName}</h3>
      <div class="subtitle">خطوات الإسعافات الأولية</div>
      <ul>${steps.map(s => `<li>${s}</li>`).join("")}</ul>
      <div class="card-controls">
        <button class="play-btn">إعادة التشغيل</button>
        <button class="stop-btn">إيقاف الصوت</button>
        <button class="back-btn">رجوع</button>
        <button class="call-btn">اتصال 997</button>
      </div>
    `;

    // أزرار داخل الكارد
    card.querySelector(".play-btn").onclick = () => speakSteps([caseName].concat(steps));
    card.querySelector(".stop-btn").onclick = stopSpeech;
    card.querySelector(".back-btn").onclick = () => renderCases();
    card.querySelector(".call-btn").onclick = () => {
      stopSpeech();
      if (confirm(`هل تريد الاتصال بالإسعاف 997 للحالة: ${caseName}؟`)) {
        window.location.href = "tel:997";
      }
    };

    container.appendChild(card);
  }
}

// ===================== التبويبات =====================
function showTab(tabId, e) {
  stopSpeech();
  document.querySelectorAll(".tab-content").forEach(t => t.classList.remove("active"));
  document.getElementById(tabId).classList.add("active");
  document.querySelectorAll(".nav-tab").forEach(t => t.classList.remove("active"));
  if (e) e.currentTarget.classList.add("active");
}

// ===================== الصوت (التعرف) =====================
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = "ar-SA";
recognition.continuous = false;

recognition.onstart = () => {
  document.getElementById("listeningIndicator").classList.remove("hidden");
};
recognition.onend = () => {
  document.getElementById("listeningIndicator").classList.add("hidden");
};
recognition.onresult = e => {
  const text = e.results[0][0].transcript.trim();
  for (let caseName in CASES) {
    if (text.includes(caseName)) {
      showTab("cases");
      renderCases(caseName);
      speakSteps([caseName].concat(CASES[caseName]));
      return;
    }
  }
  alert("لم أتعرف على الحالة، حاول مرة أخرى.");
};

// ===================== الأحداث =====================
document.getElementById("emergencyBtn").onclick = () => recognition.start();
renderCases();

// ===================== نموذج التسجيل =====================
document.getElementById("registerForm").onsubmit = e => {
  e.preventDefault();
  alert("تم استلام بياناتك بنجاح ✅");
  e.target.reset();
};
