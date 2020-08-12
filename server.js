//Arquivo inicial a ser executado
const http = require('http'); //Cria um serviço
const app = require('./app'); //Importa o app.js
const port = process.env.PORT || 3000; //Define porta padrão
const server = http.createServer(app); //Cria o server

server.listen(port);