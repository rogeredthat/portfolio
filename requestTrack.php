<?php
$servername = "sql3.freemysqlhosting.net";
$username = "sql3110358";
$password = "iZrvX7ii7C";
$dbname = "sql3110358";
// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("404 Not Found");
} 
$id=$_REQUEST["id"];
$sql="SELECT * FROM playlist WHERE `id`=".$id;
$result=$conn->query($sql);
$row=$result->fetch_assoc();
echo $row["title"]."|".$row["album"]."|".$row["artist"]."|".$row["url"];
?>