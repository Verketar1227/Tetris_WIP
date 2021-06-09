const canvas = document.getElementById('tetris')
const context = canvas.getContext('2d')

context.scale (30,30)

context.fillStyle = '#000000';
context.fillRect(0,0, canvas.width, canvas.height)

function boardsweep() {
    outer: for (let y = board.length - 1 ; y>0; --y) {
        for (let x = 0; x < board[y].length; ++x){
            if (board[y][x] === 0){
                continue outer;
            }
        }

        const row = board.splice(y, 1)[0].fill(0);
        board.unshift(row);
        ++y;
    }
}

function collide(board,player) {
    const [m, o] = [player.matrix, player.pos]
    for (let y = 0; y <m.length; ++y){
        for (let x = 0; x < m[y].length; ++x) {
            if (m[y][x] !== 0 &&
                (board[y+ o.y] &&
                board[y+ o.y][x + o.x]) !== 0){
                    return true;
                };
        };
    };
    return false;
}

function createMatrix(w,h) {
    const matrix = [];
    while (h--) {
        matrix.push(new Array(w).fill(0));
    }
    return matrix
}

function createPiece(type){
    if (type === 'T') {
        return [
            [0,0,0],
            [1,1,1],
            [0,1,0],
        ];
    } else if (type === 'O') {
        return [
            [2,2],
            [2,2],
        ];
    } else if (type === 'L') {
        return [
            [0,3,0],
            [0,3,0],
            [0,3,3],
        ];
    } else if (type === 'J') {
        return [
            [0,4,0],
            [0,4,0],
            [4,4,0],
        ];
    } else if (type === 'I') {
        return [
            [0,5,0,0],
            [0,5,0,0],
            [0,5,0,0],
            [0,5,0,0],
        ];
    } else if (type === 'S') {
        return [
            [0,6,6],
            [6,6,0],
            [0,0,0],
        ];
    } else if (type === 'Z') {
        return [
            [7,7,0],
            [0,7,7],
            [0,0,0],
        ];
    }
}

function draw(){
    context.fillStyle = '#000000';
    context.fillRect(0,0, canvas.width, canvas.height)

    drawMatrix(board, {x: 0, y: 0});
    drawMatrix(player.matrix, player.pos);
}

function drawMatrix(matrix, offset){
    matrix.forEach((row, y) => {
        row.forEach((value,x) => {
            if (value !== 0) {
                context.fillStyle = colours[value];
                context.fillRect(x + offset.x 
                                ,y + offset.y, 1, 1)
            }
        });
    });
}

function merge(board, player) {
    player.matrix.forEach((row,y) => {
        row.forEach((value,x ) => {
         if (value != 0) {
            board[y + player.pos.y][x + player.pos.x] = value;
         };
        });
    });
}

function playerDrop(){
    player.pos.y++;
    if (collide(board, player)){
        player.pos.y --;
        merge(board, player);
        playerReset();
        boardsweep();
    }
    dropCounter = 0


}

function playerMove(dir) {
    player.pos.x += dir;
    if (collide(board, player)) {
        player.pos.x -= dir;
    }
}

function playerReset(){
    const pieces = "ILJOTSZ"
    player.matrix = createPiece(pieces[pieces.length * Math.random() | 0]);
    player.pos.y = 0
    player.pos.x = (board[0].length/2 | 0) - (player.matrix[0].length/2 | 0);
    if (collide(board,player)) {
        board.forEach(row => row.fill(0))
    }
}

function playerRotate(dir){
    let offset = 1;
    rotate(player.matrix, dir);
    while (collide(board,player)) {
        player.pos.x += offset;
        offset = -(offset + (offset > 0 ? 1: -1));
        if (offset > player.matrix[0].length) {
            rotate(player.matrix, -dir);
            player.pos.x = pos;
            return;
        }
    }
}

function rotate(matrix, dir){
    for (let y = 0; y<matrix.length; ++y){
        for (let x = 0; x < y; ++x) {
            [matrix[x][y],matrix[y][x],] = [ matrix[y][x],matrix[x][y],];
        }
    }
    if (dir>0) {
        matrix.forEach(row => row.reverse());
    } else {
        matrix.reverse();
    }
}

let dropCounter = 0;
let dropInterval = 1000;

let LastTime = 0;

function update(time = 0){
    const deltaTime = time - LastTime;
    LastTime = time;
    
    dropCounter += deltaTime;
    if (dropCounter>dropInterval){
        playerDrop();
    }
    draw();
    requestAnimationFrame(update);
}

function updateScore(){
    document.getElementById('score').innerText = player.score;
}

const colours = [null, 'violet', 'yellow', 'orange', 'blue', 'cyan', 'green', 'red']

const board = createMatrix(10,20);

const player = {
    pos: {x:0, y:0},
    matrix: null,
    score: 0,
}

document.addEventListener('keydown', event =>{
    if (event.keyCode === 37) {
        playerMove(-1);
    } if (event.keyCode === 39) {
        playerMove(1);
    } if (event.keyCode === 40) {
        playerDrop();
    } if (event.keyCode === 81) {
        playerRotate(-1);
    } if (event.keyCode === 38) {
        playerRotate(1);    
    } 
})
playerReset()
update();