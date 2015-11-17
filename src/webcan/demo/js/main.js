requirejs.config({
    baseUrl: '/',
    paths: {
        app: 'webcan'
    }
});
define(['text!webcan/demo/tpl/demo_tpl.html', 'webcan/demo/js/data'], function(demoTpl,homeData) {
    $(document).ready(function() {
        this.templeate = _.template(demoTpl);
        var that = this;
        $.when(homeData.getUserData()).done(function(resp){
            console.log(resp);
            $("#baseInfo").html(that.templeate(resp));
        }).fail(function(resp) {
            console.log(resp);
        });

    });
 
})
