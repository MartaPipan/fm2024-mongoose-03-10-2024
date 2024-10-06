const Message = require('../models/Message');

module.exports.createMessage  = async (req, res, next) => {
    try{
        const { body } = req;
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
            return next(new Error('Mesage not found')); 
        }
        res.status(200).send({ data: message });
    } catch (error) {
        next(error);
    }
};
module.exports.updateMessage = async (req, res, next) => {
    try {
        const { params: { messageId }, body } = req;
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
} catch (error) {
 next(error);
}
};