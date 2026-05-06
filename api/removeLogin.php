<?php
if (isset($_POST["prijava"])) {
	$prijava=$_POST["prijava"];
	$prijave=explode(",",$_COOKIE['prijave']);
	$nove_prijave="";
	foreach($prijave as $pr) {
		if($pr!=$prijava) {
			$nove_prijave.=$pr.",";
		}
	}
	if (!empty($nove_prijave)) {
		$nove_prijave = substr($nove_prijave, 0, -1);
		setcookie("prijave", $nove_prijave, strtotime("+1 week"), path:"/",secure:true, httponly: true);
	}else{
		setcookie("prijave", "", strtotime("-1 week"), path:"/",secure:true, httponly: true);
		echo "no-logins";
	}
}
?>