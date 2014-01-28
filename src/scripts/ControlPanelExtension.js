function ControlPanelExtension(controlPanelLayer) {
	controlPanelLayer.ButtonUndo = null;
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
	return controlPanelLayer;
}