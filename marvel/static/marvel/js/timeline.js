contractDiv = function(phase) {
    var box = phase.parentElement;
    var tl = box.parentElement;
    box.style.width = '36%';
};

expandDiv = function(phase) {
    var box = phase.parentElement;
    var content = document.getElementsByClassName("tl-content");
    for (let i = 0, len = content.length; i<len; i++) {
        content[i].style.display = 'none';
    }
    box.style.transition = 'all 1s ease 0s';
    box.style.width = '1000000vw';
    box.style.zIndex = '2';
    phase.style.display = 'none';
    
}

transitionToPhase = async function(href, phase) {
    await setTimeout(expandDiv(phase), 500);
    setTimeout(function() { 
        window.location.href = href;
    }, 1000);
};
