/* eslint-disable require-jsdoc */
const battleship = require('./battleship');

// tests for shipFactory
test('Ship is created', () => {
  const testShip = battleship.shipFactory(3, [1, 1], 'right');
  expect(testShip && typeof testShip === 'object').toBe(true);
});

test('Ship has coordinates', () => {
  const testShip = battleship.shipFactory(3, [1, 1], 'right');
  expect(Array.isArray(testShip.getCoord())).toBe(true);
});

test('Ship direction works (left)', () => {
  const testShip = battleship.shipFactory(3, [5, 5], 'left');
  expect(testShip.getCoord()).toEqual([
    [5, 5],
    [4, 5],
    [3, 5],
  ]);
});

test('Ship direction works (right)', () => {
  const testShip = battleship.shipFactory(3, [1, 1], 'right');
  expect(testShip.getCoord()).toEqual([
    [1, 1],
    [2, 1],
    [3, 1],
  ]);
});

test('Ship direction works (up)', () => {
  const testShip = battleship.shipFactory(3, [1, 1], 'up');
  expect(testShip.getCoord()).toEqual([
    [1, 1],
    [1, 2],
    [1, 3],
  ]);
});

test('Ship direction works (down)', () => {
  const testShip = battleship.shipFactory(3, [5, 5], 'down');
  expect(testShip.getCoord()).toEqual([
    [5, 5],
    [5, 4],
    [5, 3],
  ]);
});

test('Ship can be hit', () => {
  const testShip = battleship.shipFactory(3, [5, 5], 'down');
  expect(testShip.hit()).toBe(2);
});

test('Ship can be hit by coordinate', () => {
  const testShip = battleship.shipFactory(3, [5, 5], 'down');
  expect(testShip.hit([5, 5])).toBe(2);
});

test('Ship can be missed', () => {
  const testShip = battleship.shipFactory(3, [5, 5], 'down');
  expect(testShip.hit([1, 1])).toBe('no hit');
});

test('Ship cant be hit twice in same spot', () => {
  const testShip = battleship.shipFactory(3, [5, 5], 'down');
  testShip.hit([5, 5]);
  expect(testShip.hit([5, 5])).toBe(null);
});

test('Ship can be hit but not sunk', () => {
  const testShip = battleship.shipFactory(3, [5, 5], 'down');
  testShip.hit();
  testShip.hit();
  expect(testShip.isSunk()).toBe(false);
});

test('Ship can be sunk', () => {
  const testShip = battleship.shipFactory(3, [5, 5], 'down');
  testShip.hit();
  testShip.hit();
  testShip.hit();
  expect(testShip.isSunk()).toBe(true);
});

// tests for gameboardFactory
test('Gameboard is created', () => {
  const testBoard = battleship.gameboardFactory();
  expect(testBoard && typeof testBoard === 'object').toBe(true);
});

test('Can place ship on board', () => {
  const testBoard = battleship.gameboardFactory();
  testBoard.placeShip(3, [1, 1], 'right');
  expect(testBoard.getShipCoords()).toContainEqual([1, 1], [2, 1], [3, 1]);
});

test('Cant place overlapping ships', () => {
  const testBoard = battleship.gameboardFactory();
  testBoard.placeShip(2, [2, 1], 'up');
  testBoard.placeShip(3, [1, 1], 'right');
  expect(testBoard.getShipCoords()).not.toContainEqual([1, 1], [2, 1], [3, 1]);
});

test('Cant place ship that goes off board', () => {
  const testBoard = battleship.gameboardFactory();
  testBoard.placeShip(3, [1, 1], 'left');
  expect(testBoard.getShipCoords()).toEqual([]);
});

test('Can hit ship', () => {
  const testBoard = battleship.gameboardFactory();
  testBoard.placeShip(3, [1, 1], 'right');
  const hit = testBoard.receiveAttack([2, 1]);
  expect(testBoard.getHits()).toContainEqual([2, 1]);
  expect(hit[1]).toEqual('hit');
});

test('Miss does not result in hit', () => {
  const testBoard = battleship.gameboardFactory();
  testBoard.placeShip(3, [1, 1], 'right');
  const hit = testBoard.receiveAttack([5, 5]);
  expect(testBoard.getHits()).not.toContainEqual([5, 5]);
  expect(hit[1]).toEqual('miss');
});

test('Can miss a shot', () => {
  const testBoard = battleship.gameboardFactory();
  testBoard.placeShip(3, [1, 1], 'right');
  const hit = testBoard.receiveAttack([5, 5]);
  expect(testBoard.getMisses()).toContainEqual([5, 5]);
  expect(hit[1]).toEqual('miss');
});

test('Hit does not result in miss', () => {
  const testBoard = battleship.gameboardFactory();
  testBoard.placeShip(3, [1, 1], 'right');
  const hit = testBoard.receiveAttack([2, 1]);
  expect(testBoard.getMisses()).not.toContainEqual([2, 1]);
  expect(hit[1]).toEqual('hit');
});

test('Test printShips()', () => {
  const testBoard = battleship.gameboardFactory();
  testBoard.placeShip(3, [1, 1], 'right');
  testBoard.placeShip(2, [3, 2], 'up');
  testBoard.placeShip(4, [5, 5], 'left');
  testBoard.receiveAttack([4, 5]);
  testBoard.receiveAttack([7, 7]);
  const shipMatrix = testBoard.printShips();
  const testShipMatrix =
    '     A  B  C  D  E  F  G  H  I  J\n 1:  -  -  -  -  -  -  -  -  -  - \n 2:  -  S  S  S  -  -  -  -  -  - \n 3:  -  -  -  S  -  -  -  -  -  - \n 4:  -  -  -  S  -  -  -  -  -  - \n 5:  -  -  -  -  -  -  -  -  -  - \n 6:  -  -  S  S  X  S  -  -  -  - \n 7:  -  -  -  -  -  -  -  -  -  - \n 8:  -  -  -  -  -  -  -  M  -  - \n 9:  -  -  -  -  -  -  -  -  -  - \n10:  -  -  -  -  -  -  -  -  -  - \n';
  expect(shipMatrix).toEqual(testShipMatrix);
});

test('Gameboard detects if it lost', () => {
  const testBoard = battleship.gameboardFactory();
  testBoard.placeShip(3, [1, 1], 'right');
  testBoard.placeShip(2, [3, 2], 'up');
  testBoard.placeShip(4, [5, 5], 'left');
  testBoard.receiveAttack([1, 1]);
  testBoard.receiveAttack([2, 1]);
  testBoard.receiveAttack([3, 1]);
  testBoard.receiveAttack([3, 2]);
  testBoard.receiveAttack([3, 3]);
  testBoard.receiveAttack([5, 5]);
  testBoard.receiveAttack([4, 5]);
  testBoard.receiveAttack([3, 5]);
  testBoard.receiveAttack([2, 5]);
  expect(testBoard.hasLost()).toBe(true);
});

test('Gameboard doesnt report loss unless all ships have been sunk', () => {
  const testBoard = battleship.gameboardFactory();
  testBoard.placeShip(3, [1, 1], 'right');
  testBoard.placeShip(2, [3, 2], 'up');
  testBoard.placeShip(4, [5, 5], 'left');
  testBoard.receiveAttack([1, 1]);
  testBoard.receiveAttack([2, 1]);
  testBoard.receiveAttack([3, 1]);
  testBoard.receiveAttack([3, 2]);
  testBoard.receiveAttack([3, 3]);
  testBoard.receiveAttack([4, 5]);
  testBoard.receiveAttack([3, 5]);
  testBoard.receiveAttack([2, 5]);
  expect(testBoard.hasLost()).toBe(false);
});

test('does placeShipsRandomly work?', () => {
  const testBoard = battleship.gameboardFactory();
  testBoard.placeShipsRandomly();
  const ships = testBoard.getShipObjects();
  expect(ships.length).toEqual(10);
});

test('does getShipObjects work?', () => {
  const testBoard = battleship.gameboardFactory();
  testBoard.placeShipsRandomly();
  const ships = testBoard.getShipObjects();
  ships.forEach((ship) => {
    expect(ship && typeof ship === 'object').toBe(true);
  });
});

// tests for playerFactory
test('player can be created', () => {
  const testPlayer = battleship.playerFactory();
  expect(testPlayer && typeof testPlayer === 'object').toBe(true);
});

test('player can make manual move', () => {
  const testPlayer = battleship.playerFactory();
  const { gameInterface } = battleship;
  testPlayer.configureInterface(gameInterface);
  let coordinate;
  let playerTest;
  function mockAttackReceive(coord, player) {
    coordinate = coord;
    playerTest = player;
  }
  gameInterface.moves.sub(mockAttackReceive);
  testPlayer.makeMove([5, 5]);
  expect(coordinate).toEqual([5, 5]);
  expect(playerTest).toEqual(testPlayer);
});

test('player can make random move', () => {
  const testPlayer = battleship.playerFactory();
  const { gameInterface } = battleship;
  testPlayer.configureInterface(gameInterface);
  let coordinate;
  let playerTest;
  function mockAttackReceive(coord, player) {
    coordinate = coord;
    playerTest = player;
  }
  gameInterface.moves.sub(mockAttackReceive);
  testPlayer.makeMove();
  expect(coordinate && Array.isArray(coordinate)).toBe(true);
  expect(playerTest).toEqual(testPlayer);
});

test('make sure player cannot make same move twice', () => {
  const testPlayer = battleship.playerFactory();
  const { gameInterface } = battleship;
  testPlayer.configureInterface(gameInterface);
  let coordinate;
  let playerTest;
  function mockAttackReceive(coord, player) {
    coordinate = coord;
    playerTest = player;
  }
  gameInterface.moves.sub(mockAttackReceive);
  testPlayer.makeMove([5, 5]);
  testPlayer.makeMove([5, 5]);
  expect(coordinate.includes('error')).toBe(true);
});

test('player.getShipCoords works', () => {
  const testPlayer = battleship.playerFactory();
  testPlayer.placeShip(3, [1, 1], 'right');
  expect(Array.isArray(testPlayer.getShipCoords())).toBe(true);
});

test('player.placeShip works', () => {
  const testPlayer = battleship.playerFactory();
  testPlayer.placeShip(3, [1, 1], 'right');
  expect(testPlayer.getShipCoords()).toContainEqual([1, 1], [2, 1], [3, 1]);
});

test('player.getShipObjects works', () => {
  const testPlayer = battleship.playerFactory();
  testPlayer.placeShipsRandomly();
  const ships = testPlayer.getShipObjects();
  expect(ships && Array.isArray(ships) && typeof ships[0] === 'object').toBe(
    true
  );
});

test('player.placeShipsRandomly works', () => {
  const testPlayer = battleship.playerFactory();
  testPlayer.placeShipsRandomly();
  const ships = testPlayer.getShipObjects();
  expect(ships.length).toEqual(10);
});

test('player.printShips() works', () => {
  const testPlayer = battleship.playerFactory();
  const otherPlayer = battleship.playerFactory();
  testPlayer.placeShip(3, [1, 1], 'right');
  testPlayer.placeShip(2, [3, 2], 'up');
  testPlayer.placeShip(4, [5, 5], 'left');
  testPlayer.receiveAttack([4, 5], otherPlayer);
  testPlayer.receiveAttack([7, 7], otherPlayer);
  const shipMatrix = testPlayer.printShips();
  const testShipMatrix =
    '     A  B  C  D  E  F  G  H  I  J\n 1:  -  -  -  -  -  -  -  -  -  - \n 2:  -  S  S  S  -  -  -  -  -  - \n 3:  -  -  -  S  -  -  -  -  -  - \n 4:  -  -  -  S  -  -  -  -  -  - \n 5:  -  -  -  -  -  -  -  -  -  - \n 6:  -  -  S  S  X  S  -  -  -  - \n 7:  -  -  -  -  -  -  -  -  -  - \n 8:  -  -  -  -  -  -  -  M  -  - \n 9:  -  -  -  -  -  -  -  -  -  - \n10:  -  -  -  -  -  -  -  -  -  - \n';
  expect(shipMatrix).toEqual(testShipMatrix);
});

test('player can receiveAttack from pubsub', () => {
  const testPlayer = battleship.playerFactory();
  const otherPlayer = battleship.playerFactory();
  const { gameInterface } = battleship;
  testPlayer.configureInterface(gameInterface);
  otherPlayer.configureInterface(gameInterface);
  testPlayer.placeShip(3, [1, 1], 'right');
  gameInterface.moves.pub([2, 1], otherPlayer);
  expect(testPlayer.getHits()).toContainEqual([2, 1]);
});

test('player.receiveAttack hit ship works', () => {
  const testPlayer = battleship.playerFactory();
  const otherPlayer = battleship.playerFactory();
  const { gameInterface } = battleship;
  testPlayer.configureInterface(gameInterface);
  otherPlayer.configureInterface(gameInterface);
  let coordinate;
  let playerToTest;
  function mockRegisterHit(coord, player) {
    coordinate = coord;
    playerToTest = player;
  }
  gameInterface.hits.sub(mockRegisterHit);

  testPlayer.placeShip(3, [1, 1], 'right');
  const hit = testPlayer.receiveAttack([2, 1], otherPlayer);
  expect(testPlayer.getHits()).toContainEqual([2, 1]);
  expect(hit[1]).toEqual('hit');
  expect(coordinate).toEqual([2, 1]);
  expect(playerToTest).toEqual(testPlayer);
});

test('player.receiveAttack - Miss does not result in hit', () => {
  const testPlayer = battleship.playerFactory();
  const otherPlayer = battleship.playerFactory();
  const { gameInterface } = battleship;
  testPlayer.configureInterface(gameInterface);
  otherPlayer.configureInterface(gameInterface);
  let coordinate = null;
  let playerToTest = null;
  function mockRegisterHit(coord, player) {
    coordinate = coord;
    playerToTest = player;
  }
  gameInterface.hits.sub(mockRegisterHit);
  testPlayer.placeShip(3, [1, 1], 'right');
  const hit = testPlayer.receiveAttack([5, 5], otherPlayer);
  expect(testPlayer.getHits()).not.toContainEqual([5, 5]);
  expect(hit[1]).toEqual('miss');
  expect(coordinate).toEqual(null);
  expect(playerToTest).toEqual(null);
});

test('player.receiveAttack can miss a shot', () => {
  const testPlayer = battleship.playerFactory();
  const otherPlayer = battleship.playerFactory();
  const { gameInterface } = battleship;
  testPlayer.configureInterface(gameInterface);
  otherPlayer.configureInterface(gameInterface);
  let coordinate;
  let playerToTest;
  function mockRegisterMiss(coord, player) {
    coordinate = coord;
    playerToTest = player;
  }
  gameInterface.misses.sub(mockRegisterMiss);
  testPlayer.placeShip(3, [1, 1], 'right');
  testPlayer.placeShip(3, [1, 1], 'right');
  const hit = testPlayer.receiveAttack([5, 5], otherPlayer);
  expect(testPlayer.getMisses()).toContainEqual([5, 5]);
  expect(hit[1]).toEqual('miss');
  expect(coordinate).toEqual([5, 5]);
  expect(playerToTest).toEqual(testPlayer);
});

test('player.receiveAttack - hit does not result in miss', () => {
  const testPlayer = battleship.playerFactory();
  const otherPlayer = battleship.playerFactory();
  const { gameInterface } = battleship;
  testPlayer.configureInterface(gameInterface);
  otherPlayer.configureInterface(gameInterface);
  let coordinate = null;
  let playerToTest = null;
  function mockRegisterMiss(coord, player) {
    coordinate = coord;
    playerToTest = player;
  }
  gameInterface.misses.sub(mockRegisterMiss);
  testPlayer.placeShip(3, [1, 1], 'right');
  const hit = testPlayer.receiveAttack([2, 1], otherPlayer);
  expect(testPlayer.getMisses()).not.toContainEqual([2, 1]);
  expect(hit[1]).toEqual('hit');
  expect(coordinate).toEqual(null);
  expect(playerToTest).toEqual(null);
});
// configure with pubsub
test('notify player of a hit', () => {
  const testPlayer = battleship.playerFactory();
  const otherPlayer = battleship.playerFactory();
  const { gameInterface } = battleship;
  testPlayer.configureInterface(gameInterface);
  otherPlayer.configureInterface(gameInterface);
  gameInterface.hits.pub([5, 5], otherPlayer);
  const playerMovesThatHit = testPlayer.movesThatHit();
  expect(playerMovesThatHit).toContainEqual([5, 5]);
});

test('notify player hit on that player doesnt work ', () => {
  const testPlayer = battleship.playerFactory();
  const otherPlayer = battleship.playerFactory();
  const { gameInterface } = battleship;
  testPlayer.configureInterface(gameInterface);
  otherPlayer.configureInterface(gameInterface);
  testPlayer.placeShip(3, [5, 5], 'right');
  gameInterface.hits.pub([5, 5], testPlayer);
  const playerMovesThatHit = testPlayer.movesThatHit();
  expect(playerMovesThatHit).not.toContainEqual([5, 5]);
});

test('notify player of a miss', () => {
  const testPlayer = battleship.playerFactory();
  const otherPlayer = battleship.playerFactory();
  const { gameInterface } = battleship;
  testPlayer.configureInterface(gameInterface);
  otherPlayer.configureInterface(gameInterface);
  gameInterface.misses.pub([5, 5], otherPlayer);
  const playerMovesThatMissed = testPlayer.movesThatMissed();
  expect(playerMovesThatMissed).toContainEqual([5, 5]);
});

test('notify player of a miss on that player doesnt work', () => {
  const testPlayer = battleship.playerFactory();
  const { gameInterface } = battleship;
  testPlayer.configureInterface(gameInterface);
  gameInterface.misses.pub([5, 5], testPlayer);
  const playerMovesThatMissed = testPlayer.movesThatMissed();
  expect(playerMovesThatMissed).not.toContainEqual([5, 5]);
});

test('Player detects if it lost', () => {
  const testPlayer = battleship.playerFactory();
  const { gameInterface } = battleship;
  testPlayer.configureInterface(gameInterface);
  let losingPlayer;
  function mockHasLost(player) {
    losingPlayer = player;
  }
  gameInterface.losses.sub(mockHasLost);
  testPlayer.placeShip(3, [1, 1], 'right');
  testPlayer.placeShip(2, [3, 2], 'up');
  testPlayer.placeShip(4, [5, 5], 'left');
  testPlayer.receiveAttack([1, 1]);
  testPlayer.receiveAttack([2, 1]);
  testPlayer.receiveAttack([3, 1]);
  testPlayer.receiveAttack([3, 2]);
  testPlayer.receiveAttack([3, 3]);
  testPlayer.receiveAttack([5, 5]);
  testPlayer.receiveAttack([4, 5]);
  testPlayer.receiveAttack([3, 5]);
  testPlayer.receiveAttack([2, 5]);
  expect(losingPlayer).toEqual(testPlayer);
});

test('Player doesnt report loss unless all ships have been sunk', () => {
  const testPlayer = battleship.playerFactory();
  const { gameInterface } = battleship;
  testPlayer.configureInterface(gameInterface);
  let losingPlayer = null;
  function mockHasLost(player) {
    losingPlayer = player;
  }
  gameInterface.losses.sub(mockHasLost);
  testPlayer.placeShip(3, [1, 1], 'right');
  testPlayer.placeShip(2, [3, 2], 'up');
  testPlayer.placeShip(4, [5, 5], 'left');
  testPlayer.receiveAttack([1, 1]);
  testPlayer.receiveAttack([2, 1]);
  testPlayer.receiveAttack([3, 1]);
  testPlayer.receiveAttack([3, 2]);
  testPlayer.receiveAttack([3, 3]);
  testPlayer.receiveAttack([4, 5]);
  testPlayer.receiveAttack([3, 5]);
  testPlayer.receiveAttack([2, 5]);
  expect(losingPlayer).toEqual(null);
});
// tests for gameInterface - pub/sub
test('gameInterface.hits works', () => {
  const { gameInterface } = battleship;
  const hit = [];
  function recordHit(coord) {
    hit.push(coord);
  }
  gameInterface.hits.sub(recordHit);
  gameInterface.hits.pub([5, 5]);
  expect(hit).toEqual([[5, 5]]);
});

test('gameInterface.misses works', () => {
  const { gameInterface } = battleship;
  const miss = [];
  function recordMiss(coord) {
    miss.push(coord);
  }
  gameInterface.misses.sub(recordMiss);
  gameInterface.misses.pub([5, 5]);
  expect(miss).toEqual([[5, 5]]);
});

test('gameInterface.losses works', () => {
  const { gameInterface } = battleship;
  const loss = [];
  function recordLoss(coord) {
    loss.push(coord);
  }
  gameInterface.losses.sub(recordLoss);
  const testPlayer = battleship.playerFactory();
  gameInterface.losses.pub(testPlayer);
  expect(loss).toEqual([testPlayer]);
});

test('interface correctly handles hit between players', () => {
  const testPlayer1 = battleship.playerFactory();
  const testPlayer2 = battleship.playerFactory();
  const { gameInterface } = battleship;

  testPlayer1.configureInterface(gameInterface);
  testPlayer2.configureInterface(gameInterface);

  testPlayer1.placeShip(3, [1, 1], 'right');
  const hit = testPlayer1.receiveAttack([2, 1]);
  expect(testPlayer2.movesThatHit()).toContainEqual([2, 1]);
});

// tests for game logic (gameManager)
test('Can create two players', () => {
    const { gameManager } = battleship;
    gameManager.reset();
    const players = gameManager.getPlayers();
    expect(players && typeof players[0] === 'object').toBe(true);
    expect(players && typeof players[1] === 'object').toBe(true);
});

test('Can facilitate moves', () => {
    const { gameManager } = battleship;
    const [player1, player2] = gameManager.getPlayers();
    player2.placeShip(3, [1, 1], 'right');
    gameManager.makeMove([2, 1], 1);
    const hits = player2.getHits();
    const movesThatHit = player1.movesThatHit();
    expect(hits).toContainEqual([2, 1]);
    expect(movesThatHit).toContainEqual([2, 1]);
});
test ('Can place ships via gameManager', () => {
    const { gameManager } = battleship;
    gameManager.reset();
    gameManager.placeShip(3, [1, 1], 'right', 1);
    const ships = gameManager.getShips(1);
    expect(ships).toContainEqual([2, 1]);
});

test('doesnt declare winner unless game is lost', () => {
    const { gameManager } = battleship;
    gameManager.reset();
    expect(gameManager.loser()).toEqual(null);
});

test('Can determine winner', () => {
  const { gameManager } = battleship;
  gameManager.reset();
  const players = gameManager.getPlayers();
  gameManager.placeShip(3, [1, 1], 'right', 2);
  gameManager.placeShip(2, [3, 2], 'up', 2);
  gameManager.placeShip(4, [5, 5], 'left', 2);
  gameManager.makeMove([1, 1], 1);
  gameManager.makeMove([2, 1], 1);
  gameManager.makeMove([3, 1], 1);
  gameManager.makeMove([3, 2], 1);
  gameManager.makeMove([3, 3], 1);
  gameManager.makeMove([5, 5], 1);
  gameManager.makeMove([4, 5], 1);
  gameManager.makeMove([3, 5], 1);
  gameManager.makeMove([2, 5], 1);
  expect(gameManager.loser()).toEqual(players[1]);
});

test('gameManager.printShips works', () => {
  const { gameManager } = battleship;
  gameManager.reset();
  gameManager.placeShip(3, [1, 1], 'right', 1);
  gameManager.placeShip(2, [3, 2], 'up', 1);
  gameManager.placeShip(4, [5, 5], 'left', 1);
  gameManager.placeShip(3, [1, 1], 'right', 2);
  gameManager.placeShip(2, [3, 2], 'up', 2);
  gameManager.placeShip(4, [5, 5], 'left', 2);
  expect(JSON.stringify(gameManager.printShips())).toEqual(JSON.stringify('     A  B  C  D  E  F  G  H  I  J\n 1:  -  -  -  -  -  -  -  -  -  - \n 2:  -  S  S  S  -  -  -  -  -  - \n 3:  -  -  -  S  -  -  -  -  -  - \n 4:  -  -  -  S  -  -  -  -  -  - \n 5:  -  -  -  -  -  -  -  -  -  - \n 6:  -  -  S  S  S  S  -  -  -  - \n 7:  -  -  -  -  -  -  -  -  -  - \n 8:  -  -  -  -  -  -  -  -  -  - \n 9:  -  -  -  -  -  -  -  -  -  - \n10:  -  -  -  -  -  -  -  -  -  - \n \n      A  B  C  D  E  F  G  H  I  J\n 1:  -  -  -  -  -  -  -  -  -  - \n 2:  -  S  S  S  -  -  -  -  -  - \n 3:  -  -  -  S  -  -  -  -  -  - \n 4:  -  -  -  S  -  -  -  -  -  - \n 5:  -  -  -  -  -  -  -  -  -  - \n 6:  -  -  S  S  S  S  -  -  -  - \n 7:  -  -  -  -  -  -  -  -  -  - \n 8:  -  -  -  -  -  -  -  -  -  - \n 9:  -  -  -  -  -  -  -  -  -  - \n10:  -  -  -  -  -  -  -  -  -  - \n'));
});
