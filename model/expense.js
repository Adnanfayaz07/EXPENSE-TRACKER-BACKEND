const Sequelize=require('sequelize');
const sequelize=require('../util/database')
const Expense=sequelize.define('EXPENSE',{
  id: {
    type:Sequelize.INTEGER,
    autoIncrement: true,
    allowNULL:false,
    primaryKey:true
  },
  name:Sequelize.STRING,
  email:Sequelize.STRING,

 phonenumber:Sequelize.STRING,



});

module.exports = Expense;