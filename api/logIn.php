<?php
	session_start();
	if(isset($_POST['username'],$_POST['password'])) {
		if (empty($_POST['username'])&&empty($_COOKIE['prijava'])) {
			echo "username-empty";
			die();
		}
		if (empty($_POST['password'])) {
			echo "password-empty";
			die();
		}
		$conn=mysqli_connect("localhost","baja","baja1997","chess_db");
		if (empty($_COOKIE['prijava'])) {
			$username=$_POST['username'];
		}else{
			$query = "SELECT * FROM user WHERE id='".mysqli_real_escape_string($conn, $_COOKIE['prijava'])."';";
			$res= mysqli_query($conn,$query);
			$user = mysqli_fetch_assoc($res);
			$username = $user['username'];
		}
		$password=$_POST['password'];
		$password_hash=hash('sha256', $password);
		$query = "SELECT * FROM user WHERE username='".mysqli_real_escape_string($conn, $username)."';";
		$res= mysqli_query($conn,$query);
		if(mysqli_num_rows($res)==0) {
			echo "user-does-not-exist";
		}else {
			$query = "SELECT * FROM user WHERE username='".mysqli_real_escape_string($conn, $username)."' and password='".mysqli_real_escape_string($conn, $password_hash)."';";
			$res= mysqli_query($conn,$query);
			if(mysqli_num_rows($res)==1) {
				$user = mysqli_fetch_assoc($res);
				if ($user['access']=="1") {
					$id=$_SESSION['id']=$user['id'];
					if (isset($_POST['remember'])) {
						$random = bin2hex(random_bytes(32));
						$expire = strtotime("+1 week");
						setcookie("login", $random, $expire,path:"/", secure:true, httponly: true);
						setcookie("id", $id, $expire,path:"/", secure:true, httponly: true);
						$query = "UPDATE user SET cookie='$random', expire=$expire WHERE id=$id;";
						$res= mysqli_query($conn,$query);
					}
					if (isset($_COOKIE["prijave"])) {
						$loginExists=false;
						$logins=explode(",",$_COOKIE['prijave']);
						foreach($logins as $lg) {
							if ($id==$lg) {
								$loginExists=true;
								break;
							}
						}
						if (!$loginExists) {
							setcookie("prijave", $_COOKIE['prijave'].",".$id, strtotime("+1 week"),path:"/",secure:true, httponly: true);
						}
					}else{
						setcookie("prijave", $id, strtotime("+1 week"),path:"/",secure:true, httponly: true);
					}
						echo "home";
				}else{
					echo "waiting";
				}
			}else{
				echo "incorrect-password";
			}
		}
		mysqli_close($conn);
	}
?>
