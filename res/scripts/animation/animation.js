
const Clip = require("./clip.js");

class Animation {
    constructor (name) {
        this.name = name;
    }

    static fromJsonObject (jsonObject) {
        let result = new Animation(jsonObject.name);
        
        let clipNames = Object.keys(result.clips);
        let clip;

        for (let i=0; i<clipNames.length; i++) {
            clip = Clip.fromJsonObject( clipNames[i], result.clips[clipNames[i]] );

        }

        return result;
    }

    static fromJsonString (jsonString) {
        return this.loadFromJsonObject( JSON.parse(jsonString) );
    }
}

module.exports = Animation;
