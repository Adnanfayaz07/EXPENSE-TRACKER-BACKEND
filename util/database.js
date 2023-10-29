const Sequelize= require('sequelize');
const sequelize= new Sequelize('expense','root','adnanfayaz',{
  dialect:'mysql',
    host:'localhost',
})
module.exports=sequelize;