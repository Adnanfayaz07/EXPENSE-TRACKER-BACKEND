const Users = require('../model/user');
const Expense= require('../model/expense')
const sequelize=require('../util/database')

const getuserleadereboard=async(req,res)=>{
    try{
        const userleaderboarddetails=await Users.findAll({
          
            order:[['totalExpense','DESC']]
        })
       
        res.status(200).json(userleaderboarddetails)
    }catch(err){
        console.log(err)
        res.status(500).json(err)
        }
}

module.exports={
getuserleadereboard
}