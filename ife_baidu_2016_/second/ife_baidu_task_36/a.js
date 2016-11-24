var start = {
	x: 1,
	y: 2
};
var goal = {
	x: 5,
	y: 2
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
	},
	// '6-6': {
	//     x: 0,
	//     y: 1,
	//     src: null,
	// },
	// '7-7': {
	//     x: 0,
	//     y: 1,
	//     src: null,
	// },
	// '8-8': {
	//     x: 0,
	//     y: 1,
	//     src: null,
	// },
};

var getRoad = (function(closeBox) {
	var initCloseBox = false;
	closeBox = closeBox || {};
	var path = [];

	function getPath(goal) {
		if (goal == null) return;
		path.push(goal);
		getPath(goal.src);
	}

	function h(n, goal) {
		var nx = n.x,
			ny = n.y,
			gx = goal.x,
			gy = goal.y;
		var abs = Math.abs;
		return abs(nx - gx) + abs(ny - gy);
	}

	function g(n, start) {
		var nx = n.x,
			ny = n.y,
			sx = start.x,
			sy = start.y;
		var abs = Math.abs;
		return abs(nx - sx) + abs(ny - sy);
	}

	function f(n, start, goal) {
		var hn = h(n, goal);
		var gn = g(n, start);
		return hn + gn;
	}

	function openner(node) { // 计算传入坐标节点的下一个节点
		if (!initCloseBox) {
			closer(node, null);
			initCloseBox = true;
			console.log(closeBox);
		}
		var guide = { // 坐标操作指南
			0: ['y', -1],
			1: ['x', 1],
			2: ['y', 1],
			3: ['x', -1]
		};
		var optimalFn = null; // 存储当前最优代价评估
		var optimalCoord = null; // 存储当前最优坐标
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

			var arr = handleCode[i]; // 生成周围坐标
			var coord = generCoord(arr, guide, node);

			if (inClose(coord)) continue; // 如果计算的坐标在closeBox 里跳过
			var fn = f(coord, start, goal);

			if (!optimalFn) { // 挑出其中代价最小的
				optimalCoord = coord;
				optimalFn = fn;
			} else {
				if (fn < optimalFn) {
					optimalFn = fn;
					optimalCoord = coord;
				}
			}

		}
		closer(optimalCoord, node); // 将遍历过的节点存入closeBox,
		return optimalCoord;
	}

	function closer(current, src) { // 存入openner计算后的节点
		var x = current.x;
		var y = current.y;
		var boxer = {};
		boxer.x = x;
		boxer.y = y;
		boxer.src = closeBox[makeKey(src)] || null;
		var key = makeKey(current);
		closeBox[key] = boxer;
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

	return function findRoad(current, start, goal) {
		if (goal.x == current.x && goal.y == current.y) {
			var last = closeBox[makeKey(goal)];
			getPath(last);
			console.log(path);
			return path;
		}
		current = openner(current);
		findRoad(current, start, goal);
	};
})(closeBox);
// ===================================================================================================
function findRoad(start, goal, closeBox) {

	var initCloseBox = false;
	closeBox = closeBox || {};
	var path = [];

	function getPath(goal) {
		if (goal == null) return;
		path.push(goal);
		getPath(goal.src);
	}

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

	function f(n, start, goal) { // 启发函数 代价
		var hn = h(n, goal);
		var gn = g(n, start);
		return hn * 0.1 + gn;
	}

	function openner(node) { // 计算传入坐标节点的下一个节点
		if (!initCloseBox) {
			closer(node, null);
			initCloseBox = true;
			console.log(closeBox);
		}
		var guide = { // 坐标操作指南
			0: ['y', -1],
			1: ['x', 1],
			2: ['y', 1],
			3: ['x', -1]
		};
		var optimalFn = null; // 存储当前最优代价评估
		var optimalCoord = null; // 存储当前最优坐标
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

			var arr = handleCode[i]; // 生成周围坐标
			var coord = generCoord(arr, guide, node);

			if (inClose(coord)) continue; // 如果计算的坐标在closeBox 里跳过
			var fn = f(coord, start, goal);

			if (!optimalFn) { // 挑出其中代价最小的
				optimalCoord = coord;
				optimalFn = fn;
			} else {
				if (fn <= optimalFn) {
					optimalFn = fn;
					optimalCoord = coord;
				}
			}

		}
		closer(optimalCoord, node); // 将遍历过的节点存入closeBox,
		return optimalCoord;
	}

	function closer(current, src) { // 存入openner计算后的节点
		var x = current.x;
		var y = current.y;
		var boxer = {};
		boxer.x = x;
		boxer.y = y;
		boxer.src = closeBox[makeKey(src)] || null;
		var key = makeKey(current);
		closeBox[key] = boxer;
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

	function findRoad(current, start, goal) {
		if (goal.x == current.x && goal.y == current.y) {
			var last = closeBox[makeKey(goal)];
			getPath(last);
			console.log(path);
			return;
		}
		current = openner(current);
		findRoad(current, start, goal);
	}

	findRoad(start, start, goal); // 运行逻辑
	return path;
}
