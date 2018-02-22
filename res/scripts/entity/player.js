
const remote = require('electron').remote;
const Entity = require("./entity.js");

class Player extends Entity {
    constructor () {
        super();
        this.isVisible = true;
        this.isAlive = false;
        this.mainColor = "#000";
        this.currentAnimation = "basepose";
        this.animation = undefined;

        this.bodyLength = 30;
        this.headDiameter = 25;
        this.armHalfLength = 11;
        this.legHalfLength = 15;
        this.drawLineWidth = 3;

        this.rightArmRotation = window.radians(45);
        this.rightForearmRotation = window.radians(10);
        this.leftArmRotation = window.radians(-45);
        this.leftForearmRotation = window.radians(10);

        this.leftLegRotation = window.radians(15);
        this.leftForelegRotation = window.radians(15);

        this.rightLegRotation = window.radians(-15);
        this.rightForelegRotation = window.radians(15);

        this.position.set(200, 420);
    }

    render () {
        push();

        //Move to the player's position
        translate(this.position.x, this.position.y);

        noStroke();
        fill(this.mainColor);

        //Draw the head
        ellipse(0,-this.headDiameter/2,this.headDiameter);

        noFill();
        strokeWeight(this.drawLineWidth);
        stroke(this.mainColor);

        //Draw body
        line(0,0,0,this.bodyLength);

        push(); //====DRAW LEFT ARM
            translate(0, this.bodyLength/4);

            rotate(this.leftArmRotation);
            line(0, 0, 0, this.armHalfLength);

            push(); //====DRAW LEFT FOREARM
                translate(0, this.armHalfLength);
                rotate(this.leftForearmRotation);
                line(0,0,0,this.armHalfLength);
            pop();

            //====DRAW RIGHT ARM
            rotate( this.rightArmRotation -this.leftArmRotation );
            line(0, 0, 0, this.armHalfLength);

            //Draw forearm
            push();
                translate(0, this.armHalfLength);
                rotate(this.rightForearmRotation);
                line(0,0,0,this.armHalfLength);
            pop();
        pop(); //====END DRAWING ARMS====

        //Draw legs
        translate(0, this.bodyLength);

        rotate(this.leftLegRotation);
        line(0, 0, 0, this.legHalfLength);

        //Draw lower leg
        push();
        translate(0, this.legHalfLength);
        rotate(this.leftForelegRotation);
        line(0, 0, 0, this.legHalfLength);
        pop();

        //Continue drawing legs
        rotate( this.rightLegRotation -this.leftLegRotation );
        line(0, 0, 0, this.legHalfLength);

        //Draw lower leg
        push();
        translate(0, this.legHalfLength);
        rotate(this.rightForelegRotation);
        line(0, 0, 0, this.legHalfLength);
        pop();

        pop();
    }
}

module.exports = Player;