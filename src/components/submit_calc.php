<?php
if(isset($_FILES["file"]) && $_FILES["file"]["error"]== UPLOAD_ERR_OK) {
    //check if this is an ajax request
    if (!isset($_SERVER['HTTP_X_REQUESTED_WITH'])){
        die("Suspicious request!");
    }

    if(empty($_POST['probe'])){
        die("No probe!");
    }

    if(empty($_POST['email'])){
        die("No email!");
    }

    //Is file size less than allowed size.
    if ($_FILES["FileInput"]["size"] > 10485760) {
        die("File size too big!");
    }

	$probe = $_POST['probe'];
	$email = $_POST['email'];


	$id = 'j_'.uniqid();

	$dirn = "data/tmppdb/".$id;

    mkdir($dirn)or die("mkdir failure");

	$fn = $dirn."/input.txt";
	$file = fopen($fn, "w") or die("log failure");//creates new file
	fwrite($file, $_FILES['file']['name']." ".$probe." ".$email);
	fclose($file);



    if(move_uploaded_file($_FILES['file']['tmp_name'], $dirn."/".$id.".pdb" )){
        // do other stuff
        //die('Success! File Uploaded.');
    }else{
        die('error uploading File!');
    }

	$ip = getenv('HTTP_CLIENT_IP')?:
		getenv('HTTP_X_FORWARDED_FOR')?:
		getenv('HTTP_X_FORWARDED')?:
		getenv('HTTP_FORWARDED_FOR')?:
		getenv('HTTP_FORWARDED')?:
		getenv('REMOTE_ADDR');
	$fn = $dirn."/ip.txt";
	$file = fopen($fn, "w") or die("ip failure");//creates new file
	fwrite($file, $ip);
	fclose($file);


	exec('mkdir '.$dirn.'/processed');
	exec('mkdir '.$dirn.'/tmp');
	exec('arsenal/scripts/pipe.py '.$id.' > /dev/null &');
	#exec('python arsenal/scirpts/pipe.py '.$id.'  > /dev/null  &');
	#exec('arsenal/scripts/d_01.email.py '.$email.' '.$id.'  > /dev/null  &');
	//exec('python arsenal/job/pipe.py '.$id.' >/dev/null 2> /dev/null &');

	echo $id;

}
else
{
    die('Something wrong with upload!'.' '.$_FILES["file"]["error"] );
}
