var loginFields = new Map([["username",false],["password",false]]);
var registrationFields = new Map([["firstname", false],["lastname", false],["usernamer", false],["passwordr", false],["passwordrr", false],["email", false]]);
var managePasswordFields = new Map([["rf-username",false],["old-password",false],["new-password",false],["confirm-password",false]]);
document.cookie = "prijava=0";
var prijava=0;
function iconClick(icon) {
	document.getElementById(icon.id.substr(3)).focus();
}
function warningIconClick(icon) {
	document.getElementById(icon.id.substr(0, icon.id.lastIndexOf("-"))).focus();
}
function animate() {
	let loginForm = document.getElementById("login-form");
	loginForm.style.top="100px";
	loginForm.style.opacity="1";
}
function focusField(x,b) {
	/*document.getElementById(x.id+"-frame").style.border=(b)?"3px solid white":"3px solid black";
	document.getElementById("fa-"+x.id).style.color=(b)?"LightSkyBlue":"rgb(50,50,50)";*/
}
function eye(icon) {
	if (icon.className=="fa-eye-slash fa-solid icon") {
		icon.className="fa-eye fa-solid icon"
		document.getElementById(icon.id.substr(4)).type="text";
		document.getElementById(icon.id.substr(4)).focus();
	}else{
		icon.className="fa-eye-slash fa-solid icon";
		document.getElementById(icon.id.substr(4)).type="password";
		document.getElementById(icon.id.substr(4)).focus();
	}
}
function validate1(x, validiraj=true) {
	focusField(x,false);
	if(x.id=="usernamer") {
		var fd = new FormData();
		fd.append("usernamer", document.getElementById("usernamer").value);
		var xhttp = new XMLHttpRequest();
		xhttp.onload = function() {
			switch(this.responseText) {
				case "username-available":
					document.getElementById("username-available").style.display="block";
				break;
				case "username-taken":
					document.getElementById("username-taken").style.display="block";
			}
		};
		xhttp.open("POST", "api/checkUsername.php", true);
		xhttp.send(fd);
	}
	if(validiraj)
		validate2(x,true);
}
function validate2(x,blur) {			
	if(x.value=="") {
		if (x.form.id=="login-form") {
			loginFields.set(x.id,false);
		}else if(x.form.id=="registration-form") {
			registrationFields.set(x.id,false);
		}else{
			managePasswordFields.set(x.id,false);
		}
		if(x.classList.contains("one-icon-field")) {
			x.style.width="calc(100% - 80px)";
		}else{
			x.style.width="calc(100% - 120px)";
		}
		document.getElementById(x.id+"-frame").style.border="3px solid red";
		document.getElementById(x.id+"-warning").style.display="block";
		document.getElementById(x.id+"-empty").style.display="block";
	}else{
		if (x.form.id=="login-form") {
			loginFields.set(x.id,true);
		}else if(x.form.id=="registration-form") {
			registrationFields.set(x.id,true);
		}else{
			managePasswordFields.set(x.id,true);
		}
		if(x.classList.contains("one-icon-field")) {
			x.style.width="calc(100% - 40px)";
		}else{
			x.style.width="calc(100% - 80px)";
		}
		document.getElementById(x.id+"-frame").style.border="3px solid LightSkyBlue";
		document.getElementById(x.id+"-warning").style.display="none";
		document.getElementById(x.id+"-empty").style.display="none";
	}
}
function onInput(e,x) {
	if (e.key=="Enter") {
		if (x.form.id=="login-form") {
			logIn();
		}else if(x.form.id=="registration-form") {
			register();
		}else{
			changePassword();
		}
	}
	if (x.id=="username") {
		document.getElementById("user-does-not-exist").style.display="none";
		document.getElementById("waiting").style.display="none";
	}
	if (x.id=="password") {
		document.getElementById("incorrect-password").style.display="none";
		document.getElementById("waiting").style.display="none";
	}
	if (x.id=="rf-username") {
		document.getElementById("user-does-not-exist-pass").style.display="none";
		document.getElementById("password-successfully-changed").style.display="none";
	}
	if (x.id=="old-password") {
		document.getElementById("incorrect-password-pass").style.display="none";
		document.getElementById("password-successfully-changed").style.display="none";
	}
	if (x.id=="new-password") {
		document.getElementById("incorrect-format").style.display="none";
		document.getElementById("password-successfully-changed").style.display="none";
	}
	if (x.id=="new-password"||x.id=="confirm-password") {
		document.getElementById("passwords-dont-match").style.display="none";
		document.getElementById("password-successfully-changed").style.display="none";
	}
	if (x.id=="passwordr") {
		document.getElementById("incorrect-format-reg").style.display="none";
		document.getElementById("registration-successful").style.display="none";
	}
	if ((x.id=="passwordr"||x.id=="passwordrr")) {
		document.getElementById("passwords-dont-match-reg").style.display="none";
		document.getElementById("registration-successful").style.display="none";
	}
	if (x.id=="email") {
		document.getElementById("invalid-mail").style.display="none";
		document.getElementById("registration-successful").style.display="none";
	}
	if (x.id=="usernamer") {
		document.getElementById("username-taken").style.display="none";
		document.getElementById("username-available").style.display="none";
		document.getElementById("registration-successful").style.display="none";
	}
	validate2(x,false);
}
function showRegistrationForm() {
	document.getElementById("registration-form").style.display="block";
	document.getElementById("login-form").style.display="none";
	document.getElementById("password-change-form").style.display="none";
	document.getElementById("password").value="";
	document.getElementById("old-password").value="";
	document.getElementById("new-password").value="";
	document.getElementById("confirm-password").value="";
	loginFields.set('password',false);
	managePasswordFields.set('old-password',false);
	managePasswordFields.set('new-password',false);
	managePasswordFields.set('confirm-password',false);
}
function showLoginForm() {
	document.getElementById("registration-form").style.display="none";
	document.getElementById("login-form").style.display="block";
	document.getElementById("password-change-form").style.display="none";
	document.getElementById("passwordr").value="";
	document.getElementById("passwordrr").value="";
	document.getElementById("old-password").value="";
	document.getElementById("new-password").value="";
	document.getElementById("confirm-password").value="";
	registrationFields.set('passwordr',false);
	registrationFields.set('passwordrr',false);
	managePasswordFields.set('old-password',false);
	managePasswordFields.set('new-password',false);
	managePasswordFields.set('confirm-password',false);
}
function showPasswordChangeForm() {
	document.getElementById("registration-form").style.display="none";
	document.getElementById("login-form").style.display="none";
	document.getElementById("password-change-form").style.display="block";
	document.getElementById("password").value="";
	document.getElementById("passwordr").value="";
	document.getElementById("passwordrr").value="";
	loginFields.set('password',false);
	registrationFields.set('passwordr',false);
	registrationFields.set('passwordrr',false);
}
function clickOnFileInput() {
	document.getElementById("my-photo").click();
}
function showImage(x) {
	if(x.files[0]) {
		document.getElementById('profile-photo').src=window.URL.createObjectURL(x.files[0]);
		document.getElementById('profile-photo').style.display="block";
		document.getElementById('my-photo-filename').innerHTML="Press X to remove";
		document.getElementById('my-photo-filename').style.width="calc(100% - 80px)";
		document.getElementById('my-photo-remove').style.display="block";
	}
}
function hideImage() {
	document.getElementById('my-photo').value="";
	document.getElementById('profile-photo').style.display="none";
	document.getElementById('my-photo-filename').innerHTML="Click to upload photo";
	document.getElementById('my-photo-filename').style.width="calc(100% - 40px)";
	document.getElementById('my-photo-remove').style.display="none";
}
function logIn() {
	var ok = true;
	loginFields.forEach (function(value, key) {
		if (value==false) {
			ok=false;
			var y = document.getElementById(key);
			if(y.classList.contains("one-icon-field")) {
				y.style.width="calc(100% - 80px)";
			}else{
				y.style.width="calc(100% - 120px)";
			}
			document.getElementById(y.id+"-frame").style.border="3px solid red";
			document.getElementById(y.id+"-warning").style.display="block";
			document.getElementById(y.id+"-empty").style.display="block";
		}
	})
	if (ok) {
		var fd = new FormData(document.getElementById("login-form"));
		var xhttp = new XMLHttpRequest();
		xhttp.onload = function() {
			switch(this.responseText) {
				case "home":
					document.location.href="home.php";
				break;
				default:
					document.getElementById(this.responseText).style.display="block";
			}
		};
		xhttp.open("POST", "api/logIn.php", true);
		xhttp.send(fd);
	}
}
function checkCookies(x) {
	if (x.checked) {
		if (!navigator.cookieEnabled) {
			document.getElementById("cookies-disabled").style.display="block";
		}
	}else{
		document.getElementById("cookies-disabled").style.display="none";
	}
}
function changePassword() {
	var ok = true;
	managePasswordFields.forEach (function(value, key) {
		if (value==false) {
			ok=false;
			var y = document.getElementById(key);
			if(y.classList.contains("one-icon-field")) {
				y.style.width="calc(100% - 80px)";
			}else{
				y.style.width="calc(100% - 120px)";
			}
			document.getElementById(y.id+"-frame").style.border="3px solid red";
			document.getElementById(y.id+"-warning").style.display="block";
			document.getElementById(y.id+"-empty").style.display="block";
		}
	})
	var malo = /[a-z]/;
	var veliko = /[A-Z]/;
	var cifra = /[0-9]/;
	var pass=document.getElementById("new-password").value;
	if (!malo.test(pass)||!veliko.test(pass)||!cifra.test(pass)||pass.length<8) {
		document.getElementById("incorrect-format").style.display="block";
		ok=false;
	}
	if (document.getElementById("new-password").value!=document.getElementById("confirm-password").value) {
		document.getElementById("passwords-dont-match").style.display="block";
		ok=false;
	}
	if (ok) {
		var fd = new FormData(document.getElementById("password-change-form"));
		var xhttp = new XMLHttpRequest();
		xhttp.onload = function() {
			switch(this.responseText) {
				case "success":
					document.getElementById("password-successfully-changed").style.display="block";
				break;
				default:
					document.getElementById(this.responseText).style.display="block";
			}
		};
		xhttp.open("POST", "api/changePassword.php", true);
		xhttp.send(fd);
	}
}
function register() {
	var ok = true;
	registrationFields.forEach (function(value, key) {
		if (value==false) {
			var y = document.getElementById(key);
			ok=false;
			if(y.classList.contains("one-icon-field")) {
				y.style.width="calc(100% - 80px)";
			}else{
				y.style.width="calc(100% - 120px)";
			}
			document.getElementById(y.id+"-frame").style.border="3px solid red";
			document.getElementById(y.id+"-warning").style.display="block";
			document.getElementById(y.id+"-empty").style.display="block";
		}
	})
	var malo = /[a-z]/;
	var veliko = /[A-Z]/;
	var cifra = /[0-9]/;
	var pass=document.getElementById("passwordr").value;
	if (!malo.test(pass)||!veliko.test(pass)||!cifra.test(pass)||pass.length<8) {
		document.getElementById("incorrect-format-reg").style.display="block";
		ok=false;
	}
	if (!document.getElementById("email").value.includes("@")) {
		document.getElementById("invalid-mail").style.display="block";
		ok=false;
	}
	if (document.getElementById("passwordr").value!=document.getElementById("passwordrr").value) {
		document.getElementById("passwords-dont-match-reg").style.display="block";
		ok=false;
	}
	if (ok) {
		var fd = new FormData(document.getElementById("registration-form"));
		var xhttp = new XMLHttpRequest();
		xhttp.onload = function() {
			switch(this.responseText) {
				case "success":
					document.getElementById("registration-successful").style.display="block";
					document.getElementById("username-available").style.display="none";
				break;
				default:
					document.getElementById(this.responseText).style.display="block";
			}
		};
		xhttp.open("POST", "api/registerAccount.php", true);
		xhttp.send(fd);
	}
}
function selektujPrijavu(x) {
	var tmp = prijava;
	if (x.className=="prijava") {
		x.className="aktivna-prijava";
		prijava=x.id.substr(8);
		document.getElementById("username").value="";
		document.cookie = "prijava="+prijava;
		loginFields.set("username", true);
		document.getElementById("username-switch").style.display="none";
	}else{
		x.className="prijava";
		prijava=0;
		document.cookie = "prijava=0";
		loginFields.set("username", false);
		document.getElementById("username-switch").style.display="block";
	}
	if (tmp) {
		document.getElementById("prijava-"+tmp).className="prijava";
	}
}
function prikaziX(x) {
	document.getElementById("x-"+x.id.substr(8)).style.display="block";
}
function sakrijX(x) {
	document.getElementById("x-"+x.id.substr(8)).style.display="none";
}
function obrisiPrijavu(x) {
	var tmp = document.getElementById("prijava-"+x.id.substr(2));
	if (tmp.className=="aktivna-prijava") {
		prijava=0;
		document.cookie = "prijava=0";
		loginFields.set("username", false);
		document.getElementById("username-switch").style.display="block";
	}
	var fd=new FormData();
	fd.append("prijava",x.id.substr(2));
	var xhttp = new XMLHttpRequest();
	xhttp.onload = function() {
		switch(this.responseText) {
			case "no-logins":
				document.getElementById("recent-logins").remove();
		}
	};
	xhttp.open("POST", "api/removeLogin.php", true);
	xhttp.send(fd);
	event.stopPropagation();
	tmp.remove();
}
function izbrojKaraktere(input) {
	document.getElementById("num-of-characters-"+input.id).innerHTML=input.value.length;
}
function pressButton(btn) {
	btn.style.boxShadow="none";
	btn.style.left="3px";
	btn.style.top="3px";
}
function releaseButton(btn) {
	btn.style.boxShadow="3px 3px 3px gray";
	btn.style.left="0";
	btn.style.top="0";
}