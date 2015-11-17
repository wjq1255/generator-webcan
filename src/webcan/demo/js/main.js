requirejs.config({
    baseUrl: '/',
    paths: {
        app: 'webcan'
    }
});
define(['text!webcan/demo/tpl/demo_tpl.html', 'webcan/demo/js/adapter'], function(demoTpl,homeData) {
    $(document).ready(function() {
        this.templeate = _.template(demoTpl);
        var that = this;
        $.when(homeData.getUserData(), homeData.getBaseLinks()).done(function(userinfo, links){
            var dataObj = {
                "userinfo": userinfo,
                "links": links
            };
            $("#baseInfo").html(that.templeate(dataObj));
        }).fail(function(resp) {
            console.log("resp =" + resp);
        }); 

    });
 
})
