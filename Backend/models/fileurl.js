const mongoose = require("mongoose");

const fileurl = new mongoose.Schema({
	fileURL: {
		type: String,
	},
	userId: {
		type: mongoose.Schema.Types.ObjectId,
	},
});

module.exports = mongoose.model('fileurls',fileurl);
