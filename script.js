// ================== البيانات الأساسية للحالات ==================
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
    image: "images/seizure.jpg"
  },
  "انخفاض السكر": {
    steps: [
      "أعط المصاب شيئاً يحتوي على سكر سريع",
      "إذا فقد وعيه لا تعطه شيئاً عن طريق الفم",
      "راقب تنفسه حتى تصل المساعدة",
      "اتصل بالإسعاف فوراً على 997"
    ],
    image: ""
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
    image: "images/choking.jpg"
  }
};

// ================== عناصر DOM ==================
const emergencyBtn = document.getElementById("emergencyBtn");
const casesContainer = document.getElementById("casesContainer");
const caseCard = document.getElementById("caseCard");
const caseTitle = document.getElementById("caseTitle");
const caseImage = document.getElementById("caseImage");
const stepsList = document.getElementById("stepsList");
const playBtn = document.getElementById("playBtn");
const stopBtn = document.getElementById("stopBtn");
const backBtn = document.getElementById("backBtn");

let currentSteps = [];

// ================== التبويبات ==================
function showTab(tabId, event){
  document.querySelectorAll(".tab").forEach(t => t.classList.add("hidden"));
  document.getElementById(tabId).classList.remove("hidden");
  document.querySelectorAll(".nav-tab").forEach(t => t.classList.remove("active"));
  event.currentTarget.classList.add("active");
  caseCard.classList.add("hidden");
  window.speechSynthesis.cancel();
}

// ================== توليد كروت الحالات ==================
function renderCases() {
  casesContainer.innerHTML = "";
  for (const [caseName, obj] of Object.entries(CASES)) {
    const card = document.createElement("div");
    card.className = "case-card";
    card.textContent = caseName;
    card.onclick = () => showSteps(caseName, obj.steps, obj.image);
    casesContainer.appendChild(card);
  }
}

// ================== عرض خطوات الحالة ==================
function showSteps(caseName, steps, image="") {
  caseTitle.textContent = caseName;
  caseImage.src = image;
  caseImage.style.display = image? "block":"none";
  stepsList.innerHTML = "";
  currentSteps = steps;
  steps.forEach((step,index)=>{
    const li = document.createElement("li");
    li.textContent = `${index+1}. ${step}`;
    li.onclick = ()=>{
      if(confirm("هل تريد الاتصال بالإسعاف 997؟")) window.location.href="tel:997";
    };
    li.onmousedown = ()=>li.classList.toggle("highlight");
    stepsList.appendChild(li);
  });
  caseCard.classList.remove("hidden");
  speakSteps(steps);
}

// ================== القراءة الصوتية ==================
function speakSteps(steps = currentSteps){
  if(!("speechSynthesis" in window)) return;
  const utter = new SpeechSynthesisUtterance(steps.join("، ثم "));
  utter.lang = "ar-SA";
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utter);
}

// ================== إيقاف الصوت ==================
function stopSpeech(){ window.speechSynthesis.cancel(); }

// ================== أزرار التحكم ==================
playBtn.onclick = ()=>speakSteps(currentSteps);
stopBtn.onclick = stopSpeech;
backBtn.onclick = ()=>caseCard.classList.add("hidden");

// ================== الاستماع الصوتي ==================
if('webkitSpeechRecognition' in window || 'SpeechRecognition' in window){
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SR();
  recognition.lang = "ar-SA";
  recognition.continuous = true;
  recognition.onresult = function(e){
    const text = e.results[e.results.length-1][0].transcript.trim();
    for(const [caseName, obj] of Object.entries(CASES)){
      if(text.includes(caseName)){ showSteps(caseName,obj.steps,obj.image); return; }
    }
  };
  recognition.start();
  emergencyBtn.onclick = ()=>recognition.start();
}

// ================== عند فتح التبويب الإسعافات الأولية ==================
document.addEventListener("DOMContentLoaded", renderCases);
