
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
        if (typeof (id) !== "number") {
            throw "Id expected to be a number, it was instead a/an " + typeof(id);
            //return undefined;
        } else if (id < 0 || id > 65535) {
            throw "Id must be an integer between 0 and 65535, it was instead: " + id;
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
        let str = typeId.toString();

        Blocks.prototype.registeredBlocks[ str ] = blockReference;
    }
    static loadTextureMap (fname) {
        Blocks.prototype.textureMap = loadImage(fname);
    }
}

Blocks.prototype.registeredBlocks = {};
Blocks.prototype.textureMap = undefined;
