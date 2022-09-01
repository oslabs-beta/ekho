// For legacy function logic
const { ekhojs } = require('ekho-js');

const legacySort = (array) => {
  var start = Date.now()
  const arr = [];
  let i = 100;
  while (i > 0) {
    arr.push(i);
    console.log(Date.now())
    console.log("yo mama!")
    console.log(arr)
    i--;
  }
  var end = Date.now();

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
  { route: 'user' },
  'http://localhost:443',
  args,
  { body: args }
)

// ekhojs.wrap(legacyFunctions.fizzBuzz, 'test', {type: 'test'}, 'https://localhost:3001', 'https://localhost:3000', input)
module.exports = facadeSort;
