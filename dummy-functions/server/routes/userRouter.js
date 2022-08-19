const express = require("express");
const router = express.Router();
const legacyFunctions = require('../../legacy')




router.post('/', (req,res) => {
    console.log('request received')
    const input = Number(req.body.value);
    console.log(input)

    const answer = legacyFunctions.fizzBuzz(input);
    //res.locals.answer = 'no';
    //res.locals.answer = fizzBuzz(input)
    //console.log(res.locals.answer)
    res.status(200).json(answer)
    //res.status(200).json(res.locals.answer)
});


module.exports = router;