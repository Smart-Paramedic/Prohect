const CASES = {
  "الحروق": [
    "تبريد الحرق بالماء الجاري لمدة 10 دقائق",
    "إزالة الملابس برفق إن لم تكن ملتصقة",
    "تغطية الحرق بقطعة قماش نظيفة",
    "عدم وضع مراهم أو مواد دهنية",
    "الاتصال بالطوارئ إذا كانت الحروق شديدة"
  ],
  "الصرع": [
    "عدم تقييد المصاب أو محاولة إيقاف النوبة",
    "إبعاد الأجسام الحادة من حوله",
    "وضع المصاب على جانبه بعد انتهاء النوبة",
    "مراقبة التنفس",
    "الاتصال بالطوارئ إذا استمرت النوبة أكثر من 5 دقائق"
  ],
  "انخفاض الضغط": [
    "مساعدة المصاب على الاستلقاء ورفع قدميه",
    "تشجيعه على شرب الماء",
    "تجنب الوقوف المفاجئ",
    "الاتصال بالطوارئ إذا فقد الوعي"
  ],
  "الاختناق": [
    "الوقوف خلف المصاب",
    "الضغط على البطن بحركات سريعة للأعلى",
    "تكرار الضغطات حتى يزول الجسم العالق",
    "الاتصال بالطوارئ إذا فقد المصاب وعيه"
  ]
};

const emergencyBtn = document.getElementById("emergencyBtn");
const casesContainer = document.getElementById("casesContainer");
const tabs = document.querySelectorAll(".tab");
const navTabs = document.querySelectorAll(".nav-tab");

let currentUtterance = null;

function showTab(tabId, event) {
  tabs.forEach(tab => tab.classList.add("hidden"));
  document.getElementById(tabId).classList.remove("hidden");

  navTabs.forEach(tab => tab.classList.remove("active"));
  event.currentTarget.classList.add("active");

  stopSpeech();
}

function renderCases() {
  casesContainer.innerHTML = "";
  for (const [caseName, steps] of Object.entries(CASES)) {
    const card = document.createElement("div");
    card.className = "case-card";

    const title = document.createElement("h3");
    title.textContent = caseName;

    const list = document.createElement("ul");
    list.className = "steps-list";
    steps.forEach(step => {
      const li = document.createElement("li");
      li.textContent = step;
      list.appendChild(li);
    });

    const callBtn = document.createElement("button");
    callBtn.className = "call-btn";
    callBtn.textContent = "📞 الاتصال بالطوارئ";
    callBtn.onclick = () => {
      if (confirm("هل تريد الاتصال بالطوارئ 997؟")) {
        window.location.href = "tel:997";
      }
    };

    card.appendChild(title);
    card.appendChild(list);
    card.appendChild(callBtn);
    card.onclick = () => {
      stopSpeech();
      speakSteps(steps);
    };

    casesContainer.appendChild(card);
  }
}

function speakSteps(steps) {
  if (!("speechSynthesis" in window)) return;
  const text = steps.join("، ثم ");
  currentUtterance = new SpeechSynthesisUtterance(text);
  currentUtterance.lang = "ar-SA";
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(currentUtterance);
}

function stopSpeech() {
  window.speechSynthesis.cancel();
  currentUtterance = null;
}

emergencyBtn.onclick = () => {
  stopSpeech();
  const allSteps = Object.values(CASES).flat();
  speakSteps(allSteps);
};

document.addEventListener("DOMContentLoaded", renderCases);
