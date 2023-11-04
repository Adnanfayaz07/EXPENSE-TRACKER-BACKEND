const express = require('express');

const router=express.Router()
const purchaseController=require('../controller/purchase');
const authenticatemiddleware=require('../middleware/auth');

router.get('/premiummembership',authenticatemiddleware.authenticate,purchaseController.purchasepremium);
router.post('/updatetransactionstatus',authenticatemiddleware.authenticate,purchaseController.updatetransactionStatus);


module.exports=router