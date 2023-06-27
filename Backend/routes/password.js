const express = require('express');
const {forgotPassword,resetpassword, updatepassword} = require('../controller/passoword')
const router = express.Router(); 


router.route('/forgotpassword').post(forgotPassword);
router.route('/resetpassword/:id').get(resetpassword)
router.route('/updatepassword/:id').get(updatepassword)


module.exports = router;   