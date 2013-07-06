function load_bash(){
	printwelcome();
	$('body').keypress(keypress_handler);
}
function printwelcome(){
	$(".terminal").append("<p>&nbsp;</p>")
	$(".terminal").append("<p>***********  Welcome to web bash! *******</p>")
	$(".terminal").append("<p>***********  Take a bath on web. &nbsp;*******</p>")
	$(".terminal").append("<p>&nbsp;</p>")
	$(".terminal").append('<p>Press "Enter" to login as guest...</p>')
	$(".terminal").append("<p>login: <span id='prompt'>&nbsp;</span></p>")
}
function create_ps(){
	var text = "/home/" + document.login_user + "/ $ "
	return document.createTextNode(text)
}
function create_prompt_char(){
	var prompt_char = document.createElement("span")
	prompt_char.setAttribute("id", "prompt")
	prompt_char.innerHTML = "&nbsp;"
	return prompt_char
}
function add_prompt_line(){
	var new_p = document.createElement('p');
	new_p.appendChild(create_ps())
	new_p.appendChild(create_prompt_char())
	$('.terminal').append(new_p)
}
function printline(text){
	var new_p = document.createElement('p');
	var line = document.createTextNode(text);
	new_p.appendChild(line)
	$('.terminal').append(new_p)
}
function terminal_onload(){
	add_prompt_line()
}
function getchar(event){
	if (event.which == null) {
		return String.fromCharCode(event.keyCode) // IE
	} else if (event.which!=0 && event.charCode!=0) {
		return String.fromCharCode(event.which)   // the rest
	} else {
		return null // special key
	}
}
function get_input(p){
	var text = ""
	for (var i = 1; i < p.childNodes.length; i++){
		var child = p.childNodes[i];
		text += child.textContent
	}
	return text
}
function keypress_handler(e){
	var prompt_char = document.getElementById('prompt');
	var current_p = prompt_char.parentNode
	$("#prompt").remove()
	if (e.keyCode == 13){
		var input = get_input(current_p)
		if (current_p.firstChild.textContent == "login: "){
			if (input == "") {
				document.login_user = "guest"
			}else{
				document.login_user = input
			}
		}else{
			if (input==""){
			}else if (input=="ls"){ printline("comming soon...")			
			}else if (input=="help"){ printline("comming soon...")			
			}else if (input=="cd"){ printline("comming soon...")			
			}else if (input=="man"){ printline("comming soon...")			
			}else if (input=="pwd"){ printline("comming soon...")			
			}else{
				printline("-bash: "+input+": command not found")			
			}
		}
		add_prompt_line()
	} else{
		var c =getchar(e)
		var new_char = document.createTextNode(c)
		current_p.appendChild(new_char)
		current_p.appendChild(prompt_char)
	}
	window.scrollTo(0, document.body.scrollHeight);
}
//function loadscript(filename){
//	var head= document.getElementsByTagName('head')[0];
//	var script= document.createElement('script');
//	script.type= 'text/javascript';
//	script.src= 'b.js';
//	head.appendChild(script);
//}
