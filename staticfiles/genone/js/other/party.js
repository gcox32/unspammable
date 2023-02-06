const moveBytes = [8, 9, 10, 11];
const currentPPBytes = [29, 30, 31, 32];

class Move {
    constructor(idx, currentPP, moveslot) {
        this.idx = idx;
        this.currentPP = currentPP;
        this.moveslot = moveslot;
    }
    get details() {
        return blueMoveDict[this.idx];
    }
}
class Pokemon {
    constructor(idx, image, data) {
        this.idx = idx;
        this.image = image;
        this.data = data;
        this.movesList = [];
    }
    get name() {
        return dexDict[this.idx]['name'];
    }
    get pokedexNo() {
        return dexDict[this.idx]['pokedexNo'];
    }
    get active() {
        return data !== 0;
    }
    get type() {
        return [typeDict[this.data[5]], typeDict[this.data[6]]];
    }
    get status() {
        return statusDict[this.data[4]];
    }
    get moves() {
        for(let i=0; i < 4; i++){
            var move = new Move(
                this.data[moveBytes[i]], 
                this.data[currentPPBytes[i]],
                i+1
            )
            this.movesList.push(move);
        }
        return this.movesList;
    }
    get evs() {
        return {
            'HP':[this.data[17], this.data[18]],
            'ATK':[this.data[19], this.data[20]],
            'DEF':[this.data[21], this.data[22]],
            'SPD':[this.data[23], this.data[24]],
            'SPC':[this.data[25], this.data[26]]
        }
    }
    get ivs() {
        return [this.data[27], this.data[28]];
    }
    get lvl() {
        return this.data[33];
    }
    get stats() {
        return {
            'HP':this.data[35],
            'ATK':this.data[37],
            'DEF':this.data[39],
            'SPD':this.data[41],
            'SPC':this.data[43]
        }
    }
}

function getImgSrc(idx, style) {
	// var gifBase = 'https://projectpokemon.org/images/normal-sprite/bulbasaur.gif';
	// var greenBase = 'https://projectpokemon.org/images/sprites-models/gb-sprites/red-jp-001.png';
	// var blueBase = 'https://projectpokemon.org/images/sprites-models/gb-sprites/blue-jp-001.png';
	// var yellowBase = 'https://projectpokemon.org/images/sprites-models/gb-sprites/yellow-en-001.png';

	var nameNo = [dexDict[idx]['name'], dexDict[idx]['pokedexNo']];
	var link;
	switch (style) {
		case "gif": link = `https://projectpokemon.org/images/normal-sprite/${nameNo[0]}.gif`; break;
		case "green": link = `https://projectpokemon.org/images/sprites-models/gb-sprites/red-jp-${nameNo[1]}.png`; break;
		case "blue": link = `https://projectpokemon.org/images/sprites-models/gb-sprites/blue-jp-${nameNo[1]}.png`; break;
		case "red": link = `https://projectpokemon.org/images/sprites-models/gb-sprites/blue-jp-${nameNo[1]}.png`; break;
		case "yellow": link = `https://projectpokemon.org/images/sprites-models/gb-sprites/yellow-en-${nameNo[1]}.png`; break;
		default: link = 'break';
	}
	return link;
};
function getPartyInfo(fileOrBlob, style, game) {
	var bankIdx;
	var offset;
	switch(game) {
		case "yellow": offset = 355, bankIdx = 23; break;
		case "red": offset = 53604, bankIdx = 19; break;
		case "blue": offset = 53603, bankIdx = 19; break;
		default: offset = 0, bankIdx = 0;
	};
	var bank = fileOrBlob[bankIdx];

	// yellow offset, bank = 355, 23
	// blue and red offset, bank = 53604, 19
	// green info

	var partyIdxs = []
	for (var i=offset; i < offset + 6; i++) {
		if (bank[i] == 255) {
			break;
		} else {
			partyIdxs.push(bank[i]);
		}
	}

	var bankParty = bank.slice(offset+7, bank.length);
    var partyList = [];
	for (let i=0; i<partyIdxs.length; i++) {
        var pokemon = new Pokemon(
            idx=partyIdxs[i],
            image=getImgSrc(partyIdxs[i], style),
            data=bankParty.slice(44*i, 44*(i+1))
        )
        partyList.push(pokemon);
    }
    return partyList;
};
function updateParty(fileOrBlob, style, game) {
	// get rom indices from save data
	var partyData = getPartyInfo(fileOrBlob, style, game);
	var partySlots = document.getElementsByClassName('party-slot');
	var partySlotImgs = document.getElementsByClassName('party-slot-img');
	var partySlotLvls = document.getElementsByClassName('lvl');

	clearParty();

	var style = document.createElement('style');
	style.id = 'party-slots-css'
	for (var i=0; i < 6; i++) {
		if (i < partyData.length) {
            var pokemon = partyData[i];
			partySlotImgs[i].style.display = 'block';
			partySlotImgs[i].src = pokemon.image;
			if (pokemon.active) {
				partySlotImgs[i].style.opacity = '1';
			} else {
				partySlotImgs[i].style.opacity = '0.2';
			};
			partySlotLvls[i].style.display = 'block';
			partySlotLvls[i].innerHTML = pokemon.lvl;
			var hoverCss =
                `.party-slot:nth-child(${i+2}) {
                    transition: all 100ms ease-in-out;
                }
                .party-slot:nth-child(${i+2}):hover {
                    cursor:pointer; 
                    box-shadow:0px 8px 16px rgb(0 0 0 / 60%);
                }
                .party-slot:nth-child(${i+2}):active {
                    transform: scale(0.95);
                }`
			style.appendChild(document.createTextNode(hoverCss));
            buildModal(i, pokemon);
			partySlots[i].addEventListener("click", toggleModal);
		} else {
			partySlotImgs[i].style.display = 'None';
			partySlotLvls[i].style.display = 'None';
			partySlots[i].removeEventListener('click', toggleModal)
		};
	};
	document.getElementsByTagName('head')[0].appendChild(style);
};
function clearParty() {
	var partySlotImgs = document.getElementsByClassName('party-slot-img');
	var partySlotLvls = document.getElementsByClassName('lvl');
	for (var i=0; i < 6; i++) {
		partySlotImgs[i].style.display = 'None';
		partySlotLvls[i].style.display = 'None';

	};
	
	var style = document.getElementById('party-slots-css');
	if (style) {
		style.remove();
	};
};
function attachModalListeners(modalElm, idx) {
	modalElm.querySelector(`button.close_modal#close-modal-${idx}`).addEventListener('click', toggleModal);
	modalElm.querySelector(`div.modal_overlay#modal-overlay-${idx}`).addEventListener('click', toggleModal);
};
function detachModalListeners(modalElm, idx) {
	modalElm.querySelector(`button.close_modal#close-modal-${idx}`).removeEventListener('click', toggleModal);
	modalElm.querySelector(`div.modal_overlay#modal-overlay-${idx}`).removeEventListener('click', toggleModal);
};
function toggleModal(event) {
    var idx = event.target.id.slice(-1);
	var modal = document.getElementById(`pokemon-modal-${idx}`);
	var currentState = modal.style.display;

	// If modal is hidden, display it. Else, hide it.
	if (currentState === 'none') {
		modal.style.display = 'block';
		attachModalListeners(modal, idx);
        intervalPaused = true;
		pause();
	} else {
		modal.style.display = 'none';
		detachModalListeners(modal, idx);  
        intervalPaused = false;
		run();
	}

};
function buildModal(idx, pokemon) {
    // title
    titleName = pokemon.name.toUpperCase().replace('.', ' ').replace('_M', ' &male;').replace('_F', '&female;');
    document.getElementById(`modal-title-${idx}`).innerHTML = titleName;

    // section 1: stats
    pokemonStats = pokemon.stats;
    document.getElementById(`stats-hp-${idx}`).innerText =  `HP:      ${pokemonStats.HP}`;
    document.getElementById(`stats-atk-${idx}`).innerText = `ATTACK:  ${pokemonStats.ATK}`;
    document.getElementById(`stats-def-${idx}`).innerText = `DEFENSE: ${pokemonStats.DEF}`;
    document.getElementById(`stats-spd-${idx}`).innerText = `SPEED:   ${pokemonStats.SPD}`;
    document.getElementById(`stats-spc-${idx}`).innerText = `SPECIAL: ${pokemonStats.SPC}`;

    // section 2: image + type
    document.getElementById(`modal-img-${idx}`).src = pokemon.image;
    type=document.getElementById(`type-${idx}`);
    if(pokemon.type[0] == pokemon.type[1]){type.innerText=pokemon.type[0]}else{type.innerText=`${pokemon.type[0]}/${pokemon.type[1]}`};

    // section 3: EVs
    pokemonEVs = pokemon.evs;
    document.getElementById(`evs-hp-${idx}`).innerText =  `HP:      ${pokemonEVs.HP[1]}`;
    document.getElementById(`evs-atk-${idx}`).innerText = `ATTACK:  ${pokemonEVs.ATK[1]}`;
    document.getElementById(`evs-def-${idx}`).innerText = `DEFENSE: ${pokemonEVs.DEF[1]}`;
    document.getElementById(`evs-spd-${idx}`).innerText = `SPEED:   ${pokemonEVs.SPD[1]}`;
    document.getElementById(`evs-spc-${idx}`).innerText = `SPECIAL: ${pokemonEVs.SPC[1]}`;

    // section 4: moveset
    pokemonMoves = pokemon.moves;
    for(let i=0; i<pokemonMoves.length; i++) {
        moveElm = document.getElementById(`modal-move-${i}-${idx}`);
        if(pokemonMoves[i].details.name!=='NULL'){
            moveElm.style.display = 'block';
            moveElm.innerText = pokemonMoves[i].details.name;
        } else {
            moveElm.style.display = 'none';
        }
    }
}