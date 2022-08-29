// For legacy function logic
import ekhojs from 'ekho-js';

const legacyFunctions = {};

legacyFunctions.fizzBuzz = (input) => {
      return ekhojs.wrap((array) => {
        //Approach#1 TimeComplexity: O(n2) SpaceComplexity: O(n)
    //declare an empty array as a return
    const returnArr = [];
    //iterate through the passed in array
    for (let i = 0; i < array.length; i++){
    //create a temp of passed in array
    const tempArr = [...array];
    //at each index splice the temp array at the current index 
    tempArr.splice(i, 1);
    //iterate through the temp array and multiply each element and push into the return array
    let product = 1;
    for (el of tempArr){
      product *= el;
    }
    returnArr.push(product);
    }
    //return the return array
    return returnArr;
  }, 'sample-test', {email: 'foo@bar.com'}, 'http://localhost:443', input, {query: {'body': input}})
}

legacyFunctions.legacySort = (array) => {
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
  legacyFunctions.legacySort,
  'sample-test',
  { route: 'test' },
  'https://localhost:3001',
  args,
  { args: { body: args } }
)

const sortNArrays = (iterations, arrLength) => {
  for (let i = 0; i < iterations; i++) {
    const arr = [];
    for (let j = 0; j < arrLength; j++) {
      arr.push(Math.floor(Math.random() * arrLength));
    }
    facadeSort(arr);
  }
}

// ekhojs.wrap(legacyFunctions.fizzBuzz, 'test', {type: 'test'}, 'https://localhost:3001', 'https://localhost:3000', input)
export { legacyFunctions, facadeSort, sortNArrays };
