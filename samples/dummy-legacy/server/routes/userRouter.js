const express = require("express");
const router = express.Router();

router.post('/', (req,res) => {
  try {
    const input = req.body.value;
    console.log('Inputs for legacy', input)
    const answer = legacyFunctions.fizzBuzz(input)
    res.status(200).json(answer)
  }
  catch (err) {
    console.log('userRouter Err', err)
  }
});


module.exports = router;