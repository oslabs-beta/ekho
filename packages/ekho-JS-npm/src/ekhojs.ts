import { RequestInfo, RequestInit } from 'node-fetch';

//IMPORTANT: ts build changes the 'node-fetch' import to a nested require(import). MUST change this to import in the built js file.
const fetch = (url: RequestInfo, init?: RequestInit) =>
  import('node-fetch').then(({ default: fetch }) => fetch(url, init));


type legacyMicroserviceInput = {
body: object,
params?: object,
query?: object
};

type legacyFacade = <Input, Output>(callback: Function, experimentName: string, context: object, Ekhomicroservice: string, legacyInput: Input, legacyMicroserviceInput: legacyMicroserviceInput) => Output

type facadeInner = <Input>(callback: Function, experimentName: string, context: object, Ekhomicroservice: string, legacyInput: Input, legacyMicroserviceInput: legacyMicroserviceInput) => void

type ekhomodule = {
  wrap: legacyFacade
};

const ekhojs: ekhomodule = {
  //define a wrap method which will surround the monolith code for testing.
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
  wrap: (callback, experimentName, context, Ekhomicroservice, legacyInput, legacyMicroserviceInput) => {
    try{ 
      const start = Date.now();
    const result = callback(legacyInput);
    const end = Date.now();
    const runtime = end - start;

    const calcRuntime: facadeInner = async (callback, experimentName, context, Ekhomicroservice, legacyInput, legacyMicroserviceInput) => {
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
      })
      };
      fetch(Ekhomicroservice, post)
      .then((res) =>{
        if (res.status !== 200) console.log('Ekho Microservice unresponsive')
      })
    };

    calcRuntime(callback, experimentName, context, Ekhomicroservice, legacyInput, legacyMicroserviceInput);
    return result;
    }
    catch(err){
      
    }
  }
};

export default ekhojs;