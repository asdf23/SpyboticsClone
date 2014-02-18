/*
	External data used by this class
	windowWidth //maybe store and calculate here?
	uses IconData
	LoadSlot (save game)
	Internal Player programs database: User.Programs.0
	References iconFactoryInstance for IconData to show man page
	Is passed a mode to control the control panel's appearance
	resetui accepts windowWidth, scrollBarWidth, padding -- scrollbarWidth to be calculated
	required global: lsPageLength -- removed
	required global: fontSizes[]
	calls innerHeight directly
	required global: buttonHeight
	ResetUI needs GameBoard's gameBoard.RectData
	ResetUI does not expect visibitly state
*/
function ControlPanelExtension(controlPanelLayer) {
	controlPanelLayer.Types_Mode = ({
		 Hidden: ({
			 Value: 0
			,Name: "Hidden"
		})
		,Init: ({
			 Value: 1
			,Name: "Init"
		})
		,LoadingGame: ({
			 Value: 2
			,Name: "LoadingGame"
		})
		,InGameEnemyTurn: ({
			 Value: 3
			,Name: "InGameEnemyTurn"
		})
		,InGamePlayerTurn: ({
			 Value: 4
			,Name: "InGamePlayerTurn"
		})
	});
	controlPanelLayer.Types_Button = ({
		 Cancel: ({
			 Value: 0
			,Name: "Cancel"
		})
		,Logout: ({
			 Value: 1
			,Name: "Logout"
		})
		,Execute: ({
			 Value: 2
			,Name: "Execute"
		})
	});
	controlPanelLayer.WindowWidth = 190; //All window widths should come from here
	console.log("WindowWidth is currently hard-coded this should be calculated");
	controlPanelLayer.lsPageLength = 3;
	controlPanelLayer.ProgramStore = null;
	controlPanelLayer.ProgramInstance = null;
	controlPanelLayer.CurrentMode = null;
	controlPanelLayer.CurrentButton = null;
	
	controlPanelLayer.lsWindow = svg.getElementById("ls_window");
	controlPanelLayer.lsWindowTitle = svg.getElementById("ls_window_title"); //Gray titlebar
	controlPanelLayer.lsWindowTitleDIV = controlPanelLayer.lsWindow.children[2].children[0]; //DIV for ls /bin
	controlPanelLayer.lsWindowContentBackground = svg.getElementById("ls_window_content_background"); //Background of program list
	controlPanelLayer.lsWindowContent = svg.getElementById("ls_window_content"); //ForiegnObject with div with n-Divs for programs
	controlPanelLayer.lsWindowContentContainer = controlPanelLayer.lsWindowContent.children[0]; //Div that contains divs of ls programs
	controlPanelLayer.manWindow = svg.getElementById("man_window"); //a G
	controlPanelLayer.manWindowTitlebar = svg.getElementById("man_window_titlebar"); //Gray titlebar 
	controlPanelLayer.manWindowTitleBackground = svg.getElementById("man_window_title_background"); //titlebar text background
	controlPanelLayer.manWindowTitle = svg.getElementById("man_window_title"); //ForiegnObject to contain div
	controlPanelLayer.manWindowTitleDIV = controlPanelLayer.manWindowTitle.children[0]; //div to manWindowTitle
	controlPanelLayer.manWindowContentBackground = svg.getElementById("man_window_content_background"); //Background to man window
	controlPanelLayer.manCurrentIcon = svg.getElementById("man_current_icon"); //Use for icon
	controlPanelLayer.manGeneralInfo = svg.getElementById("man_general_info"); //ForiegnObject of <div> with 2 inner divs for Move and Max Size
	controlPanelLayer.manGeneralInfoContainer = controlPanelLayer.manGeneralInfo.children[0];
	controlPanelLayer.manGeneralInfoDIVMove = controlPanelLayer.manGeneralInfoContainer.children[0];
	controlPanelLayer.manGeneralInfoDIVSize = controlPanelLayer.manGeneralInfoContainer.children[1];
	controlPanelLayer.manHeader = svg.getElementById("man_header"); //ForiegnObject of <div> with 2 inner divs for Program Name and "Arguments"
	controlPanelLayer.manHeaderContainer = controlPanelLayer.manHeader.children[0];
	controlPanelLayer.manHeaderDIVProgramName = controlPanelLayer.manHeaderContainer.children[0];
	controlPanelLayer.button1 = svg.getElementById("button1"); //a G position 1st with rect,FO > div
	controlPanelLayer.button2 = svg.getElementById("button2"); //a G position 2nd with rect,FO > div
	controlPanelLayer.button3 = svg.getElementById("button3"); //a G position 3rd with rect,FO > div
	controlPanelLayer.buttonLogout = svg.getElementById("buttonLogout"); //a G at bottom left
	controlPanelLayer.buttonExecute = svg.getElementById("buttonExecute"); //a G at bottom left
	controlPanelLayer.buttonCancel = svg.getElementById("buttonCancel"); //a G at bottom left
	controlPanelLayer.button1Rect = controlPanelLayer.button1.children[0]; //fill:url(#linearGradientAttack|linearGradientAlternate|linearGradientNOP)
	controlPanelLayer.button2Rect = controlPanelLayer.button2.children[0]; //fill:url(#linearGradientAttack|linearGradientAlternate|linearGradientNOP)
	controlPanelLayer.button3Rect = controlPanelLayer.button3.children[0]; //fill:url(#linearGradientAttack|linearGradientAlternate|linearGradientNOP)
	controlPanelLayer.buttonLogoutRect = controlPanelLayer.buttonLogout.children[0];
	controlPanelLayer.buttonExecuteRect = controlPanelLayer.buttonExecute.children[0];
	controlPanelLayer.buttonCancelRect = controlPanelLayer.buttonCancel.children[0];
	controlPanelLayer.button1FO = controlPanelLayer.button1.children[1];
	controlPanelLayer.button2FO = controlPanelLayer.button2.children[1];
	controlPanelLayer.button3FO = controlPanelLayer.button3.children[1];
	controlPanelLayer.buttonLogoutFO = controlPanelLayer.buttonLogout.children[1];
	controlPanelLayer.buttonExecuteFO = controlPanelLayer.buttonExecute.children[1];
	controlPanelLayer.buttonCancelFO = controlPanelLayer.buttonCancel.children[1];
	controlPanelLayer.button1DIV = controlPanelLayer.button1.children[1].children[0];
	controlPanelLayer.button2DIV = controlPanelLayer.button2.children[1].children[0];
	controlPanelLayer.button3DIV = controlPanelLayer.button3.children[1].children[0];
	controlPanelLayer.buttonLogoutDIV = controlPanelLayer.buttonLogout.children[1].children[0];
	controlPanelLayer.buttonExecuteDIV = controlPanelLayer.buttonExecute.children[1].children[0];
	controlPanelLayer.buttonCancelDIV = controlPanelLayer.buttonCancel.children[1].children[0];
	
	controlPanelLayer.manHelpCommand = svg.getElementById("man_help_command"); //ForiegnObject with div with div of text of Attack command
	controlPanelLayer.manHelpCommandDIV = controlPanelLayer.manHelpCommand.children[0];
	controlPanelLayer.buttonLogout = svg.getElementById("buttonLogout"); //a G
	controlPanelLayer.buttonExecute = svg.getElementById("buttonExecute"); //a G
	controlPanelLayer.buttonCancel = svg.getElementById("buttonCancel"); //a G
	
	controlPanelLayer.button1.addEventListener("click", function(whichButton) {
		return function() {
			controlPanelLayer.AttackButtonClick(whichButton);
		}
	}(1), false);
	controlPanelLayer.button2.addEventListener("click", function(whichButton) {
		return function() {
			controlPanelLayer.AttackButtonClick(whichButton);
		}
	}(2), false);
	controlPanelLayer.button3.addEventListener("click", function(whichButton) {
		return function() {
			controlPanelLayer.AttackButtonClick(whichButton);
		}
	}(3), false);
	controlPanelLayer.AttackButtonClick = function(whichButton) {
		switch( this.CurrentMode ) {
			default:
				console.log("Mode: " + this.CurrentMode.Name);
				if(controlPanelLayer.ProgramInstance != null) {
					console.log("user requested for program");
					console.log(controlPanelLayer.ProgramInstance);
					console.log("to use attack");
					console.log(controlPanelLayer.ProgramInstance.IconData.Attack[whichButton - 1]);
					if(controlPanelLayer.ProgramInstance.CompletedMove == null) {
						controlPanelLayer.ProgramInstance.RemainingMoves = 0; //this button could be made a toggle but for now, clicking this ends the players turn
						//Remove any visible movement icons
						for(var i=0; i<window.players.length; i++) {
							if( window.players[i].MovementIndicators != null ) {
								while(window.players[i].MovementIndicators.length > 0) {
									var use = window.players[i].MovementIndicators[0];
									use.parentNode.removeChild(use);
									window.players[i].MovementIndicators.remove(use);
								}
							}
						}
						controlPanelLayer.ProgramInstance.ShowAttackablePlaces();
					} else {
						console.log("player has already completed it's move for this turn");
					}
				}
				break;
		}
	};
	controlPanelLayer.FindProgram = function(IconData) {
		for(var i=0; i<this.lsWindowContentContainer.children.length; i++) {
			if(this.lsWindowContentContainer.children[i].IconData == IconData) {
				return this.lsWindowContentContainer.children[i];
			}
		}
		return null;
	};
	controlPanelLayer.ManProgram = function(sender, IconData) { //Sender is div or use from ls or board
		this.manGeneralInfoDIVMove.innerHTML = "Move: " + IconData.Move.toString();
		this.manGeneralInfoDIVSize.innerHTML = "Max Size: " + IconData.MaxSize.toString();
		this.manHeaderDIVProgramName.innerHTML = IconData.Name;
		this.manCurrentIcon.setAttributeNS(xlinkNS, "href", "#" + IconData.SVGName);
		this.manCurrentIcon.removeAttribute("display");
		this.manGeneralInfo.removeAttribute("display");
		this.manHeader.removeAttribute("display");
		this.manHelpCommandDIV.innerHTML = IconData.Description;
		this.manHelpCommand.removeAttribute("display");
		controlPanelLayer.manWindowTitleDIV.innerHTML = "man " + IconData.Name;
		if(sender.tagName == "div") {
			this.ProgramStore = sender;
			this.ProgramInstance = null;
		} else {
			this.ProgramStore = this.FindProgram(IconData);
			this.ProgramInstance = sender;
		}
		//TOOD: hide show buttons, move alternate to Attack.AttackType
		if(IconData.Attack != null) {
			if( IconData.Attack.length > 0 ) {
				this.button1.setAttribute("style", this.AttackTypeToFill(IconData.Attack[0].AttackType));
				this.button1DIV.innerHTML = IconData.Attack[0].Name;
				this.button1.removeAttribute("display", "none");
			} else {
				this.button1.setAttribute("display", "none");
			}
			if( IconData.Attack.length > 1 ) {
				this.button2.setAttribute("style", this.AttackTypeToFill(IconData.Attack[1].AttackType));
				this.button2DIV.innerHTML = Attack[1].Name;
				this.button2.removeAttribute("display", "none");
			} else {
				this.button2.setAttribute("display", "none");
			}
			if( IconData.Attack.length > 1 ) {
				this.button3.setAttribute("style", this.AttackTypeToFill(IconData.Attack[2].AttackType));
				this.button3DIV.innerHTML = Attack[2].Name;
				this.button3.removeAttribute("display", "none");
			} else {
				this.button3.setAttribute("display", "none");
			}
		}
	};
	controlPanelLayer.AttackTypeToFill = function(AttackType) { //TODO: should this be moved?
		switch(AttackType) {
			default:
				return "fill:url(#linearGradientAlternate)";
			case "StandardAttack":
				return "fill:url(#linearGradientAttack)";
		}
	};
	controlPanelLayer.ResetUserPrograms = function(LoadSlot) {
		if( localStorage["User.Programs." + LoadSlot.toString()] == undefined) {
			localStorage["User.Programs." + LoadSlot.toString()] = JSON.stringify([{
				 Program: icon_hack
				,Count: 1
			}, {
				 Program: icon_slingshot
				,Count: 1
			}]);
		}
		while(this.lsWindowContentContainer.children.length > 0) {
			this.lsWindowContentContainer.removeChild(this.lsWindowContentContainer.children[0]);
		}
		this.lsWindowTitleDIV.innerHTML = "ls /bin";
		var iconFactoryInstance = new IconsFactory($elem("layer_gamePieces") , $elem("gameBoard"));
		var db = JSON.parse(localStorage["User.Programs." + LoadSlot.toString()]);
		db = db.sort(sortPrograms);
		for(var i=0; i<db.length; i++) {
			var div = new ProgramInstanceExtension(db[i].Program, db[i].Count);
			this.lsWindowContentContainer.appendChild(div);
		}
		delete iconFactoryInstance;
	};
	controlPanelLayer.SetMode = function(Mode) {
		this.CurrentMode = Mode;
		switch(Mode) {
			default:
				console.log("Unknown mode: " + Mode.Name);
				break;
			case this.Types_Mode.Hidden:
				break;
			case this.Types_Mode.Init:
				this.manCurrentIcon.setAttribute("display", "none");
				this.manGeneralInfo.setAttribute("display", "none");
				this.manHeader.setAttribute("display", "none");
				this.button1.setAttribute("display", "none");
				this.button2.setAttribute("display", "none");
				this.button3.setAttribute("display", "none");
				this.manHelpCommand.setAttribute("display", "none");
				this.lsWindowTitleDIV.innerHTML = "$";
				this.manWindowTitleDIV.innerHTML = "$";
				this.ShowButton(this.Types_Button.Execute);
				break;
			case this.Types_Mode.LoadingGame:
				console.log("Set mode: " + Mode.Name);
				break;
			case this.Types_Mode.InGameEnemyTurn:
				console.log("Set mode: " + Mode.Name);
				break;
			case this.Types_Mode.InGamePlayerTurn:
				console.log("Set mode: " + Mode.Name);
				break;
		}
	};
	controlPanelLayer.ShowButton = function(Button) {
		this.CurrentButton = Button;
		switch(Button) {
			default:
				console.log("Unknown button mode: " + Button.Name);
				break;
			case this.Types_Button.Cancel:
				this.buttonLogout.setAttribute("display", "none");
				this.buttonExecute.setAttribute("display", "none");
				this.buttonCancel.removeAttribute("display");
				break;
			case this.Types_Button.Logout:
				this.buttonCancel.setAttribute("display", "none");
				this.buttonExecute.setAttribute("display", "none");
				this.buttonLogout.removeAttribute("display");
				break;
			case this.Types_Button.Execute:
				this.buttonCancel.setAttribute("display", "none");
				this.buttonLogout.setAttribute("display", "none");
				this.buttonExecute.removeAttribute("display");
				break;
		}
	};
	controlPanelLayer.ResetUI = function(padding) { //requires gameBoardExtension.SquareSize (from gameBoardLayer.ResetSizeForScreen)
		var scrollBarWidth = this.lsWindowContent.width.baseVal.value - this.lsWindowContentContainer.clientWidth;
		if( isNaN(scrollBarWidth) ) {
			console.log("failed to set scrollBarWidth");
			scrollBarWidth = 10;
		} else {
			console.log("set scrollBarWidth to " + scrollBarWidth.toString());
		}
		var longestPlayerIconName = "";
		for(var i in window.iconFactory.Icons){
			if(window.iconFactory.Icons[i].isPlayer) {
				if( window.iconFactory.Icons[i].Name.length > longestPlayerIconName.length ) {
					longestPlayerIconName = window.iconFactory.Icons[i].Name;
				}
			}
		}
		if(longestPlayerIconName == "") {
			throw "Icon data is corrupted.";
		}
		//should set controlPanelLayer.WindowWidth here
		this.WindowWidth = (padding + window.gameBoardExtension.SquareSize + padding) + window.fontInfo.GetDimentionsOfString(this.manGeneralInfoDIVMove, "Move: 333 ").width + padding;
		
		var scrollTextSize = window.fontInfo.GetMaxFontSizeForElement(this.lsWindowContentContainer, this.lsPageLength, longestPlayerIconName);
		var scrollHeight = scrollTextSize.height;
		console.log(scrollTextSize);
		
		this.lsWindowTitle.width.baseVal.value = this.WindowWidth;
		//If scroll bar self hides
		//if(this.lsWindowContentContainer.children.length > this.lsPageLength) { //TODO: use of global
		//	this.lsWindowContent.setAttribute("width", (this.WindowWidth - scrollBarWidth));
		//	this.lsWindowContentBackground.setAttribute("width", this.WindowWidth - scrollBarWidth);
		//} else {
		//	this.lsWindowContent.setAttribute("width", (this.WindowWidth));
		//	this.lsWindowContentBackground.setAttribute("width", this.WindowWidth);
		//}
		//Otherwise
		var widthMinusXOffset = (this.WindowWidth - this.lsWindowContent.x.baseVal.value);
		this.lsWindowContent.width.baseVal.value = widthMinusXOffset;
		this.lsWindowContentContainer.style.width = widthMinusXOffset;
		this.lsWindowContentBackground.width.baseVal.value = this.WindowWidth;
		
		this.manWindowTitlebar.width.baseVal.value = this.WindowWidth;
		this.manWindowContentBackground.width.baseVal.value = this.WindowWidth;
		
		this.lsWindowContent.height.baseVal.value = scrollHeight;
		this.lsWindowContentContainer.style.height = (scrollHeight - padding).toString() + "px";
		this.lsWindowContentBackground.height.baseVal.value = scrollHeight;
		
		var lastBottom = this.lsWindowContent.getClientRects()[0].bottom;
		var nextY = (lastBottom + (padding/2));
		this.manWindowTitlebar.y.baseVal.value = nextY;
		this.manWindowTitle.y.baseVal.value = nextY;
		this.manWindowTitleBackground.y.baseVal.value = nextY;
		lastBottom = this.manWindowTitlebar.getClientRects()[0].bottom;
		nextY = lastBottom;
		var wasInvisible = false;
		var buttonHeight = this.button1FO.height.baseVal.value;
		wasInvisible = this.button1.hasAttribute("display");
		this.button1.removeAttribute("display");
		buttonHeight = window.fontInfo.GetMaxFontSizeForElement(this.button1DIV, 1, "S").height + (padding / 2); //a guess chicken and egg problem
		if(wasInvisible) {
			this.button1.setAttribute("display", "none");
		}
		console.log("buttonHeight: " + buttonHeight.toString());
		this.manWindowContentBackground.height.baseVal.value = (document.defaultView.innerHeight - (lastBottom + buttonHeight)); //TODO: use of screen width, use of global
		this.manWindowContentBackground.y.baseVal.value = nextY;
		var rectPosition = window.gameBoardExtension.RectData[0];
		this.manCurrentIcon.setAttribute("transform", rectPosition.transform);
		this.manCurrentIcon.x.baseVal.value = (1 / this.manCurrentIcon.transform.baseVal[0].matrix.a) * (padding);
		this.manCurrentIcon.y.baseVal.value = (1 / this.manCurrentIcon.transform.baseVal[0].matrix.d) * (padding + lastBottom);
		this.manGeneralInfo.x.baseVal.value = (padding + window.gameBoardExtension.SquareSize + padding);
		this.manGeneralInfo.y.baseVal.value = padding + lastBottom;
		
		//Error: cannot getClientRects on invisible item
		wasInvisible = this.manCurrentIcon.hasAttribute("display");
		this.manCurrentIcon.removeAttribute("display");
		lastBottom = this.manCurrentIcon.getClientRects()[0].bottom;
		if(wasInvisible) {
			this.manCurrentIcon.setAttribute("display", "none");
		}
		this.manHeader.y.baseVal.value = (padding + lastBottom);
		//Error: cannot getClientRects on invisible item
		wasInvisible = this.manHeader.hasAttribute("display");
		this.manHeader.removeAttribute("display");
		lastBottom = this.manHeader.getClientRects()[0].bottom;
		if(wasInvisible) {
			this.manHeader.setAttribute("display", "none");
		}
		this.button1Rect.width.baseVal.value = this.WindowWidth;
		this.button1Rect.y.baseVal.value = (lastBottom + padding);
		this.button1FO.y.baseVal.value = (lastBottom + padding + (padding/2));
		this.button1FO.width.baseVal.value = this.WindowWidth;
		//Error: cannot getClientRects on invisible item
		wasInvisible = this.button1.hasAttribute("display");
		this.button1.removeAttribute("display");
		lastBottom = this.button1.getClientRects()[0].bottom;
		if(wasInvisible) {
			this.button1.setAttribute("display", "none");
		}
		this.button2Rect.width.baseVal.value = this.WindowWidth;
		this.button2Rect.y.baseVal.value = (lastBottom + padding);
		this.button2FO.y.baseVal.value = (lastBottom + padding + (padding/2));
		this.button2FO.width.baseVal.value = this.WindowWidth;
		//Error: cannot getClientRects on invisible item
		wasInvisible = this.button2.hasAttribute("display");
		this.button2.removeAttribute("display");
		lastBottom = this.button2.getClientRects()[0].bottom;
		if(wasInvisible) {
			this.button2.setAttribute("display", "none");
		}
		this.button3Rect.width.baseVal.value = this.WindowWidth;
		this.button3Rect.y.baseVal.value = (lastBottom + padding);
		this.button3FO.y.baseVal.value = (lastBottom + padding + (padding/2));
		this.button3FO.width.baseVal.value = this.WindowWidth;
		//Error: cannot getClientRects on invisible item
		wasInvisible = this.button3.hasAttribute("display");
		this.button3.removeAttribute("display");
		lastBottom = this.button3.getClientRects()[0].bottom;
		if(wasInvisible) {
			this.button3.setAttribute("display", "none");
		}
		var nextHeight = (document.defaultView.innerHeight - (lastBottom + buttonHeight)); //TODO: Figure out what to do with screen height, global use
		this.manHelpCommand.width.baseVal.value = this.WindowWidth;
		this.manHelpCommand.y.baseVal.value = (lastBottom + padding);
		this.manHelpCommand.height.baseVal.value = nextHeight;
		this.manHelpCommandDIV.style.height = nextHeight.toString() + "px";
		//Error: cannot getClientRects on invisible item
		wasInvisible = this.manHelpCommand.hasAttribute("display");
		this.manHelpCommand.removeAttribute("display");
		lastBottom = this.manHelpCommand.getClientRects()[0].bottom;
		if(wasInvisible) {
			this.manHelpCommand.setAttribute("display", "none");
		}
		this.buttonLogoutRect.width.baseVal.value = this.WindowWidth;
		this.buttonLogoutRect.y.baseVal.value = (lastBottom - (padding / 2));
		this.buttonExecuteRect.width.baseVal.value = this.WindowWidth;
		this.buttonExecuteRect.y.baseVal.value = (lastBottom - (padding / 2));
		this.buttonCancelRect.width.baseVal.value = this.WindowWidth;
		this.buttonCancelRect.y.baseVal.value = (lastBottom - (padding / 2));
		this.buttonLogoutFO.width.baseVal.value = this.WindowWidth;
		this.buttonLogoutFO.y.baseVal.value = lastBottom;
		this.buttonExecuteFO.width.baseVal.value = this.WindowWidth;
		this.buttonExecuteFO.y.baseVal.value = lastBottom;
		this.buttonCancelFO.width.baseVal.value = this.WindowWidth;
		this.buttonCancelFO.y.baseVal.value = lastBottom;
		this.lsWindowContentContainer.style.height = (scrollHeight - padding).toString() + "px";
	};
	controlPanelLayer.buttonCancel.addEventListener("click", function() {
		console.log("Cancel Click");
		switch( window.controlPanelExtension.CurrentMode ) {
			default:
				console.log("Cancel button should not have been visible");
				break;
			case window.controlPanelExtension.Types_Mode.LoadingGame:
				for(var i=0; i<window.players.length; i++) {
					if(window.players[i].Selected) {
						window.players[i].ClearSelected();
						window.players[i].parentNode.removeChild(window.players[i]);
						window.players.remove( window.players[i] );
						if(window.controlPanelExtension.ProgramStore != null) {
							window.controlPanelExtension.ProgramStore.IncreaseInstance();
							window.controlPanelExtension.ShowButton(window.controlPanelExtension.Types_Button.Execute);
						}
					}
				}
				break;
			case window.controlPanelExtension.Types_Mode.InGamePlayerTurn:
				var icn = window.controlPanelExtension.ProgramInstance;
				if(icn != null) {
					icn.RemainingMoves = 0;
					window.iconFactory.RemoveAllIconsByType(icon_attackable);
					if(icn.MovementIndicators != null) {
						for(var i=0; i<icn.MovementIndicators.length; i++) {
							icn.MovementIndicators[i].parentNode.removeChild(icn.MovementIndicators[i]);
						}
					}
					icn.MovementIndicators = new Array();
					icn.ShowCompletedMove();
					//TODO: find next player piece and give focus or if none focus on first enemy
					var foundUnMovedPlayer = false;
					var icnPlayer = null;
					for(var i=0; (i<window.players.length) && (!foundUnMovedPlayer); i++) {
						if(window.players[i].CompletedMove == null) {
							foundUnMovedPlayer = true;
							icnPlayer = window.players[i];
						}
					}
					if(foundUnMovedPlayer) {
						window.controlPanelExtension.ShowButton(window.controlPanelExtension.Types_Button.Logout);
						window.controlPanelExtension.ManProgram(icnPlayer, icnPlayer.IconData);
						icnPlayer.ShowMoveablePlaces();
					} else {
						for(var i=0; i<window.enemies.length; i++) {
							window.enemies[i].RemainingMoves = window.enemies[i].IconData.Move;
						}
						window.enemies[0].AutomateMove();
					}
				}
				break;
		}
	}, false);
	controlPanelLayer.buttonExecute.addEventListener("click", function() {
		console.log("Execute click");
		window.iconFactory.RemoveAllIconsByType(icon_load);
		window.iconFactory.RemoveAllIconsByType(icon_moved);
		var levelMap = Levels[window.gameBoardExtension.CurrentLevel];
		controlPanelLayer.ShowButton(controlPanelLayer.Types_Button.Logout);
		if( levelMap.FirstMove == "Enemy" ) {
			//massive chaining of events....
			for(var i=0; i<window.enemies.length; i++) {
				window.enemies[i].RemainingMoves = window.enemies[i].IconData.Move;
				if((i+1) < window.enemies.length) {
					//another icon after this one..
					window.enemies[i].NextInChain = window.enemies[i+1].AutomateMove.bind(window.enemies[i+1]);
				} else {
					//last icon
					window.enemies[i].NextInChain = function() {
						console.log("last enemy executing NextInChain (should reset back to player 1)");
						for(var i=0; i<window.players.length; i++) {
							window.players[i].RemainingMoves = window.players[i].IconData.Move;
							window.players[i].ClearCompletedMove();
						}
						controlPanelLayer.SetMode(controlPanelLayer.Types_Mode.InGamePlayerTurn);
						controlPanelLayer.ManProgram(window.players[0], window.players[0].IconData);
						window.players[0].RemainingMoves = window.players[0].IconData.Move;
						window.players[0].ShowSelected();
						//controlPanelLayer.ProgramInstance = window.players[0];
						window.players[0].ShowMoveablePlaces();
					}; 
				}
			}
			controlPanelLayer.SetMode(controlPanelLayer.Types_Mode.InGameEnemyTurn);
			window.enemies[0].AutomateMove();
		} else {
			console.log("First move " + levelMap.FirstMove + " not implemented");
		}
	}, false);
	controlPanelLayer.ToggleLogoutCancel = function() {
		if(this.CurrentMode == this.Types_Mode.InGamePlayerTurn) {
			switch(this.CurrentButton) {
				default:
				case this.Types_Button.Execute:
				case this.Types_Button.Cancel:
					this.ShowButton(this.Types_Button.Logout);
					return true;
				case this.Types_Button.Logout:
					this.ShowButton(this.Types_Button.Cancel);
					return false;
			}
		}
	}
	return controlPanelLayer;
}
/*
var controlPanel = new ControlPanelExtension($elem("ls_window"));
controlPanel.ResetUserPrograms(1); //1= save slot
controlPanel.ResetUI(190, 4)

{
	"draw_white_space": "all",
	"font_size": 13,
	"ignored_packages":
	[
		"Vintage"
	],
	"translate_tabs_to_spaces": false,
	"trim_automatic_white_space": false
}

*/