
class EntityLeaf {
    constructor (name, parent) {
        if (name) this.name = name;
        this.parent = parent;
        this.position = window.createVector(0, 0);
        this.velocity = window.createVector(0, 0);
        this.acceleration = window.createVector(0, 0);
        this.rotation = {value:0};
    }
}

class EntityBranch extends EntityLeaf {
    constructor (name, parent) {
        super(name, parent);
        this.children = undefined;
    }
    getAllChildren (callback) {
        let result = [];
        this.getAllChildrenIterate(result);
        callback(result);
    }
    getAllChildrenIterate (array) {
        if (array) {
            if (this.children && this.children.length > 0) {
                for (let i=0; i<this.children.length; i++) {
                    if (this.children[i]) {
                        array.push(this.children[i]);
                        this.children[i].getAllChildrenIterate(array);
                    }
                }
            }
        } else {
            throw "No array specified to add to..";
        }
    }
    removeFromParent() {
        if (this.parent) {
            let index = this.parent.children.indexOf(this);
            if (i === -1 || i > this.parent.children.length) return false;
            return this.parent.children.splice(index, 1);
        }
    }
    setParent (parent) {
        this.removeFromParent();
        this.parent = parent;
        this.parent.children.push(this);
    }
    appendChild (child) {
        if (!this.children) this.children = [];
        if (this.children.length !== 0) {
            this.children.sort(this.compare);
        }
        child.setParent(this);
    }
}

module.exports = {EntityBranch, EntityLeaf};