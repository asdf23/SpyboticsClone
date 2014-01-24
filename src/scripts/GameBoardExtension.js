function GameBoardExtension(gameBoardLayer) {
	gameBoardLayer.SquareSize = null;
	gameBoardLayer.Scale = null;
	gameBoardLayer.RectData = new Array();
	gameBoardLayer.RowOfPoint = function(Point) {
		return parseInt((Point / window.gameBoardSpacesWide), 10);
	};
	gameBoardLayer.ColumnOfPoint = function(Point) {
		return Point % window.gameBoardSpacesWide;
	};
	gameBoardLayer.PointIsValid = function(Point) {
		if(Point != null) {
			return ((Point >=0) && (Point < (window.gameBoardSpacesHigh * window.gameBoardSpacesWide )));
		} else {
			return false;
		}
	};
	gameBoardLayer.PointAbovePoint = function(Point, Amount) {
		if(Point == null) {
			return null;
		} else {
			Point -= window.gameBoardSpacesWide * Amount;
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
			Point += window.gameBoardSpacesWide * Amount;
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
	gameBoardLayer.ResetSizeForScreen = function(squareSize, windowWidth, screenWidth, screenHeight, padding) {
		this.SquareSize = squareSize;
		var scale = this.SquareSize / 100;
		var scaleString = "scale(" + scale.toString() + "," + scale.toString() + ")";
		console.log("assert next is gameBoardLayer");
		console.log(this);
		var tiles = this.getElementsByTagName("rect");
		for(var i=0; i<tiles.length; i++) {
			var x = windowWidth + padding + ((i % window.gameBoardSpacesWide) * (squareSize + (padding/2)));
			var y = padding + parseInt(i/window.gameBoardSpacesWide, 10) * (squareSize + (padding/2));
			tiles[i].setAttribute("width", squareSize);
			tiles[i].setAttribute("height", squareSize);
			tiles[i].setAttribute("x", x);
			tiles[i].setAttribute("y", y);
			this.RectData.push({
				 actualX: x
				,actualY: y
				,width: squareSize
				,height: squareSize
				,transform: scaleString
				,x: ((screenWidth*(1/scale)) / (screenWidth / x))
				,y: ((screenHeight*(1/scale)) / (screenHeight / y))
			});
		}
	};
	gameBoardLayer.GetSquareData = function(Point) {
		return this.RectData[Point];
	};
	gameBoardLayer.LoadLevel = function(LevelID) {
		window.enemies = new Array();
		window.players = new Array();
		window.utilities = new Array();
		var levelMap = Levels[LevelID];
		var tiles = gameBoardLayer.getElementsByTagName("rect");
		for(var i=0; i<levelMap.length; i++) {
			switch( levelMap.substr(i, 1) ) {
				default:
					console.log(levelMap.substr(i, 1) + " not implemented");
					break;
				case "_":
					tiles[i].setAttribute("display", "none");
					break;
				case "A":
				case "B":
					tiles[i].removeAttribute("display");
					tiles[i].setAttribute("class", "tile" + levelMap.substr(i, 1));
					break;
				case "#":
					var box = tiles[i].getClientRects()[0];
//ici
					var loadIcon = createIcon(icon_load, ({
						 x: box.left
						,y: box.top
						,position: i
					}));
					loadIcon.addEventListener("click", loadProgram, false);
					break;
				case "1":
				case "2":
				case "3":
					var iconIndex = parseInt(levelMap.substr(i, 1), 10);
					var box = tiles[i].getClientRects()[0];
					var icon = createIcon( iconIndex, ({
						 x: box.left
						,y: box.top
						,position: i
					}));
					if( Icons[iconIndex].isEnemy ) {
						window.enemies.push({
							 IconIndex: iconIndex
							,Position: [i]
							,UseElement: icon
						});
					}
					break;
			}
		}
	};
	return gameBoardLayer;
}
/*
var gameBoard = new GameBoardExtension($elem("gameBoard"));
gameBoard.ResetSizeForScreen(squareSize, windowWidth, document.defaultView.innerWidth, document.defaultView.innerHeight, padding);
console.log(gameBoard.RectData[40]);
console.log(gameBoard.Filters);
var iconFactory = new IconsFactory( $elem("layer_gamePieces") , gameBoard, true );
var u1 = iconFactory.createIcon(0, [(16*5)], true);
u1.ChainMoves(["Right","Right", "Right", "Right", "Right", "Right"]);
u1.BeAttacked(2);
u1.ShowMoveablePlaces();
*/