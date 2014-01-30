function ControlPanelExtension(controlPanelLayer) {
	//unneeded? controlPanelLayer.lsWindow = svg.getElementById("ls_window");
	controlPanelLayer.lsWindowTitle = svg.getElementById("ls_window_title"); //Gray titlebar
	controlPanelLayer.lsWindowContentBackground = svg.getElementById("ls_window_content_background"); //Background of program list
	controlPanelLayer.lsWindowContent = svg.getElementById("ls_window_content"); //ForiegnObject with div with n-Divs for programs
	controlPanelLayer.manWindow = svg.getElementById("man_window"); //a G
	controlPanelLayer.manWindowTitlebar = svg.getElementById("man_window_titlebar"); //Gray titlebar 
	controlPanelLayer.manWindowTitleBackground = svg.getElementById("man_window_title_background"); //titlebar text background
	controlPanelLayer.manWindowTitle = svg.getElementById("man_window_title"); //ForiegnObject to contain div
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
	controlPanelLayer.SetMode = function(Mode) {
		switch(Mode) {
			default:
				console.log("Unknown mode: " + Mode);
				break;
			case "Hidden":
				break;
			case "Init":
				break;
			case "LoadGame":
				break;
			case "PlayGame":
				break;
			case 
		}
	};
	controlPanelLayer.ResetSizesForScreen = function(windowWidth, scrollBarWidth) {
		this.lsWindowTitle.setAttribute("width", windowWidth);
		this.lsWindowContentBackground.setAttribute("width", windowWidth);
		this.lsWindowContentBackground.setAttribute("width", windowWidth - scrollBarWidth);
		this.manWindowTitlebar.setAttribute("width", windowWidth);
		this.manWindowContentBackground.setAttribute("width", windowWidth);
	}
	return controlPanelLayer;
}