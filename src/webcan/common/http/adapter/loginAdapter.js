/**
 * Created by shihw11 on 2015/9/17.
 */

define(['modules/common/http/getHaloApi', 'modules/common/http/myHttp', 'modules/common/http/casAjax', 'locale/locale'],
    function(getHaloApi, redirectTo, casAjaxData, local) {
        var login = function() {

            var getIsLogin = function(success, error) {
                $.ajax({
                    url: local + '/isLogin',
                    data: {
                        paramTyp: 'json',
                        appId: 'FW0006',
                        isJsonp: true
                    },
                    dataType: 'jsonp',
                    type: 'get',

                    success: function(resp) {
                        success && success(resp)
                    },
                    error: function(resp) {
                        error && error(resp)
                    }
                });
            };

            var getCheckCode = function(phone, success) {
                $.ajax({
                    url: local + '/uc/rest/userInfo/sendPhoneVerificationCode',
                    method: 'get',
                    data: {
                        phone: phone,
                        verificationCodeType: '1',
                        appId: 'FW0006',
                        paramTyp: 'json',
                        isJsonp: true,
                        method: 'get'
                    },
                    dataType: 'jsonp',
                    success: function(resp) {
                        //                    if(resp.code == '0000'){
                        //                        success && success(resp);
                        //                    }else{
                        //                        //网络出错
                        //                    }
                    },
                    error: function(resp) {
                        console.info(2);
                        console.info(resp);
                        //网络出错
                    }

                });

            };

            var casAjax = function(param) {
                casAjaxData(param);
            };
            var getLogin = function(param) {
                getTicket(function(data) {
                    redirectTo({
                        url: local + '/loginRemote',
                        method: 'post',
                        data: {
                            username: param.phone,
                            password: param.password,
                            lt: data.val,
                            loginModeType: '1', //1--手机和密码登录;2--手机号和验证码登录 
                            appId: 'FW0006'
                        },
                        callback: function(resp) {
                            if (resp.code == '0000') {
                                //登录成功，查询user接口，否则存在跨域问题！！！
                                casAjaxData({
                                    url: '/halo/protected/user',
                                    method: 'get',
                                    dataType: 'json',
                                    contentType: 'application/json',
                                    success: function(data, obj, xhr) {
                                        loft.cookies.set('isLogin',true);
                                        param.success && param.success(resp);
                                    }
                                });
                                // 
                            } else {
                                casAjaxData({
                                    url: '/halo/protected/user',
                                    method: 'get',
                                    dataType: 'json',
                                    contentType: 'application/json',
                                    error: function(data, obj, xhr) {
                                        param && param.error(resp);
                                    }
                                });
                            }
                        }
                    });

                });
            };

            function getTicket(fn) {
                $.ajax({
                    url: local + '/getLoginTicket?appId=FW0006',
                    dataType: 'jsonp',
                    type: "GET",
                    jsonp: "callback",
                    data: "javascript",
                    contentType: 'application/json;charset=utf-8',
                    success: fn
                });
            }

            return {
                getCheckCode: getCheckCode,
                getLogin: getLogin,
                getIsLogin: getIsLogin
            };

        };
        return login();



    });
