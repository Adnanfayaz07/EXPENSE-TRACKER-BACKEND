const express=require('express')
const bodyparser=require('body-parser')

const cors=require('cors')

const usersRoute=require('./routes/users')
const expenseRoutes=require('./routes/expense')
const purchaseRoutes=require('./routes/purchase')
const resetPasswordRoutes = require('./routes/resetpassword')
const premiumfeatureRoutes=require('./routes/premiumfeature')
const sequelize=require('./util/database')
const Users = require('./model/user')
const Expense = require('./model/expense')
const Order = require('./model/order')
const forgotpassword = require('./model/forgotpassword');
const app=express()
app.use(bodyparser.json())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors())
app.use('/user',usersRoute)
app.use('/expense',expenseRoutes)
app.use('/purchase',purchaseRoutes)
app.use('/premium',premiumfeatureRoutes)
app.use('/password', resetPasswordRoutes);
Users.hasMany(Expense)
Expense.belongsTo(Users)

Users.hasMany(Order)
Order.belongsTo(Users)

Users.hasMany(forgotpassword);
forgotpassword.belongsTo(Users);

sequelize.sync().then(()=>{
    console.log('model sucessfully synchronised')
    app.listen(3000)
})