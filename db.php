<?php
$host = "localhost";
$user = "root";
$password = "";
$dbname = "first_aid_system";

$conn = mysqli_connect($host, $user, $password, $dbname);

if (!$conn) {
    die("فشل الاتصال بقاعدة البيانات: " . mysqli_connect_error());
}
?>
