/**
 * aqiData，存储用户输入的空气指数数据
 * 示例格式：
 * aqiData = {
 *    "北京": 90,
 *    "上海": 40
 * };
 */
var aqiData = {};

/**
 * 从用户输入中获取数据，向aqiData中增加一条数据
 * 然后渲染aqi-list列表，增加新增的数据
 */
function addAqiData() {
  var city = document.getElementById('aqi-city-input').value;
  var value = document.getElementById('aqi-value-input').value;
  if(!city && !value){
    alert('请输入城市和空气质量指数');
    return;
  }
  if(/\s/.test(city) && /\s/.test(value)){
    alert('请正确输入城市和空气质量指数');
    return;
  }

  city = city.replace(/(^\s*)|(\s*$)/g,"");
  value = value.replace(/(^\s*)|(\s*$)/g,"");


  var city_test = /^[\u4E00-\u9FA5a-z]*$/g.test(city);
  var value_test = /^[0-9]*$/.test(value);
  if(!city_test){
    alert('城市需要汉字或字母');
    return;
  }
  if(!value_test){
    alert('指数需要为整数数');
  }

  if(city && value){
    aqiData[city] = value;
  }
}

/**
 * 渲染aqi-table表格
 */
function renderAqiList() {
  var template = '<td>城市</td><td>空气质量</td><td>操作</td>';
  var box = document.getElementById('aqi-table');
  box.innerHTML="";

  var bar = document.createElement('tr');
  bar.innerHTML = template;
  box.appendChild(bar);

  for(var a in aqiData){
    var foo = document.createElement('tr');
    foo.innerHTML = template.replace('城市',a).replace('空气质量',aqiData[a]).replace('操作','删除');
    box.appendChild(foo);
    console.log('[render] :',a,aqiData[a]);
  }

}

/**
 * 点击add-btn时的处理逻辑
 * 获取用户输入，更新数据，并进行页面呈现的更新
 */
function addBtnHandle() {
  addAqiData();
  renderAqiList();
}


/**
 * 点击各个删除按钮的时候的处理逻辑
 * 获取哪个城市数据被删，删除数据，更新表格显示
 */
function delBtnHandle(event) {
  var trigger = event.target;
  var key;

  if(trigger.innerText === '删除'){
    console.log(trigger.parentNode.firstChild.innerText);
    key = trigger.parentNode.firstChild.innerText;
    delete aqiData[key];
    renderAqiList();
  }

  // do sth.

}

function init() {

  // 在这下面给add-btn绑定一个点击事件，点击时触发addBtnHandle函数
  var add_btn = document.getElementById('add-btn');
  add_btn.addEventListener('click',addBtnHandle);
  // 想办法给aqi-table中的所有删除按钮绑定事件，触发delBtnHandle函数
  var del_btn = document.getElementById('aqi-table');
  del_btn.addEventListener('click',delBtnHandle);
}

init();
