const CASES = {
  "الحروق": {
    steps: [
      "تبريد الحرق بالماء الجاري 10-15 دقيقة",
      "إزالة الاكسسوارات أو الملابس برفق",
      "تغطية المنطقة بضمادة رطبة أو قطعة قماش نظيفة",
      "أخذ مسكن إذا لزم الأمر",
      "طلب المساعدة فورًا إذا كانت الحروق شديدة"
    ],
    image: "images/burn.jpg"
  },
  "الصرع": {
    steps: [
      "لاحظ الوقت المستنفذ في النوبة",
      "حماية المصاب وإبعاد الأجسام الضارة",
      "دعم رأس الشخص لمنع إصابته بالأرض",
      "في حال استمرار النوبة أكثر من 5 دقائق اطلب الإسعاف",
      "وضع المصاب في وضع الإفاقة بعد انتهاء النوبة"
    ],
    video: "https://www.youtube.com/embed/gynQdWDHbeI?start=101"
  },
  "الإختناق": {
    steps: [
      "الوقوف خلف الشخص المصاب",
      "وضع إحدى القدمين أمام الأخرى قليلاً لتحقيق التوازن",
      "لف الذراعين حول خصر الشخص المصاب",
      "إمالة الشخص المصاب إلى الأمام قليلاً",
      "عمل قبضة باليد الأُخرى ووضعها فوق منطقة السرة",
      "توجيه ضغطة بقوة على البطن بسرعة نحو الأعلى",
      "كرر الضغطات حتى يزول الجسم العالق",
      "إذا فقد الشخص وعيه قم بالإنعاش القلبي الرئوي"
    ],
    image: "images/إرشادات عامة للحروق.png"
  }
};

const emergencyBtn = document.getElementById("emergencyBtn");
const casesContainer = document.getElementById("casesContainer");
const caseCard = document.getElementById("caseCard");
const caseTitle = document.getElementById("caseTitle");
const caseImage = document.getElementById("caseImage");
const caseVideo = document.getElementById("caseVideo");
const stepsList = document.getElementById("stepsList");
const playBtn = document.getElementById("playBtn");
const stopBtn = document.getElementById("stopBtn");
const backBtn = document.getElementById("backBtn");
const mediaBtn = document.getElementById("mediaBtn");

let currentSteps = [];
let currentMedia = { image: "", video: "" };

function showTab(tabId, event) {
  document.querySelectorAll(".tab").forEach(t => t.classList.add("hidden"));
  document.getElementById(tabId).classList.remove("hidden");
  document.querySelectorAll(".nav-tab").forEach(t => t.classList.remove("active"));
  event.currentTarget.classList.add("active");
  caseCard.classList.add("hidden");
  window.speechSynthesis.cancel();
}

function renderCases() {
  casesContainer.innerHTML = "";
  for (const [caseName, obj] of Object.entries(CASES)) {
    const card = document.createElement("div");
    card.className = "case-card";
    card.textContent = caseName;
    card.onclick = () => showSteps(caseName, obj.steps, obj.image, obj.video);
    casesContainer.appendChild(card);
  }
}

function showSteps(caseName, steps, image = "", video = "") {
  caseTitle.textContent = caseName;
  caseImage.src = image;
  caseImage.style.display = image ? "block" : "none";
