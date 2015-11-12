requirejs.config({
    baseUrl: '/',
    paths: {
        app: 'webcan'
    }
});
define(['text!webcan/demo/tpl/demo_tpl.html'], function(demoTpl) {
    
    this.templeate = _.template(demoTpl);
    this.data = {
        "name":"wujinqiang",
        "age": "26",
        "sex": 1
    };
    var that = this;

    $("#baseInfo").html(that.templeate(that.data))
 
})
