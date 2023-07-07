const User = require("../models/user");
const { expenseUser } = require("../models/expense");
const sequelize = require("../db/connect");

const leaderboard = async function (req, res, next) {
	try {
		let newleaderboard =await  User.find({})
			.select('name total_cost')
			.sort({'total_cost':-1});
		
		res.json(newleaderboard);
	} catch (error) {
		console.log(error);
		res.send(error);
	}
};

module.exports = { leaderboard }; 
