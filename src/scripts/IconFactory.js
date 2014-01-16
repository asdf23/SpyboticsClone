function IconsFactory(gamePieces, gameBoard) {
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
	});
	this.createIcon = function(IconIndex, Positions) {
		var icon = document.createElement("use");
		icon.setAttribute("href", "#" + Icons[IconIndex] )
		icon.IconData = Icons[IconIndex];
		icon.CanMove = function() {
			return ((!this.IconData.isUtility) && (this.IconData.Move > 0))
		}
		icon.CanMoveUp = function() {
			return ((this.CanMove()) && (true));
		}
		icon.CanMoveDown = function() {
			return ((this.CanMove()) && (true));
		}
		icon.CanMoveLeft = function() {
			return ((this.CanMove()) && (true));
		}
		icon.CanMoveRight = function() {
			return ((this.CanMove()) && (true));
		}
		icon.MakeMove = function() {
			console.log("calculating best move");
		}
		icon.BeAttacked = function(AttackStrength) {
			console.log("recalculting self...");
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

var iconFactory = new IconsFactory(1,2);
var u1 = iconFactory.createIcon(0, 50);
console.log(u1.CanMove());
console.log(u1.CanMoveUp());
console.log(u1.IconData);