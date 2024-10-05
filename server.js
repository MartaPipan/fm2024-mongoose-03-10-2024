const http = require('http');
const app = require('./app.js');
const port = process.env.PORT || 3000;

const setver =http.createServer(app);

server.listen(port, () => {
    console.log('server is running on port' + port);
});