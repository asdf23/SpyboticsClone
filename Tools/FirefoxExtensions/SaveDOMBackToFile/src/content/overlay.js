var lastTriggerNode = null;
function init() {
	let cacm = document.getElementById("contentAreaContextMenu");
	try {
		cacm.addEventListener("popupshowing", showHideBasedOnContext, false)
	} catch(e) {
		console.log("Failed to find cacm contentAreaContextMenu, could not attach popupshowing event");
		console.log(e);
	}
	cacm = document.getElementById("copyframeaddress-menupopup");
	try {
		cacm.addEventListener("popupshowing", showHideBasedOnContext, false)
	} catch(e) {
		console.log("Failed to find cacm copyframeaddress-menupopup, could not attach popupshowing event");
		console.log(e);
	}
	/*
	console.log("main contextmenu")
	console.log( document.getElementById("contentAreaContextMenu") );
	try {
		console.log("main contextmenu children...")
		let cm = document.getElementById("contentAreaContextMenu");
		let s = "";
		let ss = "";
		for(let i=0; i<cm.children.length; i++) {
			s += "," + cm.children[i].id;
			if( cm.children[i].id == "frame" ) {
				console.log("found frame id");
				
				
				for(let j=0; j<cm.children[i].children.length; j++) {
					ss += "," + cm.children[i].children[j].id;
				}
				console.log(ss);
			}
		}
		console.log(s);
	} catch(e) {
		console.log("Failed to enumerate children");
		console.log(e);
	}
	*/
	if (document.getElementById("copyframeaddress-menupopup")) {
		let frame = document.getElementById("frame");
		let popup = frame.firstChild;
		while(popup != null && popup.tagName != "menupopup") {
			popup = popup.nextSibling;
		}
		if (popup) {
			const XUL_NS = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";
			let menuseparator = document.createElementNS(XUL_NS, "menuseparator");
			popup.insertBefore(menuseparator, null);
			let node = document.getElementById("copyframeaddress-menupopup").firstChild;
			while(node) {
				let next = node.nextSibling;
				popup.insertBefore(node, null);
				node = next;
			}
			document.getElementById("copyframeaddress-menupopup").parentNode.removeChild(document.getElementById("copyframeaddress-menupopup"));
		}
	}
}
if("undefined" == typeof(SaveBackToFileFromDOM)) {
	var SaveBackToFileFromDOM = {};
}
function showHideBasedOnContext(e) {
	console.log(e);
	console.log(e.target.triggerNode);
	try {
		lastTriggerNode = e.target.triggerNode;
	} catch(e) {
		console.log(e);
	}
	let inFrame = false;
	try {
		inFrame = gContextMenu.inFrame;
	} catch(e) {
		console.log(e);
	}
	let isFile = false;
	try {
		isFile = (e.target.triggerNode.ownerDocument.location.protocol == "file:");
	} catch(e) {
		console.log(e);
	}
	document.getElementById("xuldomsaveback-context-savepage").hidden = (!isFile) || inFrame;
	document.getElementById("copyframeaddress-menuitem").hidden = !isFile;
	return true;
}
SaveBackToFileFromDOM.BrowserOverlay = { //TODO: why is this function in an object in an object?
	sayHello: function(e) {
		//console.log(lastTriggerNode.ownerDocument);
		//let stringDictionary = document.getElementById("xuldomsaveback-string-bundle");
		//let message = stringDictionary.getString("xuldomsaveback.greeting.label");
		//window.alert(message);
		Components.utils.import("resource://gre/modules/FileUtils.jsm");
		Components.utils.import("resource://gre/modules/NetUtil.jsm");
			
		let regFile = /^file:\/\//;
		let isFile = false;
		let file = lastTriggerNode.baseURI;
		try {
			isFile = regFile.test(file);
		} catch(e) {
			console.log(e);
		}
		if(isFile) {
			let regFilePath = /^file:\/\/\/([\s\S]*)$/;
			let regIsWindowsPath = /^file:\/\/\/[a-zA-Z]:/;
			file = decodeURIComponent(file);
			let filePath = regFilePath.exec(file)[1];
			if(regIsWindowsPath.test(file)) {
				filePath = filePath.replace(/\//g,"\\");
			} else {
				filePath = "/" + filePath;
			}
			console.log("filePath: " + filePath);
			let filePointer = new FileUtils.File(filePath);
			//console.log("Looking for file (" + filePath + ") existance: " + filePointer.exists().toString());
			//file = new FileUtils.File("C:\\temp\\delme.txt");
			//console.log("Looking for file (" + "C:\\temp\\delme.txt" + ") existance: " + filePointer.exists("C:\\temp\\delme.txt").toString());
			if( filePointer.exists() ) {
				let serializer = new XMLSerializer();
				let documentAsString = serializer.serializeToString(lastTriggerNode.ownerDocument);
				let textWriter = FileUtils.openSafeFileOutputStream(filePointer);
				let converter = Components.classes["@mozilla.org/intl/scriptableunicodeconverter"].createInstance(Components.interfaces.nsIScriptableUnicodeConverter);
				converter.charset = "UTF-8";
				let textStream = converter.convertToInputStream(documentAsString);
				NetUtil.asyncCopy(textStream, textWriter, function(status) {
					if(!Components.isSuccessCode(status)) {
						window.alert("Could not write to " + filePath);
					}
				});
			}
		}
	}
}
window.addEventListener("load", init, false);