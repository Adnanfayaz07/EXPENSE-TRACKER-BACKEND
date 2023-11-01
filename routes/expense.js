const express = require('express');
const router = express.Router();
const expenseController = require('../controller/expense');
const userauthentication=require('../middleware/auth')

router.post('/add-expense',userauthentication.authenticate,expenseController.addexpense)
router.get('/get-expense',userauthentication.authenticate,expenseController.getexpense)

router.delete('/delete-expense/:id',userauthentication.authenticate,expenseController.deleteexpense)
module.exports = router;