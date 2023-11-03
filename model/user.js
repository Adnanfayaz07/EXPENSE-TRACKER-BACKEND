const Sequelize=require('sequelize')

const sequelize=require('../util/database')

const Users=sequelize.define('users',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true,
        unique:true
    },
    name:Sequelize.STRING,

    email:{
        type:Sequelize.STRING,
        allowNull:false,
        unique:true

    },
    password:Sequelize.STRING,
    ispremiumuser:Sequelize.BOOLEAN
        
})
    module.exports=Users