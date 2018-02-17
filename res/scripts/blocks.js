
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
class Blocks {
    constructor () {
        throw "Should not instantiate Blocks class!";
    }
    static getRef (id) {
        if (typeof (id) === "number") {
            if (id < 0 || id > 65535) {
                throw "Id must be an integer between 0 and 65535, it was instead: " + id;
            }
            return Blocks.prototype.registeredBlocks[id.toString()];
        } else if (typeof (id) == "string") {
            return Blocks.prototype.registerBlocks[
                Blocks.prototype.byName[id] //Name to id
            ];
        }

        return Blocks.prototype.registeredBlocks[id.toString()];
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
        Blocks.prototype.registeredBlocks[ str ] = blockReference;
        //Names may not be unique! Last block registered with same name will overwrite!
        Blocks.prototype.byName [ blockReference.name ] = typeId;
    }
    static loadTextureMap (fname) {
        Blocks.prototype.textureMap = loadImage(fname);
    }
}

Blocks.prototype.registeredBlocks = {};
Blocks.prototype.byName = {};
Blocks.prototype.textureMap = undefined;

function registerBlocks () {

    Blocks.registerBlockReference(
        new BlockReference("air", 0, 0, "Air Block"),
        0 //Between 0 and 65535
    );

    Blocks.registerBlockReference(
        new BlockReference("dirt", 16, 0, "Dirt Block"),
        1
    );

    Blocks.registerBlockReference(
        new BlockReference("grass", 32, 0, "Grass Block"),
        2
    );

}

registerBlocks();