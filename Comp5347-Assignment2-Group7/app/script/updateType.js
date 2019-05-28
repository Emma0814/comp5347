var mongoose = require('mongoose');
var fs = require('fs');

var admin_active = fs.readFileSync(__dirname + '/../../public/admin_active.txt').toString().split("\n");
var admin_former = fs.readFileSync(__dirname + '/../../public/admin_former.txt').toString().split("\n");
var admin_inactive = fs.readFileSync(__dirname + '/../../public/admin_inactive.txt').toString().split("\n");
var admin_semi_active = fs.readFileSync(__dirname + '/../../public/admin_semi_active.txt').toString().split("\n");
var bot = fs.readFileSync(__dirname + '/../../public/bot.txt').toString().split("\n");
var admin = admin_active.concat(admin_former).concat(admin_inactive).concat(admin_semi_active);
var notRegular = admin.concat(bot);

mongoose.connect('mongodb://localhost/wikipedia', function () {
    console.log('mongodb updated');
})

var RevisionSchema = new mongoose.Schema(
	{
		title: String,
		timestamp: String,
		user: String,
	    anon: Boolean,
	    type: String,
	    subtype: String
	 },
     {
		versionKey: false
	 }
);

var Revision = mongoose.model('Revision', RevisionSchema, 'revisions')

Revision.updateMany(
		{anon: true},
		{$set: {type: 'anon'}}
	).exec(function(err,result) {
		if (err) {
			console.log("Query error1!")
		} else {
			console.log("type anon update success");
			console.log(result)
		}

	});

Revision.updateMany(
		{anon: {$exists: false}, user: {$in: bot}},
		{$set: {type: 'bot'}}
	).exec(function(err,result) {
		if (err) {
			console.log("Query error2!")
		} else {
			console.log("type bot update success");
			console.log(result)
		}

	});

Revision.updateMany(
		{anon: {$exists: false}, user: {$nin: notRegular}},
		{$set: {type: 'regular'}}
	).exec(function(err,result) {
		if (err) {
			console.log("Query error3!")
		} else {
			console.log("type regular update success");
			console.log(result)
		}

	});

Revision.updateMany(
		{anon: {$exists: false}, user: {$in: admin}},
		{$set: {type: 'admin'}}
	).exec(function(err,result) {
		if (err) {
			console.log("Query error4!")
		} else {
			console.log("type admin update success");
			console.log(result)
		}

	});

Revision.updateMany(
		{anon: {$exists: false}, user: {$in: admin_active}},
		{$set: {subtype: 'active'}}
	).exec(function(err,result) {
		if (err) {
			console.log("Query error5!")
		} else {
			console.log("subtype admin_active update success");
			console.log(result)
		}

	});

Revision.updateMany(
		{anon: {$exists: false}, user: {$in: admin_former}},
		{$set: {subtype: 'former'}}
	).exec(function(err,result) {
		if (err) {
			console.log("Query error6!")
		} else {
			console.log("subtype admin_former update success");
			console.log(result)
		}

	});

Revision.updateMany(
		{anon: {$exists: false}, user: {$in: admin_inactive}},
		{$set: {subtype: 'inactive'}}
	).exec(function(err,result) {
		if (err) {
			console.log("Query error7!")
		} else {
			console.log("subtype admin_inactive update success");
			console.log(result)
		}

	});

Revision.updateMany(
		{anon: {$exists: false}, user: {$in: admin_semi_active}},
		{$set: {subtype: 'semi_active'}}
	).exec(function(err,result) {
		if (err) {
			console.log("Query error8!")
		} else {
			console.log("subtype admin_semi_active update success");
			console.log(result)
		}

	});		
