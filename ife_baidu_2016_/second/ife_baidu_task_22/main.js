
var root	= document.getElementById('root');
var buttons	= document.getElementsByTagName('button');
var frontBtn	= buttons[0];
var middleBtn	= buttons[1];
var endBtn	= buttons[2];

var searchList = [];

function searchFront(root) {
	if(!(root == null)){
		searchList.push(root);
		searchFront(root.firstElementChild);
		searchFront(root.lastElementChild);
	}
}

function searchMiddle(root){
	if(!(root == null)){
		searchMiddle(root.firstElementChild);
		searchList.push(root);
		searchMiddle(root.lastElementChild);
	}
}

function searchEnd(root){
	if(!(root == null)){
		searchEnd(root.firstElementChild);
		searchEnd(root.lastElementChild);
		searchList.push(root);
	}
}

function changeColor(){
	var i = 0;
	searchList[i].style['backgroundColor'] = 'blue';
	var timer = setInterval(function(){
		i += 1;
		if(i<searchList.length){
			searchList[i].style['backgroundColor'] = 'blue';
			searchList[i-1].style['backgroundColor'] = '#fff';
		}else{
			searchList[i-1].style['background-color'] = '#fff';
			clearInterval(timer);
			searchList=[];
		}
	},700)
}
frontBtn.onclick = function(){
	searchFront(root);
	changeColor();
}
middleBtn.onclick = function(){
	searchMiddle(root);
	changeColor();
}
endBtn.onclick = function(){
	searchMiddle(root);
	changeColor();
}
