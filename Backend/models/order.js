const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../db/connect");

const Order = sequelize.define("order", {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true,
	},
	paymentid: {
		type: DataTypes.STRING,
	},
	orderid: {
		type: DataTypes.STRING,
	},
	status: {
		type: DataTypes.STRING,
	},
});
module.exports = Order;
