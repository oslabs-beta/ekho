const microserviceFunctionStore = require('../microservice.js');

const controller = {};

//assuming the legacy microservice to use the data in the request body and invoke 
controller.invokeMergeSort = (req, res, next) => {
  try {
    res.locals.result = microserviceFunctionStore.mergeSort(req.body);
      return next();
  }
  catch(err){
      return next({ message: `err: ${err}` })
  }
}

controller.invokeDoNothing = (req, res, next) => {
  res.locals.result = true;
  return next();
}


module.exports = controller;  