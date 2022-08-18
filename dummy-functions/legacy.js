// For legacy function logic

const legacyFunctions = {};

legacyFunctions.fizzBuzz = num => {
    const arr = [];
    for(let i = 1; i <= num; i++){
        if(i % 5 === 0 && i % 3 === 0) arr.push('fizzbuzz');
        else if(i % 5 === 0) arr.push('buzz')
        else if(i % 3 === 0) arr.push('fizz')
        else arr.push(i);
    }
    console.log(arr)
    return arr;
}

module.exports = legacyFunctions;