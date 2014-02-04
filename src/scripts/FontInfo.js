function FontInfo(fontMeasurerLayer) {
	this.MAXIMUM_POSSIBLE_FONT = 50;
	this.MINIMUM_POSSIBLE_FONT = 1;
	this.FONT_ITERATION_SIZE = 1;
	this.fontMeasurer = fontMeasurerLayer;
	this.FO = this.fontMeasurer.children[0];
	this.SPAN = this.FO.children[0];
	this.Fonts = new Array();
	this.GetDimentionsOfString = function(Element, String) {
		this.setDivToStyleOfElement(Element);
		this.SPAN.innerHTML = String;
		var bBox = this.SPAN.getClientRects()[0];
		this.SPAN.innerHTML = "";
		return bBox;
	};
	this.GetMaxFontSizeForSize = function(Element, Size, String) { //Size available for text
		var foundIdealFont = false;
		var lastFontSize = this.MINIMUM_POSSIBLE_FONT;
		this.setDivToStyleOfElement(Element);
		this.SPAN.innerHTML = String;
		for(var i=this.MINIMUM_POSSIBLE_FONT; (i<=this.MAXIMUM_POSSIBLE_FONT) && (!foundIdealFont); i+= this.FONT_ITERATION_SIZE) {
			lastFontSize = i;
			this.SPAN.style.fontSize = i.toString() + "px";
			var bBox = this.SPAN.getBoundingClientRect();
			/*
			console.log("Div Size:");
			console.log(bBox);
			console.log("FO Size:");
			console.log(this.SPAN.parentNode.getClientRects()[0]);
			*/
			if( (bBox.height > Size.height) || (bBox.width > Size.width) ) {
				foundIdealFont = true;
			}
		}
		this.SPAN.innerHTML = "";
		return lastFontSize.toString() + "px";
	};
	this.SetMaxFontSizeForSize = function(Element, Size, String) { //Size available for text
		var foundIdealFont = false;
		var lastFontSize = this.MINIMUM_POSSIBLE_FONT;
		this.setDivToStyleOfElement(Element);
		this.SPAN.innerHTML = String;
		for(var i=this.MINIMUM_POSSIBLE_FONT; (i<=this.MAXIMUM_POSSIBLE_FONT) && (!foundIdealFont); i+= this.FONT_ITERATION_SIZE) {
			lastFontSize = i;
			this.SPAN.style.fontSize = i.toString() + "px";
			var bBox = this.SPAN.getClientRects()[0];
			if( (bBox.height > Size.height) || (bBox.width > Size.width) ) {
				foundIdealFont = true;
			}
		}
		this.SPAN.innerHTML = "";
		Element.style.fontSize = lastFontSize.toString() + "px";
	};
	this.setDivToStyleOfElement = function(Element) {
		var family = window.getComputedStyle(Element, null)["fontFamily"];
		var weight = window.getComputedStyle(Element, null)["fontWeight"];
		var decoration = window.getComputedStyle(Element, null)["textDecoration"];
		this.SPAN.style.fontFamily = family;
		this.SPAN.style.fontWeight = weight;
		this.SPAN.style.textDecoration = decoration;
	};
}
/*
var fontInfo = new FontInfo( $elem("layer_fontMeasurer") );
fontInfo.SetMaxFontSizeForSize($elem("ls_window_content").children[0].children[0], ({width: 30, height: 20}), "Hello" )
*/