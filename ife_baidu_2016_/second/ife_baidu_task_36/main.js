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
	document.body.addEventListener('keyup',function(event){
		console.log('keyup');
		if(document.activeElement.tagName == 'TEXTAREA')return;
		var key = event.key
		if(key == 'ArrowUp' && event.ctrlKey){this.tunTo('t');return;}
		if(key == 'ArrowDown' && event.ctrlKey){this.tunTo('b');return;}
		if(key == 'ArrowLeft' && event.ctrlKey){this.tunTo('l');return;}
		if(key == 'ArrowRight' && event.ctrlKey){this.tunTo('r');return;}
		if(key == 'ArrowUp'){this.tra('t');return;}
		if(key == 'ArrowDown'){this.tra('b');return;}
		if(key == 'ArrowLeft'){this.tra('l');return;}
		if(key == 'ArrowRight'){this.tra('r');return;}
		if(key == ' '){this.builder();return}
	}.bind(this))

}
// movebox 原型
MoveBox.prototype = {
	reset: function(){
		var walls = this.walls;
		for(var i in walls){
			console.log(walls[i]);
			walls[i].cell.style['background-color']='';
		}
		this.walls = {};
	},
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
	tunTo:function(str){
		var guide = {
			't':0,
			'r':1,
			'b':2,
			'l':3
		};
		this.direction = guide[str];
		this.render();
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
		if(arr[0] == 'GO' && arr.length ==2){
			this.go(arr[1]);
			return;
		}else if(arr[0] == 'GO' && arr[1] == 'TO'){
			var strs = arr[2].split(',');
			var goto = {};
			goto.x = Number(strs[0]);
			goto.y = Number(strs[1]);
			this.autoGo(goto);
			return;
		}
		if(arr[0] == 'BUL'){
			this.builder();
			return;
		}
		console.log('arr', arr[0]);
		var handle = cmds[arr[0]][arr[1]].bind(null,arr[2]);
		console.log('handle', handle);
		handle();

	},
	coordinateFix: function(){  // 修复坐标出界
		var v = this.range;
		var c = this.coordinate;
		var flag = false;
		if(c.x>v.x){c.x = v.x;flag = true;}
		if(c.y>v.y){c.y=v.y;flag = true;}
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
		var walls = this.walls;
		var key = this.makeKey(coord);
		console.log('walls', walls);
		var cell = this.target(coord);
		coord.cell = cell;
		walls[key] = coord;
	},
	builder:function(){  // 建墙
		var coord = this.aimer();
		var cell = this.target(coord);
		this.pusher(coord);
		cell.style['background-color'] = '#aaa';
	},
	coordinateChange:function (guide){ // 根据变换规则移动坐标，遇墙停止
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
		var key = this.makeKey(coord);
		return !!this.walls[key];
	},
	autoGo:function(goal){
		if(!goal.x || !goal.y){
			console.log('目标非法');
			return;
		}
		var start = this.coordinate;
		var close = this.walls;
		var range = [{x:0,y:0},this.range];
		var path = getRoad(start,goal,close,range);
		var i = path.length-1;
		setInterval(function(){
			i--;
			if(i>=0){
				this.coordinate.x = path[i].x;
				this.coordinate.y = path[i].y;
				this.render();
			}
		}.bind(this),1000);

	},
	makeKey:function(coord){
		if (!coord) return;
		return coord.x + '-' + coord.y;
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
	parseContent: function(time){
		time = time === 0 ? 0:500;
		if(this.validating)return;
		this.validating = true;
		setTimeout(this.parser.bind(this),time);

	},
	parseCmd: function(cmd){
		var rgx = /(MOV|GO|TRA|BUL|TUN)(\s([LRBT]|TO))?(\s([0-9]+|[0-9]+,[0-9]+))?$/;
		return rgx.test(cmd);
	},
	parser:function(){
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
	},
	exe: function(event){
		event.preventDefault(); // 取消按钮提交
		this.parser(); // 开启验证

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
			if(!step){
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
	range:{x:9,y:9}
};

var player = new MoveBox(param);
// 新建一个指令台
var textarea = document.forms.cmd.cmds; // 指令输入
var exeBtn = document.forms.cmd.exe; // 指令执行
textarea.value = "TRA R 1\nBUL\nTRA R 1\nBUL\nTRA R 1\nBUL\nTUN R\nBUL\nTRA B 1\nBUL\nTRA B 1\nBUL\nTRA B 1\nBUL\nTUN R\nBUL\nTRA L 1\nBUL\nTRA L 1\nBUL\nTRA L 1\nTRA T 1\nBUL\nTRA T 1\nBUL\nTRA T 1\nBUL\nTRA R 3\nTRA B 4\nGO TO 8,9";
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



// ===============================================================================================
function getRoad(start, goal, closeBox, range) {
	console.log('range', range);
	console.log('closeBox', closeBox);
	console.log('goal', goal);
	console.log('start', start);

	var time = new Date;
	var path = [];
	var openBox = [];
	closeBox = deepCopy(closeBox) || {};


	var sortBy = function(a, b) {
		return a.fn - b.fn;
	};

	function openner(node) { // 计算传入坐标节点的下一个节点
		if(node.x == goal.x && node.y == goal.y){
			getPath(node,path);
			return;
		}
		var guide = { // 坐标操作指南
			0: ['y', -1],
			1: ['x', 1],
			2: ['y', 1],
			3: ['x', -1]
		};

		var handleCode = [
			[0],
			[1],
			[2],
			[3],
			// [0, 1],
			// [1, 2],
			// [2, 3],
			// [3, 0]
		]; // 八个方向格子坐标的操作码
		for (var i = 0; i < handleCode.length; i++) { // 遍历操作码生成周围坐标，进行比较

			var arr = handleCode[i]; // 发现 ==》探索
			var coord = generCoord(arr, guide, node); // 根据指令数组生成发现坐标

			if (inClose(coord)) continue; // 如果计算的坐标在closeBox里，则跳过
			if (!inRange(range, coord)) continue; // 如果计算的坐标超出范围，则跳过
			var fn = f(coord, start, goal); // 计算出代价值
			var openItem = {}; // 新建一个点
			openItem.x = coord.x; // 存入坐标
			openItem.y = coord.y; // 存入坐标
			openItem.fn = fn; // 存入代价值
			openItem.pre = node; // 存入回溯点
			openBox.push(openItem); // 将生成点存入open等待查看
		}

		var index = openBox.indexOf(node); // 查找探查点索引，从open中拿掉
		if (index != -1) {
			openBox.splice(index, 1);
		}

		openBox.sort(sortBy); // 该层循环结束，根据代价值排序

		var key = makeKey(node); // 生成探寻点key
		closeBox[key] = node; // 根据key存储已探寻点

		var optimal = openBox[0];
		if (optimal.x == goal.x && optimal.y == goal.y) {
			console.log(optimal);
			console.log(closeBox);
			console.log('运行时间:',new Date() - time)
			getPath(optimal,path);
			return;
		}
		if(!openBox[0]){
			console.log('精尽人亡');
		}
		if (openBox[0]) {
			openner(openBox[0]);
		}
	}

	// ===============================================================================
	function f(n, start, goal) { // 启发函数 代价
		function h(n, goal) { // 任意点到目标点的代价
			var nx = n.x,
				ny = n.y,
				gx = goal.x,
				gy = goal.y;
			var abs = Math.abs;
			var max = Math.max;
			// return abs(nx - gx) + abs(ny - gy);
			return max(abs(nx - gx), abs(ny - gy));
		}

		function g(n, start) { // 初始点到任意点的代价
			var nx = n.x,
				ny = n.y,
				sx = start.x,
				sy = start.y;
			var abs = Math.abs;
			var max = Math.max;
			// return abs(nx - sx) + abs(ny - sy);
			return max(abs(nx - sx), abs(ny - sy));
		}
		var hn = h(n, goal);
		var gn = g(n, start);
		return hn * 1 + gn;
	}

	function makeKey(coord) {
		if (!coord) return;
		return coord.x + '-' + coord.y;
	}

	function generCoord(arr, guide, coord) { // 根据操作数组生成新坐标
		var cd = {};
		cd.x = coord.x;
		cd.y = coord.y;
		for (var i = 0; i < arr.length; i++) {
			var g = guide[arr[i]];
			cd[g[0]] += g[1];
		}
		return cd;
	}

	function inClose(coord) {
		var key = makeKey(coord);
		return !!closeBox[key];
	}

	function inRange(arr, coord) {
		var min = arr[0];
		var max = arr[1];
		if (coord.x < min.x) return false;
		if (coord.y < min.y) return false;
		if (coord.y > max.x) return false;
		if (coord.y > max.y) return false;
		return true;
	}

	function getPath(goal,path) {
		if (goal == null) return;
		path.push(goal);
		getPath(goal.pre,path);
	}
	function deepCopy(source) {
		if(!source)return;
		var result = {};
		for (var key in source) {
			// result[key] = typeof source[key] === 'object' ? deepCopy(source[key]) : source[key];
			result[key] = source[key];
		}
		return result;
	};

	openner(start);
	console.log(path);
	return path;
}
