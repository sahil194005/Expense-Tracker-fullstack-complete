const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signup = async (req, res, next) => {
	try {
		const { email } = req.body;
		let obj = await User.findOne( { email: email  });
		if (obj) {
			res.status(409).json({ message: "email already exits", success: false });
		} else {
			let salt = await bcrypt.genSalt(10);
			let hashedPassword = await bcrypt.hash(req.body.password, salt);
			req.body.password = hashedPassword;
			
			let result = await User.create(req.body);
			res.status(201).json({ success: true, msg: "user created", user: result });
		}
	} catch (error) {
		console.log(error);
		res.json({ message: error, success: false });
	}
};

function generateAccessToken(id, premium) {
	let x = jwt.sign({ userId: id, ispremium: premium }, "secretKey");
	return x;
}

const login = async (req, res, next) => {
	try {
		const { email, password } = req.body;
		let obj = await User.findOne( { email: email  });
		if (obj) {
			let passwordMatch = await bcrypt.compare(password, obj.password);
			if (passwordMatch) {
				res.status(200).json({ message: "login successfully", success: true, token: generateAccessToken(obj.id, obj.ispremiumuser) });
			} else {
				res.status(400).json({ success: false, message: "invalid password" });
			}
		} else {
			res.status(404).json({ success: false, message: "email does not exist" });
		}
	} catch (error) {
		res.status(500).json({ message: error, success: false });
	}
};

module.exports = { signup, login };
