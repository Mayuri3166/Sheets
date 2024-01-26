
for (let i = 0;i < row;i++) {
    for (j = 0;j < cols;j++) {
      let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
      cell.addEventListener("blur", (e) =>  {
        let address = AddressBar.value;
        let [cell, cellProp] = getCellAndCellProp(address);
        let enteredData = cell.innerText;

        if (enteredData == cellProp.value) return;

        cellProp.value = enteredData;
        //if data modified remove parent child relation , formula empty udpdae children with new hardcode value
        removechildfromParent(cellProp.formula);
        cellProp.formula = "";
        updateChildrenCells(address);

        // console.log(cellProp);
      })
    }
}


let formulaBar = document.querySelector(".formula-bar");
formulaBar.addEventListener("keydown", async(e) => {
    let inputFormula  = formulaBar.value;
    if (e.key === "Enter" && inputFormula) {

        let address = AddressBar.value;
        let[cell, cellProp] = getCellAndCellProp(address);
        //if vhange in ofrmula break old parent child relation and
        //evaluate new formula add new parent child relation
        if (inputFormula !== cellProp.formula) {
            removechildfromParent(cellProp.formula);
        }

        addChildToGraphComponent(inputFormula, address);
        //check before evaluation is cyclic or not then only evaluate
        let cycleResponse = isGraphCyclic(graphComponentMatrix);

        if (cycleResponse) {
            // alert("Your formula is cyclic");
            let response = confirm("Your formula is cylic. Do you want to trace your path ?");
            while (response === true) {
                //keep on tracking color until user is satisfied 
                await isGraphCyclicTracePath(graphComponentMatrix, cycleResponse);//full iteration of color tracking so we will attach wait here also
                response = confirm("Your formula is cylic. Do you want to trace your path ?");
            }

            removechildfromGraphComponent(inputFormula, address);
            return;
        }

        let evaluatedValue = Evaluateformula(inputFormula);     

        //to update UI and cellprop in db
        setCellUIAndCellProp(evaluatedValue, inputFormula, address);
        addChildToParent(inputFormula);
        updateChildrenCells(address);

    }
})

function addChildToGraphComponent(formula, childaddress) {
    let [crid, ccid] = decodeRIDCIDfromAddress(childaddress);
    let encodedFormula = formula.split(" ");

    for (let i =0;i < encodedFormula.length;i++) {
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if (asciiValue >= 65 && asciiValue <= 90) {
           let[prid, pcid] = decodeRIDCIDfromAddress(encodedFormula[i]);

           // B1 :A1 + 10 ===A1=0,0
           //rid ->i cid->j
           graphComponentMatrix[prid][pcid].push([crid, ccid]);
        }

    }
}

function removechildfromGraphComponent(formula, childaddress) {
    let [crid, ccid] = decodeRIDCIDfromAddress(childaddress);
    let encodedFormula = formula.split(" ");

    for (let i =0;i < encodedFormula.length;i++) {
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if (asciiValue >= 65 && asciiValue <= 90) {
           let[prid, pcid] = decodeRIDCIDfromAddress(encodedFormula[i]);

           graphComponentMatrix[prid][pcid].pop();
        }

    }

}

function updateChildrenCells(parentaddress) {
    let [parentCell, parentcellProp] = getCellAndCellProp(parentaddress);
    let children = parentcellProp.children;

    //for loop is the base case
    for (let i = 0;i < children.length;i++) {
        let childaddress = children[i];
        let [childcell, childcellProp] = getCellAndCellProp(childaddress);
        let childformula = childcellProp.formula;

        let evaluatedValue = Evaluateformula(childformula);
        setCellUIAndCellProp(evaluatedValue,childformula, childaddress);
        updateChildrenCells(childaddress);
    }
}



function addChildToParent(formula) {
    let Childaddress = AddressBar.value;
    let encodedFormula = formula.split(" ");
    for (let i = 0;i < encodedFormula.length;i++){
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if ( asciiValue >= 65 && asciiValue <= 90) {
            let [parentCell, parentcellProp] = getCellAndCellProp(encodedFormula[i]);
            parentcellProp.children.push(Childaddress);
        }
    }
}

function removechildfromParent(formula) {
    let Childaddress = AddressBar.value;
    let encodedFormula = formula.split(" ");
    for (let i = 0;i < encodedFormula.length;i++){
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if ( asciiValue >= 65 && asciiValue <= 90) {
            let [parentCell, parentcellProp] = getCellAndCellProp(encodedFormula[i]);
            // parentcellProp.children.push(Childaddress);
            let idx = parentcellProp.children.indexOf(Childaddress);
            parentcellProp.children.splice(idx, 1);
        }
    }
}

function Evaluateformula(formula) {
    let encodedFormula = formula.split(" ");
    for (let i = 0; i < encodedFormula.length; i++) {
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if (asciiValue >= 65 && asciiValue <= 90) {
            let [cell, cellProp] = getCellAndCellProp(encodedFormula[i]);
            encodedFormula[i] = cellProp.value;
        }
    }
    let decodedFormula = encodedFormula.join(" ");
    return eval(decodedFormula);
}

function  setCellUIAndCellProp(evaluatedValue, formula, address) {
    // let address = AddressBar.value;
    let [cell, cellProp] = getCellAndCellProp(address);

    cell.innerText = evaluatedValue; //Ui update
    //db uodate
    cellProp.value = evaluatedValue;
    cellProp.formula = formula;
}
