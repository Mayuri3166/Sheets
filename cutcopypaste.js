let ctrlKey;
document.addEventListener("keydown", (e) => {
    ctrlKey = e.ctrlKey;
})
document.addEventListener("keyup", (e) => {
    ctrlKey = e.ctrlKey;
})

for (let i = 0; i < row; i++) {
    for (let j = 0; j < cols; j++) {
        let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
        handleSelectorCells(cell);
    }
}

let copybtn = document.querySelector(".copy");
let cutbtn = document.querySelector(".cut");
let pastebtn = document.querySelector(".paste");



let rangeStorage = [];
function handleSelectorCells (cell) {
    cell.addEventListener("click", (e) => {
        //select cells range 
        if (!ctrlKey)    return;
        if (rangeStorage.length >= 2) {
            defaultSelectorCellUI();
            rangeStorage = [];
        }

        //Ui indication
        cell.style.border = "3px solid grey";

        let rid = Number(cell.getAttribute("rid"));
        let cid = Number(cell.getAttribute("cid"));
        rangeStorage.push([rid, cid]);

    })
}

function defaultSelectorCellUI() {
    for (let i = 0; i < rangeStorage.length; i++) {
        let cell = document.querySelector(`.cell[rid="${rangeStorage[i][0]}"][cid="${rangeStorage[i][1]}"]`); 
        cell.style.border = "1px solid lightgrey";
    }

}



let copyData = [];  
copybtn.addEventListener("click", (e) => {

    if (rangeStorage.length < 2)    return;
    copyData = [];

    let [startRow, startCol, endRow, endCol] = [rangeStorage[0][0], rangeStorage[0][1], rangeStorage[1][0], rangeStorage[1][1]];

    for (let i = startRow; i <=endRow ; i++) {
        let copyROW = [];
        for (let j = startCol; j <= endCol; j++) {
            let cellProp = sheetDB[i][j];
            copyROW.push(cellProp);
        }
        copyData.push(copyROW);
    } 

    // console.log(copyData);
    defaultSelectorCellUI();
})




cutbtn.addEventListener("click", (e) => {

    if (rangeStorage.length < 2)    return;
    copyData = [];

    let [startRow, startCol, endRow, endCol] = [rangeStorage[0][0], rangeStorage[0][1], rangeStorage[1][0], rangeStorage[1][1]];

    for (let i = startRow; i <=endRow ; i++) {
        let copyRow = [];
        for (let j = startCol; j <= endCol; j++) {
            // let cellProp = sheetDB[i][j];

            let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);

            //db
            let cellProp = sheetDB[i][j];
            let cellPropCopy = JSON.parse(JSON.stringify(sheetDB[i][j]));
            copyRow.push(cellPropCopy);

            cellProp.value = "";
            cellProp.italic = false;
            cellProp.bold = false;
            cellProp.underline = false;
            cellProp.fontSize = "14";
            cellProp.fontFamily = "monospace";
            cellProp.fontColor = "#000000";
            cellProp.bgcolor = "#000000";
            cellProp.alignment = "#left";       

            //UI 
            cell.click();
        }
        copyData.push(copyRow);
       
    } 
    defaultSelectorCellUI();
})




pastebtn.addEventListener("click", (e) => {
    //paste cells Data
    if (rangeStorage.length < 2)    return;

    let rowDiff = Math.abs(rangeStorage[0][0] - rangeStorage[1][0]);
    let colDiff = Math.abs(rangeStorage[0][1] - rangeStorage[1][1]); 

    let address = AddressBar.value;
    let[startrow, startcol] = decodeRIDCIDfromAddress(address);

    //r refers copydata row and c refers copydata column
    for (let i = startrow, r = 0; i <= startrow+rowDiff; i++, r++) {
        for (let j = startcol, c = 0; j <= startcol+colDiff; j++, c++) {
            let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
            if (!cell)  continue;

            //db change and UI change
            //DB
            let data = copyData[r][c]
            let cellProp = sheetDB[i][j];

            cellProp.value = data.value;
            cellProp.bold = data.bold;
            cellProp.italic = data.italic;
            cellProp.underline = data.underline;
            cellProp.fontSize = data.fontSize;
            cellProp.fontFamily = data.fontFamily;
            cellProp.fontColor = data.fontColor;
            cellProp.bgcolor = data.bgcolor;
            cellProp.alignment = data.alignment;

            //UI 
            cell.click();

        }
    }

     
})
