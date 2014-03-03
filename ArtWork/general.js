//Restart animation
function restartAnimation() {
	var a = document.getElementsByTagName("path");
	for(var i=0; i<a.length; i++) {
		a[i].children[0].beginElement();
	}
}
//Convert frame to string
function renderFrame(frame) {
	var a = document.getElementsByTagName("path");
	for(var i=0; i<a.length; i++) {
		a[i].setAttribute("d", a[i].children[frame].getAttribute("to"));
	}
	while(document.getElementsByTagName("animate").length > 0) {
		document.getElementsByTagName("animate")[0].parentNode.removeChild(document.getElementsByTagName("animate")[0]);
	}
	console.log(document.getElementsByTagName("svg")[0].outerHTML)
}
function stripAnimationSetPathToFrame(frame) {
	if(frame > 0) {
		var a = document.getElementsByTagName("path");
		for(var i=0; i<a.length; i++) {
			a[i].setAttribute("d", a[i].children[frame].getAttribute("to"));
		}
	}
	while( document.getElementsByTagName("animate").length > 0 ) {
		document.getElementsByTagName("animate")[0].parentNode.removeChild(document.getElementsByTagName("animate")[0]);
	}
}
function stopAnimationAtFrame(frame) {
	var a = document.getElementsByTagName("path");
	if(frame == 0) {
		for(var i=0; i<a.length; i++) {
			a[i].children[frame].setAttribute("begin", "indefinate");
		}
	} else {
		for(var i=0; i<a.length; i++) {
			var lastID = "";
			for(var f=0; (f<a[i].children.length) && (f<frame); f++) {
				if(f == 0) {
					a[i].children[f].setAttribute("begin", "0s");
				} else {
					a[i].children[f].setAttribute("begin", lastID + ".end");
				}
				lastID = a[i].children[f].getAttribute("id");
			}
			a[i].children[f].removeAttribute("begin");
		}
	}
}
function removeAllPaths() {
	while( document.getElementsByTagName("path").length > 0 ) {
		var path = document.getElementsByTagName("path")[0];
		path.parentNode.removeChild(path);
	}
}
function $(id) {
	return document.getElementById(id);
}
function resetZOrdering(elementIDArray) {
	elementIDArray = elementIDArray.reverse();
	for(var i=0; i<elementIDArray.length; i++) {
		var elem = $(elementIDArray[i]);
		elem.parentNode.appendChild(elem);
	}
}