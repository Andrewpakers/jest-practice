/* eslint-disable no-plusplus */
/**
 * Creates ship object
 * @param {number} tempLength - length
 * @param {array} tempCoord - starting coordinates
 * @param {string} tempDirection - left, right, up, or down
 * @return {object} - returns ship object
 */
const shipFactory = (tempLength, tempCoord, tempDirection) => {
  const length = tempLength;
  const coordinates = [tempCoord];
  const direction = tempDirection;
  const hits = [];
  let sunk = false;

  for (let i = 1; i < length; i++) {
    const x = coordinates[0][0];
    const y = coordinates[0][1];

    if (direction === 'right') {
      coordinates.push([x + i, y]);
    } else if (direction === 'left') {
      coordinates.push([x - i, y]);
    } else if (direction === 'up') {
      coordinates.push([x, y + i]);
    } else if (direction === 'down') {
      coordinates.push([x, y - i]);
    }
  }
  return {
    /**
     * Determines if ship and sunk
     * @return {boolean} - returns true is ship is sunk,
     * fals if it is not
     */
    isSunk() {
      if (hits.length === coordinates.length) {
        sunk = true;
      }
      return sunk;
    },
    /**
     * Returns ship coordinates
     * @return {array} - returns ship coordinates
     */
    getCoord() {
      return coordinates;
    },
    /**
     * Determines if the provided coordinate is a hit,
     * and registers the hit
     * @param {array} coord - Coordinates of the hit.
     * If no argument is provided, adds the next hit
     * @return {number|string|null} - returns number of hits left,
     * null if coordinate has already been hit,
     * or 'no hit' if coordinate not in coordinates
     */
    hit(coord = 'unspecified') {
      // if hit is unspecified, add next hit
      if (coord === 'unspecified') {
        for (let i = 0; i < coordinates.length; i++) {
          if (hits.includes(coordinates[i]) === false) {
            if (this.isSunk() === false) {
              hits.push(coordinates[i]);
            }
            break;
          }
        }
        this.isSunk();
        return coordinates.length - hits.length;
      }

      // if coord does not hit boat, return 'no hit'
      let wasHit = false;
      for (let i = 0; i < coordinates.length; i++) {
        if (coordinates[i].toString() === coord.toString()) {
          wasHit = true;
        }
      }
      if (!wasHit) {
        return 'no hit';
      }

      // if coord has already been hit, return null
      let alreadyHit = false;
      for (let i = 0; i < hits.length; i++) {
        if (hits[i].toString() === coord.toString()) {
          alreadyHit = true;
        }
      }
      if (alreadyHit) {
        return null;
      }

      hits.push(coord);
      this.isSunk();
      return coordinates.length - hits.length;
    },
  };
};

/**
 * Creates gameboard object
 * @return {object} - gameboard object
 */
const gameboardFactory = () => {
  const ships = [];
  const shipCoordinates = [];
  const hits = [];
  const misses = [];

  /**
   * Creates random coordinates on the gameboard
   * @return {array} - returns random coordinates
   */
  function randomCoord() {
    return [Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)];
  }
  /**
   * Generate random direction
   * @return {string} - return random direction
   */
  function randomDirection() {
    let direction = '';
    const randomNumber = Math.floor(Math.random() * 4);
    if (randomNumber < 1) {
      direction = 'right';
    } else if (randomNumber < 2) {
      direction = 'left';
    } else if (randomNumber < 3) {
      direction = 'up';
    } else {
      direction = 'down';
    }
    return direction;
  }

  return {
    /**
     * Creates a ship on the gameboard
     * @param {number} length - length
     * @param {array} coordinates length starting coordinates
     * @param {string} direction - left, right, up, or down
     * @return {boolean} - returns true if it is a valid ship placement,
     * false if it is not.
     */
    placeShip(length, coordinates, direction) {
      const newShip = shipFactory(length, coordinates, direction);
      // test if newship overlaps existing ship
      let isValid = true;
      const newShipCoords = newShip.getCoord();
      for (let i = 0; i < newShipCoords.length; i++) {
        for (let j = 0; j < shipCoordinates.length; j++) {
          if (shipCoordinates[j].toString() === newShipCoords[i].toString()) {
            isValid = false;
          }
        }
      }
      // test if ship goes off the board
      newShipCoords.forEach((coord) => {
        if (coord[0] < 0 || coord[0] > 9 || coord[1] < 0 || coord[1] > 9) {
          isValid = false;
        }
      });
      // if ship is valid, commit it
      if (isValid) {
        ships.push(newShip);
        shipCoordinates.push(...newShip.getCoord());
        return true;
      }
      return false;
    },
    /**
     * Returns an array of all ship objects on the gameboard
     * @return {array} - returns array of ship objects
     */
    getShipObjects() {
      return ships;
    },
    /**
     * Returns all coordinates that are part of a ship
     * @return {array} - returns all ship coordinates
     */
    getShipCoords() {
      return shipCoordinates;
    },
    /**
     * Returns if the gameboard is in a lost state
     * @return {boolean} - return if gameboard has lost
     */
    hasLost() {
      let allShipsSunk = true;
      ships.forEach((ship) => {
        if (!ship.isSunk()) {
          allShipsSunk = false;
        }
      });
      if (allShipsSunk) {
        return true;
      }
      return false;
    },
    /**
     * Receives an attack
     * @param {array} coord - coordinate of attack
     * @return {array} - returns the coordinate of the attack
     * and if it was a hit or miss
     */
    receiveAttack(coord) {
      let wasHit = false;
      ships.forEach((ship) => {
        const result = ship.hit(coord);
        // test if hit lands
        if (result !== null && result !== 'no hit') {
          wasHit = true;
          hits.push(coord);
          this.hasLost();
        }
      });
      if (!wasHit) {
        misses.push(coord);
        return [coord, 'miss'];
      }
      return [coord, 'hit'];
    },
    /**
     * Returns all hits on this gameboard
     * @return {array} - returns all hits
     */
    getHits() {
      return hits;
    },
    /**
     * Returns all misses on this gameboard
     * @return {array} - returns all misses
     */
    getMisses() {
      return misses;
    },
    /**
     * Returns boardstate in a string
     * @return {string} - returns boardstate represented in a string
     * - is an empty space
     * S is a ship coordinate
     * X is a hit coordinate
     * M is a miss coordinate
     */
    printShips() {
      const shipString = `[${shipCoordinates.join('],[')}]`;
      const hitString = `[${hits.join('],[')}]`;
      const missString = `[${misses.join('],[')}]`;
      let shipMatrix = '     A  B  C  D  E  F  G  H  I  J\n';
      for (let y = 0; y < 10; y++) {
        let consoleRowString = '';
        for (let x = 0; x < 10; x++) {
          if (shipString.includes(`[${x},${y}]`)) {
            if (hitString.includes(`[${x},${y}]`)) {
              consoleRowString += ' X ';
            } else {
              consoleRowString += ' S ';
            }
          } else if (missString.includes(`[${x},${y}]`)) {
            consoleRowString += ' M ';
          } else {
            consoleRowString += ' - ';
          }
        }
        if (y === 9) {
          shipMatrix += `${y + 1}: ${consoleRowString}\n`;
        } else {
          shipMatrix += ` ${y + 1}: ${consoleRowString}\n`;
        }
      }
      return shipMatrix;
    },
    /**
     * Places 10 ships randomly on the board
     * @return {string} - returns if the operation was successful
     * or a failure
     */
    placeShipsRandomly() {
      for (let i = 0; i < 10; i++) {
        if (i < 4) {
          // place 1x1 ship in a random location
          // checks to see if place was successful
          while (!this.placeShip(1, randomCoord(), randomDirection())) {
            continue;
          }
        } else if (i < 7) {
          while (!this.placeShip(2, randomCoord(), randomDirection())) {
            continue;
          }
        } else if (i < 9) {
          while (!this.placeShip(3, randomCoord(), randomDirection())) {
            continue;
          }
        } else {
          while (!this.placeShip(4, randomCoord(), randomDirection())) {
            continue;
          }
        }
      }
      // Check if ships were placed successfully and return result
      if (ships.length === 10) {
        return 'success';
      }
      return 'failure';
    },
  };
};
/**
 * Creates player object
 * @return {object} - returns player object
 */
const playerFactory = () => {
  const gameboard = gameboardFactory();
  const allMoves = [];
  const movesThatHit = [];
  const movesThatMissed = [];
  let gameInterface;
  return {
    /**
     * Creates a move from this player
     * @param {array} coord - coordinate of move
     * @return {array|string} - returns coordinates of the move
     * or 'error' if the player has already made move
     */
    makeMove(coord) {
      if (coord === undefined) {
        const x = Math.floor(Math.random() * 10);
        const y = Math.floor(Math.random() * 10);
        return this.makeMove([x, y]);
      }
      // determine if player has already made move
      const moveString = `[${allMoves.join('],[')}]`;
      if (moveString.includes(`[${coord.toString()}]`)) {
        gameInterface.moves.pub('error', this);
        return 'error';
      }
      allMoves.push(coord);
      // replace with interface call when it is built
      if (gameInterface) {
        gameInterface.moves.pub(coord, this);
      }
      return coord;
    },
    /**
     * Places ship on player's gameboard
     * @param {number} length - length
     * @param {array} coords - starting coordinate
     * @param {string} direction - direction
     * @return {boolean} - returns true if valid placement
     * false if not
     */
    placeShip(length, coords, direction) {
      return gameboard.placeShip(length, coords, direction);
    },
    /**
     * Returns all coordinates that are part of a ship on player's gameboard
     * @return {array} - returns all ship coordinates
     */
    getShipCoords() {
      return gameboard.getShipCoords();
    },
    /**
     * Returns an array of all ship objects on the player's gameboard
     * @return {array} - returns array of ship objects
     */
    getShipObjects() {
      return gameboard.getShipObjects();
    },
    /**
     * Places 10 ships randomly on the player's board
     * @return {string} - returns if the operation was successful
     * or a failure
     */
    placeShipsRandomly() {
      return gameboard.placeShipsRandomly();
    },
    /**
     * Returns player's boardstate in a string
     * @return {string} - returns boardstate represented in a string
     * - is an empty space
     * S is a ship coordinate
     * X is a hit coordinate
     * M is a miss coordinate
     */
    printShips() {
      return gameboard.printShips();
    },
    /**
     * Receives an attack
     * @param {array} coord - coordinate of attack
     * @param {object} attackingPlayer - player being attacked
     * @return {array} - returns the coordinate of the attack
     * and if it was a hit or miss
     */
    receiveAttack(coord, attackingPlayer = null) {
      if (attackingPlayer !== this) {
        const hit = gameboard.receiveAttack(coord);
        if (hit[1] === 'hit') {
          if (gameInterface) {
            gameInterface.hits.pub(hit[0], this);
            this.hasLost();
          }
        } else if (hit[1] === 'miss') {
          if (gameInterface) {
            gameInterface.misses.pub(hit[0], this);
          }
        }
        return hit;
      }
      return null;
    },
    /**
     * Returns all hits on this player's gameboard
     * @return {array} - returns all hits
     */
    getHits() {
      return gameboard.getHits();
    },
    /**
     * Returns all misses on this player's gameboard
     * @return {array} - returns all misses
     */
    getMisses() {
      return gameboard.getMisses();
    },
    /**
     * Notifies player if their move was a hit
     * @param {array} coord - coordinate of hit
     * @param {object} player - which player was hit
     * @return {string} - returns 'success'
     */
    notifyHit(coord, player = this) {
      if (player !== this) {
        movesThatHit.push(coord);
      }
      return 'success';
    },
    /**
     * Notifies player if their move was a miss
     * @param {array} coord - coordinate of miss
     * @param {object} player - the player who was missed on
     * @return {string} - returns 'success'
     */
    notifyMiss(coord, player = this) {
      if (player !== this) {
        movesThatMissed.push(coord);
      }
      return 'success';
    },
    /**
     * Returns all moves made that resulted in a hit
     * @return {array} - all moves made that hit
     */
    movesThatHit() {
      return movesThatHit;
    },
    /**
     * Returns all moves made that resulted in a miss
     * @return {array} - all moves that missed
     */
    movesThatMissed() {
      return movesThatMissed;
    },
    /**
     * Determines if player has lost
     * @return {boolean} - returns true if player lost
     * false if not
     */
    hasLost() {
      const hasPlayerLost = gameboard.hasLost();
      if (hasPlayerLost) {
        if (gameInterface) {
          gameInterface.losses.pub(this);
          return gameboard.hasLost();
        }
      }
      return gameboard.hasLost();
    },
    configureInterface(pubsub) {
      gameInterface = pubsub;
      gameInterface.hits.sub(this.notifyHit.bind(this));
      gameInterface.misses.sub(this.notifyMiss.bind(this));
      gameInterface.moves.sub(this.receiveAttack.bind(this));
    },
  };
};
/**
 * Handles all comms between players for hits, misses, loss
 * in a pub/sub format
 */
const gameInterface = (() => ({
  reset() {
    this.hits.reset();
    this.misses.reset();
    this.moves.reset();
    this.losses.reset();
  },
  hits: {
    subscribers: [],
    reset() {
      this.subscribers = [];
    },
    pub(hit, player) {
      this.subscribers.forEach((subscriber) => {
        subscriber(hit, player);
      });
    },
    sub(callback) {
      this.subscribers.push(callback);
    },
  },
  misses: {
    subscribers: [],
    reset() {
      this.subscribers = [];
    },
    pub(miss, player) {
      this.subscribers.forEach((subscriber) => {
        subscriber(miss, player);
      });
    },
    sub(callback) {
      this.subscribers.push(callback);
    },
  },
  moves: {
    subscribers: [],
    reset() {
      this.subscribers = [];
    },
    pub(hit, attackingPlayer) {
      this.subscribers.forEach((subscriber) => {
        subscriber(hit, attackingPlayer);
      });
    },
    sub(callback) {
      this.subscribers.push(callback);
    },
  },
  losses: {
    subscribers: [],
    reset() {
      this.subscribers = [];
    },
    pub(player) {
      this.subscribers.forEach((subscriber) => {
        subscriber(player);
      });
    },
    sub(callback) {
      this.subscribers.push(callback);
    },
  },
}))();

const displayController = (() => {
  const player1Squares = document.querySelectorAll('.player1>.row>.square');
  const player2Squares = document.querySelectorAll('.player2>.row>.square');
  return {
    updateShips(shipCoords) {
      const shipCoordsString = `[${shipCoords.join('],[')}]`;
      player1Squares.forEach((square) => {
        const squareX = square.dataset.x;
        const squareY = square.dataset.y;
        if (shipCoordsString.includes(`[${squareX},${squareY}]`)) {
          square.classList.add('boat');
        }
      });
    },
    showPlayer2Ships(coords) {
      const coordsString = `[${coords.join('],[')}]`;
      player2Squares.forEach((square) => {
        const squareX = square.dataset.x;
        const squareY = square.dataset.y;
        if (coordsString.includes(`[${squareX},${squareY}]`)) {
          square.classList.add('boat');
        }
      });
    },
    updatePlayer1Hits(coords) {
      const coordsString = `[${coords.join('],[')}]`;
      player1Squares.forEach((square) => {
        const squareX = square.dataset.x;
        const squareY = square.dataset.y;
        if (coordsString.includes(`[${squareX},${squareY}]`)) {
          square.classList.add('hit');
        }
      });
    },
    updatePlayer1Misses(coords) {
      const coordsString = `[${coords.join('],[')}]`;
      player1Squares.forEach((square) => {
        const squareX = square.dataset.x;
        const squareY = square.dataset.y;
        if (coordsString.includes(`[${squareX},${squareY}]`)) {
          square.classList.add('miss');
        }
      });
    },
    updateHitsOnPlayer2(coords) {
      const coordsString = `[${coords.join('],[')}]`;
      player2Squares.forEach((square) => {
        const squareX = square.dataset.x;
        const squareY = square.dataset.y;
        if (coordsString.includes(`[${squareX},${squareY}]`)) {
          square.classList.add('hit');
        }
      });
    },
    updateMissesOnPlayer2(coords) {
      const coordsString = `[${coords.join('],[')}]`;
      player2Squares.forEach((square) => {
        const squareX = square.dataset.x;
        const squareY = square.dataset.y;
        if (coordsString.includes(`[${squareX},${squareY}]`)) {
          square.classList.add('miss');
        }
      });
    },
    declareWinner(text) {
      const winnerBox = document.querySelector('.winnerBox');
      winnerBox.textContent = text;
      winnerBox.classList.remove('hidden');
    },
  };
})();

/**
 * const moveString = `[${allMoves.join('],[')}]`;
      if (moveString.includes(`[${coord.toString()}]`)) {
        gameInterface.moves.pub('error', this);
        return 'error';
      }
 */

const gameManager = (() => {
  let player1 = playerFactory();
  let player2 = playerFactory();
  player1.configureInterface(gameInterface);
  player2.configureInterface(gameInterface);
  let losingPlayer = null;
  const hasLost = (player) => {
    losingPlayer = player;
    if (player === player1) {
      buttonManager.disableButtons();
      displayController.declareWinner('Player 2 wins!');
    } else {
      buttonManager.disableButtons();
      displayController.declareWinner('Player 1 wins!');
    }
  };
  const updateBoardMoves = () => {
    displayController.updateShips(player1.getShipCoords());
    // displayController.showPlayer2Ships(player2.getShipCoords());
    displayController.updatePlayer1Hits(player1.getHits());
    displayController.updatePlayer1Misses(player1.getMisses());
    displayController.updateHitsOnPlayer2(player1.movesThatHit());
    displayController.updateMissesOnPlayer2(player1.movesThatMissed());
  };
  gameInterface.hits.sub(updateBoardMoves);
  gameInterface.misses.sub(updateBoardMoves);
  gameInterface.losses.sub(hasLost);
  return {
    reset() {
      gameInterface.reset();
      player1 = playerFactory();
      player2 = playerFactory();
      player1.configureInterface(gameInterface);
      player2.configureInterface(gameInterface);
      gameInterface.losses.sub(hasLost);
      gameInterface.hits.sub(updateBoardMoves);
      gameInterface.misses.sub(updateBoardMoves);
      gameInterface.moves.sub(updateBoardMoves);
      losingPlayer = null;
      updateBoardMoves();
    },
    placeShipsRandomly() {
      player1.placeShipsRandomly();
      player2.placeShipsRandomly();
      updateBoardMoves();
    },
    getPlayers() {
      return [player1, player2];
    },
    placeShip(length, coord, direction, playerNumber) {
      if (playerNumber === 2) {
        return player2.placeShip(length, coord, direction);
      }
      return player1.placeShip(length, coord, direction);
    },
    getShips(playerNumber) {
      if (playerNumber === 2) {
        return player2.getShipCoords();
      }
      return player1.getShipCoords();
    },
    makeMove(coord, playerNumber) {
      if (playerNumber === 2) {
        player2.makeMove(coord);
      }
      player1.makeMove(coord);
      // This makes AI work
      player2.makeMove();
    },
    loser() {
      return losingPlayer;
    },
    printShips() {
      return `${player1.printShips()} \n ${player2.printShips()}`;
    },
  };
})();

// eslint-disable-next-line arrow-body-style
const buttonManager = (() => {
  return {
    init() {
      for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
          const squares = document.querySelectorAll(
            `.row${j + 2}>.item${i + 2}`
          );

          squares[0].dataset.x = i;
          squares[0].dataset.y = j;
          squares[0].dataset.player = 1;
          squares[1].dataset.x = i;
          squares[1].dataset.y = j;
          squares[1].dataset.player = 2;
          squares[1].addEventListener('click', () => {
            gameManager.makeMove([i, j], 1);
          });
        }
      }
    },
    disableButtons() {
      const squares = document.querySelectorAll('.square');
      squares.forEach((square) => {
        square.classList.remove('hit');
        square.classList.remove('miss');
        square.classList.remove('boat');
        square.classList.add('disabled');
        square.replaceWith(square.cloneNode(true));
      });
    },
  };
})();
/**
 * initializes the game
 */
function init() {
  gameManager.reset();
  buttonManager.init();
  gameManager.placeShipsRandomly();
}

init();

module.exports = {
  shipFactory,
  gameboardFactory,
  playerFactory,
  gameInterface,
  gameManager,
};
