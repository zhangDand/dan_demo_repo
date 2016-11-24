var input = document.getElementById('input');
var leftEntry = document.getElementById('le'),
    rightEntry = document.getElementById('re'),
    leftOut = document.getElementById('lo'),
    rightOut = document.getElementById('ro');
var tagBox = document.getElementById('tagbox');

var item = document.createElement('span');
// 插入项目样式设置
item.style['display'] = 'inline-block';
item.style['background-color'] = 'red';
item.style['padding'] = '5px';
item.style['margin'] = '5px';

// 插入项目函数
function pushItem(event){
  var position = event.target.value;
  var newItem = item.cloneNode(true);
  var value = input.value;
  input.value = '';

  // 数据验证


  if(!value || !/^[0-9]*$/.test(value)) return;
  newItem.innerText = value;
  switch(position){
    case 'le':
      tagBox.insertBefore(newItem,tagBox.firstChild);
      break;
    case 're':
      tagBox.appendChild(newItem);
      break;
  }
  input.value = '';  // 初始化input
}

// 移除项目函数
function removeItem(event){
  if(tagBox.childElementCount == 0)return;
  var position = event.target.value;
  var parent = event.target.parentNode;
  switch(position){
    case 'lo':
    tagBox.removeChild(tagBox.firstChild);
    break;
    case 'ro':
    tagBox.removeChild(tagBox.lastChild);
    break;
  }
}
// 点击移除函数
function removeSelf(event){
  if(tagBox.childElementCount == 0 || event.target.tagName == 'DIV') return;
  var self = event.target;
  tagBox.removeChild(self);
}

//初始化插入按钮
function initPushItem(){
  leftEntry.addEventListener('click',pushItem);
  rightEntry.addEventListener('click',pushItem);
}
// 初始化删除按钮
function initRemoveItem(){
  leftOut.addEventListener('click',removeItem);
  rightOut.addEventListener('click',removeItem);
}
// 初始化点击移除
function initRemoveSelf(){
  tagBox.addEventListener('click',removeSelf);
}

//初始化
function init(){
  initPushItem();
  initRemoveItem();
  initRemoveSelf();
}

init();
