const Message = require('../models/Message');

module.exports.createMessage  = async (req, res, next) => {
    try{
    const { body } = req;
        const message = await Message.create(body);
        if (!message) {
            return next(new Error('Error creating message')); 
            
        }
        res.status(200).json(body);
} catch (error) {
 next(error);
}
};