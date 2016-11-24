var tagInput	= document.getElementById('taginput');
var tagBox	= document.getElementById('tagbox');
var loveInput	= document.getElementById('loveinput');
var loveBox	= document.getElementById('lovebox');
var loveBtn 	= document.getElementById('love-btn');

var item = document.createElement('span');
item.setAttribute('class','tag');


/**
 * tag栏 按键侦测函数 重复验证函数 内容验证 标签插入
 */
// 按键侦测
function checkFlag(event){
  var flag	= event.key;
  var flags	= [' ',',','Enter'];
  var code	= flags.indexOf(flag);
  return code == -1?false:true;
}

// 重复验证->传入检验的字符出串和容器
function didRepeat(text,node){
	if(node.childElementCount == 0)return -1;

	var items	= node.children;
	var tags	= [];
  for (var i = 0; i < items.length; i++) {
		tags.push(items[i].innerText.trim());
  }
	return tags.indexOf(text);
}

// tag 内容验证
function checkValue(event){
	var value	= event.target.value;
	// 合法验证
	if(/[,， \n]+/.test(value)){
		event.target.value = '';
		return false;
	}
	// 去除逗号
	event.target.value = event.target.value.replace(/[,，]+/,'');
  // 重复验证
  var code = didRepeat(value,tagBox);
  return code == -1?true:false;
}

// tag 数量限制
function tagLimit(limit,box){
  while(box.childElementCount>limit){
		box.removeChild(box.firstChild);
	}
}

// 标签输入
function pushTag(event){  	// 提交tag内容
  if(!checkFlag(event))return;
  if(!checkValue(event))return;

	var value	= event.target.value;
	if(!value)return; // value 为空则返回

	var newItem	= item.cloneNode(true);
  newItem.innerText = value;
  tagBox.appendChild(newItem);

  tagLimit(10,tagBox);	// 限制tag数量
  tagInput.value = '';	//清除输入栏
}

// 爱好输入函数
function pushLove(){
	var content = loveInput.value;
  if(!content) return;
  var rgx = /[,，\s、]+/;
  var rgx2 = /(^[,，\s、]*)|([,，\s、]*$)/g;

  var list = content.replace(rgx2,'').split(rgx);
  loveBox.innerHTML = '';  // 清除box
  for (var i=0;i<list.length;i++) {
		if(didRepeat(list[i],loveBox) != -1)continue;
    var newItem = item.cloneNode(true);
    newItem.innerText = list[i];
    loveBox.appendChild(newItem);
  }
	tagLimit(10,loveBox);
}

// 点击移除
function removeSelf(event){
  if(event.currentTarget.childElementCount == 0 || event.target.tagName == 'DIV') return;
  var self = event.target;
  event.currentTarget.removeChild(self);
}

/**
 * 初始化各个按钮
 */
// 标签输入init
function initPushTag(){
  tagInput.addEventListener('keydown',pushTag);
	tagInput.addEventListener('input',function(event){
		event.target.value = event.target.value.replace(/[,， ]+/,'');
	});
}
// 爱好输入init
function initPushLove(){
	loveBtn.onclick = pushLove;
}
// 点击删除init
function initRemoveSelf(){
	tagBox.addEventListener('click',removeSelf);
	loveBox.addEventListener('click',removeSelf);
}
// init
function init(){
  initPushTag();
  initPushLove();
	initRemoveSelf();
}

init();
