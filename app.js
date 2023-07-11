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

const userRoutes=require('./routes/user');

const chatRoutes=require('./routes/chat');

app.use(bodyParser.json({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

User.hasMany(Chat);
Chat.belongsTo(User);

app.use('/user',userRoutes);
app.use('/chat',chatRoutes);

sequelize.sync().then(result=>{
    app.listen(process.env.PORT||3000);
})
.catch(err=>{
    console.log(err);
})