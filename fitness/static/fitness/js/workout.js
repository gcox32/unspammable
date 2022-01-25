var firstEntry = document.getElementById('first-line');
var allEntries = document.getElementById('ex-lines');
function addRow() {
    newEntry = firstEntry.cloneNode(true);
    var entryCount = document.getElementsByClassName('sets').length;
    for (let i=0; i < newEntry.children.length; i++) {
        els = newEntry.children[i];
        elsC = els.children;
        for (let j=0; j < elsC.length; j++) {
            if (elsC[j].tagName != "LABEL") {
                elsC[j].value = null;
                elsC[j].name = elsC[j].name.split('_')[0] + '_' + (entryCount + 1);
            }
        }
    }

    allEntries.appendChild(newEntry);
};

var sets = document.getElementsByClassName('sets');
var reps = document.getElementsByClassName('reps');
var weights = document.getElementsByClassName('weight');
var unis = document.getElementsByClassName('uni');
var volume = document.getElementById('volume');
var loadVolume = document.getElementById('load-vol');
var formVol = document.getElementsByName('form-volume')[0];
var formLoadVol = document.getElementsByName('form-load-volume')[0];

function updateVolume() {
    var volSum = 0;
    var loadVolSum = 0;
    var uniFactor;
    for (let i=0; i < sets.length; i++) {
        if (unis[i].checked) { uniFactor = 2 } else { uniFactor = 1 };
        volSum += sets[i].value * reps[i].value * uniFactor;
        loadVolSum += sets[i].value * reps[i].value * weights[i].value * uniFactor;
    }
    volume.innerText = volSum;
    formVol.value = volSum;
    loadVolume.innerText = loadVolSum;
    formLoadVol.value = loadVolSum;
}
