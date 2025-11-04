// ===== إعداد البيانات =====
const SHEETDB_API = "https://sheetdb.io/api/v1/pp3tkazlfqhvu";
const caseStepsData = {
  "نزيف": [
    "اضغط على الجرح لوقف النزيف.",
    "ارفع العضو المصاب.",
    "ضع ضمادة واستدعِ الطوارئ فوراً."
  ],
  "كسر": [
    "ثبّت الجزء المصاب.",
    "تجنب تحريكه نهائياً.",
    "اتصل بالإسعاف فوراً."
  ],
  "انخفاض السكر": [
    "أعط المصاب سكريات سريعة الامتصاص.",
    "راقب الوعي.",
    "استدعِ الطوارئ إذا فقد الوعي."
  ]
};

// ===== عناصر الواجهة =====
const tabs = document.querySelectorAll(".tab");
const navBtns = document.querySelectorAll(".nav-btn");
const micStatus = document.getElementById("micStatus");
const casesList = document.getElementById("casesList");
const stepsSection = document.getElementById("stepsSection");
const caseTitle = document.getElementById("caseTitle");
const stepsList = document.getElementById("stepsList");
const playBtn = document.getElementById("playBtn");
const stopBtn = document.getElementById("stopBtn");
const backBtn = document.getElementById("backBtn");
const registerForm = document.getElementById("registerForm");
const registerStatus = document.getElementById("registerStatus");
const paramedicsList = document.getElementById("paramedicsList");
const emergencyBtn = document.getElementById("emergencyBtn");

// ===== تبويبات =====
function showTab(id){
  tabs.forEach(tab => tab.classList.add("hidden"));
  navBtns.forEach(btn => btn.classList.remove("active"));
  document.getElementById(id).classList.remove("hidden");
  document.querySelector(`[data-tab="${id}"]`).classList.add("active");
}

navBtns.forEach(btn=>{
  btn.addEventListener("click", ()=>showTab(btn.dataset.tab));
});

// ===== إنشاء قائمة الحالات =====
Object.keys(caseStepsData).forEach(name=>{
  const div = document.createElement("div");
  div.className="case-item";
  div.innerHTML=`<span>${name}</span><button onclick="showSteps('${name}')">عرض</button>`;
  casesList.appendChild(div);
});

// ===== دوال الصوت =====
let synth = window.speechSynthesis;
let recognition;
let lastUtterance;
let currentCase;

// تشغيل الصوت
function speakSteps(name){
  const text = caseStepsData[name]?.join("، ");
  if(!text) return;
  stopSpeech();
  const utter = new SpeechSynthesisUtterance(`${name}: ${text}`);
  utter.lang = "ar-SA";
  synth.speak(utter);
  lastUtterance = utter;
  currentCase = name;
  showSteps(name);
}

// عرض الخطوات
function showSteps(name){
  stepsSection.classList.remove("hidden");
  caseTitle.textContent = name;
  stepsList.innerHTML="";
  caseStepsData[name].forEach(s=>{
    const li=document.createElement("li");
    li.textContent=s;
    stepsList.appendChild(li);
  });
}

function stopSpeech(){
  if(synth.speaking) synth.cancel();
}

function playLast(){
  if(lastUtterance) synth.speak(new SpeechSynthesisUtterance(lastUtterance.text));
}

backBtn.onclick = ()=> stepsSection.classList.add("hidden");

// ===== تعرف صوتي =====
function initRecognition(){
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if(!SR){ micStatus.textContent="❌ المتصفح لا يدعم التعرف الصوتي"; return; }

  recognition = new SR();
  recognition.lang="ar-SA";
  recognition.continuous=true;
  recognition.onstart=()=> micStatus.textContent="🎤 الميكروفون يعمل، تحدث الآن...";
  recognition.onend=()=> micStatus.textContent="🟠 توقف مؤقت، اضغط للطوارئ لإعادة التشغيل";
  recognition.onerror=()=> micStatus.textContent="⚠️ خطأ في الميكروفون";

  recognition.onresult=(e)=>{
    const text = e.results[e.resultIndex][0].transcript.trim();
    micStatus.textContent = `✅ تم التعرف على: ${text}`;
    for(let key of Object.keys(caseStepsData)){
      if(text.includes(key)){
        speakSteps(key);
        return;
      }
    }
    const msg = new SpeechSynthesisUtterance("لم أفهم الحالة، جرّب قول نزيف أو كسر أو انخفاض السكر");
    msg.lang="ar-SA";
    synth.speak(msg);
  };
}

// ===== زر الطوارئ =====
emergencyBtn.onclick = ()=>{
  stopSpeech();
  speakNow("تم تفعيل الطوارئ، يمكنك قول اسم الحالة الآن.");
  startListening();
};

function speakNow(text){
  const u = new SpeechSynthesisUtterance(text);
  u.lang="ar-SA";
  synth.speak(u);
}

function startListening(){
  if(!recognition) initRecognition();
  try{ recognition.start(); }catch{}
}

// ===== فورم التسجيل =====
registerForm.addEventListener("submit", async (e)=>{
  e.preventDefault();
  const formData = new FormData(registerForm);
  const payload = {
    data:{
      name:formData.get("name"),
      medical_history:formData.get("medical_history"),
      phone:formData.get("phone"),
      emergency_agency:formData.get("emergency_agency"),
      license_type:formData.get("license_type"),
      address:formData.get("address")
    }
  };

  registerStatus.textContent="⏳ جاري الإرسال...";
  const res = await fetch(SHEETDB_API,{
    method:"POST",
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify(payload)
  });

  if(res.ok){
    registerStatus.textContent="✅ تم التسجيل بنجاح";
    registerForm.reset();
    loadParamedics();
  }else registerStatus.textContent="❌ فشل التسجيل";
});

// ===== تحميل المسعفين =====
async function loadParamedics(){
  try{
    const res = await fetch(SHEETDB_API);
    const data = await res.json();
    paramedicsList.innerHTML="";
    data.forEach(d=>{
      const item=document.createElement("div");
      item.className="paramedic-item";
      item.innerHTML=`<strong>${d.name||"غير معروف"}</strong> - ${d.license_type||"غير محدد"}`;
      paramedicsList.appendChild(item);
    });
  }catch{
    paramedicsList.textContent="❌ فشل تحميل البيانات";
  }
}

loadParamedics();
