var form = document.forms.login;

function showMsg(event){
	var target = event.target;
	var id = target.id;
	var msg = target.parentNode.querySelector('.msg');
	switch(id){
		case 'names':
		msg.innerText = '请输入名称';
		break;
		case 'password':
		msg.innerText = '请输入密码';
		break;
		case 'confrim':
		msg.innerText = '再次输入相同密码';
		break;
		case 'email':
		msg.innerText = '请输入邮箱';
		break;
		case 'phone':
		msg.innerText = '请输入电话号码';
		break;
	}
}
var inputs = form.querySelectorAll('input');
for (var i = 0; i < inputs.length; i++) {
	inputs[i].addEventListener('focus',showMsg)
}


function validateName(input){
	console.log(arguments)
	var value = input.value;
	var msg = input.parentNode.querySelector('.msg');
	if(!value){
		input.className = 'nopass';
		msg.innerText = '名称不能为空';
	}else if(value.length<4 && value.length > 10){
		input.className = 'nopass';
		msg.innerText = '名称长度应该在4~10之间';
	}else{
		input.className = 'pass';
		msg.innerText = '名称可用';
		return true;
	}
}
function validatePassWord(input){
	var value = input.value;
	var msg = input.parentNode.querySelector('.msg');
	if(!value){
		input.className = 'nopass';
		msg.innerText = '密码不能为空';
	}else if(value.length<4 && value.length>16){
		input.className = 'nopass';
		msg.innerText = '密码需要在4~16位之间';
	}else{
		input.className = 'pass';
		msg.innerText = '验证通过';
		return true;
	}
}

function validateConfrim(standard,input){
	var value = input.value;
	var msg = input.parentNode.querySelector('.msg');
	var std = standard.value;
	if(!value){
		input.className = 'nopass';
		msg.innerText = '不能为空';
	}else if(value == std){
		input.className = 'pass';
		msg.innerText = '验证通过';
		return true;
	}else{
		input.className = 'nopass';
		msg.innerText = '两次输入的密码不一致';
	}
}

function validateEmaile(input){
	var value = input.value;
	var msg = input.parentNode.querySelector('.msg');
	if(!value){
		input.className = 'nopass';
		msg.innerText = '邮箱地址不能为空';
	}else if(/.+@.+\.\w+/.test(value)){
		input.className = 'pass';
		msg.innerText = '验证通过';
		return true;
	}else{
		input.className = 'nopass';
		msg.innerText = '请输入正确的邮箱格式';
	}
}
function validatePhone(input){
	var value = input.value;
	var msg = input.parentNode.querySelector('.msg');
	if(!value){
		input.className = 'nopass';
		msg.innerText = '手机号不能为空';
	}else if(/^[0-9]{11}$/.test(value)){
		input.className = 'pass';
		msg.innerText = '验证通过';
		return true;
	}else{
		input.className = 'nopass';
		msg.innerText = '请输入正确的手机号';
	}
}


// 失去焦点事件注册
var names	= form.names;
var password	=form.password;
var confrim	= form.confrim;
var email	=form.email;
var phone	=form.phone;
var button	=form.btn;
names.addEventListener('blur',validateName.bind(null,names));
password.addEventListener('blur',validatePassWord.bind(null,password));
confrim.addEventListener('blur',validateConfrim.bind(null,password,confrim));
email.addEventListener('blur',validateEmaile.bind(null,email));
phone.addEventListener('blur',validatePhone.bind(null,phone));

button.addEventListener('click',function(event){
	event.preventDefault();
	console.log(' validateName(names)',  validateName(names));
	console.log('CONDITION PASSED');
	if( validateName(names) &&
			validatePassWord(password) &&
			validateConfrim(password,confrim) &&
			validateEmaile(email) &&
			validatePhone(phone)
){
	form.submit();
}else{
	alert('输入有误');
}
});
