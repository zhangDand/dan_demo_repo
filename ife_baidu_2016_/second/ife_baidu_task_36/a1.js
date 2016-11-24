var start = {
	x: 1,
	y: 2
};
var goal = {
	x: 50,
	y: 20
};
var closeBox = { // 初始化起点
	'1-1': {
		x: 0,
		y: 1,
		src: null,
	},
	'2-1': {
		x: 0,
		y: 1,
		src: null,
	},
	'2-2': {
		x: 0,
		y: 1,
		src: null,
	},
	'2-3': {
		x: 0,
		y: 1,
		src: null,
	},
	'2-4': {
		x: 0,
		y: 1,
		src: null,
	},
	'1-4': {
		x: 0,
		y: 1,
		src: null,
	}
};
var range = [{
	x: 0,
	y: 0
}, {
	x: 100,
	y: 100
}];
// ================================================================================
function getRoad(start, goal, closeBox, range) {
	var time = new Date;
	var path = [];
	var openBox = [];
	closeBox = deepCopy(closeBox) || {};


	var sortBy = function(a, b) {
		return a.fn - b.fn;
	};

	function openner(node) { // 计算传入坐标节点的下一个节点
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
			[0, 1],
			[1, 2],
			[2, 3],
			[3, 0]
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
			getPath(optimal);
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
		return hn * 2 + gn;
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

	function getPath(goal) {
		if (goal == null) return;
		path.push(goal);
		getPath(goal.pre);
	}
	function deepCopy(source) {
		if(!source)return;
		var result = {};
		for (var key in source) {
			result[key] = typeof source[key] === 'object' ? deepCopy(source[key]) : source[key];
		}
		return result;
	};

	openner(start);
	return path;
}
getRoad = getRoad.bind(null, start, goal, closeBox, range);
