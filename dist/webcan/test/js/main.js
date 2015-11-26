define(["webcan/test/js/common"
], function(comm) {
    $(document).ready(function() {
    	comm.checkCodeBtn.click();
        comm.oneBtn.click(function(){
        	console.log("11=="+comm.oneBtn.active);
        },function(){
        	console.log("22=="+comm.oneBtn.active);
        });

        $("#clear").bind("click",function(){
    		comm.checkCodeBtn.clear();
        });

        comm.submitBtn.click(function(errmsg){
        	$(".errmeg").html(errmsg).show();
        },function() {
        	/* Act on the event */
        	console.log("submit success");
        	$(".errmeg").html(" ").hide();
        });
    })
})
