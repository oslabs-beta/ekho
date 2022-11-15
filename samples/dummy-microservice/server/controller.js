const microserviceFunctionStore = require('../microservice.js');

const controller = {};

//assuming the legacy microservice to use the data in the request body and invoke 
controller.invokeMergeSort = (req, res, next) => {
  try {
    console.log('invoked mergesort');
    res.locals.result = microserviceFunctionStore.mergeSort(req.body);
      return next();
  }
  catch(err){
      return next({ message: `err: ${err}` })
  }
}

controller.invokeDoNothing = (req, res, next) => {
  console.log('invoked do nothing');
  res.locals.result = true;
  return next();
}


module.exports = controller;  