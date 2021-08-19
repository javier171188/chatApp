'use strict';

const mongoose = require('mongoose');
const validator = require('validator');

const User = mongoose.model('User', {
    userName: {
        type: String,
        required: true,
        trim: true
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
            if(!value.length < 6){
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
})

module.exports = User;