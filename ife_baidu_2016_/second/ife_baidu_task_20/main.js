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

var input = document.getElementById('input-list');
var search = document.getElementById('search');
var inputBtn = document.getElementById('input-btn');
var searchBtn = document.getElementById('search-btn');
var tagBox = document.getElementById('tagbox');

var item = document.createElement('sapn');
item.setAttribute('class','tag');


// 输入框输入函数
function pushList(){
  var content = input.value;
  if(!content) return;
  var rgx = /[,，\s、]+/;
  var rgx2 = /(^[,，\s、]*)|([,，\s、]*$)/g;

  var list = content.replace(rgx2,'').split(rgx);
  tagBox.innerHTML = '';  // 清除box
  for (var i=0;i<list.length;i++) {
    var newItem = item.cloneNode(true);
    newItem.innerText = list[i];
    tagBox.appendChild(newItem);
  }
}
// 查找函数
function searchKey() {
  console.log('start');
  if(tagBox.childElementCount == 0)return;

  var key = search.value;
  var code = 'var rgx = /' + key +'/';
  eval(code);
  var items = tagBox.children;
  console.log(items);
  for(var i=0; i<items.length;i++){
    var content = items[i].innerText;
    util.delClass(items[i],'active')
    if(rgx.test(content)){
      util.addClass(items[i],'active');
    }
  }
}
//init函数

function init(){
  inputBtn.onclick = pushList;
  searchBtn.onclick = searchKey;
  console.log(searchBtn)
}


// init
init();
