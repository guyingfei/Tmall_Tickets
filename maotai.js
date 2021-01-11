
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

//结算
function checkOut(){
	console.log('结算开始....');

	var btn = document.getElementById('J_Go');
	if(btn){
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
	console.log('提交订单开始....');

	checkElementState('.go-btn',function(){
		var btn = document.querySelector(".go-btn");
	
		if(btn){
			btn.click();
		}else{
			console.log('提交订单按钮没找到');
		}
			
	});
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
	
	if(diff < 20000 )
		console.log(diff);
	
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
	allselector = document.getElementById("J_SelectAllCbx1");
	if(allselector){
		allselector.click();

		//wait the click action finish
		checkSelected(callback);
	}else{
		console.log("没有找到全选按键，重新打开购物车");
		reopenCart();
	}
}

//主要函数
function main(){
	console.log('############################开始抢购茅台############################');
	
	var href = window.location.href;
	if(href.indexOf('cart.tmall.com') > -1 || href.indexOf('cart.taobao.com') > -1){
		//结算页面
		checkDocumentState(function(){
			console.log('结算页面，加载完成');
			// checkElementState("[title*='飞天53度']", function(){
				selectAllProduct(function(){
					console.log("开始等待抢购时间到达...");
					// checkOutAsync();
					enterTimeCheckLoop( checkOutAsync );

					// // 每3分钟刷新一下页面，最终测试无效果
					// setTimeout(function(){
					// 	console.log("Time diff: " + diff)
					// 	if(diff > 60000){
					// 		reopenCart();
					// 	}
					// },180000);
				});
			// })
		})
	}else if(href.indexOf('buy.tmall.com/order') > -1  || href.indexOf('buy.taobao.com/order') > -1){
		//提交订单页面
		checkDocumentState(function(){
			console.log('订单页面，加载完成');

			var btn = document.querySelector(".go-btn");
			if(btn){
				console.log('提交订单...');
				btn.click();
			}else{
				console.log('提交订单按钮没找到，重新下单...');
				reopenCart();
			}
		})
	}
	
}


main();