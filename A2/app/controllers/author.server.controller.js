var Revision = require("../models/revision")

module.exports.getAuthorName = function(req,res) {
    Revision.findAuthorName(function(err,result) {
        if(err){
            console.log(err);
        }
        else{
            res.json(result);
        }
    })
}

module.exports.getChangedArticles = function(req,res){
    Revision.findChangedArticles(req.query.user,function(err,result) {
        if(err){
            console.log(err);
        }
        else{
            res.json(result);
        }
    })
}

module.exports.getChangedTimeStamp = function(req,res) {
    Revision.findChangedTimeStamp(req.query.user, req.query.title, function(err,result) {
        if(err){
            console.log(err);
        }
        else{
            res.json(result);
        }
    })
}