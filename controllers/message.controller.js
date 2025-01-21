const Message = require('../models/Message');
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
        const message = await Message.findById(messageId);
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
        res.status(200).send({ data: message });
} catch (error) {
 next(error);
}
};


module.exports.deleteManyMessages = async (req, res, next) => {
    try {
          const {
            query //{author+isImportant}
          } = req;
        const { author, isImportant, isRead, visible, datePublic } = query;
// 1. Формуємо фільтр для запиту        
        const filter = {};

        if (author in query) {
            filter['author.login'] = queryauthor; // Перевіряємо, чи є 'author' у запиті, і додаємо до фільтру
        }
           // Перевіряємо, чи є 'isImportant' у запиті, і додаємо до фільтру
        if (query.isImportant === 'true' || isImportant === 'false') {
            filter.isImportant = isImportant === 'true';
        }
        // Перевіряємо, чи є 'isRead' у запиті, і додаємо до фільтру
        if (query.isRead === 'true' || isRead === 'false') {
            filter.isRead = isRead === 'true';
        }

        if (query.datePublic) {
            // Якщо є параметр datePublic, додаємо його до фільтру
            filter.datePublic = query.datePublic; // Фільтр за датою публікації
        }
        
        if (visible) {
            filter.visible = visible;
        }
 // 2. Використовуємо deleteMany для видалення повідомлень за умовами фільтру
        const result = await Message.deleteMany(filter);// Якщо жодне повідомлення не знайдено, повертаємо помилку
        if (result.deletedCount === 0) {
            return next(new Error('No messages found for the given criteria'));
        }
        // Відправляємо відповідь із кількістю видалених повідомлень
        res.status(200).send({data:` message`});
    } catch (error) {
        next(error);
    }
};


module.exports.updateMany = async (req, res, next) => {
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

        // Оновлення повідомлень, які відповідають фільтру
        const result = await Message.updateMany(filter, body, { new: true });

        if (result.matchedCount === 0) {
            return next(new Error('No messages found for the given criteria'));
        }

        // Повернення кількості оновлених документів
        res.status(200).send({ data: `Updated ${result.modifiedCount} messages` });
    } catch (error) {
        next(error); 
    }
};