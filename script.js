// ================== بيانات الحالات ==================
const CASES = {
  "الصرع": [
    "لاحظ الوقت المستنفذ في النوبة.",
    "أزل الأجسام القريبة من المصاب لتفادي الأذى.",
    "ادعم رأس المصاب بقطعة قماش أو جاكيت.",
    "ضع المصاب في وضع الإفاقة بعد انتهاء النوبة.",
    "طمئن المصاب وانتظر حتى يستعيد وعيه.",
    "إذا استمرت النوبة أكثر من خمس دقائق اطلب الإسعاف فوراً على 997."
  ],
  "الاختناق": [
    "إذا كان المصاب قادراً على التنفس فعليه الاستمرار في السعال.",
    "إذا كان غير قادر على الكلام أو البكاء قم بالخطوات التالية:",
    "قف خلف المصاب وضع إحدى قدميك أمام الأخرى لتحقيق التوازن.",
    "لف ذراعيك حول خصره وأمل رأسه قليلاً للأمام.",
    "اجعل قبضة يدك فوق السرة واضغط بقوة إلى الأعلى.",
    "كرر من 6 إلى 10 ضغطات حتى يزول الجسم العالق.",
    "إذا فقد وعيه قم بالإنعاش القلبي الرئوي واتصل فوراً على 997."
  ],
  "انخفاض الضغط": [
    "أجعل المصاب يستلقي وارفع ساقيه قليلاً.",
    "فك الملابس الضيقة لتسهيل التنفس.",
    "أعطه ماءً إذا كان واعياً.",
    "راقب تنفسه ونبضه.",
    "إذا لم يتحسن خلال دقائق اتصل بالإسعاف 997."
  ],
  "الحروق": [
    "برّد منطقة الحرق بماء معتدل الحرارة لمدة 10 إلى 15 دقيقة.",
    "أزل الإكسسوارات أو الملابس برفق قبل تورم المنطقة.",
    "غطِ الحرق بقطعة قماش نظيفة ورطبة.",
    "لا تلمس الفقاعات الناتجة ولا تضع أي مرهم أو معجون.",
    "إذا كانت الحروق شديدة أو ممتدة اتصل بالطوارئ 997."
  ]
};

// ================== عناصر DOM ==================
const casesContainer = document.getElementById("casesContainer");
const caseCard = document.getElementById("caseCard");
const caseTitle = document.getElementById("caseTitle");
const stepsList = document.getElementById("stepsList");
const playBtn = document.getElementById("playBtn");
const stopBtn = document.getElementById("stopBtn");
const backBtn = document.getElementById("backBtn");
const emergencyBtn = document.getElementById("emergencyBtn");

// ================== عرض التبويبات ==================
function showTab(tabId) {
  document.querySelectorAll(".tab").forEach(tab => tab.classList.add("hidden"));
  document.getElementById(tabId).classList.remove("hidden");
}

// ================== إنشاء كروت الحالات ==================
function renderCases() {
  casesContainer.innerHTML = "";
  for (const [name, steps] of Object.entries(CASES)) {
    const card = document.createElement("div");
    card.className = "case-card";
    const title = document.createElement("h3");
    title.textContent = name;

    const list = document.createElement("ul");
    list.className = "mini-steps";
    steps.slice(0, 2).forEach(step => {
      const li = document.createElement("li");
      li.textContent = step;
      list.appendChild(li);
    });

    const controls = document.createElement("div");
    controls.className = "card-controls";
    const btnPlay = document.createElement("button");
    btnPlay.textContent = "إعادة الاستماع";
    btnPlay.onclick = () => speakSteps(name);

    const btnStop = document.createElement("button");
    btnStop.textContent = "إيقاف";
    btnStop.onclick = stopSpeech;

    const btnBack = document.createElement("button");
    btnBack.textContent = "رجوع";
    btnBack.onclick = () => {
      caseCard.classList.add("hidden");
      showTab("firstaid");
      stopSpeech();
    };

    const callBtn = document.createElement("a");
    callBtn.href = "tel:997";
    callBtn.className = "call-btn";
    callBtn.textContent = "اتصل بالطوارئ";

    controls.append(btnPlay, btnStop, btnBack, callBtn);
    card.append(title, list, controls);
    card.onclick = () => showSteps(name, steps);
    casesContainer.appendChild(card);
  }
}

// ================== عرض خطوات الحالة ==================
function showSteps(name, steps) {
  caseTitle.textContent = name;
  stepsList.innerHTML = "";
  steps.forEach((step, i) => {
    const div = document.createElement("div");
    div.className = "step";
    div.innerHTML = `<strong>${i + 1}.</strong> ${step}`;
    div.onclick = () => div.classList.toggle("done");
    stepsList.appendChild(div);
  });
  caseCard.classList.remove("hidden");
  speakSteps(name);
}

// ================== الصوت ==================
function speakSteps(name) {
  const steps = CASES[name];
  if (!("speechSynthesis" in window)) return;
  const utter = new SpeechSynthesisUtterance(steps.join("، ثم "));
  utter.lang = "ar-SA";
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utter);
}

function stopSpeech() {
  window.speechSynthesis.cancel();
}

// ================== التبويبات ==================
document.querySelectorAll("nav button").forEach(btn => {
  btn.addEventListener("click", () => {
    const tabId = btn.getAttribute("data-tab");
    showTab(tabId);
    if (tabId === "firstaid") renderCases();
  });
});

// ================== زر العودة ==================
backBtn.onclick = () => {
  caseCard.classList.add("hidden");
  stopSpeech();
  showTab("firstaid");
};

// ================== التعرف الصوتي ==================
if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SR();
  recognition.lang = "ar-SA";
  recognition.continuous = true;

  recognition.onresult = (e) => {
    const text = e.results[e.results.length - 1][0].transcript.trim();
    for (const [key, steps] of Object.entries(CASES)) {
      if (text.includes(key)) {
        showSteps(key, steps);
        return;
      }
    }
  };

  emergencyBtn.onclick = () => recognition.start();
}
