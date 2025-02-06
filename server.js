const http = require('http');
const mongoose = require('mongoose');
const app = require('./app');



// Connect MongoDB at default port 27017.
mongoose
    // if exist administrator user, use 
   // .connect('username:password@mongodb://localhost:27017/fm2024mongoose'})
    .connect('mongodb://172.17.0.2:27017/fm2024mongoose')
    .catch((err) => {
        console.log('Error in DB connection: ' + err);
        process.exit(1);
    });

const port = process.env.PORT || 3003;
const server = http.createServer(app);

server.listen(port, () => {
    console.log('server is running on port ' + port);
});
