const Message = require('../models/Message');
const Emotion = require('../models/Emotion');
const _ = require("lodash");

module.exports.createMessage  = async (req, res, next) => {
    try{
        const { body } = req;
         let values = _.pick(body);
        const message = await Message.create(body);
        if (!message) {
            return next(new Error('Error creating message')); 
        }
        res.status(201).send({ data:message});
} catch (error) {
 next(error);
}
};

module.exports.getAllMessages = async (req, res, next) => {
    try {
     const messages = await Message.find();
        if (!messages) {
            return next(new Error('Bad request')); 
        }
        res.status(200).send({ data:messages});
} catch (error) {
 next(error);
}
};

module.exports.getMessage = async (req, res, next) => {
    try {
        const {
            params: { messageId },
        } = req;
        //const message = await Message.findById(messageId).populate('emotions');//we return message with all info about message and all info about emotions / Lesson 122-1(25min)
        //const message = await Message.findById(messageId).populate({path: 'emotions', select: ['name','createdAt']}).exec();//we return message with all info about message and emotion 'name' and 'createdAt' 
        const message = await Message.findById(messageId).populate({path: 'emotions', select: 'name'}).exec();//we return message with all info about message and emotion 'name' / Lesson 122-1(33min)
        if (!message) {
            return next(new Error('Message not found')); 
        }
        res.status(200).send({ data: message });
    } catch (error) {
        next(error);
    }
};
module.exports.updateMessage = async (req, res, next) => {
    try {
        const { params: { messageId }, body } = req;
        let values = _.pick(body);
        const message = await Message.findByIdAndUpdate(messageId, body, { new: true });
        if (!message) {
            return next(new Error('Message not found'));
        }
        res.status(200).send({ data: message });
} catch (error) {
 next(error);
}
};

module.exports.deleteMessage = async (req, res, next) => {
    try {
    const {
            params: { messageId },
        } = req;
        const message = await Message.findByIdAndDelete(messageId);
        if (!message) {
            return next(new Error('Mesage not found')); 
        }
        //delete emotions with this message / Lesson 122-1(25min)
        await Emotion.deleteMany({ messageId: messageId }); 
        res.status(200).send({ data: message });
} catch (error) {
 next(error);
}
};


module.exports.deleteManyMessages = async (req, res, next) => {
    try {
        const { query, params: { messageId } } = req;
        const { author, isImportant, isRead, visible, datePublic } = query;

        // 1. Формуємо фільтр для запиту        
        const filter = {};

        if (query.author !== undefined) {
            filter['author.login'] = query.author; // Фільтр за автором
        }
        if (query.isImportant === 'true' || query.isImportant === 'false') {
            filter.isImportant = query.isImportant === 'true'; // Фільтр за важливістю
        }
        if (query.isRead === 'true' || query.isRead === 'false') {
            filter.isRead = query.isRead === 'true'; // Фільтр за станом прочитаності
        }
        if (query.datePublic) {
            filter.datePublic = query.datePublic; // Фільтр за датою публікації
        }
        if (query.visible === 'all' || query.visible === 'private') {
            filter.visible = query.visible; // Фільтр за видимістю
        }

        // 2. Видалення повідомлень за умовами фільтру
        const result = await Message.deleteMany(filter);

        if (result.deletedCount === 0) {
            return next(new Error('No messages found for the given criteria'));
        }

        // 3. Видалення пов'язаних емоцій
        if (messageId) {
            await Emotion.deleteMany({ messageId: messageId });
        }

        // 4. Відправлення відповіді
        res.status(200).send({ data: `Deleted ${result.deletedCount} messages` });
    } catch (error) {
        next(error);
    }
};


module.exports.updateManyMessages = async (req, res, next) => {
    try {
        const {
            query, // Параметри фільтру для пошуку
            body   // Нові значення для оновлення
        } = req;
        let values = _.pick(body);

        // Створення фільтра для пошуку повідомлень
        const filter = {};

        if (query.author) {
            filter['author.login'] = query.author; // Фільтр за автором
        }

        if (query.isImportant === 'true' || query.isImportant === 'false') {
            filter.isImportant = query.isImportant === 'true'; // Фільтр за важливістю
        }

        if (query.isRead === 'true' || query.isRead === 'false') {
            filter.isRead = query.isRead === 'true'; // Фільтр за станом прочитаності
        }
        if (query.visible) {
            filter.visible = query.visible;
        }

        // Оновлення повідомлень, які відповідають фільтру
        const result = await Message.updateMany(filter, body);//updateMany повертає об'єкт з кількістю змінених записів через modifiedCount,не використовуються опції, які вимагають повернення нових значень (new: true)

        if (result.matchedCount === 0) {
            return next(new Error('No messages found for the given criteria'));
        }

        // Повернення кількості оновлених документів
        res.status(200).send({ data: `Updated ${result.modifiedCount} messages` });
    } catch (error) {
        next(error); 
    }
};