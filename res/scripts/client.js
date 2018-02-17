//http://spasmangames.com/boringman/ is the original

let loadedChunks = [];

let nightColor;
let dayColor;
let amount = 0; //0, 1
let direction = false;
let dayCycleAmount = 0.001;
let cam;

function preload () {
    //Load the texture map for our blocks
    Blocks.loadTextureMap("res/textures/blocks.png");
}

function setup () {
    cam = new Camera();
    window.cam = cam;
    Input.init();

    document.addEventListener("click", (evt)=> {
        let worldPixelX = (evt.clientX - cam.x) / World.drawScale;
        let worldPixelY = (evt.clientY - cam.y) / World.drawScale;
        
        let worldBlockX = worldPixelX / Chunk.prototype.blockWidth;
        let worldBlockY = worldPixelY / Chunk.prototype.blockHeight;

        let chunkX = Math.floor( worldBlockX / Chunk.prototype.width );
        let chunkY = Math.floor( worldBlockY / Chunk.prototype.height );

        let chunkBlockX = worldBlockX - (chunkX*Chunk.prototype.blockWidth*Chunk.prototype.width);
        let chunkBlockY = worldBlockY - (chunkY*Chunk.prototype.blockHeight*Chunk.prototype.height);

        console.log(Math.floor(chunkBlockX), Math.floor(chunkBlockY));

        let chunk;
        for (let i=0; i<loadedChunks.length; i++) {
            chunk = loadedChunks[i];
            if (chunk.x == chunkX && chunk.y == chunkY) {
                console.log(chunk);
                chunk.setBlockAndUpdate(
                    Math.floor(chunkBlockX),
                    Math.floor(chunkBlockY),
                    2
                );
                break;
            }
        }

    });

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
                        c.setBlock(x, y, 0);
                    } else {
                        c.setBlock(x, y, 0);
                    }
                }
            }

            c.calculatePixels();

        }
    }
}

function windowResized() {
    let winRect = document.getElementById("render_container").getBoundingClientRect();
    resizeCanvas(winRect.width, winRect.height);
}

function draw () {
    if (Input.isPressed("a")) {
        cam.x+=0.5*World.drawScale;
    } else if (Input.isPressed("d")) {
        cam.x-=0.5*World.drawScale;
    }
    if (Input.isPressed("w")) {
        cam.y+=0.5*World.drawScale;
    } else if (Input.isPressed("s")) {
        cam.y-=0.5*World.drawScale;
    }
    push();
    translate(cam.x, cam.y);
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
    pop();
}