const mongoose = require('mongoose');
const { isAfter} = require('date-fns')
const { BooleanSchema } = require('yup');
const { contentSchema , loginSchema} = require('../utils/validadionSchema');
const { Schema } = mongoose;

const messageSchema = new Schema({
    content: {
        type: String,
        required: true,
        validate: {
            validator: (value) => contentSchema.isValid(value),
            message: (props) => `Error: ${props.value} is invalid content`
        }
    },
    author: {
        login: {
            type: String,
            required: true,
            validate: {
                validator: (value) => loginSchema.isValid(value),
                message: (props) => `Error: ${props.value} login is invalid`
            },
        },
        role: {
            type: String,
            enum: ['user', 'admin']
        }
    },
    datePublic: {
        type: Date,
        default: Date.now(),
        validate: {
            validator: (value) => isAfter(value, Date.now()),
            message: (props) => `Error: ${props.value} is invalid datePublic`
        }
    },
    isRead: {
        type: Boolean,
        default: false

    },
    isImportant: {
        type: Boolean
    },
    timestamps: true
});
const Message = mongoose.model('Message', 'messageSchema');
module.exports = Message;