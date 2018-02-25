
const AnimationController = require("../animation/animationcontroller.js");
const Entity = require("./entity.js");

class Player extends Entity {
    constructor () {
        super();
        this.isVisible = true;
        this.isAlive = false;
        this.mainColor = "#000";

        this.animationController = new AnimationController();

        this.body = new LinePart("body", 30);

        let head = new CirclePart("head", 25);
        this.body.appendChild(head);

        let rArm = new LinePart("rArm", 11);
        rArm.position.set(0,7);
        rArm.rotation = window.radians(45);
        this.body.appendChild(rArm);

        let rForearm = new LinePart("rForearm", 11);
        rForearm.position.set(0, 11);
        rForearm.rotation = window.radians(10);
        rArm.appendChild(rForearm);

        let lArm = new LinePart("lArm", 11);
        lArm.position.set(0,7);
        lArm.rotation = window.radians(-45);
        this.body.appendChild(lArm);

        let lForearm = new LinePart("lForearm", 11);
        lForearm.position.set(0, 11);
        lForearm.rotation = window.radians(10);
        lArm.appendChild(lForearm);

        let rLeg = new LinePart("rLeg", 11);
        rLeg.position.set(0, 30);
        rLeg.rotation = window.radians(-15);
        this.body.appendChild(rLeg);

        let rForeleg = new LinePart("rForeleg", 11);
        rForeleg.rotation = window.radians(15);
        rLeg.appendChild(rForeleg);

        let lLeg = new LinePart("lLeg", 11);
        lLeg.position.set(0, 30);
        lLeg.rotation = window.radians(15);
        this.body.appendChild(lLeg);

        let lForeleg = new LinePart("lForeleg", 11);
        lForeleg.rotation = window.radians(15);
        lLeg.appendChild(lForeleg);

        this.animationController.setRig(this.body);

        this.position.set(200, 420);
    }

    render () {
        push();

        //Move to the player's position
        translate(this.position.x, this.position.y);

        this.body.draw();

        pop();
    }
}

class Part {
    constructor (name) {
        this.name = name;
        this.children = undefined;
        this.position = window.createVector();
        this.rotation = 0;

        /* Order is instruction on prefered order of parts drawn
         * Parts will be sorted based on their order, and rendered in that order
         */
        this.order = 0;
    }

    draw () {
        if (this.children.length) { //A length of 0 is falsy, and the statement won't execute
            for (let i=0; i<this.children.length; i++) {
                translate(this.position.x, this.position.y);
                if (this.children[i] && this.children[i].draw) {
                    this.children[i].draw();
                }
            }
        }
    }

    static compare (a, b) {
        if (a.order === b.order) {
            return 0;
        } else {
            return a.order - b.order;
        }
    }

    appendChild (child) {
        if (!this.children) this.children = [];
        if (this.children.length === 0) {
            this.children.push(child);
        } else {
            this.children.push(child);
            this.children.sort(this.compare);
        }
    }
}

class LinePart extends Part {
    constructor (name, lineLength) {
        super(name);
        this.lineLength = lineLength;
    }

    draw () {
        push();
        translate(this.position.x, this.position.y);

        line(0,0,0, this.lineLength);

        if (this.children && this.children.length) { //A length of 0 is falsy, and the statement won't execute
            for (let i=0; i<this.children.length; i++) {
                if (this.children[i] && this.children[i].draw) {
                    this.children[i].draw();
                }
            }
        }

        pop();
    }
}

class CirclePart extends Part {
    constructor (name, diameter) {
        super(name);
        this.diameter = diameter;
    }

    draw () {
        push();
        translate(this.position.x, this.position.y);

        ellipse(0,0, this.diameter, this.diameter);

        if (this.children && this.children.length) { //A length of 0 is falsy, and the statement won't execute
            for (let i=0; i<this.children.length; i++) {
                if (this.children[i] && this.children[i].draw) {
                    this.children[i].draw();
                }
            }
        }

        pop();
    }
}

module.exports = Player;