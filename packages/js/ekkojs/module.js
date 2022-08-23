const fetch = require('node-fetch')

const ekhojs = {};

//define a wrap method which will surround the monolith code for testing. Parameters will be the monolith code as a callback, the inputs to the monolith code, API Key for comparing microservice, and Ekho microservice
//the method will invoke the cb with passed in inputs and store it as a result
/*then build a request object body
experimentName STRING
context OBJECT
input OBJECT
runtime
result
*/
//make a post request to Ekho microservice (async)
//return the result back to the monolith
ekhojs.wrap = (callback, experimentName, context, Ekhomicroservice, legacyInput, legacyMicroserviceInput) => {
  console.log('wrap received request')
  const start = Date.now();
  console.log(start)
  const result = callback(legacyInput);
  console.log('fizzbuzzModule', result)
  const end = Date.now();
  console.log(end)
  const runtime = end - start;

  const calcRuntime = async (callback, experimentName, context, Ekhomicroservice, legacyInput, legacyMicroserviceInput) => {
    const post = {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      name: experimentName,
      context: context,
      legacyInput: legacyInput,
      MicroserviceInput: {
        body: legacyMicroserviceInput.body,
        params: legacyMicroserviceInput.params,
        query: legacyMicroserviceInput.query
      },
      runtime: runtime,
      result: result,
      // comparingURI: comparingMicroservice
    })
    };
    fetch(Ekhomicroservice, post)
    .then((res) =>{
      if (res.status !== 200) console.log('Ekho Microservice unresponsive')
    })
};

  calcRuntime(callback, experimentName, context, Ekhomicroservice, legacyInput, legacyMicroserviceInput);
  console.log('result', result)
  return result;
};

module.exports = ekhojs