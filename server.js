require('dotenv').config();
const express = require('express')
const bcrypt=require('bcrypt');
const path=require('path');
const cors=require('cors');
const mongoose = require('mongoose');
const jwt=require('jsonwebtoken');
const { type } = require('os');
const jwtPassword=process.env.JWT_PASSWORD;
mongoose.connect(process.env.MONGO_URL);

const app = express()

  
  

const port = 3000
const mySchema=new mongoose.Schema({

  email: {
    type:String,
    unique:true,
    required:true
  
  },

  password:{
    type:String,
    required:true,
  }

})
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname,'public')));

const myUser=mongoose.model('myUsers',mySchema);
//authenticate middleware

const authenticate=(req,res,next)=>{
  const authHeader=req.headers.authorization;
  const {email,password}=req.body;


  console.log("This is authenticate middleware");
  
 

  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {

    console.log("inside condition of (if token not present) in authenticate middleware");
    

    return res.status(401).json({msg:'Authorization token is missing or invalid'})
    
  }
  const token=authHeader.split(' ')[1];


    try {
     
      console.log("Under try block");
      
      const decoded=jwt.verify(token,jwtPassword);
      if (decoded.email===email && decoded.password===password) {
        console.log("Under if block of checking user is present in the DB");
        next()
        

        
      }else{
        console.log("User is not authorized so again login");
        return res.status(403).sendFile(path.join(__dirname,'public','signin.html'))

        
      }
      
      
      
      
    } catch (error) {
      console.log("Inside catch of authenticate middleware");
      console.log("Internal error");
      

      return res.status(403).json({msg:'invalid or expired token'})
      
      
    }
 

}
//finding user and next to create middleware

const findUserAndCreate=async (req,res,next)=>{
  const {email,password}=req.body;
  const user=await myUser.findOne({email});
  console.log(user);
  
  if (!user) {
    console.log('User not found so creating through create middleware');
  
  
    next();
    
  }else{

    console.log('User is present in the DB');
    const ismatch=await bcrypt.compare(password,user.password)
    if (ismatch) {
      return res.status(403).sendFile(path.join(__dirname,'public','signin.html'))
      
    }
    
    
  }

}
// finding user and next to Authenticate middleware
const findUserAndAuthenticate=async (req,res,next)=>{
  console.log("Under findUserAndAuthenticate");
  
  const {email,password}=req.body;
  const user=await myUser.findOne({email});
  console.log('User in DB is: ',user);
  

  if (!user) {
    console.log('User not found so not authenticating');
    return res.status(403).sendFile(path.join(__dirname,'public','signin.html'))
  
   
    
  }else{

    // console.log('User Found so authenticate');
    const ismatch=await bcrypt.compare(password,user.password)
    // console.log('ismatch is: ',ismatch);
    
    if (ismatch) {
      next();
      
    }
    
    
    
  }

}

//creating user middleware
const creatingUser=async (req,res,next)=>{
  const {email,password}=req.body;
    
    console.log("creating user in middleware hitted for signup");

  
      try {
        console.log('Under Try of CreatingUser MiddleWare');
        
        const hashedPassword=await bcrypt.hash(password,10);
        // console.log('hashed password is: ',hashedPassword,'And type is: ',typeof hashedPassword);
        
        const token=jwt.sign({email,password},jwtPassword,{expiresIn:'10m'});
        // console.log('Token is: ',token);
        
      // console.log(`email= ${email} and password= ${password}`);
        const newUser=await myUser({email,password:hashedPassword})
        await newUser.save();
        req.token=token;
        next()
   
        
      } catch (error) {
        return res.status(500).json({msg:'Internal Error occred',error})
        
      }
      
   

}



app.get('/', (req, res) => {
    console.log('get handler of signin hitted');
    

    res.status(200).sendFile(path.join(__dirname,'public','signin.html'));
    
    
})


//signin


app.post('/signin',findUserAndAuthenticate,(req,res)=>{
  console.log('get handler of signin hitted');
  res.status(200).json({msg:'signin Successfully',redirect:'/main.html'})
 
})

//signup
app.post('/signup',findUserAndCreate,creatingUser,async (req,res)=>{
  const token=req.token;
  console.log("Signup hitted");
  res.status(200).json({msg:'form received successfull',token})
  

})


app.post('/main',authenticate,()=>{
  console.log('This is main.html');

  res.status(200).json({msg:'User is authentic'})

})

app.post('/dbcheck',async (req,res)=>{
  const {email,password}=req.body;
  
  try {
    const user=await myUser.findOne({email});
    const ismatch=await bcrypt.compare(password,user.password)
  if (!user) {
    res.status(404).json({msg:'User not Found'})
    return
    
  }else{
    if (ismatch) {
      res.status(200).json({msg:'User Found so can access resources'})
    }

    
  }
    
  } catch (error) {
    console.log("Error Occured in fetching in backend",error);
  
    
    
  }
})

app.post('/city',async (req,res)=>{
  const city=req.body.city;
  console.log(city);
  try {
    const response=await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=2&appid=${process.env.WEATHER_API_ID}`)
    if (!response.ok) {
      console.log("Response from Weather API is not OK");
      return
      
      
    }
    if (response.ok) {
      const data=await response.json();
    console.log("This is Data",data);

    try {
      const response2=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${data[0].lat}&lon=${data[0].lon}&units=metric&appid=${process.env.WEATHER_API_ID}`)
      
      const data2=await response2.json();

      res.status(200).json({humidity:data2.main.humidity,temperature:data2.main.temp,precipitation:data2.main.pressure})
      console.log('weather info data2',data2.main);

      

      
    } catch (error) {
      console.log('Error Occured in fetching Weather',error);
      
      
    }

    
    }
    
    
    
  } catch (error) {
    console.log('Error Occured in fetching Cities',error);
    
    
  }
  
 
  

})

app.get('/main.html',authenticate,(req,res)=>{
  console.log('This is main.html');

  res.status(200).json({msg:'User is authentic'})
  
})
//signin.html get page

app.get('/signin.html',(req,res)=>{
  res.sendFile(path.join(__dirname,'public','signin.html'))
})
//API key get request
app.get('/key',(req,res)=>{
  res.status(200).json({key:process.env.GEOAPI_ID})
})
//listening

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
}) 