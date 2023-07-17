const Group=require('../models/group');
const Usergroup=require('../models/usergroup');
const Chat=require('../models/Chat');
const User = require('../models/User');

exports.createGroup=async(req,res,next)=>{
    try{
        const {groupname}=req.body;
        console.log(">>>>>>>>>>",groupname)
        if(groupname===undefined||groupname.length===0){
                return res.status(200).json({message:"SomeThing is Missing",success:false})
        }
    const group = await Group.create({groupname:groupname})
    console.log(req.user.id);
    console.log("???????????",group.id);

    const usergroup = await Usergroup.create({isadmin:true,groupId:group.id,userId:req.user.id});
    res.status(200).json({message:group,success:true,username:req.user.username})


    }catch(err){
        console.log(">>>>>>>>>",err);
        res.status(500).json({message:"Something went Wrong",success:false,error:err})

    }
}

exports.getAllGroups=async(req,res,next)=>{
    try{
    const groupList = await Group.findAll();
    res.status(200).json({message:groupList,success:true})

    }catch(err){
        console.log(">>>>>>>>>",err);
        res.status(500).json({message:"Something went Wrong",success:false,error:err})

    }
}

exports.getGroupMembers=async(req,res,next)=>{
    try{
        const groupId=+req.query.groupId;
        const memberslist = await Usergroup.findAll({where:{groupId:groupId}})
        let groupMembers = [];
        for(let member of memberslist){
            let groupMember = await User.findOne({where:{id:member.userId}})
            groupMembers.push(groupMember);
        }
        console.log(groupMembers);
        res.status(200).json({message:groupMembers});


    }catch(err){
        console.log(">>>>>>>>>",err);
        res.status(500).json({message:"Something went Wrong",success:false,error:err})
    }  
}



exports.deleteGroup=async(req,res,next)=>{

    try{
        const groupId=+req.query.groupId;
        
        const isadmin=await Usergroup.findOne({where:{groupId:groupId,isadmin:true,userId:req.user.id}})

        if(!isadmin){
          return res.status(500).json({message:"Only Admins are allowed to delete",success:false})  
        }
        await Group.destroy({where:{id:groupId}})
        await Chat.destroy({where:{id:groupId}})
        res.status(200).json({message:"Deleted Group Successfully ",success:true})

    }catch(err){
        console.log(">>>>>>>>>",err);
        res.status(500).json({message:"Something went Wrong",success:false,error:err})
    }  

}

exports.showChat = async(req,res,next)=>{
    try{
        const groupId=+req.query.groupId;
        const isInGroup= await Usergroup.findOne({where:{userId:req.user.id,groupId:groupId}})
        if(!isInGroup){
            return res.status(500).json({message:"You need to be a group member",success:false})
        } 
        res.status(200).json({message:"Welcome",success:true})
    }
    catch(err){
        console.log(">>>>>>>>>",err);
        res.status(500).json({message:"Something went Wrong",success:false,error:err})
    }
}

exports.addUser = async(req,res,next)=>{
    try{
        const{username}=req.body;
        const groupId=+req.query.groupId;
        const userToAdd= await User.findOne({
            where:{username:username},
            attributes:['id','username']
        })
        console.log(userToAdd);
        console.log(userToAdd.dataValues)
        const userId=userToAdd.dataValues.id;
        
        const isadmin=await Usergroup.findOne({where:{groupId:groupId,isadmin:true,userId:req.user.id}})

        if(!isadmin){
          return res.status(500).json({message:"Only Admins are allowed to add users",success:false})  
        }
        Usergroup.create({isadmin:false,groupId:groupId,userId:userId})
        res.status(200).json({message:"User has been added",success:true,userdata:userToAdd})
    }
    catch(err){
        console.log(">>>>>>>>>",err);
        res.status(500).json({message:"Something went Wrong",success:false,error:err})
    }
}

exports.deleteUser = async(req,res,next)=>{
    try{
        const groupId=+req.query.groupId;
        const delUid=+req.query.delUid;
        const isadmin=await Usergroup.findOne({where:{groupId:groupId,isadmin:true,userId:req.user.id}})

        if(!isadmin){
          return res.status(500).json({message:"Only Admins are allowed to delete",success:false})  
        }
        await Usergroup.destroy({where:{groupId:groupId,userId:delUid}})
        res.status(200).json({message:"Deleted User Successfully ",success:true})
    }
    catch(err){
        console.log(">>>>>>>>>",err);
        res.status(500).json({message:"Something went Wrong",success:false,error:err})
    }
}

exports.makeAdmin = async(req,res,next)=>{
    try{
        const groupId=+req.query.groupId;
        const memUid=+req.query.memUid;
        const isadmin=await Usergroup.findOne({where:{groupId:groupId,isadmin:true,userId:req.user.id}})

        if(!isadmin){
          return res.status(500).json({message:"Only Admins are allowed to delete",success:false})  
        }
        await Usergroup.update({
            isadmin:true
        },{
            where:{groupId:groupId,userId:memUid}
        })
        res.status(200).json({message:"User is now an Admin",success:true})
    }
    catch(err){
        console.log(">>>>>>>>>",err);
        res.status(500).json({message:"Something went Wrong",success:false,error:err})
    }
}