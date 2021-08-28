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

const isShipNearBorder = function (shipData, field) {
  const { x, y, shipDirection, numberOfSections } = shipData;
  const lastSectionCoordX = x + numberOfSections;
  const lastSectionCoordY = y + numberOfSections;

  if (shipDirection === "horizontal") {
    if (x === 0 || y === 0 || lastSectionCoordX === fieldSize - 1 || y === 9) {
      console.log("adjacent to the edge of the field");
      return true;
    } else {
      console.log("don't adjacent to the edge of the field");
      return false;
    }
  } else if (shipDirection === "vertical") {
    if (x === 0 || y === 0 || lastSectionCoordY === fieldSize - 1 || x === 9) {
      console.log("adjacent to the edge of the field");
      return true;
    } else {
      console.log("don't adjacent to the edge of the field");
      return false;
    }
  }
};

const isCrossedWithOther = function (shipData, field) {
  const { x, y, shipDirection, numberOfSections } = shipData;
  const lastSectionCoordX = x + numberOfSections;
  const lastSectionCoordY = y + numberOfSections;
  const startBoundaryCoordX = x - 1;
  const finishBoundaryCoordX = lastSectionCoordX + 1;
  const startBoundaryCoordY = y - 1;
  const finishBoundaryCoordY = lastSectionCoordY + 1;

  if (isShipNearBorder(shipData, field)) {
    console.log("Near border. Need another algorithm");
  } else {
    if (shipDirection === "horizontal") {
      for (let i = startBoundaryCoordX; i < finishBoundaryCoordX + 1; i += 1) {
        if (field[y - 1][i] != 0 || field[y + 1][i] != 0 || field[y][i] != 0) {
          console.log("CROSS");
          return true;
        } else {
          return false;
        }
      }
    } else if (shipDirection === "vertical") {
      for (let i = startBoundaryCoordY; i < finishBoundaryCoordY + 1; i += 1) {
        if (field[i][x - 1] != 0 || field[i][x + 1] != 0 || field[i][x] != 0) {
          console.log("CROSS");
          return true;
        } else {
          return false;
        }
      }
    }
  }
};

const checkBlocksAround = function (shipData, field) {
  const { x, y, shipDirection, numberOfSections } = shipData;
  let leftFromX = x;
  let rigthFromX = x;
  let topFromY = y;
  let bottomFromY = y;
  if (shipDirection === "horizontal") {
    if (isShipNearBorder(shipData, field)) {
    } else {
      leftFromX = x - 1;
      rigthFromX = x + 2 + numberOfSections;
      topFromY = y - 1;
      bottomFromY = y + 2;
      for (let i = leftFromX; i < rigthFromX; i++) {
        for (let j = topFromY; j < bottomFromY; j++) {
          if (field[i][j] != 0) {
            console.log("There is the ship neaer here");
            return false;
          }
        }
      }
    }
  } else if (shipDirection === "vertical") {
    if (isShipNearBorder(shipData, field)) {
    } else {
      leftFromX = x - 1;
      rigthFromX = x + 2;
      topFromY = y - 1;
      bottomFromY = y + 2 + numberOfSections;
      for (let i = leftFromX; i < rigthFromX; i++) {
        for (let j = topFromY; j < bottomFromY; j++) {
          if (field[i][j] != 0) {
            console.log("There is the ship neaer here");
            return false;
          }
        }
      }
    }
  }
};
const placeShip = function (shipData, field) {
  /* 
Takes object with ship data {x coord (int), y coord (int), direction (str), count of decks (int)}, 
two-dimensional array with actual status for each coord (int)
Returns new two-dimensional array with placed ship data
 */

  const fieldWithNewShip = field;
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
  console.table(fieldWithNewShip);
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
    if (isPlaceFree(shipData, fieldWithNewShips)) {
      console.log("iteration", count);
      if (
        isCrossedWithOther(shipData, fieldWithNewShips) &&
        checkBlocksAround(shipData, fieldWithNewShips)
      ) {
        continue;
      }
      fieldWithNewShips = placeShip(shipData, fieldWithNewShips);
      count += 1;
    } else {
      continue;
    }
  }
  return fieldWithNewShips;
};

let userField = initFreeField();
printField(userField);
userField = placeAllShipsPC(userField);
printField(userField);
