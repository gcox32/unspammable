var inFullscreen = false;
var mainCanvas = null;
var fullscreenCanvas = null;
var showAsMinimal = false;
var keyZones = [
	["right", [39]],
	["left", [37]],
	["up", [38]],
	["down", [40]],
	["a", [88, 74]],
	["b", [90, 81, 89]],
	["select", [16]],
	["start", [13]]
];
var gameList = [
	'blue.gbc', 'yellow.gbc', 'red.gbc', 'green.gb'
]

function windowingInitialize() {
	console.log("windowingInitialize() called.", 0);
	windowStacks[0] = windowCreate("GameBoy", true);
	mainCanvas = document.getElementById("mainCanvas");
	fullscreenCanvas = document.getElementById("fullscreen");
	try {
		//Hook the GUI controls.
		registerGUIEvents();
	}
	catch (error) {
		console.log("Fatal windowing error: \"" + error.message + "\" file:" + error.fileName + " line: " + error.lineNumber, 2);
	}
	//Update the settings to the emulator's default:
	document.getElementById("enable-sound").checked = settings[0];
}
function registerGUIEvents() {
	console.log("In registerGUIEvents() : Registering GUI Events.", -1);
	addEvent("click", document.getElementById("blue"), function() {
		var [gameFile, game, clickedCode, saveFileLoc] = getVars(0);
		toggleCartDrawer();
		loadSavedorNewGame(clickedCode, game, gameFile, saveFileLoc);
	});
	addEvent("click", document.getElementById("yellow"), function() {
		var [gameFile, game, clickedCode, saveFileLoc] = getVars(1);
		toggleCartDrawer();
		loadSavedorNewGame(clickedCode, game, gameFile, saveFileLoc);
	});
	addEvent("click", document.getElementById("red"), function() {
		var [gameFile, game, clickedCode, saveFileLoc] = getVars(2);
		toggleCartDrawer();
		loadSavedorNewGame(clickedCode, game, gameFile, saveFileLoc);
	});
	addEvent("click", document.getElementById("green"), function() {
		var [gameFile, game, clickedCode, saveFileLoc] = getVars(3);
		toggleCartDrawer();
		loadSavedorNewGame(clickedCode, game, gameFile, saveFileLoc);
	});
// 
	addEvent("click", document.getElementById("saver"), function() {
		var id = document.getElementById("current-user").textContent;
		var game = document.getElementById("active-cart").textContent;
		var saver = document.getElementById("saver");
		saver.style.background = 'rgba(153, 153, 153, 1)';
		saver.innerText = 'saving...'
		save(id=id, game=game);
	});

	addEvent("click", document.getElementById("pause-btn"), pause);
	addEvent("click", document.getElementById("resume-btn"), run);

	addEvent("click", document.getElementById("reset-btn"), function () {
		var activeCart = document.getElementById('active-cart').textContent;
		var idx;
		switch(activeCart) {
			case "blue":idx=0;break;
			case "yellow":idx=1;break;
			case "red":idx=2;break;
			case "green":idx=3;break;
		};
		var [gameFile, game, clickedCode, saveFileLoc] = getVars(idx);
		loadSavedorNewGame(clickedCode, game, gameFile, saveFileLoc);
	})
	addEvent("click", document.getElementById("newgame-btn"), function () {
		if (GameBoyEmulatorInitialized()) {
			var activeCart = document.getElementById('active-cart').textContent;
			var idx;
			switch(activeCart) {
				case "blue":idx=0;break;
				case "yellow":idx=1;break;
				case "red":idx=2;break;
				case "green":idx=3;break;
			};
			newCart = gameList[idx]
			clearParty();
			loadNewGameFunc(newCart);
		}
	});
	addEvent("click", document.getElementById("refresh-party"), function () {
		var game = document.getElementById("active-cart").textContent;
		updateParty(gameboy.saveState(), 'gif', game);
	})
	addEvent("mousedown", document.getElementById("refresh-party"), function() {
		document.getElementById("refresh-icon").setAttribute("src", "/staticfiles/genone/images/icons/refresh.gif");
	})
	addEvent("mouseup", document.getElementById("refresh-party"), function() {
		document.getElementById("refresh-icon").setAttribute("src", "/staticfiles/genone/images/icons/refresh.png");
	})
	addEvent("click", document.getElementById("adjust-speed-btn"), function () {
		if (GameBoyEmulatorInitialized()) {
			var speed = document.getElementById("speed-input").value;
			if (speed != null && speed.length > 0) {
				gameboy.setSpeed(Math.max(parseFloat(speed), 0.001));
			}
		}
	})

	// clickable joypad
	addEvent('mousedown', document.getElementById('a-btn'), function(keyEvent) {
		interval = setInterval(clickBtn(keyEvent, 88), 10);
	});
	addEvent('mouseup', document.getElementById('a-btn'), function() {
		releaseBtn(keyEvent, 88);
		clearInterval(interval);
	});
	addEvent('mousedown', document.getElementById('b-btn'), function(keyEvent) {
		interval = setInterval(clickBtn(keyEvent, 90), 10);
	});
	addEvent('mouseup', document.getElementById('b-btn'), function() {
		releaseBtn(keyEvent, 90);
		clearInterval(interval);
	});
	addEvent('mousedown', document.getElementById('up-btn'), function(keyEvent) {
		interval = setInterval(clickBtn(keyEvent, 38), 10);
	});
	addEvent('mouseup', document.getElementById('up-btn'), function() {
		releaseBtn(keyEvent, 38);
		clearInterval(interval);
	});
	addEvent('mousedown', document.getElementById('down-btn'), function(keyEvent) {
		interval = setInterval(clickBtn(keyEvent, 40), 10);
	});
	addEvent('mouseup', document.getElementById('down-btn'), function() {
		releaseBtn(keyEvent, 40);
		clearInterval(interval);
	});
	addEvent('mousedown', document.getElementById('left-btn'), function(keyEvent) {
		interval = setInterval(clickBtn(keyEvent, 37), 10);
	});
	addEvent('mouseup', document.getElementById('left-btn'), function() {
		releaseBtn(keyEvent, 37);
		clearInterval(interval);
	});
	addEvent('mousedown', document.getElementById('right-btn'), function(keyEvent) {
		interval = setInterval(clickBtn(keyEvent, 39), 10);
	});
	addEvent('mouseup', document.getElementById('right-btn'), function() {
		releaseBtn(keyEvent, 39);
		clearInterval(interval);
	});
	addEvent('mousedown', document.getElementById('start-btn'), function(keyEvent) {
		interval = setInterval(clickBtn(keyEvent, 13), 10);
	});
	addEvent('mouseup', document.getElementById('start-btn'), function() {
		releaseBtn(keyEvent, 13);
		clearInterval(interval);
	});
	addEvent('mousedown', document.getElementById('select-btn'), function(keyEvent) {
		interval = setInterval(clickBtn(keyEvent, 16), 10);
	});
	addEvent('mouseup', document.getElementById('select-btn'), function() {
		releaseBtn(keyEvent, 16);
		clearInterval(interval);
	});

// touchable joypad
	addEvent('touchstart', document.getElementById('a-btn'), function(keyEvent) {
		interval = setInterval(clickBtn(keyEvent, 88), 10);
	});
	addEvent('touchend', document.getElementById('a-btn'), function() {
		releaseBtn(keyEvent, 88);
		clearInterval(interval);
	});
	addEvent('touchstart', document.getElementById('b-btn'), function(keyEvent) {
		interval = setInterval(clickBtn(keyEvent, 90), 10);
	});
	addEvent('touchend', document.getElementById('b-btn'), function() {
		releaseBtn(keyEvent, 90);
		clearInterval(interval);
	});
	addEvent('touchstart', document.getElementById('up-btn'), function(keyEvent) {
		interval = setInterval(clickBtn(keyEvent, 38), 10);
	});
	addEvent('touchend', document.getElementById('up-btn'), function() {
		releaseBtn(keyEvent, 38);
		clearInterval(interval);
	});
	addEvent('touchstart', document.getElementById('down-btn'), function(keyEvent) {
		interval = setInterval(clickBtn(keyEvent, 40), 10);
	});
	addEvent('touchend', document.getElementById('down-btn'), function() {
		releaseBtn(keyEvent, 40);
		clearInterval(interval);
	});
	addEvent('touchstart', document.getElementById('left-btn'), function(keyEvent) {
		interval = setInterval(clickBtn(keyEvent, 37), 10);
	});
	addEvent('touchend', document.getElementById('left-btn'), function() {
		releaseBtn(keyEvent, 37);
		clearInterval(interval);
	});
	addEvent('touchstart', document.getElementById('right-btn'), function(keyEvent) {
		interval = setInterval(clickBtn(keyEvent, 39), 10);
	});
	addEvent('touchend', document.getElementById('right-btn'), function() {
		releaseBtn(keyEvent, 39);
		clearInterval(interval);
	});
	addEvent('touchstart', document.getElementById('start-btn'), function(keyEvent) {
		interval = setInterval(clickBtn(keyEvent, 13), 10);
	});
	addEvent('touchend', document.getElementById('start-btn'), function() {
		releaseBtn(keyEvent, 13);
		clearInterval(interval);
	});
	addEvent('touchstart', document.getElementById('select-btn'), function(keyEvent) {
		interval = setInterval(clickBtn(keyEvent, 16), 10);
	});
	addEvent('touchend', document.getElementById('select-btn'), function() {
		releaseBtn(keyEvent, 16);
		clearInterval(interval);
	});
	// drawer nav bars
	addEvent('click', document.getElementById('cartridge-arrow'), toggleCartDrawer);
	addEvent('click', document.getElementById('settings-arrow'), toggleSettingsDrawer);
	// mobile mode
	addEvent('change', document.querySelector('.switch input[type="checkbox"]'), toggleMobileMode);
// ****************************************************************************
	addEvent("keydown", document, keyDown);
	addEvent("keyup", document,  function (event) {
		if (event.keyCode == 27) {
			//Fullscreen on/off
			fullscreenPlayer();
		}
		else {
			//Control keys / other
			keyUp(event);
		}
	});
	addEvent("MozOrientation", window, GameBoyGyroSignalHandler);
	addEvent("deviceorientation", window, GameBoyGyroSignalHandler);
	addEvent("click", document.getElementById("enable-sound"), function () {
		soundBtn = document.getElementById("enable-sound");
		settings[0] = soundBtn.getAttribute('value');

		if (settings[0] == 'true') {
			soundBtn.style.background = 'none';
			soundBtn.innerText = 'sound off';
			soundBtn.setAttribute('value','false');
			soundBtn.setAttribute('title', 'enable sound');
			settings[0] = false;
		} else {
			soundBtn.style.background = 'rgb(153, 153, 153)';
			soundBtn.innerText = 'sound on';
			soundBtn.setAttribute('value','true');
			soundBtn.setAttribute('title', 'disable sound');
			settings[0] = true;
		};

		if (GameBoyEmulatorInitialized()) {
			gameboy.initSound();
		}
	});
	addEvent("mouseup", document.getElementById("gfx"), initNewCanvasSize);
	addEvent("resize", window, initNewCanvasSize);
	addEvent("unload", window, function () {
		autoSave();
	});
};

function changeVolume() {
	if (GameBoyEmulatorInitialized()) {
		var volume = prompt("Set the volume here:", "1.0");
		if (volume != null && volume.length > 0) {
			settings[3] = Math.min(Math.max(parseFloat(volume), 0), 1);
			gameboy.changeVolume();
		}
	}
};
function keyDown(event) {
	var keyCode = event.keyCode;
	var keyMapLength = keyZones.length;
	for (var keyMapIndex = 0; keyMapIndex < keyMapLength; ++keyMapIndex) {
		var keyCheck = keyZones[keyMapIndex];
		var keysMapped = keyCheck[1];
		var keysTotal = keysMapped.length;
		for (var index = 0; index < keysTotal; ++index) {
			if (keysMapped[index] == keyCode) {
				GameBoyKeyDown(keyCheck[0]);
				try {
					event.preventDefault();
				}
				catch (error) { }
			}
		}
	}
};
function keyUp(event) {
	var keyCode = event.keyCode;
	var keyMapLength = keyZones.length;
	for (var keyMapIndex = 0; keyMapIndex < keyMapLength; ++keyMapIndex) {
		var keyCheck = keyZones[keyMapIndex];
		var keysMapped = keyCheck[1];
		var keysTotal = keysMapped.length;
		for (var index = 0; index < keysTotal; ++index) {
			if (keysMapped[index] == keyCode) {
				GameBoyKeyUp(keyCheck[0]);
				try {
					event.preventDefault();
				}
				catch (error) { }
			}
		}
	}
};
function initPlayer() {
	document.getElementById("logo").style.display = "none";
	document.getElementById("fullscreenContainer").style.display = "none";
};
function fullscreenPlayer() {
	if (GameBoyEmulatorInitialized()) {
		if (!inFullscreen) {
			gameboy.canvas = fullscreenCanvas;
			fullscreenCanvas.className = (showAsMinimal) ? "minimum" : "maximum";
			document.getElementById("fullscreenContainer").style.display = "block";
			windowStacks[0].hide();
		}
		else {
			gameboy.canvas = mainCanvas;
			document.getElementById("fullscreenContainer").style.display = "none";
			windowStacks[0].show();
		}
		gameboy.initLCD();
		inFullscreen = !inFullscreen;
	}
	else {
		console.log("Cannot go into fullscreen mode.", 2);
	}
};
//Some wrappers and extensions for non-DOM3 browsers:
function isDescendantOf(ParentElement, toCheck) {
	if (!ParentElement || !toCheck) {
		return false;
	}
	//Verify an object as either a direct or indirect child to another object.
	function traverseTree(domElement) {
		while (domElement != null) {
			if (domElement.nodeType == 1) {
				if (isSameNode(domElement, toCheck)) {
					return true;
				}
				if (hasChildNodes(domElement)) {
					if (traverseTree(domElement.firstChild)) {
						return true;
					}
				}
			}
			domElement = domElement.nextSibling;
		}
		return false;
	}
	return traverseTree(ParentElement.firstChild);
};
function hasChildNodes(oElement) {
	return (typeof oElement.hasChildNodes == "function") ? oElement.hasChildNodes() : ((oElement.firstChild != null) ? true : false);
};
function isSameNode(oCheck1, oCheck2) {
	return (typeof oCheck1.isSameNode == "function") ? oCheck1.isSameNode(oCheck2) : (oCheck1 === oCheck2);
};
function pageXCoord(event) {
	if (typeof event.pageX == "undefined") {
		return event.clientX + document.documentElement.scrollLeft;
	}
	return event.pageX;
};
function pageYCoord(event) {
	if (typeof event.pageY == "undefined") {
		return event.clientY + document.documentElement.scrollTop;
	}
	return event.pageY;
};
function mouseLeaveVerify(oElement, event) {
	//Hook target element with onmouseout and use this function to verify onmouseleave.
	return isDescendantOf(oElement, (typeof event.target != "undefined") ? event.target : event.srcElement) && !isDescendantOf(oElement, (typeof event.relatedTarget != "undefined") ? event.relatedTarget : event.toElement);
};
function mouseEnterVerify(oElement, event) {
	//Hook target element with onmouseover and use this function to verify onmouseenter.
	return !isDescendantOf(oElement, (typeof event.target != "undefined") ? event.target : event.srcElement) && isDescendantOf(oElement, (typeof event.relatedTarget != "undefined") ? event.relatedTarget : event.fromElement);
};
function addEvent(sEvent, oElement, fListener) {
	try {	
		oElement.addEventListener(sEvent, fListener, false);
		// console.log("In addEvent() : Standard addEventListener() called to add a(n) \"" + sEvent + "\" event.", -1);
	}
	catch (error) {
		oElement.attachEvent("on" + sEvent, fListener);	//Pity for IE.
		// console.log("In addEvent() : Nonstandard attachEvent() called to add an \"on" + sEvent + "\" event.", -1);
	}
};
function removeEvent(sEvent, oElement, fListener) {
	try {	
		oElement.removeEventListener(sEvent, fListener, false);
		// console.log("In removeEvent() : Standard removeEventListener() called to remove a(n) \"" + sEvent + "\" event.", -1);
	}
	catch (error) {
		oElement.detachEvent("on" + sEvent, fListener);	//Pity for IE.
		// console.log("In removeEvent() : Nonstandard detachEvent() called to remove an \"on" + sEvent + "\" event.", -1);
	}
};

// new stuff
function loadNewGame(filepath, callback) {
	var xhr = new XMLHttpRequest();
	const filename = filepath.split('/')[2];
	xhr.open("GET", filepath, true);
	xhr.responseType = 'blob';
	xhr.send();

	xhr.onreadystatechange = function() {
		if (this.status==200) {
			myBlob = new Blob([xhr.response]);
			myFile = new File([myBlob], filename, {
				type: myBlob.type
			});
			callback(myBlob, myFile);

		};
	};
	return [myBlob, myFile]
};

function loadSavedGame(filepath, callback) {
	var xhr = new XMLHttpRequest();
	const filename = filepath.split('/')[2];
	xhr.open("GET", filepath, true);
	xhr.send();

	xhr.onreadystatechange = function() {
		if (this.status==200) {
			saveStateArray = JSON.parse(xhr.response);
			callback(saveStateArray);

			try {
				var game = document.getElementById("active-cart").textContent
				updateParty(saveStateArray, 'gif', game);
			} catch(err) {
				console.log(err);
			};
		};
	};
	return saveStateArray;
};

function uploadSaveFile(file, savename) {
	const filename = savename + ".json";
	const dest = "/genone/roms/" + filename;
	var myFile;

	str = JSON.stringify(file)
	myFile = new File([str], filename, {
		type: file.type
	});

	formData = new FormData();
	formData.append("upload", myFile);

	var xhr = new XMLHttpRequest();
	xhr.open("POST", dest, true);
	xhr.send(formData);

	xhr.onreadystatechange = function() {
		if (this.status==200) {
			saver.style.background = 'rgba(153, 153, 153, 0)';
			saver.innerText = "save game";
		};
	};
};



function getVars(gameIdx) {
	var gameFile = gameList[gameIdx];
	var game = gameFile.split('.')[0];

	var activeCart = document.getElementById("active-cart");
	activeCart.textContent = game;
	var clicked = document.getElementById(game);
	var clickedCode = clicked.getAttribute('value');
	var saveFileLoc = clicked.getAttribute('name');
	return [gameFile, game, clickedCode, saveFileLoc]
};
function loadNewGameFunc(gameFile) {
	var cartridge = loadNewGame('/genone/roms/new-' + gameFile, function(blob, file) {
		var reader = new FileReader();
		reader.addEventListener('load', function (e) {
			initPlayer();
			start(mainCanvas, e.target.result);
		});
		reader.readAsBinaryString(file);
	});
};
function loadSavedGameFunc(saveFileLoc) {
	var savedGame = loadSavedGame('/genone/roms/' + saveFileLoc, function(saveState){
		clearLastEmulation();
		gameboy = new GameBoyCore(mainCanvas, "");
		gameboy.savedStateFileName = saveFileLoc;
		gameboy.returnFromState(saveState);
		run();
	});
};
function loadSavedorNewGame(clickedCode, game, gameFile, saveFileLoc) {
	document.getElementById("on-light").style.opacity = 1;
	backgroundSwitch(game);

	if (clickedCode == game + "-new") {
		loadNewGameFunc(gameFile);
	} else {
		loadSavedGameFunc(saveFileLoc);
	};
};
function backgroundSwitch(version) {
	var bg = document.getElementsByTagName('body')[0];
	bg.style.backgroundImage = 'url(\"/staticfiles/genone/images/bg-' + version + '.png\")'
	switch(version) {
		case "blue":bg.style.backgroundColor = "rgb(49,143,205)";break;
		case "yellow":bg.style.backgroundColor = "rgb(249,202,24)";break;
		case "red":bg.style.backgroundColor = "rgb(255,69,22)";break;
		case "green":bg.style.backgroundColor = "rgb(0,166,82)";break;
		default:bg.style.backgroundColor = "rgb(49,143,205)";
	}
};
function toggleCartDrawer() {
	var cartArrow = document.getElementById("cartridge-arrow");
	var cartDrawer = document.getElementsByClassName("cart-drawer")[0];
	var activeParty = document.getElementById('active-party');

	if (cartArrow.style.transform != 'rotate(360deg)') {
		cartArrow.style.transform = 'rotate(360deg)';
		cartDrawer.style.transform = 'translateX(-83%)';
		activeParty.style.transform = 'translateX(0)';

	} else {
		cartArrow.style.transform = 'rotate(180deg)';
		cartDrawer.style.transform = 'translateX(0%)';
		activeParty.style.transform = 'translateX(-260px)';
	};
};
function toggleSettingsDrawer() {
	var settingsArrow = document.getElementById("settings-arrow");
	var settingsDrawer = document.getElementsByClassName("settings")[0];
	if (settingsArrow.style.transform != 'rotate(180deg)') {
		settingsArrow.style.transform = 'rotate(180deg)';
		settingsDrawer.style.transform = 'translateX(80%)';
	} else {
		settingsArrow.style.transform = 'none';
		settingsDrawer.style.transform = 'translateX(0%)';
	};
};
function toggleMobileMode() {
	var toggleSwitch = document.querySelector('.switch input[type="checkbox"]');
	var settingsArrow = document.getElementById("settings-arrow");
	var cartArrow = document.getElementById("cartridge-arrow");
    var mobileWrapper = document.getElementById('mobile-wrapper');
	var gameboy = document.getElementsByClassName('console-container')[0];

	if (toggleSwitch.checked) {
		if (settingsArrow.style.transform != 'rotate(180deg)') {
			toggleSettingsDrawer();
		};
		if (cartArrow.style.transform != 'rotate(360deg)') {
			toggleCartDrawer();
		};
		mobileWrapper.style.overflow = 'hidden';
		gameboy.style.top = '0';
		gameboy.style.left = '0';

	} else {
		if (settingsArrow.style.transform == 'rotate(180deg)') {
			toggleSettingsDrawer();
		};
		if (cartArrow.style.transform == 'rotate(360deg)') {
			toggleCartDrawer();
		};
		mobileWrapper.style.overflow = 'auto';
		gameboy.style.top = '-20px';
		gameboy.style.left = '346px';
	}
};
// buttons
function clickBtn(eventObj, keyCode) {
	keyEvent = new KeyboardEvent("keydown", {
		bubbles : true,
		cancelable : true,
		char : "x",
		key : "x",
		shiftKey : false,
		keyCode : keyCode});
	document.dispatchEvent(keyEvent);
};
function releaseBtn(eventObj, keyCode) {
	keyEvent = new KeyboardEvent("keyup", {
		bubbles : true,
		cancelable : true,
		char : "x",
		key : "x",
		shiftKey : false,
		keyCode : keyCode});
	document.dispatchEvent(keyEvent);
};

// parse file for party data
function translateIndex(index, style) {
	// key on game code index; value of [dex number, name]
	var dexDict = {
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

	var gifBase = 'https://projectpokemon.org/images/normal-sprite/bulbasaur.gif';
	var greenBase = 'https://projectpokemon.org/images/sprites-models/gb-sprites/red-jp-001.png';
	var blueBase = 'https://projectpokemon.org/images/sprites-models/gb-sprites/blue-jp-001.png';
	var yellowBase = 'https://projectpokemon.org/images/sprites-models/gb-sprites/yellow-en-001.png';

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
}

function getPartyInfo(fileOrBlob, style, game) {
	var bankIdx;
	var offset;
	switch(game) {
		case "yellow": offset = 355, bankIdx = 23; break;
		case "red": offset = 53604, bankIdx = 19; break;
		case "blue": offset = 53604, bankIdx = 19; break;
		default: offset = 0, bankIdx = 0;
	};
	var bank = fileOrBlob[bankIdx];

	// yellow offset, bank = 355, 23
	// blue and red offset, bank = 53604, 19
	// green info

	var party = []
	for (var i=offset; i < offset + 6; i++) {
		if (bank[i] == 255) {
			break;
		} else {
			party.push(bank[i]);
		}
	}

	var typeDict = {
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
	}
	
	var hpList = []
	var typeList = []
	var fullHpList = []
	var atkList = []
	var defList = []
	var spdList = []
	var spcList = []

	var imgLinks = []
	var imgLink;
	for(var i=0; i <party.length; i++) {
		imgLink = translateIndex(party[i], style);
		imgLinks.push(imgLink);
	}

	var levelList = []
	var counter = 1;
	for (var i=offset + 7; i < offset + 7 + (44 * party.length); i++) {
		if (counter == 3) {
			if (bank[i] == 0) {
				hpList.push(false);
			} else {
				hpList.push(true);
			};
		};
		if (counter == 34) {
			levelList.push(bank[i]);
			counter = -10;
		}
		counter++;	
		
	}

	return [imgLinks, levelList, hpList];
};

function updateParty(fileOrBlob, style, game) {
	// get rom indices from save data
	var partyData = getPartyInfo(fileOrBlob, style, game);
	var imgLinks = partyData[0];
	var levelList = partyData[1];
	var hpList = partyData[2];

	var partySlots = document.getElementsByClassName('party-slot');
	var partySlotImgs = document.getElementsByClassName('party-slot-img');
	var partySlotLvls = document.getElementsByClassName('lvl');

	clearParty();

	var style = document.createElement('style');
	style.id = 'party-slots-css'

	for (var i=0; i < 6; i++) {
		if (i < imgLinks.length) {
			partySlotImgs[i].style.display = 'block';
			partySlotImgs[i].src = imgLinks[i];
			if (!hpList[i]) {
				partySlotImgs[i].style.opacity = '0.2';
			} else {
				partySlotImgs[i].style.opacity = '1';
			};

			partySlotLvls[i].style.display = 'block';
			partySlotLvls[i].innerHTML = levelList[i]

			// add hover 
			var hoverCss = `.party-slot:nth-child(${i+2}) {
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