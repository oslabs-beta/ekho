const { urlencoded } = require('express');
const express = require('express');
const path = require('path');
const controller = require('./controller.js');

const server = express();
const PORT = 8000;

server.use(express.json());
server.use(urlencoded( {extended: true}));

// temp static serving of frontend for testing
server.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'))
});

server.post('/perf', 
  controller.invokeDoNothing, 
  (req, res) => {
  res.status(200).json(res.locals.result);
});

server.post('/', controller.invokeMergeSort, (req, res) => {
  res.status(200).json(res.locals.result)
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