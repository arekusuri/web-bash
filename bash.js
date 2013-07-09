var terminal
var login_user = ""
var file_sys_root;

function load_bash(){
	add_css();
	printwelcome();
	$("body").keypress(keypress_handler);
	$('body').bind("keydown", keydown_handler);
	install_file_system();
}
function add_css(){
	var head = $("head")
	head.append('<link rel="stylesheet" type="text/css" href="bash.css" />')
}
function printwelcome(){
	terminal = $(".terminal");
	terminal.append("<p>&nbsp;</p>")
	terminal.append("<p>***********  Welcome to web bash! *******</p>")
	terminal.append("<p>***********  Take a bath on web. &nbsp;*******</p>")
	terminal.append("<p>&nbsp;</p>")
	terminal.append('<p>Press "Enter" to login as guest...</p>')
	terminal.append("<p>login: <span class='cursor'>&nbsp;</span></p>")
}
function create_ps(){
	return login_user + "@web-bash $ "
}
function create_cursor(){
	var cursor = $("<span class='cursor'>&nbsp;</span>")
	return cursor[0]
}
function add_prompt_line(){
	var new_p = $('<p>');
	new_p.append(create_ps())
	new_p.append(create_cursor())
	terminal.append(new_p)
}
function print_text(text){
	var new_p = $('<p>');
	new_p.append(text)
	terminal.append(new_p)
}
function print_html(html){
	var new_p = document.createElement('p');
	new_p.innerHTML = html
	terminal.append(new_p)
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
	p.contents().slice(1,-1).each( function () {
		text += this.textContent;
	});
	return text
}
function keydown_handler(e){
	if (e.which === 8 || e.which === 46){
		var current_p = $(".cursor").parent();
		if(current_p.contents().length > 2){
			current_p.contents().slice(-2,-1).remove()
		}
		return false;
	}
}
function keypress_handler(e){
	if (e.keyCode == 12 && e.ctrlKey == true){
		clear();
		add_prompt_line()
	}else if (e.keyCode == 13){
		var current_p = $(".cursor").parent()
		var input = get_input(current_p)
		if (current_p.contents()[0].textContent == "login: "){
			if (input == "") {
				login_user = "guest"
			}else{
				login_user = input
			}
		}else{
			input == input.trim();
			if (input==""){
			}else if (input=="ls" || input.match("^ls ")){
				ls(input);
			}else if(input=="help"){
				print_text("comming soon...")			
			}else if(input.match("^cd/*\.*$") || input.match("^cd ")){
				cd(input);
			}else if(input=="man"){
				print_text("comming soon...")			
			}else if(input=="pwd"){
				pwd();
			}else if (input=="clear"){
				clear();
			}else if(["exit","quit","logout"].indexOf(input) >= 0){
				exit();
				return;
			}else{
				print_text("-bash: "+input+": command not found")			
			}
		}
		$(".cursor").remove()
		add_prompt_line()
	} else{
		var current_p = $(".cursor").parent()
		cursor = $(".cursor")
		$(".cursor").remove()
		current_p.append(getchar(e))
		current_p.append(cursor)
	}
	window.scrollTo(0, document.body.scrollHeight);
}
function install_file_system(){
	install_file_system_adv()
	return
	if(localStorage.getItem("/")){
		return;
	}
	root = [["bin","d"],["etc","d"], ["home","d"],["var","d"],["tmp","d"], ["file","f"]]
	var v = JSON.stringify(root)
	localStorage.setItem("/", JSON.stringify(root));  
	localStorage.setItem("/home/", JSON.stringify([["guest","d"],["test","f"]]));  
	localStorage.setItem("/home/guest/", JSON.stringify([]));  
}
function dirobj(name,parent){
	this.name = name;
	this.type = "d";
	this.children_name = [];
	this.children_data = {};
	dirobj.prototype.add_child = function(obj){
		obj.parent = this
		this.children_name.push(obj.name)	
		this.children_data[obj.name] = obj;
	};
	if(typeof(parent)==='undefined'){
		this.parent =  null;
	}else{
		this.parent = parent;
		parent.add_child(this);
	}
}
function fileobj(name,parent,content){
	if(typeof(content)==='undefined') content = null;
	this.name = name;
	this.type = "f";
	this.filedata = content;
	if(typeof(parent)==='undefined'){
		this.parent = null;
	}else{
		this.parent = parent;
		parent.add_child(this);
	}
}
var current_work_dir;
function install_file_system_adv(){
	file_sys_root 	= new dirobj("/");
	var home 	= new dirobj("home", file_sys_root);
	var tmp 	= new dirobj("tmp", file_sys_root);
	var guest 	= new dirobj("guest", home);
	var testfile 	= new fileobj("testfile", file_sys_root, "test content");
	current_work_dir = file_sys_root;
}
function ls(cmd){
	var target;
	if (cmd.length > 2){
		return;
		target = cmd.slice(2).trim();
		if (target.indexOf("/") != 0){
			target = current_work_dir + target
		}
	}else{
		target = current_work_dir
	}
	var str = "";
	target.children_name.forEach(function(ele){
		if(current_work_dir.children_data[ele].type == "d"){
			str += "<span class='dir'>" + ele + "&nbsp;</span>"
		}else{
			str += "<span class='file'>" + ele + "&nbsp;</span>"
		}
	});
	print_text(str);

}
function clear(){
	terminal.children().each(function(){
		this.remove();
	});
}
function pwd(){
	var str = "";
	for (var node = current_work_dir; node != null; node = node.parent){
		str = node.name + "/" + str;
	}
	str = str.slice(1);
	print_html(str)
}
function cd(cmd){
	var success = true;
	if(cmd.length == 2){
		cd("cd /home/" + login_user);
	}else{
		target = cmd.slice(2,cmd.length).trim();
		var crr_dir;
		if(target.indexOf("/") != 0){
			crr_dir = current_work_dir;
		}else{
			crr_dir = file_sys_root;
		}
		target.split("/").forEach(function(ele){
			if(ele == "" || ele == "."){
				return true;
			}
			if(crr_dir.children_name.indexOf(ele) >= 0){
				if(crr_dir.children_data[ele].type == "d"){
					crr_dir = crr_dir.children_data[ele];
				}else{
					print_text("-bash: " + target + " is not a legal directory.")
				}
			}else if(ele == ".."){
				if(crr_dir.parent != null){
					crr_dir = crr_dir.parent;
				}else{
					print_text("-bash: " + target + " is not a legal directory.")
				}
			}else{
				success = false;
				return false;
			}
		});
		if (success){
			current_work_dir = crr_dir;
		}else{
			print_text("-bash: " + target + " is not a legal directory.")
		}
	}
}
function exit(){
	clear();
	printwelcome();
}
