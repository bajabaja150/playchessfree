<?php
	if (isset($_POST['usernamer'])) {
		if (empty($_POST["usernamer"])) {
			die();
		}
		$conn=mysqli_connect("localhost","baja","baja1997","chess_db");
		$usernamer=$_POST['usernamer'];
		$query = "SELECT * FROM user WHERE username='".mysqli_real_escape_string($conn, $usernamer)."';";
		$res= mysqli_query($conn,$query);
		if(mysqli_num_rows($res)==0) {
			echo "username-available";
		}else {
			echo "username-taken";
		}
		mysqli_close($conn);
	}
?>
