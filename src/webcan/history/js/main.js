requirejs.config({
    baseUrl: '/',
    paths: {
        app: 'webcan'
    }
});
define(['text!webcan/history/tpl/demo_tpl.html', 'webcan/history/js/adapter'], function(demoTpl,homeData) {
    $(document).ready(function() {
        this.templeate = _.template(demoTpl);
        var that = this;
        $.when(homeData.getUserData(), homeData.getHistorys()).done(function(userinfo, historys){
            var dataObj = {
                    "userinfo": userinfo,
                    "historys": historys
                };
            $("#baseInfo").html(that.templeate(dataObj));
        }).fail(function(resp) {
            console.log("resp =" + resp);
        }); 

    });
 
})
