const SHEETDB_API = "https://sheetdb.io/api/v1/pp3tkazlfqhvu";

const caseStepsData = {
  "نزيف": ["اضغط على الجرح لوقف النزيف.","ارفع العضو المصاب.","ضع ضمادة واستدعِ الطوارئ فوراً."],
  "كسر": ["ثبّت الجزء المصاب.","تجنب تحريكه.","اتصل بالإسعاف فوراً."],
  "انخفاض السكر": ["أعط المصاب سكريات.","راقب وعيه.","استدعِ الطوارئ إذا فقد الوعي."]
};

// ======== عناصر الواجهة ========
const emergencyBtn = document.getElementById("emergencyBtn");
const micStatus = document.getElementById("micStatus");
const casesList = document.getElementById("casesList");
const stepsSection = document.getElementById("stepsSection");
const caseTitle = document.getElementById("caseTitle");
const stepsList = document.getElementById("stepsList");
const backBtn = document.getElementById("backBtn");
const playBtn = document.getElementById("playBtn");
const stopBtn = document.getElementById("stopBtn");
const paramedicsList = document.getElementById("paramedicsList");
const navBtns = document.querySelectorAll(".nav-btn");
const tabs = document.querySelectorAll(".tab");
const registerForm = document.getElementById("registerForm");
const registerStatus = document.getElementById("registerStatus");

let recognition;
let synth = window.speechSynthesis;
let lastSpoken = null;

// ======== تبويبات ========
function showTab(id){
  tabs.forEach(t=>t.classList.add("hidden"));
  navBtns.forEach(b=>b.classList.remove("active"));
  document.getElementById(id).classList.remove("hidden");
  document.querySelector(`[data-tab="${id}"]`).classList.add("active");
}

navBtns.forEach(b=>b.addEventListener("click",()=>showTab(b.dataset.tab)));

// ======== عرض الحالات ========
Object.keys(caseStepsData).forEach(c=>{
  const div = document.createElement("div");
  div.className = "case-item";
  div.innerHTML = `<span>${c}</span> <button onclick="showSteps('${c}')">عرض</button>`;
  casesList.appendChild(div);
});

function showSteps(name){
  stepsSection.classList.remove("hidden");
  caseTitle.textContent = name;
  stepsList.innerHTML="";
  caseStepsData[name].forEach(s=>{
    const li=document.createElement("li");
    li.textContent=s;
    stepsList.appendChild(li);
  });
  speakSteps(name);
}

function speakSteps(name){
  const text = caseStepsData[name]?.join("، ");
  if(!text) return;
  stopSpeech();
  const utter = new SpeechSynthesisUtterance(`${name}: ${text}`);
  utter.lang="ar-SA";
  synth.speak(utter);
  lastSpoken = utter;
}

function stopSpeech(){ if(synth.speaking) synth.cancel(); }
function playLast(){ if(lastSpoken) synth.speak(lastSpoken); }

backBtn.onclick = ()=> stepsSection.classList.add("hidden");

// ======== تعرف صوتي ========
function initRecognition(){
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if(!SR){ micStatus.textContent="❌ جهازك لا يدعم التعرف الصوتي"; return; }
  recognition = new SR();
  recognition.lang="ar-SA";
  recognition.continuous=true;
  recognition.onstart=()=> micStatus.textContent="🎤 الميكروفون يعمل";
  recognition.onend=()=> micStatus.textContent="🟡 متوقف، يمكنك الضغط لإعادة التشغيل";
  recognition.onresult=(e)=>{
    const text = e.results[e.resultIndex][0].transcript.trim();
    micStatus.textContent=`✅ تم التعرف على: ${text}`;
    for(const key in caseStepsData){
      if(text.includes(key)){ showSteps(key); return; }
    }
    speak("لم أفهم الحالة. قل نزيف أو كسر أو انخفاض السكر.");
  };
}

function speak(t){
  stopSpeech();
  const u = new SpeechSynthesisUtterance(t);
  u.lang="ar-SA";
  synth.speak(u);
}

// ======== زر الطوارئ ========
emergencyBtn.onclick = ()=>{
  if(!recognition) initRecognition();
  try{ recognition.start(); }catch{}
  micStatus.textContent="🎤 الميكروفون جاهز... تحدث الآن";
  speak("تم تفعيل الطوارئ. يمكنك قول اسم الحالة مثل نزيف أو كسر أو انخفاض السكر.");
};

// ======== التسجيل ========
registerForm.addEventListener("submit", async e=>{
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
    method:"POST", headers:{'Content-Type':'application/json'},
    body:JSON.stringify(payload)
  });
  if(res.ok){
    registerStatus.textContent="✅ تم التسجيل بنجاح";
    registerForm.reset();
    loadParamedics();
  } else registerStatus.textContent="❌ حدث خطأ أثناء الإرسال";
});

// ======== تحميل المسعفين ========
async function loadParamedics(){
  paramedicsList.innerHTML="⏳ تحميل...";
  try{
    const res = await fetch(SHEETDB_API);
    const data = await res.json();
    paramedicsList.innerHTML="";
    data.forEach(p=>{
      const card=document.createElement("div");
      card.className="paramedic-card";
      card.innerHTML=`
        <img src="https://cdn-icons-png.flaticon.com/512/3774/3774299.png" alt="paramedic">
        <strong>${p.name||"غير معروف"}</strong>
        <span>${p.license_type||"غير محدد"}</span>
        <span>${p.emergency_agency||""}</span>
      `;
      paramedicsList.appendChild(card);
    });
  }catch{
    paramedicsList.textContent="❌ لم يتم تحميل المسعفين";
  }
}
loadParamedics();
