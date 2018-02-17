
class BlockReference {
    constructor (name, imageMinX, imageMinY, displayName, collision) {
        this.name = name;
        this.imageMinX = imageMinX;
        this.imageMinY = imageMinY;
        this.displayName = displayName;
        if (collision === undefined) collision = false;
        this.collision = collision;
    }
}
