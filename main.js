const SIZE = 4;
let board = [];
let score = 0;

function initBoard() {
  board = Array.from({length: SIZE}, () => Array(SIZE).fill(0));
  score = 0;
  addRandomTile();
  addRandomTile();
  updateBoard();
  document.getElementById('score').textContent = score;
}

function addRandomTile() {
  let empty = [];
  for (let r = 0; r < SIZE; r++)
    for (let c = 0; c < SIZE; c++)
      if (board[r][c] === 0) empty.push([r, c]);
  if (empty.length === 0) return;
  let [r, c] = empty[Math.floor(Math.random() * empty.length)];
  board[r][c] = Math.random() < 0.9 ? 2 : 4;
}

function updateBoard() {
  const gameBoard = document.getElementById('game-board');
  gameBoard.innerHTML = '';
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const tile = document.createElement('div');
      tile.className = 'tile' + (board[r][c] ? ` tile-${board[r][c]}` : '');
      tile.textContent = board[r][c] ? board[r][c] : '';
      gameBoard.appendChild(tile);
    }
  }
}

function slide(row) {
  let arr = row.filter(val => val);
  for (let i = 0; i < arr.length-1; i++) {
    if (arr[i] === arr[i+1]) {
      arr[i] *= 2;
      score += arr[i];
      arr[i+1] = 0;
    }
  }
  arr = arr.filter(val => val);
  while (arr.length < SIZE) arr.push(0);
  return arr;
}

function rotateLeft(mat) {
  let res = Array.from({length: SIZE}, () => Array(SIZE).fill(0));
  for (let r = 0; r < SIZE; r++)
    for (let c = 0; c < SIZE; c++)
      res[SIZE-1-c][r] = mat[r][c];
  return res;
}

function move(dir) {
  let old = board.map(row => [...row]);
  for (let i = 0; i < dir; i++) board = rotateLeft(board);
  for (let r = 0; r < SIZE; r++) board[r] = slide(board[r]);
  for (let i = 0; i < (4-dir)%4; i++) board = rotateLeft(board);
  if (JSON.stringify(board) !== JSON.stringify(old)) {
    addRandomTile();
    updateBoard();
    document.getElementById('score').textContent = score;
    if (isGameOver()) alert('ゲームオーバー！');
  }
}

function isGameOver() {
  for (let r = 0; r < SIZE; r++)
    for (let c = 0; c < SIZE; c++) {
      if (board[r][c] === 0) return false;
      if (c < SIZE-1 && board[r][c] === board[r][c+1]) return false;
      if (r < SIZE-1 && board[r][c] === board[r+1][c]) return false;
    }
  return true;
}

// キーボード操作
window.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft') move(0);
  else if (e.key === 'ArrowUp') move(1);
  else if (e.key === 'ArrowRight') move(2);
  else if (e.key === 'ArrowDown') move(3);
});

// タッチ操作（スワイプ）
let startX, startY;
document.addEventListener('touchstart', e => {
  if (e.touches.length !== 1) return;
  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
});
document.addEventListener('touchend', e => {
  if (startX == null || startY == null) return;
  let dx = e.changedTouches[0].clientX - startX;
  let dy = e.changedTouches[0].clientY - startY;
  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 30) move(2); // 右
    else if (dx < -30) move(0); // 左
  } else {
    if (dy > 30) move(3); // 下
    else if (dy < -30) move(1); // 上
  }
  startX = startY = null;
});

// リセットボタン
document.getElementById('restart-btn').onclick = initBoard;

// 初期化
initBoard();
