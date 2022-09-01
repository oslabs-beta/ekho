//functions to compare with legacy codebase

//declare a functionStore to store all of our test functions and export to the server controller.
const functionStore = {};

functionStore.addTwo = num => num + 2;

functionStore.wrongFizzBuzz = array => {
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
}

functionStore.mergeSort = function(array) {
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
  
module.exports = functionStore;

