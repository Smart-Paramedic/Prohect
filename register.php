<?php
include 'db.php';


print_r($_POST);

// استقبال البيانات من النموذج
$full_name = $_POST['full_name'];
$email = $_POST['email'];
$phone = $_POST['phone'];
$blood_type = $_POST['blood_type'];
$medical_history = $_POST['medical_history'];

$sql = "INSERT INTO registrations (full_name, email, phone, blood_type, medical_history)
        VALUES ('$full_name', '$email', '$phone', '$blood_type', '$medical_history')";

if (mysqli_query($conn, $sql)) {
    echo "تم التسجيل بنجاح!";
} else {
    echo "خطأ في التسجيل: " . mysqli_error($conn);
}
?>
