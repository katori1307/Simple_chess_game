const SQUARE_SIZE = 80;
const chessboard = document.getElementById("chessboard");
init_chess_game();

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
    
    let leftValue = getLeftValue(e);
    let topValue = getTopValue(e);

    // console.log(leftValue);
    // console.log(topValue);

    if(isValidMove(pieceId, leftValue, topValue)) {
        console.log("valid move");
        document.getElementById(pieceId).style.left = leftValue + "px";
        document.getElementById(pieceId).style.top = topValue + "px";
    }
    else
        console.log("invalid move");

    // document.getElementById(pieceId).style.left = leftValue + "px";
    // document.getElementById(pieceId).style.top = topValue + "px";

    // console.log("Left value after: ", document.getElementById(pieceId).style.left);
    // console.log("Top value after: ", document.getElementById(pieceId).style.top);

}

function test() {
    let pawn2 = document.getElementById("pawn-2");
    pawn2.style.left = SQUARE_SIZE + "px";
    pawn2.style.top = SQUARE_SIZE + "px";
}

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


function isValidMove(pieceId, leftValue, topValue) {
    const piece = document.getElementById(pieceId);
    const oldLeft = parseInt(piece.style.left);
    const oldTop = parseInt(piece.style.top);
    // validate move for pawn
    if(pieceId.match("pawn")) {
        if(topValue > oldTop || Math.abs(topValue - oldTop) > SQUARE_SIZE) {
            console.log("reason 1");
            return false;
        }
        if(leftValue !== oldLeft) {
            console.log(leftValue, " ", parseInt(piece.style.left));
            console.log("reason 2");
            return false;
        }
        return true;
    }
    // validate move for king
    if(pieceId.match("king")) {
        if(Math.abs(leftValue - oldLeft) > SQUARE_SIZE 
        || Math.abs(topValue - oldTop) > SQUARE_SIZE)
            return false;
        return true;
    }
    // validate move for rook
    if(pieceId.match("rook")) {
        // cannot move diagonally
        if(leftValue !== oldLeft && topValue !== oldTop)
            return false;

        // validate rook's path
        
        if(isBlockedPath(pieceId, leftValue, topValue))
            return false;
        // const all_pieces = document.getElementsByClassName("piece");
        // for(let i = 0; i < all_pieces.length; i++) {
        //     if(pieceId === all_pieces[i].id)
        //         continue;
        //     let piece_top = parseInt(all_pieces[i].style.top);
        //     let piece_left = parseInt(all_pieces[i].style.left);
        //     // if(topValue - oldTop > 0 &&  oldLeft === piece_left && (piece_top > oldTop && piece_top < topValue)) {
        //     //     console.log("top value, conflict with ", all_pieces[i].id)
        //     //     return false;
        //     // }
        //     // if(topValue - oldTop < 0 && oldLeft === piece_left && (piece_top > topValue && piece_top < oldTop)) {
        //     //     console.log("top value, conflict with ", all_pieces[i].id)
        //     //     return false;
        //     // }
        //     // if(leftValue - oldLeft > 0 && oldTop === piece_top && (piece_left > oldLeft && piece_left < leftValue)) {
        //     //     console.log("left value, conflict with ", all_pieces[i].id)
        //     //     return false;
        //     // }
        //     // if(leftValue - oldLeft < 0 && oldTop === piece_top  && (piece_left > leftValue && piece_left < oldLeft)) {
        //     //     console.log("left value, conflict with ", all_pieces[i].id)
        //     //     return false;
        //     // }
        //     let oldPos_to_piece = euclidDistance(piece_left, oldLeft, piece_top, oldTop);
        //     let newPos_to_piece = euclidDistance(piece_left, leftValue, piece_top, topValue);
        //     let oldPos_to_newPos = euclidDistance(leftValue, oldLeft, topValue, oldTop);
        //     if(oldPos_to_piece + newPos_to_piece === oldPos_to_newPos) {
        //         console.log("Blocked by: ", all_pieces[i].id);
        //         return false;
        //     }
        // }
        return true;
    }
    // validate move for bishop
    if(pieceId.match("bishop")) {
        if(Math.abs(topValue - oldTop) !== Math.abs(leftValue - oldLeft)) {
            return false;
        }

        // validate bishop's path

        // const all_pieces = document.getElementsByClassName("piece");
        // for(let i = 0; i < all_pieces.length; i++) {
        //     if(all_pieces[i].id === pieceId) {
        //         continue;
        //     } 
        //     const piece_left = parseInt(all_pieces[i].style.left);
        //     const piece_top = parseInt(all_pieces[i].style.top);
        //     if(Math.abs(piece_left - leftValue) === Math.abs(piece_top - topValue)
        //         && Math.abs(piece_left - oldLeft) === Math.abs(piece_top - oldTop)) {
        //         console.log("Bishop's blocked by ", all_pieces[i].id);
        //         return false;
        //     }
        //     return true;
        // }

        if(isBlockedPath(pieceId, leftValue, topValue)) {
            return false;
        }
        return true;
    }

    //validate move for knight
    if(pieceId.match("knight")) {
        if(Math.abs(topValue - oldTop) === 2 * SQUARE_SIZE 
            && Math.abs(leftValue - oldLeft) === SQUARE_SIZE)
            return true;
        if(Math.abs(topValue - oldTop) ===  SQUARE_SIZE 
            && Math.abs(leftValue - oldLeft) === 2 * SQUARE_SIZE)
            return true;    
        return false;
    }

    //validate move for queen
    if(pieceId.match("queen")) {
        if((leftValue === oldLeft && topValue !== oldTop) || (topValue === oldTop && leftValue !== oldLeft)) {
            if(isBlockedPath(pieceId, leftValue, topValue)) {
                return false;
            }
            return true;
        }
            
        if(Math.abs(leftValue - oldLeft) === Math.abs(topValue - oldTop)) {
            if(isBlockedPath(pieceId, leftValue, topValue)) {
                return false;
            }
            return true;
        }
    }
}

function euclidDistance(x1, x2, y1, y2) {
    return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
}

function isBlockedPath(pieceId, leftValue, topValue) {
    const piece = document.getElementById(pieceId);
    const oldLeft = parseInt(piece.style.left);
    const oldTop = parseInt(piece.style.top);
    const all_pieces = document.getElementsByClassName("piece");
    for(let i = 0; i < all_pieces.length; i++) {
        if(pieceId === all_pieces[i].id)
            continue;
        let piece_top = parseInt(all_pieces[i].style.top);
        let piece_left = parseInt(all_pieces[i].style.left);
        let oldPos_to_piece = euclidDistance(piece_left, oldLeft, piece_top, oldTop);
        let newPos_to_piece = euclidDistance(piece_left, leftValue, piece_top, topValue);
        let oldPos_to_newPos = euclidDistance(leftValue, oldLeft, topValue, oldTop);

        if(oldPos_to_piece + newPos_to_piece === oldPos_to_newPos) {
            console.log("Blocked by: ", all_pieces[i].id);
            return true;
        }
    }
    return false;
}