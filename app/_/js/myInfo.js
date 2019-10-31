function myInfo(){
    $.ajax({
        url: site_app + "/api/my/info",
        type: "post",
        data: {
            token: tokens
        },
        dataType: "json",
        success: function(e) {
            console.log(e)
            if(e.error == 0) {
                if(e.data.user_isactivation == 0) {
                    if(e.data.user_real == 0) {
                        var btnArray = ['取消', '确定'];
                        mui.confirm("请先进行实名认证", '提示', btnArray, function(e) {
                            if(e.index == 0) {
                                setTimeout(function() {
                                    plus.webview.currentWebview("../index/repayment.html").close();
                                }, 300);
                            } else {
                                mui.openWindow({
                                    url: "../user/data_authentication.html",
                                    id: "data_authentication",
                                    show: {
                                        autoShow: true, //页面loaded事件发生后自动显示，默认为true
                                    },
                                    waiting: {
                                        //autoShow: true, //自动显示等待框，默认为true
                                        //title: '安全检测中，请等待', //等待对话框上显示的提示内容
                                    }
                                })
                            }
                        }, 'div');
                    }
                } else {
                    mui.alert('请激活账户', '提示', '', function() {
                        mui.openWindow({
                            url: "../user/activation.html",
                            id: "activation",
                            show: {
                                autoShow: true, //页面loaded事件发生后自动显示，默认为true
                            },
                            waiting: {
                                //autoShow: true, //自动显示等待框，默认为true
                                //title: '安全检测中，请等待', //等待对话框上显示的提示内容
                            }
                        })
                    }, 'div');
                }

            }
        }
    });
}