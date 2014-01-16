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
			return ((Point >=0) && (Point < (gameBoardSpacesHigh * gameBoardSpacesWide )));
		}
		,PointAbovePoint: function(Point) {
			Point -= gameBoardSpacesWide;
			if(this.PointIsValid(Point)) {
				return Point;
			} else {
				return null;
			}
		}
		,PointBelowPoint: function(Point) {
			Point += gameBoardSpacesWide;
			if(this.PointIsValid(Point)) {
				return Point;
			} else {
				return null;
			}
		}
		,RowOfPoint: function(Point) {
			return parseInt((Point / gameBoardSpacesWide), 10);
		}
		,ColumnOfPoint: function(Point) {
			return Point % gameBoardSpacesWide;
		}
		,PointLeftToPoint: function(Point) {
			var originalRow = this.RowOfPoint(Point);
			Point -= 1;
			var newRow = this.RowOfPoint(Point);
			if(originalRow == newRow) {
				return Point;
			} else {
				return null;
			}
		}
		,PointRightToPoint: function(Point) {
			var originalRow = this.RowOfPoint(Point);
			Point += 1;
			var newRow = this.RowOfPoint(Point);
			if(originalRow == newRow) {
				return Point;
			} else {
				return null;
			}
		}
		,GetPositionData: function(Point) {
			var rect = gameBoardLayer.getElementsByTagName("rect")[Point];
			var boxes = rect.getClientRects();
			if(boxes.length) {
				return ({
					 x: boxes[0].left
					,y: boxes[0].top
					,width: boxes[0].width
					,height: boxes[0].height
				});
			} else {
				//more expensive
				return ({
					 x: $attr(rect,"x")
					,y: $attr(rect,"y")
					,width: $attr(rect,"width")
					,height: $attr(rect,"height")
				});
			}
		}
	});
	this.createIcon = function(IconIndex, InitalizePositions, RegisterIcon) {
	    var superClass = this.Icons;
		var rectPosition = this.Icons.GetPositionData(InitalizePositions[0]);
		var icon = document.createElement("use");
		icon.setAttribute("href", "#" + Icons[IconIndex].SVGName );
		icon.setAttribute("x", rectPosition.x);
		icon.setAttribute("y", rectPosition.y);

		//Custom Methods/Data
		icon.IconData = Icons[IconIndex];
		icon.Target = null;
		icon.Position = InitalizePositions.clone(); //We will allow the inital state to be contrary to the allowable state in gameplay
		icon.Rects = new Array();
		for(var i=1; i<InitalizePositions.length; i++) {
			var rectPosition = GetPositionData(InitalizePositions[i]);
			var rect = document.createElement("use");
			rect.setAttribute("href", "#" + Icons[icon_occupied].SVGName);
			rect.setAttribute("x", rectPosition.x);
			rect.setAttribute("y", rectPosition.y);
			rect.setAttribute("width", rectPosition.width);
			rect.setAttribute("height", rectPosition.height);
			rect.style.fill = getValueFromStyleSheet("icons", "#" + Icons[IconIndex].SVGName + " " + ".icon", "fill");
			rect.Position = InitalizePositions[i];
			icon.Rects.push(rect);
		}
		//for(var i=0; i<InitalizePositions.length; i++) {
		//	Position.playerMove(InitalizePositions[i]);
		//}
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
		}
		icon.CanMoveUp = function() {
			if( this.CanMove() ) {
				var pointAbove = superClass.PointAbovePoint(this.Position[0]);
				if(pointAbove != null) {
					var pointState = superClass.PointState(pointAbove);
					if( pointState.isVisible && (pointState.occupiedBy == null) ) {
						return true;
					} else {
						return false;
					}
				} else {
					console.log("point Above invalid");
					return false;
				}
			} else {
				console.log("Cannot CanMove()");
				return false;
			}
		}
		icon.CanMoveDown = function() {
			if( this.CanMove() ) {
				var pointBelow = superClass.PointBelowPoint(this.Position[0]);
				if(pointBelow != null) {
					var pointState = superClass.PointState(pointBelow);
					if( pointState.isVisible && (pointState.occupiedBy == null) ) {
						return true;
					} else {
						return false;
					}
				} else {
					return false;
				}
			} else {
				return false;
			}
		}
		icon.CanMoveLeft = function() {
			if( this.CanMove() ) {
				var pointToLeft = superClass.PointLeftToPoint(this.Position[0]);
				if(pointToLeft != null) {
					var pointState = superClass.PointState(pointToLeft);
					if( pointState.isVisible && (pointState.occupiedBy == null) ) {
						return true;
					} else {
						return false;
					}
				} else {
					return false;
				}
			} else {
				return false;
			}
		}
		icon.CanMoveRight = function() {
			if( this.CanMove() ) {
				var pointToRight = superClass.PointRightToPoint(this.Position[0]);
				if(pointToRight != null) {
					var pointState = superClass.PointState(pointToRight);
					if( pointState.isVisible && (pointState.occupiedBy == null) ) {
						return true;
					} else {
						return false;
					}
				} else {
					return false;
				}
			} else {
				return false;
			}
		}
		icon.MoveUp = function() {
			var newPoint = superClass.PointAbovePoint(this.Position[0]);
			if( superClass.PointIsValid(newPoint) ) { //prevent off board moves but not overlapping enemies
				var newPositionData = superClass.GetPositionData(newPoint);
				var newRectPosition = this.Position.playerMove2(newPoint, this.IconData.MaxSize);
				if(newRectPosition == null) {
					//Add rect
					var lastX = this.getAttribute("x");
					var lastY = this.getAttribute("x");
					var lastP = this.Position[this.Position.length - 1];
					var cX,cY, cP;
					icon.setAttribute("x", newPositionData.x);
					icon.setAttribute("y", newPositionData.y);
					for(var i=0; i< this.Rects.length; i++) {
						cX = this.Rects[i].getAttribute("x");
						cY = this.Rects[i].getAttribute("y");
						cP = this.Rects[i].Position;
						this.Rects[i].setAttribute("x", lastX);
						this.Rects[i].setAttribute("y", lastY);
						this.Rects[i].Position = lastP;
						lastX = cX;
						lastY = cY;
						lastP = cP;
					}
					var rect = document.createElement("use");
					rect.setAttribute("href", "#" + Icons[icon_occupied].SVGName);
					rect.setAttribute("x", lastX);
					rect.setAttribute("y", lastY);
					rect.setAttribute("width", newPositionData.width);
					rect.setAttribute("height", newPositionData.height);
					rect.setAttribute("fill", getValueFromStyleSheet("icons", "#" +this.IconData.SVGName + " " + ".icon", "fill"));
					rect.Position = lastP;
					this.Rects.push(rect);
				} else {
					//Move icons
				}
			}
		}
		icon.MoveDown = function() {
			
		}
		icon.MakeMove = function() {
			console.log("calculating best move");
		}
		icon.BeAttacked = function(AttackStrength) {
			var attackedAt = new Array();
			for(var i=0; i<AttackStrength.length; i++) {
				attackedAt.push( this.Position.pop() );
			}
			//TODO: remove rects
			//TODO: remove icon from list if dead
		}
		icon.ShowMoveablePlaces = function() {
			console.log("draw movable squares");
		}
		icon.ShowAttackablePlaces = function() {
			console.log("draw attackable squares");
		}
		icon.ShowCompletedMove = function() {
			console.log("draw complete icon");
		}
		icon.ShowHighlight = function() {
			console.log("draw hightlight animation icon");
		}
		return icon;
	}
}

var iconFactory = new IconsFactory( $elem("layer_gamePieces") , $elem("gameBoard"), true );
var u1 = iconFactory.createIcon(0, [40+16*3]);
console.log("Can move: " + u1.CanMove().toString() );
console.log("Can move up: " + u1.CanMoveUp().toString() );
console.log("Can move down: " + u1.CanMoveDown().toString() );
console.log("Can move left: " + u1.CanMoveLeft().toString() );
console.log("Can move right: " + u1.CanMoveRight().toString() );
console.log(u1.IconData);
console.log(u1.Position);
console.log(u1.Rects);
console.log("---MoveUp()---");
u1.MoveUp();
console.log(u1.Position);
console.log(u1.Rects);
console.log("---MoveUp()---");
u1.MoveUp();
console.log(u1.Position);
console.log(u1.Rects);