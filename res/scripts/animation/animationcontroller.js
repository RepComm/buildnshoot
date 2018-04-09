
class AnimationController {
    constructor() {
        this.isPlaying = true;
        this.animation = undefined;
        this.currentClipIndex = 0;
        this.currentClip = undefined;
        this.currentClipProgress = 0.0;
        this.currentClipProperty = undefined;
        this.rig = undefined;
    }

    setRig(rig) {
        this.rig = rig;
    }

    setAnimation(animation) {
        this.animation = animation;
    }

    setPlaying(isPlaying) {
        this.isPlaying = isPlaying;
    }

    setPlayingClip(name) {
        let id = -1;
        for (let i = 0; i < this.animation.clips.length; i++) {
            if (this.animation.clips[i].name === name) {
                id = i;
                break;
            }
        }
        if (id < 0) throw "No animation by that name";
        this.currentClipIndex = id;
        this.currentClip = this.animation.clips[this.currentClipIndex];
    }

    getPlayingClip() {
        return this.animation.clips[this.currentClipIndex].name;
    }

    update() {
        if (!this.currentClip || !this.isPlaying) return;
        this.currentClipProgress += (this.currentClip.fps / window.frameRate());
        if (this.currentClipProgress > 1.0) this.currentClipProgress = 0.0;

        for (let i = 0; i < this.currentClip.properties.length; i++) {
            this.currentClipProperty = this.currentClip.properties[i];
            if (!this.currentClipProperty.rotation) continue;
            if (this.currentClipProperty.rotation.length < 2) continue;
            this.rig.properties[
                this.currentClipProperty.name
            ].rotation = window.radians(window.lerp(
                this.currentClipProperty.rotation["0"],
                this.currentClipProperty.rotation["1"],
                this.currentClipProgress
            ));
        }
    }
}

module.exports = AnimationController;
