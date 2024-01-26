// storage 2d matrix (basic needed)
let collectedGraphComponent = [];
let graphComponentMatrix = [];

// for ( let i = 0;i < row;i++) {
//     let rows = [];
//     for ( let j = 0;j < cols;j++) {
//         //more than one child ka relation banega so array we are going to use
//         //dependency
//         rows.push([]);
//     }
//     graphComponentMatrix.push(rows);
// }

//child representation in the form of decoder rid and cid

//relation (formula madhe relation tayar hot hote)

// it will return boolean value if true then fraph is cyclic otherwise no
function isGraphCyclic(graphComponentMatrix) {
    //dependency visisted and dfs visited(2d array)
    let visited = []; // node visited trace
    let dfsVisited = []; // stack visit trace

    for (let i = 0;i < row;i++) {
        let visitedRow = [];
        let dfsvisitedRow = [];
        for(let j = 0;j < cols;j++) {

            visitedRow.push(false);
            dfsvisitedRow.push(false);
        }
        visited.push(visitedRow);
        dfsVisited.push(dfsvisitedRow);
    }
    
    for (let i = 0;i < row; i++) {
        for(let j = 0;j <cols;j++) {
            if (visited[i][j] == false) {

                let response = dfsCycleDetection(graphComponentMatrix, i, j, visited, dfsVisited);
                if ( response == true) {
                    //found cycle so returned immmediately true no need to explore more
                    return [i, j];
                }
            }
        }
    }
    return null;
}

// start ->visited true and dfs visited true 
//end dfs visited false stack se remove kar denge
//if visited[i][j] is true then go back already explored no need explore it again
//cycle detection condition : if (visited[i][j]==true and dfsvisited[i][i]==true)=cycle
//return boolean
function dfsCycleDetection(graphComponentMatrix, srcr, srcc, visited, dfsVisited) {
    visited[srcr][srcc] = true;
    dfsVisited[srcr][srcc] = true;

    //A1 -> [[0,1][1,0],[5,10]...........] children of A1 
    for (let children = 0;children < graphComponentMatrix[srcr][srcc].length;children++) {
        let [nbrr, nbrc] = graphComponentMatrix[srcr][srcc][children];
        if (visited[nbrr][nbrc] === false) {
            let response = dfsCycleDetection(graphComponentMatrix, nbrr, nbrc, visited, dfsVisited);
            if(response === true)   return true; //found cycle so returned immmediately true no need to explore more
        
        }
        else if (visited[nbrr][nbrc] == true && dfsVisited[nbrr][nbrc] == true) {
            return true;//found cycle so returned immmediately true no need to explore more
        }
    }

    dfsVisited[srcr][srcc] = false;
    return false;
}