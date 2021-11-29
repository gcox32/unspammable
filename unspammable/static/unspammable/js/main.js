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

