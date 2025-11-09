// ================== البيانات الأساسية للحالات ==================
const CASES = {
  "الحروق": [
    { text: "تبريد الحرق بوضع المنطقة تحت الماء الجاري لمدة 10-15 دقيقة", image: "images/الحروق.png" },
    { text: "إزالة الاكسسوارات والملابس بعناية" },
    { text: "تغطية الحرق بضمادة رطبة أو قطعة قماش نظيفة" },
    { text: "أخذ مسكن الألم إذا لزم الأمر" },
    { text: "اتصل بالإسعاف فوراً على 997" }
  ],
  "الصرع": [
    { text: "ملاحظة الوقت المستنفذ في النوبة", video: "https://www.youtube.com/embed/gynQdWDHbeI?start=101" },
    { text: "حماية المصاب وإبعاد أي مخاطر", video: "https://www.youtube.com/embed/gynQdWDHbeI?start=101" },
    { text: "دعم الرأس بوضع قطعة قماش أو جاكيت", video: "https://www.youtube.com/embed/gynQdWDHbeI?start=101" },
    { text: "ملازمة المصاب حتى يستعيد وعيه" },
    { text: "التحقق من فمه بعد انتهاء النوبة" },
    { text: "إذا كان التنفس صعب الاتصال بالإسعاف فوراً" }
  ],
  "انخفاض السكر": [
    { text: "أعط المصاب شيئاً يحتوي على سكر سريع مثل العصير" },
    { text: "إذا فقد وعيه لا تعطه شيئاً عن طريق الفم" },
    { text: "راقب تنفسه حتى تصل المساعدة" },
    { text: "اتصل بالإسعاف فوراً على 997" }
  ],
  "الإختناق": [
    { text: "الوقوف خلف الشخص المصاب", image: "images/اختناق.png" },
    { text: "وضع إحدى القدمين أمام الأخرى لتحقيق التوازن" },
    { text: "لف الذراعين حول خصر المصاب" },
    { text: "إمالة المصاب إلى الأمام قليلاً" },
    { text: "عمل قبضة باليد الأخرى ووضعها فوق السرة" },
    { text: "توجيه ضغطة بقوة على البطن بسرعة نحو الأعلى" },
    { text: "6-10 ضغطات بطنية حتى يزول الجسم العالق" },
    { text: "إذا فقد المصاب وعيه قم بالإنعاش القلبي الرئوي" }
  ]
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
  });
});

// ================== توليد كروت الحالات ==================
function renderCases() {
  casesContainer.innerHTML = "";
  for (const [caseName, steps] of Object.entries(CASES)) {
    const card = document.createElement("div");
    card.className = "case-card";
    const title = document.createElement("h3");
    title.textContent = caseName;
    card.appendChild(title);
    card.onclick = () => showSteps(caseName, steps);
    casesContainer.appendChild(card);
  }
}

// ================== عرض خطوات الحالة ==================
function showSteps(caseName, steps) {
  currentSteps = steps.map(s => s.text);
  caseTitle.textContent = caseName;
  stepsList.innerHTML = "";
  imageContainer.innerHTML = "";

  steps.forEach(step => {
    const li = document.createElement("li");
    li.textContent = step.text;
    li.onclick = () => {
      if(step.text.includes("997")) window.location.href = "tel:997";
    };
    li.onmousedown = () => li.classList.toggle("highlight");
    stepsList.appendChild(li);

    if(step.image) {
      const img = document.createElement("img");
      img.src = step.image;
      imageContainer.appendChild(img);
    }
    if(step.video) {
      const videoBtn = document.createElement("button");
      videoBtn.textContent = "مشاهدة الفيديو";
      videoBtn.onclick = () => {
        videoFrame.src = step.video;
        videoPopup.classList.remove("hidden");
      };
      imageContainer.appendChild(videoBtn);
    }
  });

  caseCard.classList.remove("hidden");
  speakSteps(currentSteps);
}

// ================== القراءة الصوتية ==================
function speakSteps(steps = currentSteps) {
  if (!("speechSynthesis" in window)) return;
  const utter = new SpeechSynthesisUtterance(steps.join("، ثم "));
  utter.lang = "ar-SA";
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utter);
}

// ================== إيقاف الصوت ==================
stopBtn.onclick = () => window.speechSynthesis.cancel();

// ================== إعادة التشغيل ==================
playBtn.onclick = () => speakSteps();

// ================== زر الرجوع ==================
backBtn.onclick = () => caseCard.classList.add("hidden");

// ================== إغلاق الفيديو ==================
closePopup.onclick = () => {
  videoFrame.src = "";
  videoPopup.classList.add("hidden");
};

// ================== التعرف الصوتي ==================
if('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SR();
  recognition.lang = "ar-SA";
  recognition.continuous = true;

  recognition.onresult = (e) => {
    const text = e.results[e.results.length - 1][0].transcript.trim();
    for(const [caseName, steps] of Object.entries(CASES)){
      if(text.includes(caseName)){
        showSteps(caseName, steps);
        break;
      }
    }
  };
  recognition.start();
  emergencyBtn.onclick = () => recognition.start();
}

// ================== بدء توليد الكروت ==================
renderCases();
