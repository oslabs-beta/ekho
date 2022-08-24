document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('root');
  const newDiv = document.createElement('div');
  const button = document.createElement('button');
  const ul = document.createElement('ul');
  let count = 0;
  button.onclick = function() {update();};
  button.innerText = `${count}`;
  root.appendChild(newDiv);
  newDiv.appendChild(button);
  newDiv.appendChild(ul);

  function update() {
    count++;
    button.innerText = `${count}`;
  }

  function displayExperiments(experiments) {
    ul.innerHTML = null;
    experiments.forEach((experiment) => {
      const li = document.createElement('li');
      li.appendChild(document.createTextNode(`${experiment.experimentName} time: ${experiment.legacyTime}`));
      ul.appendChild(li);
    });
  }

  // get the current experiments from the database
  function getExperiments() {
    fetch('/api/')
      .then(res => res.json())
      .then((data) => {
        displayExperiments(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  getExperiments();
});