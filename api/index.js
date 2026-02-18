const express = require('express');
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

app.post('/login',(req,res)=>{
    const {email, password, remember} = req.body;
    console.log(email,password,remember);

    if(email && password){
        res.json({success: true, message:'Login successful'})
    }else{
        res.status(400).json({success: false, message:'Email and password are required'})
    }
})

app.post('/register',(req,res)=>{
    const {email, password, remember} = req.body;  
    console.log(email,password,remember);
    
    if(email && password && remember){
        res.json({success: true, message:'Registration successful'})
    }else{
        res.status(400).json({message:'Email, password, and remember me are required'})
    }
})

module.exports = app;
