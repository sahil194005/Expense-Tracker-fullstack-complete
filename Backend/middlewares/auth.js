const User = require("../models/user");
const jwt = require("jsonwebtoken");

const authentication = async (req, res, next) => {
	try {
		
		const token = req.header("Authorization");
		// console.log(token);
		const { userId } = jwt.verify(token, "secretKey");
		// console.log(userId);
		let currUser = await User.findById(userId);
		req.user = currUser;
		next();
	} catch (error) { 
		console.log(error);
		return res.status(401).json({ success: false, message: error });
	}
};

module.exports = { authentication };
