const fs = require("fs")
const noise = require("./noise").noise
const RenderMode = require("../ImageConversion/RenderMode/black-white.js")

const Fsizex = 500
const Fsizey = 500
const Frames = 100

function clamp(val , min, max)
{
    return Math.max(Math.min(val, max), min)
}


function CreateFrame(sizex, sizey)
{
    const data = [];
    for (var i = 0; i < sizex*sizey; i++)
    {
        data[i] = 0;
    }
    return {
        data: data,
        sizex: sizex,
        sizey: sizey
    };
}

function area(x1, y1, x2, y2, x3, y3) {
    return Math.abs((x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2)) / 2.0);
}

function DrawTraingle(frame, x1, y1, x2, y2, x3, y3) {
    const up = Math.ceil(Math.max(y1, y2, y3));
    const down = Math.floor(Math.min(y1, y2, y3));
    const right = Math.ceil(Math.max(x1, x2, x3));
    const left = Math.floor(Math.min(x1, x2, x3));

    const sizex = frame.sizex

    console.log(x1, y1, x2, y2, x3, y3)

    for (var x = left; x < right; x++) {
        for (var y = down; y < up; y++) {
            let A = area(x1, y1, x2, y2, x3, y3);
            let A1 = area(x, y, x2, y2, x3, y3);
            let A2 = area(x1, y1, x, y, x3, y3);
            let A3 = area(x1, y1, x2, y2, x, y);

            if (Math.abs(A - (A1 + A2 + A3)) < 1)
                // console.log("Draw")
                frame.data[y*sizex+x] = 1
        }
    }

    return frame
}

function GetCircleWithLine(radius, angle) {
    const Frame = CreateFrame(radius*2+1, radius*2+1)
    for (var y = 0; y < radius*2+1; y++)
    {
        const offset = y*Frame.sizex
        for (var x = 0; x < radius*2+1; x++)
        {
            if (Math.sqrt((x-radius)**2 + (y-radius)**2) <= radius && (x-radius)*angle <= y-radius)
            {
                Frame.data[offset+x] = 1 
            }
        }
    }

    return Frame
}

function DrawSprite(CanvasFrame, SpriteFrame, posx, posy)
{
    const xstart = clamp(posx, 0, CanvasFrame.sizex)-posx
    const xend = clamp(posx+SpriteFrame.sizex, 0, CanvasFrame.sizex)-posx

    const ystart = clamp(posy, 0, CanvasFrame.sizey)-posy
    const yend = clamp(posy+SpriteFrame.sizey, 0, CanvasFrame.sizey)-posy

    const CData = CanvasFrame.data
    const SData = SpriteFrame.data

    for (var x = xstart; x < xend; x++)
    {
        for (var y = ystart; y < yend; y++)
        {
            CData[(y+posy)*CanvasFrame.sizex+x+posx] = SData[y*SpriteFrame.sizex + x] 
            || CData[(y+posy)*CanvasFrame.sizex+x+posx]
        }
    }
}

const FrameData = []
const MainFrame = CreateFrame(Fsizex, Fsizey)

//Creating Mask
const maskFrame = CreateFrame(Fsizex, Fsizey)
const heightcap = 400/2
const warpstrength = 10
const wavespeed = .0075
for (var i = 0; i < Fsizex; i++)
{
    height = (Fsizey-1)-Math.floor(noise(i*wavespeed, 0, 0)*heightcap*2/3 + noise(i*wavespeed*1.25, 500, 0)*heightcap/3)
    for (var y = height; y < Fsizey; y++)
    {
        maskFrame.data[y*Fsizex+i] = 1
    }
}

//Meteor Sprite
const HeadRadius = 10
const TailLength = 60
const BoxHeight = Math.ceil((TailLength+HeadRadius*Math.sqrt(2))/Math.sqrt(2))

const MeteorFrame = CreateFrame(BoxHeight, BoxHeight)
DrawTraingle(MeteorFrame, 
    HeadRadius+Math.cos(3/4*Math.PI)*HeadRadius, BoxHeight-HeadRadius-Math.sin(3/4*Math.PI)*HeadRadius,
    HeadRadius+Math.cos(7/4*Math.PI)*HeadRadius, BoxHeight-HeadRadius-Math.sin(7/4*Math.PI)*HeadRadius,
    BoxHeight, 0)
DrawSprite(MeteorFrame, GetCircleWithLine(HeadRadius, 1), 0, BoxHeight-HeadRadius*2)

for (var i = 0; i < Frames; i++) {
    for (var j = 0; j < Fsizex*Fsizey; j++)
    {
        MainFrame.data[j] = 0;
    }

    DrawSprite(MainFrame, MeteorFrame, 0, i)
    // DrawSprite(MainFrame, maskFrame, 0, 0)

    const FrameClone = {}
    FrameClone.sizex = MainFrame.sizex
    FrameClone.sizey = MainFrame.sizey
    FrameClone.data = []
    for (var k = 0; k < FrameClone.sizex*FrameClone.sizey; k++)
        FrameClone.data[k] = MainFrame.data[k]
    FrameData[i] = FrameClone
}

fs.writeFileSync("video.js", "videodata = "+JSON.stringify(FrameData))