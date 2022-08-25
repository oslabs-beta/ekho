const microserviceFunctionStore = require('../microservice.js');

const controller = {};

//assuming the legacy microservice to use the data in the request body and invoke 
controller.invokeFunction = (req, res, next) => {
  try {
    const { body } = req.query
    console.log(body)
    res.locals.result = microserviceFunctionStore.wrongFizzBuzz(body)
    console.log('inside invokeFunction',res.locals.result)
      return next();
  }
  catch(err){
      return next({ message: `err: ${err}` })
  }
}


module.exports = controller;  