
const API_URL = "https://sheetdb.io/api/v1/abcd1234"; 


const licensedList = document.getElementById("licensedList");
const form = document.getElementById("userForm");


async function addUser() {
  const name = document.getElementById("name").value.trim();
  const history = document.getElementById("history").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const emergency = document.getElementById("emergency").value.trim();
  const license = document.getElementById("license").value;
  const address = document.getElementById("address").value.trim();

  if (!name || !phone) {
    alert("الرجاء إدخال الاسم ورقم التواصل.");
    return;
  }

  const payload = {
    data: [
      {
        "اسم المستخدم": name,
        "التاريخ الطبي": history,
        "رقم التواصل": phone,
        "جهات الطوارئ": emergency,
        "نوع الرخصة": license,
        "العنوان": address
      }
    ]
  };

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      alert("✅ تم حفظ بيانات المستخدم بنجاح!");
      clearForm();
    } else {
      const err = await res.text();
      console.error("خطأ من الخادم:", err);
      alert("⚠️ حدث خطأ أثناء الحفظ. تحقق من رابط API وصلاحيات Google Sheet.");
    }
  } catch (e) {
    console.error(e);
    alert("⚠️ تعذر الاتصال بالـ API. تأكدي من أن الرابط صحيح وأن الصلاحيات مضبوطة.");
  }
}

// إفراغ الحقول
function clearForm(){
  form.reset();
}

// إظهار المرخّصين فقط
async function showLicensed(){
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("API response not ok");
    const data = await res.json();
    renderList(data.filter(r => r["نوع الرخصة"] && r["نوع الرخصة"] !== ""));
  } catch (e) {
    console.error(e);
    alert("⚠️ خطأ عند جلب البيانات. تحقق من رابط API وصلاحيات SheetDB.");
  }
}

// إظهار كل المستخدمين
async function showAll(){
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("API response not ok");
    const data = await res.json();
    renderList(data);
  } catch (e) {
    console.error(e);
    alert("⚠️ خطأ عند جلب البيانات. تحقق من رابط API وصلاحيات SheetDB.");
  }
}

// رندر القائمة في الصفحة
function renderList(items){
  licensedList.innerHTML = "";
  if (!items || items.length === 0) {
    licensedList.innerHTML = "<p>لا توجد بيانات للعرض.</p>";
    return;
  }

  items.forEach(row => {
    const el = document.createElement("div");
    el.className = "person";

    const left = document.createElement("div");
    left.className = "left";
    const name = row["اسم المستخدم"] || "—";
    const phone = row["رقم التواصل"] || "—";
    const address = row["العنوان"] || "—";
    const license = row["نوع الرخصة"] || "بدون رخصة";
    const emergency = row["جهات الطوارئ"] || "";

    left.innerHTML = `
      <b>${escapeHtml(name)}</b>
      <small>📞 ${escapeHtml(phone)} ${emergency ? " | " + escapeHtml(emergency) : ""}</small>
      <small>📍 ${escapeHtml(address)}</small>
      <small>🪪 ${escapeHtml(license)}</small>
    `;

    // زر اتصال سريع (سيعمل على الجوال)
    const callBtn = document.createElement("a");
    callBtn.href = `tel:${phone || ''}`;
    callBtn.className = "btn call";
    callBtn.textContent = "اتصال";

    el.appendChild(left);
    el.appendChild(callBtn);
    licensedList.appendChild(el);
  });
}

// دالة بسيطة لحماية من إدخال HTML
function escapeHtml(text) {
  if (!text) return "";
  return text.replace(/[&<>"'`=\/]/g, function (s) {
    return ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
      '/': '&#x2F;',
      '`': '&#x60;',
      '=': '&#x3D;'
    })[s];
  });
}

// تحميل مرخّصين افتراضياً عند فتح الصفحة (اختياري)
// showLicensed();

