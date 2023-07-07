const mongoose = require('mongoose');
const Order = new mongoose.Schema({
	paymentid: {
		type: String,
	},
	orderid: {
		type: String,
	},
	status: {
		type: String, 
	},
	userId:{
		type:mongoose.Schema.Types.ObjectId
	} 
})

module.exports = mongoose.model('orders',Order);
