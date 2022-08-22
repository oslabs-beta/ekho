document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('root');
  const newDiv = document.createElement('div');
  const button = document.createElement('button');
  let count = 0;
  button.onclick = function() {update();};
  button.innerText = `${count}`;
  root.appendChild(newDiv);
  newDiv.appendChild(button);

  function update() {
    count++;
    button.innerText = `${count}`;
  }
});
