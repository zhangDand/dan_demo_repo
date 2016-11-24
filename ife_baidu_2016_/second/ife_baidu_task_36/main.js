var util = {
	extend : function(o1,o2){
		for(var i in o2){if(o1[i] == undefined){
			o1[i] = o2[i];
		}}
	},
	searchDeep: function (node,list){
		if(node.className == 'col'){
			list.push(node);
		}
		if(node == null)return;
		for (var i = 0; i < node.children.length; i++) {
			util.searchDeep(node.children[i],list);
		}
	}
};

// movebox 构造函数
function MoveBox(param){
	util.extend(this,param);

	this.coordinate = this.coordinate || {x:0,y:0}; // 游标坐标
	this.cellSize = this.cellSize || 50; // 棋盘格子尺寸
	this.table = this.table; // 棋盘
	this.cursor = this.cursor; // 游标
	this.direction = this.direction || 0; // 方向：0，1，2，3 对应上，右，下，左
	this.range = this.range || {x:10,y:10};
	this.cells = [];
	this.walls ={};

	this.render();
	this.initCells(this.table,this.cells);
	console.log('rows', this.cells);

}
// movebox 原型
MoveBox.prototype = {
	render: function(){
		var top	= this.coordinate.y*this.cellSize;
		var left	= this.coordinate.x*this.cellSize;
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
	tra:function(str,num){  // 移动函数
		num = num || 1;  // 移动步数
		var guide = {   // 坐标变换规则
			'l':['x',-1],
			'r':['x',1],
			't':['y',-1],
			'b':['y',1]
		};
		guide = guide[str];  // 当前变换规则
		this.coordinateChange(guide);
		// var coordinate = this.coordinate;
		// coordinate[guide[0]] += guide[1]; // 坐标变换
		var fixer = this.coordinateFix();
		if(fixer)return;
		this.render();
		var i = 0;
		var timer = setInterval(function(){
			i++;
			if(i<num){
				this.tra(str);
			}else{
				clearInterval(timer);
			}
		}.bind(this),1000);
	},
	mov:function(str,num){  // 转弯带移动
		var guide = {
			't':0,
			'r':1,
			'b':2,
			'l':3
		};
		if(this.direction == guide[str]){
			this.tra(str,num);
		}else{
			this.direction = guide[str];
			this.render();
			setTimeout(this.tra.bind(this,str,num),1000);
		}

	},
	go:function(num){  // 向前走
		num = num || 1;
		var direction = this.direction>=0?this.direction % 4:this.direction%4+4;
		var guide = {
			0:['y',-1],
			1:['x',1],
			2:['y',1],
			3:['x',-1],
		};
		guide = guide[direction];
		// var coordinate = this.coordinate;
		// coordinate[guide[0]] += guide[1];
		this.coordinateChange(guide);
		this.coordinateFix();
		this.render();
		var i = 0;
		var timer = setInterval(function(){
			i++;
			if(i<num){
				this.go();
			}else{
				clearInterval(timer);
			}
		}.bind(this),1000);
	},
	cmd: function(arr){  // 解析命令数组

		var tun={
			'G':this.go.bind(this),
			'L':this.turnLeft.bind(this),
			'R':this.turnRight.bind(this),
			'B':this.turnBack.bind(this),
		};
		var tra = {
			'L':this.tra.bind(this,'l'),
			'R':this.tra.bind(this,'r'),
			'T':this.tra.bind(this,'t'),
			'B':this.tra.bind(this,'b'),
		};
		var mov = {
			'L':this.mov.bind(this,'l'),
			'R':this.mov.bind(this,'r'),
			'T':this.mov.bind(this,'t'),
			'B':this.mov.bind(this,'b'),
		};


		var cmds = {
			'TUN':tun,
			'TRA':tra,
			'MOV':mov,
		};
		if(arr[0] == 'GO'){
			this.go(arr[1]);
			return;
		}
		console.log('arr', arr[0]);
		var handle = cmds[arr[0]][arr[1]].bind(null,arr[2]);
		handle();

	},
	coordinateFix: function(){  // 修复坐标出界
		var v = this.range;
		var c = this.coordinate;
		var flag = false;
		if(c.x>=v.x){c.x = v.x-1;flag = true;}
		if(c.y>=v.y){c.y=v.y-1;flag = true;}
		if(c.x < 0 ){	c.x = 0;flag = true;}
		if(c.y < 0){c.y=0;flag = true;}
		return flag;
	},
	initCells: function (node,list){  // 创建所有格子的索引
		if(node.className == 'col'){
			list.push(node);
		}
		if(node == null)return;
		for (var i = 0; i < node.children.length; i++) {
			util.searchDeep(node.children[i],list);
		}
	},
	aimer:function(){  // 瞄准器，输出格子目标的坐标
		var aim = {};
		var coordinate = this.coordinate;
		var direction = this.direction;
		var guide = {
			0:['y',-1],
			1:['x',1],
			2:['y',1],
			3:['x',-1],
		};
		guide = guide[direction];
		aim.x = coordinate.x;
		aim.y = coordinate.y;
		aim[guide[0]] += guide[1];
		return aim;
	},
	target:function(coord){  // 根据坐标输出格子dom对象
		var index = coord.y*10 + coord.x;
		return this.cells[index];
	},
	pusher:function(coord){  // 把坐标和dom放入walls
		var row = coord.y;
		var col = coord.x;
		var walls = this.walls;
		console.log('walls', walls);
		var cell = this.target(coord);
		walls[row] = walls[row] || {};
		walls[row][col] = walls[row][col] || {};
		walls[row][col].coord = coord;
		walls[row][col].cell = cell;
	},
	builder:function(){  // 建墙
		var coord = this.aimer();
		var cell = this.target(coord);
		this.pusher(coord);
		cell.style['background-color'] = '#aaa';
	},
	coordinateChange:function (guide){
		var coordinate = this.coordinate;
		var pre = {}; // 存储当前坐标
		pre.x = coordinate.x;
		pre.y = coordinate.y;
		coordinate[guide[0]] += guide[1];
		console.log('this.didWall(coordinate)', this.didWall(coordinate));
		if(this.didWall(coordinate)){
			console.log('CONDITION PASSED');
			this.coordinate = pre;
		}

	},
	didWall:function (coord){  // 判断坐标是否有墙，有的话就为true;
		var x = coord.x;
		var y = coord.y;
		var walls = this.walls;

		var row = walls[y];
		if(row){
			return !!row[x];
		}else{
			return !!row;
		}
	}

};

// 命令行 构造函数
function Commander(param){
	util.extend(this,param);

	this.moveBox = this.moveBox;
	this.exeBtn = this.exeBtn;
	this.textarea = this.textarea;
	this.errorLines = [];
	this.cmds = [];
	this.validating = false;

	// 初始化事件
	this.textarea.addEventListener('keyup',this.parseContent.bind(this));
	this.exeBtn.addEventListener('click',this.exe.bind(this));
}
// 命令行原型
Commander.prototype = {
	parseContent: function(event){
		if(this.validating)return;
		this.validating = true;
		setTimeout(function(){
			this.validating = false;
			var text = this.textarea.value.trim();

			var lines = text.split('\n');
			this.cmds = lines;
			console.log('lines', lines);
			this.errorLines = [];
			for (var i = 0; i < lines.length; i++) {
				var line = lines[i];
				if(!this.parseCmd(line)){
					console.log('非法格式:',i);
					this.errorLines.push(i);
				}
			}
			console.log(this.errorLines);
		}.bind(this),1000);

		// var text = this.textarea.value.trim();
		//
		// var lines = text.split('\n');
		// this.cmds = lines;
		// console.log('lines', lines);
		// this.errorLines = [];
		// for (var i = 0; i < lines.length; i++) {
		// 	var line = lines[i];
		// 	if(!this.parseCmd(line)){
		// 		console.log('非法格式:',i);
		// 		this.errorLines.push(i);
		// 	}
		// }
		// console.log(this.errorLines);
	},
	parseCmd: function(cmd){
		var rgx = /(MOV|GO|TRA)(\s[LRBT])?(\s[0-9]+)?$/;
		return rgx.test(cmd);
	},
	exe: function(event){
		event.preventDefault(); // 取消按钮提交
		this.parseContent(); // 开启验证

		if(this.errorLines.length !== 0){  // 判断是否有非法命令
			console.log('cmd error:',this.errorLines);
			return;
		}
		var cmds = this.cmds;  // 命令行
		var timeKeeper = 0;  // 每条命令的延时
		for (var i = 0; i < cmds.length; i++) { // 遍历命令并执行
			var cmd = cmds[i].split(' ');
			console.log('cmd', cmd);
			var step = Number(cmd.slice(-1)[0]);
			console.log('step', typeof step);
			if(typeof step !== 'number'){
				step = 1;
			}
			if(cmd[0] == 'MOV'){
				step +=1;
			}
			setTimeout(this.moveBox.cmd.bind(this.moveBox,cmd),timeKeeper*1000);

			timeKeeper += step;
			console.log('timeKeeper', timeKeeper);
		}
	}

};
// adapter

// 新建一个移动方块
var table = document.getElementById('table');
var cursor = document.getElementById('cursor');
var param = {
	table: table,
	cursor: cursor,
	coordinate: {x:2,y:3},
	range:{x:10,y:10}
};

var player = new MoveBox(param);
// 新建一个指令台
var textarea = document.forms.cmd.cmds; // 指令输入
var exeBtn = document.forms.cmd.exe; // 指令执行

var commander = new Commander({
	textarea:textarea,
	moveBox:player,
	exeBtn:exeBtn
});


var input = document.getElementById('cmd');
var btn = document.getElementById('confirm');
var cmd = document.forms.cmd.name;
btn.onclick = function(event){
	event.preventDefault();
	var arr = ['TUN',cmd.value];
	player.cmd.call(player,arr);
};
