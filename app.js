const express=require('express')
const bodyparser=require('body-parser')

const cors=require('cors')

const usersRoute=require('./routes/users')
const expenseRoutes=require('./routes/expense')
const purchaseRoutes=require('./routes/purchase')
const sequelize=require('./util/database')
const Users = require('./model/user')
const Expense = require('./model/expense')
const Order = require('./model/order')
const app=express()
app.use(bodyparser.json())
app.use(cors())
app.use('/user',usersRoute)
app.use('/expense',expenseRoutes)
app.use('/purchase',purchaseRoutes)
Users.hasMany(Expense)
Expense.belongsTo(Users)

Users.hasMany(Order)
Order.belongsTo(Users)

sequelize.sync({force:false}).then(()=>{
    console.log('model sucessfully synchronised')
    app.listen(3000)
})