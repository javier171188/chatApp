'use strict';

const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

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
   /* avatar: {
        type: Binary
    },
    friends:{
        type: Array
    }, 
    tokens:{
        type:Array
    }, */
});

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user){
        throw new Error('E-mail or password are incorrect.');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error('E-mail or password are incorrect.');
    }

    return user;
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