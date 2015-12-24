/**
 * Created by shihw11 on 2015/9/18.
 */

define(['modules/common/http/myHttp'], function(redirectTo) {
    var casAjax = function(param) {
        var successTmp = param.success;
        var errorTmp = param.error;
        param.success = function(data, status, xhr) {
            var redirectUrl;
            if (xhr.getResponseHeader) {
                redirectUrl = xhr.getResponseHeader('RedirectUrl');
            }
            if (redirectUrl) {
                redirectTo({
                    url: redirectUrl,
                    callback: function(resp) {
                        if (resp.message && resp.code) {
                            errorTmp && errorTmp(resp);
                        } else {
                            successTmp && successTmp(resp);
                        }
                    }
                });
            } else {
                successTmp.apply($, arguments);
            }
        };
        $.ajax(param);
    };
    return casAjax;
});
