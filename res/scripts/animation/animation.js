
const Clip = require("./clip.js");

class Animation {
    constructor (name) {
        this.name = name;
        this.clips = undefined;
    }

    static fromJsonObject (jsonObject) {
        let result = new Animation(jsonObject.name);
        
        let clipNames = Object.keys(jsonObject.clips);
        let clip;
        result.clips = [];

        for (let i=0; i<clipNames.length; i++) {
            clip = Clip.fromJsonObject( clipNames[i], jsonObject.clips[clipNames[i]] );
            result.clips.push(clip);
        }

        return result;
    }

    static fromJsonString (jsonString) {
        return this.fromJsonObject( JSON.parse(jsonString) );
    }
}

module.exports = Animation;
