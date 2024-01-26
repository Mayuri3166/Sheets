let row = 100;
let cols = 26;

let addressColCont = document.querySelector(".address-col-cont");
let addressrowcont = document.querySelector(".address-row-cont");
let cellscont = document.querySelector(".cells-cont");
let AddressBar = document.querySelector(".address-bar");

for (let i = 0; i < row; i++){
    let addressCol = document.createElement("div");
    addressCol.setAttribute("class","address-col");
    addressCol.innerText= i+1;
    addressColCont.appendChild(addressCol);
}

for ( let i = 0;i < cols; i++){
    let addressrow = document.createElement("div");
    addressrow.setAttribute("class","address-row");
    addressrow.innerText= String.fromCharCode(65+i);
    addressrowcont.appendChild(addressrow);
}

for (let i = 0;i < row;i++){
    let rowcont = document.createElement("div");
    rowcont.setAttribute("class","row-cont");
    for(let j = 0;j < cols;j++){
        let cell = document.createElement("div");
        cell.setAttribute("class", "cell");
        cell.setAttribute("contenteditable", "true");

        cell.setAttribute("spellcheck", "false");
        //attributes for cell and storage identification
        cell.setAttribute("rid", i);
        cell.setAttribute("cid", j);

        rowcont.appendChild(cell);
        addEventListenerForAddressBarDisplay(cell, i, j);
    }
    cellscont.appendChild(rowcont);
}
function addEventListenerForAddressBarDisplay(cell, i, j){
    cell.addEventListener("click",(e) => {
        let rowID = i+1;
        let ColsID = String.fromCharCode(65+j);
        AddressBar.value= `${ColsID}${ rowID }`;
    })
}
