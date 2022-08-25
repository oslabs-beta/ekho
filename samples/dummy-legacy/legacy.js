// For legacy function logic
const { ekhojs }= require('ekho-js')

const legacyFunctions = {};

legacyFunctions.fizzBuzz = (input) => {
    ekhojs.wrap()
    return ekhojs.wrap((num) => {
    const arr = [];
    for(let i = 1; i <= num; i++){
        if(i % 5 === 0 && i % 3 === 0) arr.push('fizzbuzz');
        else if(i % 5 === 0) arr.push('buzz')
        else if(i % 3 === 0) arr.push('fizz')
        else arr.push(i);
    }
    console.log('fizzbuzzlegacy',arr)
    return arr;
}, 'test', {type: 'test'}, 'http://localhost:443', input, {query: {'body': input}})
}

// ekhojs.wrap(legacyFunctions.fizzBuzz, 'test', {type: 'test'}, 'https://localhost:3001', 'https://localhost:3000', input)
module.exports = legacyFunctions;
