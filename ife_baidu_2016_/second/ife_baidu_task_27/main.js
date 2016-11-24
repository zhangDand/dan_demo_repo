var util = {
	extend: function(o1, o2) {
		for (var i in o2) {
			if (o1[i] === undefined) {
				o1[i] = o2[i];
			}
		}
	},
	map : function(arr,callback){
			for (var i = 0; i < arr.length; i++) {
				callback(arr[i]);
			}
	},
};
// 飞船
function Vehicle(param) {
	util.extend(this, param);

	this.id = this.id || 0; // 飞船id
	this.universe = this.universe || document.querySelector('.universe'); // 所属宇宙
	this.oribit = this.oribit || 165; // 飞船轨道
	this.lineSpeed = Number(this.lineSpeed) || 2000; // 飞船线速度
	this.moveState = 'stop'; // 运动状态
	this.energy = null; // 能源充值系统编号，用来消除充电函数
	this.energyMax = 200; // 能量上限
	this.energyVolume = 100; // 能量存量
	this.energyCharge = Number(this.energyCharge) || 5; // 充电速度
	this.energyConsumption = Number(this.energyConsumption) || 10; // 消耗速度
	this.body = null; // 飞船dom
	this.position = 0; // 飞船位置
	this.radius = 250 - this.oribit; // 飞船高度
	this.angularSpeed = this.lineSpeed / this.radius; // 飞船角速度

	// 飞船相关设置
	var ship = document.createElement('div');
	ship.className = 'vehicle ';
	ship.style['top'] = this.oribit + 'px';
	ship.style['transform-origin'] = 'center ' + this.radius + 'px';

	this.universe.appendChild(ship);
	this.body = ship;

	// 飞船能源系统
	this.energy = setInterval((function() {
		if (this.energyVolume >= this.energyMax) return;
		this.energyVolume += this.energyCharge;
		this.energyVolume = this.energyVolume <= this.energyMax ? this.energyVolume : this.energyMax;
	}).bind(this), 1000);
	// 飞船显示系统
	this.display = setInterval((function() {
		this.body.innerText = this.energyVolume;
	}).bind(this), 1000);

	console.info('new vehicle is created',this);
}

Vehicle.prototype = {
	move: function() {
		if (this.state == 'move') return;
		this.state = 'move';
		this.timer = setInterval(function() {
			this.position = (this.position + this.angularSpeed); // 位移计算
			this.energyVolume -= this.energyConsumption; // 耗能计算

			this.body.style['transform'] = 'rotate(' + this.position + 'deg)'; // 渲染

			if (this.energyVolume <= 0) { // 无能量停车
				this.stop();
			}
		}.bind(this), 1000);
	},
	stop: function() {
		this.state = 'stop';
		clearInterval(this.timer);
	},
	destroy: function() {
		this.stop();
		clearInterval(this.energy);
		clearInterval(this.display);
		var target = this.body;
		if (target.parentNode) target.parentNode.removeChild(target);
	},
	// 命令格式 = {
	// 	id: 1,
	// 	cmd: 'destroy' || 'move' || 'stop'
	// }
	receiver: function(cmd) {
		cmd.id == this.id ? this[cmd.cmd]() : null;
	},
	adapter: function(code) {
		var eid = code.slice(0,4);
		var ecmd = code.slice(4);
		var id,cmd;
		switch(eid){
			case '0000':
			id = 0;
			break;
			case '0001':
			id = 1;
			break;
			case '0010':
			id = 2;
			break;
			case '0011':
			id = 3;
			break;
		}
		switch(ecmd){
			case '0001':
			cmd = 'move';
			break;
			case '0010':
			cmd = 'stop';
			break;
			case '0100':
			cmd = 'destroy';
			break;
		}
		var param = {
			id:id,
			cmd:cmd
		};
		this.receiver(param);
	}
};


cmdMaker = function(id, cmd) {
	return {
		id: id,
		cmd: cmd
	};
};

// 宇宙介质，传输命令，保存飞船
function Mediator(param) {
	util.extend(this, param);

	var ships = [];
	var oribits = [165, 115, 65, 15, -35];
	// 允许设置参数
	this.packetLoss = this.packetLoss || 0.3;
	this.oribits = this.oribits || oribits;

	this.ships = ships; // 飞船仓库

}

Mediator.prototype = {
	broadcast: function(cmd) { // 广播命令
		for (var i = 0; i < this.ships.length; i++) {
			if (this.didLoss()) {
				continue;
			}
			this.ships[i].receiver(cmd);
		}
	},
	didLoss: function(num) { // 模拟丢包
		return Math.random() < (num || this.packetLoss);
	},
	// 新建飞行器 ，根据飞船仓库数量摆放飞船
	createShip: function(obj) {
		var order = this.ships.length;
		var param = {
			id: order,
			oribit: this.oribits[order]
		};
		util.extend(param, obj);
		var newShip = new Vehicle(param);
		this.ships.push(newShip);
		console.log('param填充完毕',param);
	},
	bus: function(code) { // 广播命令
		for (var i = 0; i < this.ships.length; i++) {
			if (this.didLoss(0.1)) {
				console.log('发送失败，重新发送');
				this.bus(code);
				continue;
			}
			setTimeout(this.ships[i].adapter(code),300);
			console.log('发信：', code);
		}
	},
};

// 指挥官
function Commander(param) {
	util.extend(this, param);
	// 参数设置
	this.container = this.container || document.getElementById('commander');
	this.universe = this.universe || null; // 必填参数
	this.ships = [];
	this.ctrls = {};
	this.lowSpeed = this.lowSpeed || 2000;
	this.middleSpeed = this.middleSpeed || 3500;
	this.highSpeed = this.highSpeed || 5000;
	this.lowEnergy = this.lowEnergy || 5;
	this.middleEnergy = this.middleEnergy || 10;
	this.highEnergy = this.highEnergy || 20;
	this.speedOption = null;
	this.energyOption = null;
	// 新建飞船按钮
	var createButton = document.createElement('button');

	createButton.innerText = '创建飞船';
	createButton.name = 'create';

	// 飞船参数设置面板
	var radio = document.createElement('input');
	radio.type = 'radio';

	var speed = radio.cloneNode(true);
	var energy = radio.cloneNode(true);

	speed.name = 'speed';
	energy.name = 'energy';

	var lowSpeedRadio = speed.cloneNode(true);
	var middleSpeedRadio = speed.cloneNode(true);
	var highSpeedRadio = speed.cloneNode(true);

	lowSpeedRadio.value = this.lowSpeed;
	middleSpeedRadio.value = this.middleSpeed;
	highSpeedRadio.value = this.highSpeed;

	var lowEnergyRadio = energy.cloneNode(true);
	var middleEnergyRadio = energy.cloneNode(true);
	var highEnergyRadio = energy.cloneNode(true);

	lowEnergyRadio.value = this.lowEnergy;
	middleEnergyRadio.value = this.middleEnergy;
	highEnergyRadio.value = this.highEnergy;

	// label 设置
	var label = document.createElement('label');

	var lowSpeedLabel = label.cloneNode(true);
	lowSpeedLabel.innerText = '低速 ' + this.lowSpeed;
	lowSpeedLabel.appendChild(lowSpeedRadio);

	var middleSpeedLabel = label.cloneNode(true);
	middleSpeedLabel.innerText = '中速 ' + this.middleSpeed;
	middleSpeedLabel.appendChild(middleSpeedRadio);

	var highSpeedLabel = label.cloneNode(true);
	highSpeedLabel.innerText = '高速 ' + this.highSpeed;
	highSpeedLabel.appendChild(highSpeedRadio);

	var lowEnergyLabel = label.cloneNode(true);
	lowEnergyLabel.innerText = '好 ' + this.lowEnergy;
	lowEnergyLabel.appendChild(lowEnergyRadio);

	var middleEnergyLabel = label.cloneNode(true);
	middleEnergyLabel.innerText = '很好 ' + this.middleEnergy;
	middleEnergyLabel.appendChild(middleEnergyRadio);

	var highEnergyLabel = label.cloneNode(true);
	highEnergyLabel.innerText = '非常好 ' + this.highEnergy;
	highEnergyLabel.appendChild(highEnergyRadio);

	var speedBox = document.createElement('div');
	speedBox.innerText = '动力系统';
	speedBox.appendChild(lowSpeedLabel);
	speedBox.appendChild(middleSpeedLabel);
	speedBox.appendChild(highSpeedLabel);

	var energyBox = document.createElement('div');
	energyBox.innerText = '能源系统';
	energyBox.appendChild(lowEnergyLabel);
	energyBox.appendChild(middleEnergyLabel);
	energyBox.appendChild(highEnergyLabel);

	var ctrlBar = document.createElement('div'); // 飞船控制条
	var btn = document.createElement('button'); // 按钮原型
	var moveBtn = btn.cloneNode(true); // 移动按钮
	var stopBtn = btn.cloneNode(true); // 停止按钮
	var destroyBtn = btn.cloneNode(true); // 销毁按钮

	moveBtn.innerText = '飞行';
	moveBtn.name = 'move';

	stopBtn.innerText = '停止';
	stopBtn.name = 'stop';

	destroyBtn.innerText = '销毁';
	destroyBtn.name = 'destroy';



	// 控制条创建
	this.createBar = function() {
		var order = this.ships.length;
		if (order >= 4) return;
		// 飞行按钮
		var move = moveBtn.cloneNode(true);
		move.order = order;
		move.addEventListener('click', this.clickBtn.bind(this));
		// 停止按钮
		var stop = stopBtn.cloneNode(true);
		stop.order = order;
		stop.addEventListener('click', this.clickBtn.bind(this));
		// 销毁按钮
		var destroy = destroyBtn.cloneNode(true);
		destroy.order = order;
		destroy.addEventListener('click', this.clickBtn.bind(this));
		destroy.addEventListener('click', this.remove.bind(this));
		// 控制条设置
		var ctrl = ctrlBar.cloneNode(true);
		ctrl.innerText = '对' + -(-order - 1) + '号飞船下达指令：';
		ctrl.appendChild(move);
		ctrl.appendChild(stop);
		ctrl.appendChild(destroy);

		this.container.appendChild(ctrl); // 控制条插入容器
		this.emit('create'); // 发射新建飞船信息
		this.ships.push(order); // 保存飞船 id 信息
		this.ctrls[order] = ctrl; // 保存控制条dom
	};

	this.container.appendChild(createButton);
	this.container.appendChild(speedBox);
	this.container.appendChild(energyBox);

	var speeds = document.getElementsByName('speed');
	var energys = document.getElementsByName('energy');

	// 事件注册
	createButton.addEventListener('click', this.createBar.bind(this));  // 新建飞船按钮
	util.map.call(this,speeds,function(item){  // 速度选择按钮
		item.addEventListener('click',this.clickRadio.bind(this));
	}.bind(this));
	util.map.call(this,energys,function(item){
		item.addEventListener('click',this.clickRadio.bind(this));
	}.bind(this));
}

Commander.prototype = {
	// 单向通信模块
	emit: function(type, id, cmd) {
		if (type == 'create') { // type -> create 发送创建飞船信息
			var param = {
				lineSpeed: this.speedOption,
				energyCharge: this.energyOption,
				energyConsumption: this.speedOption/200
			};
			this.universe.createShip(param);
		} else if (type == 'ctrl') { // type -> ctrl 发送控制信息
			var x = {
				id: id,
				cmd: cmd,
			};
			this.adapter(x);
		}
	},
	clickBtn: function(event) { // 点击控制按钮
		var id = event.target.order;
		var cmd = event.target.name;
		this.emit('ctrl', id, cmd);
	},
	clickRadio: function(event) { // 改变飞船参数
		var target = event.target;
		var value = target.value;
		var name = target.name;
		this[name + 'Option'] = value;
		console.log(this.speedOption,this.energyOption);
	},
	remove: function(event) { // 删除控制条
		var id = event.target.order;
		var ctrl = this.ctrls[id];
		ctrl.parentNode.removeChild(ctrl);
		this.ships.splice(0, 1);
		delete(this.ctrls[id]);
	},
	adapter: function(x){
		var id = x.id;
		var cmd = x.cmd;
		var eid,ecmd;
		switch(id){
			case 0:
			eid = '0000';
			break;
			case 1:
			eid = '0001';
			break;
			case 2:
			eid = '0010';
			break;
			case 3:
			eid = '0011';
			break;
		}
		switch(cmd){
			case 'move':
			ecmd = '0001';
			break;
			case 'stop':
			ecmd = '0010';
			break;
			case 'destroy':
			ecmd = '0100';
			break;
		}
		var code = eid + ecmd;
		this.universe.bus(code);
	}
};
var universe_1 = new Mediator();
var conmand_1 = new Commander({
	universe: universe_1
});
// var ship1 = new Vehicle({
// 	oribit:115,
// 	lineSpeed:20000
// });
// ship1.move();