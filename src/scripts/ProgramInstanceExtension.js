function ProgramInstanceExtension(IconIndex, Count) {
	var div = document.createElementNS(xhtmlNS, "div");
	var spanLeft = document.createElementNS(xhtmlNS, "span");
	var spanRight = document.createElementNS(xhtmlNS, "span");
	div.setAttribute("class", "scrollableWindowContent");
	div.IconIndex = IconIndex;
	div.IconData = window.iconFactory.Icons[ IconIndex ];
	div.IconCount = Count;
	//div.innerHTML = div.IconData.Name + " x" + div.IconCount.toString();
	spanLeft.style.cssFloat = "left";
	spanRight.style.cssFloat = "right";
	spanRight.style.paddingRight = "2px";
	spanLeft.innerHTML = div.IconData.Name;
	spanRight.innerHTML = "x" + div.IconCount.toString();
	div.appendChild(spanLeft);
	div.appendChild(spanRight);
	div.addEventListener("click", function(d){ 
											return function() {
												console.log(d.IconData.Name + " x" + d.IconCount.toString());
												window.controlPanelExtension.ManProgram(d.IconData, d);
											}
										}(div), false);
	div.DecreaseInstance = function() {
		if(this.IconCount > 0) {
			this.IconCount --;
			//this.innerHTML = this.IconData.Name + " x" + this.IconCount.toString();
			this.children[1].innerHTML = "x" + this.IconCount.toString();
			return true;
		} else {
			return false;
		}
	}
	div.IncreaseInstance = function() {
		this.IconCount ++;
		this.children[1].innerHTML = "x" + this.IconCount.toString();
	}
	return div;
}