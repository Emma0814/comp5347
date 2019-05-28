$(document).ready(function(){
	var authors = [];
	var authorsLowerCase = [];
	var user;
	var titles = new Map();

    //get all the authors
	$("#article_bar").click(function() {
		$("#article_input").val("");
		$("#article_result").hide();
		$.get('/getAuthorName')
		.done(function(rdata){
			$.each(rdata, function(key, value) {
				authors.push(value);
				authorsLowerCase.push(value.toLowerCase());
			});
	    })
	    .fail(function() {
	        console.log('err')
	    })
	})

    //get all the changed articles by specific author
    $("#article_search_btn").click(function(){
        user = $("#article_input").val().trim();
        if(!authorsLowerCase.includes(user.toLowerCase())) {
        	alert("Author " + user + " does not exist!");
        	$("#article_result").hide();
        	return;
        }
        var index = authorsLowerCase.indexOf(user.toLowerCase());
        user = authors[index];
        $.get('/getChangedArticles', {"user": user})
        .done(function(rdata) {
        	if(rdata.length == 0) {
        		alert($("#article_input").val() + " does not edit any article");
        		$("#article_result").hide();
        	}
        	$("#article_result").show();
            var temp = "<tr>\n"
            	+ "	<th>Title</th>\n"
            	+ "	<th>Revisions</th>\n"
            	+ " <th>Selected</th>\n"
            	+ " <th>Timestamp</th>\n"
            	+ "</tr>\n";
            $.each(rdata, function(key, value){
            	titles.set(key, value._id);
                temp += "<tr>\n"
                	+ "<td>" + value._id + "</td>\n"
                	+ "<td>" + value.total + "</td>\n"
                	+ "<td>\n"
                	+ "<input type=\"checkbox\" class=\"author_checkboxs\" name=\"titles\" id=\"author_checkbox" + key + "\" value=\"" + key + "\">"
                	+ "</td>\n"
                	+ "<td>\n"
                	+ "		<select id=\"selectedAuthorTime" + key + "\"></select>\n"
                	+ "</td>\n"
                	+ "</tr>\n";
            })
            $("#article_author_table").html(temp);
        })
        .fail(function(){
            console.log('err')
        })
    });

	//get timestamp
	$("#article_moreinfo_btn").click(function(){
		titles.forEach(function(value, key) {
			if($("#author_checkbox" + key)[0].checked) {
				$.get('/getChangedTimeStamp', {"user": user, "title": value})
	            .done(function(rdata){
	            	$("#selectedAuthorTime" + key).html();
	                var temp = "";
	                for(var i = 0; i < rdata.length; i++) {
	                	if(i == 0) {
	                		temp += "<option value=\"" + rdata[i].timestamp + "\" selected>" + rdata[i].timestamp + "\n" ;
	                	} else {
	                		temp += "<option value=\"" + rdata[i].timestamp + "\">" + rdata[i].timestamp + "\n" ;
	                	}
	                }
	                $("#selectedAuthorTime" + key).html(temp);
	            })
	            .fail(function(){
	                console.log('err')
	            })
			}
		})
	})
	
	//logout
	$("#logout_btn").click(function(){
		if(confirm("Are you sure to log out ?")){
			location.href='/logout';
		}
	})
});
