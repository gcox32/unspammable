const moveBytes = [8, 9, 10, 11];
const currentPPBytes = [29, 30, 31, 32];

class Move {
    constructor(idx, currentPP, moveslot) {
        this.idx = idx;
        this.currentPP = currentPP;
        this.moveslot = moveslot;
    }
    get details() {
        return moveDict[this.idx];
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
        return dexDict[this.idx];
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

const dexDict = {
    '1': ['rhydon', '112'],
    '2': ['kangaskhan', '115'],
    '3': ['nidoran_m', '032'],
    '4': ['clefairy', '035'],
    '5': ['spearow', '021'],
    '6': ['voltorb', '100'],
    '7': ['nidoking', '035'],
    '8': ['slowbro', '080'],
    '9': ['ivysaur', '002'],
    '10': ['exeggutor', '103'],
    '11': ['lickitung', '108'],
    '12': ['exeggcute', '102'],
    '13': ['grimer', '088'],
    '14': ['gengar', '094'],
    '15': ['nidoran_f', '029'],
    '16': ['nidoqueen', '031'],
    '17': ['cubone', '104'],
    '18': ['rhyhorn', '111'],
    '19': ['lapras', '131'],
    '20': ['arcanine', '059'],
    '21': ['mew', '151'],
    '22': ['gyarados', '130'],
    '23': ['shellder', '090'],
    '24': ['tentacool', '072'],
    '25': ['gastly', '092'],
    '26': ['scyther', '123'],
    '27': ['staryu', '120'],
    '28': ['blastoise', '009'],
    '29': ['pinsir', '127'],
    '30': ['tangela', '114'],
    '31': ['missingno', ''],
    '32': ['missingno', ''],
    '33': ['growlithe', '058'],
    '34': ['onix', '095'],
    '35': ['fearow', '022'],
    '36': ['pidgey', '016'],
    '37': ['slowpoke', '079'],
    '38': ['kadabra', '064'],
    '39': ['graveler', '075'],
    '40': ['chansey', '113'],
    '41': ['machoke', '067'],
    '42': ['mr.mime', '122'],
    '43': ['hitmonlee', '106'],
    '44': ['hitmonchan', '107'],
    '45': ['arbok', '024'],
    '46': ['parasect', '047'],
    '47': ['psyduck', '054'],
    '48': ['drowzee', '096'],
    '49': ['golem', '076'],
    '50': ['missingno', ''],
    '51': ['magmar', '126'],
    '52': ['missingno', ''],
    '53': ['electabuzz', '125'],
    '54': ['magneton', '082'],
    '55': ['koffing', '109'],
    '56': ['missingno', ''],
    '57': ['mankey', '056'],
    '58': ['seel', '086'],
    '59': ['diglett', '050'],
    '60': ['tauros', '128'],
    '61': ['missingno', ''],
    '62': ['missingno', ''],
    '63': ['missingno', ''],
    '64': ['farfetchd', '083'],
    '65': ['venonat', '048'],
    '66': ['dragonite', '149'],
    '67': ['missingno', ''],
    '68': ['missingno', ''],
    '69': ['missingno', ''],
    '70': ['doduo', '084'],
    '71': ['poliwag', '060'],
    '72': ['jynx', '124'],
    '73': ['moltres', '146'],
    '74': ['articuno', '144'],
    '75': ['zapdos', '145'],
    '76': ['ditto', '132'],
    '77': ['meowth', '052'],
    '78': ['krabby', '098'],
    '79': ['missingno', ''],
    '80': ['missingno', ''],
    '81': ['missingno', ''],
    '82': ['vulpix', '037'],
    '83': ['ninetales', '038'],
    '84': ['pikachu', '025'],
    '85': ['raichu', '026'],
    '86': ['missingno', ''],
    '87': ['missingno', ''],
    '88': ['dratini', '147'],
    '89': ['dragonair', '148'],
    '90': ['kabuto', '140'],
    '91': ['kabutops', '141'],
    '92': ['horsea', '116'],
    '93': ['seadra', '117'],
    '94': ['missingno', ''],
    '95': ['missingno', ''],
    '96': ['sandshrew', '027'],
    '97': ['sandslash', '028'],
    '98': ['omanyte', '138'],
    '99': ['omastar', '139'],
    '100': ['jigglypuff', '039'],
    '101': ['wigglytuff', '040'],
    '102': ['eevee', '133'],
    '103': ['flareon', '136'],
    '104': ['jolteon', '135'],
    '105': ['vaporeon', '134'],
    '106': ['machop', '066'],
    '107': ['zubat', '041'],
    '108': ['ekans', '023'],
    '109': ['paras', '046'],
    '110': ['poliwhirl', '061'],
    '111': ['poliwrath', '062'],
    '112': ['weedle', '013'],
    '113': ['kakuna', '014'],
    '114': ['beedrill', '015'],
    '115': ['missingno', ''],
    '116': ['dodrio', '085'],
    '117': ['primeape', '057'],
    '118': ['dugtrio', '051'],
    '119': ['venomoth', '049'],
    '120': ['dewgong', '087'],
    '121': ['missingno', ''],
    '122': ['missingno', ''],
    '123': ['caterpie', '010'],
    '124': ['metapod', '011'],
    '125': ['butterfree', '012'],
    '126': ['machamp', '068'],
    '127': ['missingno', ''],
    '128': ['golduck', '055'],
    '129': ['hypno', '097'],
    '130': ['golbat', '042'],
    '131': ['mewtwo', '150'],
    '132': ['snorlax', '143'],
    '133': ['magikarp', '129'],
    '134': ['missingno', ''],
    '135': ['missingno', ''],
    '136': ['muk', '089'],
    '137': ['missingno', ''],
    '138': ['kingler', '099'],
    '139': ['cloyster', '091'],
    '140': ['missingno', ''],
    '141': ['electrode', '101'],
    '142': ['clefable', '036'],
    '143': ['weezing', '110'],
    '144': ['persian', '053'],
    '145': ['marowak', '105'],
    '146': ['missingno', ''],
    '147': ['haunter', '093'],
    '148': ['abra', '063'],
    '149': ['alakazam', '065'],
    '150': ['pidgeotto', '017'],
    '151': ['pidgeot', '018'],
    '152': ['starmie', '121'],
    '153': ['bulbasaur', '001'],
    '154': ['venusaur', '003'],
    '155': ['tentacruel', '073'],
    '156': ['missingno', ''],
    '157': ['goldeen', '118'],
    '158': ['seaking', '119'],
    '159': ['missingno', ''],
    '160': ['missingno', ''],
    '161': ['missingno', ''],
    '162': ['missingno', ''],
    '163': ['ponyta', '077'],
    '164': ['rapidash', '078'],
    '165': ['rattata', '019'],
    '166': ['raticate', '020'],
    '167': ['nidorino', '033'],
    '168': ['nidorina', '030'],
    '169': ['geodude', '074'],
    '170': ['porygon', '137'],
    '171': ['aerodactyl', '142'],
    '172': ['missingno', ''],
    '173': ['magnemite', '081'],
    '174': ['missingno', ''],
    '175': ['missingno', ''],
    '176': ['charmander', '004'],
    '177': ['squirtle', '007'],
    '178': ['charmeleon', '005'],
    '179': ['wartortle', '008'],
    '180': ['charizard', '006'],
    '181': ['missingno', ''],
    '182': ['missingno', ''],
    '183': ['missingno', ''],
    '184': ['missingno', ''],
    '185': ['oddish', '043'],
    '186': ['gloom', '044'],
    '187': ['vileplume', '045'],
    '188': ['bellsprout', '069'],
    '189': ['weepinbell', '070'],
    '190': ['victreebel', '071'],
};

const statusDict = {
    '0':'HEALTHY',
    '3':'ASLEEP',
    '4':'POISON',
    '5':'BURNED',
    '6':'FROZEN',
    '7':'PARALYZED'
}

const typeDict = {
    '0':'NORMAL',
    '1':'FIGHTING',
    '2':'FLYING',
    '3':'POISON',
    '4':'GROUND',
    '5':'ROCK',
    '7':'BUG',
    '8':'GHOST',
    '20':'FIRE',
    '21':'WATER',
    '22':'GRASS',
    '23':'ELECTRIC',
    '24':'PSYCHIC',
    '25':'ICE',
    '26':'DRAGON'
};

const moveDict = {
    '0': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '1': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '2': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '3': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''}, 
    '4': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''}, 
    '5': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''}, 
    '6': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''}, 
    '7': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''}, 
    '8': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''}, 
    '9': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''}, 
    '10': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '11': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '12': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '13': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '14': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '15': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '16': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '17': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '18': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '19': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '20': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '21': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '22': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '23': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '24': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '25': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '26': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '27': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '28': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '29': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '30': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '31': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '32': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '33': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '34': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '35': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '36': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '37': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '38': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '39': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '40': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '41': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '42': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '43': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '44': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '45': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '46': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '47': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '48': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '49': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '50': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '51': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '52': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '53': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '54': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '55': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '56': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '57': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '58': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '59': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '60': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '61': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '62': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '63': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '64': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '65': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '66': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '67': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '68': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '69': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '70': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '71': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '72': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '73': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '74': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '75': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '76': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '77': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '78': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '79': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '80': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '81': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '82': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '83': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '84': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '85': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '86': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '87': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '88': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '89': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '90': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '91': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '92': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '93': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '94': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '95': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '96': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '97': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '98': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '99': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '100': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '101': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '102': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '103': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '104': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '105': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '106': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '107': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '108': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '109': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '110': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '111': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '112': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '113': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '114': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '115': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '116': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '117': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '118': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '119': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '120': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '121': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '122': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '123': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '124': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '125': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '126': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '127': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '128': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '129': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '130': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '131': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '132': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '133': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '134': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '135': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '136': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '137': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '138': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '139': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '140': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '141': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '142': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '143': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '144': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '145': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '146': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '147': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '148': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '149': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '150': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '151': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '152': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '153': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '154': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '155': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '156': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '157': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '158': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '159': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '160': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '161': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '162': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '163': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '164': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''},
    '165': {'name':'','type':'','PP':0,'power':0,'accuracy':0,'description':''}
};
function getImgSrc(index, style) {
	// var gifBase = 'https://projectpokemon.org/images/normal-sprite/bulbasaur.gif';
	// var greenBase = 'https://projectpokemon.org/images/sprites-models/gb-sprites/red-jp-001.png';
	// var blueBase = 'https://projectpokemon.org/images/sprites-models/gb-sprites/blue-jp-001.png';
	// var yellowBase = 'https://projectpokemon.org/images/sprites-models/gb-sprites/yellow-en-001.png';

	var valTuple = dexDict[index];
	var link;
	switch (style) {
		case "gif": link = `https://projectpokemon.org/images/normal-sprite/${valTuple[0]}.gif`; break;
		case "green": link = `https://projectpokemon.org/images/sprites-models/gb-sprites/red-jp-${valTuple[1]}.png`; break;
		case "blue": link = `https://projectpokemon.org/images/sprites-models/gb-sprites/blue-jp-${valTuple[1]}.png`; break;
		case "red": link = `https://projectpokemon.org/images/sprites-models/gb-sprites/blue-jp-${valTuple[1]}.png`; break;
		case "yellow": link = `https://projectpokemon.org/images/sprites-models/gb-sprites/yellow-en-${valTuple[1]}.png`; break;
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
function attachModalListeners(modalElm) {
	modalElm.querySelector('.close_modal').addEventListener('click', toggleModal);
	modalElm.querySelector('.modal_overlay').addEventListener('click', toggleModal);
};
function detachModalListeners(modalElm) {
	modalElm.querySelector('.close_modal').removeEventListener('click', toggleModal);
	modalElm.querySelector('.modal_overlay').removeEventListener('click', toggleModal);
};
function toggleModal() {
	var modal = document.getElementById('pokemon-modal-0');
	var currentState = modal.style.display;

	// If modal is visible, hide it. Else, display it.
	if (currentState === 'none') {
		modal.style.display = 'block';
		attachModalListeners(modal);
		pause();
	} else {
		modal.style.display = 'none';
		detachModalListeners(modal);  
		run();
	}

};