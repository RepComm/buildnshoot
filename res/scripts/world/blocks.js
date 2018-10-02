/* //Usage

let grassBlockRef = new BlockReference("grass", 0, 0, "Grass Block");
let grassBlockRefId = 12; //Between 0 and 65535
Blocks.registerBlockReference(grassBlockRef, 12);

*/

/* Blocks is a static class
 * It is used to keep track of block render/collision/interact instructions
 * There are 65535 possible unique block types
 * The limit is not built into Blocks class, but instead limited to UInt16Array in each chunk instance
*/

const BlockReference = require("./blockreference.js");

class Blocks {
    constructor () {
        throw "Should not instantiate Blocks class!";
    }
    static getRef (id) {
        if (typeof (id) === "number") {
            if (id < 0 || id > 65535) {
                throw "Id must be an integer between 0 and 65535, it was instead: " + id;
            }
            return Blocks.registeredBlocks[id.toString()];
        } else if (typeof (id) == "string") {
            return Blocks.registerBlocks[
                Blocks.byName[id] //Name to id
            ];
        }

        return Blocks.registeredBlocks[id.toString()];
    }
    static registerBlockReference (blockReference, typeId) {
        if (!blockReference) {
            throw "blockReference is " + blockReference;
        }
        if (typeof(blockReference) !== "object") {
            throw "blockReference is a/an " + typeof(blockReference) + ", it should be an object!";
        }

        //Use string instead of integer
        let str = typeId.toString();

        //Unique number should be used
        Blocks.registeredBlocks[ str ] = blockReference;
        //Names may not be unique! Last block registered with same name will overwrite!
        Blocks.byName [ blockReference.name ] = typeId;
    }
    static loadTextureMap (fname) {
        Blocks.textureMap = loadImage(fname);
    }
}

Blocks.registeredBlocks = {};
Blocks.byName = {};
Blocks.textureMap = undefined;

function registerBlocks () {

    Blocks.registerBlockReference(
        new BlockReference("air", -1, -1, "Air Block"),
        0 //Between 0 and 65535
    );

    Blocks.registerBlockReference(
        new BlockReference("dirt", 0, 0, "Dirt Block"),
        1
    );

    Blocks.registerBlockReference(
        new BlockReference("grass", 16, 0, "Grass Block"),
        2
    );

    Blocks.registerBlockReference(
        new BlockReference("stone", 32, 0, "Stone Block"),
        3
    );

}

registerBlocks();

module.exports = Blocks;