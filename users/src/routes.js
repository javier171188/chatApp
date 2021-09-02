'use strict';

const express = require('express');
const User = require('./model/user');
const authToken = require('./auth/token');
var passport = require('passport');

require('./auth/local');

const router = new express.Router();

router.get('/home', authToken, (req,res) =>{
    res.send('home');
})

router.post('/register', async (req, res)=> {
    const user = new User(req.body);
    const sameMail = await User.findOne({email:req.body.email});
    const sameName = await User.findOne({email:req.body.userName});
    try {
        if (sameName){
            throw new Error('That user name is already taken');
        }
        if (sameMail){
            throw new Error('That e-mail is already registered');
        }
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({user, token}); 
    }catch(e){
        res.status(400).send(e);
        console.log(e);
    }
});

router.post('/login', passport.authenticate('local', { session:false }), async(req, res)=> {
    try{
        const user = await User.findOne({email:req.body.email});
        const token = await user.generateAuthToken();
        res.send({ user, token });
    } catch(e){
        res.status(400).send(); 
    }
});

router.post('/logout',authToken, async (req, res) =>{
    try{
        req.user.tokens = req.user.tokens.filter((token)=> {
            return token.token !== req.token;
        })
        await req.user.save();
        res.send();
    } catch(e){
        res.status(500).send();
    }
});

router.post('/logoutAll',authToken, async (req, res) =>{
    try{
        req.user.tokens = [];
        await req.user.save();
        res.send();
    } catch(e){
        res.status(500).send();
    }
});

router.get('/getUserById', authToken, async (req, res) => {
    try {
        const user = await User.findOne({_id:req.body._id});
        res.send(user);
    } catch(e){
        res.status(404).send();
    }   
});

router.get('/getUserByName', authToken, async (req, res) => {
    try {
        const user = await User.findOne({userName:req.body.userName});
        //res.send(user);
        res.send('not your user');
    } catch(e){
        res.status(404).send();
    }   
});

router.get('/getUserByPattern', authToken, async (req, res) => {
    try {
        const s = req.body.userName;
        const regex = new RegExp(s, 'i');
        const user = await User.find({userName: {$regex: regex}});
        res.send(user);
    } catch(e){
        res.status(404).send();
    }   
});


module.exports = router;