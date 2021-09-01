"use strict";

const fieldSize = 10;
const freePlace = 0;
const aliveDeck = 1;
const wreckedDeck = 2;
const deadShipDeck = 3;
const alreadyShot = 4;
const fleet = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];

const initFreeField = function () {
  //This function  returns initialized two-dimensional array 10x10 filled with 0 (int)

  const arr = [];
  for (let i = 0; i < fieldSize; i += 1) {
    arr[i] = new Array();
    for (let j = 0; j < fieldSize; j += 1) {
      arr[i][j] = freePlace;
    }
  }
  return arr;
};

const fieldCopy = function(field){
  const newField = [];
  for(let i = 0; i < fieldSize; i ++){
    newField[i] = new Array();
    for(let j = 0; j < fieldSize; j++){
      newField[i][j] = field[i][j];
    }
  }
  return newField;
}

const changeSymbolsForPrind = function (radar, userField) {
  const radarUI = fieldCopy(radar);
  const userUI = fieldCopy(userField);
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

const getFleetSetUpManual = function (field, radar) {
  let fieldWithNewShips = fieldCopy(field);
  let newRadar = fieldCopy(radar);
  const regexpStrX = "ABCDEFJKLM";
  const regexpY = "0123456789";
  const regexDir = "01";
  const direction = ["horizontal", "vertical"];
  let count = 0;
  let ui = changeSymbolsForPrind(newRadar, fieldWithNewShips);


  while (count < fleet.length) {
    console.log("");
    printUI(ui);
    let x = prompt("Enter coord X: (letter from A to M)");
    x = x.toUpperCase();
    const xData = regexpStrX.match(x);
    x = xData.index;

    if (x === null) {
      alert("Please Enter letter from A to M!");
      continue;
    }

    let y = prompt("Enter coord Y (digit from 0 to 9):");
    const yData = regexpY.match(y);
    y = yData.index;
    if (y === null) {
      console.log("Please Enter digit from 0 to 9!");
      continue;
    }

    let dir = prompt("Please, choose direction: 0 - horizontal, 1 - vertical");
    dir = regexDir.match(dir);
    if (dir === null) {
      console.log("Please choose 0 or 1 only!");
    }
    const shipDirection = direction[dir];

    let shipData = {
      "x": x,
      "y": y,
      "shipDirection": shipDirection,
      "numberOfSections": fleet[count],
    };
    console.log("shipData before sending", shipData);
    if(!isPlaceValid(shipData, fieldWithNewShips)) {
      alert('Wrong position! Try again!');
      console.clear();
      continue;
      
    } else {
      fieldWithNewShips = getShipSetUp(shipData, fieldWithNewShips);
      count += 1;
      ui = changeSymbolsForPrind(newRadar, fieldWithNewShips);
    }
    console.clear();
  }
};

const generateShipData = function (numberOfSections) {
  /* 
  Takes the number of decks for a future ship (int), generates direction and coords for the new ship randomly
  and does it given the direction so that the coordinates are valid for an empty field. 
  returns them in object { x (int), y(int), shipDirection (str) deckCount(int) } 
  */

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

const getShipCoordMatrix = function (shipData, field) {
  /*  
  Takes new ship data object {x -> int, y -> int, shiprDirection -> str, numberOfSections -> int}
  Accumulates all coords around new ship including ship`s coords
   Returns array of int with coords. Size of rows and colums depends on the direction of the ship.
    [
      [[-1, 0]],[1, 0],[2, 0]]
      [[1, 0]],[2, 0],[3, 0]]
      [[2, 0]],[3, 0],[4, 0]]                  
    ] 
  */
  const { x, y, shipDirection, numberOfSections } = shipData;
  const arr = [];
  if (shipDirection === "horizontal") {
    for (let i = 0; i < numberOfSections + 2; i++) {
      arr[i] = new Array();
      for (let j = 0; j < 3; j++) {
        arr[i].push([x - 1 + i, y - 1 + j]);
      }
    }
    return arr;
  } else if (shipDirection === "vertical") {
    for (let i = 0; i < 3; i++) {
      arr[i] = new Array();
      for (let j = 0; j < numberOfSections + 2; j++) {
        arr[i].push([x - 1 + i, y - 1 + j]);
      }
    }
    return arr;
  }
};

const cutOutOfRangeCoords = function (arr, shipData) {
  const { x, y, shipDirection, numberOfSections } = shipData;
  const temp = [];

  if (shipDirection === "horizontal") {
    let coord = [];
    for (let i = 0; i < numberOfSections + 2; i++) {
      for (let j = 0; j < 3; j++) {
        const [x_, y_] = arr[i][j];
        if (x_ >= 0 && x_ <= fieldSize - 1 && y_ >= 0 && y_ <= fieldSize - 1) {
          temp.push(arr[i][j]);
        }
      }
    }
  } else if (shipDirection === "vertical") {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < numberOfSections + 2; j++) {
        const [x_, y_] = arr[i][j];
        if (x_ >= 0 && x_ <= fieldSize - 1 && y_ >= 0 && y_ <= fieldSize - 1) {
          temp.push(arr[i][j]);
        }
      }
    }
  }
  return temp;
};

const isPlaceValid = function (shipData, field) {
  const coordsBefore = getShipCoordMatrix(shipData, field);
  const cleanCoords = cutOutOfRangeCoords(coordsBefore, shipData);
  for (let i = 0; i < cleanCoords.length; i++) {
    const [x, y] = cleanCoords[i];
    if (field[y][x] != 0) {
      return false;
    }
  }
  return true;
};

const getShipSetUp = function (shipData, field) {
  /* 
Takes object with ship data {x coord (int), y coord (int), direction (str), count of decks (int)}, 
two-dimensional array with actual status for each coord (int)
Returns new two-dimensional array with placed ship data
 */

  const fieldWithNewShip = fieldCopy(field);
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

const placeAllShipsPC = function (field) {
  /* 
Takes a two-dimensional array (int) 
filled with 0 Sets each ship in the fleet step by step from largest to smallest 
Returns a new two-dimensional array with spaced ships filled with 1
 */

  let fieldWithNewShips = field;
  let count = 0;
  while (count < fleet.length) {
    const shipData = generateShipData(fleet[count]);
    console.log(shipData);
    if (!isPlaceValid(shipData, fieldWithNewShips)) {
      console.log("NOT OK");
      continue;
    } else {
      fieldWithNewShips = getShipSetUp(shipData, fieldWithNewShips);
      console.log("OK");
      count += 1;
    }
    console.clear();
  }
  return fieldWithNewShips;
};

let userField = initFreeField();
let userMap = initFreeField();
userField = getFleetSetUpManual(userField, userMap);
