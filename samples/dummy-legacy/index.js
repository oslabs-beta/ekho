document.addEventListener('DOMContentLoaded', () => {
//set up a bare bones input/button interface to test inputs to the monolith and microservice
const arrayLength = document.createElement('input');
arrayLength.setAttribute('id', 'arrayLength');
arrayLength.value = 100;
const arrayLengthLabel = document.createElement('label');
arrayLength.setAttribute('for', 'arrayLength');
document.querySelector('body').appendChild(arrayLengthLabel);
document.querySelector('body').appendChild(arrayLength);

const trials = document.createElement('input');
arrayLength.setAttribute('id', 'trials');
trials.value = 100;
const trialsLabel = document.createElement('label');
arrayLength.setAttribute('for', 'trials');
document.querySelector('body').appendChild(trialsLabel);
document.querySelector('body').appendChild(trials);

const submitArgument = document.createElement('button');
submitArgument.innerText = 'Submit';
document.querySelector('body').appendChild(submitArgument);
const answerDisplay = document.createElement('h1');
answerDisplay.innerText = 'no response'
document.querySelector('body').appendChild(answerDisplay)

const sortRandArrayNTimes = (iterations, arrayLength) => {
  for (let i = 0; i < iterations; i++) {
    const arr = [];
    for (let j = 0; j < arrLength; j++) {
      arr.push(Math.floor(Math.random() * arrLength));
    }
    const post = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(arr)
    };
      fetch('/user', post)
      .then(resp => resp.json())
      .then(resp => resp.toString())
      .then(resp => answerDisplay.innerText = `Our response:${resp}`)
      trials.value -= 1;
  }
}

submitArgument.addEventListener('click', () => {
  callNTimes(trials.value, arrayLength.value)
  })

});

