// ================== البيانات الأساسية للحالات ==================
const CASES = {
  "نزيف": [
    "اضغط على مكان النزيف مباشرة بقطعة قماش نظيفة.",
    "ارفع الجزء المصاب فوق مستوى القلب.",
    "لا تزل الأجسام العالقة في الجرح.",
    "اتصل بالإسعاف فوراً على 997"
  ],
  "كسر": [
    "لا تحرك الجزء المصاب.",
    "ثبت المنطقة باستخدام جبيرة مؤقتة.",
    "ضع ثلجاً ملفوفاً لتقليل التورم.",
    "اتصل بالإسعاف فوراً على 997"
  ],
  "انخفاض السكر": [
    "أعط المصاب شيئاً يحتوي على سكر سريع مثل العصير.",
    "إذا فقد وعيه لا تعطه شيئاً عن طريق الفم.",
    "راقب تنفسه حتى تصل المساعدة.",
    "اتصل بالإسعاف فوراً على 997"
  ]
};

// ================== عناصر DOM ==================
const emergencyBtn = document.getElementById("emergencyBtn");
const casesContainer = document.getElementById("casesContainer");

// ================== عرض تبويب ==================
function showTab(tabId) {
  document.querySelectorAll(".tab").forEach(t => t.classList.add("hidden"));
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
    steps.forEach(step => {
      const li = document.createElement("li");
      li.textContent = step;
      list.appendChild(li);
    });

    const speakBtn = document.createElement("button");
    speakBtn.textContent = "🔊 استمع";
    speakBtn.onclick = () => {
      const utter = new SpeechSynthesisUtterance(steps.join("، ثم "));
      utter.lang = "ar-SA";
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utter);
    };

    card.append(title, list, speakBtn);
    casesContainer.appendChild(card);
  }
}

// ================== التبويبات تعمل على النقر واللمس ==================
document.querySelectorAll("nav button").forEach(btn => {
  btn.addEventListener("click", () => {
    const tabId = btn.getAttribute("data-tab");
    showTab(tabId);
  });
});

// ================== زر الطوارئ والتعرف الصوتي ==================
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SR();
  recognition.lang = "ar-SA";
  recognition.continuous = true;

  recognition.onresult = function(e) {
    const text = e.results[e.results.length - 1][0].transcript.trim();
    for (const [key, steps] of Object.entries(CASES)) {
      if (text.includes(key)) {
        alert(`تم الكشف على الحالة: ${key}`);
        return;
      }
    }
  };

  emergencyBtn.onclick = () => recognition.start();

} else {
  alert("المتصفح لا يدعم خاصية التعرف على الصوت.");
}

// ================== نموذج التسجيل ==================
document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = Object.fromEntries(new FormData(e.target).entries());
  const API_URL = "https://sheetdb.io/api/v1/pp3tkazlfqhvu"; // عدلي حسب قاعدة بياناتك
  await fetch(API_URL, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({data: formData})
  });
  alert("تم إرسال البيانات بنجاح!");
  e.target.reset();
});
