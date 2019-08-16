var mongoose=require('mongoose');
var User = require('../models/user.revision')
var error;

module.exports.signinJudgement = function (req,res){
    if(req.session.signin == 0){
    	res.render('signin.ejs',{
    		error: ''
    	})
    }
    else{
        if( req.cookies.siginin){
        	if(req.session.username != undefined){
        		res.render('main.ejs',{
        			username:req.session.username
			})
        	}
        	else{
        		res.render('signin.ejs',{
            		error:''
            	})
        	}
        }
        else{
        	res.render('signin.ejs',{
        		error:''
        	})
        }
    }
}


//Log out and return to the signin page
module.exports.logout = function(req, res) {
	req.session.signin = 0;
	res.render('signin.ejs', {error:''})
}

//Jump to register page
module.exports.regist = function(req,res){
	res.render('register.ejs',{error:''})
}

//Check information from register form
module.exports.registCheck = function(req,res){
    var user = new User(
    		{
				firstname: req.body.firstname,
				lastname: req.body.lastname,
				username: req.body.username,
				password: req.body.password,
    		}
    	)
    User.find({username: req.body.username}, function (err, rdata){
    	if (rdata.length != 0){
    		res.render('register.ejs', {error: 'Username already exist'})
    	} else {
    		req.session.username = req.body.username;
			req.session.signin = 1;
			res.cookie('siginin', req.body.username, {maxAge:10*60*1000});
			user.save(function(err,result){
				if(err){
					console.log(err)
				} else{
					res.render('main.ejs', {username: req.body.username})
				}
			})

    	}
    })
}

//Check information from signin form
module.exports.signinCheck = function (req, res) {
	User.find({username: req.body.username, password: req.body.password}, function (err, rdata) {
		if (rdata.length == 0) {
			res.render('signin.ejs', {error: 'Username or password is incorrect'})
		} else {
			req.session.signin = 1;
			req.session.username = req.body.username;
			res.cookie('siginin', req.body.username, {maxAge:10*60*1000});
			res.render('main.ejs', {username: req.body.username});
		}
	})
}
