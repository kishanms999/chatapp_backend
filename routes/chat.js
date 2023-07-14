const express=require('express');

const messageControllers=require('../controllers/chat');
const userAuthentication=require('../middleware/auth');

const router=express.Router();

router.post('/add-message/:groupId',userAuthentication.authenticate,messageControllers.sendMessage);

router.get('/get-message',messageControllers.getMessages);
module.exports=router;