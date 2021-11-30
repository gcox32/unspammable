// toggle off menu by clicking off menu
var menu = document.getElementById('menuToggle');

function attachMenuListener() {
  document.getElementById('wrapper').addEventListener('click', toggleMenuOff);
}

function detachMenuListener() {
  document.getElementById('wrapper').removeEventListener('click', toggleMenuOff);
}

function toggleMenuOff() {
  var currentState = menu.style.display;
  console.log(currentState);
  if (currentState === "block") {
    menu.style.display = "";
    attachMenuListener();
    console.log('yep');
  } else {
    detachMenuListener();
    console.log('nope');
  };
}