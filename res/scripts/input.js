
let Input = {
    keys:{},
    onKeyUp:function (evt) {
        this.keys[evt.key] = false;
    },
    onKeyDown:function (evt) {
        this.keys[evt.key] = true;
    },
    init:function () {
        document.addEventListener("keypress", (evt)=>this.onKeyDown(evt));
        document.addEventListener("keyup", (evt)=>this.onKeyUp(evt));
    },
    isPressed:function (key) {
        return this.keys[key];
    }
};