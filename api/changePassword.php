<?php
	if(isset($_POST['rf-username'],$_POST['old-password'],$_POST['new-password'],$_POST['confirm-password'])) {
		foreach($_POST as $k => $v) {
			if (empty($v)) {
				echo $k."-empty";
				die();
			}
		}
		$conn=mysqli_connect("localhost","baja","baja1997","chess_db");
		$rf_username=$_POST['rf-username'];
		$old_password=$_POST['old-password'];
		$old_password_hash=hash('sha256', $old_password);
		$new_password=$_POST['new-password'];
		$new_password_hash=hash('sha256', $new_password);
		$confirm_password=$_POST['confirm-password'];
		$query = "SELECT * FROM user WHERE username='".mysqli_real_escape_string($conn, $rf_username)."';";
		$res= mysqli_query($conn,$query);
		if(mysqli_num_rows($res)==0) {
			echo "user-does-not-exist-pass";
		}else {
			$query = "SELECT * FROM user WHERE username='".mysqli_real_escape_string($conn, $rf_username)."' and password='".mysqli_real_escape_string($conn, $old_password_hash)."';";
			$res= mysqli_query($conn,$query);
			if(mysqli_num_rows($res)==1) {
				if(preg_match('/[a-z]/',$new_password)&&preg_match('/[A-Z]/',$new_password)&&preg_match('/[0-9]/',$new_password)&&strlen($new_password)>=8) {
					if ($new_password==$confirm_password) {
						$query = "UPDATE user SET password='".mysqli_real_escape_string($conn, $new_password_hash)."' WHERE username='".mysqli_real_escape_string($conn, $rf_username)."';";
						$res= mysqli_query($conn,$query);
						echo "success";
					}else{
						echo "passwords-dont-match";
					}
				}else{
					echo "incorrect-format";
				}
			}else{
				echo "incorrect-password-pass";
			}
		}
		mysqli_close($conn);
	}
?>
