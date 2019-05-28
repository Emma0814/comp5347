var Revision = require("../models/revision");
var fs = require('fs');
var request = require('request');

var admin_active = fs.readFileSync(__dirname + '/../../public/admin_active.txt').toString().split("\n");
var admin_former = fs.readFileSync(__dirname + '/../../public/admin_former.txt').toString().split("\n");
var admin_inactive = fs.readFileSync(__dirname + '/../../public/admin_inactive.txt').toString().split("\n");
var admin_semi_active = fs.readFileSync(__dirname + '/../../public/admin_semi_active.txt').toString().split("\n");
var bot = fs.readFileSync(__dirname + '/../../public/bot.txt').toString().split("\n");
var admin = admin_active.concat(admin_former).concat(admin_inactive).concat(admin_semi_active);
var notRegular = admin.concat(bot);

module.exports.getIndividual = function(req,res) {
	Revision.findArticle(function(err, result) {
		if(err) {
			console.log(err);
		} else {
            res.json(result);
		}
	})
}

module.exports.getIndividualMinimumYear = function(req,res) {
	Revision.miniYear(function(err, result) {
		if (err){
            console.log(err);
        }else{
        	res.json(result[0].minYear.substring(0, 4));
        }
	})
}

module.exports.getIndividualArticleLastRevisionDate = function(req,res) {
	Revision.lastDate(req.query.title, function(err, result) {
		if (err){
            console.log(err);
        }else{
        	res.json(result[0].timestamp);
        }
	})
}

module.exports.getUpdatedIndividualArticleHistory = function(req,res) {
	var wikiEndpoint = "https://en.wikipedia.org/w/api.php";
	var parameters = [
	    "titles=" + req.query.title,
	    "rvstart=" + req.query.lastDate,
	    "rvdir=newer",
	    "action=query",
	    "prop=revisions",
	    "rvlimit=max",
	    "rvprop=ids|user|anon|timestamp|revid",
	    "formatversion=2",
	    "format=json"
	];
	var url = wikiEndpoint + "?" + parameters.join("&");
	var options = {
	    url: url,
	    method: 'GET',
	    json: true,
	    headers: {
	        'Accept': 'application/json',
	        'Accept-Charset': 'utf-8',
	        'Connection': 'keep-alive',
	        'Api-User-Agent': 'Example/1.0'
	    }
	};
	var num;
	request(options, function (err, res2, data){
	    if (err) {
	        console.log(err);
	    } else if (res.statusCode !== 200) {
	        console.log(res.statusCode);
	    } else {
	        var revisions = data.query.pages[0].revisions;
	        var newRevisions = [];
	        revisions.forEach(function(value, key) {
				if(value.timestamp != req.query.lastDate) {
					if(value.anon == true) {
						newRevisions.push({
							"title": req.query.title,
						    "timestamp": value.timestamp,
						    "anon": true,
						    "revid": value.revid,
						    "user": value.user,
						    "type": "anon"
						});
					} else {
						var type;
						if(admin.includes(value.user)) {
							type = "admin";
							if(admin_active.includes(value.user)) {
								subtype = "active";
							} else if(admin_former.includes(value.user)) {
								subtype = "former";
							} else if(admin_inactive.includes(value.user)) {
								subtype = "inactive";
							} else {
								subtype = "active";
							}
						} else if(bot.includes(value.user)) {
							type = "bot";
						} else if(!notRegular.includes(value.user)) {
							type = "regular";
						}
						newRevisions.push({
							"title": req.query.title,
						    "timestamp": value.timestamp,
						    "revid": value.revid,
						    "user": value.user,
						    "type": type
						});
					}
				}
			});
	        if(newRevisions.length > 0) {
	        	Revision.updataRevisions(newRevisions, function(err, result) {
		    		if (err){
		                console.log(err);
		            } else {
		                res.json(result);
		    		}
		    	})
	        } else {
	        	res.json(0);
	        }
	    }
	});
}

module.exports.getIndividualArticleRevisionInfo = function(req,res) {
	Revision.findRevision(req.query.title, req.query.from, req.query.to, function(err, result) {
		if(err) {
			console.log(err);
		} else {
            res.json(result);
		}
	})
}

module.exports.getIndividualArticleTopRegularUserInfo = function(req, res) {
    Revision.findUsers(req.query.title, req.query.from, req.query.to, function(err,result) {
        if (err){
            console.log(err);
        }else{
            res.json(result);
        }
    })
}

module.exports.getIndividualArticleTopUserInfo = function(req, res) {
    Revision.findTopUsers(req.query.title, req.query.from, req.query.to, function(err,result) {
        if (err){
            console.log(err);
        }else{
            res.json(result);
        }
    })
}

module.exports.getIndividualChart1 = function(req, res) {
	Revision.drawIndividualChart1(req.query.title, req.query.from, req.query.to, function(err, result) {
        if (err){
            console.log(err);
        }else{
            res.json(result);
        }
    });
}

module.exports.getIndividualChart2 = function (req, res){
    Revision.drawIndividualChart2(req.query.title, req.query.from, req.query.to, function(err, result) {
        if (err){
            console.log(err);
        }else{
            res.json(result);
        }
    });
}

module.exports.getIndividualChart3 = function (req, res){
	var topUsers = req.query.users.split('{');
	Revision.drawIndividualChart3(req.query.title, topUsers, req.query.from, req.query.to, function(err, result) {
        if (err){
            console.log(err);
        }else{
            res.json(result);
        }
    });
}

module.exports.update = function (req, res){
	var topUsers = req.query.users.split('{');
	Revision.drawIndividualChart3(req.query.title, topUsers, req.query.from, req.query.to, function(err, result) {
        if (err){
            console.log(err);
        }else{
            res.json(result);
        }
    });
}
