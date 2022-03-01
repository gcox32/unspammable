const menu = document.querySelector(".menu");
const submenuItems = document.querySelectorAll(".submenuItem");
const hamburger = document.querySelector(".hamburger");
const img = document.querySelector(".hamburger-image");
const overlay = document.querySelector(".overlay");

function toggleMenu() {
  if (menu.classList.contains("showMenu")) {
    menu.classList.remove("showMenu");
    overlay.style.display = "none";
  } else {
    menu.classList.add("showMenu");
    overlay.style.display = "block";
  };
};

hamburger.addEventListener("click", toggleMenu);
overlay.addEventListener("click", toggleMenu);


// retract menu before leaving page
submenuItems.forEach( 
  function(menuItem) { 
    menuItem.addEventListener("click", toggleMenu);
  }
);

var btn = document.getElementById('modal_opener');
var modal = document.querySelector('.modal');

function attachModalListeners(modalElm) {
  modalElm.querySelector('.close_modal').addEventListener('click', toggleModal);
  modalElm.querySelector('.modal_overlay').addEventListener('click', toggleModal);
}

function detachModalListeners(modalElm) {
  modalElm.querySelector('.close_modal').removeEventListener('click', toggleModal);
  modalElm.querySelector('.modal_overlay').removeEventListener('click', toggleModal);
}

function toggleModal() {
  var currentState = modal.style.display;

  if (menu.classList.contains("showMenu")) {
    menu.classList.remove("showMenu");
    overlay.style.display = "none";
  }
  // If modal is visible, hide it. Else, display it.
  if (currentState === 'none') {
    modal.style.display = 'block';
    attachModalListeners(modal);
  } else {
    modal.style.display = 'none';
    detachModalListeners(modal);  
  }
}

function copyToClipboard(id, n) {
  /* Get the text field */
  var copyText = document.getElementById(id);

  /* Copy the text inside the text field */
  navigator.clipboard.writeText(copyText.innerHTML);

  var tooltip = document.getElementsByClassName("tooltiptext")[n];
  tooltip.innerHTML = "Copied";
}

function outFunc(n) {
  var tooltip = document.getElementsByClassName("tooltiptext")[n];
  tooltip.innerHTML = "Copy";
}