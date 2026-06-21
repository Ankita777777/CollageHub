const User = require('../models/User')
const Student = require('../models/Student')
const jwt = require('jsonwebtoken')

const generateToken = (id)=>{
   return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRE})
}

//@POST /api/auth/register
const register = async(req,res,next)=> {
    try{
 const {name,email,password, role}= req.body
 const exists = await User.findOne({email})
 if(exists) return res.status(400).json({message:'User already exists'})

const user= await User.create({name,email, password,role})
res.status(201).json({_id: user._id, name, email, role, token: generateToken(user._id)})
    }
    catch(err){
        next(err)
    }
}

//@Post /api/auth/login
const login = async(req, res) => {
const {email,password} = req.body
const user = await User.findOne({email})
if(!user || !(await user.matchPassword(password)))
 return res.status(401).json({message:'Invalid Credentials'})

res.json({_id:user._id, name:user.name, email,role:user.role,token:generateToken(user._id)})
};


const getMe = (req, res) => {
res.json(req.user)
};

module.exports = {register,login,getMe}