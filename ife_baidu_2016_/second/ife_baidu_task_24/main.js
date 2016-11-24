var btns	= document.getElementsByTagName('button');
var root	= document.getElementById('root');
var input	= document.getElementsByTagName('input')[0];
var addInput	= document.getElementsByTagName('input')[1];
var info = document.getElementById('alert');

var searchList	= [];
var divList	= [];
var selectedList	= [];
var flag	= 0;

var deepTraversalBtn	= btns[0];
var wideTraversalBtn	= btns[1];
var deepSearchBtn	= btns[2];
var wideSearchBtn	= btns[3];
var removeBtn	=btns[4];
var addBtn	=btns[5];
var searchBtn	=btns[6];

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
  }
};
// 遍历数组动画函数兼职搜索
function changeColor(key){
	key = key.value;
	var i = 0;
	divList[i].style['backgroundColor'] = 'blue';
	var timer = setInterval(function(){
		i += 1;
		if(i<divList.length){
			divList[i].style['backgroundColor'] = 'blue';
			divList[i-1].style['backgroundColor'] = '#fff';
			if(key != undefined){
				if(divList[i].firstChild.nodeValue.toLowerCase().trim() == key.toLowerCase().trim()){
					searchList.push(divList[i]);
				}
			}
		}else{
			divList[i-1].style['background-color'] = '#fff';
			clearInterval(timer);
			flag = 0;
			divList=[];
			for (var j = 0; j < searchList.length; j++) {
				searchList[j].style['background-color'] = 'red';
			}
		}
	},100);
}

// 深度优先遍历函数
function deepTraversal(node){
	divList.push(node);
	if(node.children == null)return;
	for (var i = 0; i < node.children.length; i++) {
		deepTraversal(node.children[i]);
	}
}
// 广度优先遍历函数
function wideTraversal(node){
	if(!(node == null)){
		divList.push(node);
		wideTraversal(node.nextElementSibling);
		wideTraversal(node.firstElementChild);
	}
}

// 点击选择函数
function clickChange(event){
	var target = event.target;
	// 若点击元素已被选择，清除样式，并从列表中剔除
	if(target.className && target.className.indexOf('selected') != -1){
		util.delClass(target,'selected');
		var index = selectedList.indexOf(target);
		index != -1?selectedList.splice(index) : null;
		return;
	}
	// 初始化样式
	if(event.ctrlKey == false){  // 按下ctrl时不删除已选择节点的样式
		for (var i = 0; i < selectedList.length; i++) {
			util.delClass(selectedList[i],'selected');
		}
		selectedList=[];
	}

	selectedList.indexOf(target) == -1?selectedList.push(target) : false;  // 添加选择的节点
	util.addClass(target,'selected');

}
// 删除按钮函数
function removeSelected(){
	for (var i = 0; i < selectedList.length; i++) {
		if(selectedList[i].id == 'root')continue;
		selectedList[i].parentNode.removeChild(selectedList[i]);
	}
	selectedList = [];
}
// 添加按钮函数
function addNode(){
	if(selectedList.length>1){
		info.innerText = '只能对一个项目进行添加';
		return;
	}  // 选择多个块时无响应
	if(selectedList.length == 0){
		info.innerText = '请选择项目';
		return;
	}
	if(!addInput.value){
		info.innerText = '请输入添加项的名称';
		return;
	}
	info.innerText = '';
	var item = document.createElement('div');
	item.innerText = addInput.value;
	selectedList[0].appendChild(item);
	addInput.value = '';
}

// 初始化
function init(){
	deepTraversalBtn.onclick = function(){
		if(flag == 1 )return;
		deepTraversal(root);
		changeColor();
		flag = 1;
	};
	wideTraversalBtn.onclick = function(){
		if(flag == 1)return;
		wideTraversal(root);
		changeColor();
		flag = 1;
	};
	deepSearchBtn.onclick = function(){
		if(flag == 1)return;
		deepTraversal(root);
		changeColor(input);
		flag = 1;
	};
	wideSearchBtn.onclick = function(){
		if(flag == 1)return;
		wideTraversal(root);
		changeColor(input);
		flag = 1;
	};
	removeBtn.onclick = function(){
		removeSelected();
	}
	addBtn.onclick = function(){
		addNode();
	}
	root.addEventListener('click',clickChange);
}

init();
