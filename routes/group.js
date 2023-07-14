const express=require('express');

const groupControllers=require('../controllers/group');
const userAuthentication=require('../middleware/auth');

const router=express.Router();

router.post('/create-group',userAuthentication.authenticate,groupControllers.createGroup);

router.get('/get-allgroups',groupControllers.getAllGroups);

router.get('/get-members',groupControllers.getGroupMembers);

router.delete('/delete-group',userAuthentication.authenticate,groupControllers.deleteGroup);

router.get('/show-chat',userAuthentication.authenticate,groupControllers.showchat);

router.post('/add-user',userAuthentication.authenticate,groupControllers.adduser);

module.exports=router;