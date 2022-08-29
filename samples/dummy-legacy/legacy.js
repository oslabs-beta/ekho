// For legacy function logic
import ekhojs from 'ekho-js';

const legacySort = (array) => {
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
const facadeSort = (args) => ekhojs.wrap(
  legacySort,
  'sample-test',
  { route: 'test' },
  'https://localhost:3001',
  args,
  { args: { body: args } }
)

const sortNLengthArray = (arrLength) => {
    const arr = [];
    for (let j = 0; j < arrLength; j++) {
      arr.push(Math.floor(Math.random() * arrLength));
    }
    facadeSort(arr);
  }

// ekhojs.wrap(legacyFunctions.fizzBuzz, 'test', {type: 'test'}, 'https://localhost:3001', 'https://localhost:3000', input)
export default sortNLengthArray;
