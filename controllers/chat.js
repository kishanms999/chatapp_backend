const Chat=require('../models/Chat');

const User=require('../models/User');

exports.sendMessage=async (req,res,next)=>{
    try{
        const groupId=req.params.groupId;
        const {message}=req.body;
        const{username}=req.user;
        if(message.length===0||message===undefined){
            return res.status(500).json({message:"Something is missing",success:false})
        }
      const user = await req.user.createChat({username:username,message:message,groupId:groupId})
       res.status(200).json({message:user,success:true})
    }catch(err){
        console.log(err,">>>>>>>>>>>>>>>");
        res.status(500).json({message:"Something went Wrong"})
    }
}

exports.getMessages=async(req,res,next)=>{
    try{
        const lastmsgId=+req.query.lastmsgId||0;
        const groupId=+req.query.groupId;
        console.log(lastmsgId);
        const  messages = await Chat.findAll({
           where:{groupId:groupId},
           offset:lastmsgId,
           limit:10
        });
             res.status(200).json({message:messages,success:true})
    }catch(err){
        console.log(err);
        res.status(500).json({message:"Something went Wrong",success:false})
    }
    }