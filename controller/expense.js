
const Expense = require('../model/expense');
const Users = require('../model/user');
const sequelize = require('../util/database')
exports.addexpense = async (req, res) => {
  const t = await sequelize.transaction();
  try{
  const name = req.body.name;
  const email = req.body.email;
  const phonenumber = req.body.phonenumber;
  if (name === undefined || name.length === 0) {
    return res.status(400).json({ success: false, message: "Bad parameters.Something is missing" })
  }
   const data = await Expense.create({
    name: name,
    email: email,
    phonenumber: phonenumber,
    userId: req.user.id
  }, { transaction: t })
    const totalExpense = Number(req.user.totalExpense) + Number(name)
    console.log(totalExpense)
   await  Users.update({
      totalExpense: totalExpense
    }, {
      where: { id: req.user.id },
      transaction: t
    })
      await t.commit()
      res.status(200).json({ expense: data })

    
  }catch (err) {
    await t.rollback()
    return res.status(500).json({ success: false, error: err })
  }

};
exports.getexpense = async (req, res) => {
  try {
    const expenses = await Expense.findAll({ where: { userId: req.user.id } })
    res.status(200).json({ expenses, success: true })
  } catch (error) {
    console.log('get user is failing', JSON.stringify(error))
  }
}
exports.deleteexpense = async (req, res) => {
  const t = await sequelize.transaction(); 
  try {
    if (req.params.id == 'undefined'||req.params.id.length===0) {
      return res.status(400).json({ err: 'ID is missing' });
    }
    const expenseId = req.params.id;

    const expenseToDelete = await Expense.findByPk(expenseId, { transaction: t });
    if (!expenseToDelete) {
      await t.rollback(); 
      return res.status(404).json({ err: 'Expense not found' });
    }
    if (expenseToDelete.userId !== req.user.id) {
      await t.rollback(); 
      return res.status(403).json({ err: 'Permission denied' });
    }
    const expenseAmount = Number(expenseToDelete.name);
    const user = await Users.findByPk(req.user.id, { transaction: t });
    if (user) {
      const totalExpense = Number(user.totalExpense) - expenseAmount;
      await user.update({ totalExpense }, { transaction: t });
    }
    await Expense.destroy({ where: { id: expenseId }, transaction: t });

    await t.commit(); 
    res.sendStatus(200);
  } catch (err) {
    await t.rollback(); 
    console.log(err);
    res.status(500).json(err);
  }
}