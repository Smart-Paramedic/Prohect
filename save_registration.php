<?php
header('Content-Type: text/html; charset=utf-8');

// إعداد الاتصال
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "first_aid_system";

// إنشاء الاتصال
$conn = new mysqli($servername, $username, $password, $dbname);
$conn->set_charset("utf8");

// التحقق من الاتصال
if ($conn->connect_error) {
    die("❌ فشل الاتصال بقاعدة البيانات: " . $conn->connect_error);
}

// استقبال بيانات النموذج بطريقة آمنة
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $full_name = $conn->real_escape_string($_POST['full_name']);
    $email = $conn->real_escape_string($_POST['email']);
    $phone = $conn->real_escape_string($_POST['phone']);
    $blood_type = $conn->real_escape_string($_POST['blood_type']);
    $medical_history = $conn->real_escape_string($_POST['medical_history']);

    // إدخال البيانات في الجدول
    $sql = "INSERT INTO registrations (full_name, email, phone, blood_type, medical_history)
            VALUES ('$full_name', '$email', '$phone', '$blood_type', '$medical_history')";

    if ($conn->query($sql) === TRUE) {
        echo "<script>
            alert('✅ تم تسجيل بياناتك بنجاح!');
            window.location.href='index.html';
        </script>";
    } else {
        echo '❌ حدث خطأ أثناء حفظ البيانات: ' . $conn->error;
    }
}

$conn->close();
?>
