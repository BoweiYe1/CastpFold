<?php

if(!isset($_FILES["file"])){
	die("{\"success\":false, \"what\":\"file_not_set\"}");
}
if($_FILES["file"]["error"]!=UPLOAD_ERR_OK){
	die("{\"success\":false, \"what\":\"upload_err\"}");
}

if(empty($_POST['probe'])){
	die("{\"success\":false, \"what\":\"no_probe\"}");
}

if(empty($_POST['email'])){
	die("{\"success\":false, \"what\":\"no_email\"}");
}

if ($_FILES["FileInput"]["size"] > 10485760) {
	die("{\"success\":false, \"what\":\"too_big_file\"}");
}

$probe = $_POST['probe'];
$email = $_POST['email'];
$hetatm = $_POST['hetatm'];
$mostfreq = $_POST['mostfreq'];


$id = 'j_'.uniqid();

$dirn = "data/tmppdb/".$id;

////check if this is an ajax request
//if (!isset($_SERVER['HTTP_X_REQUESTED_WITH'])){
//	die("Suspicious request!");
//}

mkdir($dirn) or die("{\"success\":false, \"what\":\"mkdir_failure\"}");

$fn = $dirn."/input.txt";
$file = fopen($fn, "w") or die("{\"success\":false, \"what\":\"log_failure\"}");//creates new file
fwrite($file, $probe." ".$hetatm." ".$mostfreq." ".$email." ".$_FILES['file']['name']);
fclose($file);



move_uploaded_file($_FILES['file']['tmp_name'], $dirn."/".$id.".pdb" ) or
	die("{\"success\":false, \"what\":\"move_file_failure\"}");


$ip = getenv('HTTP_CLIENT_IP')?:
	getenv('HTTP_X_FORWARDED_FOR')?:
	getenv('HTTP_X_FORWARDED')?:
	getenv('HTTP_FORWARDED_FOR')?:
	getenv('HTTP_FORWARDED')?:
	getenv('REMOTE_ADDR');
$fn = $dirn."/ip.txt";
$file = fopen($fn, "w") or die("{\"success\":false, \"what\":\"ip_failure\"}");//creates new file
fwrite($file, $ip);
fclose($file);


// call program without hanging the browser: https://stackoverflow.com/a/3819422

//TODO exec('arsenal/scripts/pipe.py '.$id.' > /dev/null &');
#exec('python arsenal/scirpts/pipe.py '.$id.'  > /dev/null  &');
#exec('arsenal/scripts/d_01.email.py '.$email.' '.$id.'  > /dev/null  &');
//exec('python arsenal/job/pipe.py '.$id.' >/dev/null 2> /dev/null &');

echo "{\"success\":true, \"jobid\":\"".$id."\", \"filename\":\"".$_FILES['file']['name']."\", \"email\": \"".$_POST['email']."\", \"probe\":\"".$_POST['probe']."\", \"hetatm\":\"".$_POST['hetatm']."\", \"mostfreq\":\"".$_POST['mostfreq']."\"}";

?>
