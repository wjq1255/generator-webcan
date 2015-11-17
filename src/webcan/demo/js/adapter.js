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
            }
        return {
            getUserData: getUserData
        };
    };
    return homeData();
});