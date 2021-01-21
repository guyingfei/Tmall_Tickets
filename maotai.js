
//重新打开购物车
function reopenCart(){
	console.log("重新打开购物车");
	
	if(document.location.hostname.indexOf("tmall") >= 0){
		// cart.tmall.com
		document.location.href = "https://cart.tmall.com/";
	}else{
		// cart.taobao.com
		document.location.href = "https://cart.taobao.com/";
	}
}

//检测网页状态
function checkDocumentState(callback){
	if(document.readyState == "complete"){
		callback && callback();
	}else{
		setTimeout( function(){checkDocumentState(callback);},20);
	}
}

//检测状态
function checkElementState(path,callback){
	var ele = document.querySelector(path);
	if(ele){
		callback && callback();
	}else{
		console.log('异步加载元素中....' + path );
		setTimeout( function(){checkElementState(path,callback);},50);
	}
}

// 格式化时间
function time2string(time){
	var timestr = "";
	if(time){
		timestr = time.getFullYear().toString() + "-" +
			(time.getMonth() + 1).toString() +
			"-" + time.getDate() + " " + time.getHours() +
			":" + time.getMinutes() + ":" + time.getSeconds() + "." + time.getMilliseconds();
	}
	return timestr;
}

//结算
function checkOut(){
	console.log('结算开始....');

	var btn = document.getElementById('J_Go');
	if(btn){
		console.log("时间: "+time2string(new Date()))
		btn.click();
	}else{
		console.log('结算按钮没找到');
	}
	
}

function checkOutAsync(){
	checkElementState('#J_Go',checkOut);
}

//提交订单
function submitOrder(){
	var btn = document.querySelector(".go-btn");
	if(btn){
		console.log('提交订单...');
		btn.click();
	}else{
		console.log('提交订单按钮没找到，重新下单...');
		reopenCart();
	}
}

//目标时间
var diff = 0;
var dDate = new Date();  //10点和20点开抢
if( dDate.getHours() < 10 ){
	dDate.setHours(9,59,59,200);
}else{
	dDate.setHours(19,59,59,200);
}
// for debugger
// dDate.setSeconds( dDate.getSeconds() + 10 );

//进入时间判断循环
function enterTimeCheckLoop(callback){
	var date = new Date();
	diff = dDate.getTime() - date.getTime();
	
	// console.log("时间: "+time2string(new Date()))
	// if(diff < 20000 )
	// 	console.log(diff);
	
	if(diff < - 20000 ){
		console.log('时间过了！');
	}else if(diff < 50 ) {
		console.log('时间到了！！！');

		callback && callback();
	}else{
		setTimeout(function(){ enterTimeCheckLoop(callback);},20);
	}
}
//选择全部商品
function checkSelected(callback){
	btngo = document.getElementById('J_Go');
	if(btngo){
		console.log("submit button class: " + btngo.attributes.class.value)
		if (btngo.attributes.class.value.indexOf("disabled")==-1){
			// submit-btn
			console.log("已经勾选茅台")
			callback && callback();
		}else{
			// submit-btn submit-btn-disabled
			console.log("继续检查勾选结果");
			setTimeout(function(){ checkSelected(callback);},20);
		}
	}else{
		console.log("没有找到结算按键，重新打开购物车");
		reopenCart();
	}
}


//选择全部商品
function selectAllProduct(callback){
	console.log("selectAllProduct");

	checkElementState(".J_CheckBoxItem", function(){
		var items = document.querySelectorAll(".J_CheckBoxItem");
		if(items){
			for(var i=0;i<items.length;i++){
				console.log("选择物品: "+i);
				items[i].click();
			}

			checkSelected(callback);
		}else{
			console.log("没有找到商品选择按键，重新打开购物车");
			reopenCart();
		}
	})
	
	// checkElementState("[title*='飞天53度']", function(){
	// 	allselector = document.getElementById("J_SelectAllCbx1");
	// 	if(allselector){
	// 		setTimeout(function(){
	// 			allselector.click();
	// 			//wait the click action finish
	// 			checkSelected(callback);
	// 		}, 200);
	// 	}else{
	// 		console.log("没有找到全选按键，重新打开购物车");
	// 		reopenCart();
	// 	}
	// })
}

// 检查是否遇到问题
function checkBlocker(callback){
	// console.log("checkBlocker");
	var title = document.title;
	var body_text = document.body.innerText;
	var title_checks = ["验证码", "拦截", "错误", "失败"];
	// var title_checks = ["购物车"];
	var text_checks = ["休息会呗", "坐下来喝口水", "马上回来", "马上就好", "小二正忙", "拥堵", "客官别急", "人数过多", "稍后再试"];
	// var text_checks = ["飞天"];
	
	for(var i=0; i<title_checks.length; i++){
		if(title.indexOf(title_checks[i]) > -1){
			console.log("标题检查到：" + title_checks[i]);
			callback && callback();
			return;
		}
	}
	
	for(var i=0; i<text_checks.length; i++){
		if(body_text.indexOf(text_checks[i]) > -1){
			console.log("页面检查到：" + text_checks[i]);
			callback && callback();
			return;
		}
	}
	setTimeout(function(){ checkBlocker(callback);},100);
}

//主要函数
function main(){
	console.log('############################开始抢购茅台############################');

	checkDocumentState(function(){
		var href = window.location.href;
		var hostname = window.location.host;
		checkBlocker(function(){
			console.log("遇到拥堵或者问题，重新打开购物车")
			reopenCart();
		})
		if(hostname.indexOf('cart.tmall.com') > -1 || hostname.indexOf('cart.taobao.com') > -1){
			//结算页面
			console.log('结算页面，加载完成');
			selectAllProduct(function(){
				console.log("开始等待抢购时间到达...");
				// checkOutAsync();
				enterTimeCheckLoop( checkOutAsync );

				// Just for debuging
				// setTimeout(function(){ reopenCart(); },1000);
			});
		}else if((hostname.indexOf('buy.tmall.com') > -1 && href.indexOf('buy.tmall.com/order') > -1)
		  || (hostname.indexOf('buy.taobao.com') > -1 && href.indexOf('buy.taobao.com/order') > -1)){
			//提交订单页面
			console.log('订单页面，加载完成');

			submitOrder();
		}
	})
}


main();