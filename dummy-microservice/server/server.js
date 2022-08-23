const { urlencoded } = require('express');
const express = require('express');
const path = require('path');

const server = express();
// JEC: changed from 3001 to 443 - port 443 is standard for HTTPS (secure); port 80 is standard for HTTP (plain text)
// https://www.techopedia.com/definition/15709/port-80#:~:text=Port%2080%20is%20the%20port,and%20receive%20unencrypted%20web%20pages.
const PORT = 443;

const controller = require('./controller.js');

server.use(express.json());
server.use(urlencoded( {extended: true}));

// temp static serving of frontend for testing
server.use(express.static(path.join(__dirname, '../index.html')));

server.post('/', controller.invokeFunction, (req, res) => {
  res.status(200).send('Dummy microservice successfully processed your request')
});

server.use('*', (req, res) => {
  res.status(404).send('The endpoint you are looking for does not exist')
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

server.listen(PORT, () => console.log(`Server listening on port: ${PORT}...`));