const User = require("../models/user");
const { expenseUser } = require("../models/expense");
const sequelize = require("../db/connect");

const leaderboard = async function (req, res, next) {
	try {
		let newleaderboard =await  User.findAll({
			attributes:['name','total_cost'],
			order:[['total_cost','DESC']]
		})
		
		res.json(newleaderboard);
	} catch (error) {
		console.log(error);
		res.send(error);
	}
};

module.exports = { leaderboard }; 
