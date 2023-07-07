const mongoose = require("mongoose");
const expenseUser = new mongoose.Schema({
	amount: {
		type: Number,
	},
	description: {
		type: String,
	},
	category: {
		type: String,
	},
	userId:{
		type:mongoose.Schema.Types.ObjectId
	} 
});

module.exports = mongoose.model("expenses", expenseUser);
