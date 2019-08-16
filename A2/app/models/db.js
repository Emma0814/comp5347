var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost/wikipedia', {useNewUrlParser: true},function () {
	  console.log('mongodb connected1')
});

module.exports = mongoose;
