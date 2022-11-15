const { urlencoded } = require('express');
const express = require('express');
const path = require('path');
const server = express();
const facadeSort = require('../legacy')

server.use(express.json());
server.use(urlencoded( { extended: true } ));

const PORT = 4000;
const USEMICROSERVICE = true;

if (USEMICROSERVICE) {
    server.use('/user', (req,res) => {
      try {
        const answer = facadeSort(req.body);
        console.log(answer);
        res.status(200).json(answer)
      }
      catch (err) {
        console.log('userRouter Err', err)
      }
    })
      
} else {
    server.get('/user', (req,res) => res.status(200).send('microservice inactive'))
}

server.get('/', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, '../index.html'))
})

server.get("/index.js", (req, res) => {
  res.status(200).sendFile(path.join(__dirname, "../index.js"));
});

// server.use(express.static(path.join(__dirname, '.../dummy-functions/')))

server.use('*', (req, res) => {
  res.status(404).send('Invalid request');
});

server.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`)
});






