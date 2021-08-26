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

const printField2 = function (field) {
  let arr = [];
  console.log();
  console.log();
  console.log("\x1b[36m%s\x1b[0m", `     A B C D E F G H J K`);
  console.log();
  for (let i = 0; i < fieldSize; i += 1) {
    for (let j = 0; j < fieldSize; j += 1) {
      arr.push(field[i][j]);
    }
    console.log(`     ${arr.join(" ")}`);
    arr = [];
  }
};

const generateShipData = function (deckCount) {
  /* This function gets deckCount(int) generates direction and coords for a new ship randomly
  and does it given the direction so that the coordinates are valid for an empty field. returns them in object {x, y, deckCount} */

  const directions = ["horizontal", "vertical"];
  const rand = Math.floor(Math.random() * directions.length);
  const shipDirection = directions[rand];
  let x = null;
  let y = null;
  if (shipDirection === "horizontal") {
    x = Math.floor(Math.random() * (fieldSize - (deckCount + 2)));
    y = Math.floor(Math.random() * fieldSize);
  } else if (shipDirection === "vertical") {
    x = Math.floor(Math.random() * fieldSize);
    y = Math.floor(Math.random() * (fieldSize - (deckCount + 2)));
  }
  return { x, y, shipDirection, deckCount };
};

const isPlaceFree = function (shipData, field) {
  // This function gets coord genereted by generateShipData() and check that the chosen place is free from another ships
  // returns true or false

  const { x, y, shipDirection, deckCount } = shipData;
  console.log(x, y, shipDirection, deckCount);
  let isValid = true;
  if (shipDirection === "horizontal") {
    for (let i = x; i < x + deckCount; i += 1) {
      if (field[y][i] != 0) {
        isValid = false;
      }
    }
  } else if (shipDirection === "vertical") {
    for (let i = y; i < y + deckCount; i += 1) {
      if (field[i][x]) {
        isValid = false;
      }
    }
  }
  console.log(isValid);
  return isValid;
};

const placeShip = function (shipData, field) {
  const fieldAfterPlacement = field;
  const { x, y, shipDirection, deckCount } = shipData;
  //console.log(x, y, shipDirection, deckCount);
  if (shipDirection === "horizontal") {
    for (let i = x; i < x + deckCount; i += 1) {
      fieldAfterPlacement[y][i] = aliveDeck;
    }
  } else if (shipDirection === "vertical") {
    for (let i = y; i < y + deckCount; i += 1) {
      fieldAfterPlacement[i][x] = aliveDeck;
    }
  }
  console.table(fieldAfterPlacement);
  return fieldAfterPlacement;
};

const placeAllShipsPC = function (field) {
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
/* const shipData = generateShipData(4);
console.log(isPlaceFree(shipData, userField));
userField = placeShip(shipData, userField); */
userField = placeAllShipsPC(userField);
printField(userField);
//printField2(userField);
