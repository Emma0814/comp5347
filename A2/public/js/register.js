$(document).ready(function () {
	var isUsernameFormatCorrect = false;
	var isFirstnameFormatCorrect = false;
	var isLastnameFormatCorrect = false;
	var isPwdFormatCorrect = false;
	var isConfirmPwdCorrect = false;

	$("#reset").click(function(){
		$.each($(".register_input"), function() {
			$(this).val("");
			$(this).removeClass("wrong")
		})
		$.each($(".register_err"),function(){
			$(this).hide();
		});
	})
	
	$("#register").click(function() {
		if (!isUsernameFormatCorrect || !isFirstnameFormatCorrect || !isLastnameFormatCorrect || !isPwdFormatCorrect || !isConfirmPwdCorrect) {
			alert("Please check the input information");
			return false;
		}
	})

	// check username
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
	})
		
	// check first and last name
	$("#firstname").change(function(){
		if (!(new RegExp(/^[a-zA-Z]+$/).test($("#firstname").val()) && $("#firstname").val().length != 0)) {
			$("#firstname").addClass("wrong");
			isFirstnameFormatCorrect = false ;
			$("#firstname_err").show();
		} else {
			$("#firstname").removeClass("wrong");
			isFirstnameFormatCorrect = true;
			$("#firstname_err").hide();
		}
		$("#errorInfo").hide();
	})
	$("#lastname").change(function(){
		if (!(new RegExp(/^[a-zA-Z]+$/).test($("#lastname").val()) && $("#lastname").val().length != 0)) {
			$("#lastname").addClass("wrong");
			isLastnameFormatCorrect = false ;
			$("#lastname_err").show();
		} else {
			$("#lastname").removeClass("wrong");
			isLastnameFormatCorrect = true;
			$("#lastname_err").hide();
		}
		$("#errorInfo").hide();
	})
		
	// check pwd
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
	})
		
	// check confirm pwd
	$("#passwordCheck").change(function(){
		if ($("#passwordCheck").val() != $("#password").val()) {
		$("#passwordCheck").addClass("wrong")
		isConfirmPwdCorrect = false;
		$("#pwdconfirm_err").show();
	} else {
		$("#passwordCheck").removeClass("wrong")
		isConfirmPwdCorrect = true;
		$("#pwdconfirm_err").hide();
		}
		$("#errorInfo").hide();
	})
	
	$("#login").click(function() {
		location.href='/';
	});
})