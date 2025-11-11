<?php
$host = "localhost";
$user = "root";
$password = "";
$dbname = "first_aid_system";

$conn = new mysqli($host, $user, $password, $dbname);
$conn->set_charset("utf8mb4");

if ($conn->connect_error) {
    die("فشل الاتصال: " . $conn->connect_error);
}
?>
