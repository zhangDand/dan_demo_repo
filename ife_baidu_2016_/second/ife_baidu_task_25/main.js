var  data = {
	'前端工程师':{
		'技术':{
			'JavaScript':{},
			'Vuejs':{}
		},
		'吃的':{
			'红烧肉':{},
			'饺子':{}
		}
	}
};

function TreeNode(data){
	// 工具对象
	this.util = {
		addClass: function(node,className){
			var current =  node.className || '';
			if((' '+ current + ' ').indexOf(' ' + className + ' ')===-1){
				node.className = current ? (current+' '+className) : className;
			}

		},
		delClass: function(node, className){
			var current = node.className || '';
			node.className = (' ' + current + ' ').replace(' '+className + ' ',' ').trim();
		},
		map : function(arr,callback){
			for (var i = 0; i < arr.length; i++) {
				callback(arr[i]);
			}
		}
	};

	// 模板
	var frameTemplate	= '';
	var itemTemplate	= '<div class="head"><span class="click arrow"></span><span class="click title"></span><span class="button additem">添加</span><span class="button removeitem">删除</span></div>';

	var container	= document.createElement('div');
	var item	= document.createElement('div');

	container.innerHTML	= frameTemplate;
	container.id	= 'treecontainer';

	item.innerHTML	= itemTemplate;
	item.className	= 'item';
}
TreeNode.prototype = {
	wideTraversal : function(node,divList){
		if(!(node == null)){
			divList.push(node);
			wideTraversal(node.nextElementSibling,divList);
			wideTraversal(node.firstElementChild,divList);
		}
	},
	createTree : function(container,data){
			if(Object.keys(data).length > 0 ){
				for(var i in data){
					var newItem = item.cloneNode(true);
					newItem.querySelector('.title').innerText = i;
					container.appendChild(newItem);
					createTree(newItem,data[i]);
				}
			}
	},
}
// 工具对象
var util = {
  addClass: function(node,className){
    var current =  node.className || '';
    if((' '+ current + ' ').indexOf(' ' + className + ' ')===-1){
      node.className = current ? (current+' '+className) : className;
    }

  },
  delClass: function(node, className){
    var current = node.className || '';
    node.className = (' ' + current + ' ').replace(' '+className + ' ',' ').trim();
  },
	map : function(arr,callback){
		for (var i = 0; i < arr.length; i++) {
			callback(arr[i]);
		}
	}
};

var container	= document.getElementById('container');	// 容器定义
container.value = 'papa';



var item	= document.createElement('div');
var itemTemplate	= '<div class="head"><span class="click arrow"></span><span class="click title"></span><span class="button additem">添加</span><span class="button removeitem">删除</span></div>';

item.innerHTML	= itemTemplate;
item.className	= 'item';

// 广度优先遍历函数
function wideTraversal(node,divList){
	if(!(node == null)){
		divList.push(node);
		wideTraversal(node.nextElementSibling,divList);
		wideTraversal(node.firstElementChild,divList);
	}
}
// 广度单层遍历
function traversalSingle(node,divList){
	if(!(node == null)){
		divList.push(node);
		traversalSingle(node.nextElementSibling,divList);
	}
}

// 构建结构树
function createTree(container,data){
	if(Object.keys(data).length > 0 ){
		for(var i in data){
			var newItem = item.cloneNode(true);
			newItem.querySelector('.title').innerText = i;
			container.appendChild(newItem);
			createTree(newItem,data[i]);
		}
	}
}

// 项目点击事件
function itemClick(event){
	var target	= event.target.parentNode.parentNode;	// 方案1
	// var clickItem = target.firstElementChild.querySelectorAll('.click');
	var clickItem = event.target;
	var arrow	= target.querySelector('.arrow');
	var list	= [];
	// console.log(clickItem[0].className.indexOf('click'));
	traversalSingle(target.children[1],list);
	// if(target.children.length >1 && arrow.className.indexOf('arrow-bottom') != -1 && ){
	// if(target.children.length >1 && clickItem[0].className.indexOf('click') > -1 && arrow.className.indexOf('arrow-bottom') != -1){ //方案2
	if(target.children.length >1 && clickItem.className.indexOf('click') > -1 && arrow.className.indexOf('arrow-bottom') != -1){ //方案2
		util.delClass(arrow,'arrow-bottom');
		util.addClass(arrow,'arrow-left');

		util.map(list,(function(node){
			util.addClass(node,'item-hidden');
		}));
	}else if(clickItem.className.indexOf('click') > -1 && target.children.length >1 ){
		util.addClass(arrow,'arrow-bottom');
		util.delClass(arrow,'arrow-left');

		util.map(list,(function(node){
			util.delClass(node,'item-hidden');
		}));
	}else if(clickItem.className.indexOf('button additem') > -1){
		var name = prompt('请出入添加的项目名').trim();
		if(name){
			var newItem = item.cloneNode(true);
			newItem.querySelector('.title').innerText = name;
			target.appendChild(newItem);
			arrow.click();
		}
	}else if(clickItem.className.indexOf('button removeitem') > -1){
		var parent	= target.parentNode;
		parent.removeChild(target);
		console.log('parent.children.length', parent.children.length);
		if(parent.children.length <=1){
			console.log('CONDITION PASSED');
			var flag = parent.firstElementChild.querySelector('.arrow');
			console.log('flag', flag);
			util.delClass(flag,'arrow-bottom');
		}
	}
}
// 箭头初始化
function initArrow(node){
	var list = [];
	wideTraversal(node,list);
	for (var i = 0; i < list.length; i++) {
		if(list[i].classList[0] == 'item' && list[i].children.length >1){ // 筛选出子节点大于2的项目节点
			util.addClass(list[i].querySelector('.arrow'),'arrow-bottom');

		}
	}

}
// 项目点击事件初始化
function initClick(){
	container.addEventListener('click',itemClick);
}
// 项目hover事件初始化
function initHover(){
	var list = [];
	var itemList = [];
	wideTraversal(node,list);
	for (var i = 0; i < list.length; i++) {
		list[i]
	}
}

function init(){
	createTree(container,data);	// 构建结构树
	initClick();	// 初始化点击事件
	initArrow(container.firstElementChild);	// 箭头初始化：
}


init();
