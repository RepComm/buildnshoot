
class AnimationProperty {
    constructor (name) {
        this.name = name;
    }

    static fromJsonObject (name, jsonObject) {
        let result = new AnimationProperty(name);
        
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

module.exports = AnimationProperty;
