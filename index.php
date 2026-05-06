<?php
session_start();
if(!isset($_SESSION['id'])) {
	if(isset($_GET['token'])) {
		$token=$_GET['token'];
		$konekcija=mysqli_connect("localhost","baja","baja1997","chess_db");
		$komanda = "SELECT * FROM user WHERE token='$token';";
		$rez= mysqli_query($konekcija,$komanda);
		if (mysqli_num_rows($rez)) {
			$user = mysqli_fetch_assoc($rez);
			$id=$user['id'];
			if ($token==$user['token'] && time() < (int)$user['token_expire']) {
				$query = "UPDATE user SET access = 1 WHERE token='".mysqli_real_escape_string($konekcija, $token)."';";
				$res= mysqli_query($konekcija,$query);
				$_SESSION['id']=$id;
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
				header("Location: home.php");
			}
		}
	}
	if(isset($_COOKIE['login'], $_COOKIE['id'])) {
		$konekcija=mysqli_connect("localhost","baja","baja1997","chess_db");
		$id=$_COOKIE['id'];
		$komanda = "SELECT * FROM user WHERE id='$id';";
		$rez= mysqli_query($konekcija,$komanda);
		$user = mysqli_fetch_assoc($rez);
		if ($_COOKIE['login']==$user['cookie'] && time() < (int)$user['expire']) {
			$_SESSION['id']=$id;
			header("Location: home.php");
		}
	}
}else{
	$id = $_SESSION['id'];
	$konekcija=mysqli_connect("localhost","baja","baja1997","chess_db");
	$komanda = "SELECT * FROM user WHERE id='$id';";
	$rez= mysqli_query($konekcija,$komanda);
	$user = mysqli_fetch_assoc($rez);
	header("Location: home.php");
}
?>
<!DOCTYPE html>
<html>
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<script src="https://kit.fontawesome.com/9e09d7e85e.js" crossorigin="anonymous"></script>
		<link rel="icon" href="assets/png/logo.png">
		<title>Play free chess games online</title>
		<link rel="stylesheet" href="css/index.css">
		<script src="js/index.js"></script>
	</head>
	<body onload="animate();" spellcheck="false">
		<!------------------------------------------------------------------------------>
		<form class="form" id="login-form">
			<img src="assets/png/logo.png" class="logo">
			<h1 class="title">Welcome to playchessfree.com</h1>
			<h3 class="title-small">Please fill out the login form</h3>
			<?php
				if (isset($_COOKIE['prijave'])) {
					echo "<h3 id='recent-logins'>Recently logged in</h3>";
					$konekcija=mysqli_connect("localhost","baja","baja1997","chess_db");
					$user_ids = explode(",", $_COOKIE['prijave']);
					foreach($user_ids as $user_id) {
						$komanda = "SELECT * FROM user WHERE id='".mysqli_real_escape_string($konekcija, $user_id)."';";
						$res= mysqli_query($konekcija,$komanda);
						if (mysqli_num_rows($res)) {
							$user = mysqli_fetch_assoc($res);
							echo "<div class='prijava' id='prijava-$user_id' onclick='selektujPrijavu(this);' onmouseover='prikaziX(this)' onmouseout='sakrijX(this)'>";
							echo "<img class='slika-prijava' src='avatars/".$user['photo']."'>";
							echo "<div class='centriran-tekst'>";
							echo $user['first_name']." ".$user['last_name'];
							echo "<br>";
							echo "<small>".$user['username']."</small>";
							echo "</div>";
							echo "<i class='fa-x fa-solid ikona-prijava' id='x-$user_id' onclick='obrisiPrijavu(this);'></i>";
							echo "</div>";
						}
					}
				}
			?>
			<div id="username-switch">
				<div id="username-frame" class="frame">
					<i id="fa-username" class="fa-user fa-solid icon" onclick="iconClick(this)"></i>
					<input id="username" class="one-icon-field" type="text" name="username" placeholder="Username" onfocus="focusField(this,true)" onblur="validate1(this)" onKeyUp="onInput(event, this)">
					<i class="fa-circle-exclamation fa-solid warning-icon" id="username-warning" onclick="warningIconClick(this);"></i>
				</div>
				<p class="warning-message" id="user-does-not-exist">There is no account associated with this username!</p>
				<p class="warning-message" id="username-empty">This field is required!</p>
			</div>
			<div id="password-frame" class="frame">
				<i id="fa-password" class="fa-key fa-solid icon" onclick="iconClick(this)"></i>
				<input id="password" class="two-icons-field" type="password" name="password" placeholder="Password" onfocus="focusField(this,true)" onblur="validate1(this)" onKeyUp="onInput(event, this)" autocomplete="off">
				<i id="eye-password" onclick="eye(this)" class="fa-eye-slash fa-solid icon"></i>
				<i class="fa-circle-exclamation fa-solid warning-icon" id="password-warning" onclick="warningIconClick(this);"></i>
			</div>
			<p class="warning-message" id="incorrect-password">Incorrect password!</p>
			<p class="info-message" id="waiting">Your account will be activated once you verify your email address.</p>
			<p class="warning-message" id="password-empty">This field is required!</p>
			<div id="remember-frame">
				<input type="checkbox" name="remember" id="remember" onchange="checkCookies(this);">
				<label for="remember" id="remember-label">Remember me</label>
			</div>
			<p class="info-message" id="cookies-disabled">You must enable cookies to use this feature.</p>
			<input id="change-password" type="button" class="button width100 confirm-button" value="Manage password" onclick="showPasswordChangeForm()" onmousedown="pressButton(this);" onmouseup="releaseButton(this);" onmouseout="releaseButton(this);">
			<input id="login" type="button" class="button width100 confirm-button" value="Log in" onclick="logIn();" onmousedown="pressButton(this);" onmouseup="releaseButton(this);" onmouseout="releaseButton(this);">
			<input id="reg" type="button" class="button width100" value="Create new account"  onclick="showRegistrationForm();" onmousedown="pressButton(this);" onmouseup="releaseButton(this);" onmouseout="releaseButton(this);">
		</form>
		<!------------------------------------------------------------------------------>
		<form class="form" id="registration-form">
			<div class="x-icon-frame">
				<i class="fa-x fa-solid x-icon" onclick="showLoginForm();"></i>
			</div>
			<img src="assets/png/logo.png" class="logo">
			<h1 class="title">Welcome to playchessfree.com</h1>
			<h3 class="title-small">Fill out this form to create your account</h3>
			<label for="firstname">First name (<span id="num-of-characters-firstname">0</span>/40):</label>
			<div class="frame" id="firstname-frame">
				<i id="fa-firstname" class="fa-user fa-solid icon" onclick="iconClick(this)"></i>
				<input type="text" name="firstname" id="firstname" class="one-icon-field" onfocus="focusField(this,true)" onblur="validate1(this)" onKeyUp="onInput(event, this);izbrojKaraktere(this)" maxlength="40">
				<i class="fa-circle-exclamation fa-solid warning-icon" id="firstname-warning" onclick="warningIconClick(this);"></i>
			</div>
			<p class="warning-message" id="firstname-empty">This field is required!</p>
			<label for="lastname">Last name (<span id="num-of-characters-lastname">0</span>/40):</label>
			<div class="frame" id="lastname-frame">
				<i id="fa-lastname" class="fa-user fa-solid icon" onclick="iconClick(this)"></i>
				<input type="text" name="lastname" id="lastname" class="one-icon-field" onfocus="focusField(this,true)" onblur="validate1(this)" onKeyUp="onInput(event, this);izbrojKaraktere(this)" maxlength="40">
				<i class="fa-circle-exclamation fa-solid warning-icon" id="lastname-warning" onclick="warningIconClick(this);"></i>
			</div>
			<p class="warning-message" id="lastname-empty">This field is required!</p>
			<label for="my-photo">Profile picture:</label>
			<div class="frame" id="my-photo-frame">
				<input type="file" name="my-photo" id="my-photo" onchange="showImage(this);" accept="image/*">
				<i id="fa-my-photo" class="fa-image fa-solid icon" onclick="clickOnFileInput();"></i>
				<label for="my-photo" id="my-photo-filename">Click to upload photo</label>
				<i class="fa-x fa-solid" id="my-photo-remove" onclick="hideImage()"></i>
			</div>
			<img id="profile-photo">
			<p class="warning-message" id="allowed-extensions">Only pictures are allowed!</p>
			<label for="usernamer">Username (<span id="num-of-characters-usernamer">0</span>/40):</label>
			<div class="frame" id="usernamer-frame">
				<i id="fa-usernamer" class="fa-user fa-solid icon" onclick="iconClick(this)"></i>
				<input type="text" name="usernamer" id="usernamer" class="one-icon-field" onfocus="focusField(this,true)" onblur="validate1(this)" onKeyUp="onInput(event, this);izbrojKaraktere(this)" maxlength="40">
				<i class="fa-circle-exclamation fa-solid warning-icon" id="usernamer-warning" onclick="warningIconClick(this);"></i>
			</div>
			<p class="warning-message" id="usernamer-empty">This field is required!</p>
			<p class="warning-message" id="username-taken">Username is taken! Please pick another one.</p>
			<p class="info-message" id="username-available">Username is available!</p>
			<label for="passwordr">Password:</label>
			<div class="frame" id="passwordr-frame">
				<i id="fa-passwordr" class="fa-key fa-solid icon" onclick="iconClick(this)"></i>
				<input type="password" name="passwordr" id="passwordr" class="two-icons-field" onfocus="focusField(this,true)" onblur="validate1(this)" onKeyUp="onInput(event, this)">
				<i id="eye-passwordr" onclick="eye(this)" class="fa-eye-slash fa-solid icon"></i>
				<i class="fa-circle-exclamation fa-solid warning-icon" id="passwordr-warning" onclick="warningIconClick(this);"></i>
			</div>
			<p class="warning-message" id="passwordr-empty">This field is required!</p>
			<p class="warning-message" id="incorrect-format-reg">The password must contain at least one of the following: a lowercase letter, an uppercase letter, a number and be at least 8 characters long!</p>
			<label for="passwordrr">Retype password:</label>
			<div class="frame" id="passwordrr-frame">
				<i id="fa-passwordrr" class="fa-key fa-solid icon" onclick="iconClick(this)"></i>
				<input type="password" name="passwordrr" id="passwordrr" class="two-icons-field" onfocus="focusField(this,true)" onblur="validate1(this)" onKeyUp="onInput(event, this)">
				<i id="eye-passwordrr" onclick="eye(this)" class="fa-eye-slash fa-solid icon"></i>
				<i class="fa-circle-exclamation fa-solid warning-icon" id="passwordrr-warning" onclick="warningIconClick(this);"></i>
			</div>
			<p class="warning-message" id="passwordrr-empty">This field is required!</p>
			<p class="warning-message" id="passwords-dont-match-reg">Passwords do not match!</p>
			<label for="email">E-mail (<span id="num-of-characters-email">0</span>/80):</label>
			<div class="frame" id="email-frame">
				<i id="fa-email" class="fa-envelope fa-solid icon" onclick="iconClick(this)"></i>
				<input type="email" name="email" id="email" class="one-icon-field" onfocus="focusField(this,true)" onblur="validate1(this)" onKeyUp="onInput(event, this);izbrojKaraktere(this)" maxlength="80">
				<i class="fa-circle-exclamation fa-solid warning-icon" id="email-warning" onclick="warningIconClick(this);"></i>
			</div>
			<p class="warning-message" id="email-empty">This field is required!</p>
			<p class="warning-message" id="invalid-mail">Email must contain symbol @!</p>
			<p class="info-message" id="registration-successful">Your account is waiting for email verification!</p>
			<input type="button" value="Back" onclick="showLoginForm()" class="button back" onmousedown="pressButton(this);" onmouseup="releaseButton(this);" onmouseout="releaseButton(this);">
			<input type="button" value="Register now" class="button confirm-button right" onclick="register()" onmousedown="pressButton(this);" onmouseup="releaseButton(this);" onmouseout="releaseButton(this);">
		</form>
		<!------------------------------------------------------------------------------>
		<form class="form" id="password-change-form">
			<div class="x-icon-frame">
				<i class="fa-x fa-solid x-icon" onclick="showLoginForm();"></i>
			</div>
			<img src="assets/png/logo.png" class="logo">
			<h1 class="title">Welcome to playchessfree.com</h1>
			<h3 class="title-small">Fill out this form to change your password</h3>
			<div id="rf-username-frame" class="frame">
				<i id="fa-rf-username" class="fa-user fa-solid icon" onclick="iconClick(this)"></i>
				<input id="rf-username" type="text" class="one-icon-field" name="rf-username" placeholder="Username" onfocus="focusField(this,true)" onblur="validate1(this)" onKeyUp="onInput(event, this)">
				<i class="fa-circle-exclamation fa-solid warning-icon" id="rf-username-warning" onclick="warningIconClick(this);"></i>
			</div>
			<p class="warning-message" id="rf-username-empty">This field is required!</p>
			<p class="warning-message" id="user-does-not-exist-pass">There is no account associated with this username!</p>
			<div id="old-password-frame" class="frame">
				<i id="fa-old-password" class="fa-key fa-solid icon" onclick="iconClick(this)"></i>
				<input id="old-password" class="two-icons-field" type="password" name="old-password" placeholder="Old password" onfocus="focusField(this,true)" onblur="validate1(this)" onKeyUp="onInput(event, this)" autocomplete="off">
				<i id="eye-old-password" onclick="eye(this)" class="fa-eye-slash fa-solid icon"></i>
				<i class="fa-circle-exclamation fa-solid warning-icon" id="old-password-warning" onclick="warningIconClick(this);"></i>
			</div>
			<p class="warning-message" id="old-password-empty">This field is required!</p>
			<p class="warning-message" id="incorrect-password-pass">Incorrect password!</p>
			<div id="new-password-frame" class="frame">
				<i id="fa-new-password" class="fa-key fa-solid icon" onclick="iconClick(this)"></i>
				<input id="new-password" class="two-icons-field" type="password" name="new-password" placeholder="New password" onfocus="focusField(this,true)" onblur="validate1(this)" onKeyUp="onInput(event, this)" autocomplete="off">
				<i id="eye-new-password" onclick="eye(this)" class="fa-eye-slash fa-solid icon"></i>
				<i class="fa-circle-exclamation fa-solid warning-icon" id="new-password-warning" onclick="warningIconClick(this);"></i>
			</div>
			<p class="warning-message" id="new-password-empty">This field is required!</p>
			<p class="warning-message" id="incorrect-format">The password must contain at least one of the following: a lowercase letter, an uppercase letter, a number and be at least 8 characters long!</p>
			<div id="confirm-password-frame" class="frame">
				<i id="fa-confirm-password" class="fa-key fa-solid icon" onclick="iconClick(this)"></i>
				<input id="confirm-password" class="two-icons-field" type="password" name="confirm-password" placeholder="Retype password" onfocus="focusField(this,true)" onblur="validate1(this)" onKeyUp="onInput(event, this)" autocomplete="off">
				<i id="eye-confirm-password" onclick="eye(this)" class="fa-eye-slash fa-solid icon"></i>
				<i class="fa-circle-exclamation fa-solid warning-icon" id="confirm-password-warning" onclick="warningIconClick(this);"></i>
			</div>
			<p class="warning-message" id="confirm-password-empty">This field is required!</p>
			<p class="warning-message" id="passwords-dont-match">Passwords do not match!</p>
			<p class="info-message" id="password-successfully-changed">Your password has been changed!</p>
			<input type="button" value="Back" onclick="showLoginForm()" class="button back" onmousedown="pressButton(this);" onmouseup="releaseButton(this);" onmouseout="releaseButton(this);">
			<input type="button" value="Change password" class="button confirm-button right" onClick="changePassword()" onmousedown="pressButton(this);" onmouseup="releaseButton(this);" onmouseout="releaseButton(this);">
		</form>
	</body>
</html>
<?php
if(isset($konekcija)) {
	mysqli_close($konekcija);
}
?>
