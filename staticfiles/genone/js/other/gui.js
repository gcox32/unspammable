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
	document.getElementById("enable_sound").checked = settings[0];
	document.getElementById("enable_gbc_bios").checked = settings[1];
	document.getElementById("disable_colors").checked = settings[2];
	document.getElementById("rom_only_override").checked = settings[9];
	document.getElementById("mbc_enable_override").checked = settings[10];
	document.getElementById("enable_colorization").checked = settings[4];
	document.getElementById("do_minimal").checked = showAsMinimal;
	document.getElementById("software_resizing").checked = settings[12];
	document.getElementById("typed_arrays_disallow").checked = settings[5];
	document.getElementById("gb_boot_rom_utilized").checked = settings[11];
	document.getElementById("resize_smoothing").checked = settings[13];
    document.getElementById("channel1").checked = settings[14][0];
    document.getElementById("channel2").checked = settings[14][1];
    document.getElementById("channel3").checked = settings[14][2];
    document.getElementById("channel4").checked = settings[14][3];
}
function registerGUIEvents() {
	console.log("In registerGUIEvents() : Registering GUI Events.", -1);
// blah
	addEvent("click", document.getElementById("blue"), function() {
		gameFile = gameList[0];
		game = gameFile.split('.')[0];

		activeCart = document.getElementById("active-cart");
		activeCart.textContent = game;
		clicked = document.getElementById(game);
		clickedCode = clicked.getAttribute('value');
		saveFileLoc = clicked.getAttribute('name');

		console.log(clickedCode);
		if (clickedCode == game + "-new") {
			cartridge = loadNewFile('/genone/roms/' + gameFile);
			var reader = new FileReader();
			reader.addEventListener('load', function (e) {
				initPlayer();
				start(mainCanvas, e.target.result);
			});
			reader.readAsBinaryString(cartridge[1]);
		} else {
			saveStateArray = loadJson('/genone/roms/savestates/' + saveFileLoc);
			clearLastEmulation();
			gameboy = new GameBoyCore(mainCanvas, "");
			gameboy.savedStateFileName = saveFileLoc;
			gameboy.returnFromState(saveStateArray);
			run();
		};
	});
	addEvent("click", document.getElementById("yellow"), function() {
		gameFile = gameList[1];
		game = gameFile.split('.')[0];

		activeCart = document.getElementById("active-cart");
		activeCart.textContent = game;
		clicked = document.getElementById(game);
		clickedCode = clicked.getAttribute('value');
		saveFileLoc = clicked.getAttribute('name');

		console.log(clickedCode);
		if (clickedCode == game + "-new") {
			cartridge = loadNewFile('/genone/roms/' + gameFile);
			var reader = new FileReader();
			reader.addEventListener('load', function (e) {
				initPlayer();
				start(mainCanvas, e.target.result);
			});
			reader.readAsBinaryString(cartridge[1]);
		} else {
			saveStateArray = loadJson('/genone/roms/savestates/' + saveFileLoc);
			clearLastEmulation();
			gameboy = new GameBoyCore(mainCanvas, "");
			gameboy.savedStateFileName = saveFileLoc;
			gameboy.returnFromState(saveStateArray);
			run();
		};
	});
	addEvent("click", document.getElementById("red"), function() {
		gameFile = gameList[2];
		game = gameFile.split('.')[0];

		activeCart = document.getElementById("active-cart");
		activeCart.textContent = game;
		clicked = document.getElementById(game);
		clickedCode = clicked.getAttribute('value');
		saveFileLoc = clicked.getAttribute('name');

		console.log(clickedCode);
		if (clickedCode == game + "-new") {
			cartridge = loadNewFile('/genone/roms/' + gameFile);
			var reader = new FileReader();
			reader.addEventListener('load', function (e) {
				initPlayer();
				start(mainCanvas, e.target.result);
			});
			reader.readAsBinaryString(cartridge[1]);
		} else {
			saveStateArray = loadJson('/genone/roms/savestates/' + saveFileLoc);
			clearLastEmulation();
			gameboy = new GameBoyCore(mainCanvas, "");
			gameboy.savedStateFileName = saveFileLoc;
			gameboy.returnFromState(saveStateArray);
			run();
		};
	});
	addEvent("click", document.getElementById("green"), function() {
		gameFile = gameList[3];
		game = gameFile.split('.')[0];

		activeCart = document.getElementById("active-cart");
		activeCart.textContent = game;
		clicked = document.getElementById(game);
		clickedCode = clicked.getAttribute('value');
		saveFileLoc = clicked.getAttribute('name');

		console.log(clickedCode);
		if (clickedCode == game + "-new") {
			cartridge = loadNewFile('/genone/roms/' + gameFile);
			var reader = new FileReader();
			reader.addEventListener('load', function (e) {
				initPlayer();
				start(mainCanvas, e.target.result);
			});
			reader.readAsBinaryString(cartridge[1]);
		} else {
			saveStateArray = loadJson('/genone/roms/savestates/' + saveFileLoc);
			clearLastEmulation();
			gameboy = new GameBoyCore(mainCanvas, "");
			gameboy.savedStateFileName = saveFileLoc;
			gameboy.returnFromState(saveStateArray);
			run();
		};
	});
// 
	addEvent("click", document.getElementById("saver"), function() {
		var id = document.getElementById("current-user").textContent;
		var game = document.getElementById("active-cart").textContent;
		save(id=id, game=game);
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
	addEvent("click", document.getElementById("set_volume"), function () {
		if (GameBoyEmulatorInitialized()) {
			var volume = prompt("Set the volume here:", "1.0");
			if (volume != null && volume.length > 0) {
				settings[3] = Math.min(Math.max(parseFloat(volume), 0), 1);
				gameboy.changeVolume();
			}
		}
	});
	addEvent("click", document.getElementById("set_speed"), function () {
		if (GameBoyEmulatorInitialized()) {
			var speed = prompt("Set the emulator speed here:", "1.0");
			if (speed != null && speed.length > 0) {
				gameboy.setSpeed(Math.max(parseFloat(speed), 0.001));
			}
		}
	});

	addEvent("click", document.getElementById("enable_sound"), function () {
		settings[0] = document.getElementById("enable_sound").checked;
		if (GameBoyEmulatorInitialized()) {
			gameboy.initSound();
		}
	});
	addEvent("click", document.getElementById("disable_colors"), function () {
		settings[2] = document.getElementById("disable_colors").checked;
	});
	addEvent("click", document.getElementById("rom_only_override"), function () {
		settings[9] = document.getElementById("rom_only_override").checked;
	});
	addEvent("click", document.getElementById("mbc_enable_override"), function () {
		settings[10] = document.getElementById("mbc_enable_override").checked;
	});
	addEvent("click", document.getElementById("enable_gbc_bios"), function () {
		settings[1] = document.getElementById("enable_gbc_bios").checked;
	});
	addEvent("click", document.getElementById("enable_colorization"), function () {
		settings[4] = document.getElementById("enable_colorization").checked;
	});
	addEvent("click", document.getElementById("do_minimal"), function () {
		showAsMinimal = document.getElementById("do_minimal").checked;
		fullscreenCanvas.className = (showAsMinimal) ? "minimum" : "maximum";
	});
	addEvent("click", document.getElementById("software_resizing"), function () {
		settings[12] = document.getElementById("software_resizing").checked;
		if (GameBoyEmulatorInitialized()) {
			gameboy.initLCD();
		}
	});
	addEvent("click", document.getElementById("typed_arrays_disallow"), function () {
		settings[5] = document.getElementById("typed_arrays_disallow").checked;
	});
	addEvent("click", document.getElementById("gb_boot_rom_utilized"), function () {
		settings[11] = document.getElementById("gb_boot_rom_utilized").checked;
	});
	addEvent("click", document.getElementById("resize_smoothing"), function () {
		settings[13] = document.getElementById("resize_smoothing").checked;
		if (GameBoyEmulatorInitialized()) {
			gameboy.initLCD();
		}
	});
    addEvent("click", document.getElementById("channel1"), function () {
        settings[14][0] = document.getElementById("channel1").checked;
    });
    addEvent("click", document.getElementById("channel2"), function () {
        settings[14][1] = document.getElementById("channel2").checked;
    });
    addEvent("click", document.getElementById("channel3"), function () {
        settings[14][2] = document.getElementById("channel3").checked;
    });
    addEvent("click", document.getElementById("channel4"), function () {
        settings[14][3] = document.getElementById("channel4").checked;
    });
	addEvent("click", document.getElementById("view_fullscreen"), fullscreenPlayer);
	addEvent("mouseup", document.getElementById("gfx"), initNewCanvasSize);
	addEvent("resize", window, initNewCanvasSize);
	addEvent("unload", window, function () {
		autoSave();
	});
}
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
}
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
}
function initPlayer() {
	document.getElementById("logo").style.display = "none";
	document.getElementById("fullscreenContainer").style.display = "none";
}
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
}

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
}
function hasChildNodes(oElement) {
	return (typeof oElement.hasChildNodes == "function") ? oElement.hasChildNodes() : ((oElement.firstChild != null) ? true : false);
}
function isSameNode(oCheck1, oCheck2) {
	return (typeof oCheck1.isSameNode == "function") ? oCheck1.isSameNode(oCheck2) : (oCheck1 === oCheck2);
}
function pageXCoord(event) {
	if (typeof event.pageX == "undefined") {
		return event.clientX + document.documentElement.scrollLeft;
	}
	return event.pageX;
}
function pageYCoord(event) {
	if (typeof event.pageY == "undefined") {
		return event.clientY + document.documentElement.scrollTop;
	}
	return event.pageY;
}
function mouseLeaveVerify(oElement, event) {
	//Hook target element with onmouseout and use this function to verify onmouseleave.
	return isDescendantOf(oElement, (typeof event.target != "undefined") ? event.target : event.srcElement) && !isDescendantOf(oElement, (typeof event.relatedTarget != "undefined") ? event.relatedTarget : event.toElement);
}
function mouseEnterVerify(oElement, event) {
	//Hook target element with onmouseover and use this function to verify onmouseenter.
	return !isDescendantOf(oElement, (typeof event.target != "undefined") ? event.target : event.srcElement) && isDescendantOf(oElement, (typeof event.relatedTarget != "undefined") ? event.relatedTarget : event.fromElement);
}
function addEvent(sEvent, oElement, fListener) {
	try {	
		oElement.addEventListener(sEvent, fListener, false);
		// console.log("In addEvent() : Standard addEventListener() called to add a(n) \"" + sEvent + "\" event.", -1);
	}
	catch (error) {
		oElement.attachEvent("on" + sEvent, fListener);	//Pity for IE.
		// console.log("In addEvent() : Nonstandard attachEvent() called to add an \"on" + sEvent + "\" event.", -1);
	}
}
function removeEvent(sEvent, oElement, fListener) {
	try {	
		oElement.removeEventListener(sEvent, fListener, false);
		// console.log("In removeEvent() : Standard removeEventListener() called to remove a(n) \"" + sEvent + "\" event.", -1);
	}
	catch (error) {
		oElement.detachEvent("on" + sEvent, fListener);	//Pity for IE.
		// console.log("In removeEvent() : Nonstandard detachEvent() called to remove an \"on" + sEvent + "\" event.", -1);
	}
}


// new stuff
function loadNewFile(filepath) {
	var xhr = new XMLHttpRequest();
	const filename = filepath.split('/')[2];
	xhr.open("GET", filepath, true);
	xhr.responseType = 'blob';

	xhr.onreadystatechange = function() {
		if (this.status==200) {
			myBlob = new Blob([xhr.response]);
			myFile = new File([myBlob], filename, {
				type: myBlob.type
			});
		};
	};
	xhr.send();
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
}

function loadJson(filepath) {
	var xhr = new XMLHttpRequest();
	const filename = filepath.split('/')[2];
	xhr.open("GET", filepath, true);
	xhr.send();
	xhr.onreadystatechange = function() {
		if (this.status==200) {
			saveStateArray = JSON.parse(xhr.response);
		};
	};
	return saveStateArray;
};