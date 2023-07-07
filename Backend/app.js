const express = require("express");
const https = require("https");
const cors = require("cors");
require("dotenv").config();

const bodyParser = require("body-parser");
const userRoute = require("./routes/user");
const expenseRoute = require('./routes/expense')
const paymentRoute = require('./routes/payment')
const permiumRoute = require('./routes/permium')
// const passwordroute = require('./routes/password');
const connectDb = require("./db/connect");
const User = require('./models/user')
const expenseUser = require('./models/expense')
const Order = require('./models/order');
const fileurl = require('./models/fileurl')
const forgotpassword = require('./models/passwordReq')
const path = require("path");
const fs = require("fs");
const connectDB = require("./db/connect");
const app = express();

//production

app.use(cors());

//middlewares
app.use(bodyParser.json());

//routes
app.use('/user',userRoute);
app.use('/expense',expenseRoute)
app.use('/purchase',paymentRoute)
app.use('/premium',permiumRoute)
// app.use('/password',passwordroute)

// app.use((req,res)=>{

// 	res.sendFile(path.join(__dirname,`public/${req.url}`))
// })  
 
async function serverStart() {
	try { 
		await connectDB();
		app.listen(process.env.PORT, () => {
			console.log(`server listening on port ${process.env.PORT}...`);
		});
	} catch (error) {
		console.log(error); 
	}
}
serverStart();
