const Order = require("../models/order");
const Razorpay = require("razorpay");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

function generateAccessToken(id, premium) {
	let x = jwt.sign({ userId: id, ispremium: premium }, "secretKey");
	return x;
}

const purchasePremium = async (req, res, next) => {
	try {
		var rzp = new Razorpay({
			key_id: process.env.RAZORPAY_KEY_ID,
			key_secret: process.env.RAZORPAY_KEY_SECRET,
		});

		const amount = 3000;

		rzp.orders.create({ amount, currency: "INR" }, (err, order) => {
			if (err) {
				console.log(err);
				res.json({ message: err, success: false });
			}

			Order.create({ orderid: order.id, status: "PENDING", paymentid: "NULL", userId: req.user.id })
				.then(() => {
					return res.status(201).json({ order, key_id: rzp.key_id });
				})
				.catch((err) => {
					res.json({ message: err, success: false });
				});
		});
	} catch (error) {
		console.log(error);
		res.status(401).json({ message: error, success: false });
	}
};

const updateTransactionStatus = async (req, res, next) => {
	try {
		const { payment_id, order_id } = req.body;
		const userId = req.user.id;
		const order = await Order.findOne( { orderid: order_id });
		const promise1 = order.updateOne({ paymentid: payment_id, status: "successfull" });
		const promise2 = req.user.updateOne({ ispremiumuser: true });
		await Promise.all([promise1, promise2]);
		return res.status(202).json({ success: true, message: "transaction successful", token: generateAccessToken(userId, true) });
	} catch (error) {
		console.log(error);
		res.json({ message: error, success: false });
	}
};

const updateTransactionStatusFailed = async (req, res, next) => {
	try {
		const { payment_id, order_id } = req.body;
		const order = await Order.findOne({ orderid: order_id } );
		await order.updateOne({ paymentid: payment_id, status: "failed" });
		return res.status(202).json({ success: true, message: "updated successfully" });
	} catch (error) {
		console.log(error);
		res.json({ message: error, success: false });
	}
};

module.exports = { purchasePremium, updateTransactionStatus, updateTransactionStatusFailed };
