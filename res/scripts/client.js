//http://spasmangames.com/boringman/ is the original

let loadedChunks = [];
window.loadedChunks = loadedChunks;

let nightColor;
let dayColor;
let amount = 0; //0, 1
let direction = false;
let dayCycleAmount = 0.001;

function preload () {
    //Load the texture map for our blocks
    Blocks.loadTextureMap("res/textures/blocks.png");
}

function setup () {
    let winRect = document.getElementById("render_container").getBoundingClientRect();
    let canv = createCanvas(winRect.width, winRect.height);
    canv.parent("render_container");

    nightColor = color(12, 20, 45);
    dayColor = color(180, 240, 255);

    noSmooth();

    //Register some blocks
    let grassBlockRef = new BlockReference("grass", 16, 0, "Grass Block");
    let grassBlockRefId = 1; //Between 0 and 65535
    Blocks.registerBlockReference(grassBlockRef, grassBlockRefId);

    let dirtBlockRef = new BlockReference("dirt", 0, 0, "Dirt Block");
    let dirtBlockRefId = 2; //Between 0 and 65535
    Blocks.registerBlockReference(dirtBlockRef, dirtBlockRefId);

    for (let i=0; i<2; i++) {
        for (let j=0; j<2; j++) {
            let c = new Chunk(i, j);
            loadedChunks.push(c);

            for (let x=0; x<Chunk.prototype.width; x++) {
                
                for (let y=0; y<Chunk.prototype.height; y++) {
                    if (y==0 || x == 0) {
                        c.setBlock(x, y, grassBlockRefId);
                    } else {
                        c.setBlock(x, y, dirtBlockRefId);
                    }
                }
            }

            c.calculatePixels();

        }
    }
}

function draw () {
    if (amount > 0.99) {
        direction = true; //Go back
    } else if (amount < 0.11) {
        direction = false;
    }

    if (direction) {
        amount -= dayCycleAmount;
    } else {
        amount += dayCycleAmount;
    }

    background(lerpColor(nightColor, dayColor, amount));
    for (let i=0; i<loadedChunks.length; i++) {
        if (loadedChunks[i]) {
            //Save previous translation
            push();

            //Translate to the chunk's draw space
            translate(loadedChunks[i].x * Chunk.prototype.drawnPixelWidth, loadedChunks[i].y * Chunk.prototype.drawnPixelHeight);
            //Tell the chunk to draw
            loadedChunks[i].draw();

            //Reset the translation back to where it was
            pop();
        } //TODO handle chunks being undefined
    }
}