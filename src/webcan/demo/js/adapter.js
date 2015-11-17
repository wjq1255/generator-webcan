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
        var getBaseLinks = function(){
        	var json = [{
					"name": "RequireJS",
					"url": "http://requirejs.org/"
				}, {
					"name": "Lo-dash",
					"url": "https://lodash.com/"
				}, {
					"name": "Jquery",
					"url": "https://jquery.com/"
				}, {
					"name": "Bootstrap",
					"url": "http://getbootstrap.com/"
				}, {
					"name": "baidu",
					"url": "http://www.baidu.com/"
				}, {
					"name": "Sass",
					"url": "http://sass-lang.com/"
				}, {
					"name": "Jade",
					"url": "http://jade-lang.com/"
				}, {
					"name": "Grunt",
					"url": "http://gruntjs.com/"
				}];
			return json;
        };
        return {
            getUserData: getUserData,
            getBaseLinks:getBaseLinks
        };
    };
    return homeData();
});