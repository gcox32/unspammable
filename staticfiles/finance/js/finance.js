const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');
const menuIcon = document.getElementsByClassName('hamburger-image')[0];

menuIcon.setAttribute('src', '/staticfiles/unspammable/images/icons/clear_bg_3.png');

function switchTheme(e) {
    if (e.target.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
        menuIcon.setAttribute('src', '/staticfiles/unspammable/images/icons/clear_bg_3_white.png');
    }
    else {
        document.documentElement.setAttribute('data-theme', 'light');
        menuIcon.setAttribute('src', '/staticfiles/unspammable/images/icons/clear_bg_3.png');
    }    
}

toggleSwitch.addEventListener('change', switchTheme, false);

const currentTheme = localStorage.getItem('theme') ? localStorage.getItem('theme') : null;

if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);

    if (currentTheme === 'dark') {
        menuIcon.setAttribute('src', '/staticfiles/unspammable/images/icons/clear_bg_3_white.png');
        toggleSwitch.checked = true;
    }
}