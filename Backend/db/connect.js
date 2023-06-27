const { Sequelize } = require("sequelize");
const mysql = require("mysql2");

const sequelize = new Sequelize(process.env.SQL_DATABASE, process.env.SQL_USERNAME, process.env.SQL_PASSWORD, { dialect: "mysql", host: process.env.DB_HOST, logging: false });

module.exports = sequelize;
