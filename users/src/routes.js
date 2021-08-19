'use strict';

const express = require('express');
const User = require('./model/user');

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

router.post('/login', async(req, res)=> {
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password);
        res.send(user);
    } catch(e){
        res.status(400).send(); 
    }
});

module.exports = router;