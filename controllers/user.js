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
        try{
            await User.create({name,email,phonenumber,password:hash});
            res.status(201).json({message:'Successfully created new user'});
        }
        catch(err){
            if(err.name="SequelizeUniqueConstraintError"){
               err="User Already Exists!  Please Login";
            } 
            else{
            err="OOPS! Something Went wrong";
            }
                res.status(500).json({
                    message:err
                });
            }  
    })    

    } catch(err){
        res.status(500).json({
            message:err
        });
    }
}

module.exports = {
    signup
}