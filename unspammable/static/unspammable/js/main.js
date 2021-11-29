document.addEventListener('DOMContentLoaded', function(event) {
    document.querySelector('body').style.opacity = 1;
});

// marvel page transition
var $loader = document.querySelector('.loader')

window.onload = function() {
  $loader.classList.remove('loader--active');
  $loader.style.display = 'flex';
};

marvel_transition = function () {
  $loader.classList.add('loader--active')
};

transitionToPage = async function(href) {
  // marvel_transition();

  // document.querySelector('body').style.opacity = 0;
  await setTimeout(marvel_transition(), 500);
  // setTimeout(() => 3000);
  setTimeout(function() { 
      window.location.href = href;
  }, 1500);
  
};

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

function outFunc() {
  var tooltip = document.getElementById("copyTooltip");
  tooltip.innerHTML = "Copy";
}
