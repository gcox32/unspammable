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
	'blue.gb', 'yellow.gbc', 'red.gb', 'green.gb'
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
		loadSavedorNewGame(clickedCode, game, gameFile, saveFileLoc);
	});
	addEvent("click", document.getElementById("yellow"), function() {
		var [gameFile, game, clickedCode, saveFileLoc] = getVars(1);
		loadSavedorNewGame(clickedCode, game, gameFile, saveFileLoc);
	});
	addEvent("click", document.getElementById("red"), function() {
		var [gameFile, game, clickedCode, saveFileLoc] = getVars(2);
		loadSavedorNewGame(clickedCode, game, gameFile, saveFileLoc);
	});
	addEvent("click", document.getElementById("green"), function() {
		var [gameFile, game, clickedCode, saveFileLoc] = getVars(3);
		loadSavedorNewGame(clickedCode, game, gameFile, saveFileLoc);
	});
// 
	addEvent("click", document.getElementById("saver"), function() {
		var id = document.getElementById("current-user").textContent;
		var game = document.getElementById("active-cart").textContent;
		save(id=id, game=game);
	});
	addEvent("click", document.getElementById("pause-btn"), function () {
		pause();
	});
	addEvent("click", document.getElementById("resume-btn"), function () {
		run();
	});
	addEvent("click", document.getElementById("restart-btn"), function () {
		if (GameBoyEmulatorInitialized()) {
			try {
				if (!gameboy.fromSaveState) {
					cartridge = loadNewFile('/genone/roms/' + gameFile);
					var reader = new FileReader();
					reader.addEventListener('load', function (e) {
						initPlayer();
						start(mainCanvas, e.target.result);
					});
					reader.readAsBinaryString(cartridge[1]);
				}
				else {
					saveStateArray = loadJson('/genone/roms/savestates/' + saveFileLoc);
					clearLastEmulation();
					gameboy = new GameBoyCore(mainCanvas, "");
					gameboy.savedStateFileName = saveFileLoc;
					gameboy.returnFromState(saveStateArray);
					run();
				}
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
		else {
			console.log("Could not restart, as a previous emulation session could not be found.", 1);
		}
	});
	addEvent("click", document.getElementById("adjust-speed-btn"), function () {
		if (GameBoyEmulatorInitialized()) {
			var speed = document.getElementById("speed-input").value;
			if (speed != null && speed.length > 0) {
				gameboy.setSpeed(Math.max(parseFloat(speed), 0.001));
			}
		}
	})
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
		settings[0] = document.getElementById("enable-sound").checked;
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
function uploadSaveFile(file, savename) {
	str = JSON.stringify(file)
	const filename = savename + ".json";
	const dest = "/genone/roms/savestates/" + filename;
	myFile = new File([str], filename, {
		type: file.type
	});

	formData = new FormData();
	formData.append("upload", myFile);

	var xhr = new XMLHttpRequest();
	xhr.open("POST", dest, true);
	xhr.send(formData);
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
		};
	};
	return saveStateArray;
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
	var cartridge = loadNewGame('/genone/roms/' + gameFile, function(blob, file) {
		var reader = new FileReader();
		reader.addEventListener('load', function (e) {
			initPlayer();
			start(mainCanvas, e.target.result);
		});
		reader.readAsBinaryString(file);
	});
};
function loadSavedGameFunc(saveFileLoc) {
	var savedGame = loadSavedGame('/genone/roms/savestates/' + saveFileLoc, function(saveState){
		clearLastEmulation();
		gameboy = new GameBoyCore(mainCanvas, "");
		gameboy.savedStateFileName = saveFileLoc;
		gameboy.returnFromState(saveState);
		run();
	});
};
function loadSavedorNewGame(clickedCode, game, gameFile, saveFileLoc) {
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
};