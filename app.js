const express = require('express');
const {
    createMessage,
    getAllMessages,
    getMessage,
    updateMessage
} = require('./controllers/message.controller');

const app = express();
app.use(express.json());

app.post('/messages', createMessage);
app.get('/messages', getAllMessages);
app.get('/messages/:messageId', getMessage);
app.patch('/messages/:messageId', updateMessage);
//app.delete('/messages/:messageId', deleteMessage);

app.use((err, req, res, next) => {
    console.log(err.message); 
    res.status(500).send({errors:[err.message]})
});

module.exports = app;
