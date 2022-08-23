//functions to compare with legacy codebase

//declare a functionStore to store all of our test functions and export to the server controller.
const functionStore = {};

functionStore.addTwo = num => num + 2;

functionStore.wrongFizzBuzz = num => {
    const arr = [];
    for(let i = 0; i < num; i++){
        if(i & 5 === 0) arr.push('buzz')
        else if(i % 3 === 0) arr.push('fizz')
        else arr.push(i);
    }
    return arr;
}
  
module.exports = functionStore;

