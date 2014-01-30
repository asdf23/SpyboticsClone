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
	controlPanelLayer.button1 = svg.getElementById("button1"); //1st Rect with style fill:url(#linearGradientAttack|linearGradientAlternate|linearGradientNOP)
	controlPanelLayer.button2 = svg.getElementById("button2"); //2nd Rect with style fill:url(#linearGradientAttack|linearGradientAlternate|linearGradientNOP)
	controlPanelLayer.button3 = svg.getElementById("button3"); //3rd Rect with style fill:url(#linearGradientAttack|linearGradientAlternate|linearGradientNOP)
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
	controlPanelLayer.ResetUI = function(windowWidth, scrollBarWidth) {
		this.lsWindowTitle.setAttribute("width", windowWidth);
		this.lsWindowContentBackground.setAttribute("width", windowWidth);
		this.lsWindowContentBackground.setAttribute("width", windowWidth - scrollBarWidth);
		this.manWindowTitlebar.setAttribute("width", windowWidth);
		this.manWindowContentBackground.setAttribute("width", windowWidth);
	}
	return controlPanelLayer;
}
/*
	var controlPanel = new ControlPanelExtension($elem("ls_window"));
	controlPanel.LoadUserIcons(1); //1= save slot
*/