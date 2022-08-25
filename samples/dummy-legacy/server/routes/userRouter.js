const express = require("express");
const router = express.Router();
const legacyFunctions = require('../../legacy')

router.post('/', (req,res) => {
  try{
    const input = req.body.value;
    console.log('Inputs for legacy', input)
    const answer = legacyFunctions.fizzBuzz(input)
    //res.locals.answer = 'no';
    //res.locals.answer = fizzBuzz(input)
    //console.log(res.locals.answer)
    res.status(200).json(answer)
    //res.status(200).json(res.locals.answer)
  }
  catch(err){
    console.log('userRouter Err', err)
}
});


module.exports = router;