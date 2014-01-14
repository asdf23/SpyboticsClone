var icon_load = 100;
var icon_selected = 101;
var icon_moved = 102;
var icon_occupied = 103;
var icon_attack_animation = 104;
var icon_hack = 0;
var icon_slingshot = 1;
var icon_sentinel = 2;
var UtilityStartIndex = 100;

var Icons = ({
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
});

//TODO: This function does not belong here, sorted data is defined elsewhere
function sortPrograms(a,b) { 
	return b.Program - a.Program;
}