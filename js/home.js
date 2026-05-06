//xSrc -rank
//ySrc - file
let moveSnd = new Audio("assets/mp3/move-self.mp3");
let captureSnd = new Audio("assets/mp3/capture.mp3");
let notifySnd = new Audio("assets/mp3/notify.mp3");
let timeWarningSnd = new Audio("assets/mp3/tenseconds.mp3");
let drawOfferSnd = new Audio("assets/mp3/drawoffer.mp3");
let declineSnd = new Audio("assets/mp3/decline.mp3")
let gameWinSnd = new Audio("assets/mp3/game-win.mp3");
let gameLooseSnd = new Audio("assets/mp3/game-loose.mp3");
let gameDrawSnd = new Audio("assets/mp3/game-draw.mp3");
let board = document.getElementById("board");
let soundOn = localStorage.soundOn != "false";
if (soundOn) {
	document.getElementById("sound").src="../assets/png/volume-on.png";
} else {
	document.getElementById("sound").src="../assets/png/volume-off.png";
}
let boardRotated = false;
let player_white = true;
let whitePieces=[];
let blackPieces=[];
let whitePiecesCopy=[];
let blackPiecesCopy=[];
let old_b_dest= null;
let old_b_src= null;
let old_position= null;
let old_piece= null;
let capturedPiece = null;
let whiteTurn = true;
let playerTime = 600;
let opponentTime = 600;
let gameOver = true;
let promotionPiece = null;
let whiteCastlingRights = [1, 1];
let blackCastlingRights = [1, 1];
let castlingKingPosition = null;
let whiteEnPassantTarget = null;
let blackEnPassantTarget = null;
let whiteEnPassantCapturePosition = null;
let blackEnPassantCapturePosition = null;
let numOfHalfMoves = 0;
let numOfFullMoves = 1;
let conn=null;
let clockInterval=null;
////////////
let messageCameAt=null;
let gameStartedAt=null;
let clockUpdateAt=null;
let wasItWhiteTurn=null;
let elapsed=null;
let hiddenAt=null;
document.addEventListener("visibilitychange", gamePaused);
//***********************************
let gameSearching=false;
let waitingInterval=null;
//**********************************
let promotionCoordsX=null;
let promotionCoordsY=null;
let promotionDelay = false;
let b = [["R","N","B","Q","K","B","N","R"], //rank 1
				["P","P","P","P","P","P","P","P"],
				[" "," "," "," "," "," "," "," "],
				[" "," "," "," "," "," "," "," "],
				[" "," "," "," "," "," "," "," "],
				[" "," "," "," "," "," "," "," "],
				["p","p","p","p","p","p","p","p"],
				["r","n","b","q","k","b","n","r"]]; //rank 8
let selected_piece = null;
let pk= null;
let ek = null;
let whiteInLastMatch = null;
let whiteCoordinates = [[10,70],[20,70],[30,70],[40,70],[50,70],[60,70],[70,70],[80,70],
										[10,80],[80,80],[20,80],[70,80],[30,80],[60,80],[50,80],[40,80]];
let blackCoordinates = [[10,20],[20,20],[30,20],[40,20],[50,20],[60,20],[70,20],[80,20],
										[10,10],[80,10],[20,10],[70,10],[30,10],[60,10],[50,10],[40,10]]
let whiteTypes=["P","P","P","P","P","P","P","P","R","R","N","N","B","B","K","Q"];
let blackTypes=["p","p","p","p","p","p","p","p","r","r","n","n","b","b","k","q"];
let whitePositions=["a2","b2","c2","d2","e2","f2","g2","h2","a1","h1","b1","g1","c1","f1","e1","d1"];
let blackPositions=["a7","b7","c7","d7","e7","f7","g7","h7","a8","h8","b8","g8","c8","f8","e8","d8"];
let whiteImg=["wpn.svg","wpn.svg","wpn.svg","wpn.svg","wpn.svg","wpn.svg","wpn.svg","wpn.svg",
					"wrn.svg", "wrn.svg", "wnn.svg", "wnn.svg", "wbn.svg", "wbn.svg", "wkn.svg", "wqn.svg"];
let blackImg=["bpr.svg","bpr.svg","bpr.svg","bpr.svg","bpr.svg","bpr.svg","bpr.svg","bpr.svg",
					"brr.svg", "brr.svg", "bnr.svg", "bnr.svg", "bbr.svg", "bbr.svg", "bkr.svg", "bqr.svg"];
//---------------------------------------------------------------------------------------
for(let i = 0; i < 10; i++) {
	for(let j = 0; j < 10; j++) {
		if (i>=1&&i<=8&&j>=1&&j<=8) {
			let tile = document.createElement("IMG");
			let psbl = document.createElement("IMG");
			tile.className = "tile";
			psbl.className = "tile";
			tile.style.left = j*10 + "%";
			tile.style.top = i*10 + "%";
			psbl.style.left = j*10 + "%";
			psbl.style.top = i*10 + "%";
			psbl.id = coordsToTile(8-i,j-1);
			tile.id = "t" + psbl.id;
			tile.addEventListener("click", function () {clickTile(this);});
			psbl.addEventListener("click", function () {clickPsbl(this);});
			psbl.src = "assets/png/psbl2.png";
			if ((i+j)%2) {
				tile.src = "assets/png/black.png";
			}else{
				tile.src = "assets/png/white.png";
			}
			psbl.style.display="none";
			psbl.style.zIndex = "10";
			board.appendChild(tile);
			board.appendChild(psbl);
		}else{
			let mark = document.createElement("DIV");
			let markText = document.createElement("P");
			mark.className = "tile mark";
			markText.className="mark-text";
			if ((i==0||i==9)&&(j!=0&&j!=9)) {
				markText.innerHTML=String.fromCharCode(64+j);
			}
			if ((j==0||j==9)&&(i!=0&&i!=9)) {
				markText.innerHTML=String(9-i);
			}
			mark.style.left = j*10 + "%";
			mark.style.top = i*10 + "%";
			mark.appendChild(markText);
			board.appendChild(mark);
		}
	}
}
//pieces generating----------------------------------------------------------
for (let i = 0; i < 16; i++) {
	let p = document.createElement("IMG");
	if (i==14) {
		pk=p;
	}
	whitePieces.push(p);
	whitePiecesCopy.push(p);
	p.whitePiece=true;
	p.style.left=whiteCoordinates[i][0]+"%";
	p.style.top=whiteCoordinates[i][1]+"%";
	p.pieceType = whiteTypes[i];
	p.position = whitePositions[i];
	p.src="assets/svg/"+whiteImg[i];
	p.className="piece";
	setFieldOfAttack(p);
	p.availableMoves=[];
	board.appendChild(p);
	p.addEventListener("click", function () {selectPiece(this);});
	p.addEventListener("mouseover", function() {mouseOverPiece(this)});
	p.addEventListener("mouseout", function() {mouseOutPiece(this)});
	document.getElementById(p.position).piece=p;
	//-----------------------------------
	let q = document.createElement("IMG");
	if (i==14) {
		ek=q;
	}
	blackPieces.push(q);
	blackPiecesCopy.push(q);
	q.whitePiece=false;
	q.style.left=blackCoordinates[i][0]+"%";
	q.style.top=blackCoordinates[i][1]+"%";
	q.pieceType = blackTypes[i];
	q.position = blackPositions[i];
	q.src="assets/svg/"+blackImg[i];
	q.className="piece";
	setFieldOfAttack(q);
	q.availableMoves=[];
	board.appendChild(q);
	q.addEventListener("click", function () {selectPiece(this);});
	q.addEventListener("mouseover", function() {mouseOverPiece(this)});
	q.addEventListener("mouseout", function() {mouseOutPiece(this)});
	document.getElementById(q.position).piece=q;
}
//functions are below
function clickTile(tile) {
	if(selected_piece) {
		clearTiles();
		selected_piece=null;
	}
}
function clickPsbl(tile) {
	clearTiles();
	let msgText;
	if ((player_white&&whiteTurn)||(!player_white&&!whiteTurn)) {
		let msgObj = {move: true, from: selected_piece.position, to:  tile.id};
		msgText = JSON.stringify(msgObj);
	}
	let xSrc = Number(selected_piece.position.charAt(1)) - 1;
	let ySrc = selected_piece.position.charCodeAt(0) - 97;
	let xDest = Number(tile.id.charAt(1)) - 1;
	let yDest = tile.id.charCodeAt(0) - 97;
	if (selected_piece.position=="a1") {
		whiteCastlingRights[1]=0;
	}
	if (selected_piece.position=="h1") {
		whiteCastlingRights[0]=0;
	}
	if (selected_piece.position=="a8") {
		blackCastlingRights[1]=0;
	}
	if (selected_piece.position=="h8") {
		blackCastlingRights[0]=0;
	}
	selected_piece.position=tile.id;
	selected_piece.style.left=tile.style.left;
	selected_piece.style.top=tile.style.top;
	/*if (selected_piece.pieceType.toLowerCase()=="p"&&(xDest==0||xDest==7)) {
		promotionPiece=selected_piece;
		promote();
	}*/
	//				 promocija je spojena dole
	if (selected_piece.pieceType.toLowerCase()=="p") {
		numOfHalfMoves = -1;
		if (xDest==0||xDest==7) {
			promotionPiece=selected_piece;
			promote();
			promotionDelay=true;
			promotionCoordsX=xSrc;
			promotionCoordsY=ySrc;
		}
		if (whiteTurn&&xSrc==1&&xDest==3) {
			whiteEnPassantTarget = selected_piece;
			whiteEnPassantCapturePosition = coordsToTile(xSrc+1,ySrc);
			//alert("en passant " + whiteEnPassantTarget.position);
		}
		if (!whiteTurn&&xSrc==6&&xDest==4) {
			blackEnPassantTarget = selected_piece;
			blackEnPassantCapturePosition = coordsToTile(xSrc-1,ySrc);
			//alert("en passant " + blackEnPassantTarget.position);
		}
		if (whiteTurn) {
			if (tile.id==blackEnPassantCapturePosition) {
				let enPassantTargetRank = Number(blackEnPassantTarget.position.charAt(1)) - 1;
				let enPassantTargetFile = blackEnPassantTarget.position.charCodeAt(0) - 97;
				blackEnPassantTarget.style.display="none";
				if (soundOn) {
					captureSnd.play();
				}

					for (let i = 0; i < blackPieces.length; i++) {
						if (blackEnPassantTarget==blackPieces[i]) {
							blackPieces[i]=blackPieces[blackPieces.length-1];
							blackPieces.length--;
							break;
						}
					}
					b[enPassantTargetRank][enPassantTargetFile] = " ";
				
			}
		}else{
			if (tile.id==whiteEnPassantCapturePosition) {
				let enPassantTargetRank = Number(whiteEnPassantTarget.position.charAt(1)) - 1;
				let enPassantTargetFile = whiteEnPassantTarget.position.charCodeAt(0) - 97;
				whiteEnPassantTarget.style.display="none";
				if (soundOn) {
					captureSnd.play();
				}

					for (let i = 0; i < whitePieces.length; i++) {
						if (whiteEnPassantTarget==whitePieces[i]) {
							whitePieces[i]=whitePieces[whitePieces.length-1];
							whitePieces.length--;
							break;
						}
					}
					b[enPassantTargetRank][enPassantTargetFile] = " ";
					
			}
		}
	}
	if (whiteTurn) {
		blackEnPassantTarget = null;
		blackEnPassantCapturePosition = null;
	}else{
		whiteEnPassantTarget = null;
		whiteEnPassantCapturePosition = null;
	}
	if (b[xDest][yDest]!=" ") {
		numOfHalfMoves = -1;
		tile.piece.style.display="none";
		if (soundOn) {
			captureSnd.play();
		}
		if (whiteTurn) {
			for (let i = 0; i < blackPieces.length; i++) {
				if (tile.piece==blackPieces[i]) {
					blackPieces[i]=blackPieces[blackPieces.length-1];
					blackPieces.length--;
					break;
				}
			}
		} else {
			for (let i = 0; i < whitePieces.length; i++) {
				if (tile.piece==whitePieces[i]) {
					whitePieces[i]=whitePieces[whitePieces.length-1];
					whitePieces.length--;
					break;
				}
			}
		}
	} else {
		if (soundOn) {
			moveSnd.play();
		}
	}
	if (selected_piece.pieceType.toLowerCase()=="k") {
		if (whiteTurn) {
			if (whiteCastlingRights[0]&&tile.id=="g1") {
				let castlingRook = document.getElementById("h1").piece;
				castlingRook.style.left="60%";
				castlingRook.position = "f1";
				document.getElementById("f1").piece = castlingRook;
				document.getElementById("h1").piece = null;
				b[0][7]=" ";
				b[0][5]="R";
			}
			if (whiteCastlingRights[1]&&tile.id=="c1") {
				let castlingRook = document.getElementById("a1").piece;
				castlingRook.style.left="40%";
				castlingRook.position = "d1";
				document.getElementById("d1").piece = castlingRook;
				document.getElementById("a1").piece = null;
				b[0][0]=" ";
				b[0][3]="R";
			}
			whiteCastlingRights[0]=0;
			whiteCastlingRights[1]=0;
		}else{
				if (blackCastlingRights[0]&&tile.id=="g8") {
				let castlingRook = document.getElementById("h8").piece;
				castlingRook.style.left="60%";
				castlingRook.position = "f8";
				document.getElementById("f8").piece = castlingRook;
				document.getElementById("h8").piece = null;
				b[7][7]=" ";
				b[7][5]="r";
			}
			if (blackCastlingRights[1]&&tile.id=="c8") {
				let castlingRook = document.getElementById("a8").piece;
				castlingRook.style.left="40%";
				castlingRook.position = "d8";
				document.getElementById("d8").piece = castlingRook;
				document.getElementById("a8").piece = null;
				b[7][0]=" ";
				b[7][3]="r";
			}
			blackCastlingRights[0]=0;
			blackCastlingRights[1]=0;
		}
	}
	tile.piece=selected_piece;
	b[xDest][yDest]=b[xSrc][ySrc];
	b[xSrc][ySrc]=" ";
	if (player_white) {
		printWhiteBoard();
		printBoard();
	}else{
		printBlackBoard();
		printBoard();
	}
	selected_piece=null;
	for (let i = 0; i < whitePieces.length; i++) {
		setFieldOfAttack(whitePieces[i]);
	}
	for (let i = 0; i < blackPieces.length; i++) {
		setFieldOfAttack(blackPieces[i]);
	}
	let whiteInCheck = false;
	let blackInCheck = false;
	for (let i = 0; i < whitePieces.length; i++) {
		if (whitePieces[i].fieldOfAttack.includes(ek.position)) {
			blackInCheck = true;
			break;
		}
	}
	for (let i = 0; i < blackPieces.length; i++) {
		if (blackPieces[i].fieldOfAttack.includes(pk.position)) {
			whiteInCheck = true;
			break;
		}
	}
	if (!whiteTurn) {
		numOfFullMoves++;
	}
	numOfHalfMoves++;
	whiteTurn = !whiteTurn;
	let noAvailableMovesLeft = true;
	if (!whiteTurn) {
		for (let i = 0; i < blackPieces.length; i++) {
			selectPiece(blackPieces[i], false);
			if (blackPieces[i].availableMoves.length!=0) {
				noAvailableMovesLeft = false;
				break;
			}
		}
	}else{
		for (let i = 0; i < whitePieces.length; i++) {
			selectPiece(whitePieces[i], false);
			if (whitePieces[i].availableMoves.length!=0) {
				noAvailableMovesLeft = false;
				break;
			}
		}
	}
	if (noAvailableMovesLeft) {
		document.getElementById("gameEndPanel").style.display="block";
		let gameEndTitle = document.getElementById("gameEndTitle");
		if (!whiteTurn) {
			if (blackInCheck) {
				if (player_white) {
					gameEndTitle.innerText = "Checkmate! You win!";
					if (soundOn) {
						gameWinSnd.play();
					}
				}else{
					gameEndTitle.innerText = "Checkmate! You lose!";
					if (soundOn) {
						gameLooseSnd.play();
					}
				}
			}else{
				gameEndTitle.innerText = "Stalemate! The game is draw!";
				if (soundOn) {
						gameDrawSnd.play();
				}
			}
		}else{
			if (whiteInCheck) {
				if (player_white) {
					gameEndTitle.innerText = "Checkmate! You lose!";
					if (soundOn) {
						gameLooseSnd.play();
					}
				}else{
					gameEndTitle.innerText = "Checkmate! You win!";
					if (soundOn) {
						gameWinSnd.play();
					}
				}
			} else {
				gameEndTitle.innerText = "Stalemate! The game is draw!";
				if (soundOn) {
					gameDrawSnd.play();
				}
			}
		}
		gameOver=true;
		clearInterval(clockInterval);
	}
	if ((player_white&&!whiteTurn)||(!player_white&&whiteTurn)) {
		if (!promotionDelay) {
			conn.send(msgText);
		}
	}
}
function selectPiece(piece, showAvailableMoves=true) {
	if (showAvailableMoves) {
		if (!(((player_white&&piece.whitePiece&&whiteTurn)||(!player_white&&!piece.whitePiece&&!whiteTurn))&&!gameOver)) {
			return;
		}
	}
	if(selected_piece) {
		clearTiles();
	}

	//alert("you clicked on " + piece.pieceType + " on " + piece.position);
	selected_piece=piece;
	let xSrc = Number(selected_piece.position.charAt(1)) - 1;
	let ySrc = selected_piece.position.charCodeAt(0) - 97;
	/*alert("xsrc: " + xSrc);
	alert("ysrc: " + ySrc);*/
	piece.availableMoves=[];
	let xDest, yDest;
	if (piece.pieceType.toLowerCase()=="n") {
		let dest = [[1,2],[1,-2],[-1,2],[-1,-2],[-2,1],[-2,-1],[2,-1],[2,1]];
		for (let i = 0; i < dest.length; i++) {
			let xDest = xSrc + dest[i][0];
			let yDest = ySrc + dest[i][1];
			if (isInside(xDest, yDest) && !pieceOfSameColor(xSrc, ySrc, xDest, yDest)) {
				
				if (!isCheckAfterMove(xSrc, ySrc, xDest, yDest)) {
					piece.availableMoves.push(coordsToTile(xDest,yDest));
				}
				
			}
		}
	}else if (piece.pieceType.toLowerCase()=="p") {
			xDest=xSrc+((piece.whitePiece)?1:-1);
			yDest=ySrc;
			if (isInside(xDest, yDest) && b[xDest][yDest]==" ") {
				if(!isCheckAfterMove(xSrc,ySrc,xDest,yDest)) {
					piece.availableMoves.push(coordsToTile(xDest,yDest));
				}
			}
			if (xSrc==((piece.whitePiece)?1:6)) {
				xDest=xSrc+((piece.whitePiece)?2:-2);
				yDest=ySrc;
				if (b[xDest][yDest]==" "&&b[xSrc+((piece.whitePiece)?1:-1)][yDest]==" ") {
					if(!isCheckAfterMove(xSrc,ySrc,xDest,yDest)) {
						piece.availableMoves.push(coordsToTile(xDest,yDest));
					}
				}
			}
			xDest=xSrc+((piece.whitePiece)?1:-1);
			yDest=ySrc+1;
			if (isInside(xDest, yDest) && b[xDest][yDest]!=" " && !pieceOfSameColor(xSrc, ySrc, xDest, yDest)) {
				if(!isCheckAfterMove(xSrc,ySrc,xDest,yDest)) {
					piece.availableMoves.push(coordsToTile(xDest,yDest));
				}
			}
			xDest=xSrc+((piece.whitePiece)?1:-1);
			yDest=ySrc-1;
			if (isInside(xDest, yDest) && b[xDest][yDest]!=" " && !pieceOfSameColor(xSrc, ySrc, xDest, yDest)) {
				if(!isCheckAfterMove(xSrc,ySrc,xDest,yDest)) {
					piece.availableMoves.push(coordsToTile(xDest,yDest));
				}
			}
			if (whiteTurn) {
				if (blackEnPassantTarget) {
					let enPassantTargetRank = Number(blackEnPassantTarget.position.charAt(1)) - 1;
					let enPassantTargetFile = blackEnPassantTarget.position.charCodeAt(0) - 97;
					xDest = Number(blackEnPassantCapturePosition.charAt(1));
					yDest = blackEnPassantCapturePosition.charCodeAt(0) - 97;
					if (xSrc==enPassantTargetRank&&Math.abs(ySrc-enPassantTargetFile)==1) {
						if (!isCheckAfterEnPassant(xSrc,ySrc,xDest, yDest,enPassantTargetRank, enPassantTargetFile)) {
							piece.availableMoves.push(coordsToTile(enPassantTargetRank+1,enPassantTargetFile));
						}
					}
				}
			}else{
				if (whiteEnPassantTarget) {
					let enPassantTargetRank = Number(whiteEnPassantTarget.position.charAt(1)) - 1;
					let enPassantTargetFile = whiteEnPassantTarget.position.charCodeAt(0) - 97;
					xDest = Number(whiteEnPassantCapturePosition.charAt(1)) - 2;
					yDest = whiteEnPassantCapturePosition.charCodeAt(0) - 97;
					if (xSrc==enPassantTargetRank&&Math.abs(ySrc-enPassantTargetFile)==1) {
						if (!isCheckAfterEnPassant(xSrc,ySrc,xDest, yDest,enPassantTargetRank, enPassantTargetFile)) {
							piece.availableMoves.push(coordsToTile(enPassantTargetRank-1,enPassantTargetFile));
						}
					}
				}
			}
	}else if(piece.pieceType.toLowerCase()=="r") {
		for (let i = xSrc + 1; i < 8; i++) {
			if (!pieceOfSameColor(xSrc,ySrc,i,ySrc)) {
				if(!isCheckAfterMove(xSrc,ySrc,i, ySrc)) {
					piece.availableMoves.push(coordsToTile(i,ySrc));
				}
				if (b[i][ySrc]!=" ") {
					break;
				}
			}else{
				break;
			}
		}
		for (let i = xSrc - 1; i >= 0; i--) {
			if (!pieceOfSameColor(xSrc,ySrc,i,ySrc)) {
				if(!isCheckAfterMove(xSrc,ySrc,i, ySrc)) {
					piece.availableMoves.push(coordsToTile(i,ySrc));
				}
				if (b[i][ySrc]!=" ") {
					break;
				}
			} else {
				break;
			}
		}
		for (let i = ySrc + 1; i < 8; i++) {
			if (!pieceOfSameColor(xSrc,ySrc,xSrc,i)) {
				if(!isCheckAfterMove(xSrc,ySrc,xSrc, i)) {
					piece.availableMoves.push(coordsToTile(xSrc,i));
				}
				if (b[xSrc][i]!=" ") {
					break;
				}
			}else{
				break;
			}
		}
		for (let i = ySrc - 1; i>= 0; i--) {
			if (!pieceOfSameColor(xSrc,ySrc,xSrc,i)) {
				if(!isCheckAfterMove(xSrc,ySrc,xSrc, i)) {
					piece.availableMoves.push(coordsToTile(xSrc,i));
				}
				if (b[xSrc][i]!=" ") {
					break;
				}
			}else{
				break;
			}
		}
	}else if(piece.pieceType.toLowerCase()=="b") {
		xDest=xSrc+1;
		yDest=ySrc+1;
		while(isInside(xDest,yDest)) {
			if (!pieceOfSameColor(xSrc,ySrc,xDest,yDest)) {
				if(!isCheckAfterMove(xSrc,ySrc,xDest,yDest)) {
					piece.availableMoves.push(coordsToTile(xDest,yDest));
				}
				if (b[xDest][yDest]!=" ") {
					break;
				}
			}else{
				break;
			}
			xDest++;
			yDest++;
		}
		xDest=xSrc+1;
		yDest=ySrc-1;
		while(isInside(xDest,yDest)) {
			if (!pieceOfSameColor(xSrc,ySrc,xDest,yDest)) {
				if(!isCheckAfterMove(xSrc,ySrc,xDest,yDest)) {
					piece.availableMoves.push(coordsToTile(xDest,yDest));
				}
				if (b[xDest][yDest]!=" ") {
					break;
				}
			}else{
				break;
			}
			xDest++;
			yDest--;
		}
		xDest=xSrc-1;
		yDest=ySrc+1;
		while(isInside(xDest,yDest)) {
			if (!pieceOfSameColor(xSrc,ySrc,xDest,yDest)) {
				if(!isCheckAfterMove(xSrc,ySrc,xDest,yDest)) {
					piece.availableMoves.push(coordsToTile(xDest,yDest));
				}
				if (b[xDest][yDest]!=" ") {
					break;
				}
			}else{
				break;
			}
			xDest--;
			yDest++;
		}
		xDest=xSrc-1;
		yDest=ySrc-1;
		while(isInside(xDest,yDest)) {
			if (!pieceOfSameColor(xSrc,ySrc,xDest,yDest)) {
				if(!isCheckAfterMove(xSrc,ySrc,xDest,yDest)) {
					piece.availableMoves.push(coordsToTile(xDest,yDest));
				}
				if (b[xDest][yDest]!=" ") {
					break;
				}
			}else{
				break;
			}
			xDest--;
			yDest--;
		}
	}else if(piece.pieceType.toLowerCase()=="k") {
		for (let i = xSrc-1; i <= xSrc+1; i++) {
			for (let j = ySrc-1; j <= ySrc+1; j++) {
				if (isInside(i,j)&&!pieceOfSameColor(xSrc,ySrc,i,j)) {
					if(!isCheckAfterMove(xSrc,ySrc,i,j)) {
						piece.availableMoves.push(coordsToTile(i,j));
					}
				}
			}
		}
		if (whiteTurn) {
			if (whiteCastlingRights[0]) {
				let canCastle=true;
				if (b[0][5]!=" "||b[0][6]!=" ") {
					canCastle=false;
				}
				for (let i = 0; i < blackPieces.length; i++) {
					if (blackPieces[i].fieldOfAttack.includes("e1")||blackPieces[i].fieldOfAttack.includes("f1")||blackPieces[i].fieldOfAttack.includes("g1")) {
						canCastle=false;
						break;
					}
				}
				if (canCastle) {
					document.getElementById("g1").style.display="block";
					
				}
			}
			if (whiteCastlingRights[1]) {
				let canCastle=true;
				if (b[0][1]!=" "||b[0][2]!=" "||b[0][3]!=" ") {
					canCastle=false;
				}
				for (let i = 0; i < blackPieces.length; i++) {
					if (blackPieces[i].fieldOfAttack.includes("e1")||blackPieces[i].fieldOfAttack.includes("d1")||blackPieces[i].fieldOfAttack.includes("c1")) {
						canCastle=false;
						break;
					}
				}
				if (canCastle) {
					document.getElementById("c1").style.display="block";
					
				}
			}
		}else{
			if (blackCastlingRights[0]) {
				let canCastle=true;
				if (b[7][5]!=" "||b[7][6]!=" ") {
					canCastle=false;
				}
				for (let i = 0; i < blackPieces.length; i++) {
					if (whitePieces[i].fieldOfAttack.includes("e8")||whitePieces[i].fieldOfAttack.includes("f8")||whitePieces[i].fieldOfAttack.includes("g8")) {
						canCastle=false;
						break;
					}
				}
				if (canCastle) {
					document.getElementById("g8").style.display="block";
					
				}
			}
			if (blackCastlingRights[1]) {
				let canCastle=true;
				if (b[7][1]!=" "||b[7][2]!=" "||b[7][3]!=" ") {
					canCastle=false;
				}
				for (let i = 0; i < blackPieces.length; i++) {
					if (whitePieces[i].fieldOfAttack.includes("e8")||whitePieces[i].fieldOfAttack.includes("d8")||whitePieces[i].fieldOfAttack.includes("c8")) {
						canCastle=false;
						break;
					}
				}
				if (canCastle) {
					document.getElementById("c8").style.display="block";
					
				}
			}
		}
	}else if(piece.pieceType.toLowerCase()=="q") {
		for (let i = xSrc + 1; i < 8; i++) {
			if (!pieceOfSameColor(xSrc,ySrc,i,ySrc)) {
				if(!isCheckAfterMove(xSrc,ySrc,i,ySrc)) {
					piece.availableMoves.push(coordsToTile(i,ySrc));
				}
				if (b[i][ySrc]!=" ") {
					break;
				}
			}else{
				break;
			}
		}
		for (let i = xSrc - 1; i >= 0; i--) {
			if (!pieceOfSameColor(xSrc,ySrc,i,ySrc)) {
				if(!isCheckAfterMove(xSrc,ySrc,i,ySrc)) {
					piece.availableMoves.push(coordsToTile(i,ySrc));
				}
				if (b[i][ySrc]!=" ") {
					break;
				}
			} else {
				break;
			}
		}
		for (let i = ySrc + 1; i < 8; i++) {
			if (!pieceOfSameColor(xSrc,ySrc,xSrc,i)) {
				if(!isCheckAfterMove(xSrc,ySrc,xSrc, i)) {
					piece.availableMoves.push(coordsToTile(xSrc,i));
				}
				if (b[xSrc][i]!=" ") {
					break;
				}
			}else{
				break;
			}
		}
		for (let i = ySrc - 1; i>= 0; i--) {
			if (!pieceOfSameColor(xSrc,ySrc,xSrc,i)) {
				if(!isCheckAfterMove(xSrc,ySrc,xSrc, i)) {
					piece.availableMoves.push(coordsToTile(xSrc,i));
				}
				if (b[xSrc][i]!=" ") {
					break;
				}
			}else{
				break;
			}
		}
		xDest=xSrc+1;
		yDest=ySrc+1;
		while(isInside(xDest,yDest)) {
			if (!pieceOfSameColor(xSrc,ySrc,xDest,yDest)) {
				if(!isCheckAfterMove(xSrc,ySrc,xDest,yDest)) {
					piece.availableMoves.push(coordsToTile(xDest,yDest));
				}
				if (b[xDest][yDest]!=" ") {
					break;
				}
			}else{
				break;
			}
			xDest++;
			yDest++;
		}
		xDest=xSrc+1;
		yDest=ySrc-1;
		while(isInside(xDest,yDest)) {
			if (!pieceOfSameColor(xSrc,ySrc,xDest,yDest)) {
				if(!isCheckAfterMove(xSrc,ySrc,xDest,yDest)) {
					piece.availableMoves.push(coordsToTile(xDest,yDest));
				}
				if (b[xDest][yDest]!=" ") {
					break;
				}
			}else{
				break;
			}
			xDest++;
			yDest--;
		}
		xDest=xSrc-1;
		yDest=ySrc+1;
		while(isInside(xDest,yDest)) {
			if (!pieceOfSameColor(xSrc,ySrc,xDest,yDest)) {
				if(!isCheckAfterMove(xSrc,ySrc,xDest,yDest)) {
					piece.availableMoves.push(coordsToTile(xDest,yDest));
				}
				if (b[xDest][yDest]!=" ") {
					break;
				}
			}else{
				break;
			}
			xDest--;
			yDest++;
		}
		xDest=xSrc-1;
		yDest=ySrc-1;
		while(isInside(xDest,yDest)) {
			if (!pieceOfSameColor(xSrc,ySrc,xDest,yDest)) {
				if(!isCheckAfterMove(xSrc,ySrc,xDest,yDest)) {
					piece.availableMoves.push(coordsToTile(xDest,yDest));
				}
				if (b[xDest][yDest]!=" ") {
					break;
				}
			}else{
				break;
			}
			xDest--;
			yDest--;
		}
	}
	if (showAvailableMoves) {
		for (let i = 0; i < piece.availableMoves.length; i++) {
			document.getElementById(piece.availableMoves[i]).style.display="block";
		}
	}
}
function printWhiteBoard() {
	let brd="";
	for (let i = 7; i >= 0; i--) {
	brd+=("[");
		for (let j = 0; j < 8; j++) {
			brd+=(b[i][j]);
			if (j!=7) {
				brd+=(", ");
			}
		}
		brd+=("]\n");
	}
	console.log(brd);
}
function printBlackBoard() {
	let brd="";
	for (let i = 0; i < 8; i++) {
	brd+=("[");
		for (let j = 7; j >= 0; j--) {
			brd+=(b[i][j]);
			if (j!=0) {
				brd+=(", ");
			}
		}
		brd+=("]\n");
	}
	console.log(brd);
}
function printBoard() {
	let brd="";
	for (let i = 0; i < 8; i++) {
	brd+=("[");
		for (let j = 0; j < 8; j++) {
			brd+=(b[i][j]);
			if (j!=7) {
				brd+=(", ");
			}
		}
		brd+=("]\n");
	}
	console.log(brd);
}
function pieceOfSameColor(xSrc, ySrc, xDest, yDest) {
	let piece1 = b[xSrc][ySrc].charCodeAt(0);
	let piece2 = b[xDest][yDest].charCodeAt(0);
	return (piece1>=65&&piece1<=90&&piece2>=65&&piece2<=90)||(piece1>=97&&piece1<=122&&piece2>=97&&piece2<=122);
}
function isInside(xDest, yDest) {
	return xDest >= 0 && xDest <= 7 && yDest >= 0 && yDest <= 7;
}
function coordsToTile(x,y) {
	//0,0->a1
	//0,7->h1
	//7,0->a8
	//7,7->h8
	return String.fromCharCode(y+97)+(x+1);
}
function clearTiles() {
	for (let i = 0; i < 8; i++) {
		for (let j = 0; j < 8; j++) {
			document.getElementById(coordsToTile(i,j)).style.display="none";
		}
	}
}
function setFieldOfAttack(piece) {
	piece.fieldOfAttack=[];
	let xSrc = Number(piece.position.charAt(1)) - 1;
	let ySrc = piece.position.charCodeAt(0) - 97;
	if (piece.pieceType.toLowerCase()=="p") {
		xDest=xSrc+((piece.whitePiece)?1:-1);
		yDest=ySrc+1;
		if (isInside(xDest,yDest)) {
			piece.fieldOfAttack.push(coordsToTile(xDest,yDest));
		}
		xDest=xSrc+((piece.whitePiece)?1:-1);
		yDest=ySrc-1;
		if (isInside(xDest,yDest)) {
			piece.fieldOfAttack.push(coordsToTile(xDest,yDest));
		}
	}else if(piece.pieceType.toLowerCase()=="n") {
		let dest = [[1,2],[1,-2],[-1,2],[-1,-2],[-2,1],[-2,-1],[2,-1],[2,1]];
		for (let i = 0; i < dest.length; i++) {
			let xDest = xSrc + dest[i][0];
			let yDest = ySrc + dest[i][1];
			if (isInside(xDest, yDest)) {
				piece.fieldOfAttack.push(coordsToTile(xDest,yDest));
			}
		}
	}else if(piece.pieceType.toLowerCase() == "r") {
		for (let i = xSrc + 1; i < 8; i++) {
			piece.fieldOfAttack.push(coordsToTile(i,ySrc));
										
				if (b[i][ySrc]!=" ") {
					break;
				}
			
		}
		for (let i = xSrc - 1; i >= 0; i--) {

				piece.fieldOfAttack.push(coordsToTile(i,ySrc));
				if (b[i][ySrc]!=" ") {
					break;
				}

		}
		for (let i = ySrc + 1; i < 8; i++) {

				piece.fieldOfAttack.push(coordsToTile(xSrc,i));
				if (b[xSrc][i]!=" ") {
					break;
				}

		}
		for (let i = ySrc - 1; i>= 0; i--) {

				piece.fieldOfAttack.push(coordsToTile(xSrc,i));
				if (b[xSrc][i]!=" ") {
					break;
				}
				
		}
	}else if(piece.pieceType.toLowerCase() == "b") {
		xDest=xSrc+1;
		yDest=ySrc+1;
		while(isInside(xDest,yDest)) {

				piece.fieldOfAttack.push(coordsToTile(xDest,yDest));
				if (b[xDest][yDest]!=" ") {
					break;
				}

			xDest++;
			yDest++;
		}
		xDest=xSrc+1;
		yDest=ySrc-1;
		while(isInside(xDest,yDest)) {
			
				piece.fieldOfAttack.push(coordsToTile(xDest,yDest));
				if (b[xDest][yDest]!=" ") {
					break;
				}

			xDest++;
			yDest--;
		}
		xDest=xSrc-1;
		yDest=ySrc+1;
		while(isInside(xDest,yDest)) {
			
				piece.fieldOfAttack.push(coordsToTile(xDest,yDest));
				if (b[xDest][yDest]!=" ") {
					break;
				}

			xDest--;
			yDest++;
		}
		xDest=xSrc-1;
		yDest=ySrc-1;
		while(isInside(xDest,yDest)) {
			
				piece.fieldOfAttack.push(coordsToTile(xDest,yDest));
				if (b[xDest][yDest]!=" ") {
					break;
				}

			xDest--;
			yDest--;
		}
	}else if(piece.pieceType.toLowerCase() == "k") {
		for (let i = xSrc-1; i <= xSrc+1; i++) {
			for (let j = ySrc-1; j <= ySrc+1; j++) {
				if ((i!=xSrc||j!=ySrc)&&isInside(i,j)) {
					piece.fieldOfAttack.push(coordsToTile(i,j));
				}
			}
		}
	}else if(piece.pieceType.toLowerCase() == "q") {
		for (let i = xSrc + 1; i < 8; i++) {

				piece.fieldOfAttack.push(coordsToTile(i,ySrc));
				if (b[i][ySrc]!=" ") {
					break;
				}

		}
		for (let i = xSrc - 1; i >= 0; i--) {

				piece.fieldOfAttack.push(coordsToTile(i,ySrc));
				if (b[i][ySrc]!=" ") {
					break;
				}

		}
		for (let i = ySrc + 1; i < 8; i++) {

				piece.fieldOfAttack.push(coordsToTile(xSrc,i));
				if (b[xSrc][i]!=" ") {
					break;
				}

		}
		for (let i = ySrc - 1; i>= 0; i--) {

				piece.fieldOfAttack.push(coordsToTile(xSrc,i));
				if (b[xSrc][i]!=" ") {
					break;
				}

		}
		xDest=xSrc+1;
		yDest=ySrc+1;
		while(isInside(xDest,yDest)) {

				piece.fieldOfAttack.push(coordsToTile(xDest,yDest));
				if (b[xDest][yDest]!=" ") {
					break;
				}

			xDest++;
			yDest++;
		}
		xDest=xSrc+1;
		yDest=ySrc-1;
		while(isInside(xDest,yDest)) {

				piece.fieldOfAttack.push(coordsToTile(xDest,yDest));
				if (b[xDest][yDest]!=" ") {
					break;
				}

			xDest++;
			yDest--;
		}
		xDest=xSrc-1;
		yDest=ySrc+1;
		while(isInside(xDest,yDest)) {

				piece.fieldOfAttack.push(coordsToTile(xDest,yDest));
				if (b[xDest][yDest]!=" ") {
					break;
				}

			xDest--;
			yDest++;
		}
		xDest=xSrc-1;
		yDest=ySrc-1;
		while(isInside(xDest,yDest)) {

				piece.fieldOfAttack.push(coordsToTile(xDest,yDest));
				if (b[xDest][yDest]!=" ") {
					break;
				}

			xDest--;
			yDest--;
		}
	}
}
function tryMove(xSrc, ySrc, xDest, yDest) {

	let tile = document.getElementById(coordsToTile(xDest,yDest));
	old_position = selected_piece.position;
	selected_piece.position=tile.id;

	if (b[xDest][yDest]!=" ") {
		if (whiteTurn) {
			for (let i = 0; i < blackPieces.length; i++) {
				if (tile.piece==blackPieces[i]) {
					capturedPiece=blackPieces[i];
					blackPieces[i]=blackPieces[blackPieces.length-1];
					blackPieces.length--;
					break;
				}
			}
		}else{
			for (let i = 0; i < whitePieces.length; i++) {
				if (tile.piece==whitePieces[i]) {
					capturedPiece=whitePieces[i];
					whitePieces[i]=whitePieces[whitePieces.length-1];
					whitePieces.length--;
					break;
				}
			}
		}
	}
	
	old_piece = tile.piece;
	tile.piece=selected_piece;
	old_b_dest = b[xDest][yDest];
	old_b_src = b[xSrc][ySrc];
	b[xDest][yDest]=b[xSrc][ySrc];
	b[xSrc][ySrc]=" ";


	for (let i = 0; i < whitePieces.length; i++) {
		setFieldOfAttack(whitePieces[i]);
	}
	for (let i = 0; i < blackPieces.length; i++) {
		setFieldOfAttack(blackPieces[i]);
	}
}
function isCheckAfterMove(xSrc, ySrc, xDest, yDest) {
	tryMove(xSrc, ySrc, xDest, yDest);
	let check = false;
	if (whiteTurn) {
		for (let k = 0; k < blackPieces.length; k++) {
			//alert(blackPieces[k].position + "--->" + blackPieces[k].fieldOfAttack);
			if (blackPieces[k].fieldOfAttack.includes(pk.position)) {
				check = true;
				break;
			}
		}
	}else{
		for (let k = 0; k < whitePieces.length; k++) {
			//alert(blackPieces[k].position + "--->" + blackPieces[k].fieldOfAttack);
			if (whitePieces[k].fieldOfAttack.includes(ek.position)) {
				check = true;
				break;
			}
		}
	}
	selected_piece.position = old_position;
	if (capturedPiece) {
		if (whiteTurn) {
			blackPieces.push(capturedPiece);
		}else{
			whitePieces.push(capturedPiece);
		}
		capturedPiece=null;
	}
	document.getElementById(coordsToTile(xDest,yDest)).piece=old_piece;
	b[xDest][yDest]=old_b_dest;
	b[xSrc][ySrc]=old_b_src;
	for (let k = 0; k < whitePieces.length; k++) {
		setFieldOfAttack(whitePieces[k]);
	}
	for (let k = 0; k < blackPieces.length; k++) {
		setFieldOfAttack(blackPieces[k]);
	}
	return check;
}
function tryEnPassant(xSrc, ySrc, xDest, yDest, enPassantTargetRank, enPassantTargetFile) {
	let tile;
	
	old_position = selected_piece.position;
	
	
	if (whiteTurn) {
			
			selected_piece.position = blackEnPassantCapturePosition;
			tile = document.getElementById(blackEnPassantCapturePosition);

				for (let i = 0; i < blackPieces.length; i++) {
					if (blackEnPassantTarget==blackPieces[i]) {
						blackPieces[i]=blackPieces[blackPieces.length-1];
						blackPieces.length--;
						break;
					}
				}
				
				b[enPassantTargetRank][enPassantTargetFile] = " ";
				b[xSrc][ySrc] = " ";
				b[xDest][yDest] = "P";
		
	}else{
			
			selected_piece.position = whiteEnPassantCapturePosition;
			tile = document.getElementById(whiteEnPassantCapturePosition);

				for (let i = 0; i < whitePieces.length; i++) {
					if (whiteEnPassantTarget==whitePieces[i]) {
						whitePieces[i]=whitePieces[whitePieces.length-1];
						whitePieces.length--;
						break;
					}
				}
				b[enPassantTargetRank][enPassantTargetFile] = " ";
				b[xSrc][ySrc] = " ";
				b[xDest][yDest] = "p";
				
	}
	tile.piece=selected_piece;
	for (let i = 0; i < whitePieces.length; i++) {
		setFieldOfAttack(whitePieces[i]);
	}
	for (let i = 0; i < blackPieces.length; i++) {
		setFieldOfAttack(blackPieces[i]);
	}
}
function isCheckAfterEnPassant(xSrc,ySrc,xDest, yDest, enPassantTargetRank, enPassantTargetFile) {
	tryEnPassant(xSrc, ySrc, xDest, yDest, enPassantTargetRank, enPassantTargetFile);
	let check = false;
	if (whiteTurn) {
		for (let k = 0; k < blackPieces.length; k++) {
			//alert(blackPieces[k].position + "--->" + blackPieces[k].fieldOfAttack);
			if (blackPieces[k].fieldOfAttack.includes(pk.position)) {
				check = true;
				break;
			}
		}
	}else{
		for (let k = 0; k < whitePieces.length; k++) {
			//alert(blackPieces[k].position + "--->" + blackPieces[k].fieldOfAttack);
			if (whitePieces[k].fieldOfAttack.includes(ek.position)) {
				check = true;
				break;
			}
		}
	}
	selected_piece.position = old_position;
	let tile;
	if (whiteTurn) {
		blackPieces.push(blackEnPassantTarget);
		tile = document.getElementById(blackEnPassantCapturePosition);
		b[xSrc][ySrc] = "P";
		b[enPassantTargetRank][enPassantTargetFile]="p";
	}else{
		whitePieces.push(whiteEnPassantTarget);
		tile = document.getElementById(whiteEnPassantCapturePosition);
		b[xSrc][ySrc] = "p";
		b[enPassantTargetRank][enPassantTargetFile]="P";
	}
	tile.piece = null;
	b[xDest][yDest] = " ";
	for (let k = 0; k < whitePieces.length; k++) {
		setFieldOfAttack(whitePieces[k]);
	}
	for (let k = 0; k < blackPieces.length; k++) {
		setFieldOfAttack(blackPieces[k]);
	}
	return check;
}
function updateClocks() {
	clockUpdateAt = Date.now();
	let time;
	let minutes, seconds;
	if (promotionDelay||(whiteTurn&&player_white)||(!whiteTurn&&!player_white)) {
		time = document.getElementById("playerClock");
		seconds = playerTime % 60;
		minutes = Math.floor(playerTime / 60);
		playerTime-=1;
	}else{
		time = document.getElementById("opponentClock");
		seconds = opponentTime % 60;
		minutes = Math.floor(opponentTime / 60);
		opponentTime-=1;
	}

	if (seconds==0) {
		minutes--;
		seconds=59;
	}else{
		seconds--;
	}
	if (minutes<10) {
		minutes = "0"+minutes;
	}
	if (seconds<10) {
		seconds = "0"+seconds;
	}
	time.innerHTML=minutes+":"+seconds;
	if (minutes==0&&seconds==0) {
		
		gameOver=true;
		clearInterval(clockInterval);
		messageGameOver();
		
	}
}
function promote() {
	let promotion=document.getElementById("promotion");
	promotion.style.display="block";
	if (whiteTurn) {
		document.getElementById("white-promotion").style.display="block";
	}else{
		document.getElementById("black-promotion").style.display="block";
	}
}
function promotePiece(piece, pieceImg) {
	let promotion=document.getElementById("promotion");
	promotion.style.display="none"
	document.getElementById("white-promotion").style.display="none";
	document.getElementById("black-promotion").style.display="none";
	promotionPiece.src=pieceImg.src;
	let xSrc = Number(promotionPiece.position.charAt(1)) - 1;
	let ySrc = promotionPiece.position.charCodeAt(0) - 97;
	b[xSrc][ySrc]=piece;
	promotionPiece.pieceType=piece;
	for (let i = 0; i < whitePieces.length; i++) {
		setFieldOfAttack(whitePieces[i]);
	}
	for (let i = 0; i < blackPieces.length; i++) {
		setFieldOfAttack(blackPieces[i]);
	}

		let msgObj = {promotion: piece, fromX : promotionCoordsX, fromY: promotionCoordsY, to: promotionPiece.position, img: promotionPiece.src};
		msgText = JSON.stringify(msgObj);
		conn.send(msgText);
		promotionDelay=false;
}
function messageGameOver() {
	document.getElementById("gameEndPanel").style.display="block";
	if((player_white&&whiteTurn)||(!player_white&&!whiteTurn)) {
		document.getElementById("gameEndTitle").innerText="You lose!";
		if (soundOn) {
			gameLooseSnd.play();
		}
	} else {
		document.getElementById("gameEndTitle").innerText="You win!";
		if (soundOn) {
			gameWinSnd.play();
		}
	}
}
function mouseOverPiece(piece) {
	if (((player_white&&piece.whitePiece&&whiteTurn)||(!player_white&&!piece.whitePiece&&!whiteTurn))&&!gameOver) {
	    piece.style.cursor="pointer";
	    //piece.style.border="none";
	    piece.style.padding="0";
	}
}
function mouseOutPiece(piece) {
	piece.style.cursor="default";
	//piece.style.border="10px solid rgba(255,255,255,0)";
	piece.style.padding="1.5%";
}
function rotate() {
	if (!boardRotated) {
		document.getElementById("board").style.rotate="180deg";
		let markings = document.getElementsByClassName("mark");
		for (let i = 0; i < markings.length; i++) {
			markings[i].style.rotate="180deg";
		}
	}else{
		document.getElementById("board").style.rotate="0deg";
		let markings = document.getElementsByClassName("mark");
		for (let i = 0; i < markings.length; i++) {
			markings[i].style.rotate="0deg";
		}
	}
	boardRotated=!boardRotated;
}
function boardToFEN(b) {
	let FEN = "", count = 0;
	for (let i = 7; i >= 0; i--) {
		for (let j = 0;  j < 8; j++) {
			if (b[i][j]!=" ") {
				if (count) {
					FEN += count;
					count = 0;
				}
				FEN += b[i][j];
			}else{
				count++;
			}
		}
		if (count) {
			FEN += count;
			count = 0;
		}
		if (i!=0) {
			FEN += "/";
		} else {
			FEN += " ";
		}
	}
	//----------------------------------
	FEN += ((whiteTurn)?"w":"b") + " ";
	//----------------------------------
	let castlingRights = "";
	if (whiteCastlingRights[0]) {
		castlingRights += "K";
	}
	if (whiteCastlingRights[1]) {
		castlingRights += "Q";
	}
	if (blackCastlingRights[0]) {
		castlingRights += "k";
	}
	if (blackCastlingRights[1]) {
		castlingRights += "q";
	}
	if (castlingRights!="") {
		FEN += castlingRights + " ";
	} else {
		FEN += "- ";
	}
	//-------------------------------
	if (whiteEnPassantCapturePosition) {
		FEN += whiteEnPassantCapturePosition;
	}
	if (blackEnPassantCapturePosition) {
		FEN += blackEnPassantCapturePosition;
	}
	if (!whiteEnPassantCapturePosition&&!blackEnPassantCapturePosition) {
		FEN += "-";
	}
	FEN += " " + numOfHalfMoves + " " + numOfFullMoves;
	return FEN;
}
function FENToBoard(FEN) {
	
}
function connect() {

	conn = new WebSocket('wss://playchessfree.com:8080?token='+wsToken);

	conn.onopen = function(e) {
		console.log("Connection established!");
	};

	conn.onmessage = function(e) {
		console.log(e.data);
		let msg = JSON.parse(e.data);
		if ("playersOnline" in msg) {
			document.getElementById("players-online").innerHTML="Players online: "+msg.playersOnline;
		} else if ("message" in msg) {
			console.log("Message: "+msg.message);
			let poruka = document.createElement("P");
			let chat = document.getElementById("chat");
			poruka.className = "poruka left";
			poruka.innerText = msg.message;
			chat.appendChild(poruka);
			if (soundOn) {
				notifySnd.play();
			}
		} else if ("status" in msg) {
			console.log("Status: "+msg.status);
		} else if ("found" in msg) {
			console.log("Found player "+msg.found);
			document.getElementById("chat").innerHTML="";
			let opponent;
			var fd = new FormData();
			fd.append("id", msg.found);
			let xhttp = new XMLHttpRequest();
			xhttp.onload = function() {
				console.log(this.responseText);
				opponent = JSON.parse(this.responseText);
				document.getElementById("opponentName").innerText=opponent.first_name+" "+opponent.last_name;
				document.getElementById("opponentImage").src="../avatars/"+opponent.photo;
				document.getElementById("opponentInfo").style.display="block";
			};
			xhttp.open("POST", "api/getOpponentInfo.php", true);
			xhttp.send(fd);
			clockInterval = setInterval(updateClocks, 1000);
			gameStartedAt = Date.now();
			gameOver = false;
			hideNewGamePanel();
			document.getElementById("newGame").style.display="none";
			document.getElementById("resign").style.display="block";
			document.getElementById("offerDraw").style.display="block";
			document.getElementById("msg").style.display="block";
			document.getElementById("sendMsg").style.display="block";
			whiteInLastMatch = player_white;
			if (!player_white) {
				rotate();
			}
		} else if ("logout" in msg) {
			console.log("Player " + msg.logout + " logged out.");
			gameOver=true;
			clearInterval(clockInterval);
			document.getElementById("gameEndPanel").style.display="block";
			document.getElementById("gameEndTitle").innerText="Your opponent abandoned the game. You win!";
			if (soundOn) {
				gameWinSnd.play();
			}
		} else if ("move" in msg) {
			messageCameAt = Date.now();
			selectPiece(document.getElementById(msg.from).piece, false);
			clickPsbl(document.getElementById(msg.to));
		} else if ("promotion" in msg) {
			messageCameAt = Date.now();
			let piece = document.getElementById(coordsToTile(msg.fromX,msg.fromY)).piece;
			piece.pieceType = msg.promotion;
			piece.src = msg.img;
			selectPiece(piece, false);
			clickPsbl(document.getElementById(msg.to));
		} else if ("resign" in msg) {
			gameOver=true;
			clearInterval(clockInterval);
			document.getElementById("gameEndPanel").style.display="block";
			document.getElementById("gameEndTitle").innerText="Your opponent resigned. You win!";
			if (soundOn) {
				gameWinSnd.play();
			}
		} else if ("draw" in msg) {
			showDrawPanel();
		} else if ("accept" in msg) {
			gameOver=true;
			clearInterval(clockInterval);
			document.getElementById("gameEndPanel").style.display="block";
			document.getElementById("gameEndTitle").innerText="Opponent accepts your offer. The game is draw!";
			if (soundOn) {
				gameDrawSnd.play();
			}
		} else if ("decline" in msg) {
			showDeclinePanel();
		} else if ("rematch" in msg) {
			showRematchPanel();
		} else if ("acceptRematch" in msg) {
			document.getElementById("gameEndPanel").style.display="none";
			reset();
			clockInterval = setInterval(updateClocks, 1000);
			gameStartedAt = Date.now();
			gameOver = false;
			document.getElementById("opponentInfo").style.display="block";
			document.getElementById("newGame").style.display="none";
			document.getElementById("resign").style.display="block";
			document.getElementById("offerDraw").style.display="block";
			document.getElementById("msg").style.display="block";
			document.getElementById("sendMsg").style.display="block";
			player_white = whiteInLastMatch;
			if (!player_white) {
				rotate();
			}
		} else if ("declineRematch" in msg) {
			hideEndGamePanel();
			showDeclineRematchPanel();
		}
	};
		
}
function send() {
	if (document.getElementById("msg").value!="") {
		let msgObj = {message: document.getElementById("msg").value};
		let poruka = document.createElement("P");
		let chat = document.getElementById("chat");
		poruka.innerText = document.getElementById("msg").value;
		poruka.className = "poruka2 right";
		chat.appendChild(poruka);
		document.getElementById("msg").value = "";
		let msgText = JSON.stringify(msgObj);
		conn.send(msgText);
	}
}
function playAsWhite(img) {
	playSetup(img);
	player_white = true;
	let msgObj = {color: "white"};
	let msgText = JSON.stringify(msgObj);
	conn.send(msgText);
}
function playAsBlack(img) {
	playSetup(img);
	player_white = false;
	let msgObj = {color: "black"};
	let msgText = JSON.stringify(msgObj);
	conn.send(msgText);
}
function playSetup(img) {
	if (gameSearching) {
		cancel();
		document.getElementById("playAsWhiteBorder").style.border="none";
		document.getElementById("playAsRandomBorder").style.border="none";
		document.getElementById("playAsBlackBorder").style.border="none";
		clearInterval(waitingInterval);
	}
	let title = document.getElementById("newGameTitle");
	let waitingMessage = document.getElementById("waitingForOpponent");
	title.style.display = "none";
	waitingMessage.style.display = "block";
	
	waitingInterval = setInterval(updateDots, 1000);
	document.getElementById(img.id+"Border").style.borderBottom="3px solid LightSkyBlue";
	gameSearching=true;
}
function cancel() {
	let msgObj = {cancel: true};
	let msgText = JSON.stringify(msgObj);
	conn.send(msgText);
}
function random(img) {
	playSetup(img);
	let r = Math.floor(Math.random() * 2);
	let msgObj;
	if (r) {
		msgObj = {color: "white"};
		player_white = true;
	} else {
		msgObj = {color: "black"};
		player_white = false;
	}
	let msgText = JSON.stringify(msgObj);
	conn.send(msgText);
}
function toggleSound(img) {
	soundOn = !soundOn;
	if (soundOn) {
		img.src="../assets/png/volume-on.png";
	}else{
		img.src="../assets/png/volume-off.png";
	}
	localStorage.soundOn = soundOn;
}
function reset() {
	document.getElementById("newGame").style.display="block";
	document.getElementById("resign").style.display="none";
	document.getElementById("offerDraw").style.display="none";
	document.getElementById("msg").style.display="none";
	document.getElementById("sendMsg").style.display="none";
	for (let i = 0; i < 8; i++) {
		for (let j = 0; j < 8; j++) {
			document.getElementById(coordsToTile(i,j)).piece=null;
		}
	}
	if (boardRotated) {
		rotate();
	}
	clearTiles();
	whitePieces=[];
	blackPieces=[];
	capturedPiece = null;
	whiteTurn = true;
	playerTime = 600;
	opponentTime = 600;
	document.getElementById("playerClock").innerText="10:00";
	document.getElementById("opponentClock").innerText="10:00";
	gameOver = true;
	promotionPiece = null;
	whiteCastlingRights = [1, 1];
	blackCastlingRights = [1, 1];
	castlingKingPosition = null;
	whiteEnPassantTarget = null;
	blackEnPassantTarget = null;
	whiteEnPassantCapturePosition = null;
	blackEnPassantCapturePosition = null;
	numOfHalfMoves = 0;
	numOfFullMoves = 1;
	promotionCoordsX=null;
	promotionCoordsY=null;
	promotionDelay = false;
	b = [["R","N","B","Q","K","B","N","R"],
					["P","P","P","P","P","P","P","P"],
					[" "," "," "," "," "," "," "," "],
					[" "," "," "," "," "," "," "," "],
					[" "," "," "," "," "," "," "," "],
					[" "," "," "," "," "," "," "," "],
					["p","p","p","p","p","p","p","p"],
					["r","n","b","q","k","b","n","r"]];
	selected_piece = null;
	messageCameAt=null;
	gameStartedAt=null;
	clockUpdateAt=null;
	wasItWhiteTurn=null;
	elapsed=null;
	hiddenAt=null;
	gameSearching=false;
	waitingInterval=null;
	for (let i = 0; i < 16; i++) {
	let p = whitePiecesCopy[i];
	p.style.display="inline";
	if (i==14) {
		pk=p;
	}
	whitePieces.push(p);
	p.whitePiece=true;
	p.style.left=whiteCoordinates[i][0]+"%";
	p.style.top=whiteCoordinates[i][1]+"%";
	p.pieceType = whiteTypes[i];
	p.position = whitePositions[i];
	p.src="assets/svg/"+whiteImg[i];
	setFieldOfAttack(p);
	p.availableMoves=[];
	document.getElementById(p.position).piece=p;
	//-----------------------------------
	let q = blackPiecesCopy[i];
	q.style.display="inline";
	if (i==14) {
		ek=q;
	}
	blackPieces.push(q);
	q.whitePiece=false;
	q.style.left=blackCoordinates[i][0]+"%";
	q.style.top=blackCoordinates[i][1]+"%";
	q.pieceType = blackTypes[i];
	q.position = blackPositions[i];
	q.src="assets/svg/"+blackImg[i];
	setFieldOfAttack(q);
	q.availableMoves=[];
	document.getElementById(q.position).piece=q;
}
}
function gamePaused() {
	if (!gameOver) {
		clearInterval(clockInterval);
		clearTimeout(synchronizeClocks);
		
		if (!document.hidden) {
			let nekiBroj = 2000 - ((Date.now() - gameStartedAt)%1000); //1001-2000
			setTimeout(synchronizeClocks, nekiBroj);
			console.log("nekiBroj: "+nekiBroj);
			elapsed = Date.now() - hiddenAt;
			let sinceLastTick = Date.now() - clockUpdateAt;
			let sinceLastMessage = Date.now() - messageCameAt;
			console.log("elapsed: "+elapsed);
			console.log("sinceLastTick: "+sinceLastTick);
			let zbir = nekiBroj+sinceLastTick;
			console.log("zbir: "+zbir);
			if ((wasItWhiteTurn&&whiteTurn)||(!wasItWhiteTurn&&!whiteTurn)) {
				
				if ((player_white&&whiteTurn)||(!player_white&&!whiteTurn)) {
					playerTime -= Math.floor(zbir/1000);
					playerTime -= 1;
				} else {
					opponentTime -= Math.floor(zbir/1000);
					opponentTime -= 1;
				}
			}else{
				console.log("sinceLastTick: "+sinceLastTick);
				console.log("messageCameAt: "+messageCameAt);
				console.log("nekiBroj: "+nekiBroj);
				console.log("razlika: "+(messageCameAt-clockUpdateAt));
				let razlika = messageCameAt-clockUpdateAt;
				playerTime -= Math.floor((zbir-razlika)/1000);
				playerTime -= 1;
				opponentTime -= Math.floor(razlika/1000);
				let seconds = opponentTime % 60;
				let minutes = Math.floor(opponentTime / 60);
				if (minutes<10) {
					minutes = "0"+minutes;
				}
				if (seconds<10) {
					seconds = "0"+seconds;
				}
				document.getElementById("opponentClock").innerHTML=minutes+":"+seconds;
			}
		} else {
			hiddenAt = Date.now();
			wasItWhiteTurn = whiteTurn;
		}
	}
}
function synchronizeClocks() {
	clockInterval = setInterval(updateClocks, 1000);	
}
function showNewGamePanel() {
	document.getElementById("newGamePanel").style.display="block";
}
function hideNewGamePanel() {
	document.getElementById("newGamePanel").style.display="none";
	document.getElementById("waitingForOpponent").style.display="none";
	document.getElementById("newGameTitle").style.display="block";
	document.getElementById("playAsWhiteBorder").style.border="none";
	document.getElementById("playAsRandomBorder").style.border="none";
	document.getElementById("playAsBlackBorder").style.border="none";
	clearInterval(waitingInterval);
	gameSearching = false;
	cancel();
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
function updateDots() {
	let dots = document.getElementById("dots");
	if (dots.innerHTML.length < 3) {
		dots.innerHTML += ".";
	} else {
		dots.innerHTML = ".";
	}
}
function logOut() {
	document.getElementById("logOutForm").submit();
}
function resign() {
	gameOver=true;
	clearInterval(clockInterval);
	hideResignPanel();
	document.getElementById("gameEndPanel").style.display="block";
	document.getElementById("gameEndTitle").innerText="You lose!";
	let msgObj = {resign: true};
	let msgText = JSON.stringify(msgObj);
	conn.send(msgText);
}
function offerDraw() {
	if (!gameOver) {
		let msgObj = {draw: true};
		let msgText = JSON.stringify(msgObj);
		conn.send(msgText);
	}
}
function hideEndGamePanel() {
	document.getElementById("gameEndPanel").style.display="none";
	document.getElementById("opponentInfo").style.display="none";
	let msgObj = {exit: true};
	let msgText = JSON.stringify(msgObj);
	conn.send(msgText);
	reset();
}
function showResignPanel() {
	if (!gameOver) {
		document.getElementById("resignPanel").style.display="block";
	}
}
function hideResignPanel() {
	document.getElementById("resignPanel").style.display="none";
}
function onInput(e) {
	if (e.key=="Enter") {
		send();
	}
}
function hideDrawPanel() {
	document.getElementById("drawPanel").style.display = "none";
}
function showDrawPanel() {
	document.getElementById("drawPanel").style.display = "block";
	if (soundOn) {
		notifySnd.play();
	}
}
function acceptDraw() {
	hideDrawPanel();
	let msgObj = {accept: true};
	let msgText = JSON.stringify(msgObj);
	conn.send(msgText);
	gameOver=true;
	clearInterval(clockInterval);
	document.getElementById("gameEndPanel").style.display="block";
	document.getElementById("gameEndTitle").innerText="The game is draw!";
	if (soundOn) {
		gameDrawSnd.play();
	}
}
function declineDraw() {
	hideDrawPanel();
	let msgObj = {decline: true};
	let msgText = JSON.stringify(msgObj);
	conn.send(msgText);
}
function showDeclinePanel() {
	document.getElementById("declinePanel").style.display="block";
}
function hideDeclinePanel() {
	document.getElementById("declinePanel").style.display="none";
}
function declineRematch() {
	hideRematchPanel();
	let msgObj = {declineRematch: true};
	let msgText = JSON.stringify(msgObj);
	conn.send(msgText);
}
function acceptRematch() {
	hideRematchPanel();
	hideEndGamePanel();
	let msgObj = {acceptRematch: true};
	let msgText = JSON.stringify(msgObj);
	conn.send(msgText);
	clockInterval = setInterval(updateClocks, 1000);
	gameStartedAt = Date.now();
	gameOver = false;
	document.getElementById("opponentInfo").style.display="block";
	document.getElementById("newGame").style.display="none";
	document.getElementById("resign").style.display="block";
	document.getElementById("offerDraw").style.display="block";
	document.getElementById("msg").style.display="block";
	document.getElementById("sendMsg").style.display="block";
	player_white = whiteInLastMatch;
	if (!player_white) {
		rotate();
	}
}
function showRematchPanel() {
	document.getElementById("rematchPanel").style.display="block";
	if (soundOn) {
		notifySnd.play();
	}
}
function hideRematchPanel() {
	document.getElementById("rematchPanel").style.display="none";
}
function showDeclineRematchPanel() {
	document.getElementById("declineRematchPanel").style.display="block";
}
function hideDeclineRematchPanel() {
	document.getElementById("declineRematchPanel").style.display="none";
}
function rematch() {
	let msgObj = {rematch: true};
	let msgText = JSON.stringify(msgObj);
	conn.send(msgText);
}
