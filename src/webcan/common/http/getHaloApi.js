/**
 *@module common
 */
define([
    'modules/common/app/app'
], function(app) {
    /**
     @class getApi
     */
    /**
     *@method getApi
     * @param {string} url 请求地址
     * @param {string} method 请求方法--POST/PUT/GET/DELETE
     * @param {Json} data 请求参数
     * @param {function} errorCallback 错误回调函数
     */
    var getHaloApi = function(url, method, data, errorCallback) {

        var deferred = $.Deferred();
        var timestamp = new Date().getTime().toString();
        var timeFlag = '';
        if(url.indexOf('?') > -1) {
            timeFlag = '&timestamp=' + timestamp;
        }else{
            timeFlag = '?timestamp=' + timestamp;
        }
        $.ajax({
            type: method,
            url: method.toLowerCase() === 'get' ? url + timeFlag : url,
            data: data,
            contentType: 'application/json',
            success: function(resp) {
                deferred.resolve(resp);
            },
            error: function(resp) {
                errorCallback && errorCallback(resp);
                deferred.reject(resp);
            }
        });

        return deferred.promise();
    };
    return getHaloApi;
})
