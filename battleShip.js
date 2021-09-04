"use strict";

const fieldSize = 10;
const freePlace = 0;
const aliveDeck = 1;
const wreckedDeck = 2;
const deadShipDeck = 3;
const alreadyShot = 4;
const fleet = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];
let player = {
  memory: {
    missedCoord: [],
    hits: [],
    target: [],
    countOfWreaked: 0,
    chain: false,
    isDirectionDefined: false,
    direction: "",
  },
  field: null,
  radar: null,
  score: null,
};
let js = {
  memory: {
    missedCoord: [],
    hits: [],
    target: [],
    countOfWreaked: 0,
    chain: false,
    isDirectionDefined: false,
    direction: "",
  },
  field: null,
  radar: null,
  score: null,
};

// Returns new arr[][] -> int filled by aliveDeck.
const initFreeField = function () {
  const arr = [];

  for (let i = 0; i < fieldSize; i += 1) {
    arr[i] = new Array();
    for (let j = 0; j < fieldSize; j += 1) {
      arr[i][j] = freePlace;
    }
  }

  return arr;
};

// Takes arr[][] and returns his copy.
const getFieldCopy = function (field) {
  const newField = [];

  for (let i = 0; i < fieldSize; i++) {
    let newRow = [];
    newField[i] = newRow;
    newField[i] = [...field[i]];
  }

  return newField;
};

/* 
  Takes user field and user radar like arr[][] -> int, arr[][] -> int. Copy them.
  Changes values(int) to symbols(str).
  Returns { arr[][] -> str, arr[][] -> str }.
 */
const changeSymbolsForPrint = function (radar, userField) {
  const radarUI = getFieldCopy(radar);
  const userUI = getFieldCopy(userField);

  for (let i = 0; i < fieldSize; i++) {
    for (let j = 0; j < fieldSize; j++) {
      switch (radarUI[i][j]) {
        case 0:
          radarUI[i][j] = "|_|";
          break;
        case 1:
          radarUI[i][j] = "|_|";
          break;
        case 2:
          radarUI[i][j] = "|+|";
          break;
        case 3:
          radarUI[i][j] = "|X|";
          break;
        case 4:
          radarUI[i][j] = "|*|";
      }

      switch (userUI[i][j]) {
        case 0:
          userUI[i][j] = "|_|";
          break;
        case 1:
          userUI[i][j] = "|#|";
          break;
        case 2:
          userUI[i][j] = "|+|";
          break;
        case 3:
          userUI[i][j] = "|X|";
          break;
        case 4:
          userUI[i][j] = "*";
      }
    }
  }

  return { radarUI, userUI };
};

// Takes user field and user radar like obj { arr[][] -> str, arr[][] -> str }. Print them.
const printUI = function (uiData) {
  let firstColum = null;
  let enemyRow = "";
  let userRow = "";
  const { radarUI, userUI } = uiData;
  const FieldTitle =
    "                 ENEMY FIELD                                     YOUR FIELD ";

  const letters =
    "     A   B   C   D   E   F   J   K   L   M           A   B   C   D   E   F   J   K   L   M";
  const border =
    "    _______________________________________         _______________________________________";

  console.log(FieldTitle);
  console.log("");
  console.log(letters);
  console.log(border);
  for (let i = 0; i < fieldSize; i++) {
    firstColum = `${i}\t`;
    enemyRow = radarUI[i].join(" ");
    userRow = userUI[i].join(" ");
    console.log(`${firstColum}${enemyRow}    ${firstColum}${userRow}`);
  }
  console.log(border);
};

/* 
  Takes number of sections for feature ship  -> int.
  Asks user to input coordinates. Checks if they are valid.
  Returns obj {x -> int, y -> int, shipDirection - > str, numberOfSections -> int}. 
*/
const enterCoordByUser = function (numberOfSections) {
  const regexpX = "ABCDEFJKLM";
  const regexpY = "0123456789";
  let x = null;
  let regExpIndexX = null;
  let y = null;
  let regExpIndexY = null;
  let shipDirection = "horizontal";
  let loopTrigger = true;

  while (loopTrigger) {
    console.log(`Setting up ${numberOfSections} deck ship...`);
    let str = prompt("Enter coords like a4");
    if (str === null || str.length != 2) {
      alert("Wrong coord. Try again");
      continue;
    }
    let strX = str[0];
    strX = strX.toUpperCase();
    regExpIndexX = regexpX.match(strX);

    if (regExpIndexX === null) {
      alert("Wrong first coord. Try again");
      continue;
    }
    x = regExpIndexX["index"];
    const parseY = str[1];
    regExpIndexY = regexpY.match(parseY);

    if (regExpIndexY === null) {
      alert("Wrong second coord. Try again!");
      continue;
    }
    y = regExpIndexY["index"];

    if (numberOfSections > 1) {
      let dir = confirm("OK - horizontal, Cancel - vertical");
      if (!dir) {
        shipDirection = "vertical";
      }
    }
    loopTrigger = false;
  }

  return { x, y, shipDirection, numberOfSections };
};

/* 
  Takes player`s field as arr[][] -> int and player`s radar as arr[][] ->
  Gets input from user -> str like 'a4' or 'e0' and cheks if they are valid.
  Places all player`s fleet. Updates UI when new ship is placed.
  Returns copy of player`s field with the fleet placed as arr[][] ->
 */
const setUpFleetManually = function (field, radar) {
  let fieldWithNewShips = getFieldCopy(field);
  let newRadar = getFieldCopy(radar);
  let count = 0;
  let ui = null;

  while (count < fleet.length) {
    ui = changeSymbolsForPrint(newRadar, fieldWithNewShips);
    console.clear();
    printUI(ui);
    let shipData = enterCoordByUser(fleet[count]);
    if (!isPlaceValid(shipData, fieldWithNewShips)) {
      alert("Wrong position! Try again!");
      continue;
    } else {
      fieldWithNewShips = setUpShip(shipData, fieldWithNewShips);
      count += 1;
      ui = changeSymbolsForPrint(newRadar, fieldWithNewShips);
      console.clear();
      printUI(ui);
    }
  }
  alert("You are redy to battle!");
  console.clear();

  return fieldWithNewShips;
};

/*  
  Takes the number of decks for a future ship (int), generates direction and coords for the new ship randomly.
  Does it given the direction so that the coordinates are valid for an empty field.
  Returns obj { x -> int, y -> int, shipDirection -> str, deckCount -> int } 
 */
const getRandomShipData = function (numberOfSections) {
  const directions = ["horizontal", "vertical"];
  const rand = Math.floor(Math.random() * directions.length);
  const shipDirection = directions[rand];
  let x = null;
  let y = null;

  if (shipDirection === "horizontal") {
    x = Math.floor(Math.random() * (fieldSize - (numberOfSections + 2)));
    y = Math.floor(Math.random() * fieldSize);
  } else if (shipDirection === "vertical") {
    x = Math.floor(Math.random() * fieldSize);
    y = Math.floor(Math.random() * (fieldSize - (numberOfSections + 2)));
  }

  return { x, y, shipDirection, numberOfSections };
};

/* 
  Takes ship data as obj { x -> int, y -> int, shipDirection -> str, numberOfSections -> int }
  Checks that the feature ship wont be out of boundaries
  Returns true if all ok and false if coordinates are not valid
 */
  const isShipInField = function ({ x, y, shipDirection, numberOfSections }) {
    switch (shipDirection) {
      case "horizontal":
        if (
          x > fieldSize - numberOfSections ||
          x < 0 ||
          y < 0 ||
          y > fieldSize - 1
        ) {
          return false;
        }
        return true;
  
      case "vertical":
        if (
          x < 0 ||
          x > fieldSize - 1 ||
          y < 0 ||
          y > fieldSize - numberOfSections
        ) {
          return false;
        }
        return true;
    }
  
    return -1;
  };

/* 
  Takes new ship data object {x -> int, y -> int, shiprDirection -> str, numberOfSections -> int}
  and field as arr[][] -> int. Accumulates all coords around new ship including ship`s coords
  Returns array[] -> int with coords. 
 */
const getShipCoordMatrix = function (shipData, field) {
  const { x, y, shipDirection, numberOfSections } = shipData;
  const arr = [];

  if (shipDirection === "horizontal") {
    for (let i = 0; i < numberOfSections + 2; i++) {
      for (let j = 0; j < 3; j++) {
        arr.push([x - 1 + i, y - 1 + j]);
      }
    }
    console.log('getShipCoordMatrix horizontal return arr: ', arr);
    return arr;
  } else if (shipDirection === "vertical") {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < numberOfSections + 2; j++) {
        arr.push([x - 1 + i, y - 1 + j]);
      }
    }
    console.log('getShipCoordMatrix vertical return arr: ', arr);
    return arr;
  }

  return -1;
};

/* 
  Takes coords around the ship including ship`s coords as arr[] -> int and
  Checks each coords. If coords in the range of field adds them to new arr[] -> int 
  Returns arr[] -> int with ship`s and sibling coords in the range of field
 */
const cutOutOfRangeCoords = function (arr) {
  const siblingCoordsInRange = [];

    for (let i = 0; i < arr.length; i++) {
        const [x, y] = arr[i];
        if (x >= 0 && x <= fieldSize - 1 && y >= 0 && y <= fieldSize - 1) {
          siblingCoordsInRange.push([x, y]);
        }
      }

  return siblingCoordsInRange;
};

/* 
  Takes ship data as obj { x -> int, y -> int, shipDirection -> str, numberOfSections -> int }
  and field as arr[][] -> int. Checks that coords around future ship are free and that the coords in range of field
  Returns true if all ok and false if coordinates are not valid to place ship
 */
const isPlaceValid = function (shipData, field) {
  if (!isShipInField(shipData)) {
    return false;
  }
  const siblingCoords = getShipCoordMatrix(shipData, field);
  const siblingCoordsInRange = cutOutOfRangeCoords(siblingCoords);

  for (let i = 0; i < siblingCoordsInRange.length; i++) {
    console.log(siblingCoords[i]);
    const [x, y] = siblingCoordsInRange[i];
    if (field[y][x] != freePlace) {
      return false;
    }
  }

  return true;
};

/* 
  Takes ship data obj {x -> int, y -> int, shipDirection -> str, numberOfSections -> int},
  takes field as arr[][] -> int. Copy field. Sets up new ship filling coords with alivedeck -> int
  Return new field arr[][] -> int with the ship ready
 */
const setUpShip = function (shipData, field) {
  const fieldWithNewShip = getFieldCopy(field);
  const { x, y, shipDirection, numberOfSections } = shipData;

  if (shipDirection === "horizontal") {
    for (let i = x; i < x + numberOfSections; i += 1) {
      fieldWithNewShip[y][i] = aliveDeck;
    }
  } else if (shipDirection === "vertical") {
    for (let i = y; i < y + numberOfSections; i += 1) {
      fieldWithNewShip[i][x] = aliveDeck;
    }
  }

  return fieldWithNewShip;
};

/* 
  Takes the free field as arr[][] -> int. Copy him.
  Placing the fleet on the field step by step from largest to smallest
  Returns a new field with placed fleet as arr[][] -> int 
  */
const setUpFleetAuto = function (field) {
  let fieldWithNewShips = field;
  let count = 0;

  while (count < fleet.length) {
    const shipData = getRandomShipData(fleet[count]);
    if (!isPlaceValid(shipData, fieldWithNewShips)) {
      continue;
    } else {
      fieldWithNewShips = setUpShip(shipData, fieldWithNewShips);
      count += 1;
    }
    console.clear();
  }

  return fieldWithNewShips;
};

// Takes player data obj and filling properties with starting data
const initPlayer = function (player) {
  const copyPlayer = { ...player };

  copyPlayer.field = initFreeField();
  copyPlayer.radar = initFreeField();
  copyPlayer.score = fleet.reduce((total, number) => total + number);

  return copyPlayer;
};

// Takes js data obj and filling properties with starting data
const initJs = function (js) {
  const copyJs = { ...js };

  copyJs.field = initFreeField();
  copyJs.radar = initFreeField();
  copyJs.score = fleet.reduce((total, number) => total + number);

  return copyJs;
};

const main = function () {
  player = initPlayer(player);
  console.log(player.score);
  js = initJs(js);
  let uiData = changeSymbolsForPrint(player.radar, player.field);
  alert("BEGIN!");
  if (confirm("Do you want to setup fleet manually?")) {
    player.field = setUpFleetManually(player.field, player.radar);
  } else {
    player.field = setUpFleetAuto(player.field);
  }

  uiData = changeSymbolsForPrint(player.radar, player.field);
  printUI(uiData);
};
console.log("Loading...");
setTimeout(function () {
  main();
}, 5000);
