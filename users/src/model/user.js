'use strict';

const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Invalid e-mail');
            };
        },
        unique: true
    },
    password: {
        type: String,
        required: true,
        validate(value){
            if(value.length < 6){
                throw new Error ('The password most contain at least 6 characters.')
            }
        }
    }, 
    tokens:[{
        token:{
            type: String,
            required: true
        }
    }],
    friends: []
});

userSchema.methods.toJSON = function (){
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;

    return userObject;
}


userSchema.methods.generateAuthToken = async function(){
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, 'secretsign');
    user.tokens = user.tokens.concat({ token });
    await user.save();
        
    return token;
}

userSchema.pre('save', async function(next){
    const user = this;

    if (user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
})

const User = mongoose.model('User', userSchema);

module.exports = User;