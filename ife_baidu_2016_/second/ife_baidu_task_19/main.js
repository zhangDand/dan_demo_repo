var input = document.getElementById('input');
var leftEntry = document.getElementById('le'),
    rightEntry = document.getElementById('re'),
    leftOut = document.getElementById('lo'),
    rightOut = document.getElementById('ro');
var tagBox = document.getElementById('tagbox');

var item = document.createElement('span');

// 插入项目样式设置
tagBox.style['vertical-align'] = 'sub';
item.style['display'] = 'inline-block';
item.style['background-color'] = 'red';
item.style['padding'] = '0 2px';
item.style['margin'] = '0 2px';
item.style['vertical-align'] = 'sub';
// 插入数据
function pushRandom(){
  for(var i=0; i<150; i++){
    var newItem = item.cloneNode(true);
    var value = Math.random(999)*100;
    newItem.style['height'] = value + 'px';
    newItem.value = value;

    tagBox.appendChild(newItem);
  }
}
// 插入项目函数
function pushItem(event){
  var position = event.target.value;
  var newItem = item.cloneNode(true);
  var value = input.value;
  input.value = '';

  // 数据验证
  if(!value || !/^[0-9]*$/.test(value)) return;

  // 插入项目设置
  newItem.value = value;
  newItem.style['height'] = value + 'px';
  newItem.style['line-height'] = value + 'px';
  switch(position){

  case 'le':
    tagBox.insertBefore(newItem,tagBox.firstChild);
    break;
  case 're':
    tagBox.appendChild(newItem);
    break;
  }
}

// 移除项目函数
function removeItem(event){
  if(tagBox.childElementCount == 0)return;
  var position = event.target.value;
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
  if(tagBox.childElementCount == 0 || event.target.tagName == 'DIV'){return;}
  var self = event.target;
  tagBox.removeChild(self);
}
// 排序函数
function sort(){
  var flag = 0;
  var times = 0;
  function run(num){
    if(flag==1){clearInterval(num);return;}
    flag=1;
    times+=1;
    var items = tagBox.children;
    for(var i=0;i<items.length-1;i++){
      var foo = items[i];
      var bar = items[i+1];
      if(foo.value>bar.value){
        var middle1 = foo.value;
        var middle2 = bar.value;
        foo.value = middle2;
        foo.style['height'] = middle2 + 'px';
        bar.value = middle1;
        bar.style['height'] = middle1 + 'px';
        flag=0;
      }
    }
  }
  var number=setInterval(run.bind(number),200);

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
// 初始化排序按钮
function initSort(){
  var sortBtn=document.getElementById('sort');
  sortBtn.addEventListener('click',sort);
  //初始化插入数据
  var pushBtn = document.getElementById('push');
  pushBtn.addEventListener('click',pushRandom);
}

//初始化
function init(){
  initPushItem();
  initRemoveItem();
  initRemoveSelf();
  initSort();
}

init();
