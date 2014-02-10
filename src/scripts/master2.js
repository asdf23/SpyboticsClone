//Constants
var xhtmlNS = "http://www.w3.org/1999/xhtml";
var svgNS   = "http://www.w3.org/2000/svg";
var xlinkNS = "http://www.w3.org/1999/xlink";

//Globals
var svg = null;
var deviceIsTouchEnabled = false;
var fontInfo = null;
var backgroundExtension = null;
var controlPanelExtension = null;
var gameBoardExtension = null;
var iconFactory = null;


//Functions
function init(svgElem) {
	console.log("init()");
	svg = svgElem;
	manuallySetCSSWhichIsCurrentlyNotRecognized();
	window.fontInfo = new FontInfo( $elem("layer_fontMeasurer") );
	window.backgroundExtension = new BackgroundExtension( $elem("layer_background") );
	window.controlPanelExtension = new ControlPanelExtension( $elem("ls_window") );
	window.gameBoardExtension = new GameBoardExtension( $elem("gameBoard") );
	window.iconFactory = new IconsFactory( $elem("layer_gamePieces"), window.gameBoardExtension );
	
	window.controlPanelExtension.SetMode(window.controlPanelExtension.Types_Mode.Init);
	window.gameBoardExtension.ResetSizeForScreen(getScreenDimensions(), 4);
	window.deviceIsTouchEnabled = ('ontouchstart' in document.documentElement);
	window.backgroundExtension.SetBackground( window.backgroundExtension.Types_Background.ASCIIGarbage );
	window.controlPanelExtension.ResetUserPrograms(1); //1= save slot
	window.controlPanelExtension.ResetUI(2);
	window.controlPanelExtension.SetMode(window.controlPanelExtension.Types_Mode.LoadingGame);
	window.gameBoardExtension.LoadLevel(0);
	
	console.log("/init()");
}

function getScreenDimensions() {
	return ({
		 width: document.defaultView.innerWidth
		,height: document.defaultView.innerHeight
	});
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
	for(var i=0; i<window.gameBoardExtension.GameBoardSpacesHigh; i++) {
		for(var j=0; j<window.gameBoardExtension.GameBoardSpacesWide; j++) {
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
	if((typeof(val) == "object") && (val.length)) {
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
Array.prototype.acceptAttack = function(AttackStrength) {
	var attackedPositions = new Array();
	for(var i=0; i<AttackStrength; i++) {
		attackedPositions.push( this.pop() );
	}
	return attackedPositions;
}
Array.prototype.playerMove = function(NewPosition, MaxLength) {
	var indexOfPrevious = this.indexOf(NewPosition);
	if(indexOfPrevious >= 0) {
		this.splice(indexOfPrevious, 1);
	}
	this.unshift(NewPosition);
	if( this.length > MaxLength ) {
		return this.pop();
	} else {
		return null;
	}
};
Array.prototype.merge = function(val) {
	var uniqueValues = new Array();
	for(var i=0; i<val.length; i++) {
		if( this.indexOf(val[i]) == -1 ) {
			this.push(val[i]);
			uniqueValues.push(val[i]);
		}
	}
	return uniqueValues;
};
Array.prototype.intersect = function(b) {
	var results = new Array();
	for(var i=0; i<this.length; i++) {
		if(b.indexOf(this[i]) >= 0) {
			results.push(this[i]);
		}
	}
	return results;
}
/*
	/Prototype Enhancements
*/