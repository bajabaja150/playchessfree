<?php
	
	if(isset($_POST['firstname'],$_POST['lastname'],$_POST['usernamer'],$_POST['passwordr'],$_POST['passwordrr'],$_POST['email'])) {
		foreach($_POST as $k => $v) {
			if (empty($v)) {
				echo $k."-empty";
				die();
			}
		}
		$conn=mysqli_connect("localhost","baja","baja1997","chess_db");
		$ime=$_POST['firstname'];
		$prezime=$_POST['lastname'];
		$usernamer=$_POST['usernamer'];
		$passwordr=$_POST['passwordr'];
		$passwordr_hash=hash('sha256', $passwordr);
		$passwordrr=$_POST['passwordrr'];
		$email=$_POST['email'];
		
		$photo=(isset($_FILES['my-photo']['name'])&&!empty($_FILES['my-photo']['name']))?$_FILES['my-photo']['name']:"";
		if (!empty($photo)&&str_contains($photo,".")){
			$ext=substr($photo,strrpos($photo, ".") + 1);
		}else{
			$ext="";
		}
		$query = "SELECT * FROM user WHERE username='".mysqli_real_escape_string($conn, $usernamer)."';";
		$res= mysqli_query($conn,$query);
		if(mysqli_num_rows($res)==1) {
			echo "username-taken";
		}else {
			if(preg_match('/[a-z]/',$passwordr)&&preg_match('/[A-Z]/',$passwordr)&&preg_match('/[0-9]/',$passwordr)&&strlen($passwordr)>=8) {
				if ($passwordr==$passwordrr) {
					if(str_contains($email,"@")) {
						if (empty($photo)||($ext=="jpeg"||$ext=="jpg"||$ext=="png"||$ext=="gif"||$ext=="bmp"||$ext=="svg")) {
							$photo_db=(empty($photo))?"default.png":$usernamer.".".$ext;
							$token = bin2hex(random_bytes(32));
							$tokenExpire = strtotime("+1 day");
							$query = "INSERT INTO user VALUES(NULL, '".mysqli_real_escape_string($conn, $ime)."','".mysqli_real_escape_string($conn, $prezime)."','".mysqli_real_escape_string($conn, $usernamer)."','".mysqli_real_escape_string($conn, $passwordr_hash)."','".mysqli_real_escape_string($conn, $email)."',1,NULL,0,'".mysqli_real_escape_string($conn, $photo_db)."',0,'".$token."',".$tokenExpire.",'');";
							$res= mysqli_query($conn,$query);

							if (!empty($photo)) {
								move_uploaded_file($_FILES['my-photo']['tmp_name'], "../avatars/".$photo_db);
							}
							echo "success";
						}else{
							echo "allowed-extensions";
						}
					}else{
						echo "invalid-mail";
					}
				}else{
					echo "passwords-dont-match-reg";
				}
			}else{
				echo "incorrect-format-reg";
			}
		}
		mysqli_close($conn);
	}
?>
