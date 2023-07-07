const mongoose = require("mongoose");
const User = new mongoose.Schema({
	name: {
		type: String,
	},
	email: {
		type: String,
	required:true,
		unique: true,
	},
	password: {
		type: String,
	},
	ispremiumuser: {
		type: Boolean,
		default:false,
	},
	total_cost: {
		type: Number,
		default: 0,
	},
});

module.exports = mongoose.model("User", User);
