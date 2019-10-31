var aniShow = {};
mui.plusReady(function() {
	//mui初始化
	mui.init({
		hardwareAccelerated: true,
	});

	plus.navigator.setStatusBarStyle('light');
	plus.navigator.setStatusBarBackground('#0085FE');
	var launchFlag_ = plus.storage.getItem("launchFlag");
	if(launchFlag_ != "true") {
		mui.openWindow({
			url: 'html/index/banner.html',
			id: 'banner',
			show: {
				aniShow: 'fade-in',
				duration: '300',
			},
			//屏蔽转场动画的等待圈圈
			waiting: {
				autoShow: false,
			}
		});
	} else {
//		plus.navigator.closeSplashscreen();
		var subpages = ['html/index/home.html', 'html/user/my_bankCard.html', 'html/share/share.html', 'html/user/user.html'];
		if($(window).width() === 375 && $(window).height() === 812 ){
			var subpage_style = {　　
				top: '0',
				　　bottom: '85px',
				　　hardwareAccelerated: true //开启硬件加速
			};
		}else{
			var subpage_style = {　　
				top: '0',
				　　bottom: '51px',
				　　hardwareAccelerated: true //开启硬件加速
			};
		}
		
		//plus.nativeUI.showWaiting("安全检测中，请等待");
		var self = plus.webview.currentWebview();
		for(var i = 0; i < subpages.length; i++) {
			var temp = {};
			var sub = plus.webview.create(subpages[i], subpages[i], subpage_style);
			if(i > 0) {
				sub.hide();
			} else {
				temp[subpages[i]] = "true";
				mui.extend(aniShow, temp);
			}
			plus.webview.show(subpages[0])   //显示home窗口
			self.append(sub);
		}
		//选项卡点击事件
		var activeTab = subpages[0];　
		var home = plus.webview.getWebviewById("html/index/home.html");
		var bankCard = plus.webview.getWebviewById("html/user/my_bankCard.html");
		var shareProfit = plus.webview.getWebviewById("html/share/share.html");
		var user = plus.webview.getWebviewById("html/user/user.html");

		mui('.mui-bar-tab').on('tap', 'a', function(e) {
			var n = $(this).index();
			if(n == '0') {
				mui.fire(home, "home_load");
				$('.a1 img').attr('src', 'img/nav_1-1@3x.png');
				$('.a2 img').attr('src', 'img/nav_2-2@3x.png');
				$('.a3 img').attr('src', 'img/nav_3-2@3x.png');
				$('.a4 img').attr('src', 'img/nav_4-2@3x.png');
			} else if(n == '1') {
				mui.fire(bankCard, "bankCard_load");
				$('.a1 img').attr('src', 'img/nav_1-2@3x.png');
				$('.a2 img').attr('src', 'img/nav_2-1@3x.png');
				$('.a3 img').attr('src', 'img/nav_3-2@3x.png');
				$('.a4 img').attr('src', 'img/nav_4-2@3x.png');
			} else if(n == '2') {
				mui.fire(shareProfit, "shareProfit_load");
				$('.a1 img').attr('src', 'img/nav_1-2@3x.png');
				$('.a2 img').attr('src', 'img/nav_2-2@3x.png');
				$('.a3 img').attr('src', 'img/nav_3-1@3x.png');
				$('.a4 img').attr('src', 'img/nav_4-2@3x.png');
			} else if(n == '3') {
				mui.fire(user, "user_load");
				$('.a1 img').attr('src', 'img/nav_1-2@3x.png');
				$('.a2 img').attr('src', 'img/nav_2-2@3x.png');
				$('.a3 img').attr('src', 'img/nav_3-2@3x.png');
				$('.a4 img').attr('src', 'img/nav_4-1@3x.png');
			}
			var targetTab = this.getAttribute('href');
			if(targetTab == activeTab) {
				return;
			}
			//若为iOS平台或非首次显示，则直接显示
			if(mui.os.ios || aniShow[targetTab]) {
				plus.webview.show(targetTab);
			} else {
				//否则，使用fade-in动画，且保存变量
				var temp = {};
				temp[targetTab] = "true";
				mui.extend(aniShow, temp);
				plus.webview.show(targetTab, "fade-in", 350);
			}
			//隐藏当前;
			plus.webview.hide(activeTab);
			//更改当前活跃的选项卡
			activeTab = targetTab;
		});
	};

});

//禁用安卓返回键
var first;
mui.back = function() {
	//首次按键，提示‘再按一次退出应用’
	if(!first) {
		first = new Date().getTime();
		mui.toast('再按一次退出应用');
		setTimeout(function() {
			first = null;
		}, 1000);
	} else {
		if(new Date().getTime() - first < 1000) {
			plus.runtime.quit();
			localStorage.removeItem("sj");
		}
	}

}