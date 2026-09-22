<?php
//get data from form  
$name = $_POST['name'];
$email= $_POST['email'];
$message= $_POST['message'];
$to = "sanskarjoshi1998@gmail.com";
$subject = "Mail From website";
$txt ="Name = ". $name . "\r\n  Email = " . $email . "\r\n Message =" . $message;
$headers = "From: sanskarjoshi26@gmail.com" . "\r\n" .
"CC: somebodyelse@example.com";
if($email!=NULL){
    mail($to,$subject,$txt,$headers);
}
//redirect
header("Location:thankyou.html");
?>
