<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>أسعفني</title>
  <link rel="stylesheet" href="Style.css">
</head>
<body>
  <nav>
    <button class="nav-tab active" data-tab="emergency" onclick="showTab('emergency', event)">الرئيسية</button>
    <button class="nav-tab" data-tab="cases" onclick="showTab('cases', event)">الحالات</button>
    <button class="nav-tab" data-tab="register" onclick="showTab('register', event)">التسجيل</button>
    <button class="nav-tab" data-tab="medics" onclick="showTab('medics', event)">المسعفون</button>
  </nav>

  <main class="container">
   
    <section id="emergency" class="tab-content active">
      <div class="emergency-center">
        <h2>زر الطوارئ</h2>
        <button id="emergencyBtn" class="submit-btn">تشغيل الطوارئ</button>
        <p class="hint">
          يساعدك هذا الزر في التعرف الصوتي على الحالات الطبية التالية:  
          الحروق، الصرع، انخفاض الضغط، الاختناق.
        </p>
      </div>
    </section>

   
    <section id="cases" class="tab-content">
      <h2>الحالات الطبية</h2>
      <div id="cases-container"></div>
    </section>

    
    <section id="register" class="tab-content">
      <h2>التسجيل</h2>
      <form id="registerForm" action="save_registration.php" method="POST">
        <div id="formMessage" class="form-message"></div>
        <input type="text" name="full_name" placeholder="الاسم الكامل" required>
        <input type="email" name="email" placeholder="البريد الإلكتروني" required>
        <input type="tel" name="phone" placeholder="رقم الهاتف" required>
        <select name="blood_type" required>
          <option value="">فصيلة الدم</option>
          <option value="A+">A+</option><option value="A-">A-</option>
          <option value="B+">B+</option><option value="B-">B-</option>
          <option value="AB+">AB+</option><option value="AB-">AB-</option>
          <option value="O+">O+</option><option value="O-">O-</option>
        </select>
        <textarea name="medical_history" placeholder="التاريخ الطبي"></textarea>
        <button type="submit" class="submit-btn">تسجيل</button>
      </form>
    </section>

   
    <section id="medics" class="tab-content">
      <h2>المسعفون</h2>
      <p>
        لا يتم عرض بيانات المسعفين إلا بعد الموافقة الرسمية.  
        للاطلاع على التفاصيل، يرجى زيارة  
        <a href="https://www.moh.gov.sa" target="_blank">موقع وزارة الصحة</a>.
      </p>
    </section>
  </main>

  <script src="script.js"></script>
</body>
</html>
