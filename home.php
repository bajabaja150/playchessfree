<?php
session_start();
if(isset($_SESSION['id'])) {
	$konekcija=mysqli_connect("localhost","baja","baja1997","chess_db");
	$id=$_SESSION['id'];
	if(isset($_POST['logout'])) {
		$komanda = "UPDATE user SET online=".time()." WHERE id=$id;";
		$res= mysqli_query($konekcija,$komanda);
		unset($_SESSION['id']);
		setcookie("login", "", strtotime("-1 week"),path:"/", secure:true, httponly: true);
		setcookie("id", "", strtotime("-1 week"),path:"/", secure:true, httponly: true);
		header("Location: index.php");
	}else{
		$komanda = "SELECT * FROM user WHERE id='$id';";
		$res= mysqli_query($konekcija,$komanda);
		$user = mysqli_fetch_assoc($res);
		$wsToken = bin2hex(random_bytes(32));
		$komanda = "UPDATE user SET ws_token='".$wsToken."' WHERE id=$id;";
		$res= mysqli_query($konekcija,$komanda);
	}
}else{
	header("Location: index.php");
}
?>
<!DOCTYPE html>
<html lang="en-US">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<script src="https://kit.fontawesome.com/9e09d7e85e.js" crossorigin="anonymous"></script>
		<link rel="icon" href="assets/png/logo.png">
		<title>Play free chess games online</title>
		<link rel="stylesheet" href="css/home.css">
		<script defer src="js/home.js"></script>
		<script>
			let wsToken = "<?php echo $wsToken?>";
		</script>
	</head>
	<body onload="connect()">
		<div id="mainContainer">
			<div id="game">
				<div id="promotion">
				<h1 style="color:white;text-align:center">Choose your new piece!</h1>
				<div style="display:none" id="white-promotion">
				<img src="assets/svg/wrn.svg" class="promotion-piece" onclick="promotePiece('R',this)">
				<img src="assets/svg/wbn.svg" class="promotion-piece" onclick="promotePiece('B',this)">
				<img src="assets/svg/wnn.svg" class="promotion-piece" onclick="promotePiece('N',this)">
				<img src="assets/svg/wqn.svg" class="promotion-piece" onclick="promotePiece('Q',this)">
				</div>
				<div style="display:none" id="black-promotion">
				<img src="assets/svg/brn.svg" class="promotion-piece" onclick="promotePiece('r',this)">
				<img src="assets/svg/bbn.svg" class="promotion-piece" onclick="promotePiece('b',this)">
				<img src="assets/svg/bnn.svg" class="promotion-piece" onclick="promotePiece('n',this)">
				<img src="assets/svg/bqn.svg" class="promotion-piece" onclick="promotePiece('q',this)">
				</div>
				</div>
				<div class="playerInfo" id="opponentInfo">

					<img class="playerInfoImage" id="opponentImage" src="avatars/<?php echo $user['photo'];?>">
					<div class="centriran-tekst">
					<p id="opponentName"><?php echo $user['first_name']." ".$user['last_name'];?></p>
					</div>
					<div class="controls">
						<h1 class="clock" id="opponentClock">10:00</h1>
					</div>
				</div>
				
				<div id="board">
				</div>
				<div class="controls">
					<h1 class="clock" id="playerClock">10:00</h1>
					<img class="icon" src="assets/png/logout.png" onclick="logOut()">
					<img class="icon" src="assets/png/rotate.png" onclick="rotate()">
					<img class="icon" src="assets/png/volume-on.png" id="sound" onclick="toggleSound(this)">
					<img class="icon hidden" src="assets/png/draw.png" id = "resign" onclick="offerDraw()">
					<img class="icon hidden" src="assets/png/resign.png" id="offerDraw" onclick="showResignPanel()">
					
					<input type="button" id="newGame" class="confirm-button left button-controls" onclick="showNewGamePanel()" value="Play vs random" onmousedown="pressButton(this);" onmouseup="releaseButton(this);" onmouseout="releaseButton(this);">
					<input class="msg" type="text" name="msg" id="msg" onKeyUp="onInput(event)">
					<img class="icon hidden" src="assets/png/send.png" id="sendMsg" onclick="send()">
					
					<form id="logOutForm" action="home.php" method="POST">
						<input type="hidden" name="logout" value="logout">
					</form>
				</div>
				<div class="playerInfo">

					<img class="playerInfoImage" src="avatars/<?php echo $user['photo'];?>">
					<div class="centriran-tekst">
					<p><?php echo $user['first_name']." ".$user['last_name'];?></p>
					</div>
					
				</div>
				<div id="newGamePanel">
					<div class="x-icon-frame">
					<i class="fa-x fa-solid x-icon" onclick="hideNewGamePanel();"></i>
					</div>
					<h3 class="title-small" id="newGameTitle">Pick your color</h3>
					<h3 style ="display:none" class="title-small" id="waitingForOpponent">Waiting for opponent<span id="dots">.</span></h3>
					<div id="colorContainer">
					<div class="smallContainer left" id="playAsWhiteBorder"><img class="newGameIconColor" id="playAsWhite" src="assets/svg/wkn.svg" onclick="playAsWhite(this)"></div>
					<div class="smallContainer center" id="playAsRandomBorder"><img style = "padding: 5px;" class="newGameIconColor" id="playAsRandom" src="assets/svg/bwk.svg" onclick="random(this)"></div>
					<div class="smallContainer right" id="playAsBlackBorder"><img class="newGameIconColor" id="playAsBlack" src="assets/svg/bkn.svg" onclick="playAsBlack(this)"></div>
					<!--
					<input type="button" value="Back" onclick="hideNewGamePanel()" class="button back" onmousedown="pressButton(this);" onmouseup="releaseButton(this);" onmouseout="releaseButton(this);">
					<input type="button" value="Play" class="button confirm-button right" onClick="play()" onmousedown="pressButton(this);" onmouseup="releaseButton(this);" onmouseout="releaseButton(this);">
					-->
					</div>
				</div>
				<div id="gameEndPanel">
					<div class="x-icon-frame">
					<i class="fa-x fa-solid x-icon" onclick="hideEndGamePanel();"></i>
					</div>
					<h3 class="title-small" id="gameEndTitle"></h3>
					<input type="button" value="Home" onclick="hideEndGamePanel()" class="button back" onmousedown="pressButton(this);" onmouseup="releaseButton(this);" onmouseout="releaseButton(this);">
					<input type="button" value="Rematch" class="button confirm-button right" onClick="rematch()" onmousedown="pressButton(this);" onmouseup="releaseButton(this);" onmouseout="releaseButton(this);">
				</div>
				<div id="resignPanel">
					<div class="x-icon-frame">
					<i class="fa-x fa-solid x-icon" onclick="hideResignPanel();"></i>
					</div>
					<h3 class="title-small">Are you sure you want to resign?</h3>
					<input type="button" value="Keep playing" onclick="hideResignPanel()" class="button confirm-button" onmousedown="pressButton(this);" onmouseup="releaseButton(this);" onmouseout="releaseButton(this);">
					<input type="button" value="Resign" class="button back right" onClick="resign()" onmousedown="pressButton(this);" onmouseup="releaseButton(this);" onmouseout="releaseButton(this);">
				</div>
				<div id="drawPanel">
					<div class="x-icon-frame">
					<i class="fa-x fa-solid x-icon" onclick="declineDraw();"></i>
					</div>
					<h3 class="title-small">Opponent is offering you a draw. Do you accept?</h3>
					<input type="button" value="Decline" onclick="declineDraw()" class="button back" onmousedown="pressButton(this);" onmouseup="releaseButton(this);" onmouseout="releaseButton(this);">
					<input type="button" value="Accept" class="button confirm-button right" onClick="acceptDraw()" onmousedown="pressButton(this);" onmouseup="releaseButton(this);" onmouseout="releaseButton(this);">
				</div>
				<div id="declinePanel">
					<div class="x-icon-frame">
					<i class="fa-x fa-solid x-icon" onclick="hideDeclinePanel();"></i>
					</div>
					<h3 class="title-small">Opponent has declined your draw offer.</h3>
					<input type="button" value="OK" class="button confirm-button right" onClick="hideDeclinePanel()" onmousedown="pressButton(this);" onmouseup="releaseButton(this);" onmouseout="releaseButton(this);">
				</div>
				<div id="rematchPanel">
					<div class="x-icon-frame">
					<i class="fa-x fa-solid x-icon" onclick="declineRematch();"></i>
					</div>
					<h3 class="title-small">Opponent wants a rematch. Do you accept?</h3>
					<input type="button" value="Decline" onclick="declineRematch()" class="button back" onmousedown="pressButton(this);" onmouseup="releaseButton(this);" onmouseout="releaseButton(this);">
					<input type="button" value="Accept" class="button confirm-button right" onClick="acceptRematch()" onmousedown="pressButton(this);" onmouseup="releaseButton(this);" onmouseout="releaseButton(this);">
				</div>
				<div id="declineRematchPanel">
					<div class="x-icon-frame">
					<i class="fa-x fa-solid x-icon" onclick="hideDeclineRematchPanel();"></i>
					</div>
					<h3 class="title-small">Opponent has declined your rematch offer.</h3>
					<input type="button" value="OK" class="button confirm-button right" onClick="hideDeclineRematchPanel()" onmousedown="pressButton(this);" onmouseup="releaseButton(this);" onmouseout="releaseButton(this);">
				</div>
			</div>
			<div id="chat">
			
			</div>
		</div>
		<div id="server-stats">
		<p id="players-online"></p>
		<p><?php 
		$komanda = "SELECT count(*) AS count FROM user;";
		$res= mysqli_query($konekcija,$komanda);
		$row= mysqli_fetch_assoc($res);
		echo 'Registered players: '.$row['count'];
		?></p>
		</div>
		
	</body>
</html>
<?php
if(isset($konekcija)) {
	mysqli_close($konekcija);
}
?>
