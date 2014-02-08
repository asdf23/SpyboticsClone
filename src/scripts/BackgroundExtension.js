function BackgroundExtension(backgroundLayer) {
	backgroundLayer.Types_Background = ({
		 ASCIIGarbage: ({
			 value: 0
			,GName: "ascii"
		})
		,BlockWorld: ({
			 value: 1
			,GName: "blockWorld"
		})
	});
	backgroundLayer.SetBackground = function(BackgroundType) {
		var gs = this.getElementsByTagName("g");
		for(var i=0; i<gs.length; i++) {
			if( BackgroundType.GName != gs[i].getAttribute("id") ) {
				gs[i].setAttribute("display", "none");
			} else {
				gs[i].removeAttribute("display");
			}
		}
	};
	return backgroundLayer;
}
/*
var background = new BackgroundExtension( $elem("layer_background") );
background.SetBackground( background.Types_Background.ASCIIGarbage );
*/