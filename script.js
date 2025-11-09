// ================== البيانات الأساسية للحالات ==================
const CASES = {
  "الحروق": {
    steps: [
      "تبريد الحرق بوضع المنطقة تحت الماء الجاري لمدة 10‑15 دقيقة",
      "إزالة الاكسسوارات والملابس بعناية",
      "تغطية الحرق بضمادة رطبة أو قطعة قماش نظيفة",
      "أخذ مسكن الألم إذا لزم الأمر",
      "اتصل بالإسعاف فوراً على 997"
    ],
    image: "images/الحروق.png",
    video: null
  },
  "الصرع": {
    steps: [
      "ملاحظة الوقت المستنفذ في النوبة",
      "حماية المصاب وإبعاد أي مخاطر",
      "دعم رأس المصاب بقطعة قماش أو جاكيت",
      "إذا استمرت النوبة أكثر من 5 دقائق اطلب الإسعاف فوراً",
      "وضع المصاب في وضع الإفاقة بعد انتهاء النوبة",
      "اتصل بالإسعاف فوراً على 997"
    ],
    image: null,
    video: "https://www.youtube.com/embed/gynQdWDHbeI?start=101"
  },
  "انخفاض السكر": {
    steps: [
      "أعط المصاب شيئاً يحتوي على سكر سريع مثل العصير",
      "إذا فقد وعيه لا تعطه شيئاً عن طريق الفم",
      "راقب تنفسه حتى تصل المساعدة",
      "اتصل بالإسعاف فوراً على 997"
    ],
    image: null,
    video: null
  },
  "الإختناق": {
    steps: [
      "الوقوف خلف الشخص المصاب",
      "وضع إحدى القدمين أمام الأخرى لتحقيق التوازن",
      "لف الذراعين حول خصر الشخص المصاب",
      "إمالة الشخص المصاب إلى الأمام قليلاً",
      "عمل قبضة باليد الأخرى ووضعها فوق منطقة السرة",
      "توجيه ضغطة بقوة على البطن بسرعة نحو الأعلى",
      "كرر الضغطات حتى يزول الجسم العالق",
      "إذا فقد المصاب وعيه قم بالإنعاش القلبي الرئوي",
      "اتصل بالإسعاف فوراً على 997"
    ],
    image: "images/اختناق.png",
    video: null
  }
};

// ================== عناصر DOM ==================
const casesContainer = document.getElementById("casesContainer");
const caseCard = document.getElementById("caseCard");
const caseTitle = document.getElementById("caseTitle");
const stepsList = document.getElementById("stepsList");
const imageContainer = document.getElementById("imageContainer");
const playBtn = document.getElementById("playBtn");
const stopBtn = document.getElementById("stopBtn");
const backBtn = document.getElementById("backBtn");
const emergencyBtn = document.getElementById("emergencyBtn");
const videoPopup = document.getElementById("videoPopup");
const videoFrame = document.getElementById("videoFrame");
const closePopup = document.getElementById("closePopup");

let currentSteps = [];

// ================== التبويبات ==================
document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(t => t.classList.add("hidden"));
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    const tabId = btn.getAttribute("data-tab");
    document.getElementById(tabId).classList.remove("hidden");
    btn.classList.add("active");
    caseCard.classList.add("hidden");
    window.speechSynthesis.cancel();
  });
});

// ================== توليد كروت الحالات ==================
function renderCases() {
  casesContainer.innerHTML = "";
  for (const [caseName, obj] of Object.entries(CASES)) {
    const card = document.createElement("div");
    card.className = "case-card";
    const title = document.createElement("h3");
    title.textContent = caseName;
    card.appendChild(title);
    card.onclick = () => showSteps(caseName, obj);
    casesContainer.appendChild(card);
  }
}

// ================== عرض خطوات الحالة ==================
function showSteps(caseName, obj) {
  currentSteps = obj.steps.slice();
  caseTitle.textContent = caseName;
  stepsList.innerHTML = "";
  imageContainer.innerHTML = "";

  if (obj.image) {
    const img = document.createElement("img");
    img.src = obj.image;
    imageContainer.appendChild(img);
  }
  if (obj.video) {
    const btnVid = document.createElement("button");
    btnVid.textContent = "مشاهدة الفيديو";
    btnVid.onclick = () => {
      videoFrame.src = obj.video;
      videoPopup.classList.remove("hidden");
    };
    imageContainer.appendChild(btnVid);
  }

  obj.steps.forEach((step, index) => {
    const li = document.createElement("li");
    li.textContent = `${index + 1}. ${step}`;
    li.onclick = () => {
      if (step.includes("997")) window.location.href = "tel:997";
    };
    li.onmousedown = () => li.classList.toggle("highlight");
    stepsList.appendChild(li);
  });

  caseCard.classList.remove("hidden");
  speakSteps(currentSteps);
}

// ================== القراءة الصوتية ==================
function speakSteps(steps = currentSteps) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(steps.join("، ثم "));
  utter.lang = "ar-SA";
  window.speechSynthesis.speak(utter);
}

// ================== إيقاف الصوت ==================
stopBtn.onclick = () => window.speechSynthesis.cancel();
// ================== إعادة التشغيل ==================
playBtn.onclick = () => speakSteps();
// ================== الرجوع ==================
backBtn.onclick = () => caseCard.classList.add("hidden");

// ================== إغلاق الفيديو ==================
closePopup.onclick = () => {
  videoFrame.src = "";
  videoPopup.classList.add("hidden");
};

// ================== التعرّف الصوتي ==================
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SR();
  recognition.lang = "ar‑SA";
  recognition.continuous = true;

  recognition.onresult = e => {
    const text = e.results[e.results.length - 1][0].transcript.trim();
    for (const [caseName, obj] of Object.entries(CASES)) {
      if (text.includes(caseName)) {
        showSteps(caseName, obj);
        break;
      }
    }
  };

  recognition.start();
  emergencyBtn.onclick = () => recognition.start();
}

// ================== بدء التشغيل ==================
renderCases();
