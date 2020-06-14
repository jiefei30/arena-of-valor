//本地存储的所有对象
var USERS
//本地存储的所有英雄
var HEROES
//注册成功时的定时器
var t1
//登录成功时的定时器
var t2
//增加英雄成功时的定时器
var t3
//修改英雄成功时的定时器
var t4
//当前登录的账号
var curNumber = localStorage.getItem("rememberMe")
//当前选择的英雄id
var curHeroid
//当前选择的英雄的位置
var curHeroImg
//英雄定位
var position = ["坦克","战士","刺客","法师","射手","辅助"]

//这里面的三个对象只会被创建一次
window.onload=function (){
	//如果本地储存里没有users总对象
	if(localStorage.getItem("users")==null){
		let users = new Object();
		let str = JSON.stringify(users); 
		localStorage.setItem("users", str)
	}
	//如果本地储存里没有heroes总对象
	if(localStorage.getItem("heroes")==null){
		let heroes = new Object();
		let str = JSON.stringify(heroes); 
		localStorage.setItem("heroes", str)
	}
	//记住我登录
	if (localStorage.getItem("rememberMe")) {
		curNumber = localStorage.getItem("rememberMe")
		logining(USERS[curNumber])
	}
	//英雄数量
	if (localStorage.getItem("number")) {
		localStorage.setItem("number", 0)
	}
	
}

//文档就绪函数
$(document).ready(function(){
	//把总用户拿出来
	USERS = JSON.parse(localStorage.getItem("users"));
	//把总英雄拿出来
	HEROES = JSON.parse(localStorage.getItem("heroes"));
	//把注册成功警示框隐藏
	$('#regSuccessAlert').hide();
	//把修改信息成功警示框隐藏
	$('#mdfSuccessAlert').hide();
	//把修改信息失败警示框隐藏
	$('#mdfWarningAlert').hide();
	//把增加英雄成功警示框隐藏
	$('#addSuccessAlert').hide();
	//把修改英雄信息成功警示框隐藏
	$('#heroMdfSuccessAlert').hide();
	//把修改英雄信息失败警示框隐藏
	$('#heroMdfWarningAlert').hide();
	//更改头像
	$('.headIcons').click(function() {
		let cur = $('.headIcons').attr('src').charAt(11)
		if(cur==5){
			$('.headIcons').attr('src','images/head1.jpg')
		}else{
			$('.headIcons').attr('src','images/head'+(parseInt(cur)+1)+'.jpg')
		}
	})
	//关闭注册模态框（把里面的组件恢复初始值）
	$('.regModalClose').click(function () {
		if(t1) clearTimeout(t1)
		$('#regHeadIcon').attr('src','images/head1.jpg')
		$('#phonenumber').val("")
		$('#username').val("")
		$('#password').val("")	
		$('#phonenumber').popover('hide');	
		$('regSuccessAlert').hide()
		$('#regSubmit').removeClass('disabled')
	})
	//关闭登录模态框（把里面的组件恢复初始值）
	$('.logModalClose').click(function () {
		$('#logPhonenumber').val("")
		$('#logPassword').val("")	
		$('#logPhonenumber').popover('hide');	
		$('#logPassword').popover('hide');	
	})
	//关闭修改模态框（把里面的组件恢复初始值）
	$('.mdfModalClose').click(function () {
		if(t2) clearTimeout(t2)
		$('#mdfHeadIcon').attr('src','images/head'+USERS[curNumber].headicon+'.jpg')
		$('#changePassword').attr('class','btn btn-danger')
		$('#mdfPassword').attr('readonly','readonly')
		$('#mdfUsername').val(USERS[curNumber].username)
		$('#mdfPassword').val(USERS[curNumber].password)	
		$('#mdfSuccessAlert').hide()
		$('#mdfWarningAlert').hide()
		$('#mdfPhonenumber').popover('hide');	
		$('#mdfPassword').popover('hide');	
		$('#mdfSubmit').removeClass('disabled')
	})
	//关闭增加英雄模态框（把里面的组件恢复初始值）
	$('.addModalClose').click(function() {
		if(t3) clearTimeout(t3)
		$('#addSuccessAlert').hide();
		$('#imgsrc').val('')
		$('#heroname').val('')
		$('#position').val('坦克')
		$('#heroname').popover('hide');	
		$('#addSubmit').removeClass('disabled')
	})
	//关闭修改英雄模态框（把里面的组件恢复初始值）
	$('.heroMdfModalClose').click(function() {
		if(t4) clearTimeout(t4)
		$('#heroMdfSuccessAlert').hide();
		$('#heroMdfWarningAlert').hide();
		$('#curHeroname').popover('hide');	
		$('#heroMdfSubmit').removeClass('disabled')
	})
	//登出按钮
	$('#logout').click(function () {
		curNumber = undefined
		$('#modify').toggleClass('disabled')
		$('#logout').toggleClass('disabled')
		$('#btnLogin').toggleClass('disabled')
		$('#btnReg').toggleClass('disabled')
		$('#curName').text('')
		$('#curIcon').attr('src','images/avatar1.jpg')
		localStorage.setItem("rememberMe",'')
		$('#mask').toggleClass('displayNone')
		$('#myTip').text('（请登陆后进行修改）')
	})
	//确认修改密码
	$('#changePassword').click(function() {
		$('#changePassword').toggleClass('disabled')
		$('#mdfPassword').removeAttr('readonly')
	})
	//点击头像
	$('#curIcon').click(function() {
		if(curNumber) $('#modify').click()
			else $('#btnLogin').click()
	})
	//把英雄更新
	update(6,'')
});

//创建一个用户
function createUser(icon,number,name,word) {
	var user = {
		headicon : icon,
		phonenumber : number,
		username : name,
		password : word
	};
	return user
}

//往本地存储添加一个用户
function localAddUser(user){
	let phonenumber = user.phonenumber
	delete user.phonenumber
	USERS[phonenumber] = user;
	updateUSERS()
}


//检测登录
function RegExpLogin() {
	let phonenumber = $('#logPhonenumber').val()
	let password = $('#logPassword').val()
	//如果有这个用户
	if (USERS[phonenumber]) {
		if(USERS[phonenumber].password!=password)
		{
			$('#logPassword').popover('show');	
			return false
		}else{
			//把登录者的号码保存
			curNumber = phonenumber
			//开始登录
			logining(USERS[phonenumber])
			//如果选择了记住我
			if($('#rememberMe').is(':checked'))	localStorage.setItem("rememberMe", phonenumber)
			//关掉模态框
			$('.logModalClose').click()
			return true
		}
	}else{
		$('#logPhonenumber').popover('show');	
			return false
	}
}


//登录成功
function logining(user) {
	$('#modify').toggleClass('disabled')
	$('#logout').toggleClass('disabled')
	$('#btnLogin').toggleClass('disabled')
	$('#btnReg').toggleClass('disabled')
	$('#curName').text(user.username)
	$('#curIcon').attr('src','images/head'+user.headicon+'.jpg')
	$('#mdfHeadIcon').attr('src','images/head'+user.headicon+'.jpg')
	$('#mdfPhonenumber').val(curNumber)
	$('#mdfUsername').val(user.username)
	$('#mdfPassword').val(user.password)
	$('#mask').toggleClass('displayNone')
	$('#myTip').text('（请不要调皮的乱搞）')
}


//检测注册
function RegExpRegister() {
	let headicon =  $('#regHeadIcon').attr('src').charAt(11)
	let phonenumber = $('#phonenumber').val()
	let username = $('#username').val()
	let password = $('#password').val()

	//如果有这个用户（不为undifined ）
	if(USERS[phonenumber]){
		//显示弹出框
		$('#phonenumber').popover('show');
		$('#phonenumber').focus()
		return false
	}
	else {
		localAddUser(createUser(headicon,phonenumber,username,password))
		//显示注册成功
		$('#regSuccessAlert').show()
		$('#regSubmit').addClass('disabled')
		//自动登录
		t1 = setTimeout(function() {
		curNumber = phonenumber
		logining(USERS[phonenumber])	
		//关掉模态框
		$('.regModalClose').click()
		},3000)
		return true
	}
}

//检测用户信息修改
function mdfUserInf() {
	let headicon =  $('#mdfHeadIcon').attr('src').charAt(11)
	let username = $('#mdfUsername').val()
	let password = $('#mdfPassword').val() 

	let user = USERS[curNumber]
	//如果没有做出修改
	if(headicon == user.headicon && username == user.username && password == user.password){
		$('#mdfWarningAlert').show()
		return false
	}else{
		$('#curIcon').attr('src','images/head'+headicon+'.jpg')
		$('#curName').text(username)
		user.headicon = headicon
		user.username = username
		user.password = password
		USERS[curNumber] = user
		updateUSERS()
		$('#mdfWarningAlert').hide()
		$('#mdfSuccessAlert').show()
		$('#mdfSubmit').addClass('disabled')
		//1秒钟后自动关闭
		t2 = setTimeout(function() {
			$('.mdfModalClose').click()
		},1000)
		return true
	}
}


//创建一个英雄
function createHero(src,name,position) {
	var hero = {
		heroid : (parseInt(localStorage.number)+1),
		heroname : name,
		imgsrc : src,
		position : position
	};
	return hero
}

//往本地存储添加一个英雄
function localAddHero(hero){
	let heroid = hero.heroid
	HEROES[heroid] = hero;
	updateHEROES()
	localStorage.number = heroid
}

//模态框新增一个英雄
function addHero() {
	var heroname = $('#heroname').val()
	var imgsrc = $('#imgsrc').val()
	var position = $("#position").get(0).selectedIndex;
	//检测用户名是否重复
	for(var i in HEROES){
		if(HEROES[i].heroname==heroname) {
			$('#heroname').popover('show');
			return false;
		}
	}
	localAddHero(createHero(imgsrc,heroname,position))
	$('#addSuccessAlert').show();
	$('#addSubmit').addClass('disabled')
	$('#radios6').click()
	update(6,'')
	t3 = setTimeout(function() {
		$('.addModalClose').click();
	},1000)
	return true;
}

//获取点击英雄信息
function getHeroInf(heroBlock) {
	curHeroImg = heroBlock
	curHeroid = $(heroBlock).attr('name')
	var hero = HEROES[curHeroid]
	$('#curHeroImg').attr('src',hero.imgsrc)
	$('#curHeroid').val(hero.heroid)
	$('#curHeroname').val(hero.heroname)
	$('#curImgsrc').val(hero.imgsrc)
	// let position = JSON.parse(localStorage.getItem("position"));
	$('#curPosition').val(position[hero.position])
}

//检测英雄信息修改
function mdfHeroInf() {
	//是否选中删除英雄
	if($('#deleteHero').is(':checked')){
		delete HEROES[curHeroid]
		updateHEROES()
		update(6,'')
		$('.heroMdfModalClose').click()
		return
	}
	let heroname = $('#curHeroname').val()
	let imgsrc =  $('#curImgsrc').val()
	let position = $("#curPosition").get(0).selectedIndex;
	let hero = HEROES[curHeroid]
	//判断是否做出修改
	if(hero.heroname == heroname && hero.imgsrc == imgsrc && hero.position == position){
		$('#heroMdfWarningAlert').show()
		return false
	}
	//如果修改了名字
	if(hero.heroname != heroname)
	for(var i in HEROES){
		if(HEROES[i].heroname == heroname){
			$('#curHeroname').popover('show')
			return false
		}
	}
		hero.heroname = heroname;
		hero.imgsrc = imgsrc;
		hero.position = position;
		HEROES[curHeroid] = hero;
		updateHEROES();
		$('#heroMdfWarningAlert').hide()
		$('#heroMdfSuccessAlert').show()
		$('#curHeroImg').attr('src',imgsrc)
		$('#heroMdfSubmit').addClass('disabled')
		$(curHeroImg).next().text(heroname)
		$(curHeroImg).attr('src',imgsrc)
		t4 = setTimeout(function() {
			$('.heroMdfModalClose').click()
		},1000)
		return true
}
//创建新的一行
function createRow() {
	var div = $("<div></div>").addClass('row');
	return div
}
//添加新一列
function createBlock(){
	var div = $("<div></div>").addClass('col-md-2 heroBlock');
	return div
}
//加图片
function addImg(src,heroid){
	var img = $("<img></img>").attr('src',src)
	$(img).addClass('herolist-img')
	$(img).attr({
		'data-toggle' : "modal",
		'data-target' : '#heroMdfModal',
		'onclick' : 'getHeroInf(this)',
		'name' : heroid
	});
	return img
}
//加名字
function addName(name) {
	var p = $('<p></p>').text(name)
	$(p).addClass('text-center')
	return p
}
//整合
function createHeroBlock(hero) {
	let block = createBlock();
	$(block).append(addImg(hero.imgsrc,hero.heroid))
	$(block).append(addName(hero.heroname))
	return block
}
//添加英雄块
function createAddBtn() {
	let block = createBlock();
	var img = $("<img></img>").attr('src','images/0.jpg')
	$(img).addClass('herolist-img')
	$(img).attr({
		'data-toggle' : "modal",
		'data-target' : '#addModal'
	});
	$(block).append(img)
	$(block).removeClass('heroBlock')
	return block
}
//更新英雄
function update(position,search) {
	$('#heroContainer').empty();
	var blockNumber=0
	var row
	var ahero
	for (var i in HEROES) {
		ahero = HEROES[i]
		//如果加够6个就要换行
		if(blockNumber%6==0){
			//把上一行提交
			if(blockNumber!=0) $('#heroContainer').append(row)
			row = createRow()
		}
		if((!ahero.heroname.indexOf(search)) && (ahero.position==position || position==6)){
			blockNumber++;
			$(row).append(createHeroBlock(ahero))
		}
	}
	//添加增加英雄块
	if(blockNumber%6==0){
		if(blockNumber!=0)$('#heroContainer').append(row)
		row = createRow()
	}
	$(row).append(createAddBtn())
	$('#heroContainer').append(row)
}
//更新本地存储的总用户
function updateUSERS() {
	let str = JSON.stringify(USERS)
	localStorage.users = str
}
//更新本地存储的总英雄
function updateHEROES(S) {
	let str = JSON.stringify(HEROES)
	console.log(str)
	localStorage.heroes = str
}
//定位搜索
function positionSearch(radios) {
	let position = $(radios).attr('value')
	$('#search').val('')
	update(position,'')
}
//名字搜索
function nameSearch(a) {
	let name = $(a).prev().val();
	$('#radios6').click()
	$(a).prev().val(name);
	update(6,name);
}
