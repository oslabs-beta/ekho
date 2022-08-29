const { urlencoded } = require('express');
const express = require('express');
const path = require('path');
const userRouter = require('./routes/userRouter')
const PORT = 4000;
const server = express();

server.use(express.json());
server.use(urlencoded( { extended: true } ));

const useMicroService = true;

if(useMicroService){
    server.use('/user', (req,res) => {
      try {
        const { iterations, arrayLength } = req.body;
        console.log('Inputs for legacy', iterations, arrayLength)
        const answer = legacyFunctions.sortNArrays(iterations, arrayLength)
        res.status(200).json(answer)
      }
      catch (err) {
        console.log('userRouter Err', err)
      }
    })
      
}else{
    server.get('/user', (req,res) => res.status(200).send('microservice inactive'))
}

// server.get('/', (req, res) => {
//     res.status(200).sendFile(path.join(__dirname, '../index.html'))
// })

// server.get("/index.js", (req, res) => {
//   res.status(200).sendFile(path.join(__dirname, "../index.js"));
// });

// server.use(express.static(path.join(__dirname, '.../dummy-functions/')))

server.use('*', (req, res) => {
  res.status(404).send('The page you are looking for does not exist');
});

server.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught an unkown middleware error',
    status: 500,
    message: { err: 'An error occured' }
  };
  const errObj = Object.assign(defaultErr, err);
  console.log(errObj.log);
  res.status(errObj.status).json(errObj.message);
});

server.listen(PORT, () => {
    console.log(`Listening to PORT ${PORT}`)
});






