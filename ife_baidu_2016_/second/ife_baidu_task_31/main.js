var form = document.forms.opt;
var radios = form.isstudent;
var school = document.getElementById('box-school');
var company = document.getElementById('box-company');

function changeBox(){
	var value = radios.value;
	if(value == 'student'){
		school.style.display = 'block';
		company.style.display = 'none';
	}else{
			school.style.display = 'none';
			company.style.display = 'block';
	}
}
for (var i = 0; i < radios.length; i++) {
	radios[i].addEventListener('click',function(){
		changeBox();
	});
}

var data = {
	'西安':{
		'矿大':{},
		'交大':{}
	},
	'汉中':{
		'汉大':{},
		'护校':{}
	}
};
var sCity = form['s-city'];
var sSchool = form['s-school'];

function fillOption(data,select){
	if(!data){
		return;
	}
	for(i in data){
		var opt = new Option(i,i);
		select.appendChild(opt);
	}
}
function cleanOption(select){
	var children = select.children;
	for (var i = children.length-1; i > 0; i--) {
		select.removeChild(children[i]);
	}
}
fillOption(data,sCity);
sCity.addEventListener('change',function(){
	var value = sCity.value;
	cleanOption(sSchool);
	fillOption(data[value],sSchool);
});
