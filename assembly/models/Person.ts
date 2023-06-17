import { consoleLog } from "../env";
import { Frame, getFramesByName } from "../globals/personAnimation";
import { quadXYUV } from "../helpers/quad";
import { map } from './Map';
import { state } from "./State";

function randomColor(): f32 {
  return f32(Math.random() / 1.5);
}

function randomNumber(max: i32): f32 {
  return f32(Math.floor(Math.random() * max));
}

export class Person {
  x: i32 = 0;
  y: i32 = 0;
  rotation: i32 = 0;

  width: i32 = 64;
  height: i32 = 64;

  spriteX: i32 = 0;
  spriteY: i32 = 0;

  animationName: string = 'idle_bottom';
  framesCount: i32 = 0;
  frameIndex: i32 = 0;
  frames: Array<Frame> = [];

  quad: StaticArray<f32> = new StaticArray(4 * 4);
  
  bodyColor: f32 = randomColor();
  bodyType: f32 = randomNumber(5);

  clothesColor: f32 = randomColor();
  clothesType: f32 = randomNumber(11);

  headColor: f32 = randomColor();
  headType: f32 = randomNumber(14);

  legsColor: f32 = randomColor();
  legsType: f32 = randomNumber(5);

  aiTargetX: i32 = i32(Math.floor(Math.random() * map.width)) - 32;
  aiPrevTargetX: i32 = 0;
  aiTargetY: i32 = i32(Math.floor(Math.random() * map.height)) - 32;
  aiPrevTargetY: i32 = 0;

  constructor() {
    this.quad = quadXYUV(this.quad, this.x, this.y, this.width, this.height, 13, 21);
  }
  
  setAnimation(animationName: string, frameIndex: i32 = 0): void {
    const frames: Array<Frame> = this.animationName === animationName
      ? this.frames
      : getFramesByName(animationName);

    if (frames.length === 0) {
      return; // TODO: Error;
    }

    this.frames = frames;
    this.animationName = animationName;
    this.framesCount = frames.length;
    this.frameIndex = frameIndex;

    const u = frames[frameIndex].x / this.width;
    const v = frames[frameIndex].y / this.height;

    this.setSprite(u, v);
  }

  update(): void {
    if (this.x !== this.aiTargetX) {
      if (this.aiTargetX > this.x) {
        this.setPosition(this.x + 1, this.y);
        if (this.animationName !== 'walk_right') {
          this.setAnimation('walk_right', this.frameIndex);
        }
      } else {
        this.setPosition(this.x - 1, this.y);
        if (this.animationName !== 'walk_left') {
          this.setAnimation('walk_left', this.frameIndex);
        }
      }
    } else if (this.y !== this.aiTargetY) {
      if (this.aiTargetY > this.y) {
        this.setPosition(this.x, this.y + 1);
        if (this.animationName !== 'walk_bottom') {
          this.setAnimation('walk_bottom', this.frameIndex);
        }
      } else {
        this.setPosition(this.x, this.y - 1);
        if (this.animationName !== 'walk_top') {
          this.setAnimation('walk_top', this.frameIndex);
        }
      }
    }

    if (this.x === this.aiTargetX && this.y === this.aiTargetY) {
      this.aiTargetX = i32(Math.floor(Math.random() * map.width)) - 32;
      this.aiTargetY = i32(Math.floor(Math.random() * map.height)) - 32;
    }

    if (this.frameIndex < this.framesCount - 1) {
      this.frameIndex++;
    } else {
      this.frameIndex = 0;
    }

    this.setAnimation(this.animationName, this.frameIndex);
  }

  setPosition(x: i32, y: i32): void {
    this.x = x;
    this.y = y;
    const fX1 = f32(x / (state.width * 0.5)) - 1.0;
    const fY1 = -(f32(y / (state.height * 0.5)) - 1.0);
    // this.quad = moveQuadXY(this.quad, x, y, this.width, this.height, 4);
    this.quad[0] = fX1;
    this.quad[1] = fY1;
  }

  setSprite(u: i32, v: i32): void {
    // this.quad = moveQuadUV(this.quad, u, v, 13, 21);

    const width: f32 = 1.0 / 13;
    const height: f32 = 1.0 / 21;

    this.quad[2] = width * f32(u);
    this.quad[3] = -height * f32(v);
  }

  draw(): void {
    // gl.uniform4f(this.bodyColorUniform, this.bodyColor[0], this.bodyColor[1], this.bodyColor[2], this.bodyColor[3]);
    // gl.uniform4f(this.headColorUniform, this.headColor[0], this.headColor[1], this.headColor[2], this.headColor[3]);
    // gl.uniform4f(this.legsColorUniform, this.legsColor[0], this.legsColor[1], this.legsColor[2], this.legsColor[3]);
    // gl.uniform4f(this.clothesColorUniform, this.clothesColor[0], this.clothesColor[1], this.clothesColor[2], this.clothesColor[3]);

    // gl.bufferData<f32>(gl.ARRAY_BUFFER, this.quad, gl.STATIC_DRAW);
    // gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.quad.length / 4);
  }
}