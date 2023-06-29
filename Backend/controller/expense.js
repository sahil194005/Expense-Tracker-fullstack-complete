const { where } = require("sequelize");
const sequelize = require("../db/connect");
const { expenseUser } = require("../models/expense");
const User = require("../models/user");
const AWS = require("aws-sdk");
const fileurl = require("../models/fileurl");

const addExpense = async (req, res, next) => {
	const t = await sequelize.transaction();
	try {
		const { amount, description, category, userId } = req.body;
		await expenseUser.create(
			{
				amount: amount,
				description: description,
				category: category,
				userId: req.user.id,
			},
			{ transaction: t }
		);

		let toalexp = Number(amount) + Number(req.user.total_cost);
		await User.update(
			{
				total_cost: toalexp,
			},
			{ where: { id: req.user.id }, transaction: t }
		);

		await t.commit();
		res.status(200).json({ message: "user added", success: true, checout: req.user });
	} catch (error) {
		await t.rollback();
		// console.log(error);
		res.status(500).json({ message: error });
	}
};

const getAllExpense = async (req, res, next) => {
	try {
		console.log(req.user.id);
		const allusers = await expenseUser.findAll({ where: { userId: req.user.id } });
		res.json(allusers);
	} catch (error) {
		console.log(error);
	}
};

const deleteExpense = async (req, res, next) => {
	try {
		let { id } = req.params;
		let tbd = await expenseUser.findOne({ where: { id: id } });

		let total = req.user.total_cost;
		let curr = tbd.amount;

		let result = await expenseUser.destroy({ where: { id: id } });
		if (result) {
			await User.update(
				{
					total_cost: total - curr,
				},
				{
					where: {
						id: req.user.id,
					},
				}
			);
			res.json({ message: "user deleted", success: true });
		} else {
			res.status(500).json({ message: "not yours to tamper with", success: false });
		}
	} catch (error) {
		res.status(500).json({ message: error, success: false });
	}
};

async function uploadToS3(data, filename) {
	let s3bucket = new AWS.S3({
		accessKeyId: process.env.IAM_USER_KEY,
	
		secretAccessKey: process.env.IAM_USER_SECRET,
	});
	var params = {
		Bucket: process.env.BUCKET_NAME,
		Key: filename,
		Body: data,
		ACL: "public-read", 
	};
	return new Promise((resolve, reject) => {
		s3bucket.upload(params, (err, s3response) => {
			if (err) {
				
				console.log("something went wrong ", err);
				reject(err);
			} else {
				resolve(s3response.Location);
			}
		});
	});
}

async function downloadexpense(req, res, next) {
	try {
		const expenses = await req.user.getExpenses();
		const stringifiedExpenses = JSON.stringify(expenses);
		let userId = req.user.id;
		const filename = `Expenses${userId}/${new Date()}.txt`;
		const fileURL = await uploadToS3(stringifiedExpenses, filename);
		let obj = {
			fileURL: fileURL,
			userId: req.user.id,
		};
		fileurl.create(obj);
		res.status(200).json({ fileURL, success: true });
	} catch (error) {
		
		console.log(error);
		res.status(500).json({ message: "failed to download expenses", success: false });
	}
}

async function allfiles(req, res, next) { 
	try {
		let lis = await fileurl.findAll({ where: { userId: req.user.id } });
		res.json(lis);
	} catch (error) {
		console.log(error);
		res.json({ message: "not able to fetch files", success: false });
	}
}

async function pagination(req, res, next) {
	try {
		
		const page = Number(req.query.currpage) ;
		let totalItems = await expenseUser.count({where:{userId:req.user.id}});
		let expensePerPage = await expenseUser.findAll({
			offset: (page - 1) * Number(req.query.expPerPage),
			limit: Number(req.query.expPerPage),
			where:{userId:req.user.id}
		});
		
		res.json({
			expenses: expensePerPage,
			currPage: page,
			hasNextPage: Number(req.query.expPerPage) * page < totalItems,
			nextPage: Number(page) + 1,
			hasPreviousPage: page > 1,
			previousPage: page - 1,
			lastPage: Math.ceil(totalItems / Number(req.query.expPerPage)),
		});
	} catch (error) {
		console.log(error);
		res.json(error); 
	}
}

module.exports = { addExpense, getAllExpense, deleteExpense, downloadexpense, allfiles, pagination };
