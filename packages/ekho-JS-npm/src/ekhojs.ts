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
  legacyInput: Input,
  microserviceInput: MicroserviceInput,
  experimentName: string,
  context: object,
  ekhoUri: string) => unknown;

type FacadeInner = <Input>(
  legacyInput: Input,
  microserviceInput: MicroserviceInput,
  experimentName: string,
  context: object,
  ekhoUri: string,
  runtime: number,
  result: unknown) => void;

type EkhoModule = {
  callEkho: FacadeInner,
  wrap: LegacyFacade
};

const ekhojs: EkhoModule = {
  callEkho: (legacyInput, microserviceInput, experimentName, context, ekhoUri, runtime, result) => {
    const post = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: experimentName,
        context,
        legacyInput,
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

  wrap: (callback, legacyInput, msInput, experimentName, context, ekhoUri) => {
    const start = Date.now();
    const result = callback(legacyInput);
    const end = Date.now();
    const runtime = end - start;

    ekhojs.callEkho(legacyInput, msInput, experimentName, context, ekhoUri, runtime, result);
    return result;
  },
};

export default ekhojs;
