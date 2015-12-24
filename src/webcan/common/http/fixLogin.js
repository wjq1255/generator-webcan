/**
 * Created by shihw11 on 2015/9/17.
 */
define(['locale/locale'],function(local){
    var isLogin = function(){
        var getLogin = function(success){
            $.ajax({
                url:local+'/isLogin',
                data: {
                    paramTyp: 'json',
                    appId: 'FW0006',
                    isJsonp: true
                },
                dataType: 'jsonp',
                type:'get',

                success:function(resp){
                    success && success(resp)
                },
                error:function(resp){
                    //deferred.reject(data);
                }
            });
            //return deferred.promise();

        };
        return {
            getLogin: getLogin
        };

    };
    return isLogin();

});

