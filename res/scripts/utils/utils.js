
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
    },
    /* Round a number to the next (not nearest) number
     * Examples:
     * roundToNext(4, 5) -> returns 5
     * roundToNext(42.291, 50) -> returns 50
     * roundToNext(2.123, 3) -> returns 3
     * roundToNext(11.1, 11) -> returns 22
     * roundToNext(100.001, 100) -> returns 200
     * 
     * n - the number to round
     * next - the number to clip by (snap to highest)
    */
    roundToNext (n, next) {
        let isNeg = (n < 0);
        if (isNeg) {n -= next};
        let resto = n%next;
        if (resto <= (next)) { 
            return n-resto;
        } else {
            return n+next-resto;
        }
    },
    /* Round a number 'n' to the nearest 'to'
     * Examples:
     * roundTo(4, 5) -> returns 5
     * roundToNext(0.5, 1) -> returns 1
     * roundToNext(0.49, 1) -> returns 0
     * roundToNext(2.1, 2) -> returns 2
     * roundToNext(2.5, 1) -> returns 3
     * 
     * n - the number to round
     * to - the number to round to
    */
    roundTo (n, to) {
        var resto = n%to;
        if (resto <= (to/2)) { 
            return n-resto;
        } else {
            return n+to-resto;
        }
    }
};

module.exports = Utils;
