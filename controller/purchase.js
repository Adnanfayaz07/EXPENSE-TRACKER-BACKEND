const Razorpay=require('razorpay')
const Order=require('../model/order')
require('dotenv').config();
exports.purchasepremium = async (req,res)=>{
    try{
        console.log(process.env.Razorpay_KEY_ID)
        var rzp=new Razorpay({
           
            key_id:process.env.Razorpay_KEY_ID,
            key_secret:process.env.Razorpay_KEY_SECRET
        })
        const amount=2500;
        rzp.orders.create({amount,currency:"INR"},(err,order)=>{
            if(err){
                throw new Error(JSON.stringify(err))
            }
            req.user.createOrder({orderid:order.id,status:'PENDING'}).then(()=>{
                return res.status(201).json({order,key_id:rzp.key_id})
            }).catch(err=>{
                throw new Error
            })
        })
    }
    catch(err){
        console.log(err);
        res.status(403).json({message:'something went wrong',error:err})
    }
}
exports.updatetransactionStatus = async (req,res)=>{
    try{
        const{payment_id,order_id}=req.body
        const order=await Order.findOne({where:{orderid:order_id}})
        const promise1=order.update({paymentid:payment_id,status:'SUCCESSFUL'})
        const promise2=req.user.update({ispremiumuser:true})
        Promise.all([promise1,promise2]).then(()=>{
return res.status(202).json({success:true,message:'transaction successful'})
        }).catch((error)=>{
            throw new Error(error)
        })
    }catch(err){
        console.log(err)
        res.status(403).json({error:err,message:'something went wrong'})
    }

}