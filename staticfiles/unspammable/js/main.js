const menu = document.querySelector(".menu");
const menuItems = document.querySelectorAll(".menuItem");
const hamburger = document.querySelector(".hamburger");
const img = document.querySelector(".hamburger-image");
const overlay = document.querySelector(".overlay");

function toggleMenu() {
  if (menu.classList.contains("showMenu")) {
    menu.classList.remove("showMenu");
    overlay.style.display = "none";
    img.setAttribute("src", "/staticfiles/unspammable/images/hamburger.png");
  } else {
    menu.classList.add("showMenu");
    overlay.style.display = "block";
    img.setAttribute("src", "/staticfiles/unspammable/images/close.png");
  };
};

hamburger.addEventListener("click", toggleMenu);
overlay.addEventListener("click", toggleMenu);


// retract menu before leaving page
menuItems.forEach( 
  function(menuItem) { 
    menuItem.addEventListener("click", toggleMenu);
  }
);

