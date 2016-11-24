var util = {
	extend : function(o1,o2){
		for(var i in o2){if(o1[i] == undefined){
			o1[i] = o2[i];
		}}
	}
};
function MoveBox(param){
	util.extend(this,param);

	this.coordinate = this.coordinate || {x:0,y:0}; // 游标坐标
	this.cellSize = this.cellSize || 50; // 棋盘格子尺寸
	this.box = this.box; // 棋盘
	this.cursor = this.cursor; // 游标
	this.direction = this.direction || 0; // 方向：0，1，2，3 对应上，右，下，左
	this.range = this.range || {x:10,y:10};

	this.render();
}

MoveBox.prototype = {
	render: function(){
		var guide	= {0:0,1:90,2:180,3:270}
		var top	= this.coordinate.y*this.cellSize;
		var left	= this.coordinate.x*this.cellSize;
		// var rotate	= guide[this.direction];
		var rotate	= this.direction * 90;

		var cursor = this.cursor.style;
		cursor['top']	= top + 'px' ;
		cursor['left']	= left + 'px';
		cursor['transform'] = 'rotate(' + rotate + 'deg)';
	},
	turnLeft:function(){
		// this.direction = (this.direction+4-1)%4;
		this.direction -= 1;
		this.render();
	},
	turnRight:function(){
		// this.direction = (this.direction+4+1)%4;
		this.direction += 1;
		this.render();
	},
	turnBack:function(){
		// this.direction = (this.direction+4+2)%4;
		this.direction += 2;
		this.render();
	},
	go:function(){
		var direction = this.direction>=0?this.direction % 4:this.direction%4+4;
		var guide = {
			0:['y',-1],
			1:['x',1],
			2:['y',1],
			3:['x',-1],
		};
		guide = guide[direction];
		var coordinate = this.coordinate;
		var expect = coordinate[guide[0]] + guide[1];

		if(this.validateRange(guide[0],expect)){
			coordinate[guide[0]] += guide[1];
		}
		this.render();
	},
	validateRange: function(key,value){
		var max = this.range[key];
		if(value>=max || value < 0){
			return false;
		}else{
			return true;
		}
	},
	cmd: function(str){
		var cmds={
			'G':this.go.bind(this),
			'L':this.turnLeft.bind(this),
			'R':this.turnRight.bind(this),
			'B':this.turnBack.bind(this),
		};
		cmds[str]();
	}
};

var box = document.getElementById('box');
var cursor = document.getElementById('cursor');
var param = {
	box: box,
	cursor: cursor,
	coordinate: {x:2,y:3},
	range:{x:10,y:10}
};

var player = new MoveBox(param);

var input = document.getElementById('cmd');
var btn = document.getElementById('confirm');
var cmd = document.forms.cmd.name;
btn.onclick = function(){
	player.cmd.call(player,cmd.value);
}
