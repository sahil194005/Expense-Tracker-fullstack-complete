const express = require("express");
const https = require('https')
const cors = require("cors");
require('dotenv').config();
const bodyParser = require("body-parser");
const userRoute = require("./routes/user");
const expenseRoute = require('./routes/expense')
const paymentRoute = require('./routes/payment')
const permiumRoute = require('./routes/permium')
const passwordroute = require('./routes/password');
const sequelize = require("./db/connect");
const User = require('./models/user')
const {expenseUser} = require('./models/expense')
const Order = require('./models/order');
const fileurl = require('./models/fileurl')
const forgotpassword = require('./models/passwordReq')
const path = require('path');
const fs = require('fs');
const app = express();
const morgan = require('morgan')
const helmet = require('helmet');



const accessLogStream = fs.createWriteStream(
	path.join(__dirname,'access.log'),
	{flags:'a'}
);


// app.use(morgan('combined',{stream:accessLogStream}));
//production
app.use(helmet())
app.use(cors());




//middlewares
app.use(bodyParser.json());

//routes 
app.use('/user',userRoute);
app.use('/expense',expenseRoute)
app.use('/purchase',paymentRoute) 
app.use('/premium',permiumRoute)
app.use('/password',passwordroute)
 
User.hasMany(expenseUser);
expenseUser.belongsTo(User);

User.hasMany(Order)
Order.belongsTo(User);

User.hasMany(forgotpassword);
forgotpassword.belongsTo(User)

User.hasMany(fileurl);
fileurl.belongsTo(User);


async function serverStart() {
	try {
		await sequelize.sync(); 
		app.listen(process.env.PORT, () => {

			console.log(`server listening on port ${process.env.PORT}...`);
		});
	} catch (error) {
		console.log(error)
	} 
}
serverStart()

