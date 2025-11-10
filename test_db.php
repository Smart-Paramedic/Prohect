<?php
  include 'db.php';

  $result = mysqli_query($conn, "SELECT * FROM medical_cases");

  while ($row = mysqli_fetch_assoc($result)) {
    echo $row['case_name'] . "<br>";
  }
?>

