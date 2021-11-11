'use strict';

const express = require('express');
const User = require('./model/user');
const authToken = require('./auth/token');
const passport = require('passport');
const multer = require('multer');
const sharp = require('sharp');

require('./auth/local');

const upload = multer({
    limits: {
        fileSize: 20000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Only images can be used as avatar'));
        }

        cb(undefined, true)
    }
})


const router = new express.Router();

router.get('/users/home', authToken, (req, res) => {
    res.send('home');
})

router.post('/users/register', async (req, res) => {
    try {
        let userData = req.body;
        const user = new User(userData);
        const sameMail = await User.findOne({ email: req.body.email });


        if (sameMail) {
            throw new Error('That e-mail is already registered');
        }
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token });
    } catch (e) {
        let strError = e.toString();
        res.status(400).send(strError);
    }
});

router.post('/users/login', passport.authenticate('local', { session: false }), async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        const token = await user.generateAuthToken();
        res.send({ user, token });
    } catch (e) {
        res.status(400).send('Incorrect user or password');
    }
});

//This two could be joined in one. However /logout is not being used, it could be deleted.
router.post('/users/logout', authToken, async (req, res) => {         //
    try {                                                            //        
        req.user.tokens = req.user.tokens.filter((token) => {        //
            return token.token !== req.token;                       //
        })                                                          //                    
        await req.user.save();                                      //                
        res.send();                                                 //       
    } catch (e) {                                                     //                    
        res.status(500).send();                                     //    
    }                                                               //
});                                                                 //    
router.post('/users/logoutAll', authToken, async (req, res) => {      //
    try {
        req.user.tokens = [];                                       // 
        await req.user.save();                                      //    
        res.send();                                                 //    
    } catch (e) {                                                     //    
        res.status(500).send();                                     //        
    }                                                               //    
});                                                                 //            
//////////////////////////////////////////////////////////////////////



router.post('/users/addContactNoConf', authToken, async (req, res) => {
    try {
        let loggedId = req.body.logged;
        let searched = req.body.searched;
        let user = await User.findOne({ _id: loggedId });
        let contacts = user.contacts;


        let alreadyAddedList = contacts.filter(u => u._id === searched._id);
        let alreadyAdded = alreadyAddedList.length > 0;
        if (alreadyAdded) {
            res.status(403);
            throw new Error('The user is already added');
        }

        searched.status = 'pending';
        contacts.push(searched);
        user.contacts = contacts;
        await user.save();

        let searchedUser = await User.findOne({ _id: searched._id });
        let searchedContacts = searchedUser.contacts;
        let requester = {
            userName: user.userName,
            _id: user._id.toString(),
            email: user.email,
            newMsgs: false,
            status: 'request'
        }
        searchedContacts.push(requester);
        searchedUser.contacts = searchedContacts;
        await searchedUser.save();

        res.send(user);
    } catch (error) {
        console.log(error.toString());
        res.send(error.toString());
    }
})

router.patch('/users/confirmAdding', authToken, async (req, res) => {
    try {
        let participants = req.body.participants;
        let acceptedUser = await User.findById(participants[0]);
        let contactsOne = acceptedUser.contacts;
        contactsOne.map(c => {
            if (c._id === participants[1]) {
                c.status = 'accepted';
                c.newMsgs = true;
            }
            return c;
        })
        acceptedUser.contacts = contactsOne;
        acceptedUser.markModified('contacts');
        await acceptedUser.save();

        let acceptingUser = await User.findById(participants[1]);
        let contactsTwo = acceptingUser.contacts;
        contactsTwo.map(c => {
            if (c._id === participants[0]) {
                c.status = 'accepted';
                c.newMsgs = true;
            }
            return c;
        })
        acceptingUser.contacts = contactsTwo;
        acceptingUser.markModified('contacts');
        await acceptingUser.save();
        res.send();
    } catch (e) {
        res.status(500).send(e);
    }


})

// All the get user must be merged in one endpoint.
//Currently only getUserByEmail is in use.
// This will be the base and will be modified if needed
//Check if user is asking for its own profile or another one to decide what info return
router.get('/users/getUser', authToken, async (req, res) => {
    try {
        const user = await User.findOne({ email: req.query.email });
        if (!user) {
            throw new Error('No user was found');
        }

        if (req.query.selfUser) {
            res.send(user);
        } else {
            const userInfo = {
                userName: user.userName,
                _id: user._id,
                email: req.query.email
            }
            res.send(userInfo);
        }

    } catch (e) {
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
router.post('/users/changeLanguage', authToken, async (req, res) => {
    try {
        var user = await User.findOne({ email: req.body.email });
        user.language = req.body.language;
        await user.save();
        res.send();
    } catch (e) {
        let strError = e.toString();
        console.log(strError);
        res.status(404).send(strError);
    }
});


router.post('/users/updateUser', async (req, res) => {//I forgot to add auth
    try {
        let receiver = req.body.params.receiver;
        var user;
        if (typeof receiver === 'string') { //This means it comes from individual room.
            user = await User.findById(receiver);
            let contacts = user.contacts;
            contacts.forEach(c => {
                if (c._id === req.body.params.senderId) {
                    c.newMsgs = req.body.params.newStatus;
                }
            });
            user.contacts = contacts;
            user.markModified('contacts');
        } else { //Group room.
            user = await User.findById(receiver._id);
            let conversations = user.conversations;
            conversations.forEach(c => {
                if (c.roomId === req.body.params.roomId) {
                    c.newMsgs = req.body.params.newStatus;
                }
            });
            user.conversations = conversations;
            user.markModified('conversations');
        }
        /*var user = await User.findOne({email:req.body.params.email});
        if (typeof req.body.params.contactId !== Object){ //This means it comes from individual room
            let contacts = user.contacts;
            contacts.forEach(c => {
                if (c._id === req.body.params.contactId) {
                    c.newMsgs = req.body.params.newStatus;
                }
            });
            user.contacts = contacts;
            user.markModified('contacts');
        } else {
            let conversations = user.conversations;
            conversations.forEach(c => {
                if (c.roomId === req.body.params.roomId) {
                    c.newMsgs = req.body.params.newStatus;
                }
            });
            user.conversations = conversations;
            user.markModified('conversations');
        }*/

        await user.save();
        res.send();
    } catch (e) {
        let strError = e.toString();
        console.log(strError);
        res.status(404).send(strError);
    }
});

router.post('/users/newRoom', authToken, async (req, res) => {
    try {
        let participants = req.body.participants;
        participants.forEach(async p => {
            let user = await User.findById(p._id);
            var conversations;
            if (!user.conversations) {
                conversations = [];
            } else {
                conversations = user.conversations;
            }

            let conversationsIds = conversations.map(c => c.roomId);
            if (!conversationsIds.includes(req.body.roomId)) {
                conversations.push(req.body);
                user.conversations = conversations;
            }
            await user.save();
        })
        res.send();
    } catch (error) {
        console.log(error);
        let strError = e.toString();
        console.log(strError);
        res.status(404).send(strError);
    }
});


router.post('/users/avatar', authToken, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer();
    req.user.avatar = buffer;
    req.user.hasAvatar = true;
    await req.user.save();
    res.send(req.user);
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
});

router.post('/users/avatar/check', upload.single('avatar'), async (req, res) => {
    res.send(true);
}, (error, req, res, next) => {
    error.toString()
    res.status(400).send(error.toString())
});

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user || !user.avatar) {
            throw new Error();
        }
        res.set('Content-Type', 'image/png');
        res.send(user.avatar);

    } catch (e) {
        res.status(404).send(e);
    }
});


module.exports = router;