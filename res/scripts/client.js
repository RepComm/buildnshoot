//http://spasmangames.com/boringman/ is the original

const Chunk = require("./world/chunk.js");
const Blocks = require("./world/blocks.js");
const Camera = require("./utils/camera.js");
const Input = require("./utils/input.js");
const Player = require("./entity/player.js");
const Utils = require("./utils/utils.js");

const fs = require("fs");

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

let worldBackground;

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
        Chunk.blockWidth
    );

    mousePos.worldPixelY = Utils.roundToNext(
        (mousePos.y - cam.y) / World.drawScale,
        Chunk.blockHeight
    );

    mousePos.worldBlockX = mousePos.worldPixelX/Chunk.blockWidth;
    mousePos.worldBlockY = mousePos.worldPixelY/Chunk.blockHeight;

    mousePos.posStr = mousePos.worldBlockX + ", " + mousePos.worldBlockY;
}

function preload () {
    //Load the texture map for our blocks
    Blocks.loadTextureMap("res/textures/blocks.png");
    
    worldBackground = loadImage("res/textures/seamless_forest_night_01.png");
}

window.preload = preload;

function setup () {
    window.frameRate(60);
    localPlayer = new Player();
    window.localPlayer = localPlayer;

    cam = new Camera();

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

            for (let x=0; x<Chunk.width; x++) {
                for (let y=0; y<Chunk.height; y++) {
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
                        if ( Math.random() < y / Chunk.height ) {
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
        
        selection.worldBlockX = selection.worldPixelX / Chunk.blockWidth;
        selection.worldBlockY = selection.worldPixelY / Chunk.blockHeight;

        selection.chunkX = Math.floor( selection.worldBlockX / Chunk.width );
        selection.chunkY = Math.floor( selection.worldBlockY / Chunk.height );

        selection.chunkBlockX = selection.worldBlockX - (selection.chunkX*Chunk.width);
        selection.chunkBlockY = selection.worldBlockY - (selection.chunkY*Chunk.height);

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

    document.addEventListener("wheel", (evt)=> {
        if (evt.deltaY === 0) {

        } else if (evt.deltaY > 0) {
            inventorySelectedSlot+=1;
        } else {
            inventorySelectedSlot-=1;
        }
        if (inventorySelectedSlot < 0) {
            inventorySelectedSlot = inventory.length-1;
        } else if (inventorySelectedSlot > inventory.length-1) {
            inventorySelectedSlot = 0;
        }
    });

    document.addEventListener("mousemove", (evt)=>{
        mousePos.x = evt.clientX;
        mousePos.y = evt.clientY;

        updateBlockSelect();
    });

    document.addEventListener("keydown", (evt)=> {
        if (localPlayer.okayToAnimate && Input.isPressed(evt.key)) return;
        if (evt.keyCode == 68) {
            
        } else if (evt.keyCode === 65) {
            
        }
        //console.log(evt.keyCode);
        if (evt.keyCode === 83) {
            
        }
    });

    document.addEventListener("keyup", (evt)=> {
        if (evt.keyCode === 68 || evt.keyCode === 65 || evt.keyCode === 83) {
            
        }
    });

    Input.init();
}

window.setup = setup;

function windowResized() {
    winRect = document.getElementById("render_container").getBoundingClientRect();
    resizeCanvas(winRect.width, winRect.height);
}

window.windowResized = windowResized;

function draw () {
    if (Input.isPressed("a")) {
        localPlayer.position.x -= localPlayer.walkSpeed*World.drawScale;
        updateBlockSelect();
    } else if (Input.isPressed("d")) {
        localPlayer.position.x += localPlayer.walkSpeed*World.drawScale;
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

    let width = winRect.height*(worldBackground.width/worldBackground.height);
    if (-cam.x/2 < 0) {
        push();
        translate(-width-cam.x/2, -cam.y);
        image( worldBackground, 0, 0, width, winRect.height );
        pop();
    }
    push();
    translate(-cam.x/2, -cam.y);
    image( worldBackground, 0, 0, width, winRect.height );
    pop();

    for (let i=0; i<loadedChunks.length; i++) {
        if (loadedChunks[i]) {
            //Save previous translation
            push();

            //Translate to the chunk's draw space
            translate(loadedChunks[i].x * Chunk.drawnPixelWidth, loadedChunks[i].y * Chunk.drawnPixelHeight);
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

    strokeWeight(1);
    rect(
        mousePos.worldPixelX*World.drawScale,
        mousePos.worldPixelY*World.drawScale,
        Chunk.blockWidth*World.drawScale,
        Chunk.blockHeight*World.drawScale
    );

    translate(-cam.x, -cam.y);
    translate(
        winRect.width/2 - (((inventoryMaxDisplayedSlots+1) * Chunk.blockWidth*World.drawScale)/2),
        -Chunk.blockHeight*World.drawScale
    );
    for (let i=0; i<inventoryMaxDisplayedSlots;i++) {
        if (i === inventorySelectedSlot) {
            stroke(200);
        } else {
            stroke(0);
        }
        
        rect(
            i*(Chunk.blockWidth+2)*World.drawScale,
            winRect.height-Chunk.blockHeight*World.drawScale,
            Chunk.blockWidth*World.drawScale,
            Chunk.blockHeight*World.drawScale
        );
    }

    pop();
}

window.draw = draw;