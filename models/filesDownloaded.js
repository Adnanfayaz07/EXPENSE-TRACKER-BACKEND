const Sequelize=require('sequelize')
const sequelize=require('../util/database')

const filesDownloaded=sequelize.define('filesdownload',{
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        unique:true, 

    },
    URL:Sequelize.STRING,
    date:Sequelize.DATE
    

})
module.exports=filesDownloaded