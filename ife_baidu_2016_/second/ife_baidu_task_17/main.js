/* 数据格式演示
var aqiSourceData = {
  "北京": {
    "2016-01-01": 10,
    "2016-01-02": 10,
    "2016-01-03": 10,
    "2016-01-04": 10
  }
};
*/

// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
  var y = dat.getFullYear();
  var m = dat.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  var d = dat.getDate();
  d = d < 10 ? '0' + d : d;
  return y + '-' + m + '-' + d;
}
function randomBuildData(seed) {
  var returnData = {};
  var dat = new Date("2016-01-01");
  var datStr = ''
  for (var i = 1; i < 92; i++) {
    datStr = getDateStr(dat);
    returnData[datStr] = Math.ceil(Math.random() * seed);
    dat.setDate(dat.getDate() + 1);
  }
  return returnData;
}

var aqiSourceData = {
  "北京": randomBuildData(500),
  "上海": randomBuildData(300),
  "广州": randomBuildData(200),
  "深圳": randomBuildData(100),
  "成都": randomBuildData(300),
  "西安": randomBuildData(500),
  "福州": randomBuildData(100),
  "厦门": randomBuildData(100),
  "沈阳": randomBuildData(500)
};

// 用于渲染图表的数据

var chartData = {};

// 记录当前页面的表单选项
var pageState = {
  nowSelectCity: '北京',
  nowGraTime: "day"
};
/**
 * 渲染图表
 */
function renderChart() {
  initAqiChartData();
  var time = pageState.nowGraTime;
  var box = document.getElementsByClassName('aqi-chart-wrap')[0];
  box.innerHTML = '';
  var column = document.createElement('div');
  // 样式设置
  column.style['border'] = '1px solid #fff';
  column.style['display'] = 'inline-block';
  column.style['background-color'] = '#233';
  column.style.width = '5px';
  if(time != 'day'){
    time == 'week' ? column.style.width = '20px' : column.style.width = '50px';
  }

  for(var i in chartData){
    var newCol = column.cloneNode(true);

    var height = chartData[i] + 'px';
    var title = i + "\n" + chartData[i];
    newCol.style.height = height;

    newCol.setAttribute('title', title);

    box.appendChild(newCol);

  }
}

/**
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange(event) {
  // 确定是否选项发生了变化
  var time = event.target.value;
  if(!time || time == pageState.nowGraTime) return;
  // 设置对应数据
  pageState.nowGraTime = time;
  // 调用图表渲染函数
  renderChart();
}
/**
 * select发生变化时的处理函数
 */
function citySelectChange(event) {
  // 确定是否选项发生了变化
  var city = event.target.value;
  if(city == pageState.nowSelectCity) return;
  // 设置对应数据
  pageState.nowSelectCity = city;
  // 调用图表渲染函数
  renderChart();
}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {
  var box = document.getElementById('form-gra-time');
  box.addEventListener('click',graTimeChange);
}

/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
  // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
  var box = document.getElementById('city-select');
  box.innerHTML = '';
  for(var i in aqiSourceData){
    var opt = new Option(i,i);
    box.appendChild(opt);
  }
  // 给select设置事件，当选项发生变化时调用函数citySelectChange
  box.addEventListener('change',citySelectChange);

}

/**
 * 初始化图表需要的数据格式
 */
function initAqiChartData() {
  // 将原始的源数据处理成图表需要的数据格式
  // 处理好的数据存到 chartData 中
  var outputData,
      city = pageState.nowSelectCity,
      time = pageState.nowGraTime;
      inputData = aqiSourceData[city];
  switch(time){
    case 'day':  // 当时间选项为day时
      outputData = inputData;
      break;
    case 'week':  // 当时间选项为week时
      outputData = {};
      dateRange='';
      value = 0;
      times = 0;

      for(var i in inputData){
        if(!dateRange){dateRange = i;}  //若dateRange为空，则添加range前半段

        var dateList = i.split('-');
        var date = new Date(dateList[0],dateList[1]-1,dateList[2]);
        var weekDay = date.getDay();

        value = value + inputData[i];
        times +=1;

        if(weekDay==6){  // 当星期大于7，添加range后半段->添加一条数据->初始化标记
          dateRange =  dateRange + "<-->" + i;
          outputData[dateRange] = Math.round(value/times);
          // 初始化标记
          dateRange = '';
          value = 0;
          times = 0;
        }
      }
      break;
    case 'month':
      outputData = {};
      dateRange='';
      value = 0;
      times = 0;

      for(var i in inputData){

        var dateList = i.split('-');
        var date = new Date(dateList[0],dateList[1]-1,dateList[2]);
        var dayNum= date.getDate();
        var lastDayNum = new Date(dateList[0],dateList[1],0).getDate();

        value = value + inputData[i];
        times +=1;
        if(dayNum==lastDayNum){  // 当星期等于7，添加range后半段->添加一条数据->初始化标记
          var month = dateList.slice(0,2).join('-');
          dateRange =  dateRange + "<-->" + i;
          outputData[month] = Math.round(value/times);
          // 初始化标记
          value = 0;
          times = 0;
        }
      }
      break;
  }

  chartData = outputData;
}

/**
 * 初始化函数
 */
function init() {
  initGraTimeForm();
  initCitySelector();
  initAqiChartData();
  renderChart();
}

init();
