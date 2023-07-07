const mongoose = require("mongoose");
const forgotpassword = new mongoose.Schema({
	active: {
		type: Boolean,
	},
	userId:{
		type:mongoose.Schema.Types.ObjectId
	} 
});

module.exports = mongoose.model("forgotpasswords",forgotpassword);
