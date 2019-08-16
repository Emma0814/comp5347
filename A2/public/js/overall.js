google.charts.load('current', { 'packages': ['corechart', 'bar'] });

$(document).ready(function () {

    //for highest and lowest revision
    $("#OverallRevSearchBu").click(function () {
        $('#OverallRevSearchResult').html();
        if($('#OverallRevNum').val() < 1){
            alert("Please insert number greater than 0")
            return;
        }
        $.get('/getOverallHighAndLowArticle', {"order": $('#order').val(), "num": $('#OverallRevNum').val()})
            .done(function (rdata) {
                var temp = "<tr>\n"
                    + " <th>Article Title</th>\n"
                    + " <th>Total Revisions</th>\n"
                    + "</tr>";
                $.each(rdata, function (key, value) {
                    temp += "<tr>\n"
                        + " <td>" + value._id + "</td>\n"
                        + " <td>" + value.total + "</td>\n"
                        + "</tr>";
                });
                $('#OverallRevSearchResult').html(temp);
            })
            .fail(function () {
                console.log('111 error');
            });
    });


    $.get('/getOverallLargestRegistered', {"order": -1})
        .done(function (rdata) {
            $('#OverallRevSearchResultL').html(rdata[0]._id);
        })
        .fail(function () {
            console.log('error')
        });

    $.get('/getOverallLowestRegistered', {"order": 1})
        .done(function (rdata) {
            $('#OverallRevSearchResultS').html(rdata[0]._id);
        })
        .fail(function () {
            console.log('error')
        });

    $.get('/getOverallLongestHistory', {"order": 1})
        .done(function (rdata) {
            var age1 = Math.floor((new Date() - new Date(rdata[0].timestamp)) / (1000 * 60 * 60 * 24));
            var age2 = Math.floor((new Date() - new Date(rdata[1].timestamp)) / (1000 * 60 * 60 * 24));
            var temp = rdata[0]._id + ', age: ' + age1 + ' days</br>' + rdata[1]._id + ', age: ' + age2 + ' days';
            $('#OverallHistoryResultL').html(temp);
        })
        .fail(function () {
            console.log('error000');
        });

    $.get('/getOverallShortestHistory', {"order": -1})
        .done(function (rdata) {
            $('#OverallHistoryResultS').html(
                rdata._id + ', age: '
                + Math.floor((new Date() - new Date(rdata.timestamp)) / (1000 * 60 * 60 * 24))
                + ' days'
            );
        })
        .fail(function () {
            console.log('error');
        });

    $("#OverallBarBu").click(function () {
        $.get('/getOverallBar')
            .done(function (rdata) {
                var graphData = new google.visualization.DataTable();
                graphData.addColumn('string', 'Year');
                graphData.addColumn('number', 'Administrator');
                graphData.addColumn('number', 'Anonymous');
                graphData.addColumn('number', 'Bot');
                graphData.addColumn('number', 'Regular user');
                $.each(rdata, function (key, val) {
                    var admin = (val._id.type == "admin") ? val.total : 0;
                    var anon = (val._id.type == "anon") ? val.total : 0;
                    var bot = (val._id.type == "bot") ? val.total : 0;
                    var regular = (val._id.type == "regular") ? val.total : 0;
                    graphData.addRow([val._id.year, admin, anon, bot, regular]);
                })
                var options = {
                    title: 'Year and user type distribution',
                    hAxis: {title: 'Year'},
                    vAxis: {title: 'Revision'},
                    width: 1200,
                    height: 400,
                };
                $("#OverallChartResult").addClass("changeChartPosition2");
                $("#OverallChartResult").removeClass("changeChartPosition");
                var chart = new google.visualization.ColumnChart($("#OverallChartResult")[0]);
                chart.draw(graphData, options);
            })
            .fail(function () {
                console.log('error');
            });
    });

    $("#OverallPieBu").click(function (){
        $.get('/getOverallPieAdmin')
            .done(function (rdata) {
                var subType = new Map();
                $.each(rdata, function(key, value) {
                    subType.set(value._id, value.total)
                });
                $.get('/getOverallPie')
                    .done(function (rdata2) {
                        var graphData = new google.visualization.DataTable();
                        graphData.addColumn('string', 'Topping');
                        graphData.addColumn('number', 'Slices');
                        graphData.addColumn({type: 'string', role: 'tooltip'});
                        var totalNum = 0;
                        rdata2.forEach(function(value, key) {
                            totalNum += value.total;
                        })
                        $.each(rdata2, function (key, val) {
                            var text;
                            var tooltip;
                            switch (val._id) {
                                case "admin":
                                    text = "Administrator";
                                    tooltip = "Administrator\n"
                                        + val.total.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
                                        + " (" + (val.total * 100 / totalNum).toFixed(1) + "%)\n"
                                        + "Admin_active: "
                                        + subType.get("active").toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
                                        + " (" + (subType.get("active") * 100 / val.total).toFixed(1) + "%)\n"
                                        + "Admin_former: "
                                        + subType.get("former").toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
                                        + " (" + (subType.get("former") * 100 / val.total).toFixed(1) + "%)\n"
                                        + "Admin_inactive: "
                                        + subType.get("inactive").toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
                                        + " (" + (subType.get("inactive") * 100 / val.total).toFixed(1) + "%)\n"
                                        + "Admin_semi_active: "
                                        + subType.get("semi_active").toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
                                        + " (" + (subType.get("semi_active") * 100 / val.total).toFixed(1) + "%)\n";
                                    break;
                                case "anon":
                                    text = "Anonymous";
                                    tooltip = "Anonymous\n"
                                        + val.total.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
                                        + " (" + (val.total * 100 / totalNum).toFixed(1) + "%)";
                                    break;
                                case "bot":
                                    text = "Bot";
                                    tooltip = "Bot\n"
                                        + val.total.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
                                        + " (" + (val.total * 100 / totalNum).toFixed(1) + "%)";
                                    break;
                                case "regular":
                                    text = "Regular user";
                                    tooltip = "Regular user\n"
                                        + val.total.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
                                        + " (" + (val.total * 100 / totalNum).toFixed(1) + "%)";
                                    break;
                            }
                            graphData.addRow(
                                [text, val.total, tooltip]
                            )
                        });
                        var options = {
                            title: "User type distribution",
                            width: 900,
                            height: 900,
                        }
                        $("#OverallChartResult").removeClass("changeChartPosition2");
                        $("#OverallChartResult").addClass("changeChartPosition");
                        var chart = new google.visualization.PieChart($("#OverallChartResult")[0]);
                        chart.draw(graphData, options);
                    })
                    .fail(function () {
                        console.log('error')
                    });
            })
            .fail(function () {
                console.log('error');
            });
    });
});
