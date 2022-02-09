require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const mongoose = require('mongoose')
var md5 = require('md5');

const app = express()

app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static('public'))
app.set('view engine','ejs')

mongoose.connect('mongodb://localhost:27017/usersDB')

const userSchema = new mongoose.Schema({
    email:String,
    password:String
})


const User = mongoose.model('user',userSchema)

app.get('/',(req,res)=>{
    res.render('home')
})

app.get('/login',(req,res)=>{
    res.render('login')
})

app.get('/register',(req,res)=>{
    res.render('register')
})

app.post('/register',(req,res)=>{
    const newUser = new User({
        email:req.body.username,
        password:md5(req.body.password)
    })
    newUser.save((err)=>{
        if(err){
            console.log(err)
        }
        else{
            res.render('secrets')
        }
    })
})

app.post('/login',(req,res)=>{
    User.findOne({email:req.body.username},(err,foundUser)=>{
        if(err){
            console.log(err)
        }
        else{
            if(foundUser){
                if(foundUser.password === md5(req.body.password)){
                    res.render('secrets')
                }
            }
        }
    })
})

app.listen(3000,()=>{
    console.log('Server running on port 3000')
})