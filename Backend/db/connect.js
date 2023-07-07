const mongoose = require("mongoose");

const connectDB = async () => {
	try {
		const conn = await mongoose.connect(
			`mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER}.mongodb.net/${process.env.MONGO_DB_NAME}?retryWrites=true&w=majority`,
			{
				useNewUrlParser: true, // It is used to parse and interpret the MongoDB connection string in a way that is compatible with the MongoDB Node.js driver's updated URL parser.
				// useCreateIndex: true, //avoid use ensureIndex which is depreciated in nodejs
				// useFindAndModify: false,
				// useUnifiedTopology: true, //avoid depreciation warnings
			}
		);
		console.log(`MongoDB Connected`);
	} catch (error) {
		console.error(error);
	}
};

module.exports = connectDB;
