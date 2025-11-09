// ================== البيانات الأساسية للحالات ==================
const CASES = {
  "الحروق": [
    "حروق الدرجة الأولى (الخفيفة):",
    "إجراءات إسعافية:",
    "افعل (√):",
    "تبريد الحرق للمساعدة بوضع المنطقة المصابة تحت الماء الجاري لمدة 10-15 دقيقة.",
    "إزالة الإكسسوارات والملابس برفق.",
    "تغطية منطقة الحرق بضمادة رطبة أو قطعة قماش نظيفة.",
    "أخذ مسكن إذا لزم الأمر.",
    "اطلب المساعدة فورًا إذا كانت الحروق شديدة أو لاحظت علامات العدوى.",
    "لا تفعل (X):",
    "لا تحاول لمس الفقاعات.",
    "لا تضع أي مراهم أو زبدة أو معجون أسنان.",
    "لا تستخدم الثلج مباشرة.",
    "اتصل بالإسعاف فوراً على 997.",
    "images/الحروق.png"
  ],
  "الصرع": [
    "إجراءات الطوارئ للمصابين بالصرع:",
    "لاحظ الوقت المستغرق في النوبة.",
    "قم بحماية المصاب بإبعاد الأجسام الضارة من حوله.",
    "أبعد النظارات إن كان يرتديها.",
    "ادعم رأس المصاب بقطعة قماش أو جاكيت.",
    "إذا استمرت النوبة أكثر من 5 دقائق، اطلب الإسعاف فوراً.",
    "لا تحاول تقييد حركات المصاب أو وضع شيء في فمه.",
    "بعد انتهاء النوبة، ضع المصاب على جانبه لتأمين مجرى الهواء.",
    "ابقَ معه حتى يستعيد وعيه.",
    "اتصل بالإسعاف فوراً على 997.",
    "vid/الصرع.mp4"
  ],
  "انخفاض السكر": [
    "أعط المصاب شيئًا يحتوي على سكر سريع مثل العصير أو الحلوى.",
    "إذا فقد وعيه لا تعطه شيئًا عن طريق الفم.",
    "راقب تنفسه ونبضه حتى تصل المساعدة.",
    "اتصل بالإسعاف فوراً على 997."
  ],
  "الاختناق": [
    "الوقوف خلف الشخص المصاب.",
    "ضع إحدى قدميك أمام الأخرى قليلاً لتحقيق التوازن.",
    "لف ذراعيك حول خصر الشخص المصاب.",
    "أمل رأسه للأمام قليلاً.",
    "اصنع قبضة بيدك وضعها فوق السرة مباشرة.",
    "امسك القبضة باليد الأخرى واضغط بقوة وسرعة نحو الأعلى.",
    "كرر الضغطات من 6 إلى 10 مرات حتى يزول الجسم العالق.",
    "إذا فقد وعيه، ابدأ بالإنعاش القلبي الرئوي فوراً.",
    "اتصل بالإسعاف فوراً على 997.",
    "images/اختناق.png"
  ]
};

// ================== عناصر DOM ==================
const emergencyBtn = document.getElementById("emergencyBtn");
const casesContainer = document.getElementById("casesContainer");
const caseCard = document.getElementById("caseCard");
const caseTitle = document.getElementById("caseTitle");
const stepsList = document.getElementById("stepsList");
const caseMedia = document.getElementById("caseMedia");
const playBtn = document.getElementById("playBtn");
const stopBtn = document.getElementById("stopBtn");
const backBtn = document.getElementById("backBtn");

let currentSteps = [];

// ================== التبويبات ==================
function showTab(tabId) {
  document.querySelectorAll(".tab").forEach(tab => tab.classList.add("hidden"));
  document.getElementById(tabId).classList.remove("hidden");
  if (tabId === "firstaid") renderCases();
}

// ================== توليد الكروت ==================
function renderCases() {
  casesContainer.innerHTML = "";
  for (const [caseName, steps] of Object.entries(CASES)) {
    const card = document.createElement("div");
    card.className = "case-card";

    const title = document.createElement("h3");
    title.textContent = caseName;

    // عرض أول سطرين مختصر
    const list = document.createElement("ul");
    steps.slice(0, 2).forEach((step, index) => {
      const li = document.createElement("li");
      li.textContent = `${index + 1}. ${step}`;
      list.appendChild(li);
    });

    // أزرار
    const playBtn = document.createElement("button");
    playBtn.textContent = "إعادة الاستماع";
    playBtn.onclick = () => speakSteps(steps);

    const stopBtn = document.createElement("button");
    stopBtn.textContent = "إيقاف";
    stopBtn.onclick = stopSpeech;

    const backBtn = document.createElement("button");
    backBtn.textContent = "رجوع";
    backBtn.onclick = () => card.remove();

    const callBtn = document.createElement("button");
    callBtn.textContent = "اتصل بالإسعاف 997";
    callBtn.onclick = () => window.location.href = "tel:997";

    const controls = document.createElement("div");
    controls.className = "card-controls";
    controls.append(playBtn, stopBtn, backBtn, callBtn);

    card.append(title, list, controls);
    card.onclick = () => showSteps(caseName, steps);
    casesContainer.appendChild(card);
  }
}

// ================== عرض خطوات الحالة ==================
function showSteps(caseName, steps) {
  caseTitle.textContent = caseName;
  stepsList.innerHTML = "";
  caseMedia.innerHTML = "";
  currentSteps = steps;

  // عرض الصورة أو الفيديو إذا كان آخر عنصر مسار
  const media = steps[steps.length - 1];
  if (media.endsWith(".png")) {
    const img = document.createElement("img");
    img.src = media;
    caseMedia.appendChild(img);
  } else if (media.endsWith(".mp4")) {
    const vid = document.createElement("video");
    vid.src = media;
    vid.controls = true;
    vid.autoplay = false;
    caseMedia.appendChild(vid);
  }

  // باقي الخطوات
  steps.slice(0, -1).forEach((step, index) => {
    const li = document.createElement("li");
    li.className = "step";
    li.textContent = `${index + 1}. ${step}`;
    li.onclick = () => window.location.href = "tel:997";
    li.onmousedown = () => li.classList.toggle("done");
    stepsList.appendChild(li);
  });

  caseCard.classList.remove("hidden");
  speakSteps(steps.slice(0, -1));
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
function stopSpeech() { window.speechSynthesis.cancel(); }

// ================== التبويبات ==================
document.querySelectorAll("nav button").forEach(btn => {
  btn.addEventListener("click", () => {
    const tabId = btn.getAttribute("data-tab");
    showTab(tabId);
  });
});

// ================== التعرف الصوتي ==================
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SR();
  recognition.lang = "ar-SA";
  recognition.continuous = true;

  recognition.onresult = function (e) {
    const text = e.results[e.results.length - 1][0].transcript.trim();
    for (const [caseName, steps] of Object.entries(CASES)) {
      if (text.includes(caseName)) { showSteps(caseName, steps); return; }
    }
  };

  recognition.start();
  emergencyBtn.onclick = () => recognition.start();
}

// ================== نموذج التسجيل ==================
document.getElementById("registerForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = Object.fromEntries(new FormData(e.target).entries());
  const API_URL = "https://sheetdb.io/api/v1/pp3tkazlfqhvu";
  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data: formData })
  });
  alert("تم إرسال البيانات بنجاح!");
  e.target.reset();
});
