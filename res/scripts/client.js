//http://spasmangames.com/boringman/ is the original

let loadedChunks = [];

let nightColor;
let dayColor;
let amount = 0; //0, 1
let direction = false;
let dayCycleAmount = 0.001;
let cam;
let inventorySelectedSlot = 0;
let inventory = ["grass", "dirt"];
//'background-image':"url(" + Canvas.toDataURL("image/png")+ ")";

window.setBlockRef = function(id) {
    currentBlockRefId = id;
}

let mousePos = {
    documentX:0,
    documentY:0,
    worldPixelX:0,
    worldPixelY:0,
    worldBlockX:0,
    worldBlockY:0,
    posStr:"0, 0"
};

let selection = {
    worldPixelX:0,
    worldPixelY:0,
    worldBlockX:0,
    worldBlockY:0,
    chunkX:0,
    chunkY:0,
    chunkBlockX:0,
    chunkBlockY:0,
    chunk:undefined
};

function preload () {
    //Load the texture map for our blocks
    Blocks.loadTextureMap("res/textures/blocks.png");
}

function setup () {
    cam = new Camera();
    window.cam = cam;
    Input.init();

    let winRect = document.getElementById("render_container").getBoundingClientRect();
    let canv = createCanvas(winRect.width, winRect.height);
    canv.parent("render_container");

    nightColor = color(12, 20, 45);
    dayColor = color(180, 240, 255);

    noSmooth();

    for (let i=0; i<2; i++) {
        for (let j=0; j<1; j++) {
            let c = new Chunk(i, j);
            loadedChunks.push(c);

            for (let x=0; x<Chunk.prototype.width; x++) {
                for (let y=0; y<Chunk.prototype.height; y++) {
                    if (y < 2) {
                        c.setBlock(x, y, "air");
                    } else if (y == 2) {
                        c.setBlock(x, y, "grass");
                    } else {
                        c.setBlock(x, y, "dirt");
                    }
                }
            }

            c.calculatePixels();
        }
    }
    
    function setBlockAtDocumentPixels (px, py, blockId) {
        if (!blockId) return;
        selection.worldPixelX = (px - cam.x) / World.drawScale;
        selection.worldPixelY = (py - cam.y) / World.drawScale;
        
        selection.worldBlockX = selection.worldPixelX / Chunk.prototype.blockWidth;
        selection.worldBlockY = selection.worldPixelY / Chunk.prototype.blockHeight;

        selection.chunkX = Math.floor( selection.worldBlockX / Chunk.prototype.width );
        selection.chunkY = Math.floor( selection.worldBlockY / Chunk.prototype.height );

        selection.chunkBlockX = selection.worldBlockX - (selection.chunkX*Chunk.prototype.width);
        selection.chunkBlockY = selection.worldBlockY - (selection.chunkY*Chunk.prototype.height);

        for (let i=0; i<loadedChunks.length; i++) {
            selection.chunk = loadedChunks[i];
            if (selection.chunk.x == selection.chunkX &&
                selection.chunk.y == selection.chunkY) {
                
                selection.chunk.setBlockAndUpdate(
                    Math.floor(selection.chunkBlockX),
                    Math.floor(selection.chunkBlockY),
                    blockId
                );
                break;
            }
        }
    }

    document.addEventListener("click", (evt)=> {
        setBlockAtDocumentPixels(evt.clientX, evt.clientY, "air");
    });

    document.addEventListener('contextmenu', function(evt) {
        evt.preventDefault();
        if (!inventory[inventorySelectedSlot]) return;
        setBlockAtDocumentPixels(evt.clientX, evt.clientY, inventory[inventorySelectedSlot]);
        return false;
    }, false);

    document.addEventListener("mousewheel", (evt)=> {
        inventorySelectedSlot+=1;
        if (inventorySelectedSlot > inventory.length-1) {
            inventorySelectedSlot = 0;
        }
        console.log(inventorySelectedSlot, inventory[inventorySelectedSlot]);
    });

    Number.prototype.roundTo = function(num) {
        var resto = this%num;
        if (resto <= (num/2)) { 
            return this-resto;
        } else {
            return this+num-resto;
        }
    }

    //TODO - DONE - Works for negative block coordinates
    Number.prototype.roundToBounds = function(num) {
        let thiz = this;
        let isNeg = (thiz < 0);
        if (isNeg) {thiz -= num};
        let resto = thiz%num;
        if (resto <= (num)) { 
            return thiz-resto;
        } else {
            return thiz+num-resto;
        }
    }

    document.addEventListener("mousemove", (evt)=>{
        mousePos.x = evt.clientX;
        mousePos.y = evt.clientY;

        mousePos.worldPixelX = (mousePos.x - cam.x) / World.drawScale;
        mousePos.worldPixelX = mousePos.worldPixelX.roundToBounds(Chunk.prototype.blockWidth);

        mousePos.worldPixelY = (mousePos.y - cam.y) / World.drawScale;
        mousePos.worldPixelY = mousePos.worldPixelY.roundToBounds(Chunk.prototype.blockHeight);

        mousePos.worldBlockX = mousePos.worldPixelX/Chunk.prototype.blockWidth;
        mousePos.worldBlockY = mousePos.worldPixelY/Chunk.prototype.blockHeight;

        mousePos.posStr = mousePos.worldBlockX + ", " + mousePos.worldBlockY;
    });
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

    noFill();
    stroke(0);

    textSize(10);
    text(
        mousePos.posStr,
        mousePos.worldPixelX*World.drawScale,
        mousePos.worldPixelY*World.drawScale
    );

    rect(
        mousePos.worldPixelX*World.drawScale,
        mousePos.worldPixelY*World.drawScale,
        Chunk.prototype.blockWidth*World.drawScale,
        Chunk.prototype.blockHeight*World.drawScale
    );

    pop();
}