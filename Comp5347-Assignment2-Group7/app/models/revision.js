var mongoose = require('./db');

var RevisionSchema = new mongoose.Schema(
    {
        title: String,
        timestamp: String,
        anon: Boolean,
        revid: String,
        user: String,
        type: String,
        subtype: String
    },
    {
        versionKey: false
    });

/**
 *  Overview part
 */
RevisionSchema.statics.findArticles = function(order, number, callback){
    return this.aggregate([
            {$group: {_id: "$title", total: {$sum: 1}}},
            {$sort: {total: order}},
            {$limit: number}
        ]).exec(callback);
};

RevisionSchema.statics.findRegistered = function(order, callback){
    return this.aggregate([
        {$match:
                { type: {$ne: 'anon'}}
        },
        // {$match: {type: 'regular'}},
        {$group: {_id: {title: "$title", user: "$user"}}},
        {$group: {_id: "$_id.title", total: {$sum: 1}}},
        {$sort: {total: order}},
        {$limit: 1}
    ]).exec(callback);
};

RevisionSchema.statics.findHistory = function(order, callback){
    return this.aggregate([
        {$group: {_id: "$title", timestamp: {"$min": "$timestamp"}}},
        {$sort: {timestamp: order}},
        {$limit: 2}
    ]).exec(callback);
};

RevisionSchema.statics.findOverallBar = function(callback){
    return this.aggregate([
        {$group: {
            _id : {
                year: {$substr: ["$timestamp", 0, 4]},
                type: '$type'
            },
            total : {$sum : 1}
        }},
        {$sort: {"_id.year": 1}}
    ]).exec(callback);
};

RevisionSchema.statics.findOverallPie = function(callback){
    return this.aggregate([
        {$group: {_id: "$type", total: {$sum: 1}}}
    ]).exec(callback)
};

RevisionSchema.statics.findAdminSubtype = function(callback){
    return this.aggregate([
        {$match: {subtype: {$exists: true}}},
        {$group: {_id: "$subtype", total: {$sum: 1}}},
    ]).exec(callback)
};

/*
 *  Individual Part
 */
RevisionSchema.statics.findArticle = function(callback) {
    return this.aggregate([
        {$group: {_id: "$title", total: {$sum:1}}},
        {$sort: {_id: 1}}
    ]).exec(callback)
}

RevisionSchema.statics.miniYear = function(callback) {
	return this.aggregate([
		{$group: {_id: {}, minYear: {$min: "$timestamp"}}}
	]).exec(callback)
}

RevisionSchema.statics.lastDate = function(title, callback) {
	return this.find(
		{title: title},
		{timestamp: 1}
	)
	.sort({timestamp: -1})
	.limit(1)
	.exec(callback)
}

RevisionSchema.statics.updataRevisions = function(qs, callback) {
	this.insertMany(qs);
	return callback(null, qs.length);
}

RevisionSchema.statics.findRevision = function(title, from, to, callback) {
    return this.find(
        {title: title, timestamp: {$gt: from, $lt: to}}
    ).count()
    .exec(callback)
}

RevisionSchema.statics.findUsers = function(title, from ,to, callback) {
    return this.aggregate([
        {$match: {title: title, timestamp: {$gt: from, $lt: to}, type: 'regular'}},
        {$group: {_id: "$user", total: {$sum:1}}},
        {$sort: {total: -1, _id: 1}},
        {$limit: 5}
    ]).exec(callback)
}

RevisionSchema.statics.findTopUsers = function(title, from, to, callback) {
	return this.aggregate([
		{$match: {title: title, timestamp: {$gt: from, $lt: to}}},
        {$group: {_id: "$user", total: {$sum:1}}},
        {$sort: {total: -1}},
        {$limit: 5}
    ]).exec(callback)
}

RevisionSchema.statics.drawIndividualChart1 = function(title, from, to, callback) {
	return this.aggregate([
		{$match: {title: title, timestamp: {$gt: from, $lt: to}}},
        {$group:
            {
                _id: {year: {$substr:["$timestamp",0,4]}},
                admin: {"$sum": {"$cond": {if: {"$eq": ["$type", "admin"]}, then: 1, else: 0}}},
          	    anon: {"$sum": {"$cond": {if: {"$eq": ["$type", "anon"]}, then: 1, else: 0}}},
           		bot: {"$sum": {"$cond": {if: {"$eq": ["$type", "bot"]}, then: 1, else: 0}}},
          	    regular: {"$sum": {"$cond": {if: {"$eq": ["$type", "regular"]}, then: 1, else: 0}}}
        	},
        },
        {$sort: {_id: 1}}
    ]).exec(callback)

}

RevisionSchema.statics.drawIndividualChart2 = function(title, from, to, callback) {
	return this.aggregate([
        {$match: {title: title, timestamp: {$gt: from, $lt: to}}},
        {$group: {_id: "$type", number: {$sum: 1}}},
        {$project: {
                _id: 0,
                type:"$_id",
                number: "$number"
            }},
    ]).exec(callback)
}

RevisionSchema.statics.drawIndividualChart3 = function(title, topUsers, from, to, callback) {
	return this.aggregate([
		{$match: {title: title, user: {$in: topUsers}, timestamp: {$gt: from, $lt: to}}},
        {$group: {
            _id : {
                year: {$substr: ["$timestamp", 0, 4]},
                user: '$user'
            },
            total : {$sum : 1}
        }},
        {$sort: {"_id.year": 1}},
    ]).exec(callback)
}

/**
 *  Author part
 */
RevisionSchema.statics.findAuthorName = function(callback) {
    return this.distinct("user").exec(callback)
}

RevisionSchema.statics.findChangedArticles = function(user, callback){
    return this.aggregate([
        {$match: {user: user}},
        {$group: {_id: "$title", total: {$sum: 1}}},
        {$sort: {total: -1}}
    ]).exec(callback)
}

RevisionSchema.statics.findChangedTimeStamp = function(user, title, callback) {
 return this.find({user: user, title: title}, {timestamp: 1})
 .sort({timestamp: -1})
 .exec(callback)
}



var Revision = mongoose.model('Revision', RevisionSchema, 'revisions')

module.exports = Revision
