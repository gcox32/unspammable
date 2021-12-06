const menu = document.querySelector(".menu");
const submenuItems = document.querySelectorAll(".submenuItem");
const hamburger = document.querySelector(".hamburger");
const img = document.querySelector(".hamburger-image");
const overlay = document.querySelector(".overlay");

function toggleMenu() {
  if (menu.classList.contains("showMenu")) {
    menu.classList.remove("showMenu");
    overlay.style.display = "none";
    // img.setAttribute("src", "/staticfiles/unspammable/images/icons/clear_bg_3_white.png");
  } else {
    menu.classList.add("showMenu");
    overlay.style.display = "block";
    // img.setAttribute("src", "/staticfiles/unspammable/images/icons/clear_bg_3_white.png");
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

