function validate(){
	var input	= document.querySelector('#input');
	var message	= document.querySelector('.message');
	var value = input.value;
	if(!value){
		message.innerText = '姓名不能为空';
		input.className = 'nopass';
	}else if(counter(value) < 4 || counter(value) > 16){
		message.innerText = '请输入长度为 4~16 位的字符';
		input.className = 'nopass';
	}else{
		message.innerText = '名称格式正确';
		input.className = 'pass';
	}

}

function counter(str){
	var length = 0;
	for (var i = 0; i < str.length; i++) {
		var num = str.charCodeAt(i);
		if(num>=0 && num<=128){
			length+=1;
		}else{
			length+=2;
		}
	}
	return length;
}
var btn = document.querySelector('.box button');
btn.onclick = validate;
