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

    try {
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({user, token}); 
    }catch(e){
        res.status(400).send(e);
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


module.exports = router;