let addSheetbtn = document.querySelector(".sheet-add-icon");

let activeSheetColor = "#ced6e0";
let sheetsFolderCont = document.querySelector(".sheets-folder-cont");
// let allSheetFolders = document.querySelectorAll(".sheet-folder");
addSheetbtn.addEventListener("click", (e) => {
    let sheet= document.createElement("div");
    sheet.setAttribute("class", "sheet-folder");
    
    let allSheetFolders = document.querySelectorAll (".sheet-folder");
    sheet.setAttribute("id", allSheetFolders.length);

    sheet.innerHTML = `
        <div class="sheet-content">Sheet ${allSheetFolders.length+1}</div>
    `;

    sheetsFolderCont.appendChild(sheet);
    sheet.scrollIntoView();
    
    //DB storage for each single sheet
    createSheetDB();
    createGraphComponentMatrix();
    handleSheetActiveness(sheet);
    handleSheetRemoval(sheet);
    sheet.click();

})
function handleSheetRemoval(sheet) {
    sheet.addEventListener("mousedown", (e) => {
        e.button // 0 left click 1 drag option on mouse and 2 will be right click
        if (e.button !== 2) return;

        let allSheetFolders = document.querySelectorAll(".sheet-folder");
        if (allSheetFolders.length === 1) {
            alert("You need to have atleast one sheet");
            return;
        }

        let response = confirm("your sheet will be removed permanently, Are you sure?");
        if(response === false)  return;

        let sheetIdx = Number(sheet.getAttribute("id"));

        //db removal
        collectedShettDB.splice(sheetIdx, 1);
        collectedGraphComponent.splice(sheetIdx, 1);

        //UI removal
        handleSheetUIRemoval(sheet);

        //by default bring sheet 1 to active assign db to sheet1
        sheetDB = collectedShettDB[0];
        graphComponentMatrix = collectedGraphComponent[0];
        handlesheetProperties();

    })
}
function handleSheetUIRemoval (sheet) {
     //UI will be removed
     sheet.remove();
     let allSheetFolders = document.querySelectorAll (".sheet-folder");
     for ( let i = 0; i < allSheetFolders.length; i++) {
        allSheetFolders[i].setAttribute("id", i);
        let sheetContent = allSheetFolders[i].querySelector(".sheet-content");
        sheetContent.innerText = `Sheet ${i+1}`;
        allSheetFolders[i].style.backgroundColor = "transparent";
     }

     allSheetFolders[0].style.backgroundColor = activeSheetColor;
}

function handleSheetDB(sheetIdx) {
    sheetDB = collectedShettDB[sheetIdx];
    graphComponentMatrix = collectedGraphComponent[sheetIdx];

}

function handlesheetProperties() {
    for ( let i = 0;i < row;i++) {
        for (let j = 0;j < cols;j++) {
            let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
            cell.click();
        }
    }
    let firstcell = document.querySelector(".cell");
    firstcell.click();
}

function handleSheetUI(sheet) {
    let allSheetFolders = document.querySelectorAll (".sheet-folder"); 
    for ( let i = 0; i < allSheetFolders.length; i++) {
        allSheetFolders[i].style.backgroundColor = "transparent";
    }
    sheet.style.backgroundColor = "#ced6e0";
}

function handleSheetActiveness(sheet) {
    sheet.addEventListener("click", (e) => {
        let sheetIdx = Number(sheet.getAttribute("id"));
        handleSheetDB(sheetIdx);
        handlesheetProperties();
        handleSheetUI(sheet);
    })
}

function createSheetDB() {
    //storage 
    let sheetDB = [];

    for (let i = 0;i < row;i++) {
        let sheetRow = [];
        for (let j = 0;j < cols;j++) {
            let cellprop = {
                bold : false,
                italic: false,
                underline : false,
                alignment : "left",
                fontFamily : "monospace",
                fontSize : "14",
                fontColor : "#000000",
                bgcolor: "#000000",//indication purpose(default value )
                value: "",
                formula: "",
                children:[],
                
            }
            sheetRow.push(cellprop);
        }
        sheetDB.push(sheetRow);
    }
    collectedShettDB.push(sheetDB);
}

function createGraphComponentMatrix() {
    let graphComponentMatrix = [];

    for ( let i = 0;i < row;i++) {
        let rows = [];
        for ( let j = 0;j < cols;j++) {
            //more than one child ka relation banega so array we are going to use
            //dependency
            rows.push([]);
        }
        graphComponentMatrix.push(rows);
    }
    collectedGraphComponent.push(graphComponentMatrix);
}