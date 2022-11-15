const { urlencoded } = require('express');
const express = require('express');
const path = require('path');
const controller = require('./controller.js');

const server = express();
// JEC: changed from 3001 to 443 - port 443 is standard for HTTPS (secure); port 80 is standard for HTTP (plain text)
// https://www.techopedia.com/definition/15709/port-80#:~:text=Port%2080%20is%20the%20port,and%20receive%20unencrypted%20web%20pages.
const PORT = 8000;


server.use(express.json());
server.use(urlencoded( {extended: true}));

// temp static serving of frontend for testing
server.get('/', (req, res) => {
  console.log('WHY ARE WE HERE');
  res.sendFile(path.join(__dirname, '../index.html'))
});

server.post('/perf', (req, res, next) => {console.log('hit this endpoint'); return next();}, controller.invokeDoNothing, (req, res) => {
  console.log('got here');
  res.status(200).json(res.locals.result);
});

server.post('/', (req, res, next) => {console.log('hit this endpoint instead'); return next();}, controller.invokeMergeSort, (req, res) => {
  console.log('got here instead??');
  res.status(200).json(res.locals.result)
});


server.use('*', (req, res) => {
  console.log('wtf endpoint is this');
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