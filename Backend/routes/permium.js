const express = require('express')
const router = express.Router();
const {leaderboard} = require('../controller/premium')
const {authentication} = require('../middlewares/auth')

router.route('/leaderboard').get(authentication,leaderboard);

module.exports = router;