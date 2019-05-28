var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost/wikipedia',function () {
	  console.log('mongodb connected2')
	});


var userSchema = new mongoose.Schema(
		{
			firstname:     String, 
			lastname:      String, 
			username:      String,
			password:      String
		 });

var User = mongoose.model('User', userSchema);
module.exports = User;