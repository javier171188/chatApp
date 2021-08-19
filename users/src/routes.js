'use strict';

const express = require('express');
const User = require('./model/user');
var passport = require('passport');

require('./auth/local');

const router = new express.Router();

router.get('/home', (req,res) =>{
    res.send('home');
})

router.post('/register', (req, res)=> {
    const user = new User(req.body);

    user.save().then(() => {
        res.status(201).send(user);
    }).catch((e) => {
        res.status(400).send(e);
    });
});

router.post('/login', passport.authenticate('local', { session:false }), async(req, res)=> {
    try{
        const user = await User.findOne({email:req.body.email});
        res.send(user);
    } catch(e){
        res.status(400).send(); 
    }
});

module.exports = router;