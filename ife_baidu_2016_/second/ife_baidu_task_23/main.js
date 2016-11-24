var btns	= document.getElementsByTagName('button');
var root	= document.getElementById('root');
var input	= document.getElementsByTagName('input')[0];

var searchList	= [];
var divList	= [];
var flag	= 0;

var deepTraversalBtn	= btns[0];
var wideTraversalBtn	= btns[1];
var deepSearchBtn	= btns[2];
var wideSearchBtn	= btns[3];

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
	},100)
}

// 深度优先遍历函数
function deepTraversal(node){
	divList.push(node);
	if(node.children == null)return;
	for (var i = 0; i < node.children.length; i++) {
		deepTraversal(node.children[i]);
	}
}

function wideTraversal(node){
	if(!(node == null)){
		divList.push(node);
		wideTraversal(node.nextElementSibling);
		wideTraversal(node.firstElementChild);
	}
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
}

init();
