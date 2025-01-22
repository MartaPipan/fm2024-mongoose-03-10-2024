const mongoose = require('mongoose');
const { isAfter, isToday } = require('date-fns');
const { contentSchema, loginSchema } = require('../utils/validadionSchema');
const { Schema } = mongoose;

const messageSchema = new Schema(
    {
        content: {
            type: String,
            required: true,
            validate: {
                validator: (value) => contentSchema.isValid(value),
                message: (props) => `Error: ${props.value} is invalid content`,
            },
        },
        author: {
            login: {
                type: String,
                required: true,
                validate: {
                    validator: (value) => loginSchema.isValid(value),
                    message: (props) => `Error: ${props.value} login is invalid`,
                },
            },
            role: {
                type: String,
                enum: ['user', 'admin'],
            },
        },
        datePublic: {
          type: Date,
            default: Date.now,
            validate: {
                validator: (value) => isToday(value) || isAfter(value, new Date()),
                message: (props) => `Error: ${props.value} is invalid datePublic`,
            },
        },
        isRead: {
            type: Boolean,
            default: false,
        },
        isImportant: {
            type: Boolean
        },
        visible: {
            type: String,
            enum: ['all', 'private']
        },
        emotions: [{type: mongoose.Types.ObjectId, ref: "Emotion"}] //// emotions: [{}], but emotions is array
    },
    {
        timestamps: true,
        versionKey: false
    }
);

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;
