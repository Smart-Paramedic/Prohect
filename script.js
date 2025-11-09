// ================== البيانات الأساسية للحالات ==================
const CASES = {
  "الحروق": [
    "حروق الدرجة الأولى (الخفيفة):",
    "إجراءات إسعافية:",
    "افعل (√):",
    "تبريد الحرق للمساعدة في تهدئة الألم بوضع المنطقة تحت الماء الجاري لمدة 10-15 دقيقة.",
    "إزالة الإكسسوارات والملابس قبل تضخم المنطقة.",
    "تغطية الحرق بضمادة رطبة أو قطعة قماش نظيفة.",
    "أخذ مسكن إذا لزم الأمر.",
    "اطلب المساعدة فورًا إذا كانت الحروق شديدة.",
    "لا تفعل (X):",
    "لا تلمس الفقاعات الناتجة من الحرق.",
    "لا تضع أي مراهم أو زبدة أو معجون أسنان.",
    "لا تستخدم الثلج مباشرة.",
    "اتصل بالإسعاف فوراً على 997."
  ],
  "الصرع": [
    "إجراءات الطوارئ للمصابين بالصرع:",
    "لاحظ الوقت المستغرق في النوبة.",
    "قم بحماية المصاب بإبعاد الأجسام الضارة.",
    "أبعد النظارات إن كان يرتديها.",
    "ادعم رأس المصاب بقطعة قماش أو جاكيت.",
    "إذا استمرت النوبة أكثر من 5 دقائق، اطلب الإسعاف فوراً.",
    "لا تحاول تقييد حركات المصاب.",
    "بعد انتهاء النوبة، ضع المصاب على جانبه.",
    "ابقَ معه حتى يستعيد وعيه.",
    "اتصل بالإسعاف فوراً على 997 إذا لم يستعد وعيه."
  ],
  "انخفاض السكر": [
    "أعط المصاب شيئًا يحتوي على سكر سريع مثل العصير.",
    "إذا فقد وعيه لا تعطه شيئًا عن طريق الفم.",
    "راقب تنفسه ونبضه حتى تصل المساعدة.",
    "اتصل بالإسعاف فوراً على 997."
  ],
  "الاختناق": [
    "الوقوف خلف الشخص المصاب.",
    "ضع إحدى قدميك أمام الأخرى قليلاً لتحقيق التوازن.",
    "لف ذراعيك حول خصر الشخص المصاب.",
    "أمل رأسه للأمام قليلاً.",
    "اصنع قبضة بيدك وضعها فوق السرة.",
    "اضغط بقوة وسرعة نحو الأعلى.",
    "كرر الضغطات 6-10 مرات حتى يزول الجسم العالق.",
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

let currentSteps = [];

// ================== التبويبات ==================
function showTab(tabId) {
  document.querySelectorAll(".tab").forEach(tab => tab.classList.add("hidden"));
  document.getElementById(tabId).classList.remove("hidden");
  if(tabId === "firstaid") renderCases();
}

// ================== توليد كروت الحالات ==================
function renderCases() {
  casesContainer.innerHTML = "";
  for (const [caseName, steps] of Object.entries(CASES)) {
    const card = document.createElement("div");
    card.className = "case-card";

    const title = document.createElement("h3");
    title.textContent = caseName;

    const list = document.createElement("ul");
    steps.slice(0, 2).forEach((step, index) => {
      const li = document.createElement("li");
      li.textContent = `${index + 1}. ${step}`;
      list.appendChild(li);
    });

    const controls = document.createElement("div");
    controls.className = "card-controls";

    const play = document.createElement("button");
    play.textContent = "إعادة الاستماع";
    play.onclick = () => speakSteps(steps);

    const stop = document.createElement("button");
    stop.textContent = "إيقاف";
    stop.onclick = stopSpeech;

    const back = document.createElement("button");
    back.textContent = "رجوع";
    back.onclick = () => card.remove();

    const call = document.createElement("button");
    call.textContent = "اتصل بالإسعاف 997";
    call.onclick = () => {
      if(confirm("هل تريد الاتصال بالإسعاف 997؟")){
        window.location.href = "tel:997";
      }
    };

    controls.append(play, stop, back, call);
    card.append(title, list, controls);
    card.onclick = () => showSteps(caseName, steps);
    casesContainer.appendChild(card);
  }
}

// ================== عرض خطوات الحالة ==================
function showSteps(caseName, steps) {
  caseTitle.textContent = caseName;
  stepsList.innerHTML = "";
  currentSteps = steps;

  steps.forEach((step,index)=>{
    const li = document.createElement("li");
    li.textContent = `${index+1}. ${step}`;
    li.onclick = ()=> {
      if(confirm("هل تريد الاتصال بالإسعاف 997؟")){
        window.location.href = "tel:997";
      }
    };
    li.onmousedown = ()=> li.classList.toggle("highlight");
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
function stopSpeech() {
  window.speechSynthesis.cancel();
}

// ================== التبويبات تعمل على النقر واللمس ==================
document.querySelectorAll("nav button").forEach(btn=>{
  btn.addEventListener("click",()=>{
    const tabId = btn.getAttribute("data-tab");
    showTab(tabId);
  });
});

// ================== زر الطوارئ والتعرف الصوتي ==================
if('webkitSpeechRecognition' in window || 'SpeechRecognition' in window){
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SR();
  recognition.lang="ar-SA";
  recognition.continuous=true;

  recognition.onresult = function(e){
    const text = e.results[e.results.length-1][0].transcript.trim();
    for(const [caseName,steps] of Object.entries(CASES)){
      if(text.includes(caseName)){
        showSteps(caseName,steps);
        return;
      }
    }
  };

  recognition.start();
  emergencyBtn.onclick = ()=> recognition.start();
}

// ================== أزرار كارد الخطوات ==================
playBtn.onclick = ()=> speakSteps();
stopBtn.onclick = stopSpeech;
backBtn.onclick = ()=> caseCard.classList.add("hidden");
