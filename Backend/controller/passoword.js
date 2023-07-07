const nodemailer = require("nodemailer");
const forgotpassword = require("../models/passwordReq");
const { v4: uuidv4 } = require("uuid");
const { UUIDV4 } = require("sequelize");
const User = require("../models/user");
const passwordReq = require("../models/passwordReq");
const bcrypt = require("bcrypt");

const forgotPassword = async (req, res, next) => {
	const { email } = req.body;

	const user = await User.findOne({  email: email  });
	let newid = uuidv4();
	if (user) {
		let obj = {
			id: newid,
			active: true,
			userId: user.id,
		};
		await forgotpassword.create(obj);
	} else {
		return res.status(500).json({ message: "No account registered with this email", sucess: false });
	}

	const transporter = await nodemailer.createTransport({
		host: "smtp-mail.outlook.com",
		port: 587,
		auth: {
			user: process.env.EMAIL,
			pass: process.env.EMAIL_PASSWORD,
		},
		tls: {
			ciphers: "SSLv3",
		},
	});

	const mailOptions = {
		from: "lyfesahil@outlook.com",
		to: email,
		subject: "Donty worry we will help you get a new password",
		text: "hey qt",
		html: `<a href="http://localhost:3001/password/resetpassword/${newid}">click here to reset your password</a>`,
	};

	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			console.log(error);
			res.status(500).json({ message: `cannot send email `, success: false });
		} else {
			res.status(200).json({ message: `email sent successfully`, success: false });
		}
	});
};

async function resetpassword(req, res, next) {
	const { id } = req.params;

	let user = await passwordReq.findOne( {id: id } );

	if (user) {
		user.updateOne({ active: false });
		res.status(200).send(`<html>
                                    <script>
                                        function formsubmitted(e){
                                            e.preventDefault();
                                        }
                                    </script>

                                    <form action="/password/updatepassword/${id}" method="get">
                                        <label for="newpassword">Enter New password</label>
                                        <input name="newpassword" type="password" required></input>
                                        <button>reset password</button>
                                    </form>
                                </html>`);
		res.end();
	}
}

const updatepassword = async (req, res) => {
	try {
		const { newpassword } = req.query;
		const { id } = req.params;

		let find = await passwordReq.findOne({ where: { id: id } });

		if (find) {
			let user = await User.findOne({ where: { id: find.userId } });
			if (user) {
				let salt = await bcrypt.genSalt(10);
				let hashedPassword = await bcrypt.hash(newpassword, salt);

				await User.update({ password: hashedPassword }, { where: { id: user.id } });

				res.status(201).json({ message: "Successfuly update the new password" });
			}
		}
	} catch (error) {
		console.log(error);
		return res.status(404).json({ error: "no user exists", success: false });
	}
};

module.exports = { forgotPassword, resetpassword, updatepassword };
