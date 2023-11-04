const express = require('express');

const premiumfeatureController = require('../controller/premiumfeature');
const userauthentication=require('../middleware/auth')
const router = express.Router();

router.get('/showleaderboard',userauthentication.authenticate,premiumfeatureController.getuserleadereboard)


module.exports = router;