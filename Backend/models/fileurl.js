const sequelize = require("../db/connect");
const { Sequelize, DataTypes } = require("sequelize");

const fileurl = sequelize.define(`fileurl`, {
	id: {
		unique: true,
		primaryKey: true,
		autoIncrement: true,
		type: DataTypes.INTEGER,
	},
	fileURL: {
		type: DataTypes.STRING,
	},
});

module.exports = fileurl;
