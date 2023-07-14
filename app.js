const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const dotenv=require('dotenv');

dotenv.config();

const sequelize=require('./util/database');

var cors=require('cors');

app.use(cors({
    origin:"*"
}));

const User = require('./models/User');

const Chat=require('./models/Chat');

const Group=require('./models/group')

const UserGroup=require('./models/usergroup')

const userRoutes=require('./routes/user');

const chatRoutes=require('./routes/chat');

const groupRoutes=require('./routes/group');

app.use(bodyParser.json({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

User.hasMany(Chat);
Chat.belongsTo(User);

User.belongsToMany(Group,{through :UserGroup}); 
Group.belongsToMany(User,{through :UserGroup});

Group.hasMany(Chat);
Chat.belongsTo(Group);

app.use('/user',userRoutes);
app.use('/chat',chatRoutes);
app.use('/group',groupRoutes);

sequelize.sync().then(result=>{
    app.listen(process.env.PORT||3000);
})
.catch(err=>{
    console.log(err);
})