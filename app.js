require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt');

const app = express()
const saltRounds = 10;

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
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        if(err){
            console.log(err)
        }
        else{
            const newUser = new User({
                email:req.body.username,
                password:hash
            })
            newUser.save((err)=>{
                if(err){
                    console.log(err)
                }
                else{
                    res.render('secrets')
                }
            })
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
                bcrypt.compare(req.body.password, foundUser.password, function(err, result) {
                    // result == true
                    if(result===true){
                        res.render('secrets')
                    }
                })
            }
        }
    })
})

app.listen(3000,()=>{
    console.log('Server running on port 3000')
})