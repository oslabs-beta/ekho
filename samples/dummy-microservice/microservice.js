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
  if (array.length <= 1) return array;
  const mid = Math.floor(array.length / 2);
  const leftArray = this.mergeSort(array.slice(0, mid));
  const rightArray = this.mergeSort(array.slice(mid, array.length));
  let sortedArray = [];
  let leftIndex = 0;
  let rightIndex = 0;
  while (leftIndex < leftArray.length && rightIndex < rightArray.length) {
    if (leftArray[leftIndex] < rightArray[rightIndex]) {
      sortedArray.push(leftArray[leftIndex]);
      leftIndex++;
    } else {
      sortedArray.push(rightArray[rightIndex]);
      rightIndex++;
    }
  }
  if (leftArray.length !== leftIndex) sortedArray = sortedArray.concat(leftArray.slice(leftIndex));
  else sortedArray = sortedArray.concat(rightArray.slice(rightIndex));
  return sortedArray;
}
  
module.exports = functionStore;

