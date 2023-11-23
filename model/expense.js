const Sequelize=require('sequelize');
const sequelize=require('../util/database')
const expense=sequelize.define('expense',{
  id:{
      type:Sequelize.INTEGER,
      primaryKey:true,
      allowNull:false,
      autoIncrement:true
  },
  day:{
      type:Sequelize.INTEGER
  },
  month:{
      type:Sequelize.INTEGER
  },
  year:{
      type:Sequelize.INTEGER

  },
  amount:{
      type:Sequelize.INTEGER,
      allowNull:false
  },
  description:{
      type:Sequelize.STRING,
      allowNull:false

  },
  category:{
      type:Sequelize.STRING,
      allowNull:false
  }
})
module.exports=expense