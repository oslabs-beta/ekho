const { urlencoded } = require('express');
const express = require('express');
const path = require('path');

const server = express();
const PORT = 3001;

const controller = require('./controller.js');

server.use(express.json());
server.use(urlencoded( {extended: true}));

server.post('/', controller.invokeFunction, (req, res) => {
  res.status(200).send('Dummy microservice successfully processed your request')
});

server.use('*', (req, res) => {
  res.status(400).send('The endpoint you are looking for does not exist')
});

server.use((err, req, res, next)=>{
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occured'}
  };
  const errObj = Object.assign(defaultErr, err);
  console.log(errObj.log);
  res.status(errObj.status).json(errObj.message);
});

server.listen(PORT, () => console.log(`Listening to PORT ${PORT}`));