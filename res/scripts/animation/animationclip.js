
const AnimationProperty = require("./animationproperty.js");

class AnimationClip {
    constructor (name) {
        this.name = name;
        this.fps = 1;
        this.interpolate = true;
        this.properties = undefined;
    }

    static fromJsonObject (name, jsonObject) {
        let result = new AnimationClip(name);
        
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

        result.fps = jsonObject.fps;
        if (!result.fps) result.fps = 1;

        let propertyNames = Object.keys(jsonObject).filter(key => {
            switch (key) {
                case "name":break;
                case "fps":break;
                case "interpolate":break;
                case "loop":break;
                default:
                    return true;
            }
        });

        result.properties = [];
        for (let i=0; i<propertyNames.length; i++) {
            result.properties.push(
                AnimationProperty.fromJsonObject(
                    propertyNames[i],
                    jsonObject[
                        propertyNames[i]
                    ]
                )
            );
            
        }

        return result;
    }
}

module.exports = AnimationClip;
