google.charts.load('current', {packages: ['corechart', 'bar']});

var articleData;
var articleTitle;
var articleFromYear;
var articleToYear = 2020;
var fromYear;
var toYear;
var users = ['Administrator', 'Anonymous', 'Bot', 'Regular user'];

function showSummaryInfo() {
	$("#individual_title").html(articleTitle);

	$.get('/getIndividualArticleRevisionInfo',  {"title": articleTitle, "from": fromYear, "to": toYear})
	  .done(function(rdata3) {
		  $("#individual_revisions_num").html();
		  $("#individual_revisions_num").html(rdata3)
		  console.log('success3');
	  })
	  .fail(function() {
		  console.log('error3');
	  });

    $.get('/getIndividualArticleTopRegularUserInfo',  {"title": articleTitle, "from": fromYear, "to": toYear})
	  .done(function(rdata4) {
		  $("#individual_users_table").html();
		  if(rdata4.length == 0) {
			  $("#individual_top_users").html("<p>0 regular user found</p>\n");
			  return;
		  }
		  var temp = "<tr>\n"
			  + "	<th>User</th>\n"
			  + "	<th>Revisions</th>\n"
			  + "</tr>";
		  $.each(rdata4, function(key, value) {
			  temp += "<tr>\n"
				  + "	<td>" + value._id + "</td>\n"
				  + "	<td>" + value.total + "</td>\n"
				  + "</tr>";
		  });
		  $("#individual_users_table").html(temp);
		  console.log('success4');
	  })
	  .fail(function() {
		  console.log('error4');
	  });

	$.get('/getIndividualArticleTopUserInfo',  {"title": articleTitle, "from": fromYear, "to": toYear})
	  .done(function(rdata5) {
		  $("#individual_users").html();
		  if(rdata5.length == 0) {
			  $("#individual_users").html("<p>0 user found</p>\n");
			  return;
		  }
		  var checkbox = "";
		  $.each(rdata5, function(key, value) {
			  checkbox += "<input type=\"checkbox\" class=\"individual_user\" name=\"user" + key + "\">\n"
			  	+ "<label id=\"userLable" + key + "\" for=\"user" + key + "\">" + value._id + "</label>&nbsp&nbsp"
		  });
		  $("#individual_users").html(checkbox);
		  console.log('success5');
	  })
	  .fail(function() {
		  console.log('error5');
	  });
}

$(document).ready(function() {

	$("#individual_bar").click(function() {
		$("#individual_search_value").val("")
		$("#individual_result").hide();
		$("#individual_charts").hide();
		$.get('/getIndividual')
		  .done(function(rdata) {
			  var temp = "";
			  articleData = rdata;
			  $.each(rdata, function(key, value) {
				  temp += "<option value=\"" + value._id + " (Revisions: " + value.total + ")\">"
			  });
			  $("#individual_articles").html(temp);
		    console.log('success1');
		  })
		  .fail(function() {
			console.log('error1');
		  });

		$.get('/getIndividualMinimumYear')
		  .done(function(rdata) {
			  $("#from_year").attr("min", rdata);
			  $("#from_year").val(rdata);
			  articleFromYear = Number(rdata);
			  fromYear = rdata + "-01-01T00:00:00Z";
			  toYear = "2010-01-01T00:00:00Z";
		    console.log('success2');
		  })
		  .fail(function() {
			console.log('error2');
		  });

	})

	// show summary info (title, revision, top 5 users) for selected article
	$("#individual_search_btn").click(function() {
		//India (Revisions: 24560)

		$("#individual_chart1_img").hide();
		$("#individual_chart3_img").hide();
		$("#individual_chart2_img").hide();
		if(!(   Number($("#from_year").val()) >= articleFromYear  &&   Number($("#from_year").val()) <= articleToYear
				&& Number($("#to_year").val()) >= articleFromYear && Number($("#to_year").val()) <= articleToYear  )) {
			alert("Year should to entred from " + articleFromYear + " to " + articleToYear);
			$("#from_year").val(articleFromYear);
			$("#to_year").val(articleToYear);
			return;
		}
		fromYear = $("#from_year").val() + "-01-01T00:00:00Z";
		toYear = $("#to_year").val() + "-01-01T00:00:00Z";
		var title = $("#individual_search_value").val().trim();
		var match = false;
		$.each(articleData, function(key, value) {
		    var str =  value._id + " (Revisions: " + value.total + ")";
			if(value._id.toLowerCase() == title.toLowerCase() || str.toLowerCase() == title.toLowerCase()) {
				match = true;
				title = value._id;
			}
		});

		if(!match) {
			alert("Article \"" + title + "\" does not exist");
			$("#individual_result").hide();
			$("#individual_charts").hide();
			articleTitle = "";
		} else {
			articleTitle = title;
			$.get('/getIndividualArticleLastRevisionDate', {"title": title, "from": fromYear, "to": toYear})
			  .done(function(rdata) {
				  var timeDiff = Math.floor((new Date() - new Date(rdata)) / (1000 * 60 * 60 * 24))
				  if(timeDiff >= 1) {

					  // need update
					  $.get('/getUpdatedIndividualArticleHistory', {"title": articleTitle, "lastDate": rdata})
					    .done(function(rdata2) {
					    	alert("Data pulling request is made, " + rdata2 + " new revisions have been downloaded.");
					    	$("#individual_result").show();
							$("#individual_charts").show();
					    	showSummaryInfo();
					    	console.log('success6');
					    })
					    .fail(function() {
					    	console.log('error6');
					    });
				  } else {
					  $("#individual_result").show();
					  $("#individual_charts").show();
					  showSummaryInfo();
				  }console.log('success7');
			  })
			  .fail(function() {
				console.log('error7');
			  });
		}

	});

	//show chart1
	$("#individual_show1").click(function() {
		$("#individual_chart1_img").hide();
		$("#individual_chart3_img").hide();
		$("#individual_chart2_img").hide();
		$.get('/getIndividualChart1', {"title": articleTitle, "from": fromYear, "to": toYear})
		  .done(function(rdata) {
			  if(rdata.length == 0) {
				  alert("No data in bar chart");
                  $("#individual_chart1_img").hide();
				  return;
			  }
              $("#individual_chart1_img").show();
			  graphData = new google.visualization.DataTable();
			  graphData.addColumn('string', 'Year');
			  graphData.addColumn('number', 'Administrator');
			  graphData.addColumn('number', 'Anonymous');
			  graphData.addColumn('number', 'Bot');
			  graphData.addColumn('number', 'Regular user');
		      $.each(rdata, function(key, val) {
		    	  graphData.addRow([val._id.year, val.admin, val.anon, val.bot, val.regular]);
		      })
			  var options = {
		    	  title: 'Year and user type distribution',
				  hAxis: {title: 'Year'},
				  vAxis: {title: 'Revision'},
				  width: 1200,
				  height: 900
			  };
			  var chart = new google.visualization.ColumnChart($("#individual_chart1_img")[0]);
			  chart.draw(graphData, options);
			  console.log('success8');
		  })
		  .fail(function() {
			  console.log('error8');
		  });
	});

	//show chart2
	$("#individual_show2").click(function() {
		$("#individual_chart2_img").hide();
		$("#individual_chart3_img").hide();
		$("#individual_chart1_img").hide();
		$.get('/getIndividualChart2', {"title": articleTitle, "from": fromYear, "to": toYear})
		  .done(function(rdata) {
			  if(rdata.length == 0) {
				  alert("No data in pie chart");
                  $("#individual_chart2_img").hide();
				  return;
			  }
              $("#individual_chart2_img").show();
			  graphData = new google.visualization.DataTable();
			  graphData.addColumn('string', 'Topping');
			  graphData.addColumn('number', 'Slices');
			  $.each(rdata, function(key, val) {
				  var text;
				  switch(val.type) {
					  case "admin":
					    text = "Administrator";
					    break;
					  case "anon":
					    text = "Anonymous";
					    break;
					  case "bot":
					    text = "Bot";
					    break;
					  case "regular":
					    text = "Regular user";
					    break;
					}
				  graphData.addRow([text, val.number]);
			  });
			  var options = {title: "User type distribution",
					  width: 1200,
					  height: 900
			  }
			  var chart = new google.visualization.PieChart($("#individual_chart2_img")[0]);
			  chart.draw(graphData, options);
			  console.log('success9');
		  })
		  .fail(function() {
			  console.log('error9');
		  });
    });

	//show chart3
	$("#individual_show3").click(function() {
		$("#individual_chart3_img").hide();
		$("#individual_chart1_img").hide();
		$("#individual_chart2_img").hide();
		var topUsersString = "";
		var topUsers = [];
		for(var i = 0; i < $(".individual_user").length; i++) {
			if($(".individual_user")[i].checked) {
				topUsers.push($("#userLable" + i).text());
				topUsersString = topUsersString + "{" + $("#userLable" + i).text();
			}
		}
		$.get('/getIndividualChart3', {"title": articleTitle, "users": topUsersString.substring(1), "from": fromYear, "to": toYear})
		  .done(function(rdata) {
			  if(rdata.length == 0) {
				  alert("No data in bar chart");
                  $("#individual_chart3_img").hide();
				  return;
			  }
              $("#individual_chart3_img").show();
			  graphData = new google.visualization.DataTable();
			  graphData.addColumn('string', 'Year');
			  for(var i = 0; i < topUsers.length; i++) {
				  graphData.addColumn('number', topUsers[i]);
			  }
			  var yearMap = new Map();
			  $.each(rdata, function(key, val) {
				  var userMap = new Map();
				  if(yearMap.has(val._id.year)) {
					  userMap = yearMap.get(val._id.year);
				  }
				  userMap.set(val._id.user, val.total);
				  yearMap.set(val._id.year, userMap);
			  });
			  yearMap.forEach(function(val, key) {
				  var val1 = (topUsers[0] != null && val.has(topUsers[0])) ? val.get(topUsers[0]) : 0;
				  var val2 = (topUsers[1] != null && val.has(topUsers[1])) ? val.get(topUsers[1]) : 0;
				  var val3 = (topUsers[2] != null && val.has(topUsers[2])) ? val.get(topUsers[2]) : 0;
				  var val4 = (topUsers[3] != null && val.has(topUsers[3])) ? val.get(topUsers[3]) : 0;
				  var val5 = (topUsers[4] != null && val.has(topUsers[4])) ? val.get(topUsers[4]) : 0;
				  switch(topUsers.length) {
				      case 1:
					      graphData.addRow([key, val1]);
					  	  break;
					  case 2:
						  graphData.addRow([key, val1, val2]);
					      break;
					  case 3:
						  graphData.addRow([key, val1, val2, val3]);
					      break;
					  case 4:
						  graphData.addRow([key, val1, val2, val3, val4]);
						  break;
					  default:
						  graphData.addRow([key, val1, val2, val3, val4, val5]);
			       };
				});
			  var options = {title: "Top user distribution",
					  width: 1200,
					  height: 900
			  }
			  var chart = new google.visualization.ColumnChart($("#individual_chart3_img")[0]);
			  chart.draw(graphData, options);
			  console.log('success10');
		  })
		  .fail(function() {
			  console.log('error10');
		  });
    });
});
