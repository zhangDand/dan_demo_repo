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

// 构建结构树
function createTree(containder,data){
	if(Object.keys(data).length > 0 ){
		for(var i in data){
			var newItem = item.cloneNode(true);
			newItem.querySelector('.title').innerText = i;
			containder.appendChild(newItem);
			createTree(newItem,data[i]);
		}
	}
}

// 项目点击事件
function itemClick(event){
	var target	= event.target.parentNode.parentNode;	// 方案1
	var clickItem = target.firstElementChild.querySelectorAll('.click');
	var arrow	= target.querySelector('.arrow');
	var list	= [];
	console.log(clickItem);
	console.log(clickItem[0].className.indexOf('click'));
	wideTraversal(target.children[1],list);
	// if(target.children.length >1 && arrow.className.indexOf('arrow-bottom') != -1 && ){
	if(target.children.length >1 && clickItem[0].className.indexOf('click') > -1 && arrow.className.indexOf('arrow-bottom') != -1){ //方案2
		util.delClass(arrow,'arrow-bottom');
		util.addClass(arrow,'arrow-left');

		util.map(list,(function(node){
			util.addClass(node,'item-hidden');
		}));
	}else if(clickItem[0].className.indexOf('click') > -1 ){
		util.addClass(arrow,'arrow-bottom');
		util.delClass(arrow,'arrow-left');

		util.map(list,(function(node){
			util.delClass(node,'item-hidden');
		}));
	}
}
// 项目hover事件
function itemHover(event){
	var btns=event.target.querySelectorAll('.button');
	btns[0].style['display'] = 'inline-block';
	btns[1].style['display'] = 'inline-block';
}
function itemLeave(event){
	var btns=event.target.querySelectorAll('.button');
	btns[0].style['display'] = 'none';
	btns[1].style['display'] = 'none';
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
