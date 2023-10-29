const express = require('express');
const router = express.Router();
const expenseController = require('../controller/expense');

router.post('/add-expense',expenseController.addexpense)
router.get('/get-expense',expenseController.getexpense)

router.delete('/delete-expense/:id',expenseController.deleteexpense)
module.exports = router;