
const Expense= require('../model/expense');
const Users = require('../model/user');
exports.addexpense = async (req, res) => {
      const name = req.body.name;
      const email = req.body.email;
      const phonenumber = req.body.phonenumber;
if(name===undefined||name.length===0){
  return res.status(400).json({ success:false,message: "Bad parameters.Something is missing" })
}
     Expense .create({
        name: name,
        email: email,
        phonenumber: phonenumber,
        userId:req.user.id
      }).then(data => {
        const totalExpense=Number(req.user.totalExpense)+Number(name)
        console.log(totalExpense)
        Users.update({
          totalExpense:totalExpense
        },{
          where:{id:req.user.id}
        }).then(async()=>{
          res.status(200).json({expense:data})

        }).catch(async(err)=>{
          return res.status(500).json({success:false,error:err})
        })
      }).catch(async(err)=>{
        return res.status(500).json({success:false,error:err})
      })
   
  };
exports.getexpense=async(req,res)=>{
    try{
        const expenses=await Expense.findAll({where:{userId:req.user.id}})
        res.status(200).json({expenses,success:true})
    }catch(error){
        console.log('get user is failing',JSON.stringify(error))
    }
}
exports.deleteexpense=async(req,res)=>{
    try{
        if(req.params.id=='undefined'){
            console.log('ID is missing')
            return res.status(404).json({err:'ID is missing'})
        }
        const uId=req.params.id;
        await Expense.destroy({where:{id:uId}})
        res.sendStatus(200)
    }
    catch(err){
        console.log(err)
        res.status(500).json(err)
    }
}