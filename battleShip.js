"use strict";

const fieldSize = 10;
const freePlace = 0;
const aliveDeck = 1;
const wreckedDeck = 2;
const deadShipDeck = 3;
const alreadyShot = "*";
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

const printField = function (field) {
  //This function gets two-dimensional array 10x10 and print it with letters and raw id

  console.log();
  console.log();
  console.log("\x1b[36m%s\x1b[0m", `     A B C D E F G H J K`);
  console.log();
  for (let i = 0; i < fieldSize; i += 1) {
    if (i < fieldSize - 1) {
      console.log(`${i + 1}    ${field[i].join(" ")}`);
    } else {
      console.log(`${i + 1}   ${field[i].join(" ")}`);
    }
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

const isPlaceFree = function (shipData, field) {
  // This function gets coord genereted by generateShipData() and check that the chosen place is free from another ships
  // returns true or false

  const { x, y, shipDirection, numberOfSections } = shipData;
  console.log(x, y, shipDirection, numberOfSections);
  let isValid = true;
  if (shipDirection === "horizontal") {
    for (let i = x; i < x + numberOfSections; i += 1) {
      if (field[y][i] != 0) {
        isValid = false;
      }
    }
  } else if (shipDirection === "vertical") {
    for (let i = y; i < y + numberOfSections; i += 1) {
      if (field[i][x]) {
        isValid = false;
      }
    }
  }
  console.log(isValid);
  return isValid;
};

const placeShip = function (shipData, field) {
/* 
Takes object with ship data {x coord (int), y coord (int), direction (str), count of decks (int)}, 
two-dimensional array with actual status for each coord (int)
Returns new two-dimensional array with placed ship data
 */

  const fieldAfterPlacement = field;
  const { x, y, shipDirection, numberOfSections } = shipData;
  if (shipDirection === "horizontal") {
    for (let i = x; i < x + numberOfSections; i += 1) {
      fieldAfterPlacement[y][i] = aliveDeck;
    }
  } else if (shipDirection === "vertical") {
    for (let i = y; i < y + numberOfSections; i += 1) {
      fieldAfterPlacement[i][x] = aliveDeck;
    }
  }
  console.table(fieldAfterPlacement);
  return fieldAfterPlacement;
};

const placeAllShipsPC = function (field) {
/* 
Takes a two-dimensional array (int) 
filled with 0 Sets each ship in the fleet step by step from largest to smallest 
Returns a new two-dimensional array with spaced ships filled with 1
 */

  let fieldAfterPlacement = field;
  let count = 0;
  while (count < fleet.length) {
    const obj = generateShipData(fleet[count]);
    console.log(obj);
    if (isPlaceFree(obj, fieldAfterPlacement)) {
      console.log("iteration", count);
      fieldAfterPlacement = placeShip(obj, fieldAfterPlacement);
      count += 1;
    } else {
      continue;
    }
  }
  return fieldAfterPlacement;
};

let userField = initFreeField();
printField(userField);
userField = placeAllShipsPC(userField);
printField(userField);
