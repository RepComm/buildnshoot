
class AnimationController {
    constructor () {
        this.animation = undefined;
        this.currentClip = 0;
        this.rig = undefined;
    }

    setRig (rig) {
        this.rig = rig;
    }
}

module.exports = AnimationController;
