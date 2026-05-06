<?php
	if(isset($_POST['id'])&&!empty($_POST['id'])) {
		$id = $_POST['id'];
		$conn=mysqli_connect("localhost","baja","baja1997","chess_db");
		$query = "SELECT * FROM user WHERE id='".mysqli_real_escape_string($conn, $id)."';";
		$res= mysqli_query($conn,$query);
		$user=mysqli_fetch_assoc($res);
		$json = '{"first_name":"'.$user['first_name'].'", "last_name":"'.$user['last_name'].'", "photo":"'.$user['photo'].'"}';
		echo $json;
		mysqli_close($conn);
	}
?>
