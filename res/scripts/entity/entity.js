
class Entity {
    constructor () {
        this.position = window.createVector(0, 0);
        this.velocity = window.createVector(0, 0);
        this.acceleration = window.createVector(0, 0);
    }
}

module.exports = Entity;