// ================== البيانات الأساسية للحالات ==================
const CASES = {
  "الحروق": [
    "حروق الدرجة الأولى (الخفيفة):",
    "إجراءات إسعافية:",
    "افعل (√):",
    "تبريد الحرق تحت الماء المعتدل 10-15 دقيقة.",
    "إزالة الإكسسوارات أو الملابس بسرعة قبل التضخم.",
    "تغطية الحرق بضمادة رطبة أو قطعة قماش نظيفة.",
    "أخذ مسكن إذا لزم.",
    "اطلب المساعدة فوراً إذا كانت الحروق شديدة.",
    "لا تفعل (X):",
    "لا تلمس الفقاعات أو تضع مراهم أو زبدة.",
    "لا تستخدم الثلج مباشرة.",
    "اتصل بالإسعاف فوراً على 997."
  ],
  "الصرع": [
    "إجراءات الطوارئ للمصابين بالصرع:",
    "لاحظ الوقت المستغرق في النوبة.",
    "حماية المصاب بإبعاد الأجسام الضارة.",
    "أبعد النظارات إن كان يرتديها.",
    "ادعم رأس المصاب لتفادي الضربات.",
    "إذا استمرت النوبة أكثر من 5 دقائق، اطلب الإسعاف فوراً.",
    "لا تضع شيء في فم المصاب.",
    "بعد النوبة ضع المصاب على جانبه.",
    "ابقَ معه حتى يستعيد وعيه.",
    "اتصل بالإسعاف فوراً إذا لم يستعد وعيه."
  ],
  "انخفاض السكر": [
    "أعط المصاب شيئًا يحتوي على سكر سريع.",
    "إذا فقد وعيه لا تعطه شيئًا عن طريق الفم.",
    "راقب تنفسه ونبضه حتى تصل المساعدة.",
    "اتصل بالإسعاف فوراً على 997."
  ],
  "الاختناق": [
    "الوقوف خلف الشخص المصاب.",
    "ضع إحدى قدميك أمام الأخرى قليلاً لتحقيق التوازن.",
    "لف ذراعيك حول خصر الشخص المصاب.",
    "أمل رأسه للأمام قليلاً.",
    "اصنع قبضة فوق السرة.",
    "اضغط باليد الأخرى نحو الأعلى 6-10 مرات.",
    "إذا فقد وعيه، ابدأ بالإنعاش القلبي الرئوي.",
    "اتصل بالإسعاف فوراً على 997."
  ]
};

// ================== عناصر DOM ==================
const emergencyBtn = document.getElementById("emergencyBtn");
const casesContainer = document.getElementById("casesContainer");
const caseCard = document.getElementById("caseCard");
const caseTitle = document.getElementById("caseTitle");
const stepsList = document.getElementById("stepsList");
const playBtn = document.getElementById("playBtn");
const stopBtn = document.getElementById("stopBtn");
const backBtn = document.getElementById("backBtn");
const callBtn = document.getElementById("callBtn");

let currentSteps = [];

// ================== التبويبات ==================
function showTab(tabId) {
  document.querySelectorAll(".tab").forEach(tab => tab.classList.add("hidden"));
  document.getElementById(tabId).classList.remove("hidden");
  caseCard.classList.add("hidden"); // إخفاء الكارد عند تغيير التبويب
  if(tabId === "firstaid") renderCases();
}

// ================== توليد كروت الحالات ==================
function renderCases() {
  casesContainer.innerHTML = "";
  for(const [caseName, steps] of Object.entries(CASES)) {
    const card = document.createElement("div");
    card.className = "case-card";
    card.innerHTML = `<h3>${caseName}</h3><ul class="mini-steps"><li>${steps[0]}</li><li>${steps[1]}</li></ul>`;
    card.onclick = () => showSteps(caseName, steps);
    casesContainer.appendChild(card);
  }
}

// ================== عرض خطوات الحالة ==================
function showSteps(caseName, steps) {
  caseTitle.textContent = caseName;
  stepsList.innerHTML = "";
  currentSteps = steps;
  steps.forEach((step, index) => {
    const li = document.createElement("li");
    li.textContent = `${index+1}. ${step}`;
    li.onclick = () => {
      if(confirm("هل تريد الاتصال بالإسعاف 997؟")) {
        window.location.href = "tel:997";
      }
    };
    li.onmousedown = () => li.classList.toggle("highlight");
    stepsList.appendChild(li);
  });
  caseCard.classList.remove("hidden");
  speakSteps(steps);
}

// ================== القراءة الصوتية ==================
function speakSteps(steps = currentSteps) {
  if(!("speechSynthesis" in window)) return;
  const utter = new SpeechSynthesisUtterance(steps.join("، ثم "));
  utter.lang = "ar-SA";
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utter);
}

// ================== إيقاف الصوت ==================
function stopSpeech() { window.speechSynthesis.cancel(); }

// ================== أزرار التحكم ==================
playBtn.onclick = () => speakSteps();
stopBtn.onclick = stopSpeech;
backBtn.onclick = () => caseCard.classList.add("hidden");
callBtn.onclick = () => {
  if(confirm("هل تريد الاتصال بالإسعاف 997؟")) window.location.href = "tel:997";
};

// ================== التبويبات تعمل بالنقر ==================
document.querySelectorAll("nav button").forEach(btn => {
  btn.addEventListener("click", () => {
    showTab(btn.getAttribute("data-tab"));
  });
});

// ================== زر الطوارئ والتعرف الصوتي ==================
if('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SR();
  recognition.lang = "ar-SA";
  recognition.continuous = true;
  recognition.onresult = function(e) {
    const text = e.results[e.results.length-1][0].transcript.trim();
    for(const [caseName, steps] of Object.entries(CASES)) {
      if(text.includes(caseName)) { showSteps(caseName, steps); return; }
    }
  };
  recognition.start();
  emergencyBtn.onclick = () => recognition.start();
}
