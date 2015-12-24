define(function() {
    var homeData = function () {
        /**
         *@method getUserInfo
         @for userAdapter
         @example userAdapter.getUserInfo()
         */
        var getUserData = function () {//查询金融资产信息
            var json = {"name":"jerry","age": "26","sex": 1};
            return json;
        };
        var getHistorys = function(){
            var deferred = $.Deferred();
            $.ajax({
                url: 'https://172.16.129.26:443/halo/free/provinces',
                method: 'get',
                data: {
                    isJsonp: true
                },
                dataType: 'jsonp',
                success : function(resp){
                    deferred.resolve(resp);
                },
                error : function(data){
                    deferred.reject(data);
                }
            });
            return deferred.promise();
        };

        return {
            getUserData: getUserData,
            getHistorys:getHistorys
        };
    };
    return homeData();
});