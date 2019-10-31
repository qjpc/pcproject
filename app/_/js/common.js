
var site_app = 'http://huankuan.crito.cn/';
/*判断输入是否为合法的手机号码*/
function isphone(inputString) {
	var partten = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
	var fl = false;
	if(partten.test(inputString)) {
		//alert('是手机号码');
		return true;
	} else {
		return false;
		//alert('不是手机号码');
	}
}



/*判断是否为身份证号*/ 
function isCardNo(card)  {  
   var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;  
   if(reg.test(card) )  {    
       return true;  
   }else{
	   return false;
   }
}  

/*验证是否是真实姓名*/ 
function isName(name){
	var regName =/^[\u4e00-\u9fa5]{2,4}$/; 
	if(regName.test(name)){   
     	return true;  
 	} else{
		 return false;
	 }
}


function getToken() {

	var token = localStorage.getItem("token"); //获取
	if(!token) {
		mui.openWindow({
			url: "../login/login.html",
			id: "login",
			styles: {},
			extras: {},
			show: {
				autoShow: true, //页面loaded事件发生后自动显示，默认为true
			},
			waiting: {
				//autoShow: true, //自动显示等待框，默认为true
				//title: '安全检测中，请等待', //等待对话框上显示的提示内容
			}
		})
	}
	return token;
}


function checkUpdate(is_toast){
	var system;
	if(mui.os.ios) {
		system = "ios"
	} else if(mui.os.android) {
		system = "android"
	}
	plus.runtime.getProperty(plus.runtime.appid, function(wgtinfo) {
		version = wgtinfo.version;
		mui.ajax(site_app + '/api/Common/version', {
			async: false,
			data: {
				os: system,
				version: version,
			},
			type: 'POST', //HTTP请求类型
			success: function(data) {
				if(data.error == 0) {
					if(data.data.code == 0) {
						//判断是否静默更新
						if (data.data.is_silent==1) {
							downWgt( data.data.wgt_url,false)
						} else {
							mui.confirm('已有最新版本，是否更新版本！', '温馨提示', ['取消', '升级'], function (e) {
								if (e.index == 0) {
									if (data.data.is_must == 1) {
											plus.runtime.quit();
										}
								}
								if (e.index == 1) {
									if (data.data.app_url) {
										var app_url = encodeURI(data.data.app_url)
										plus.runtime.openURL(app_url)
										if (data.data.is_must == 1) {
											plus.runtime.quit();
										}
									} else {
										downWgt(data.data.wgt_url,true)
									}

								}
							}, 'div');
						}
					}else{
						if(is_toast){
							mui.toast('您当前已是最新版本');
						}
					}
				}
			},
			error: function(xhr, error, errorThrown) {
				console.log(error);
			}
		});
	});
}

function downWgt(paths,tips) {
	if(tips){
		$(".update-view,.mengban").show();
	}
	var dtask = plus.downloader.createDownload(paths, {}, function(d, status) {
		if(status == 200) {
			installWgt(d.filename,tips);
			clearInterval(i);
			$(".update-view,.mengban").hide();
		} else {
			plus.nativeUI.alert("下载更新资源失败！");
		}

	});
	dtask.addEventListener("statechanged", function(d, status) {
		var total = parseInt(d.totalSize);
		var cur = parseInt(d.downloadedSize);
	}, false);
	dtask.start();
	var i = setInterval(function() {
		var totalSize = dtask.totalSize;
		var downloadedSize = dtask.downloadedSize;
		$('#proDownFile').attr('value', downloadedSize);
		$('#proDownFile').attr('max', totalSize);
	}, 100);
}

// 安装wgt方法
function installWgt(path,tips) {
	if(tips){
		plus.nativeUI.showWaiting("更新中...");
		plus.runtime.install(path,{force:true},function(){
			plus.nativeUI.closeWaiting();
			console.log("更新成功！");
			plus.nativeUI.alert("更新完成！",function(){
				plus.runtime.restart();
			});
		},function(e){
			plus.nativeUI.closeWaiting();
			console.log("更新失败["+e.code+"]："+e.message);
			plus.nativeUI.alert("更新失败["+e.code+"]："+e.message);
		});
	}else{
		plus.runtime.install(path,{force:true},function(){
			console.log("静默更新！");
		},function(e){
			console.log("静默更新失败["+e.code+"]："+e.message);
		});
	}

}



