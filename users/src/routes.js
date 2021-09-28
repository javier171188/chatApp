'use strict';

const express = require('express');
const User = require('./model/user');
const authToken = require('./auth/token');
const passport = require('passport');
const multer = require('multer');
const sharp = require('sharp');

require('./auth/local');

const upload = multer({
    limits:{
        fileSize: 20000000
    },
    fileFilter(req, file, cb){
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('Only images can be used as avatar'));
        }

        cb(undefined, true)
    }
})


const router = new express.Router();

router.get('/users/home', authToken, (req,res) =>{
    res.send('home');
})

router.post('/users/register', async (req, res)=> {
    try {
        let userData =req.body;
        const user = new User(userData);
        const sameMail = await User.findOne({email:req.body.email});


        if (sameMail){
            throw new Error('That e-mail is already registered');
        }
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({user, token}); 
    }catch(e){
        let strError = e.toString();
        res.status(400).send(strError);
    }
});

router.post('/users/login', passport.authenticate('local', { session:false }), async(req,res)=> {
    try{
        const user = await User.findOne({email:req.body.email});
        const token = await user.generateAuthToken();
        res.send({ user, token });
    } catch(e){
        res.status(400).send('Incorrect user or password'); 
    }
});

//This two could be joined in one. However /logout is not being used, it could be deleted.
router.post('/users/logout',authToken, async (req, res) =>{         //
    try{                                                            //        
        req.user.tokens = req.user.tokens.filter((token)=> {        //
            return token.token !== req.token;                       //
        })                                                          //                    
        await req.user.save();                                      //                
        res.send();                                                 //       
    } catch(e){                                                     //                    
        res.status(500).send();                                     //    
    }                                                               //
});                                                                 //    
router.post('/users/logoutAll',authToken, async (req, res) =>{      //
    try{                                                            //        
        req.user.tokens = [];                                       // 
        await req.user.save();                                      //    
        res.send();                                                 //    
    } catch(e){                                                     //    
        res.status(500).send();                                     //        
    }                                                               //    
});                                                                 //            
//////////////////////////////////////////////////////////////////////



//This must be fixed to ask for confirmation.
router.post('/users/addContactNoConf', authToken, async(req,res) => {
    try{
        let loggedId = req.body.logged;
        let searched = req.body.searched;
        let user = await User.findOne({_id:loggedId});
        let contacts = user.contacts;

        let alreadyAddedList = contacts.filter( u => u._id === searched._id);
        let alreadyAdded = alreadyAddedList.length > 0;

        if (alreadyAdded) {
            res.status(403);
            throw new Error('The user is already added');
        }

        contacts.push(searched);
        user.contacts = contacts;
        await user.save();
        res.send(user);
    } catch(error){
        console.log(error.toString());
        res.send(error.toString());
    }
})


// All the get user must be merged in one endpoint.
//Currently only getUserByEmail is in use.
// This will be the base and will be modified if needed
//Check if user is asking for its own profile or another one to decide what info return
router.get('/users/getUser',authToken, async (req, res) => {
    try {
        const user = await User.findOne({email:req.query.email});
        
        if (!user) {
            throw new Error('No user was found');
        }

        if (req.query.selfUser){
            res.send(user);
        } else {
            const userInfo = { userName: user.userName,
                _id: user._id,
                email:req.query.email
            }
            res.send(userInfo);
        }
                        
    } catch(e){
        let strError = e.toString();
        res.status(404).send(strError);
    }   
});
/*
router.get('/users/getUserById', authToken, async (req, res) => {
    try {
        const user = await User.findOne({_id:req.body._id});
        res.send(user);
    } catch(e){
        res.status(404).send();
    }   
});

router.get('/users/getUserByName', authToken, async (req, res) => {
    try {
        const users = await User.find({userName:req.body.userName});
        const usersInfo = users.map( user => {
            return { userName: user.userName,
                     _id: user._id
            }
        })
        res.send(usersInfo);
    } catch(e){
        res.status(404).send();
    }   
});
router.get('/users/getUserByPattern', authToken, async (req, res) => {
    try {
        const s = req.body.userName;
        const regex = new RegExp(s, 'i');
        const user = await User.find({userName: {$regex: regex}});
        res.send(user);
    } catch(e){
        res.status(404).send();
    }   
});*/
/////////////////////////////////////////////////////////////////////////////////

router.post('/users/updateUser',  async (req, res) => {
try {
    //console.log(req.body);
    var user = await User.findOne({email:req.body.params.email});
    if (!req.body.params.roomId){ //This means there must be userId
        let contacts = user.contacts;
        contacts.forEach(c => {
            if (c._id === req.body.params.contactId) {
                c.newMsgs = req.body.params.newStatus;
            }
        });
        user.contacts = contacts;
        user.markModified('contacts');
    } else{
        let conversations = user.conversations;
        conversations.forEach(c => {
            if (c.roomId === req.body.params.roomId) {
                c.newMsgs = req.body.params.newStatus;
            }
        });
        user.conversations = conversations;
        user.markModified('conversations');
    }
    
    await user.save();
    res.send();
} catch (e){
    let strError = e.toString();
    console.log(strError);
    res.status(404).send(strError);
}});

router.post('/users/newRoom', authToken, async (req, res) => {
try {
    let participants = req.body.participants;
    participants.forEach( async p => {
        let user = await User.findById(p._id);
        var conversations;
        if (!user.conversations){
            conversations = [];
        } else {
            conversations = user.conversations;
        }

        conversations.push(req.body);
        user.conversations = conversations;
        
        await user.save();
    } )
    res.send();
} catch (error){
    console.log(error);
    let strError = e.toString();
    console.log(strError);
    res.status(404).send(strError);
}
});


router.post('/users/avatar', authToken, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer();
    req.user.avatar = buffer;
    req.user.hasAvatar = true;
    await req.user.save();
    res.send(req.user);
}, (error, req, res, next) => {
    res.status(400).send({ error:error.message })
} );

router.post('/users/avatar/check',  upload.single('avatar'), async (req, res) => {
    res.send(true);
}, (error, req, res, next) => {
    error.toString()
    res.status(400).send(error.toString())
} );

router.get('/users/:id/avatar', async (req, res) => {
    try{
        const user = await User.findById(req.params.id);
        if(!user || !user.avatar){
            throw new Error();
        }
        res.set('Content-Type', 'image/png');
        res.send(user.avatar);

    }catch(e){
        res.status(404).send(e);
    }
});


module.exports = router;