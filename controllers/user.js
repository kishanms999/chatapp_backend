const User = require('../models/User');
const bcrypt=require('bcrypt');

function isstringinvalid(string){
    if(string== undefined || string.length === 0){
        return true
    } else{
        return false 
    }
}

const signup = async (req,res,next)=>{
    try{
    const {name,email,phonenumber,password}=req.body;

    if(isstringinvalid(name) || isstringinvalid(email) || isstringinvalid(phonenumber) || isstringinvalid(password) ){
        return res.status(400).json({err:"Bad parameters. Something is missing"})
    }

    const saltrounds=10;
    bcrypt.hash(password,saltrounds, async (err,hash)=>{
        await User.create({name,email,password:hash});
        res.status(201).json({message:'Successfully created new user'});
    })    

    } catch(err){
        res.status(500).json(err)
    }
}

module.exports = {
    signup
}