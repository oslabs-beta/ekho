// For legacy function logic
const { ekhojs }= require('ekho-js')

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
<<<<<<< Updated upstream
  returnArr.push(product);
  }
  //return the return array
  return returnArr;
}, 'test', {type: 'test'}, 'http://localhost:443', input, {query: {'body': input}})
=======
  return array;
>>>>>>> Stashed changes
}

// ekhojs.wrap(legacyFunctions.fizzBuzz, 'test', {type: 'test'}, 'https://localhost:3001', 'https://localhost:3000', input)
module.exports = legacyFunctions;
