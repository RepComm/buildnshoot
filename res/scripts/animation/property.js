
class Property {
    constructor (name) {
        this.name = name;
        this.loop = false;
        this.loopStart = 0;
        this.loopEnd = 0;
    }

    static fromJsonObject (name, jsonObject) {
        let result = new Property(name);
        if(jsonObject.loop) {
            let split = jsonObject.loop.split("-");
            if (split.length == 1) {
                result.loop = true;
                result.loopStart = parseInt(split[0]);
            } else if (split.length > 1) {
                result.loop = true;
                result.loopStart = parseInt(split[0]);
                result.loopEnd = parseInt(split[1]);
            }
        }
        
        if (jsonObject.rotation) {
            result.rotation = jsonObject.rotation;
        }
        if (jsonObject.translation) {
            throw "Translation in animation property is not supported yet!";
        }
        if (jsonObject.scale) {
            throw "Scale in animation property is not supported yet!";
        }
        return result;
    }
}

module.exports = Property;
