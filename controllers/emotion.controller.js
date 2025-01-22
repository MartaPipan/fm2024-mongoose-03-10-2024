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

/*
 module.exports.updateEmotion = async (req, res, next) => {
    try {
        const { params: { messageId, emotionId }, body } = req; // Отримуємо messageId та emotionId з параметрів запиту
        const { emotion } = body;

        // Перевірка наявності повідомлення
        const message = await Message.findById(messageId);
        if (!message) {
            return next(new Error('Message not found'));
        }

        // Знаходимо емоцію, яку потрібно оновити
        const emotionToUpdate = await Emotion.findById(emotionId); // Шукаємо емоцію за emotionId
        if (!emotionToUpdate) {
            return next(new Error('Emotion not found'));
        }

        // Оновлюємо емоцію
        emotionToUpdate.name = emotion; // Оновлюємо поле емоції
        await emotionToUpdate.save(); // Зберігаємо зміни в емоції

        // Оновлюємо тільки відповідну емоцію в масиві емоцій у повідомленні
        const updatedEmotions = message.emotions.map((emotionId) => {
            if (emotionId.toString() === emotionToUpdate._id.toString()) {
                return emotionToUpdate._id; // Замінюємо стару емоцію на оновлену
            }
            return emotionId; // Залишаємо інші емоції без змін
        });

        // Оновлюємо повідомлення з новим масивом емоцій
        await Message.findByIdAndUpdate(messageId, { emotions: updatedEmotions }, { new: true });

        res.status(200).send({ data: emotionToUpdate });
    } catch (error) {
        next(error);
    }
};*/

/*
module.exports.updateEmotion = async (req, res, next) => {
    try {
        const {
            params: { messageId: msgId }, // Отримуємо ID повідомлення з параметрів
            body: { emotion }, // Отримуємо нове ім'я емоції з тіла запиту
        } = req;

        // Перевірка, чи існує повідомлення в базі даних
        const message = await Message.findById(msgId);
        if (!message) {
            return next(new Error('Message not found'));
        }

        // Шукаємо емоцію в масиві емоцій повідомлення за її ID
        const emotionToUpdate = message.emotions.find(
            (emotionId) => emotionId.toString() === req.params.emotionId
        );

        if (!emotionToUpdate) {
            return next(new Error('Emotion not found in the message'));
        }

        // Оновлюємо емоцію в базі даних, використовуючи її ID
        const updatedEmotion = await Emotion.findByIdAndUpdate(
            emotionToUpdate, // ID емоції, яку ми хочемо оновити
            { name: emotion }, // Нове ім'я емоції
            { new: true } // Повертає оновлений документ
        );

        if (!updatedEmotion) {
            return next(new Error('Error updating emotion'));
        }

        // Оновлюємо масив емоцій у повідомленні, замінюючи стару емоцію на оновлену
        const updatedEmotions = message.emotions.map((emotion) => {
            if (emotion.toString() === req.params.emotionId) {
                return updatedEmotion._id; // Замінюємо ID старої емоції на ID оновленої
            }
            return emotion;
        });

        // Оновлюємо повідомлення з новим масивом емоцій
        await Message.findByIdAndUpdate(msgId, { emotions: updatedEmotions }, { new: true });

        // Відправляємо оновлену емоцію в відповідь
        res.status(200).send({ data: updatedEmotion });
    } catch (error) {
        next(error); 
    }
};*/



module.exports.updateEmotion = async (req, res, next) => {
    try {
        const {
            params: { messageId: msgId, emotionId }, // Отримуємо ID повідомлення та емоції з параметрів
            body: { emotion }, // Отримуємо нове ім'я емоції з тіла запиту
        } = req;

        // Перевірка, чи існує повідомлення в базі даних
        const message = await Message.findById(msgId);
        if (!message) {
            return next(new Error('Message not found'));
        }

        // Оновлюємо емоцію безпосередньо за її ID
        const updatedEmotion = await Emotion.findByIdAndUpdate(
            emotionId, // ID емоції
            { name: emotion }, // Оновлюємо властивість "name"
            { new: true } // Повертає оновлений документ
        );

        // Якщо емоцію не вдалося оновити, повертаємо помилку
        if (!updatedEmotion) {
            return next(new Error('Error updating emotion'));
        }

        // Оновлюємо масив емоцій у повідомленні
        const updatedEmotions = message.emotions.map((emotion) => 
            emotion.toString() === emotionId ? updatedEmotion._id : emotion
        );

        // Оновлюємо повідомлення з новим масивом емоцій
        await Message.findByIdAndUpdate(msgId, { emotions: updatedEmotions }, { new: true });

        // Відправляємо оновлену емоцію в відповідь
        res.status(200).send({ data: updatedEmotion });
    } catch (error) {
        next(error);
    }
};
