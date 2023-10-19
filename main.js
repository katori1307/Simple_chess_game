const SQUARE_SIZE = 80;

const chessboard = document.getElementById("chessboard");
init_chess_game();
// test();

// console.log(document.getElementById("pawn-1").style.left);
// console.log(document.getElementById("pawn-1").style.top);
// if(document.getElementById("pawn-1").style.left === 0)
//     console.log("true");
// else
//     console.log("false");   


function create_chessboard() {
    let isWhite = true;
    for(let row = 0; row < 8; row++) {
        for(let col = 0; col < 8; col++) {
            const square = document.createElement("div");
            square.className = "square";
            if(isWhite === true) {
                square.style.backgroundColor = "#eeeed2";
                isWhite = false;
            }
            else {
                square.style.backgroundColor = "#769656";
                isWhite = true;
            }
                
            square.addEventListener("dragover", allowDrop);
            square.addEventListener("drop", dropHandler);
            chessboard.appendChild(square);
        }
        if(isWhite)
            isWhite = false;
        else
            isWhite = true;
    }
}



function allowDrop(e) {
    e.preventDefault();
}

function init_pieces() {
    let piece_list = document.getElementsByClassName("piece");
    let pawn_list = document.getElementsByClassName("pawn");
    let other_piece = document.getElementsByClassName("special");
    for(let i = 0; i < piece_list.length; i++) {
        piece_list[i].setAttribute("draggable", "true");
        piece_list[i].addEventListener("dragstart", dragstartHandler);
    }
    for(let i = 0; i < pawn_list.length; i++) {
        pawn_list[i].style.left = SQUARE_SIZE * i + "px";
        pawn_list[i].style.top = SQUARE_SIZE * 6 + "px";
    }
    for(let i = 0; i < other_piece.length; i++) {
        other_piece[i].style.left = SQUARE_SIZE * i + "px";
        other_piece[i].style.top = SQUARE_SIZE * 7 + "px";
    }
    

}

function init_chess_game() {
    create_chessboard();
    init_pieces();
}

function dragstartHandler(e) {
    e.dataTransfer.setData("text/plain", e.target.textContent);
    e.dataTransfer.setData("text/id", e.target.id);
}


// 2nd try
function dropHandler(e) {
    e.preventDefault();
    let pieceSymbol = e.dataTransfer.getData("text/plain");
    let pieceId = e.dataTransfer.getData("text/id");

    // console.log("Text: " + pieceSymbol);
    // console.log("ID: " + pieceId);

    // console.log("Left value before: ", document.getElementById(pieceId).style.left);
    // console.log("Top value before: ", document.getElementById(pieceId).style.top);

    let rect = chessboard.getBoundingClientRect();
    // console.log("rect left: ", rect.left);
    // console.log("rect top: ", rect.top);
    
    let leftValue = getLeftValue(e);
    let topValue = getTopValue(e);

    // console.log(leftValue);
    // console.log(topValue);

    // Đặt vị trí mới cho phần tử được thả
    document.getElementById(pieceId).style.left = leftValue + "px";
    document.getElementById(pieceId).style.top = topValue + "px";

    // console.log("Left value after: ", document.getElementById(pieceId).style.left);
    // console.log("Top value after: ", document.getElementById(pieceId).style.top);

}

function test() {
    let pawn2 = document.getElementById("pawn-2");
    pawn2.style.left = SQUARE_SIZE + "px";
    pawn2.style.top = SQUARE_SIZE + "px";
}

// function getLeftValue(e) {
//     for(let i = 0; i <= 8; i++) {
//         if(SQUARE_SIZE * i >= e.offsetX)
//             return SQUARE_SIZE * (i - 1);
//     }
// }

// function getTopValue(e) {
//     for(let i = 0; i <= 8; i++) {
//         if(SQUARE_SIZE * i >= e.offsetY)
//             return SQUARE_SIZE * (i - 1);
//     }
// }



function getLeftValue(e) {
    let rect = chessboard.getBoundingClientRect();
    let value = e.clientX - rect.left;
    for (let i = 0; i < 8; i++) {
        if (SQUARE_SIZE * i <= value && value < SQUARE_SIZE * (i + 1)) {
            return SQUARE_SIZE * i;
        }
    }
    return SQUARE_SIZE * 7;
}


function getTopValue(e) {
    let rect = chessboard.getBoundingClientRect();
    let value = e.clientY - rect.top;
    for (let i = 0; i < 8; i++) {
        if (SQUARE_SIZE * i <= value && value < SQUARE_SIZE * (i + 1)) {
            return SQUARE_SIZE * i;
        }
    }
    return SQUARE_SIZE * 7;
}


