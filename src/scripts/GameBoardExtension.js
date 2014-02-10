/*
		External data used by this class
		has public SquareSize 
		has public Scale
		has public RectData
		creates click (not tap) events
		requires global gameBoardSpacesWide
		requires global gameBoardSpacesHigh
		uses debug_markArrayInMap
		needs array.remove
		uses array.merge
		uses array.intersect
		ResetSizeForScreen is passed squareSize (sets self), windowWidth, screenWidth, screenHeight, padding
		LoadLevel calls iconFactory
*/
function GameBoardExtension(gameBoardLayer) {
	gameBoardLayer.SquareSize = null;
	gameBoardLayer.Scale = null;
	gameBoardLayer.RectData = new Array();
	gameBoardLayer.GameBoardSpacesHigh = 12;
	gameBoardLayer.GameBoardSpacesWide = 16;
	gameBoardLayer.CurrentLevel = null;
	/*
	  ___                     _             _              _    
	 |   \ _ _ __ _ __ _ __ _(_)_ _  __ _  | |   ___  __ _(_)__ 
	 | |) | '_/ _` / _` / _` | | ' \/ _` | | |__/ _ \/ _` | / _|
	 |___/|_| \__,_\__, \__, |_|_||_\__, | |____\___/\__, |_\__|
	               |___/|___/       |___/            |___/      
	*/
	gameBoardLayer.StartX = 0;
	gameBoardLayer.RightEdge = 0;
	
	gameBoardLayer.StartBoardDragging = function() {
		console.log("User indicated the start of a moveable board");
		this.RightEdge = document.defaultView.innerWidth - (this.getBBox().width + window.controlPanelExtension.WindowWidth); //Global variable here
		if(this.RightEdge > 0) {
			console.log("Dragging is not required, screen is too small");
			return;
		} else {
			this.addEventListener("mousedown", this.gameBoardDragStarted, false);
		}
	};
	gameBoardLayer.StopBoardDragging = function() {
		console.log("User indicated the stop of a moveable board");
		this.parentNode.removeEventListener("mousemove", this.gameBoardDragging);
		this.removeEventListener("mousedown", this.gameBoardDragStarted);
		this.parentNode.removeEventListener("mouseup", this.gameBoardDragStopped);
	};
	gameBoardLayer.gameBoardDragStarted = function(event) {
		this.StartX =  event.clientX - this.transform.animVal[0].matrix.e;
		this.parentNode.addEventListener("mousemove", this.gameBoardDragging, false);
		this.parentNode.addEventListener("mouseup", this.gameBoardDragStopped, false);
	};
	gameBoardLayer.gameBoardDragging = function(event) {
		/* perfect drag
		var g = $elem("gameBoard");
		g.transform.baseVal[0].matrix.e = (event.clientX - g.StartX);
		*/
		var g = $elem("gameBoard");
		var t = (event.clientX - g.StartX);
		if(t > 0) {
			t =0;
		} else if( t < g.RightEdge ) {
			t = g.RightEdge;
		}
		g.transform.baseVal[0].matrix.e = t;
	};
	gameBoardLayer.gameBoardDragStopped = function(event) {
		var g = $elem("gameBoard");
		this.removeEventListener("mousemove", g.gameBoardDragging);
		console.log(g.transform.animVal[0].matrix.e);
	};
	/*
	    _____                     _             _              _    
	   / /   \ _ _ __ _ __ _ __ _(_)_ _  __ _  | |   ___  __ _(_)__ 
	  / /| |) | '_/ _` / _` / _` | | ' \/ _` | | |__/ _ \/ _` | / _|
	 /_/ |___/|_| \__,_\__, \__, |_|_||_\__, | |____\___/\__, |_\__|
	                   |___/|___/       |___/            |___/      
	*/
	gameBoardLayer.RowOfPoint = function(Point) {
		return parseInt((Point / this.GameBoardSpacesWide), 10);
	};
	gameBoardLayer.ColumnOfPoint = function(Point) {
		return Point % this.GameBoardSpacesWide;
	};
	gameBoardLayer.PointIsValid = function(Point) {
		if(Point != null) {
			return ((Point >=0) && (Point < (this.GameBoardSpacesHigh * this.GameBoardSpacesWide )));
		} else {
			return false;
		}
	};
	gameBoardLayer.PointAbovePoint = function(Point, Amount) {
		if(Point == null) {
			return null;
		} else {
			Point -= this.GameBoardSpacesWide * Amount;
			if(this.PointIsValid(Point)) {
				return Point;
			} else {
				return null;
			}
		}
	};
	gameBoardLayer.PointBelowPoint = function(Point, Amount) {
		if(Point == null) {
			return null;
		} else {
			Point += this.GameBoardSpacesWide * Amount;
			if(this.PointIsValid(Point)) {
				return Point;
			} else {
				return null;
			}
		}
	};
	gameBoardLayer.PointLeftToPoint = function(Point, Amount) {
		if(Point == null) {
			return null;
		} else {
			var originalRow = this.RowOfPoint(Point);
			Point -= Amount;
			var newRow = this.RowOfPoint(Point);
			if(originalRow == newRow) {
				return Point;
			} else {
				return null;
			}
		}
	};
	gameBoardLayer.PointRightToPoint = function(Point, Amount) {
		if(Point == null) {
			return null;
		} else {
			var originalRow = this.RowOfPoint(Point);
			Point += Amount;
			var newRow = this.RowOfPoint(Point);
			if(originalRow == newRow) {
				return Point;
			} else {
				return null;
			}
		}
	};
	gameBoardLayer.PointUpLeftToPoint = function(Point, AmountX, AmountY) {
		Point = this.PointAbovePoint(Point, AmountY);
		if(Point != null) {
			return this.PointLeftToPoint(Point, AmountX);
		} else {
			return null;
		}
	};
	gameBoardLayer.PointDownLeftToPoint = function(Point, AmountX, AmountY) {
		Point = this.PointBelowPoint(Point, AmountY);
		if(Point != null) {
			return this.PointLeftToPoint(Point, AmountX);
		} else {
			return null;
		}
	};
	gameBoardLayer.PointUpRightToPoint = function(Point, AmountX, AmountY) {
		Point = this.PointAbovePoint(Point, AmountY);
		if(Point != null) {
			return this.PointRightToPoint(Point, AmountX);
		} else {
			return null;
		}
	};
	gameBoardLayer.PointDownRightToPoint = function(Point, AmountX, AmountY) {
		Point = this.PointBelowPoint(Point, AmountY);
		if(Point != null) {
			return this.PointRightToPoint(Point, AmountX);
		} else {
			return null;
		}
	};
	gameBoardLayer.DistanceBetweenPoints = function(Point1, Point2) {
		var d1 = Math.abs(this.ColumnOfPoint(Point1) - this.ColumnOfPoint(Point2));
		var d2 = Math.abs(this.RowOfPoint(Point1) - this.RowOfPoint(Point2));
		return d1 + d2;
	};
	/*
		Filter:
			({
				FilterType:
				FilterSubType:
			})
			
			Visible	true/false
			MoveableEnemyPerspective Self
			MoveablePlayerPerspective Self
			HittableEnemyPerspective
			HittablePlayerPerspective
	*/
	gameBoardLayer.BranchOut = function(PointOrigin, Width, Filter) {
		var results = new Array();
		for(var i=1; i<=Width; i++) {
			var a = this.PointLeftToPoint(PointOrigin, i);
			if((!isNaN(a)) && (a != null) && (results.indexOf(a) == -1)) {
				results.push(a);
			}
			a = this.PointRightToPoint(PointOrigin, i);
			if((!isNaN(a)) && (a != null) && (results.indexOf(a) == -1)) {
				results.push(a);
			}
			a = this.PointAbovePoint(PointOrigin, i);
			if((!isNaN(a)) && (a != null) && (results.indexOf(a) == -1)) {
				results.push(a);
			}
			a = this.PointBelowPoint(PointOrigin, i);
			if((!isNaN(a)) && (a != null) && (results.indexOf(a) == -1)) {
				results.push(a);
			}
			for(var j=0; j<=Width-i; j++) {
				a = this.PointDownLeftToPoint(PointOrigin, i, j);
				if((!isNaN(a)) && (a != null) && (results.indexOf(a) == -1)) {
					results.push(a);
				}
				a = this.PointDownRightToPoint(PointOrigin, i, j);
				if((!isNaN(a)) && (a != null) && (results.indexOf(a) == -1)) {
					results.push(a);
				}
				a = this.PointUpRightToPoint(PointOrigin, j, i);
				if((!isNaN(a)) && (a != null) && (results.indexOf(a) == -1)) {
					results.push(a);
				}
				a = this.PointDownRightToPoint(PointOrigin, j, i);
				if((!isNaN(a)) && (a != null) && (results.indexOf(a) == -1)) {
					results.push(a);
				}
				a = this.PointUpLeftToPoint(PointOrigin, i, j);
				if((!isNaN(a)) && (a != null) && (results.indexOf(a) == -1)) {
					results.push(a);
				}
				a = this.PointUpRightToPoint(PointOrigin, i, j);
				if((!isNaN(a)) && (a != null) && (results.indexOf(a) == -1)) {
					results.push(a);
				}
				a = this.PointUpLeftToPoint(PointOrigin, j, i);
				if((!isNaN(a)) && (a != null) && (results.indexOf(a) == -1)) {
					results.push(a);
				}
				a = this.PointDownLeftToPoint(PointOrigin, j, i);
				if((!isNaN(a)) && (a != null) && (results.indexOf(a) == -1)) {
					results.push(a);
				}
			}
		}
		if(Filter != null) {
			
			if((Filter.FilterSubType === true) || (Filter.FilterType == "MoveableEnemyPerspective") || (Filter.FilterType == "MoveablePlayerPerspective") || (Filter.FilterType == "HittableEnemyPerspective") || (Filter.FilterType == "HittablePlayerPerspective") ) {
				var tiles = this.getElementsByTagName("rect");
				for(var i=0; i<results.length; i++) {
					if( tiles[ results[i] ].hasAttribute("display") ) {
						results.remove( results[i] );
					}
				}
			} else if((Filter.FilterSubType === false)) {
				console.log("warning removeing all hidden tiles may not have the effect you would presume");
				var tiles = this.getElementsByTagName("rect");
				for(var i=0; i<results.length; i++) {
					if( ! tiles[ results[i] ].hasAttribute("display") ) {
						results.remove( results[i] );
					}
				}
			}
			
			if(Filter.FilterType == "MoveableEnemyPerspective") {
				for(var i=0; i<window.enemies.length; i++) {
					if(Filter.FilterSubType != window.enemies[i]) {
						results.remove( window.enemies[i].Position );
					}
				}
				for(var i=0; i<window.players.length; i++) {
					results.remove( window.players[i].Position );
				}
			}
			
			if(Filter.FilterType == "MoveablePlayerPerspective") {
				for(var i=0; i<window.enemies.length; i++) {
					results.remove( window.enemies[i].Position );
				}
				for(var i=0; i<window.players.length; i++) {
					if(Filter.FilterSubType != window.players[i]) {
						results.remove( window.players[i].Position );
					}
				}
			}
			
			if(Filter.FilterType == "NonMoveable") {
				var resultsCopy = results.clone();
				var allOccupied = new Array();
				for(var i=0; i<window.enemies.length; i++) {
					if(Filter.FilterSubType != window.enemies[i]) {
						allOccupied.merge( window.enemies[i].Position );
					}
				}
				for(var i=0; i<window.players.length; i++) {
					if(Filter.FilterSubType != window.players[i]) {
						allOccupied.merge( window.players[i].Position );
					}
				}
				results = allOccupied.intersect(results);
				var tiles = this.getElementsByTagName("rect");
				for(var i=0; i<resultsCopy.length; i++) {
					if( tiles[resultsCopy[i]].hasAttribute("display") ) {
						results.push(resultsCopy[i]);
					}
				}
			}
			
			if(Filter.FilterType == "HittableEnemyPerspective") {
				var allPlayers = new Array();
				for(var i=0; i<window.players.length; i++) {
					allPlayers.merge( window.players[i].Position );
				}
				results = allPlayers.intersect(results);
			}
			
			if(Filter.FilterType == "HittablePlayerPerspective") {
				var allEnemies = new Array();
				for(var i=0; i<window.enemies.length; i++) {
					allEnemies.merge( window.enemies[i].Position );
				}
				results = allEnemies.intersect(results);
			}
		}
		return results;
	};
	gameBoardLayer.PointState = function(Point) {
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
	};
	gameBoardLayer.WhatsHere = function(Point) {
		var tile = this.getElementsByTagName("rect")[Point];
		var results = 0;
		var e = new Array();
		var p = new Array();
		if( tile.hasAttribute("display") ) {
			result += this.Filters["Visible"];
		}
		for(var i=0; i<window.enemies.length; i++) {
			if( window.enemies[i].Position.indexOf(Point) >= 0 ) {
				results += this.Filters["Enemies"];
				e.push(window.enemies[i]);
			}
		}
		for(var i=0; i<window.players.length; i++) {
			if( window.players[i].Position.indexOf(Point) >= 0 ) {
				results += this.Filters["Enemies"];
				p.push(window.players[i]);
			}
		}
		return ({
			 Summary: results
			,Enemies: e
			,Players: p
		});
	};
	gameBoardLayer.ResetSizeForScreen = function(ScreenSize, padding) {
		this.SquareSize = ((ScreenSize.height - (padding*2 + (this.GameBoardSpacesHigh*2)))/ this.GameBoardSpacesHigh);
		window.controlPanelExtension.WindowWidth = (padding + this.SquareSize + padding) + window.fontInfo.GetDimentionsOfString(window.controlPanelExtension.manGeneralInfoDIVMove, "Move: 333 ").width + padding;
		var scale = this.Scale = this.SquareSize / 100;
		var scaleString = "scale(" + scale.toString() + "," + scale.toString() + ")";
		var tiles = this.getElementsByTagName("rect"); //this referrs to <g id=gameBoard
		for(var i=0; i<tiles.length; i++) {
			var x = window.controlPanelExtension.WindowWidth + padding + ((i % this.GameBoardSpacesWide) * (this.SquareSize + (padding/2)));
			var y = padding + parseInt(i/this.GameBoardSpacesWide, 10) * (this.SquareSize + (padding/2));
			tiles[i].setAttribute("width", this.SquareSize);
			tiles[i].setAttribute("height", this.SquareSize);
			tiles[i].setAttribute("x", x);
			tiles[i].setAttribute("y", y);
			this.RectData.push({
				 actualX: x
				,actualY: y
				,width: this.SquareSize
				,height: this.SquareSize
				,transform: scaleString
				,x: ((ScreenSize.width*(1/scale)) / (ScreenSize.width / x))
				,y: ((ScreenSize.height*(1/scale)) / (ScreenSize.height / y))
			});
		}
	};
	gameBoardLayer.GetSquareData = function(Point) {
		return this.RectData[Point];
	};
	gameBoardLayer.GetIconAtPoint = function(Point) {
		var icon = null;
		for(var i=0; (i<window.players.length) && (icon == null); i++) {
			if(window.players[i].Position.indexOf(Point) >= 0) {
				icon = window.players[i];
			}
		}
		for(var i=0; (i<window.enemies.length) && (icon == null); i++) {
			if(window.enemies[i].Position.indexOf(Point) >= 0) {
				icon = window.enemies[i];
			}
		}
		return icon;
	};
	gameBoardLayer.LoadLevel = function(LevelID) {
		this.CurrentLevel = LevelID;
		window.enemies = new Array();
		window.players = new Array();
		window.utilities = new Array();
		var levelMap = Levels[LevelID];
		var tiles = gameBoardLayer.getElementsByTagName("rect");
		for(var i=0; i<levelMap.Map.length; i++) {
			switch( levelMap.Map.substr(i, 1) ) {
				default:
					console.log(levelMap.Map.substr(i, 1) + " not implemented");
					break;
				case "_":
					tiles[i].setAttribute("display", "none");
					break;
				case "A":
				case "B":
					tiles[i].removeAttribute("display");
					tiles[i].setAttribute("class", "tile" + levelMap.Map.substr(i, 1));
					break;
				case "#":
					var loadIcon = window.iconFactory.createIcon(icon_load, [i], true);
					loadIcon.addEventListener("click", function(Point) {
						return function() {
							console.log("Load current icon at Point: " + Point.toString());
							if( window.controlPanelExtension.ProgramStore != null ) {
								console.log("will load: ");
								console.log(window.controlPanelExtension.ProgramStore);
								if( window.controlPanelExtension.ProgramStore.DecreaseInstance() ) {
console.log("calling createIcon B");
									window.iconFactory.createIcon(window.controlPanelExtension.ProgramStore.IconIndex, [Point], true);
								} else {
									console.log("no instances of program left to load");
								}
							} else {
								console.log("will no active program to load");
							}
						};
					}(i), false);
					break;
				case "1":
				case "2":
				case "3":
					var iconIndex = parseInt(levelMap.Map.substr(i, 1), 10);
					window.iconFactory.createIcon(iconIndex, [i], true);
					break;
			}
		}
	};
	return gameBoardLayer;
}
/*
var gameBoard = new GameBoardExtension($elem("gameBoard"));
gameBoard.ResetSizeForScreen(({height; 320, width: 400}), windowWidth, document.defaultView.innerWidth, document.defaultView.innerHeight, padding);
console.log(gameBoard.RectData[40]);
console.log(gameBoard.Filters);
var iconFactory = new IconsFactory( $elem("layer_gamePieces") , gameBoard, true );
var u1 = iconFactory.createIcon(0, [(16*5)], true);
u1.ChainMoves(["Right","Right", "Right", "Right", "Right", "Right"]);

var u2 = iconFactory.createIcon(2, [(16*5)], true);
u2.ChainMoves(["Up","Right", "Right", "Right", "Right", "Right", "Right"]);
u2.AutomateMove()

u1.BeAttacked(2);
u1.ShowMoveablePlaces();
*/