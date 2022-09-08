document.addEventListener('DOMContentLoaded', () => {
//set up a bare bones input/button interface to test inputs to the monolith and microservice
const arrayLength = document.querySelector('#arraylength');
arrayLength.value = 10;
const trials = document.querySelector('#trials');
trials.value = 1;

const submitArgument = document.createElement('button');
submitArgument.innerText = 'Submit';
document.querySelector('body').appendChild(submitArgument);
const answerDisplay = document.createElement('p');
answerDisplay.innerText = 'no response'
document.querySelector('body').appendChild(answerDisplay)

const sortRandArrayNTimes = (iterations, arrayLength) => {
  for (let i = 0; i < iterations; i++) {
    const arr = [];
    for (let j = 0; j < arrayLength; j++) {
      arr.push(Math.floor(Math.random() * arrayLength));
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
  sortRandArrayNTimes(trials.value, arrayLength.value)
  })

});

