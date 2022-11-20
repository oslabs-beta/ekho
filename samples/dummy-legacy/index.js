document.addEventListener('DOMContentLoaded', () => {
  //set up a bare bones input/button interface to test inputs to the monolith and microservice
  const arrayLength = document.querySelector('#array-length');
  arrayLength.value = 10;
  const trials = document.querySelector('#trials');
  trials.value = 1;
  const sortDiv = document.querySelector('#sort-test');

  const submitArgument = document.createElement('button');
  submitArgument.innerText = 'Submit';
  sortDiv.appendChild(submitArgument);
  const answerDisplay = document.createElement('p');
  answerDisplay.innerText = 'no response'
  sortDiv.appendChild(answerDisplay);

  const sortRandArrayNTimes = (iterations, arrayLength) => {
    for (let i = 0; i < iterations; i++) {
      const arr = [];
      for (let j = 0; j < arrayLength; j++) {
        arr.push(Math.floor(Math.random() * arrayLength));
      }
      const post = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(arr),
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
    });

  const perfTestTrials = document.querySelector('#perf-test-trials');
  const perfSubmitButton = document.querySelector('#perf-test-button');
  const trialCounter = document.querySelector('#perf-test-counter');
  const perfTestInterval = document.querySelector('#perf-test-interval');
  const perfTestName = document.querySelector('#perf-test-name');

  const sendTrials = (interval, num, experimentName) => {
    const start = Date.now();
    console.log(Date.now() % (1000 * 60 * 60));
    console.log(start);
    const post = { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: experimentName, done: false }),
    }
    // Set a counter that counts down from num to 0
    // Have a function that uses setTimeout to make the fetch request,
    // decrement counter, check counter value, and call itself recursively if counter > 0
    const sendTrial = (delay, trialsLeft) => {
      setTimeout(() => {
        fetch('/perf', post)
          .then(resp => {
            if (resp.status === 200) trialCounter.innerText++;
            else {
              trialCounter.innerText = 0;
              const perfTestingDiv = document.querySelector('#perf-test');
              const error = document.createElement('p');
              error.innerText = resp.status + resp.json().toString();
              perfTestingDiv.appendChild(error);
              error.setAttribute('id', 'perf-error');
            }
          })
        if (trialsLeft > 1) {
          sendTrial(delay, trialsLeft - 1);
        } else {
          fetch('/perf', Object.assign(
            { ...post }, 
            { body: JSON.stringify({  name: experimentName, done: true }) }
            ));
        }
      }, delay);
    };
    sendTrial(interval, num);
  }

  perfSubmitButton.addEventListener('click', () => {
    sendTrials(perfTestInterval.value, perfTestTrials.value, perfTestName.value);
  });
});

