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

// فحص الاتصال
if ($conn->connect_error) {
    die("❌ فشل الاتصال بقاعدة البيانات: " . $conn->connect_error);
} else {
    echo "✅ تم الاتصال بقاعدة البيانات بنجاح!<br>";

    // تجربة استعلام بسيط للتأكد من أن الجدول موجود
    $sql = "SHOW TABLES LIKE 'registrations'";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        echo "✅ جدول <b>registrations</b> موجود داخل قاعدة البيانات.<br>";
    } else {
        echo "⚠️ لم يتم العثور على جدول <b>registrations</b> داخل القاعدة!<br>";
    }
}

$conn->close();
?>


