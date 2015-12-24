/**
 * Created by shihw11 on 2015/9/17.
 */

define(['modules/common/http/getHaloApi', 'modules/common/http/myHttp', 'locale/locale'],
    function(getHaloApi, redirectTo, local) {
        var register = function() {
            var getIsRegistered = function(phone) {
                var deferred = $.Deferred();
                var url = 'halo/free/phoneisRegistered';
                var errorCallback = function(resp) {
                    console.log('resp', resp);
                }
                var request = getHaloApi(url, 'GET', {
                    phone: phone
                }, errorCallback);
                return request;
            };
            var getRegCheckCode = function(phone, success, graphCode) {
                $.ajax({
                    url: local + '/uc/rest/sendSmsCode?' + $.param({
                        phone: phone,
                        verificationCodeType: "1",
                        appId: 'FW0006',
                        graphCode: graphCode === undefined ? '' : graphCode,
                        appKey: '1',
                        isJsonp: true,
                        method: 'post'
                    }),
                    type: 'get',
                    data: '',
                    dataType: 'jsonp',
                    success: function(resp) {
                        success && success(resp);
                    }
                })
            };

            var toRegister = function(param, success, error) {
                var that = this;
                var checkCode = param["checkCode"];
                var password = param["password"];
                var phone = param["phone"];
                console.log(phone)
                $.ajax({
                    url: local + '/uc/rest/validateSmsCode?' + $.param({
                        phone: phone,
                        verificationCodeType: "1",
                        verificationCode: checkCode,
                        appId: 'FW0006',
                        appKey: '1',
                        isJsonp: true,
                        method: 'post'
                    }),
                    type: 'get',
                    data: '',
                    dataType: 'jsonp',
                    success: function(resp) {
                        if (resp.code && resp.message) {
                            $.loading({
                                content: resp.message,
                                time: 1500,
                                title: 'alert'
                            });
                            return;
                        }
                        var getActId = loft.cookies.get('activityChannel') !== undefined ? loft.cookies.get('activityChannel') : '';
                        $.ajax({
                            url: local + '/uc/rest/userInfo/formRegister?' + $.param({
                                phone: phone,
                                verificationCode: resp.newVerifyCode,
                                userInfoVO: {
                                    "password": password
                                },
                                appId: 'FW0006' + getActId,
                                appKey: '1',
                                isJsonp: true,
                                method: 'post'
                            }),
                            type: 'get',
                            data: '',
                            dataType: 'jsonp',
                            success: function(regData) {
                                if (regData.code && regData.message) {
                                    $.loading({
                                        content: regData.message,
                                        time: 1500,
                                        title: 'alert'
                                    });
                                    return;
                                }

                                loft.cookies.set('verificationCode', regData.newVerifyCode);
                                $.ajax({
                                    url: local + '/uc/rest/userInfo/initializePassword?' + $.param({
                                        userId: regData.userId,
                                        password: password,
                                        appId: 'FW0006',
                                        appKey: '1',
                                        isJsonp: true,
                                        method: 'post'
                                    }),
                                    type: 'get',
                                    data: '',
                                    dataType: 'jsonp',
                                    success: function(initPwdData) {
                                        if (initPwdData.code == '0000') {
                                            success && success(initPwdData);
                                        } else {
                                            $.loading({
                                                content: initPwdData.message,
                                                time: 1500,
                                                title: 'alert'
                                            });
                                        }

                                    }
                                });
                            }
                        });
                    }
                });

            };

            return {
                getIsRegistered: getIsRegistered,
                getRegCheckCode: getRegCheckCode,
                toRegister: toRegister
            };

        };
        return register();

    });
