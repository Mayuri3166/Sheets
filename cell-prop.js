//storage 
let collectedShettDB = []; // contains all SheetDB
let sheetDB = [];

{
    let addSheetbtn = document.querySelector(".sheet-add-icon");
    addSheetbtn.click();
    

}
// for (let i = 0;i < row;i++) {
//     let sheetRow = [];
//     for (let j = 0;j < cols;j++) {
//         let cellprop = {
//             bold : false,
//             italic: false,
//             underline : false,
//             alignment : "left",
//             fontFamily : "monospace",
//             fontSize : "14",
//             fontColor : "#000000",
//             bgcolor: "#000000",//indication purpose(default value )
//             value: "",
//             formula: "",
//             children:[],
             
//         }
//         sheetRow.push(cellprop);
//     }
//     sheetDB.push(sheetRow);
// }

//selectors for cell properties
let bold = document.querySelector(".bold");
let italic= document.querySelector(".italic");
let underline = document.querySelector(".underline");
let fontSize = document.querySelector(".font-size-props");
let fontFamily = document.querySelector(".font-family-props");
let fontColor = document.querySelector(".font-color-prop");
let bgcolor = document.querySelector(".bgcolor-prop");
let alignment = document.querySelectorAll(".alignment");
let leftalign = alignment[0];
let centeralign = alignment[1];
let rightalign = alignment[2];

// let addressBar = document.querySelector(".address-bar");
let activeColorProp = "grey";
let inactiveColorProp = "#ecf0f1";

//application of two way binding
//attach properties listener

bold.addEventListener("click", (e) => {
    let address = AddressBar.value; 
    let[cell, cellProp] = getCellAndCellProp(address); 

   //modification
    cellProp.bold = !cellProp.bold;// true ch false and false ch true toggling
    cell.style.fontWeight = cellProp.bold ? "bold" : "normal";// UI wali change 1
    bold.style.backgroundColor = cellProp.bold ? activeColorProp : inactiveColorProp; // 2nd change
})


italic.addEventListener("click", (e) => {
    let address = AddressBar.value; 
    let[cell, cellProp] = getCellAndCellProp(address); 

   //modification
    cellProp.italic = !cellProp.italic;// true ch false and false ch true toggling
    cell.style.fontStyle = cellProp.italic ? "italic" : "normal";// UI wali change 1
    italic.style.backgroundColor = cellProp.italic ? activeColorProp : inactiveColorProp; // 2nd change
})


underline.addEventListener("click", (e) => {
    let address = AddressBar.value; 
    let[cell, cellProp] = getCellAndCellProp(address); 

   //modification
    cellProp.underline = !cellProp.underline;// true ch false and false ch true toggling
    cell.style.textDecoration = cellProp.underline ? "underline" : "none";// UI wali change 1
    underline.style.backgroundColor = cellProp.underline ? activeColorProp : inactiveColorProp; // 2nd change
})


fontSize.addEventListener("change", (e) => {
    let address = AddressBar.value; 
    let[cell, cellProp] = getCellAndCellProp(address); 
    //modification
    cellProp.fontSize = fontSize.value; //data change
    cell.style.fontSize = cellProp.fontSize + "px";
    fontSize.value = cellProp.fontSize;

})


fontFamily.addEventListener("change", (e) => {
    let address = AddressBar.value; 
    let[cell, cellProp] = getCellAndCellProp(address); 
    //modification
    cellProp.fontFamily = fontFamily.value; //data change
    cell.style.fontFamily = cellProp.fontFamily;
    fontFamily.value = cellProp.fontFamily;

})

fontColor.addEventListener("change", (e) => {
    let address = AddressBar.value; 
    let[cell, cellProp] = getCellAndCellProp(address); 
    //modification
    cellProp.fontColor = fontColor.value; //data change
    cell.style.color = cellProp.fontColor;
    fontColor.value = cellProp.fontColor;
})

bgcolor.addEventListener("change", (e) => {
    let address = AddressBar.value; 
    let[cell, cellProp] = getCellAndCellProp(address); 
    //modification
    cellProp.bgcolor = bgcolor.value; //data change
    cell.style.backgroundColor = cellProp.bgcolor;
    bgcolor.value = cellProp.bgcolor;
})

alignment.forEach((alignElem) => {
    alignElem.addEventListener("click", (e) => {
        let address = AddressBar.value; 
        let[cell, cellProp] = getCellAndCellProp(address); 

        let alignValue = e.target.classList[0];
        cellProp.alignment = alignValue; //data change performed
        cell.style.textAlign = cellProp.alignment;//ui wali change part 1

            switch(alignValue) {// Ui change part2 
                case "left":
                    leftalign.style.backgroundColor = activeColorProp;
                    centeralign.style.backgroundColor = inactiveColorProp;
                    rightalign.style.backgroundColor = inactiveColorProp;
                    break;

                case "center":
                    leftalign.style.backgroundColor = inactiveColorProp;
                    centeralign.style.backgroundColor = activeColorProp;
                    rightalign.style.backgroundColor = inactiveColorProp;
                    break;

                case"right":
                    leftalign.style.backgroundColor = inactiveColorProp;
                    centeralign.style.backgroundColor = inactiveColorProp;
                    rightalign.style.backgroundColor = activeColorProp;
                    break;
        }
        
    })
})

let allcell = document.querySelectorAll(".cell");
for (let i = 0;i < allcell.length;i++) {
    addListenerToAttachCellProperties(allcell[i]); 
}


function addListenerToAttachCellProperties(cell) {
    //work
    cell.addEventListener("click", (e) => {
        let address = AddressBar.value;
        let [rid, cid] = decodeRIDCIDfromAddress(address);
        let cellProp = sheetDB[rid][cid];
        

        //properties appplied on cell
        cell.style.textDecoration = cellProp.underline ? "underline" : "none";
        cell.style.fontStyle = cellProp.italic ? "italic" : "normal";
        cell.style.textDecoration = cellProp.underline ? "underline" : "none";
        cell.style.fontSize = cellProp.fontSize + "px";
        cell.style.fontFamily = cellProp.fontFamily;
        cell.style.color = cellProp.fontColor;
        cell.style.backgroundColor = cellProp.bgcolor == "#000000" ? "transparent" : cellProp.bgcolor; 
        cell.style.textAlign = cellProp.alignment;
        

                //appply properties UI container
                bold.style.backgroundColor = cellProp.bold ? activeColorProp : inactiveColorProp;
                italic.style.backgroundColor = cellProp.italic ? activeColorProp : inactiveColorProp; 
                underline.style.backgroundColor = cellProp.underline ? activeColorProp : inactiveColorProp; 
                fontColor.value = cellProp.fontColor;
                bgcolor.value = cellProp.bgcolor;
                fontSize.value = cellProp.fontSize;
                fontFamily.value = cellProp.fontFamily;


                switch(cellProp.alignment) {// Ui change part2 
                    case "left":
                        leftalign.style.backgroundColor = activeColorProp;
                        centeralign.style.backgroundColor = inactiveColorProp;
                        rightalign.style.backgroundColor = inactiveColorProp;
                        break;
        
                    case "center":
                        leftalign.style.backgroundColor = inactiveColorProp;
                        centeralign.style.backgroundColor = activeColorProp;
                        rightalign.style.backgroundColor = inactiveColorProp;
                        break;
        
                    case"right":
                        leftalign.style.backgroundColor = inactiveColorProp;
                        centeralign.style.backgroundColor = inactiveColorProp;
                        rightalign.style.backgroundColor = activeColorProp;
                        break;
                }
                 let formulaBar = document.querySelector(".formula-bar");
                 formulaBar.value = cellProp.formula;
                 cell.innerText  = cellProp.value;
    })      
}


function getCellAndCellProp(address) {
   let[rid, cid] = decodeRIDCIDfromAddress(address);
   //access cell and storage object chahiye
   let cell = document.querySelector(`.cell[rid="${rid}"][cid="${cid}"]`);
   let cellProp = sheetDB[rid][cid];
   return [cell, cellProp];

}

function decodeRIDCIDfromAddress(address) {
    //address -> "A1" 
    // let rid = Number(address.charCodeAt(1)) - 1; // 1 -> 0 indexed 
    let rid = Number(address.slice(1) - 1); // 1 -> 0 indexed 
    let cid = Number(address.charCodeAt(0)) - 65; // "A"-> 65
    return [rid, cid];

}