function ControlPanelExtension(controlPanelLayer) {
	//unneeded? controlPanelLayer.lsWindow = svg.getElementById("ls_window");
	controlPanelLayer.lsWindowTitle = svg.getElementById("ls_window_title"); //Gray titlebar
	controlPanelLayer.lsWindowContentBackground = svg.getElementById("ls_window_content_background"); //Background of program list
	controlPanelLayer.lsWindowContent = svg.getElementById("ls_window_content"); //ForiegnObject with div with n-Divs for programs
	controlPanelLayer.lsWindowContentContainer = controlPanelLayer.lsWindowContent.children[0]; //Div that contains divs of ls programs
	controlPanelLayer.manWindow = svg.getElementById("man_window"); //a G
	controlPanelLayer.manWindowTitlebar = svg.getElementById("man_window_titlebar"); //Gray titlebar 
	controlPanelLayer.manWindowTitleBackground = svg.getElementById("man_window_title_background"); //titlebar text background
	controlPanelLayer.manWindowTitle = svg.getElementById("man_window_title"); //ForiegnObject to contain div
	controlPanelLayer.manWindowTitleText = controlPanelLayer.manWindowTitle.children[0]; //div to manWindowTitle
	controlPanelLayer.manWindowContentBackground = svg.getElementById("man_window_content_background"); //Background to man window
	controlPanelLayer.manCurrentIcon = svg.getElementById("man_current_icon"); //Use for icon
	controlPanelLayer.manGeneralInfo = svg.getElementById("man_general_info"); //ForiegnObject of <div> with 2 inner divs for Move and Max Size
	controlPanelLayer.manHeader = svg.getElementById("man_header"); //ForiegnObject of <div> with 2 inner divs for Program Name and "Arguments"
	controlPanelLayer.button1 = svg.getElementById("button1"); //a G position 1st with rect,FO > div
	controlPanelLayer.button2 = svg.getElementById("button2"); //a G position 2nd with rect,FO > div
	controlPanelLayer.button3 = svg.getElementById("button3"); //a G position 3rd with rect,FO > div
	controlPanelLayer.buttonUndo = svg.getElementById("buttonUndo"); //a G at bottom left
	controlPanelLayer.buttonExecute = svg.getElementById("buttonExecute"); //a G at bottom left
	controlPanelLayer.buttonCancel = svg.getElementById("buttonCancel"); //a G at bottom left
	controlPanelLayer.button1Rect = controlPanelLayer.button1.children[0]; //fill:url(#linearGradientAttack|linearGradientAlternate|linearGradientNOP)
	controlPanelLayer.button2Rect = controlPanelLayer.button2.children[0]; //fill:url(#linearGradientAttack|linearGradientAlternate|linearGradientNOP)
	controlPanelLayer.button3Rect = controlPanelLayer.button3.children[0]; //fill:url(#linearGradientAttack|linearGradientAlternate|linearGradientNOP)
	controlPanelLayer.buttonUndoRect = controlPanelLayer.buttonUndo.children[0];
	controlPanelLayer.buttonExecuteRect = controlPanelLayer.buttonExecute.children[0];
	controlPanelLayer.buttonCancelRect = controlPanelLayer.buttonCancel.children[0];
	controlPanelLayer.button1FO = controlPanelLayer.button1.children[1];
	controlPanelLayer.button2FO = controlPanelLayer.button2.children[1];
	controlPanelLayer.button3FO = controlPanelLayer.button3.children[1];
	controlPanelLayer.buttonUndoFO = controlPanelLayer.buttonUndo.children[1];
	controlPanelLayer.buttonExecuteFO = controlPanelLayer.buttonExecute.children[1];
	controlPanelLayer.buttonCancelFO = controlPanelLayer.buttonCancel.children[1];
	controlPanelLayer.button1DIV = controlPanelLayer.button1.children[1].children[0];
	controlPanelLayer.button2DIV = controlPanelLayer.button2.children[1].children[0];
	controlPanelLayer.button3DIV = controlPanelLayer.button3.children[1].children[0];
	controlPanelLayer.buttonUndoDIV = controlPanelLayer.buttonUndo.children[1].children[0];
	controlPanelLayer.buttonExecuteDIV = controlPanelLayer.buttonExecute.children[1].children[0];
	controlPanelLayer.buttonCancelDIV = controlPanelLayer.buttonCancel.children[1].children[0];

	controlPanelLayer.manHelpCommand = svg.getElementById("man_help_command"); //ForiegnObject with div with div of text of Attack command
	controlPanelLayer.buttonUndo = svg.getElementById("buttonUndo"); //a G
	controlPanelLayer.buttonExecute = svg.getElementById("buttonExecute"); //a G
	controlPanelLayer.buttonCancel = svg.getElementById("buttonCancel"); //a G
	controlPanelLayer.LoadUserIcons = function(LoadSlot) {
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
		var iconFactoryInstance = new IconsFactory($elem("layer_gamePieces") , $elem("gameBoard"));
		var db = JSON.parse(localStorage["User.Programs." + LoadSlot.toString()]);
		db = db.sort(sortPrograms);
		for(var i=0; i<db.length; i++) {
			var div = document.createElementNS(xhtmlNS, "div");
			div.setAttribute("class", "scrollableWindowContent");
			div.IconData = iconFactoryInstance.Icons[ db[i].Program ];
			div.IconCount = db[i].Count;
			div.innerHTML = div.IconData.Name + " x" + div.IconCount.toString();
			iconFactoryInstance.Icons[ db[i].Program ].Name + " x" + db[i].Count.toString();
			div.addEventListener("click", function(d){ 
											return function() {
												console.log(d.IconData.Name + " x" + d.IconCount.toString());
											}
										}(div), false);
			this.lsWindowContentContainer.appendChild(div);
		}
		delete iconFactoryInstance;
	}
	controlPanelLayer.SetMode = function(Mode) {
		switch(Mode) {
			default:
				console.log("Unknown mode: " + Mode);
				break;
			case "Hidden":
				break;
			case "Init":
				this.manCurrentIcon.setAttribute("display", "none");
				this.manGeneralInfo.setAttribute("display", "none");
				this.manHeader.setAttribute("display", "none");
				this.button1.setAttribute("display", "none");
				this.button2.setAttribute("display", "none");
				this.button3.setAttribute("display", "none");
				this.manHelpCommand.setAttribute("display", "none");
				controlPanelLayer.manWindowTitleText = "$";
				break;
			case "LoadGame":
				break;
			case "PlayGame":
				break;
			//case 
		}
	};
	controlPanelLayer.ResetUI = function(windowWidth, scrollBarWidth, padding) {
		var scrollHeight = fontSizes[bashFontIndex].Height * lsPageLength; //TOOD: use of global
		var buttonHeight = fontSizes[buttonFontIndex].Height + padding;
		
		this.lsWindowTitle.setAttribute("width", windowWidth);
		if(this.lsWindowContentContainer.children.length > lsPageLength) {
			this.lsWindowContent.setAttribute("width", (windowWidth - scrollBarWidth));
		this.lsWindowContentBackground.setAttribute("width", windowWidth - scrollBarWidth);
		} else {
			this.lsWindowContent.setAttribute("width", (windowWidth));
			this.lsWindowContentBackground.setAttribute("width", windowWidth);
		}
		this.lsWindowContentBackground.setAttribute("width", windowWidth);
		this.manWindowTitlebar.setAttribute("width", windowWidth);
		this.manWindowContentBackground.setAttribute("width", windowWidth);
		
		this.lsWindowContent.setAttribute("height", scrollHeight);
		this.lsWindowContentContainer.setAttribute("height", (scrollHeight - padding));
		this.lsWindowContentBackground.setAttribute("height", scrollHeight);
		
		var lastBottom = this.lsWindowContent.getClientRects()[0].bottom;
		var nextY = (lastBottom + (padding/2));
		this.manWindowTitlebar.setAttribute("y", nextY);
		this.manWindowTitle.setAttribute("y", nextY);
		this.manWindowTitleBackground.setAttribute("y", nextY);
		lastBottom = this.manWindowTitlebar.getClientRects()[0].bottom;
		nextY = lastBottom;
		this.manWindowContentBackground.setAttribute("height", (document.defaultView.innerHeight - (lastBottom + buttonHeight) )); //TODO: use of screen width
		this.manWindowContentBackground.setAttribute("y", nextY);
		this.manCurrentIcon.setAttribute("x", padding);
		this.manCurrentIcon.setAttribute("y", padding + lastBottom);
		this.manGeneralInfo.setAttribute("x", (padding + squareSize + padding));
		this.manGeneralInfo.setAttribute("y", padding + lastBottom);
		var rectPosition = svg.getElementById("gameBoard").RectData[0]
		this.manCurrentIcon.setAttribute("transform", rectPosition.transform);
		//Error: cannot getClientRects on invisible item
		var wasInvisible = this.manCurrentIcon.hasAttribute("display");
		this.manCurrentIcon.removeAttribute("display");
		this.manCurrentIcon.getClientRects()[0].bottom;
		if(wasInvisible) {
			this.manCurrentIcon.setAttribute("display", "none");
		}
		this.manHeader.setAttribute("y", padding + lastBottom);
		//Error: cannot getClientRects on invisible item
		wasInvisible = this.manHeader.hasAttribute("display");
		this.manHeader.removeAttribute("display");
		lastBottom = this.manHeader.getClientRects()[0].bottom;
		if(wasInvisible) {
			this.manHeader.setAttribute("display", "none");
		}
		this.button1Rect.setAttribute("width", windowWidth);
		this.button1Rect.setAttribute("y", lastBottom + padding);
		this.button1FO.setAttribute("y", lastBottom + padding + (padding/2));
		this.button1FO.setAttribute("width", windowWidth);
		//Error: cannot getClientRects on invisible item
		wasInvisible = this.button1.hasAttribute("display");
		this.button1.removeAttribute("display");
		lastBottom = this.button1.getClientRects()[0].bottom;
		if(wasInvisible) {
			this.button1.setAttribute("display", "none");
		}
		this.button2Rect.setAttribute("width", windowWidth);
		this.button2Rect.setAttribute("y", lastBottom + padding);
		this.button2FO.setAttribute("y", lastBottom + padding + (padding/2));
		this.button2FO.setAttribute("width", windowWidth);
		//Error: cannot getClientRects on invisible item
		wasInvisible = this.button2.hasAttribute("display");
		this.button2.removeAttribute("display");
		lastBottom = this.button2.getClientRects()[0].bottom;
		if(wasInvisible) {
			this.button2.setAttribute("display", "none");
		}
		this.button3Rect.setAttribute("width", windowWidth);
		this.button3Rect.setAttribute("y", lastBottom + padding);
		this.button3FO.setAttribute("y", lastBottom + padding + (padding/2));
		this.button3FO.setAttribute("width", windowWidth);
		//Error: cannot getClientRects on invisible item
		wasInvisible = this.button3.hasAttribute("display");
		this.button3.removeAttribute("display");
		lastBottom = this.button3.getClientRects()[0].bottom;
		if(wasInvisible) {
			this.button3.setAttribute("display", "none");
		}
		var nextHeight = (document.defaultView.innerHeight - (lastBottom + buttonHeight)); //TODO: Figure out what to do with screen height
		this.manHelpCommand.setAttribute("width", windowWidth);
		this.manHelpCommand.setAttribute("y", (lastBottom + padding));
		this.manHelpCommand.setAttribute("height", nextHeight);
		//Error: cannot getClientRects on invisible item
		wasInvisible = this.manHelpCommand.hasAttribute("display");
		this.manHelpCommand.removeAttribute("display");
		lastBottom = this.manHelpCommand.getClientRects()[0].bottom;
		if(wasInvisible) {
			this.manHelpCommand.setAttribute("display", "none");
		}
		this.buttonUndoRect.setAttribute("width", windowWidth);
		this.buttonUndoRect.setAttribute("y", lastBottom);
		this.buttonExecuteRect.setAttribute("width", windowWidth);
		this.buttonExecuteRect.setAttribute("y", lastBottom);
		this.buttonCancelRect.setAttribute("width", windowWidth);
		this.buttonCancelRect.setAttribute("y", lastBottom);
		this.buttonUndoFO.setAttribute("width", windowWidth);
		this.buttonUndoFO.setAttribute("y", (lastBottom - (padding / 2)));
		this.buttonExecuteFO.setAttribute("width", windowWidth);
		this.buttonExecuteFO.setAttribute("y", (lastBottom - (padding / 2)));
		this.buttonCancelFO.setAttribute("width", windowWidth);
		this.buttonCancelFO.setAttribute("y", (lastBottom - (padding / 2)));
		
	}
	return controlPanelLayer;
}
/*
var controlPanel = new ControlPanelExtension($elem("ls_window"));
controlPanel.LoadUserIcons(1); //1= save slot
controlPanel.ResetUI(190, 10, 4)
*/