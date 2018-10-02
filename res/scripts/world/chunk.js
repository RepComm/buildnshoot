
const Blocks = require("./blocks.js");
const Utils = require("../utils/utils.js");

class Chunk {
    constructor (x, y) {
        //Integer position
        this.x = (x || 0);
        this.y = (y || 0);

        this.collideData = undefined;

        //Block data, Unsigned Short (2 bytes), 65535 combinations
        this.data = new Uint16Array(Chunk.width * Chunk.height);

        //The chunk is rendered as an image
        this.image = createImage(
            Chunk.width * Chunk.blockWidth,
            Chunk.height * Chunk.blockHeight
        );
    }

    calculatePixels () {
        if (!Blocks.textureMap) {
            throw "No texture map is loaded! Use Blocks.loadTextureMap(fname); before calculating pixels!";
        }

        this.clearPixels();

        for (let xi=0; xi<Chunk.width;xi++) {
            for (let yi=0; yi<Chunk.height;yi++) {
                this.calculateBlockPixels(xi, yi);
            }
        }
    }

    calculateBlockPixels (x, y) {
        let i = Utils.TwoDimToIndex(x, y, Chunk.width);
        //Grab the block's type id (what type of block it is)
        let blockTypeId = this.data[i];

        if (blockTypeId === 0) {
            return; //We already cleared the air block (probably..)
        }

        //Get the block's render instructions given its id
        let ref = Blocks.getRef(blockTypeId);
        if (ref !== undefined) {
            this.image.copy(
                //Texture map to use (contains all of the blocks in one image)
                Blocks.textureMap,
                //Where to copy pixels from in the texture map
                ref.imageMinX,
                ref.imageMinY,
                //Size to copy from texture map (always block size)
                Chunk.blockWidth,
                Chunk.blockHeight,
                //Where to draw the block at in this chunk/image
                x*Chunk.blockWidth,
                y*Chunk.blockHeight,
                //Size to draw (always block size)
                Chunk.blockWidth,
                Chunk.blockHeight
            );
        } else {
            throw blockTypeId +" is not a registered block";
        }
    }

    clearPixels () {
        this.image.loadPixels();
        this.image.pixels.fill(0);
        this.image.updatePixels();
    }

    clearBlockPixels (x, y) {
        this.image.loadPixels();
        for (let xi=x*Chunk.blockWidth; xi<(x*Chunk.blockWidth)+Chunk.blockWidth; xi++) {
            for (let yi=y*Chunk.blockHeight; yi<(y*Chunk.blockHeight)+Chunk.blockHeight; yi++) {
                /*Not the most efficient method,
                but we'll fix it later,
                and its still more efficient than calculating the whole chunk again.
                */
                this.image.set(xi, yi, color(255,255,255,0));
            }
        }
        this.image.updatePixels();
    }

    setBlock (x, y, id) {
        if (typeof (x) !== "number") throw "x must be an integer";
        if (typeof (y) !== "number") throw "y must be an integer";
        if (typeof (id) !== "number") {
            if (typeof(id) !== "string") {
                throw "id must be an integer id or string name";
            } else {
                this.data[ Utils.TwoDimToIndex(x, y, Chunk.width) ] = Blocks.byName[id];
            }
        } else {
            if (id < 0 || id > 65535) throw "id must be integer between 0 and 65535";
            this.data[ Utils.TwoDimToIndex(x, y, Chunk.width) ] = id;
        }
    }

    setBlockAndUpdate (x, y, id) {
        this.clearBlockPixels(x, y);
        this.setBlock(x, y, id);
        this.calculateBlockPixels(x, y);
    }

    draw () {
        image(this.image, 0, 0, Chunk.drawnPixelWidth, Chunk.drawnPixelHeight);
    }
}

//Static block width/height
Chunk.width = 16;
Chunk.height = 8;

//Static block pixel width/height
Chunk.blockWidth = 16;
Chunk.blockHeight = 16;

//READONLY chunk pixel width/height
Chunk.pixelWidth = Chunk.width * Chunk.blockWidth;
Chunk.pixelHeight = Chunk.height * Chunk.blockHeight;

let World = {};
World.drawScale = 3;
window.World = World;

//Chunk DRAWN pixel width/height
Chunk.drawnPixelWidth = Chunk.pixelWidth*World.drawScale;
Chunk.drawnPixelHeight = Chunk.pixelHeight*World.drawScale;

module.exports = Chunk;
