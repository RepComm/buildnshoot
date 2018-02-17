
const path = require("path");

class Chunk {
    constructor (x, y) {
        //Integer position
        this.x = (x || 0);
        this.y = (y || 0);

        this.collideData = undefined;

        //Block data, Unsigned Short (2 bytes), 65535 combinations
        this.data = new Uint16Array(Chunk.prototype.width * Chunk.prototype.height);

        //The chunk is rendered as an image
        this.image = createImage(
            Chunk.prototype.width * Chunk.prototype.blockWidth,
            Chunk.prototype.height * Chunk.prototype.blockHeight
        );
    }

    calculatePixels () {
        if (!Blocks.prototype.textureMap) {
            throw "No texture map is loaded! Use Blocks.loadTextureMap(fname); before calculating pixels!";
        }

        let i;
        let ref;
        let blockTypeId;

        this.image.loadPixels();
        this.image.pixels.fill(0);
        this.image.updatePixels();

        for (let xi=0; xi<Chunk.prototype.width;xi++) {
            for (let yi=0; yi<Chunk.prototype.height;yi++) {
                //Get the data index (1d array) given 2d coordinates
                i = Utils.TwoDimToIndex(xi, yi, Chunk.prototype.width);
                //Grab the block's type id (what type of block it is)
                blockTypeId = this.data[i];
                //Get the block's render instructions given its id
                ref = Blocks.getRef(blockTypeId);
                if (ref !== undefined) {
                    this.image.copy(
                        //Texture map to use (contains all of the blocks in one image)
                        Blocks.prototype.textureMap,
                        //Where to copy pixels from in the texture map
                        ref.imageMinX,
                        ref.imageMinY,
                        //Size to copy from texture map (always block size)
                        Chunk.prototype.blockWidth,
                        Chunk.prototype.blockHeight,
                        //Where to draw the block at in this chunk/image
                        xi*Chunk.prototype.blockWidth,
                        yi*Chunk.prototype.blockHeight,
                        //Size to draw (always block size)
                        Chunk.prototype.blockWidth,
                        Chunk.prototype.blockHeight
                    );
                } else {
                    throw blockTypeId +" is not a registered block";
                }
            }
        }
    }

    setBlock (x, y, id) {
        if (typeof (x) !== "number") throw "x must be an integer";
        if (typeof (y) !== "number") throw "y must be an integer";
        if (typeof (id) !== "number") {
            if (typeof(id) !== "string") {
                throw "id must be an integer id or string name";
            } else {
                this.data[ Utils.TwoDimToIndex(x, y, Chunk.prototype.width) ] = Blocks.prototype.byName[id];
            }
        } else {
            if (id < 0 || id > 65535) throw "id must be integer between 0 and 65535";
            this.data[ Utils.TwoDimToIndex(x, y, Chunk.prototype.width) ] = id;
        }
    }

    setBlockAndUpdate (x, y, id) {
        this.setBlock(x, y, id);
        this.calculatePixels();
    }

    draw () {
        image(this.image, 0, 0, Chunk.prototype.drawnPixelWidth, Chunk.prototype.drawnPixelHeight);
    }
}

//Static block width/height
Chunk.prototype.width = 16;
Chunk.prototype.height = 8;

//Static block pixel width/height
Chunk.prototype.blockWidth = 16;
Chunk.prototype.blockHeight = 16;

//READONLY chunk pixel width/height
Chunk.prototype.pixelWidth = Chunk.prototype.width * Chunk.prototype.blockWidth;
Chunk.prototype.pixelHeight = Chunk.prototype.height * Chunk.prototype.blockHeight;

let World = {};
World.drawScale = 3;

//Chunk DRAWN pixel width/height
Chunk.prototype.drawnPixelWidth = Chunk.prototype.pixelWidth*World.drawScale;
Chunk.prototype.drawnPixelHeight = Chunk.prototype.pixelHeight*World.drawScale;