const express = require('express');

const app = express();
const port = 3000

app.use(express.json());
app.use(express.static('public'))

app.get('/',(req,res)=>{
    res.send('App listening.....')
})

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

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`)
})
