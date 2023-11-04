
const Users = require('../model/user');
const bcrypt = require('bcrypt')
const jwt=require('jsonwebtoken')

function isstringinvalid(string) {
    if (string == undefined || string.length === 0) {
        return true
    }
    else {
        return false

    }
}
const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        console.log('email', email)
        if (isstringinvalid(name) || isstringinvalid(email) || isstringinvalid(password)) {
            return res.status(400).json({ err: "Bad parameters.Something is missing" })
        }
        const saltrounds = 10;
        bcrypt.hash(password, saltrounds, async (err, hash) => {
            console.log(err);
            await Users.create({ name, email, password: hash })
            res.status(201).json({ message: 'successfully create new user' })
        })

    }
    catch (err) {
        res.status(500).json(err)
    }
}
const  generateAccesstoken= (id,name,ispremiumuser)=>{
return jwt.sign({userId:id,name:name,ispremiumuser},'hellonomo')
}
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (isstringinvalid(email) || isstringinvalid(password)) {
            return res.status(400).json({ message: "Emailid or Password is missing", success: false })
        }
        console.log(password);
        const user = await Users.findAll({ where: { email } })
        if (user.length > 0) {
            bcrypt.compare(password, user[0].password,(err, result) => {
                if(err) {
                    throw new Error('something went wrong')
                }
                   if(result==true) {
                  return   res.status(200).json({ success: true, message: 'user logged in successfully',token:generateAccesstoken(user[0].id,user[0].name,user[0].ispremiumuser) })
                }
                    else{
                    return res.status(400).json({ success: false, message: "password is incorrect" })
                }

            })
        }
                    else {
                    return res.staus(404).json({ success: false, message: 'user doesnot exist' })
                }
                
            }
                catch (err) {
            res.status(500).json({ message: err, success: false })
        }

    }
    module.exports = {
        signup: signup,
        login: login,
        generateAccesstoken: generateAccesstoken, // Use lowercase "generateAccesstoken"
    };