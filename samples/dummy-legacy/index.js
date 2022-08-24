document.addEventListener('DOMContentLoaded', () => {
//set up a bare bones input/button interface to test inputs to the monolith and microservice
const argumentInput = document.createElement('input');
document.querySelector('body').appendChild(argumentInput)
const submitArgument = document.createElement('button');
submitArgument.innerText = 'Submit';
document.querySelector('body').appendChild(submitArgument);
const answerDisplay = document.createElement('h1');
answerDisplay.innerText = 'no response'
document.querySelector('body').appendChild(answerDisplay)
submitArgument.addEventListener('click', () => {
  const post = {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
        value: argumentInput.value
    })
  };
  fetch('/user', post)
  .then(resp => resp.json())
  .then(resp => resp.toString())
  .then(resp => answerDisplay.innerText = `Our response:${resp}`)
  })
});

