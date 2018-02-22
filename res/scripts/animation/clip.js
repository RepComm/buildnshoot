
const Property = require("./property.js");

class Clip {
    constructor (name) {
        this.name = name;
        this.fps = 1;
        this.interpolate = true;
        this.properties = undefined;
    }

    static fromJsonObject (name, jsonObject) {
        let result = new Clip(name);
        
        let propertyNames = Object.keys(jsonObject).filter(key => {
            switch (key) {
                case "name":break;
                case "fps":break;
                case "interpolate":break;
                default:
                    return true;
            }
        });

        result.properties = [];
        let propertyJson;
        for (let i=0; i<propertyNames.length; i++) {
            result.properties.push(
                Property.fromJsonObject(
                    result[
                        propertyNames[i]
                    ]
                )
            );
            
        }

        return result;
    }
}

module.exports = Clip;
