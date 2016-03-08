<?php
$servername = "localhost";
$username = "calvrix";
$password = "Calvrix!7!";
$dbname = "calvrix";
// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 
$id=$_REQUEST["id"];
$sql="SELECT * FROM playlist WHERE `id`=".$id;
$result=$conn->query($sql);
$row=$result->fetch_assoc();
echo $row["title"]."|".$row["album"]."|".$row["artist"]."|".$row["url"];
?>