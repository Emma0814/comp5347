var Revision = require("../models/revision")

module.exports.getOverallHighAndLowArticle = function (req, res) {
        Revision.findArticles(Number(req.query.order), Number(req.query.num), function(err, result){
            if (err){
                console.log(err);
            }else{
                res.json(result);
            }
        });
}

module.exports.getOverallLargestRegistered = function (req, res) {
        Revision.findRegistered(Number(req.query.order), function(err, result){
            if (err){
                console.log(err);
            }else{
                res.json(result);
            }
        });
    }

module.exports.getOverallLowestRegistered = function (req, res) {
    Revision.findRegistered(Number(req.query.order), function(err, result){
        if (err){
            console.log(err);
        }else{
            res.json(result);
        }
    });
}

module.exports.getOverallLongestHistory = function (req, res) {
    Revision.findHistory(Number(req.query.order), function(err, result){
        if (err){
            console.log(err);
        }else{
            res.json(result);
        }
    });
}

module.exports.getOverallShortestHistory = function (req, res) {
        Revision.findHistory(Number(req.query.order), function(err, result){
            if (err){
                console.log(err);
            }else{
                res.json(result[0]);
            }
        });
    }


module.exports.getOverallBar = function (req, res){
        Revision.findOverallBar(function(err, result){
            if (err){
                console.log(err);
            }else{
                res.json(result);
            }
        });
    }


module.exports.getOverallPie = function (req, res){
        Revision.findOverallPie(function(err, result){
        	if (err){
                console.log(err);
            }else {
                res.json(result);
            }
        });

    
}

module.exports.getOverallPieAdmin = function (req, res){
    Revision.findAdminSubtype(function(err, result){
        if (err){
            console.log(err);
        }else {
            res.json(result);
        }
    });
}
