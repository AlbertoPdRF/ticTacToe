"use strict"

let player1;
let player2;

const playerFactory = (name, marker, currentPlayerStatus) => {
  let _currentPlayerStatus = currentPlayerStatus;
  let _currentWinnerStatus = false;
  let _numberOfWins = 0;

  const getName = () => name;
  const getMarker = () => marker;
  const setCurrentPlayerStatus = (currentPlayerStatus) => _currentPlayerStatus = currentPlayerStatus;
  const getCurrentPlayerStatus = () => _currentPlayerStatus;
  const setCurrentWinnerStatus = (currentWinnerStatus) => _currentWinnerStatus = currentWinnerStatus;
  const getCurrentWinnerStatus = () => _currentWinnerStatus;
  const getNumberOfWins = () => _numberOfWins;
  const incrementNumberOfWins = () => ++_numberOfWins;

  return {
    getName,
    getMarker,
    setCurrentPlayerStatus,
    getCurrentPlayerStatus,
    setCurrentWinnerStatus,
    getCurrentWinnerStatus,
    getNumberOfWins,
    incrementNumberOfWins
  }
};

const gameBoard = (() => {
  let _gameBoard = [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null
  ];

  const get = () => _gameBoard;

  const reset = () => {
    for (let i = 0; i < _gameBoard.length; ++i) {
      _gameBoard[i] = null;
    }
  };

  return {
    get,
    reset
  }
})();

const gameController = (() => {
  const board = gameBoard.get();
  const boardDiv = document.getElementById('board');
  const divs = [...boardDiv.children];
  let _numberOfPlays;
  document.getElementById('start').addEventListener('click', () => startGame(true));
  const player1NameAndMarkerDiv = document.getElementById('player1-name-and-marker');
  const player2NameAndMarkerDiv = document.getElementById('player2-name-and-marker');
  const player1NumberOfWinsDiv = document.getElementById('player1-number-of-wins');
  const player2NumberOfWinsDiv = document.getElementById('player2-number-of-wins');
  const playAgainButton = document.getElementById('result-and-play-again');

  const startGame = (firstGame) => {
    if (firstGame) {
      player1 = playerFactory(document.getElementById('player1-name').value, 'X', true);
      player2 = playerFactory(document.getElementById('player2-name').value, 'O', false);

      document.getElementById('start-form').classList.add('invisible');
      boardDiv.classList.remove('invisible');
      document.getElementById('names-and-number-of-wins').classList.remove('invisible');

      player1NameAndMarkerDiv.innerHTML = `<h3>${player1.getName()} (${player1.getMarker()})</h3>`;
      player1NameAndMarkerDiv.classList.add('current-player')
      player2NameAndMarkerDiv.innerHTML = `<h3>${player2.getName()} (${player2.getMarker()})</h3>`;
      player1NumberOfWinsDiv.innerHTML = `<p>${player1.getNumberOfWins()}</p>`;
      player2NumberOfWinsDiv.innerHTML = `<p>${player2.getNumberOfWins()}</p>`;
    } else {
      playAgainButton.classList.add('invisible');

      player1.setCurrentPlayerStatus(!player1.getCurrentWinnerStatus());
      player2.setCurrentPlayerStatus(!player2.getCurrentWinnerStatus());
      if (player1.getCurrentPlayerStatus) {
        player1NameAndMarkerDiv.classList.remove('current-player');
        player2NameAndMarkerDiv.classList.add('current-player');
      } else {
        player1NameAndMarkerDiv.classList.add('current-player');
        player2NameAndMarkerDiv.classList.remove('current-player');
      }
    }

    _numberOfPlays = 0;
    gameBoard.reset();
    game();
  };

  const game = () => {
    for (let id in divs) {
      const div = document.getElementById(id);
      div.classList.add('empty');
      div.innerHTML = '';
      div.addEventListener('click', makePlay);
    }
  };

  const makePlay = (e) => {
    const div = e.target;
    if (!board[div.id]) {
      const currentPlayer = player1.getCurrentPlayerStatus() ? player1 : player2;
      board[div.id] = currentPlayer;
      div.innerHTML = `<span>${currentPlayer.getMarker()}</span>`;
      div.classList.remove('empty');
      ++_numberOfPlays;
      if (hasGameFinishedByWinning()) {
        finishGame(currentPlayer);
      } else if (_numberOfPlays === 9) {
        finishGame();
      } else {
        switchPlayer();
      }
    }
  };

  const hasGameFinishedByWinning = () => {
    let returnValue;
    switch (!!board) {
      case (board[0] && board[1] && board[2] && board[0] === board[1] && board[1] === board[2]):
      case (board[3] && board[4] && board[5] && board[3] === board[4] && board[4] === board[5]):
      case (board[6] && board[7] && board[8] && board[6] === board[7] && board[7] === board[8]):
      case (board[0] && board[3] && board[6] && board[0] === board[3] && board[3] === board[6]):
      case (board[1] && board[4] && board[7] && board[1] === board[4] && board[4] === board[7]):
      case (board[2] && board[5] && board[8] && board[2] === board[5] && board[5] === board[8]):
      case (board[0] && board[4] && board[8] && board[0] === board[4] && board[4] === board[8]):
      case (board[2] && board[4] && board[6] && board[2] === board[4] && board[4] === board[6]):
        returnValue = true;
        break;
    
      default:
        returnValue = false;
        break;
    }

    return returnValue;
  };

  const finishGame = (winningPlayer) => {
    let message;
    if (winningPlayer) {
      message = `${winningPlayer.getName()} has won!`;
      winningPlayer.setCurrentWinnerStatus(true);
      winningPlayer.incrementNumberOfWins();
    } else {
      message = 'It\'s a tie!';
    }
    for (let id in divs) {
      const div = document.getElementById(id);
      div.classList.remove('empty');
      div.removeEventListener('click', makePlay);
    }
    playAgainButton.classList.remove('invisible');
    document.getElementById('result').innerText = message;
    document.getElementById('play-again').addEventListener('click', () => startGame(false));
    player1NumberOfWinsDiv.innerHTML = `<p>${player1.getNumberOfWins()}</p>`;
    player2NumberOfWinsDiv.innerHTML = `<p>${player2.getNumberOfWins()}</p>`;
  };

  const switchPlayer = () => {
    player1.setCurrentPlayerStatus(!player1.getCurrentPlayerStatus());
    player2.setCurrentPlayerStatus(!player2.getCurrentPlayerStatus());

    player1NameAndMarkerDiv.classList.toggle('current-player');
    player2NameAndMarkerDiv.classList.toggle('current-player');
  };
})();
