const express = require('express');
const {
    createMessage,
    getAllMessages,
    getMessage,
    updateMessage,
    deleteMessage,
    updateMany,
    deleteManyMessages
} = require('./controllers/message.controller');

const app = express();
app.use(express.json());

app.post('/messages', createMessage);
app.get('/messages', getAllMessages);
app.get('/messages/:messageId', getMessage);
app.patch('/messages/:messageId', updateMessage);
app.patch('/messages', updateMany);
app.delete('/messages/:messageId', deleteMessage);
app.delete('/messages', deleteManyMessages );  //add query paramentrs in Http como
// DELETE http://localhost:3000/messages?author=login&isimportant=true&isread=true&visible=private HTTP/1.1

app.use((err, req, res, next) => {
    console.log(err.message); 
    res.status(500).send({errors:[err.message]})
});

module.exports = app;
