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