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

const userRoutes=require('./routes/user');

app.use(bodyParser.json({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/user',userRoutes);

sequelize.sync().then(result=>{
    app.listen(process.env.PORT||3000);
})
    
.catch(err=>{
    console.log(err);
})