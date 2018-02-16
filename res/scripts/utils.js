
let Utils = {
    /* Array functions
     * Repurposed from https://softwareengineering.stackexchange.com/questions/212808/treating-a-1d-data-structure-as-2d-grid
     * Thank you to Doc Brown's answer!
    */
    /* Two dimensional grid x and y point to a 1d array index
     * x - the x coordinate (integer)
     * y - the y coordinate (integer)
     * width - the width of the grid structure 
    */
    TwoDimToIndex (x, y, width) {
        return x + width * y;
    },
    /* 1d array index to 2d grid X coordinate
     * index - the index in 1d array (integer)
     * width - the width of the grid structure the returned x coordinate belongs to
    */
    IndexToTwoDimX (index, width) {
        return index % width;
    },
    /* 1d array index to 2d grid Y coordinate
     * index - the index in 1d array (integer)
     * width - the width of the grid structure the returned y coordinate belongs to
    */
    IndexToTwoDimY (index, width) {
        return index / width;
    }
};
