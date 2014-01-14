//Constants
var xhtmlNS = "http://www.w3.org/1999/xhtml";
var svgNS   = "http://www.w3.org/2000/svg";
var xlinkNS = "http://www.w3.org/1999/xlink";

//Enums
var Types_Background = ({
	 ASCIIGarbage: ({value: 0})
	,BlockWorld: ({value: 1})
});

//Globals
var svg = null;
var fontSizes = null;
var windowWidth = 125;
var scrollBarWidth = 6;
var lsPageLength = 4;
var padding = 4;
var squareSize = null;
var gameBoardSpacesHigh = 12;
var gameBoardSpacesWide = 16;
var deviceIsTouchEnabled = false;

//Font sizes
var buttonFontIndex = 1;
var titleFontIndex = 1;
var bashFontIndex = 1;

//Functions
function init(svgElem) {
	console.log("init()");
	svg = svgElem;
	//Init variables
	calculateFontSizes();
	//console.log(fontSizes);
	manuallySetCSSWhichIsCurrentlyNotRecognized();
	rewriteSVGForScreen();
	paintBackground(Types_Background.ASCIIGarbage);
	var gb = $elem("gameBoard");
	deviceIsTouchEnabled = ('ontouchstart' in document.documentElement);
	if(deviceIsTouchEnabled) {
		//touch screen supported
		console.log("touch events");
		gb.addEventListener("touchstart", gameBoardDragStart, false);
		svg.addEventListener("touchend", gameBoardDragStop, false);
		svg.addEventListener("touchcancel", gameBoardDragStop, false);
		svg.addEventListener("touchleave", gameBoardDragStop, false);
	} else {
		//standard mouse supported
		gb.addEventListener("mousedown", gameBoardDragStart, false);
		svg.addEventListener("mouseup", gameBoardDragStop, false);
	}
	$elem("buttonUndo").addEventListener("click", undoButtonClick, false);
	$attrib("buttonExecute", "data-level", 1);
	$elem("buttonExecute").addEventListener("click", executeButtonClick, false);
	$elem("buttonCancel").addEventListener("click", cancelButtonClick, false);

	initGame();
	loadLevel(0);
	console.log("/init()");
}
function initGame() {
	if( localStorage["programs"] == undefined || true) {
		localStorage["programs"] = JSON.stringify([{
			 Program: icon_hack
			,Count: 1
		}, {
			 Program: icon_slingshot
			,Count: 1
		}]);
	}
	var programs = $elem("ls_window_content", [0]).children;
	while(programs.length > 0) {
		console.log("c=");
		console.log( $elem("ls_window_content", [0,0]) );
		var c = $elem("ls_window_content", [0,0]);
		c.parentNode.removeChild(c);
		programs = $elem("ls_window_content", [0]).children;
	}
	$attrib("man_current_icon", "display", "none");
	$attrib("man_general_info", "display", "none");
	$attrib("man_header", "display", "none");
	$attrib("button1", "display", "none");
	$attrib("button2", "display", "none");
	$attrib("button3", "display", "none");
	$attrib("man_help_command", "display", "none");
	$elem("man_window_title", [0]).innerHTML = "$";
	var db = JSON.parse(localStorage["programs"], dateTimeReviver);
	db = db.sort(sortPrograms);
	for(var i=0; i<db.length; i++) {
		var div = getHTMLElement("div", ({"data-program": db[i].Program, "class": "scrollableWindowContent"}));
		div.innerHTML = Icons[ db[i].Program ].Name + " x" + db[i].Count.toString();
		div.addEventListener("click", queryProgram, false);
		$elem("ls_window_content", [0]).appendChild(div);
	}
}
function cancelButtonClick() {
	var selectedIcons = svg.getElementsByClassName("selectedIcon");
	for(var i=0; i<selectedIcons.length; i++) {
		var p = $attrib(selectedIcons[i], "data-position");
		var uses = svg.getElementsByTagName("use");
		var usesToDelete = new Array();
		for(var j=0; j<uses.length; j++) {
			var iconIndex = $attrib(uses[j], "data-icon");
			var iconPosition = $attrib(uses[j], "data-position");
			if( (iconPosition == p) && (Icons[iconIndex].isPlayer) ) {
				usesToDelete.push(j);
				addIconToAvailability(iconIndex, 1);
			}
		}
		while(usesToDelete.length > 0) {
			var j = usesToDelete.pop();
			uses[j].parentNode.removeChild(uses[j]);
		}
	}
	removeSelectedIcon();
}
function executeButtonClick() {
	console.log("execute is not really implemented");
	var currentLevel = $attrib(this, "data-level");
	//expected state is that game was loaded and is now starting
	//need memory allocation of what is currently on the board...
	/*
	Players: [{
		 IconIndex:
		,Position: []
		,UseElement: elem
	}]
	*/
	//for each enemy that has not moved
	//see what Ai is, implement AI:
	var spaces = new Array();
	var toRemove = new Array();
	var uses = $elem("layer_gamePieces").getElementsByTagName("use");
	for(var i=0; i<uses.length; i++) {
		var p = $attrib(uses[i], "data-icon");
		var pos = $attrib(uses[i], "data-position");
		if( Icons[p].isPlayer ) {
			window.players.push({
				 IconIndex: p
				,Position: [pos]
				,UseElement: uses[i]
			});
		} else if( Icons[p].isUtility && p == icon_moved ) {
			toRemove.push(uses[i]);
		}
	}
	for(var i=0;i<toRemove.length; i++) {
		toRemove[i].parentNode.removeChild(toRemove[i]);
	}
	var rects = $elem("gameBoard").getElementsByTagName("rect");
	for(var i=0; i<rects.length; i++) {
		if( !rects[i].hasAttribute("display") ) {
			spaces.push(i);
		}
	}
	spaces = spaces.sort();
	if(window.enemies.length == 0) {
		console.log("win/lose is not implemented");
	} else if(window.players.length == 0) {
		console.log("win/lose is not implemented 2");
	} else {
		//window.enemies = window.enemies.reverse();
		window.players = window.players.reverse();
		var delayedAnimations = new Array();
		for(var i=0; i<window.enemies.length; i++) {
			switch( Icons[window.enemies[i].IconIndex].AI ) {
				default:
					console.log("This enemy's AI has not been implemented: " + Icons[window.enemies[i].IconIndex].AI);
					break;
				case "AttackInRangeOrMoveToFirstPlayerYX":
					var enemySight = AttacksInRange(window.enemies[i].Position, window.players, window.enemies[i].IconIndex);
					if( enemySight.InRange ) {
						//showAttackAnimation(enemySight.RangedTargets[0].Position);
						delayedAnimations.push({
							 "Type": "Attack"
							,Delay: 400
							,Parameters: [enemySight.RangedTargets[0].Position]
							,UpdateParameters: null
						});
					} else {
						var target = window.players[0];
						var targetCoordinates = PositionToCoordinate(target.Position[0]);
						var selfCoordinates = PositionToCoordinate(window.enemies[i].Position[0]);
						var delta = ([targetCoordinates[0] - selfCoordinates[0], targetCoordinates[1] - selfCoordinates[1]]);
						var moveableSpaces = spaces.clone();
						var remainingMoves = Icons[window.enemies[i].IconIndex].Move;
						for(var p=0; p<window.players.length; p++) {
							moveableSpaces.remove(window.players[p].Position);
						}
						for(var e=0; e<window.enemies.length; e++) {
							if(e != i) {
								moveableSpaces.remove(window.enemies[e].Position);
							}
						}
						console.log("available spaces:");
						debug_markArrayInMap(-1, moveableSpaces);
						var attemptsToMove = 0;
						while( (remainingMoves > 0) && (attemptsToMove <= Icons[window.enemies[i].IconIndex].Move) ) {
							var successfulMove = false;
							if(delta[0] != 0) {
								console.log("see if we can move enemy up/down");
								var newPosition = AlterPosition(window.enemies[i].Position[0], (delta[0] > 0) ? 1 : -1, 0);
								if(newPosition != null) {
									if(moveableSpaces.indexOf(newPosition) >= 0) {
										console.log("above/below space is free");
										console.log("moving " + ((delta[0] > 0) ? "down" : "up") );
										//window.enemies[i] = moveIconPosition(window.enemies[i], newPosition);
										var result = calculateHowToMoveIcon(window.enemies[i], newPosition);
										result.Delay = 200;
										delayedAnimations.push(result);
										window.enemies[i].Position.playerMove( newPosition, Icons[enemies[i].IconIndex].MaxSize );
										successfulMove = true;
										remainingMoves--;
									} else {
										console.log("above/below space is not available");
									}
								} else {
									console.log("above/below space is out of bounds");
								}
							}
							if(!successfulMove) {
								if(delta[1] != 0) {
									console.log("see if we can move enemy left/right");
									var newPosition = AlterPosition(window.enemies[i].Position[0], 0, (delta[1] > 0) ? 1 : -1);
									if(newPosition != null) {
										if(moveableSpaces.indexOf(newPosition) >= 0) {
											console.log("left/right space is free");
											console.log("moving " + ((delta[0] > 0) ? "right" : "left") );
											//window.enemies[i] = moveIconPosition(window.enemies[i], newPosition);
											var result = calculateHowToMoveIcon(window.enemies[i], newPosition);
											result.Delay = 200;
											delayedAnimations.push(result);
											window.enemies[i].Position.playerMove( newPosition, Icons[enemies[i].IconIndex].MaxSize );
											successfulMove = true;
											remainingMoves--;
										} else {
											console.log("left/right space is not available");
										}
									} else {
										console.log("left/right space is out of bounds");
									}
								}
							}
							attemptsToMove++;
						}
						enemySight = AttacksInRange(window.enemies[i].Position, players, window.enemies[i].IconIndex);
						if( enemySight.InRange ) {
							console.log("not Implemented: Attack");
							//showAttackAnimation(enemySight.RangedTargets[0].Position);
							delayedAnimations.push({
								 "Type": "Attack"
								,Delay: 400
								,Parameters: [enemySight.RangedTargets[0].Position]
								,UpdateParameters: null
							});
						}
						delayedAnimations.push({
							 "Type": "CompleteMove"
							,Delay: 400
							,Parameters: [icon_moved, {
								 x: $attrib(rects[ enemies[i].Position[0] ], "x")
								,y: $attrib(rects[ enemies[i].Position[0] ], "y")
								,position: enemies[i].Position[0]
							}, false]
							,UpdateParameters: null
						});
					}
					break;
			}
		} // for each enemy
		console.log("delayedAnimations: " + delayedAnimations.length.toString());
		var totalDelay = 0;
		for(var i=0; i<delayedAnimations.length; i++) {
			switch(delayedAnimations[i].Type) {
				case "Add":
					setTimeout(function(a,b,c,d) {
						console.log(" .add");
						var occupy = createIcon(a,b,c);
						occupy.style.fill = getValueFromStyleSheet("icons", "#" + d + " .icon", "fill");
					}, totalDelay + delayedAnimations[i].Delay
					, delayedAnimations[i].Parameters[0], delayedAnimations[i].Parameters[1], delayedAnimations[i].Parameters[2], delayedAnimations[i].Parameters[3]);
					break;
				case "Move":
					setTimeout(function(a,b,c) {
						console.log(" .move");
						updateIcon(a, b, c);
					}, totalDelay + delayedAnimations[i].Delay
					, delayedAnimations[i].Parameters[0], delayedAnimations[i].Parameters[1], delayedAnimations[i].Parameters[2]);
					break;
				case "Attack":
					setTimeout(function(a) {
						console.log(" .attack");
						showAttackAnimation(a);
					}, totalDelay + delayedAnimations[i].Delay
					, delayedAnimations[i].Parameters[0]);
					break;
			}
			switch(delayedAnimations[i].Type) {
				case "Add":
				case "Move":
					setTimeout(function(a,b,c) {
						console.log(" .add/move");
						updateIcon(a,b,c);
					}, totalDelay + delayedAnimations[i].Delay
					,delayedAnimations[i].UpdateParameters[0], delayedAnimations[i].UpdateParameters[1], delayedAnimations[i].UpdateParameters[2] );
					break;
				case "CompleteMove":
					setTimeout(function(a,b,c) {
						createIcon(a,b,c);
					}, totalDelay + delayedAnimations[i].Delay
					, delayedAnimations[i].Parameters[0], delayedAnimations[i].Parameters[1], delayedAnimations[i].Parameters[2]);
					break;
			}
			totalDelay += delayedAnimations[i].Delay;
		} // for delayedAnimations
	}
}
function undoButtonClick() {
	//Allows user to undo a move they just made
	console.log("undo is not implemented");
}
function addIconToAvailability(IconIndex, Count) {
	var divs = svg.getElementsByClassName("scrollableWindowContent");
	var programAvailability = null;
	var divProgramAvailability = null;
	for(var i=0; i<divs.length; i++) {
		if( $attrib(divs[i], "data-program") == IconIndex ) {
			programAvailability = divs[i].innerHTML;
			divProgramAvailability = divs[i];
		}
	}
	if( programAvailability == null ) {
		return false;
	} else {
		var db = JSON.parse(localStorage["programs"], dateTimeReviver);
		db = db.sort(sortPrograms);
		var UserStash = 0;
		for(var i=0; i<db.length; i++) {
			if( db[i].Program == IconIndex ) {
				UserStash = db[i].Count;
			}
		}
		var remainingInstances = parseInt(/^[a-zA-Z_\-]+ x([0-9])+$/.exec(programAvailability)[1], 0);
		if( (remainingInstances + Count) < 0 ) {
			return false;
		} else if( (remainingInstances + Count) > UserStash ) {
			return false;
		} else {
			divProgramAvailability.innerHTML = Icons[IconIndex].Name + " x" + (remainingInstances + Count).toString();
			return true;
		}
	}
}
function calculateFontSizes() {
	//Font
	var maxFontSize = 24;
	var minFontSize = 10;
	fontSizes = new Array();
	var foreignObject = getElement("foreignObject", {
		 x: "0%"
		,y: "0%"
		,width: "100%"
		,height: "100%"
	});
	var div = getHTMLElement("span", {
		 "class": "cloudText"
		,padding: 0
		,margin: 0
	});
	div.innerHTML = "M";
	foreignObject.appendChild(div);
	svg.appendChild(foreignObject);
	for(var currentFontSize = minFontSize; currentFontSize<=maxFontSize; currentFontSize+=2) {
		div.style.fontSize = currentFontSize.toString() + "px";
		var rect = div.getBoundingClientRect();
		var width = document.defaultView.innerWidth;
		var height = document.defaultView.innerHeight;
		fontSizes.push({
			 Size: currentFontSize.toString() + "px"
			,WidthOfSingleCharacter: parseInt(rect.width, 10)
			,Height: parseInt(rect.height, 10)
			,WidthInCharacters: parseInt(width / rect.width, 10)
			,HeightInCharacters: parseInt(height / rect.height, 10)
		});
	}
	foreignObject.parentNode.removeChild(foreignObject);
	fontSizes = fontSizes.sort(sortFontSize);
}
/*
	Event Related
*/
function gameBoardDragStart(event) {
	console.log("starting drag...");
	var gb = $elem("gameBoard");
	var translateX = parseInt($attrib(gb, "transform").replace(/[^0-9,]/g, ""), 10);
	if(deviceIsTouchEnabled) {
		//touch screen supported
		window.orgX = event.changedTouches[0].pageX - translateX;
		window.lastX = event.changedTouches[0].pageX;
		svg.addEventListener("touchmove", gameBoardDragging, false);
	} else {
		//standard mouse supported
		console.log("orgX = " + event.clientX.toString() + " - " + translateX.toString() + " = " + (event.clientX - translateX).toString());
		window.orgX = event.clientX - translateX;
		window.lastX = event.clientX;
		svg.addEventListener("mousemove", gameBoardDragging, false);
	}
}
function gameBoardDragging(event) {
	var gb = $elem("gameBoard");
	var gp = $elem("layer_gamePieces");
	var preventLeft = false;
	var preventRight = false;
	if( gb.getClientRects()[0].right < document.defaultView.innerWidth ) {
		//console.log("prevent Left drag ");
		preventLeft = true;
	}
	if( gb.getClientRects()[0].left > windowWidth ) {
		//console.log("prevent Right drag ");
		preventRight = true;
	}
	var currentX;
	var isLeft = false;
	var isRight = false;
	if(preventLeft && preventRight) {
		return;
	} else if(deviceIsTouchEnabled) {
		currentX = event.changedTouches[0].pageX;
		if(currentX > window.lastX) {
			isRight = true;
		} else if(currentX < window.lastX) {
			isLeft = true;
		}
	} else {
		currentX = event.clientX;
		if(currentX > window.lastX) {
			isRight = true;
			//console.log("isRight");
		} else if(currentX < window.lastX) {
			isLeft = true;
			//console.log("isLeft");
		}
	}
	if( !isLeft && !isRight) {
		return;
	} else if( (!(isLeft && preventLeft)) && (!(isRight && preventRight)) ) {
		//console.log(isLeft.toString() + " " + preventLeft.toString() + " " + isRight.toString() + " " + preventRight.toString());
		$attrib(gb, "transform", "translate(" + (currentX - window.orgX).toString() + ",0)");
		$attrib(gp, "transform", "translate(" + (currentX - window.orgX).toString() + ",0)");
		if(deviceIsTouchEnabled) {
			window.lastX = event.changedTouches[0].pageX;
		} else {
			window.lastX = event.clientX;
		}
	} else if( isLeft && preventLeft ) {
		window.lastX = document.defaultView.innerWidth - (gb.getClientRects()[0].width + windowWidth + padding); //Icons are offset already by windowWidth
		$attrib(gb, "transform", "translate(" + (window.lastX).toString() + ",0)");
		$attrib(gp, "transform", "translate(" + (window.lastX).toString() + ",0)");
		window.lastX = undefined;
	} else if( isRight && preventRight) {
		window.lastX = 0;
		$attrib(gb, "transform", "translate(" + (window.lastX).toString() + ",0)");
		$attrib(gp, "transform", "translate(" + (window.lastX).toString() + ",0)");
		window.lastX = undefined;
	}
}
function gameBoardDragStop(sender, event, delta) {
	console.log("stopping drag...");
	var gb = $elem("gameBoard");
	if(deviceIsTouchEnabled) {
		//touch screen supported
		svg.removeEventListener("touchmove", gameBoardDragging);
		svg.ontouchmove = null;
	} else {
		//standard mouse supported
		svg.removeEventListener("mousemove", gameBoardDragging);
		svg.onmousemove = null;
	}
	window.lastX = undefined;
	if( (window.gameStarted == undefined) || (window.gameStarted == null) ) {
		$attrib("buttonUndo", "display", "none");
		$attrib("buttonCancel", "display", "none");
		$attrib("buttonExecute", "display", null);
	}
}
function queryProgram() {
	var div = this;
	var programID = $attrib(div, "data-program");
	var icon = Icons[programID];
	updateIcon($elem("man_current_icon"), programID, null);
	$elem("man_general_info", [0,0]).innerHTML = "Move: " + icon.Move.toString();
	$elem("man_general_info", [0,1]).innerHTML = "Max Size: " + icon.MaxSize.toString();
	$elem("man_header", [0,0]).innerHTML = icon.Name;
	if( (icon.Attack.length >= 1) ) {
		$attrib("button1", "style", "fill:url(#linearGradientAttack)");
		$elem("button1", [1,0]).innerHTML = icon.Attack[0].Name;
		$attrib("button1", "display", null);
	} else if ( icon.Alternate.length >= 1 ) {
		$attrib("button1", "style", "fill:url(#linearGradientAlternate)");
		$attrib("button1", "display", null);
	} else {
		$attrib("button1", "display", "none");
	}
	if( (icon.Attack.length >= 2) ) {
		$attrib("button2", "style", "fill:url(#linearGradientAttack)");
		$elem("button2", [1,0]).innerHTML = icon.Attack[1].Name;
		$attrib("button2", "display", null);
	} else if ( icon.Alternate.length >= 1 ) {
		if( (icon.Attack.length == 1) ) {
			$elem("button2", [1,0]).innerHTML = icon.Alternate[0].Name;
		} else {
			$elem("button2", [1,0]).innerHTML = icon.Alternate[1].Name;
		}
		$attrib("button2", "style", "fill:url(#linearGradientAlternate)");
		$attrib("button2", "display", null);
	} else {
		$attrib("button2", "display", "none");
	}
	$attrib("man_current_icon", "display", null);
	$attrib("man_general_info", "display", null);
	$attrib("man_header", "display", null);
	if(!((icon.Attack.length > 1) || (icon.Alternate.length > 1) || (icon.Attack.length == 1 && icon.Alternate.length == 1)) ) {
		$attrib("button2", "display", "none");
	}
	$attrib("button3", "display", null);
	$elem("man_help_command", [0,0]).innerHTML = icon.Description;
	$attrib("man_help_command", "display", null);
	$elem("man_window_title", [0]).innerHTML = "man " + icon.Name;
}
function loadProgram(event) {
	var loadIcon = this;
	var manCurrentIcon = $elem("man_current_icon");
	removeSelectedIcon();
	if( $attrib(manCurrentIcon, "display") == "none" ) {
		return null;
	} else {
		var currentIconIndex = $attrib(manCurrentIcon, "data-icon");
		if( addIconToAvailability(currentIconIndex, -1) ) {
			var icon = createIcon(currentIconIndex, {
				 x: $attrib(loadIcon, "x")
				,y: $attrib(loadIcon, "y")
				,position: $attrib(loadIcon, "data-position")
			}, true);
			icon.addEventListener("click", iconClick, false);
		}
	}
}
function iconClick() {
	var icon = this;
	if( (window.gameStarted == undefined) || (window.gameStarted == null) ) {
		removeSelectedIcon();
		$attrib("buttonUndo", "display", "none");
		$attrib("buttonExecute", "display", "none");
		$attrib("buttonCancel", "display", null);
		var selectedIcon = createIcon(icon_selected, {
			 x: $attrib(icon, "x")
			,y: $attrib(icon, "y")
			,position: $attrib(icon, "data-position")
		}, true);
		$attrib(selectedIcon, "class", "selectedIcon");
	}
}
/*
	/Event Related
*/
function removeSelectedIcon() {
	var selectedIcons = svg.getElementsByClassName("selectedIcon");
	while(selectedIcons.length > 0) {
		selectedIcons[0].parentNode.removeChild(selectedIcons[0]);
		selectedIcons = svg.getElementsByClassName("selectedIcon");
	}
}
function paintBackground(backgroundType) {
	//Hide current
	var background = $elem("layer_background");
	var backgrounds = background.getElementsByTagName("g");
	for(var i=0; i<backgrounds.length; i++) {
		$attrib(backgrounds[i], "display", "none");
	}
	//Show selected
	switch(backgroundType) {
		case Types_Background.ASCIIGarbage:
			$elem("ascii").removeAttribute("display");
			break;
	}
}
function repairForScreen() {
	//ascii background
	$attrib($elem("filterClouds").getElementsByTagName("feFlood")[0], "flood-color", getValueFromStyleSheet("master", ".cloudForeground", "color"));
	var matrixText = "携帯a蝋燭i亜米利加ueo∅アイウエオKカキクケコSサシスセソTタチツテトNナニヌネノHハヒフヘホMマミムメモYヤユヨRラリルレロWワヰヱヲ ".split("");
	var text = "";
	for(var i=0; i<35; i++) {
		for(var j=0; j< fontSizes[0].WidthInCharacters; j++) {
			//text += (j % 2) == 0 ? " " : "M"; 
			text += matrixText[ parseInt(Math.random() * matrixText.length, 10) ];
		}
		text += "<br />";
	}
	var div = $elem("ascii").getElementsByTagName("foreignObject")[0].children[0];
	div.style.fontSize = fontSizes[0].Size;
	div.innerHTML = text;
	//windows css
	$elem("linearGradientWindowTitleBar", [0]).style.stopColor = getValueFromStyleSheet("master", ".titleBarGradient1", "color");
	$elem("linearGradientWindowTitleBar", [1]).style.stopColor = getValueFromStyleSheet("master", ".titleBarGradient2", "color");
	$elem("linearGradientWindowTextTitleBar", [0]).style.stopColor = getValueFromStyleSheet("master", ".textTitleBarGradient1", "color");
	$elem("linearGradientWindowTextTitleBar", [1]).style.stopColor = getValueFromStyleSheet("master", ".textTitleBarGradient2", "color");
	$elem("linearGradientScrollable", [0]).style.stopColor = getValueFromStyleSheet("master", ".scrollableGradient1", "color");
	$elem("linearGradientScrollable", [1]).style.stopColor = getValueFromStyleSheet("master", ".scrollableGradient2", "color");
	$elem("linearGradientScrollable", [0]).style.stopOpacity = getValueFromStyleSheet("master", ".scrollableGradient1", "opacity");
	$elem("linearGradientScrollable", [1]).style.stopOpacity = getValueFromStyleSheet("master", ".scrollableGradient2", "opacity");
	//Sizes
	$attrib("ls_window_title", "width", windowWidth);
	$attrib("ls_window_content_background", "width", windowWidth);
	$attrib("ls_window_content_background", "height", (lsWindowHeight + (padding / 2)));
	$attrib("ls_window_content", "width", windowWidth - scrollBarWidth);
	$attrib("ls_window_content", "height", lsWindowHeight);
	$elem("ls_window_content", [0]).style.height = lsWindowHeight.toString() + "px";
	$elem("ls_window_content").getElementsByClassName("scrollableWindow")[0].style.fontSize = fontSizes[0].Size;
	$attrib("man_window_titlebar", "width", windowWidth);
	$attrib("man_window_content_background", "width", windowWidth);
	var buttonUndoY = document.defaultView.innerHeight - buttonHeight;
	$attrib($elem("buttonUndo", [0]), "y", buttonUndoY);
	$attrib($elem("buttonUndo", [1]), "y", buttonUndoY + (padding/2));
	$attrib($elem("buttonExecute", [0]), "y", buttonUndoY);
	$attrib($elem("buttonExecute", [1]), "y", buttonUndoY + (padding/2));
	$attrib($elem("buttonCancel", [0]), "y", buttonUndoY);
	$attrib($elem("buttonCancel", [1]), "y", buttonUndoY + (padding/2));
	//windows positions
	var titleFontIndex = 1;
	var longestTitle = 9;
	var rectTextTitleBars = svg.getElementsByClassName("titleBarTextBackground");
	var rectTextTitleBarWidth = padding + fontSizes[titleFontIndex].WidthOfSingleCharacter * longestTitle + padding;
	for(var i=0; i<rectTextTitleBars.length; i++) {
		$attrib(rectTextTitleBars[i], "width", rectTextTitleBarWidth);
	}
	var manWindowTitleY = $attribI("ls_window_content_background", "y") + $attribI("ls_window_content_background", "height") + padding;
	$attrib("man_window_titlebar", "y", manWindowTitleY);
	$attrib("man_window_title_background", "y", manWindowTitleY);
	$attrib("man_window_title", "y", manWindowTitleY);
	var manWindowContentBackgroundY = manWindowTitleY + fontSizes[titleFontIndex].Height + padding;
	$attrib("man_window_content_background", "y", manWindowContentBackgroundY);
	$attrib("man_window_content_background", "height", document.defaultView.innerHeight - (manWindowContentBackgroundY + buttonHeight) );
	updateIcon($elem("man_current_icon"), icon_hack, ({x: padding, y: padding + manWindowTitleY + fontSizes[titleFontIndex].Height + padding}));
	$attrib("man_general_info", "x", padding + $elem("man_current_icon").getClientRects()[0].right );
	$attrib("man_general_info", "y", padding + manWindowTitleY + fontSizes[titleFontIndex].Height + padding);
	$attrib("man_header", "y", $elem("man_current_icon").getClientRects()[0].bottom + padding );
	//Buttons
	$attrib($elem("button1", [0]), "y", $elem("man_header").getClientRects()[0].bottom + padding);
	$attrib($elem("button1", [1]), "y", $elem("man_header").getClientRects()[0].bottom + padding + (padding/2));
	$attrib($elem("button2", [0]), "y", $elem("button1").getClientRects()[0].bottom);
	$attrib($elem("button2", [1]), "y", $elem("button1").getClientRects()[0].bottom + (padding/2));
	$attrib($elem("button3", [0]), "y", $elem("button2").getClientRects()[0].bottom);
	$attrib($elem("button3", [1]), "y", $elem("button2").getClientRects()[0].bottom + (padding/2));
	$attrib("man_help_command", "y", $elem("button3").getClientRects()[0].bottom);
	var descriptionHeight = document.defaultView.innerHeight - ($attribI("man_help_command", "y") + buttonHeight);
	$attrib("man_help_command", "height", descriptionHeight);
	$elem("man_help_command", [0]).style.height = descriptionHeight.toString() + "px";
	var buttons = (["button1", "button2", "button3", "buttonUndo", "buttonExecute", "buttonCancel"]);
	for(var j=0; j<buttons.length; j++) {
		var g = $elem(buttons[j]).children;
		for(var i=0; i<g.length; g++) {
			g[i].setAttribute("width", windowWidth);
			$attrib(g[i], "width", windowWidth);
			$attrib(g[i], "height", buttonHeight);
		}
	}
	var tiles = $elem("gameBoard").getElementsByTagName("rect");
	for(var i=0; i<tiles.length; i++) {
		$attrib(tiles[i], "width", squareSize);
		$attrib(tiles[i], "height", squareSize);
		$attrib(tiles[i], "x", windowWidth + padding + ((i % 16) * (squareSize + padding)) );
		$attrib(tiles[i], "y", parseInt(i/16, 10) * (squareSize + padding) );
	}
}
function manuallySetCSSWhichIsCurrentlyNotRecognized() {
	$elem("linearGradientWindowTitleBar", [0]).style.stopColor = getValueFromStyleSheet("master", ".titleBarGradient1", "color");
	$elem("linearGradientWindowTitleBar", [1]).style.stopColor = getValueFromStyleSheet("master", ".titleBarGradient2", "color");
	$elem("linearGradientWindowTextTitleBar", [0]).style.stopColor = getValueFromStyleSheet("master", ".textTitleBarGradient1", "color");
	$elem("linearGradientWindowTextTitleBar", [1]).style.stopColor = getValueFromStyleSheet("master", ".textTitleBarGradient2", "color");
	$elem("linearGradientScrollable", [0]).style.stopColor = getValueFromStyleSheet("master", ".scrollableGradient1", "color");
	$elem("linearGradientScrollable", [1]).style.stopColor = getValueFromStyleSheet("master", ".scrollableGradient2", "color");
	$elem("linearGradientScrollable", [0]).style.stopOpacity = getValueFromStyleSheet("master", ".scrollableGradient1", "opacity");
	$elem("linearGradientScrollable", [1]).style.stopOpacity = getValueFromStyleSheet("master", ".scrollableGradient2", "opacity");
	$attrib($elem("filterClouds").getElementsByTagName("feFlood")[0], "flood-color", getValueFromStyleSheet("master", ".cloudForeground", "color"));
}
function rewriteSVGForScreen() {
	squareSize = parseInt((document.defaultView.innerHeight - (padding*2 + (gameBoardSpacesHigh*2)))/ gameBoardSpacesHigh , 10);
	windowWidth = padding + squareSize + padding + (fontSizes[bashFontIndex].WidthOfSingleCharacter * "Max Size: 10".length) + padding;

	var scrollHeight = fontSizes[bashFontIndex].Height * lsPageLength;
	var buttonHeight = fontSizes[buttonFontIndex].Height + padding;

	$attrib("ls_window_title", "width", windowWidth);
	$attrib("ls_window_content_background", ([{ Key: "width", Value: windowWidth}, {Key: "height", Value: scrollHeight }]));
	$attrib("ls_window_content", ([{ Key: "width", Value: windowWidth - scrollBarWidth}, {Key: "height", Value: scrollHeight }]));
	$elem("ls_window_content", [0]).style.height = (scrollHeight - padding).toString() + "px"; //HACK: subtracting padding here does not make since, but it makes the scrollbar look correct
	var lastBottom = $elem("ls_window_content").getClientRects()[0].bottom;
	$attrib("man_window_titlebar", ([{ Key: "width", Value: windowWidth}, {Key: "y", Value: lastBottom + (padding/2) }]));
	$attrib("man_window_title", ([{ Key: "width", Value: windowWidth}, {Key: "y", Value: lastBottom + (padding/2) }]));
	$attrib("man_window_title_background", "y", lastBottom + (padding/2));
	lastBottom = $elem("man_window_titlebar").getClientRects()[0].bottom;
	$attrib("man_window_content_background", ([{ Key: "width", Value: windowWidth}, {Key: "height", Value: (document.defaultView.innerHeight - (lastBottom + buttonHeight) ) }, {Key: "y", Value: lastBottom }]));
	updateIcon($elem("man_current_icon"), icon_hack, ({x: padding, y: padding + lastBottom}));
	$attrib("man_general_info", ([{ Key: "x", Value: padding + squareSize + padding}, {Key: "y", Value: lastBottom + padding }]));
	lastBottom = $elem("man_current_icon").getClientRects()[0].bottom;
	$attrib("man_header", "y", lastBottom + padding);
	lastBottom = $elem("man_header").getClientRects()[0].bottom;
	$attrib($elem("button1", [0]), ([{ Key: "width", Value: windowWidth}, { Key: "y", Value: lastBottom + padding}]));
	$attrib($elem("button1", [1]), ([{ Key: "width", Value: windowWidth}, { Key: "y", Value: lastBottom + padding + (padding / 2)}]));
	lastBottom = $elem("button1").getClientRects()[0].bottom;
	$attrib($elem("button2", [0]), ([{ Key: "width", Value: windowWidth}, { Key: "y", Value: lastBottom}]));
	$attrib($elem("button2", [1]), ([{ Key: "width", Value: windowWidth}, { Key: "y", Value: lastBottom + (padding / 2)}]));
	lastBottom = $elem("button2").getClientRects()[0].bottom;
	$attrib($elem("button3", [0]), ([{ Key: "width", Value: windowWidth}, { Key: "y", Value: lastBottom}]));
	$attrib($elem("button3", [1]), ([{ Key: "width", Value: windowWidth}, { Key: "y", Value: lastBottom + (padding / 2)}]));
	lastBottom = $elem("button3").getClientRects()[0].bottom;
	var manHelpHeight = (document.defaultView.innerHeight - (lastBottom + buttonHeight));
	$attrib("man_help_command", ([{ Key: "width", Value: windowWidth}, {Key: "y", Value: lastBottom + padding }, {Key: "height", Value: manHelpHeight }]));
	$elem("man_help_command", [0]).style.height = parseInt(manHelpHeight, 10).toString() + "px";
	lastBottom = $elem("man_help_command").getClientRects()[0].bottom;
	$attrib($elem("buttonUndo", [0]), ([{ Key: "width", Value: windowWidth}, { Key: "y", Value: lastBottom - (padding/2)}]));
	$attrib($elem("buttonUndo", [1]), ([{ Key: "width", Value: windowWidth}, { Key: "y", Value: lastBottom }]));
	$attrib($elem("buttonExecute", [0]), ([{ Key: "width", Value: windowWidth}, { Key: "y", Value: lastBottom - (padding/2)}]));
	$attrib($elem("buttonExecute", [1]), ([{ Key: "width", Value: windowWidth}, { Key: "y", Value: lastBottom }]));
	$attrib($elem("buttonCancel", [0]), ([{ Key: "width", Value: windowWidth}, { Key: "y", Value: lastBottom - (padding/2)}]));
	$attrib($elem("buttonCancel", [1]), ([{ Key: "width", Value: windowWidth}, { Key: "y", Value: lastBottom }]));
	var tiles = $elem("gameBoard").getElementsByTagName("rect");
	for(var i=0; i<tiles.length; i++) {
		$attrib(tiles[i], "width", squareSize);
		$attrib(tiles[i], "height", squareSize);
		$attrib(tiles[i], "x", windowWidth + padding + ((i % 16) * (squareSize + (padding/2))) );
		$attrib(tiles[i], "y", padding + parseInt(i/16, 10) * (squareSize + (padding/2)) );
	}
}
function getElement(tagName, attributes) {
	var elem = document.createElementNS(svgNS, tagName);
	for(i in attributes) {
		elem.setAttributeNS(null, i, attributes[i]);
	}
	return elem;
}
function getHTMLElement(tagName, attributes) {
	var elem = document.createElementNS(xhtmlNS, tagName);
	for(i in attributes) {
		elem.setAttributeNS(null, i, attributes[i]);
	}
	return elem;
}
function sortFontSize(a, b) {
	return b.Size - a.Size;
}
/*
	Widget Related
*/
function updateIcon(UseElement, IconIndex, NewPositionObject) {
	if(NewPositionObject != null) {
		var scale = squareSize / 100;
		//$attrib(UseElement, "x", ((document.defaultView.innerWidth*(1/scale)) / (document.defaultView.innerWidth / NewPositionObject.x)));
		//$attrib(UseElement, "y", ((document.defaultView.innerHeight*(1/scale)) / (document.defaultView.innerHeight / NewPositionObject.y)));
		//$attrib(UseElement, "transform", "scale(" + scale.toString() + "," + scale.toString() + ")");
		$attrib(UseElement, ([{
				 Key: "x"
				,Value: ((document.defaultView.innerWidth*(1/scale)) / (document.defaultView.innerWidth / NewPositionObject.x))
			},{
				 Key: "y"
				,Value: ((document.defaultView.innerHeight*(1/scale)) / (document.defaultView.innerHeight / NewPositionObject.y))
			},{
				 Key: "transform"
				,Value: "scale(" + scale.toString() + "," + scale.toString() + ")"
			}])
		);
	}
	$attribNS(UseElement, xlinkNS, "href", "#" + Icons[IconIndex].SVGName);
	$attribNS(UseElement, xlinkNS, "data-icon", IconIndex);
	if(NewPositionObject != null) {
		if("position" in NewPositionObject) {
			UseElement.setAttributeNS(xlinkNS, "data-position", NewPositionObject.position);
		}
	}
}
function createIcon(IconIndex, DataPosition, actualCoordinates) {
	if( actualCoordinates == undefined || actualCoordinates == null ) {
		actualCoordinates = false;
	}
	var scale = squareSize / 100;
	console.log("squareSize: " + squareSize);
	var gamePieces = $elem("layer_gamePieces");
	var use = getElement("use", {
		 x: actualCoordinates ? DataPosition.x : ((document.defaultView.innerWidth*(1/scale)) / (document.defaultView.innerWidth / DataPosition.x))
		,y: actualCoordinates ? DataPosition.y : ((document.defaultView.innerHeight*(1/scale)) / (document.defaultView.innerHeight / DataPosition.y))
		,transform: "scale(" + scale + ", " + scale + ")"
		,"data-icon": IconIndex
	});
	//console.log("Index:" + IconIndex.toString());
	use.setAttributeNS(xlinkNS, "href", "#" + Icons[IconIndex].SVGName);
	if( "position" in DataPosition ) {
		use.setAttributeNS(xlinkNS, "data-position", DataPosition.position);
	}
	var children = $elem(Icons[IconIndex].SVGName).children;
	if(children.length > 0) {
		for(var i=0; i < children.length; i++) {
			if( /^animate/.test(children[i].tagName) ) {
				use.appendChild( children[i].cloneNode() );
			}
		}
	}
	gamePieces.appendChild(use);
	return use;
}
/*
	/Widget Related
*/

/*
	CSS Related 
*/
function getValueFromStyleSheet(sheetTitle, ruleName, attribute) {
	var sheetIndex = null;
	//WTF?? setting the title attribute on the <xml-stylesheet tag breaks some functionality???
	//So work around is being used
	//for(var i=0; (i<document.styleSheets.length) && (sheetIndex == null); i++) {
	//	if(document.styleSheets[i].title == sheetTitle) {
	//		sheetIndex = i;
	//	}
	//}
	//HACK: Workaround
	for(var i=0; (i<document.styleSheets.length) && (sheetIndex == null); i++) {
		if(document.styleSheets[i].ownerNode.data.indexOf(sheetTitle) >=0) {
			sheetIndex = i;
		}
	}
	if(sheetIndex != null) {
		for(i=0; i<document.styleSheets[sheetIndex].cssRules.length; i++) {
			if(ruleName == document.styleSheets[sheetIndex].cssRules[i].selectorText) {
				return document.styleSheets[sheetIndex].cssRules[i].style[attribute];
			}
		}
	} else {
		throw("getValueFromStyleSheet: Bad sheet title " + sheetTitle);
	}
}
/*
	/CSS Related
*/
/*
	Accessing DOM Related
*/
function $elem(id, childSeletor) {
	if(typeof(id) == "string") {
		if(childSeletor == undefined) {
			return svg.getElementById(id);
		} else {
			var e = svg.getElementById(id);
			for(var i=0; i<childSeletor.length; i++) {
				e = e.children[childSeletor[i]];
			}
			return e;
		}
	} else {
		if(childSeletor == undefined) {
			return id;
		} else {
			var e = id;
			for(var i=0; i<childSeletor.length; i++) {
				e = e.children[childSeletor[i]];
			}
			return e;
		}
	}
}
function $attrib(id, name, value) {
	if(value === null) {
		if( typeof(id) == "string" ) {
			$elem(id).removeAttribute(name);
		} else {
			id.removeAttribute(name);
		}
	} else if((value == undefined) && (typeof(name) == "string")) {
		if( typeof(id) == "string" ) {
			var retVal = $elem(id).getAttribute(name);
			if(/^[0-9]+$/.test(retVal)) {
				return parseInt(retVal, 10);
			} else if( /^[0-9]*\.?[0-9]*$/.test(retVal) ) {
				return parseFloat(retVal);
			} else {
				return retVal;
			}
		} else {
			var retVal = id.getAttribute(name);
			if(/^[0-9]+$/.test(retVal)) {
				return parseInt(retVal, 10);
			} else {
				return retVal;
			}
		}
	} else if((value == undefined) && (typeof(name) == "object")) {
		if( typeof(id) == "string" ) {
			var elem = $elem(id);
			for(var i=0; i<name.length; i++) {
				elem.setAttribute(name[i].Key, name[i].Value);
			}
		} else {
			for(var i=0; i<name.length; i++) {
				id.setAttribute(name[i].Key, name[i].Value);
			}
		}
	} else {
		if( typeof(id) == "string" ) {
			$elem(id).setAttribute(name, value);
		} else {
			id.setAttribute(name, value);
		}
	}
}
//Depreaciated
function $attribI(id, name, value) {
	if((value == undefined) && (typeof(name) == "string")) {
		if( typeof(id) == "string" ) {
			return parseInt($elem(id).getAttribute(name), 10);
		} else {
			return parseInt(id.getAttribute(name), 10);
		}
	} else if((value == undefined) && (typeof(name) == "object")) {
		if( typeof(id) == "string" ) {
			var elem = $elem(id);
			for(var i=0; i<name.length; i++) {
				elem.setAttribute(name[i].Key, name[i].Value);
			}
		} else {
			for(var i=0; i<name.length; i++) {
				id.setAttribute(name[i].Key, name[i].Value);
			}
		}
	} else {
		if( typeof(id) == "string" ) {
			$elem(id).setAttribute(name, value);
		} else {
			id.setAttribute(name, value);
		}
	}
}
function $attribNS(id, namespace, name, value) {
	if((value == undefined) && (typeof(name) == "string")) {
		if( typeof(id) == "string" ) {
			var retVal = $elem(id).getAttribute(name);
			if(/^[0-9]+$/.test(retVal)) {
				return parseInt(retVal, 10);
			} else {
				return retVal;
			}
			return 
		} else {
			var retVal = id.getAttribute(name);
			if(/^[0-9]+$/.test(retVal)) {
				return parseInt(retVal, 10);
			} else {
				return retVal;
			}
		}
	} else if((value == undefined) && (typeof(name) == "object")) {
		if( typeof(id) == "string" ) {
			var elem = $elem(id);
			for(var i=0; i<name.length; i++) {
				elem.setAttributeNS(namespace, name[i].Key, name[i].Value);
			}
		} else {
			for(var i=0; i<name.length; i++) {
				id.setAttributeNS(namespace, name[i].Key, name[i].Value);
			}
		}
	} else {
		if( typeof(id) == "string" ) {
			$elem(id).setAttribute(name, value);
		} else {
			id.setAttributeNS(namespace, name, value);
		}
	}
}
/*
	/Accessing DOM Related
*/
/*
	Game Related
*/
function loadLevel(LevelID) {
	window.enemies = new Array();
	window.players = new Array();
	var levelMap = Levels[LevelID].Map;
	var tiles = $elem("gameBoard").getElementsByTagName("rect");
	for(var i=0; i<levelMap.length; i++) {
		switch( levelMap.substr(i, 1) ) {
			default:
				console.log(levelMap.substr(i, 1) + " not implemented");
				break;
			case "_":
				$attrib(tiles[i], "display", "none");
				break;
			case "A":
			case "B":
				$attrib(tiles[i], "class", "tile" + levelMap.substr(i, 1));
				break;
			case "#":
				var box = tiles[i].getClientRects()[0];
				var loadIcon = createIcon(icon_load, ({
					 x: box.left
					,y: box.top
					,position: i
				}));
				loadIcon.addEventListener("click", loadProgram, false);
				break;
			case "1":
			case "2":
			case "3":
				var iconIndex = parseInt(levelMap.substr(i, 1), 10);
				var box = tiles[i].getClientRects()[0];
				var icon = createIcon( iconIndex, ({
					 x: box.left
					,y: box.top
					,position: i
				}));
				if( Icons[iconIndex].isEnemy ) {
					window.enemies.push({
						 IconIndex: iconIndex
						,Position: [i]
						,UseElement: icon
					});
				}
				break;
		}
	}
}
function AttacksInRange(AttackerPosition, PossibleTargets, IconIndex) {
	var icon = Icons[IconIndex];
	if(icon.Attack == null) {
		return ({
			InRange: false
		});
	} else {
		var results = new Array();
		var anyInRange = false;
		for(var a=0; a<icon.Attack.length; a++) {
			if(AttackerPosition.length >= icon.Attack[a].MinSizeForAttack) {
				//Attack is possible
				var hittablePositions = BranchOut(AttackerPosition[0], icon.Attack[a].AttackSize);
				//array of int (hittable positions)
				//Array of IconIndex,Position,UseElement
				//where do hittablePositions match Position
				//return index of PossibleTargets and first hittable position
				//return global InRange as well (.Any)
				//
				var foundTarget = false;
				for(var i=0; i<PossibleTargets.length; i++) {
					for(var j=0; j<PossibleTargets[i].Position.length && !foundTarget; j++) {
						for(var k=0; k<hittablePositions.length && !foundTarget; k++) {
							if( PossibleTargets[i].Position[j] == hittablePositions[k] ) {
								results.push({
									 InRange: true
									,RangeIndex: i
									,Position: hittablePositions[k]
									,AttackIndex: a
									,AttackStrength: icon.Attack[a].Attack
								});
								anyInRange = true;
								foundTarget = true;
							}
							//console.log("i: %d j: %d k: %d " + foundTarget.toString(), i,j,k);
						}
					}
					foundTarget = false;
				}
				
			} else {
				results.push({
					 Error: "Too Short for attack"
					,InRange: false
				});
			}
		}
		return ({
			 InRange: anyInRange
			,RangedTargets: results
		});
	}
}
function CoordinateToPosition(Coordinate) {
	var nan = parseInt("NaN",10);
	if( (Coordinate[0] < 0) || (Coordinate[0] > (gameBoardSpacesHigh - 1)) ) {
		return nan;
	} else if( (Coordinate[1] < 0) || (Coordinate[1] > (gameBoardSpacesWide-1)) ) {
		return nan;
	} else {
		return Coordinate[0]*(gameBoardSpacesWide) + Coordinate[1];
	}
}
function PositionToCoordinate(Position) {
	var nan = parseInt("NaN",10);
	if((typeof(Position) == "object") && (Position.length)) {
		Position = Position[0];
	}
	if((Position < 0) || (Position >= (16*12))) {
		return nan;
	} else {
		var p = parseInt(Position / gameBoardSpacesWide, 10);
		return ([p, Position-(gameBoardSpacesWide*p) ]);
	}
}
function AlterPosition(Position,x,y) {
	if((typeof(Position) == "object") && (Position.length)) {
		Position = Position[0];
	}
	var c = PositionToCoordinate(Position);
	if(typeof(c) != "object") {
		return null;
	} else {
		c[0] += x;
		c[1] += y;
		var p = CoordinateToPosition(c);
		if(isNaN(p)) {
			return null;
		} else {
			return p;
		}
	}
}
function BranchOut(Position, Length) {
	//TODO: some duplicate creation is avoided using a slimy hack, need to figure out what is really going on
	var results = new Array();
	var c = PositionToCoordinate(Position);
	for(var i=1; i<=Length; i++) {
		//console.log("sending");
		//console.log([ c[0]-i, c[1] ]);
		var a = CoordinateToPosition([ c[0]-i, c[1] ]);
		if(!isNaN(a)) {
			if(results.indexOf(a) == -1) {
				results.push(a);
			}
		}
		a = CoordinateToPosition([ c[0]+i, c[1] ]);
		if(!isNaN(a)) {
			if(results.indexOf(a) == -1) {
				results.push(a);
			}
		}
		a = CoordinateToPosition([ c[0], c[1]-i ]);
		if(!isNaN(a)) {
			if(results.indexOf(a) == -1) {
				results.push(a);
			}
		}
		a = CoordinateToPosition([ c[0], c[1]+i ]);
		if(!isNaN(a)) {
			if(results.indexOf(a) == -1) {
				results.push(a);
			}
		}
		for(var j=0; j<=Length-i; j++) {
			a = CoordinateToPosition([ c[0]-i, c[1]+j ]);
			if(!isNaN(a)) {
				if(results.indexOf(a) == -1) {
					results.push(a);
				}
			}
			a = CoordinateToPosition([ c[0]+i, c[1]+j ]);
			if(!isNaN(a)) {
				if(results.indexOf(a) == -1) {
					results.push(a);
				}
			}
			a = CoordinateToPosition([ c[0]+j, c[1]-i ]);
			if(!isNaN(a)) {
				if(results.indexOf(a) == -1) {
					results.push(a);
				}
			}
			a = CoordinateToPosition([ c[0]+j, c[1]+i ]);
			if(!isNaN(a)) {
				if(results.indexOf(a) == -1) {
					results.push(a);
				}
			}
			a = CoordinateToPosition([ c[0]-i, c[1]-j ]);
			if(!isNaN(a)) {
				if(results.indexOf(a) == -1) {
					results.push(a);
				}
			}
			a = CoordinateToPosition([ c[0]+i, c[1]-j ]);
			if(!isNaN(a)) {
				if(results.indexOf(a) == -1) {
					results.push(a);
				}
			}
			a = CoordinateToPosition([ c[0]-j, c[1]-i ]);
			if(!isNaN(a)) {
				if(results.indexOf(a) == -1) {
					results.push(a);
				}
			}
			a = CoordinateToPosition([ c[0]-j, c[1]+i ]);
			if(!isNaN(a)) {
				if(results.indexOf(a) == -1) {
					results.push(a);
				}
			}
		}
	}
	return results.sort();
}
function calculateHowToMoveIcon(IconObject, newPosition) {
	/*
		returns information on how to move the icon
		this would then be used asynchroisly to animate a move
		return ({
			 Type: "Move" | "Add"
			,Delay: 0
			,Parameters: []
			,UpdateParameters: []
		});
	*/
	var returnObject = ({
		 "Type": ""
		,Delay: 0
		,Parameters: new Array()
		,UpdateParameters: new Array()
	});
	if(IconObject.Position.length >= Icons[IconObject.IconIndex].MaxSize ) {
		//move
		var oldPosition = IconObject.Position[0];
		var toRemovePosition = IconObject.Position[IconObject.Position.length - 1];
		console.log("toRemovePosition: " + toRemovePosition.toString());
		console.log("Use to remove of");
		console.log(toRemovePosition);
		var useToRemove = null;
		var uses = $elem("layer_gamePieces").getElementsByTagName("use");
		for(var i=0; (i<uses.length) && (useToRemove == null); i++) {
			if( $attrib(uses[i], "data-position") == toRemovePosition ) {
				useToRemove = uses[i];
			}
		}
		if(useToRemove != null) {
			var rect = $elem("gameBoard").getElementsByTagName("rect")[oldPosition];
			returnObject.Type = "Move";
			returnObject.Parameters.push(useToRemove);
			returnObject.Parameters.push(icon_occupied);
			returnObject.Parameters.push({
				 x: $attrib(rect, "x")
				,y: $attrib(rect, "y")
				,position: oldPosition
			});
		} else {
			console.log("could not find old occupy");
		}
	} else {
		//add
		var oldPosition = IconObject.Position[0];
		var rectOldPosition = $elem("gameBoard").getElementsByTagName("rect")[ oldPosition ];
		//var occupy = createIcon(icon_occupied, ({
		//	 x: $attrib(rectOldPosition, "x")
		//	,y: $attrib(rectOldPosition, "y")
		//	,position: oldPosition
		//}), false);
		//$elem(occupy).style.fill = getValueFromStyleSheet("icons", "#" + Icons[IconObject.IconIndex].SVGName + " " + ".icon", "fill");
		returnObject.Type = "Add";
		returnObject.Parameters.push(icon_occupied);
		returnObject.Parameters.push({
			 x: $attrib(rectOldPosition, "x")
			,y: $attrib(rectOldPosition, "y")
			,position: oldPosition
		});
		returnObject.Parameters.push(false);
		returnObject.Parameters.push(Icons[IconObject.IconIndex].SVGName);
	}
	var rect = $elem("gameBoard").getElementsByTagName("rect")[newPosition];
	//IconObject.Position = IconObject.Position.playerMove(newPosition, Icons[IconObject.IconIndex].MaxSize);
	//updateIcon(IconObject.UseElement, IconObject.IconIndex, ({
	//	 x: $attrib(rect, "x")
	//	,y: $attrib(rect, "y")
	//	,position: newPosition
	//}));
	returnObject.UpdateParameters.push(IconObject.UseElement);
	returnObject.UpdateParameters.push(IconObject.IconIndex);
	returnObject.UpdateParameters.push({
		 x: $attrib(rect, "x")
		,y: $attrib(rect, "y")
		,position: newPosition
	});
	return returnObject;
}
function moveIconPosition(IconObject, newPosition) {
	/*
		Validatity of move is expected to have occurred outside of this function (probably a bad idea)
		IconObject could be enemy or player
		Format is:
			.IconIndex
			.Position 
			.UseElement
	*/
	//Need to add a space or just move an existing one?
	if(IconObject.Position.length >= Icons[IconObject.IconIndex].MaxSize ) {
		//move
		var oldPosition = IconObject.Position[0];
		var toRemovePosition = IconObject.Position[IconObject.Position.length - 1];
		console.log("toRemovePosition: " + toRemovePosition.toString());
		console.log("Use to remove of");
		console.log(toRemovePosition);
		var useToRemove = null;
		var uses = $elem("layer_gamePieces").getElementsByTagName("use");
		for(var i=0; (i<uses.length) && (useToRemove == null); i++) {
			if( $attrib(uses[i], "data-position") == toRemovePosition ) {
				useToRemove = uses[i];
			}
		}
		if(useToRemove != null) {
			var rect = $elem("gameBoard").getElementsByTagName("rect")[oldPosition];
			updateIcon(useToRemove, icon_occupied, {
				 x: $attrib(rect, "x")
				,y: $attrib(rect, "y")
				,position: oldPosition
			});
		} else {
			console.log("could not find old occupy");
		}
	} else {
		//add
		var oldPosition = IconObject.Position[0];
		var rectOldPosition = $elem("gameBoard").getElementsByTagName("rect")[ oldPosition ];
		var occupy = createIcon(icon_occupied, ({
			 x: $attrib(rectOldPosition, "x")
			,y: $attrib(rectOldPosition, "y")
			,position: oldPosition
		}), false);
		$elem(occupy).style.fill = getValueFromStyleSheet("icons", "#" + Icons[IconObject.IconIndex].SVGName + " " + ".icon", "fill");
	}
	var rect = $elem("gameBoard").getElementsByTagName("rect")[newPosition];
	IconObject.Position = IconObject.Position.playerMove(newPosition, Icons[IconObject.IconIndex].MaxSize);
	updateIcon(IconObject.UseElement, IconObject.IconIndex, ({
		 x: $attrib(rect, "x")
		,y: $attrib(rect, "y")
		,position: newPosition
	}));
	return IconObject;
}
function showAttackAnimation(Point) {
	var rect = $elem("gameBoard").getElementsByTagName("rect")[Point];
	/*
	createIcon(icon_attack_animation, {
		 x: $attrib(rect, "x")
		,y: $attrib(rect, "y")
		,position: Point
	});
	*/
	var x = $attrib(rect, "x");
	var y = $attrib(rect, "y");
	var scale = squareSize / 100;
	var gamePieces = $elem("layer_gamePieces");
	var g = getElement("g", {
		transform: "translate(" + x.toString() + "," + y.toString() + ")"
	});
	var use = getElement("use", {
		 transform: "scale(" + scale.toString() + "," + scale.toString() + ")"
		,"data-icon": icon_attack_animation
		,"data-position": Point
	});
	use.setAttributeNS(xlinkNS, "href", "#" + Icons[icon_attack_animation].SVGName);
	g.appendChild(use);
	gamePieces.appendChild(g);
	var icon = $elem( Icons[icon_attack_animation].SVGName );
	var animatableObjects = new Array();
	var s = new Array();
	s.push( icon.getElementsByTagName("set") );
	s.push( icon.getElementsByTagName("animateMotion") );
	s.push( icon.getElementsByTagName("animate") );
	s.push( icon.getElementsByTagName("animateTransform") );
	for(var i=0;i<s.length; i++) {
		for(var j=0; j<s[i].length; j++) {
			var c = s[i][j].cloneNode();
			use.appendChild(c);
			animatableObjects.push(c);
		}
	}
	animatableObjects[0].addEventListener("end", function() {
		g.parentNode.removeChild(g);
	}, false);
	setTimeout(function() {
		for(var i=0; i<animatableObjects.length; i++) {
			animatableObjects[i].beginElement();
		}
	}, 200);
}
/*
	/Game Related
*/
/* Date / Time Related */
function dateTimeReviver(key, value) {
	var a;
	if (typeof value === "string") {
		a = /^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}\.[0-9]{3}Z$/.test(value);
		if (a) {
			return new Date(value);
		} else {
			//if( value.indexOf(":") >= 0 ) {
			//	console.log("Possible dateTimeReviver error, value looks like date but failed RegExp value is (${Date}).".replace(/\${Date}/, value));
			//}
			return value;
		}
	} else {
		return value;
	}
}
/* /Date / Time Related */
/*
	Debugging Related
*/
function debug_markArrayInMap(specialMark, toMark) {
	var result = new Array();
	for(var i=0; i<gameBoardSpacesHigh; i++) {
		for(var j=0; j<gameBoardSpacesWide; j++) {
			if( specialMark == (i*16 + j) ) {
				result.push("@");
			} else if( toMark.indexOf( i*16 + j ) >= 0 ) {
				//console.log("found:" + (i*16 + j).toString() + " at " + toMark.indexOf(i*16 + j).toString());
				result.push("X");
			} else {
				result.push("_");
			}
		}
		result.push("\n");
	}
	//result = result.reverse();
	console.log(result.join(""));
}
/*
	/Debugging Related
*/
/*
	Prototype Enhancements
*/
Array.prototype.remove = function(val) {
	if(typeof(val) == "object") {
		for(var i=0; i<val.length; i++) {
			var index = this.indexOf(val[i]);
			if( index>=0 ) {
				this.splice(index, 1);
			}
		}
	} else {
		var index = this.indexOf(val); 
		if (index >= 0) {
			this.splice(index, 1);
		}
	}
	return this;
};
Array.prototype.clone = function() {
	return this.slice(0);
};
Array.prototype.playerMove = function(NewPosition, MaxLength) {
	this.unshift(NewPosition);
	if( this.length > MaxLength ) {
		this.pop();
	}
	return this;
};
/*
	/Prototype Enhancements
*/