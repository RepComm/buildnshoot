//http://spasmangames.com/boringman/ is the original

const Chunk = require("./world/chunk.js");
const Blocks = require("./world/blocks.js");
const Camera = require("./utils/camera.js");
const Input = require("./utils/input.js");
const Player = require("./entity/player.js");
const Utils = require("./utils/utils.js");

let loadedChunks = [];

let winRect;

let nightColor;
let dayColor;
let amount = 0; //0, 1
let direction = false;
let dayCycleAmount = 0.001;
let cam;
let inventorySelectedSlot = 0;
let inventory = ["grass", "dirt", "stone"];
let inventoryMaxDisplayedSlots = 9;

let localPlayer;

window.setBlockRef = function(id) {
    currentBlockRefId = id;
}

let mousePos = {
    x:0,
    y:0,
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

function updateBlockSelect () {
    mousePos.worldPixelX = Utils.roundToNext(
        (mousePos.x - cam.x) / World.drawScale,
        Chunk.prototype.blockWidth
    );

    mousePos.worldPixelY = Utils.roundToNext(
        (mousePos.y - cam.y) / World.drawScale,
        Chunk.prototype.blockHeight
    );

    mousePos.worldBlockX = mousePos.worldPixelX/Chunk.prototype.blockWidth;
    mousePos.worldBlockY = mousePos.worldPixelY/Chunk.prototype.blockHeight;

    mousePos.posStr = mousePos.worldBlockX + ", " + mousePos.worldBlockY;
}

function preload () {
    //Load the texture map for our blocks
    Blocks.loadTextureMap("res/textures/blocks.png");
}

window.preload = preload;

function setup () {
    localPlayer = new Player();
    window.localPlayer = localPlayer;

    cam = new Camera();
    Input.init();

    cursor(CROSS);

    winRect = document.getElementById("render_container").getBoundingClientRect();
    let canv = createCanvas(winRect.width, winRect.height);
    canv.parent("render_container");

    nightColor = color(12, 20, 45);
    dayColor = color(180, 240, 255);

    noSmooth();

    for (let i=0; i<2; i++) {
        for (let j=0; j<4; j++) {
            let c = new Chunk(i, j);
            loadedChunks.push(c);

            for (let x=0; x<Chunk.prototype.width; x++) {
                for (let y=0; y<Chunk.prototype.height; y++) {
                    if (j === 0) {

                    } else if (j === 1) {
                        if (y < 2) {
                            c.setBlock(x, y, "air");
                        } else if (y == 2) {
                            c.setBlock(x, y, "grass");
                        } else if (y > 4) {
                            c.setBlock(x, y, "dirt");
                        } else {
                            c.setBlock(x, y, "dirt");
                        }
                    } else if (j === 2) {
                        if ( Math.random() < y / Chunk.prototype.height ) {
                            c.setBlock(x, y, "stone");
                        } else {
                            c.setBlock(x, y, "dirt");
                        }
                    } else {
                        c.setBlock(x, y, "stone");
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
    });

    document.addEventListener("mousemove", (evt)=>{
        mousePos.x = evt.clientX;
        mousePos.y = evt.clientY;

        updateBlockSelect();
    });
}

window.setup = setup;

function windowResized() {
    let winRect = document.getElementById("render_container").getBoundingClientRect();
    resizeCanvas(winRect.width, winRect.height);
}

window.windowResized = windowResized;

function draw () {
    if (Input.isPressed("a")) {
        localPlayer.position.x -= 0.5*World.drawScale;
        updateBlockSelect();
    } else if (Input.isPressed("d")) {
        localPlayer.position.x += 0.5*World.drawScale;
        updateBlockSelect();
    }
    if (Input.isPressed("w")) {
        localPlayer.position.y -= 0.5*World.drawScale;
        updateBlockSelect();
    } else if (Input.isPressed("s")) {
        localPlayer.position.y += 0.5*World.drawScale;
        updateBlockSelect();
    }

    cam.x = winRect.width/2-localPlayer.position.x;
    cam.y = winRect.height/2-localPlayer.position.y;

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

    localPlayer.render();

    noFill();
    stroke(0);
    
    textSize(12);
    text(
        mousePos.posStr,
        mousePos.worldPixelX*World.drawScale,
        mousePos.worldPixelY*World.drawScale-2
    );

    strokeWeight(World.drawScale);
    rect(
        mousePos.worldPixelX*World.drawScale,
        mousePos.worldPixelY*World.drawScale,
        Chunk.prototype.blockWidth*World.drawScale,
        Chunk.prototype.blockHeight*World.drawScale
    );

    translate(-cam.x, -cam.y);
    translate(
        winRect.width/2 - ((inventoryMaxDisplayedSlots * Chunk.prototype.blockWidth*World.drawScale)/2),
        -Chunk.prototype.blockHeight*World.drawScale
    );
    for (let i=0; i<inventoryMaxDisplayedSlots;i++) {
        if (i === inventorySelectedSlot) {
            stroke(200);
        } else {
            stroke(0);
        }
        rect(
            i*(Chunk.prototype.blockWidth+2)*World.drawScale,
            winRect.height-Chunk.prototype.blockHeight*World.drawScale,
            Chunk.prototype.blockWidth*World.drawScale,
            Chunk.prototype.blockHeight*World.drawScale
        );
    }

    pop();
}

window.draw = draw;