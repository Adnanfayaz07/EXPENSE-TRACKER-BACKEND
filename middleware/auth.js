
const User=require('../model/user')
const  jwt =require('jsonwebtoken')

const authenticate=(req,res,next)=>{
    try{
        const token=req.header('Authorization')
        const user=jwt.verify(token,'hellonomo');
        console.log(user.userId)
        User.findByPk(user.userId).then(user=>{
console.log(user)
            req.user=user;

            next();
        })
    }catch(err){
        console.log(err)
        return res.status(401).json({success:false})
    }
}
module.exports={

    authenticate
}