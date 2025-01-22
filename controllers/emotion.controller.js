const mongoose = require('mongoose');
const _ = require("lodash");
const { ms } = require('date-fns/locale');
const Message = require('../models/Message');
const Emotion = require('../models/Emotion');


module.exports.createEmotion = async (req, res, next) => {
    try {
        const {
            params: { messageId: msgId},//->>params from getMessage,lesson121-2>>55min
            body } = req;
        let values = _.pick(body);
        
        // Перевірка наявності повідомлення
        const message = await Message.findById(msgId);
        if (!message) {
            return next(new Error('Message not found'));
        }
        // Створення емоції
        const emotion = await Emotion.create({ ...body, messageId: msgId });
        if (!emotion) {
            return next(new Error('Error creating emotion'));
        }
        //add emotion to message
        const emotionsArray = [...message.emotions, emotion._id];
        await Message.findByIdAndUpdate(msgId, { emotions: emotionsArray }, { new: true });
        
        res.status(201).send({ data: emotion });
    } catch (error) {
        next(error);
    }
};


module.exports.getAllEmotions = async (req, res, next) => {
    try {
        const {
            params: { messageId: msgId},} = req;//->>params from getMessage,lesson121-2>>55min
        // Перевірка наявності повідомлення
        const message = await Message.findById(msgId);
        if (!message) {
            return next(new Error('Message not found'));
        }
        const emotions = await Emotion.find({ messageId: msgId }).populate('messageId').exec();//in Model Emotion we have field MessageId !!!
        if (!emotions) {
            return next(new Error('Bad request'));
        }
        res.status(200).send({ data: emotions });
    } catch (error) {
        next(error);
    }
};
