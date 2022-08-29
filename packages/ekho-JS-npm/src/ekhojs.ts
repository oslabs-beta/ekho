import { RequestInfo, RequestInit } from 'node-fetch';

// IMPORTANT: ts build changes the 'node-fetch' import to a nested require(import).
// MUST change this to import in the built js file.
const fetch = (url: RequestInfo, init?: RequestInit) => {
  import('node-fetch').then(({ default: fetch }) => fetch(url, init));
};

type MicroserviceInput = {
  body?: unknown,
  params?: unknown[],
  query?: object
};

type Callback = (...args: unknown[]) => unknown;

type LegacyFacade = <Input>(
  callback: Callback,
  experimentName: string,
  context: object,
  ekhoUri: string,
  legacyInput: Input,
  microserviceInput: MicroserviceInput) => unknown;

type FacadeInner = <Input>(
  experimentName: string,
  context: object,
  ekhoUri: string,
  legacyInput: Input,
  microserviceInput: MicroserviceInput,
  runtime: number,
  result: unknown) => void;

type EkhoModule = {
  callEkho: FacadeInner,
  wrap: LegacyFacade
};

const ekhojs: EkhoModule = {
  callEkho: (experimentName, context, ekhoUri, legacyInput, microserviceInput, runtime, result) => {
    const post = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: experimentName,
        context,
        legacyInput,
        // microserviceInput: {
        //   body: microserviceInput.body,
        //   params: microserviceInput.params,
        //   query: microserviceInput.query
        // },
        microserviceInput,
        runtime,
        result,
      }),
    };
    fetch(ekhoUri, post)
      .then((res) => {
        if (res.status !== 200) console.log('Ekho Microservice unresponsive');
      });
  },

  wrap: (callback, experimentName, context, ekhoUri, legacyInput, msInput) => {
    const start = Date.now();
    const result = callback(legacyInput);
    const end = Date.now();
    const runtime = end - start;

    ekhojs.callEkho(experimentName, context, ekhoUri, legacyInput, msInput, runtime, result);
    return result;
  },
};

export default ekhojs;
