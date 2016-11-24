var util = {
	extend : function(o1,o2){
		for(var i in o2){if(o1[i] == undefined){
			o1[i] = o2[i];
		}}
	}
};
// 飞船
function Vehicle(param){
	util.extend(this,param);

	this.id	= this.id || 0;	// 飞船id
	this.moveState	= 'stop';	// 运动状态
	this.energy	= null;	// 能源充值系统编号，用来消除充电函数
	this.energyMax	= 200;	//能量上限
	this.energyVolume	= 100;	// 能量存量
	this.energyCharge	= 5;	// 充电速度
	this.energyConsumption	= 10;	// 消耗速度
	this.universe	= this.universe || document.getElementsByClassName('universe')[0]; // 所属宇宙
	this.oribit	= this.oribit || 165; // 飞船轨道
	this.body	= null; // 飞船dom
	this.position	= 0; // 飞船位置
	this.lineSpeed	= this.lineSpeed || 2000;  // 飞船线速度
	this.radius 	= 250 - this.oribit; // 飞船高度
	this.angularSpeed	= this.lineSpeed/this.radius; // 飞船角速度

	// 飞船相关设置
	var ship	= document.createElement('div');
	ship.className = 'vehicle ';
	ship.style['top'] = this.oribit + 'px';
	ship.style['transform-origin'] = 'center '+ this.radius +'px';

	this.universe.appendChild(ship);
	this.body = ship;

	// 飞船能源系统
	this.energy = setInterval((function(){
		if(this.energyVolume >= this.energyMax)return;
		this.energyVolume += this.energyCharge;
	}).bind(this),1000);
	// 飞船显示系统
	this.display = setInterval((function(){
		this.body.innerText = this.energyVolume;
	}).bind(this),1000);
}

Vehicle.prototype = {
	move: function(){
		if(this.state == 'move')return;
		this.state = 'move';
		this.timer = setInterval(function(){
			this.position	= (this.position + this.angularSpeed) ; // 位移计算
			this.energyVolume	-=this.energyConsumption; // 耗能计算

			this.body.style['transform'] = 'rotate('+ this.position +'deg)'; // 渲染

			if(this.energyVolume == 0){  // 无能量停车
				this.stop();
			}
		}.bind(this),1000);
	},
	stop: function(){
		this.state = 'stop';
		clearInterval(this.timer);
	},
	destroy: function(){
		this.stop();
		clearInterval(this.energy);
		clearInterval(this.display);
		var target = this.body;
		if(target.parentNode)target.parentNode.removeChild(target);
	},
	// 命令格式 = {
	// 	id: 1,
	// 	cmd: 'destroy' || 'move' || 'stop'
	// }
	receiver: function(cmd){
		cmd.id == this.id? this[cmd.cmd]() : null;
	}
};


cmdMaker = function(id,cmd){
	return{
		id: id,
		cmd: cmd
	};
};

// 宇宙介质，传输命令，保存飞船
function Mediator(param){
	util.extend(this,param);

	var ships	= [];
	var oribits	= [165,115,65,15,-35];
	// 允许设置参数
	this.packetLoss	= this.packetLoss || 0.3;
	this.oribits	=this.oribits || oribits;

	this.ships	= ships; // 飞船仓库

}
Mediator.prototype = {
	broadcast: function(cmd){ // 广播命令
		for (var i = 0; i < this.ships.length; i++) {
			if(this.didLoss()){
				continue;
			}
			this.ships[i].receiver(cmd);
		}
	},
	didLoss: function(){ // 模拟丢包
		return Math.random() < this.packetLoss;
	},
	// 新建飞行器 ，根据飞船仓库数量摆放飞船
	createShip : function(){
		if(this.didLoss())return;
		var order = this.ships.length;
		var param = {
			id : order,
			oribit : this.oribits[order]
		}
		var newShip = new Vehicle(param);
		this.ships.push(newShip);
	},
}

// 指挥官
function Commander(param){
	util.extend(this,param);

	var createButton = document.createElement('button');
	createButton.innerText	= '创建飞船';
	createButton.name	= 'create';

	var ctrlBar	= document.createElement('div');	// 飞船控制条
	var btn	= document.createElement('button');	// 按钮原型
	var moveBtn	= btn.cloneNode(true);	// 移动按钮
	var stopBtn	= btn.cloneNode(true);	// 停止按钮
	var destroyBtn	= btn.cloneNode(true);	// 销毁按钮

	moveBtn.innerText = '飞行';
	moveBtn.name = 'move';

	stopBtn.innerText = '停止';
	stopBtn.name = 'stop';

	destroyBtn.innerText = '销毁';
	destroyBtn.name = 'destroy';

	// 可设置参数
	this.container	= this.container || document.getElementById('commander');
	this.universe	= this.universe || null;	// 必填参数
	this.ships	= [];
	this.ctrls	={};

	// 控制条创建
	this.createBar = function(){
		var order = this.ships.length;
		if(order >= 4)return;
		// 飞行按钮
		var move = moveBtn.cloneNode(true);
		move.order = order;
		move.addEventListener('click',this.clickBtn.bind(this));
		// 停止按钮
		var stop = stopBtn.cloneNode(true);
		stop.order = order;
		stop.addEventListener('click',this.clickBtn.bind(this));
		// 销毁按钮
		var destroy = destroyBtn.cloneNode(true);
		destroy.order = order;
		destroy.addEventListener('click',this.clickBtn.bind(this));
		destroy.addEventListener('click',this.remove.bind(this));
		// 控制条设置
		var ctrl = ctrlBar.cloneNode(true);
		ctrl.innerText = '对'+ -(-order-1) +'号飞船下达指令：'
		ctrl.appendChild(move);
		ctrl.appendChild(stop);
		ctrl.appendChild(destroy);

		this.container.appendChild(ctrl);	// 控制条插入容器
		this.emit('create');	// 发射新建飞船信息
		this.ships.push(order);	// 保存飞船 id 信息
		this.ctrls[order] = ctrl;	// 保存控制条dom
	}

	this.container.appendChild(createButton);

	// 事件注册
	createButton.addEventListener('click',this.createBar.bind(this))
}
Commander.prototype = {
	// 单向通信模块
	emit: function(type,id,cmd){
		if(type == 'create'){ // type -> create 发送创建飞船信息
			this.universe.createShip();
		}else if(type == 'ctrl'){ // type -> ctrl 发送控制信息
			var x = {
				id : id,
				cmd : cmd,
			};
			this.universe.broadcast(x);
		}
	},
	clickBtn: function(event){
		var id = event.target.order;
		var cmd = event.target.name;
		this.emit('ctrl',id,cmd);
	},
	remove: function(event){
		var id = event.target.order;
		var ctrl = this.ctrls[id];
		ctrl.parentNode.removeChild(ctrl);
		this.ships.splice(0,1);
		delete(this.ctrls[id]);
	}
}
var universe_1 = new Mediator();
var conmand_1 = new Commander({
	universe : universe_1
});
// var ship1 = new Vehicle({
// 	oribit:115,
// 	lineSpeed:20000
// });
// ship1.move();
