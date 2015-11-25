/**
 * Created by jinqiang on 2015/11/5.
 */
define(function(){
    var main = {
        oneBtn:{
            el : $("#oneBtn"),
            active  :true,
            click: function(fn1,fn2){
                var btn = this;
                btn.el.bind("click", function(){
                    console.log(btn.active+"--呃呃呃-"+main.oneBtn.active);
                    fn2 && fn2();
                });
                fn1 && fn1();
            }
        },
        checkCodeInput: { // 验证码输入框验证
            el: $('#checkCode'),
            val: function (v) {
                if (v === undefined) {
                    return this.el.val();
                }
                return this.el.val(v);
            },
            errMsg: null,
            validate: function () {
                var value = this.val();
                if (!value) {
                    this.errMsg = unescape('%u9A8C%u8BC1%u7801%u4E0D%u80FD%u4E3A%u7A7A');
                    return false;
                }
                return true;
            }
        },
        checkCodeBtn: { //发送手机验证码按钮
            el: $('#checkCodeBtn'),
            active: true,
            count: function () {
                var btn = this, $el = btn.el,
                    num = 60,str = "$1s后重发";
                $el.val(str.replace('\$1', num));
                btn.active = false;
                time = setInterval(function () {
                    if (0 === num) {
                        clearInterval(time);
                        btn.active = true;
                        $el.val(unescape('%u91CD%u65B0%u83B7%u53D6'));
                        return;
                    }
                    $el.val(str.replace('\$1', --num));
                }, 1000);
            },
            clear:function(){
                clearInterval(time);
                main.checkCodeInput.el.val("");
                this.active = true;
                this.el.val(unescape(' %u91CD%u65B0%u83B7%u53D6 '));
            },
            click: function (fn) {
                var btn = this;
                btn.el.on('click', function () {
                    if (!btn.active) {
                        return;
                    }
                    btn.active = false;
//                    $.ajax({//发送验证码
//                        url: '/halo/tight/thirdInput/getSms',
//                        type: 'POST',
//                        cache: false,
//                        data: {
//                            orderId: main.data.orderId
//                        },
//                        success: function() {
                            main.checkCodeBtn.count();
//                        },
//                        error: function(resp) {
//                            main.checkCodeBtn.active = true;
//                        }
//                    });
                    fn && fn();
                });
            }
        },
        submitBtn:{ //提交验证按钮
            el:$("#submit-btn"),
            active: false,
            click : function(errcallback,succallback){
                var btn = this;
                btn.el.on('click', function () {
                    if(!main.checkCodeInput.validate()){
                        errcallback && errcallback(main.checkCodeInput.errMsg);
                        this.active = false;
                        return;
                    }
                    succallback && succallback();
                });
            }
        }
    };
    return main;
});