
var btn = document.getElementById('modal_opener');
var modal = document.querySelector('.modal');

function attachModalListeners(modalElm) {
  modalElm.querySelector('.close_modal').addEventListener('click', toggleModal);
  modalElm.querySelector('.overlay').addEventListener('click', toggleModal);
}

function detachModalListeners(modalElm) {
  modalElm.querySelector('.close_modal').removeEventListener('click', toggleModal);
  modalElm.querySelector('.overlay').removeEventListener('click', toggleModal);
}

function toggleModal() {
  var currentState = modal.style.display;

  // If modal is visible, hide it. Else, display it.
  if (currentState === 'none') {
    modal.style.display = 'block';
    attachModalListeners(modal);
  } else {
    modal.style.display = 'none';
    detachModalListeners(modal);  
  }
}

btn.addEventListener('onclick', toggleModal);

// copy to clipboard

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