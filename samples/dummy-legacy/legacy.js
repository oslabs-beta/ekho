// For legacy function logic
const { ekhojs } = require('ekho-js');
require('dotenv').config();

const legacySort = (array) => {
  // Bubble sort because it's O(n^2) so there will be meaningful differences in speed
  let sortedIndex = 1;
  while (sortedIndex < array.length) {
    const curr = array[sortedIndex];
    let i = 0;
    while (curr > array[i] && i < sortedIndex) {
      i++;
    }
    for (let j = sortedIndex; j > i; j--) {
      array[j] = array[j - 1];
    }
    array[i] = curr;
    sortedIndex++;
  }
  return array;
}

// Wrapper function expects the following:
// the legacy callback function
// experiment name
// context, an object with data for isolating/triaging discrepancies
// ekho URI
// args for the callback function
// the same args as they need to be passed to the candidate microservice

const ekhoUri = (process.env.HOST = 'local') ? 'http://localhost:443/' : 'http://184.169.198.41:443/';

let facadeSort;

if (process.env.HOST = 'local') {
  facadeSort = (args) => ekhojs.wrap(
      legacySort,
      'sample-test',
      { type: 'test', answer: 42 },
      ekhoUri,
      args,
      // pass a copy of args because otherwise we'll pass the sorted array to the microservice
      { body: [...args] },
    )
} else {
  facadeSort = (args) => ekhojs.wrap(
    legacySort,
    'AWS-microservice-test',
    { route: 'createdAt' },
    ekhoUri,
    args,
    { body: [...args.num] },
  )
}

const doNothing = () => true;

const facadeDoNothing = (body) => ekhojs.wrap(
  doNothing,
  body.name,
  {},
  ekhoUri,
  null,
  { body },
)

// ekhojs.wrap(legacyFunctions.fizzBuzz, 'test', {type: 'test'}, 'https://localhost:3001', 'https://localhost:3000', input)
module.exports = { facadeSort, facadeDoNothing };
