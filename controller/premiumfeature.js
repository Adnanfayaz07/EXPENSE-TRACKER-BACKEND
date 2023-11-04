const Users = require('../model/user');
const Expense= require('../model/expense')
const sequelize=require('../util/database')

const getuserleadereboard=async(req,res)=>{
    try{
        const users=await Users.findAll()
        const expenses=await Expense.findAll()
        const useraggregatedexpenses={}
        expenses.forEach((expense) => {
            if(useraggregatedexpenses[expense.userId]){
                useraggregatedexpenses[expense.userId]+=expense.name
            }
            else{
                useraggregatedexpenses[expense.userId]=expense.name
            }
            
        });
        var userleaderboarddetails=[]
        users.forEach((user)=>{
            userleaderboarddetails.push({name:user.name,total_cost:useraggregatedexpenses[user.id]||0})
        })
        console.log(userleaderboarddetails)
        userleaderboarddetails.sort((a,b)=>b.total_cost-a.total_cost)
        res.status(200).json(userleaderboarddetails)
    }catch(err){
        console.log(err)
        res.status(500).json(err)
        }
}

module.exports={
getuserleadereboard
}