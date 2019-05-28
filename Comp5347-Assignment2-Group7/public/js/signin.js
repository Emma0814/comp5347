$(document).ready(function () {
	var isUsernameFormatCorrect = false;
	isPwdFormatCorrect = false;
	
	$("#regist").on('click',function(e){
		location.href='/regist';
	});
		$("#username").change(function(){
			if (!(new RegExp(/^[a-zA-Z0-9_\-]+@(([a-zA-Z0-9_\-])+\.)+[a-zA-Z]{2,4}$/).test($("#username").val()) && $("#username").val().length >= 6)) {
				$("#username").addClass("wrong");
				isUsernameFormatCorrect = false;
				$("#username_err").show();
			} else {
				$("#username").removeClass("wrong");
				isUsernameFormatCorrect = true;
				$("#username_err").hide();
			}
			$("#errorInfo").hide();
		});
		$("#password").change(function(){
			if (!(new RegExp(/^[a-zA-Z0-9_-]{6,}$/).test($("#password").val()) && $("#password").val().length >= 6)) {
				$("#password").addClass("wrong")
				isPwdFormatCorrect = false;
				$("#password_err").show();
			} else {
				$("#password").removeClass("wrong")
				isPwdFormatCorrect = true;
				$("#password_err").hide();
			}
			$("#errorInfo").hide();
		});

	$(function(){
		$(".tab_title li").click(function(){
			$(this).addClass("active");
			$(this).siblings().removeClass("active");
			var index=$(this).index();
			$(".tab_content .content").eq(index).addClass("selected");
			$(".tab_content .content").eq(index).siblings().removeClass("selected");
		})
	})  
})

