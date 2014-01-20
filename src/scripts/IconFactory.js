Array.prototype.playerMove2 = function(NewPosition, MaxLength) {
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
Array.prototype.actualSize = function() { // Unique lenght
	var o = {}, i, l = this.length, r = [];
	for(i=0; i<l;i+=1) {
		o[this[i]] = this[i];
	}
	for(i in o) {
		r.push(o[i]);
	}
	return r.length;
};
var icon_load = 100;
var icon_selected = 101;
var icon_moved = 102;
var icon_occupied = 103;
var icon_attack_animation = 104;
var icon_hack = 0;
var icon_slingshot = 1;
var icon_sentinel = 2;
var UtilityStartIndex = 100;

function IconsFactory(gamePiecesLayer, gameBoardLayer) {
	this.Icons = ({
		 100: {
			 Name: "Load"
			,SVGName: "icon-load"
			,isEnemy: false
			,isPlayer: false
			,isUtility: true
			,Move: 0
			,MaxSize: 1
			,Attack: null
			,Alternate: null
		}
		,101: {
			 Name: "Selection"
			,SVGName: "icon-selected"
			,isEnemy: false
			,isPlayer: false
			,isUtility: true
			,Move: 0
			,MaxSize: 1
			,Attack: null
			,Alternate: null
		}
		,102: {
			 Name: "Moved"
			,SVGName: "icon-moved"
			,isEnemy: false
			,isPlayer: false
			,isUtility: true
			,Move: 0
			,MaxSize: 1
			,Attack: null
			,Alternate: null
		}
		,103: {
			 Name: "Occupied"
			,SVGName: "icon-occupied"
			,isEnemy: false
			,isPlayer: false
			,isUtility: true
			,Move: 0
			,MaxSize: 1
			,Attack: null
			,Alternate: null
		}
		,104: {
			 Name: "AttackAnimation"
			,SVGName: "icon-attack-animation"
			,isEnemy: false
			,isPlayer: false
			,isUtility: true
			,Move: 0
			,MaxSize: 1
			,Attack: null
			,Alternate: null
		}
		,0: {
			 Name: "Hack"
			,SVGName: "icon-hack"
			,Description: "Basic attack program"
			,isEnemy: false
			,isPlayer: true
			,isUtility: false
			,Move: 2
			,MaxSize: 3
			,Attack: [
						{Name: "Slice", MinSizeForAttack: 1, Attack: 2, AttackSize: 1}
					]
			,Alternate: []
		}
		,1: {
			 Name: "Slingshot"
			,SVGName: "icon-slingshot"
			,Description: "Basic short range attack program"
			,isEnemy: false
			,isPlayer: true
			,isUtility: false
			,Move: 2
			,MaxSize: 2
			,Attack: [
						{Name: "Stone", MinSizeForAttack: 1, Attack: 2, AttackSize: 2}
					]
			,Alternate: []
		}
		,2: {
			 Name: "Sentinel"
			,SVGName: "icon-sentinel"
			,Description: "Basic guard"
			,isEnemy: true
			,isPlayer: false
			,isUtility: false
			,Move: 2
			,MaxSize: 3
			,Attack: [
						{Name: "Cut", MinSizeForAttack: 1, Attack: 1, AttackSize: 1}
					]
			,Alternate: []
			,AI: "AttackInRangeOrMoveToFirstPlayerYX"
		}
		//Static(ish) Properties
		,DelayAttack: 400
		,DelayMove: 200
		//Static(ish) Methods
		,PointState: function(Point) {
			var rect = gameBoardLayer.getElementsByTagName("rect")[Point];
			var foundOccupant = false;
			var occupant = null;
			for(var i=0; (i<window.enemies.length) && (!foundOccupant); i++) {
				foundOccupant = (window.enemies[i].Position.indexOf(Point) >= 0);
				if(foundOccupant) {
					occupant = window.enemies[i];
				}
			}
			for(var i=0; (i<window.players.length) && (!foundOccupant); i++) {
				foundOccupant = (window.players[i].Position.indexOf(Point) >= 0);
				if(foundOccupant) {
					occupant = window.players[i];
				}
			}
			return ({
				 isVisible: !rect.hasAttribute("display")
				,occupiedBy: occupant
			});
		}
		,PointIsValid: function(Point) {
			if(Point != null) {
				return ((Point >=0) && (Point < (gameBoardSpacesHigh * gameBoardSpacesWide )));
			} else {
				return false;
			}
		}
		,PointAbovePoint: function(Point) {
			if(Point == null) {
				return null;
			} else {
				Point -= gameBoardSpacesWide;
				if(this.PointIsValid(Point)) {
					return Point;
				} else {
					return null;
				}
			}
		}
		,PointBelowPoint: function(Point) {
			if(Point == null) {
				return null;
			} else {
				Point += gameBoardSpacesWide;
				if(this.PointIsValid(Point)) {
					return Point;
				} else {
					return null;
				}
			}
		}
		,RowOfPoint: function(Point) {
			return parseInt((Point / gameBoardSpacesWide), 10);
		}
		,ColumnOfPoint: function(Point) {
			return Point % gameBoardSpacesWide;
		}
		,PointLeftToPoint: function(Point) {
			if(Point == null) {
				return null;
			} else {
				var originalRow = this.RowOfPoint(Point);
				Point -= 1;
				var newRow = this.RowOfPoint(Point);
				if(originalRow == newRow) {
					return Point;
				} else {
					return null;
				}
			}
		}
		,PointRightToPoint: function(Point) {
			if(Point == null) {
				return null;
			} else {
				var originalRow = this.RowOfPoint(Point);
				Point += 1;
				var newRow = this.RowOfPoint(Point);
				if(originalRow == newRow) {
					return Point;
				} else {
					return null;
				}
			}
		}
		,PointUpLeftToPoint: function(Point) {
			Point = this.PointAbovePoint(Point);
			if(Point != null) {
				return this.PointLeftToPoint(Point);
			} else {
				return null;
			}
		}
		,PointDownLeftToPoint: function(Point) {
			Point = this.PointBelowPoint(Point);
			if(Point != null) {
				return this.PointLeftToPoint(Point);
			} else {
				return null;
			}
		}
		,PointUpRightToPoint: function(Point) {
			Point = this.PointAbovePoint(Point);
			if(Point != null) {
				return this.PointRightToPoint(Point);
			} else {
				return null;
			}
		}
		,PointDownRightToPoint: function(Point) {
			Point = this.PointBelowPoint(Point);
			if(Point != null) {
				return this.PointRightToPoint(Point);
			} else {
				return null;
			}
		}
		,GetPositionData: function(Point) {
			var rect = gameBoardLayer.getElementsByTagName("rect")[Point];
			var boxes = rect.getClientRects();
			var box = null;
			if(boxes.length) {
				box = ({
					 x: boxes[0].left
					,y: boxes[0].top
					,actualX: boxes[0].left
					,actualY: boxes[0].top
					,width: boxes[0].width
					,height: boxes[0].height
					,transform: null
				});
			} else {
				//more expensive
				box = ({
					 x: parseFloat(rect.getAttribute("x"))
					,y: parseFloat(rect.getAttribute("y"))
					,actualX: parseFloat(rect.getAttribute("x"))
					,actualY: parseFloat(rect.getAttribute("y"))
					,width: parseFloat(rect.getAttribute("width"))
					,height: parseFloat(rect.getAttribute("height"))
					,transform: null
				});
			}
			var scale = squareSize / 100;
			box.x = ((document.defaultView.innerWidth*(1/scale)) / (document.defaultView.innerWidth / box.x));
			box.y = ((document.defaultView.innerHeight*(1/scale)) / (document.defaultView.innerHeight / box.y));
			box.transform = "scale(" + scale.toString() + "," + scale.toString() + ")";
			return box;
		}
	});
	this.createIcon = function(IconIndex, InitalizePositions, RegisterIcon) {
		var superClass = this.Icons;
		var rectPosition = this.Icons.GetPositionData(InitalizePositions[0]);
		var icon = document.createElementNS(svgNS, "use");
		icon.setAttributeNS(xlinkNS, "href", "#" + this.Icons[IconIndex].SVGName );
		icon.setAttribute("x", rectPosition.x);
		icon.setAttribute("y", rectPosition.y);
		icon.setAttribute("transform", rectPosition.transform);
		gamePiecesLayer.appendChild(icon);
		//Custom Methods/Data
		icon.IconData = this.Icons[IconIndex];
		icon.Target = null;
		icon.Position = InitalizePositions.clone(); //We will allow the inital state to be contrary to the allowable state in gameplay
		icon.Rects = new Array();
		icon.Selected = null;
		icon.CompletedMove = null;
		for(var i=1; i<InitalizePositions.length; i++) {
			var rectPosition = GetPositionData(InitalizePositions[i]);
			var rect = document.createElementNS(svgNS, "use");
			rect.setAttributeNS(xlinkNS, "href", "#" + this.Icons[icon_occupied].SVGName);
			rect.setAttribute("x", rectPosition.x);
			rect.setAttribute("y", rectPosition.y);
			rect.setAttribute("transform", rectPosition.transform);
			rect.setAttribute("width", rectPosition.width);
			rect.setAttribute("height", rectPosition.height);
			rect.style.fill = getValueFromStyleSheet("icons", "#" + this.Icons[IconIndex].SVGName + " " + ".icon", "fill");
			rect.Position = InitalizePositions[i];
			gamePiecesLayer.appendChild(icon);
			icon.Rects.push(rect);
		}
		//Allow for object to be tracked by others
		if( RegisterIcon ) {
			if( icon.IconData.isEnemy ) {
				window.enemies.push(icon);
			} else if( icon.IconData.isPlayer ) {
				window.players.push(icon);
			}
		}
		//Methods
		icon.CanMove = function() {
			return ((!this.IconData.isUtility) && (this.IconData.Move > 0))
		};
		icon.CanMoveDirection = function(direction) {
			if( this.CanMove() ) {
				var newPoint = null;
				switch(direction) {
					case "Up":
						newPoint = superClass.PointAbovePoint(this.Position[0]);
						break;
					case "Down":
						newPoint = superClass.PointBelowPoint(this.Position[0]);
						break;
					case "Left":
						newPoint = superClass.PointLeftToPoint(this.Position[0]);
						break;
					case "Right":
						newPoint = superClass.PointRightToPoint(this.Position[0]);
						break;
					default:
						console.log("invalid direction: " + direction.toString());
				}
				if(newPoint != null) {
					var pointState = superClass.PointState(newPoint);
					if( pointState.isVisible && (pointState.occupiedBy == null) ) {
						return true;
					} else {
						return false;
					}
				} else {
					console.log("point " + direction + " invalid");
					return false;
				}
			} else {
				console.log("Cannot CanMove()");
				return false;
			}
		};
		icon.CanMoveUp = function() {
			return this.CanMoveDirection("Up");
		};
		icon.CanMoveDown = function() {
			return this.CanMoveDirection("Down");
		};
		icon.CanMoveLeft = function() {
			return this.CanMoveDirection("Left");
		};
		icon.CanMoveRight = function() {
			return this.CanMoveDirection("Right");
		};
		icon.MoveOne = function(direction) {
			var newPoint;
			switch(direction) {
				case "Up":
					newPoint = superClass.PointAbovePoint(this.Position[0]);
					break;
				case "Down":
					newPoint = superClass.PointBelowPoint(this.Position[0]);
					break;
				case "Left":
					newPoint = superClass.PointLeftToPoint(this.Position[0]);
					break;
				case "Right":
					newPoint = superClass.PointRightToPoint(this.Position[0]);
					break;
				default:
					console.log("invalid direction: " + direction.toString());
			}
			if( superClass.PointIsValid(newPoint) ) { //prevent off board moves but not overlapping enemies
				var newPositionData = superClass.GetPositionData(newPoint);
				var removeRectPosition = this.Position.playerMove2(newPoint, this.IconData.MaxSize);
				icon.setAttribute("x", newPositionData.x);
				icon.setAttribute("y", newPositionData.y);
				for(var i=1; i<this.Position.length; i++) {
					var positionData = superClass.GetPositionData(this.Position[i])
					if( this.Rects.length >= i ) {
						if(this.Rects[i-1].Position != this.Position[i]) {
							this.Rects[i-1].Position = this.Position[i];
							this.Rects[i-1].setAttribute("x", positionData.x);
							this.Rects[i-1].setAttribute("y", positionData.y);
						}
					} else {
						var rect = document.createElementNS(svgNS, "use");
						rect.setAttributeNS(xlinkNS, "href", "#" + superClass[icon_occupied].SVGName);
						rect.setAttribute("x", positionData.x);
						rect.setAttribute("y", positionData.y);
						rect.setAttribute("transform", positionData.transform);
						rect.setAttribute("width", positionData.width);
						rect.setAttribute("height", positionData.height);
						rect.setAttribute("fill", getValueFromStyleSheet("icons", "#" +this.IconData.SVGName + " " + ".icon", "fill"));
						rect.Position = this.Position[i];
						gamePiecesLayer.appendChild(rect);
						this.Rects.push(rect);
					}
				}
				while(this.Rects.length >= this.IconData.MaxSize) {
					var rect = this.Rects.pop();
					rect.parentNode.removeChild(rect);
				}
				gamePiecesLayer.appendChild(this);
			} else {
				console.log("invalid move - cannot move " + direction);
			}
		};
		icon.MakeMoves = function(moveList) {
			var timingDelay = 0;
			for(var i=0; i<moveList.length; i++) {
				setTimeout(function(a, b) {
					a.MoveOne(b);
				}, superClass.DelayMove + timingDelay
				, this, moveList[i]);
				timingDelay += superClass.DelayMove;
			}
		};
		icon.MoveUp = function() {
			//this.MoveOne("Up");
			setTimeout(function(a) {
				a.MoveOne("Up");
			}, superClass.DelayMove, this);
		};
		icon.MoveDown = function() {
			//this.MoveOne("Down");
			setTimeout(function(a) {
				a.MoveOne("Down");
			}, superClass.DelayMove, this);
		};
		icon.MoveLeft = function() {
			//this.MoveOne("Left");
			setTimeout(function(a) {
				a.MoveOne("Left");
			}, superClass.DelayMove, this);
		};
		icon.MoveRight = function() {
			//this.MoveOne("Right");
			setTimeout(function(a) {
				a.MoveOne("Right");
			}, superClass.DelayMove, this);
		};
		icon.MakeMove = function() {
			console.log("calculating best move");
		};
		icon.BeAttacked = function(AttackStrength) {
			var iconIsErased = false;
			var timingDelay = 0;
			for(var i=0; ((i<AttackStrength) && (this.Position.length > 0) && (!iconIsErased)); i++) {
				var attackPoint = this.Position.pop();
				var attackPositionData = superClass.GetPositionData(attackPoint);
				var nodeToDestroy = null;
				if(this.Rects.length > 0) {
					nodeToDestroy = this.Rects.pop();
				} else {
					iconIsErased = true;
					nodeToDestroy = this;
				}
				setTimeout(function(a, b, icon) {
					var scale = squareSize/100;
					var g = document.createElementNS(svgNS, "g");
					g.setAttribute("transform", "translate(" + a.actualX.toString() + "," + a.actualY.toString() + ")" );
					var use = document.createElementNS(svgNS, "use");
					use.setAttribute("transform", "scale(" + scale.toString() + "," + scale.toString() + ")");
					use.setAttributeNS(xlinkNS, "href", "#" + superClass[icon_attack_animation].SVGName);
					var animatableObjects = new Array();
					var s = new Array();
					s.push( icon.getElementsByTagName("set") );
					s.push( icon.getElementsByTagName("animateMotion") );
					s.push( icon.getElementsByTagName("animate") );
					s.push( icon.getElementsByTagName("animateTransform") );
					for(var i=0;i<s.length; i++) {
						for(var j=0; j<s[i].length; j++) {
							var c = s[i][j].cloneNode();
							use.appendChild(c);
							animatableObjects.push(c);
						}
					}
					animatableObjects[0].addEventListener("end", function() {
						g.parentNode.removeChild(g);
						b.parentNode.removeChild(b);
					}, false);
					g.appendChild(use);
					gamePiecesLayer.appendChild(g);
					for(var i=0; i<animatableObjects.length; i++) {
						animatableObjects[i].beginElement();
					}
				}, superClass.DelayAttack + timingDelay
				, attackPositionData, nodeToDestroy, document.getElementById(superClass[icon_attack_animation].SVGName));
				timingDelay += superClass.DelayAttack;
			}
		};
		icon.ShowMoveablePlaces = function() {
			console.log("requires game board functionality");
		};
		icon.ShowAttackablePlaces = function() {
			console.log("requires game board functionality");
		};
		icon.ClearCompletedMove = function() {
			if(this.CompletedMove != null) {
				this.CompletedMove.parentNode.removeChild(this.CompletedMove);
			}
		};
		icon.ShowCompletedMove = function() {
			if(this.CompletedMove == null) {
				this.CompletedMove = document.createElementNS(svgNS, "use");
				this.CompletedMove.setAttribute("x", this.getAttribute("x"));
				this.CompletedMove.setAttribute("y", this.getAttribute("y"));
				this.CompletedMove.setAttribute("transform", this.getAttribute("transform"));
				this.CompletedMove.setAttributeNS(xlinkNS, "href", "#" + superClass[icon_moved].SVGName);
				gamePiecesLayer.appendChild(this.CompletedMove);
			}
		};
		icon.ShowSelected = function() {
			if(this.Selected == null) {
				this.Selected = document.createElementNS(svgNS, "use");
				this.Selected.setAttribute("x", this.getAttribute("x"));
				this.Selected.setAttribute("y", this.getAttribute("y"));
				this.Selected.setAttribute("transform", this.getAttribute("transform"));
				this.Selected.setAttributeNS(xlinkNS, "href", "#" + superClass[icon_selected].SVGName);
				gamePiecesLayer.appendChild(this.Selected);
			}
		};
		icon.ClearSelected = function() {
			if(this.Selected != null) {
				this.Selected.parentNode.removeChild(this.Selected);
			}
		};
		return icon;
	}
}
/*
var iconFactory = new IconsFactory( $elem("layer_gamePieces") , $elem("gameBoard"), true );
var u1 = iconFactory.createIcon(0, [40+16*3], true);
u1.BeAttacked(1)
// Up
console.clear();
console.log("Can move: " + u1.CanMove().toString() + " up: " + u1.CanMoveUp().toString() + " down: " + u1.CanMoveDown().toString() + " left: " + u1.CanMoveLeft().toString() + " right: " + u1.CanMoveRight().toString() );
console.log("Position:");
console.log(u1.Position);
console.log("Rects:");
console.log(u1.Rects);
u1.MoveUp();
// Down
console.clear();
console.log("Can move: " + u1.CanMove().toString() + " up: " + u1.CanMoveUp().toString() + " down: " + u1.CanMoveDown().toString() + " left: " + u1.CanMoveLeft().toString() + " right: " + u1.CanMoveRight().toString() );
console.log("Position:");
console.log(u1.Position);
console.log("Rects:");
console.log(u1.Rects);
u1.MoveDown();
//Left
console.clear();
console.log("Can move: " + u1.CanMove().toString() + " up: " + u1.CanMoveUp().toString() + " down: " + u1.CanMoveDown().toString() + " left: " + u1.CanMoveLeft().toString() + " right: " + u1.CanMoveRight().toString() );
console.log("Position:");
console.log(u1.Position);
console.log("Rects:");
console.log(u1.Rects);
u1.MoveLeft();
//Right
console.clear();
console.log("Can move: " + u1.CanMove().toString() + " up: " + u1.CanMoveUp().toString() + " down: " + u1.CanMoveDown().toString() + " left: " + u1.CanMoveLeft().toString() + " right: " + u1.CanMoveRight().toString() );
console.log("Position:");
console.log(u1.Position);
console.log("Rects:");
console.log(u1.Rects);
u1.MoveRight();
*/