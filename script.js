// ================== البيانات الأساسية للحالات ==================
const CASES = {
  "إجراءات الطوارئ في حالة الحروق": [
    "حروق الدرجة الأولى (الخفيفة):",
    "إجراءات إسعافية:",
    "افعل (√):",
    "تبريد الحرق للمساعدة في تهدئة الألم بوضع المنطقة المصابة تحت ماء جاري معتدل البرودة لمدة 10-15 دقيقة.",
    "إزالة الإكسسوارات والملابس الضيقة قبل انتفاخ المنطقة.",
    "تغطية منطقة الحرق بضمادة رطبة أو قطعة قماش نظيفة.",
    "أخذ مسكن الألم إذا لزم الأمر.",
    "لا تفعل (X):",
    "لا تحاول لمس الفقاعات.",
    "لا تضع أي مراهم أو زبدة أو معجون أسنان على الحرق.",
    "لا تستخدم الثلج مباشرة.",
    "اتصل بالإسعاف فوراً على 997."
  ],

  "إجراءات الطوارئ للمصابين بالصرع": [
    "لاحظ الوقت المستغرق في النوبة.",
    "احمِ المصاب من الأجسام المحيطة.",
    "أبعد النظارات إن كان يرتديها.",
    "ادعم رأس المصاب بقطعة قماش أو جاكيت.",
    "إذا استمرت النوبة أكثر من 5 دقائق، اطلب الإسعاف فوراً.",
    "لا تقيّد حركات المصاب ولا تضع شيء في فمه.",
    "بعد انتهاء النوبة، ضع المصاب على جانبه.",
    "ابقَ معه حتى يستعيد وعيه.",
    "اتصل بالإسعاف فوراً على 997 إذا لم يستعد وعيه."
  ],

  "إجراءات الطوارئ في حالة انخفاض السكر": [
    "أعط المصاب شيئًا يحتوي على سكر سريع مثل العصير أو الحلوى.",
    "إذا فقد وعيه لا تعطه شيئًا عن طريق الفم.",
    "راقب تنفسه ونبضه.",
    "اتصل بالإسعاف فوراً على 997."
  ],

  "إجراءات الطوارئ في حالة الاختناق": [
    "الوقوف خلف الشخص المصاب.",
    "ضع إحدى قدميك أمام الأخرى لتحقيق التوازن.",
    "لف ذراعيك حول خصر الشخص المصاب.",
    "أمل رأسه للأمام قليلاً.",
    "اصنع قبضة وضعها فوق السرة.",
    "اضغط بالقبضة الأخرى بقوة وسرعة نحو الأعلى.",
    "كرر من 6 إلى 10 مرات حتى يزول الجسم العالق.",
    "إذا فقد وعيه، ابدأ بالإنعاش القلبي الرئوي فوراً.",
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
  if(tabId === "firstaid") renderCases();
}
document.querySelectorAll("nav button").forEach(btn => {
  btn.addEventListener("click", () => {
    showTab(btn.dataset.tab);
  });
});

// ================== توليد الكروت ==================
function renderCases() {
  casesContainer.innerHTML = "";
  for(const [caseName, steps] of Object.entries(CASES)) {
    const card = document.createElement("div");
    card.className = "case-card";
    const title = document.createElement("h3");
    title.textContent = caseName;
    const miniList = document.createElement("ul");
    steps.slice(0,2).forEach((step,i)=>{
      const li = document.createElement("li");
      li.textContent = `${i+1}. ${step}`;
      miniList.appendChild(li);
    });
    card.append(title, miniList);
    card.onclick = () => showSteps(caseName, steps);
    casesContainer.appendChild(card);
  }
}

// ================== عرض خطوات الحالة ==================
function showSteps(caseName, steps){
  currentSteps = steps;
  caseTitle.textContent = caseName;
  stepsList.innerHTML = "";
  steps.forEach((step,index)=>{
    const li = document.createElement("li");
    li.textContent = `${index+1}. ${step}`;
    li.onclick = ()=>{ 
      if(confirm("هل تريد الاتصال بالإسعاف 997؟")){
        window.location.href="tel:997";
      }
    };
    li.onmousedown = ()=> li.classList.toggle("done");
    stepsList.appendChild(li);
  });
  caseCard.classList.remove("hidden");
  speakSteps(steps);
}

// ================== دوال الصوت ==================
function speakSteps(steps=currentSteps){
  if(!("speechSynthesis" in window)) return;
  const utter = new SpeechSynthesisUtterance(steps.join("، ثم "));
  utter.lang="ar-SA";
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utter);
}
function stopSpeech(){ window.speechSynthesis.cancel(); }

// ================== أزرار الكارد ==================
playBtn.onclick = ()=> speakSteps(currentSteps);
stopBtn.onclick = stopSpeech;
backBtn.onclick = ()=> caseCard.classList.add("hidden");
callBtn.onclick = ()=>{
  if(confirm("هل تريد الاتصال بالإسعاف 997؟")) window.location.href="tel:997";
}

// ================== التعرف الصوتي ==================
if('webkitSpeechRecognition' in window || 'SpeechRecognition' in window){
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SR();
  recognition.lang="ar-SA";
  recognition.continuous=true;

  recognition.onresult = (e)=>{
    const text = e.results[e.results.length-1][0].transcript.trim();
    for(const [caseName, steps] of Object.entries(CASES)){
      if(text.includes(caseName)){
        showSteps(caseName, steps);
        return;
      }
    }
  };
  recognition.start();
  emergencyBtn.onclick = ()=> recognition.start();
}


