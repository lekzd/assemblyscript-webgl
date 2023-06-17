import { consoleLog } from './env';
import { WebGLBuffer, GLint, WebGLVertexArrayObject } from './WebGL'
import { Person } from './models/Person';
import { gl } from './globals/gl';
import { program } from './globals/program';
import { spriteLoader } from './globals/spriteLoader';
import { tweens } from './globals/tweens';
import { quadXYUV } from './helpers/quad';
import { state } from './models/State';
import { clamp } from './helpers/clamp';
import { map } from './models/Map';

const bodyTexures: StaticArray<string> = [
  'assets/bodies.png',
]

const headTexures: StaticArray<string> = [
  'assets/hairs.png',
]

const legsTexures: StaticArray<string> = [
  'assets/legs.png',
]

const clothesTexures: StaticArray<string> = [
  'assets/clothes.png',
]

function loadTextures(textures: StaticArray<string>): void {
  for (let index = 0; index < textures.length; index++) {
    spriteLoader.add(textures[index]);
  }
}

loadTextures(bodyTexures);
loadTextures(headTexures);
loadTextures(legsTexures);
loadTextures(clothesTexures);

gl.useProgram(program);

const position_al: GLint = gl.getAttribLocation(program, 'position');
const obj_position_al: GLint = gl.getAttribLocation(program, 'objPosition');
const tex_coord_al: GLint = gl.getAttribLocation(program, 'tex_coord');
const color_al: GLint = gl.getAttribLocation(program, 'color');
const type_al: GLint = gl.getAttribLocation(program, 'type');
const scroll_al: GLint = gl.getAttribLocation(program, 'scroll');
const resolution_al: GLint = gl.getAttribLocation(program, 'resolution');

const npc_body_ul: GLint = gl.getUniformLocation(program, 'npc_body');
const npc_head_ul: GLint = gl.getUniformLocation(program, 'npc_head');
const npc_legs_ul: GLint = gl.getUniformLocation(program, 'npc_legs');
const npc_clothes_ul: GLint = gl.getUniformLocation(program, 'npc_clothes');

const personsCount: i32 = 10_000;
const numVertices: i32 = 16;
const translationByteLength = 4;

const translation: StaticArray<f32> = new StaticArray<f32>(personsCount * translationByteLength);
const colors: StaticArray<f32> = new StaticArray<f32>(personsCount * translationByteLength);
const types: StaticArray<f32> = new StaticArray<f32>(personsCount * translationByteLength);
const persons: Array<Person> = [];

var quadVAO: WebGLVertexArrayObject;
var quadVBO: WebGLBuffer;
var instanceVBO: WebGLBuffer;
var colorsVBO: WebGLBuffer;
var typesVBO: WebGLBuffer;

export function start(): void {
  for (let i = 0; i < personsCount; i++) {
    const countPerRow = i32(Math.sqrt(personsCount));
    const distance = i32(map.width / countPerRow);

    const x = ((i % countPerRow) * distance) - 32;
    const y = i32(Math.floor(i / countPerRow) * distance) - 32;

    const npc = new Person();

    npc.setPosition(x, y);
    persons.push(npc);

    const index = i * translationByteLength;

    colors[index + 0] = npc.bodyColor;
    colors[index + 1] = npc.legsColor;
    colors[index + 2] = npc.headColor;
    colors[index + 3] = npc.clothesColor;

    types[index + 0] = npc.bodyType;
    types[index + 1] = npc.legsType;
    types[index + 2] = npc.headType;
    types[index + 3] = npc.clothesType;
  }

  instanceVBO = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, instanceVBO);
  gl.bufferData(gl.ARRAY_BUFFER, translation, gl.DYNAMIC_DRAW);

  colorsVBO = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorsVBO);
  gl.bufferData(gl.ARRAY_BUFFER, colors, gl.DYNAMIC_DRAW);

  typesVBO = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, typesVBO);
  gl.bufferData(gl.ARRAY_BUFFER, types, gl.DYNAMIC_DRAW);
  
  quadVAO = gl.createVertexArray();
  gl.bindVertexArray(quadVAO);
  
  const quad_data: StaticArray<f32> = quadXYUV(new StaticArray<f32>(numVertices), 0, 0, 64, 64, 13, 21);
  quadVBO = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quadVBO);
  gl.bufferData<f32>(gl.ARRAY_BUFFER, quad_data, gl.STATIC_DRAW);

  gl.enableVertexAttribArray(position_al);
  gl.vertexAttribPointer(position_al, 2, gl.FLOAT, +false, numVertices, 0);

  gl.enableVertexAttribArray(tex_coord_al);
  gl.vertexAttribPointer(tex_coord_al, 2, gl.FLOAT, +false, numVertices, numVertices / 2);

  gl.bindBuffer(gl.ARRAY_BUFFER, instanceVBO);
  
  gl.enableVertexAttribArray(obj_position_al);
  gl.vertexAttribPointer(obj_position_al, 4, gl.FLOAT, +false, numVertices, 0);
  gl.vertexAttribDivisor(obj_position_al, 1);
  
  gl.bindBuffer(gl.ARRAY_BUFFER, colorsVBO);

  gl.enableVertexAttribArray(color_al);
  gl.vertexAttribPointer(color_al, 4, gl.FLOAT, +false, numVertices, 0);
  gl.vertexAttribDivisor(color_al, 1);
  
  gl.bindBuffer(gl.ARRAY_BUFFER, typesVBO);

  gl.enableVertexAttribArray(type_al);
  gl.vertexAttribPointer(type_al, 4, gl.FLOAT, +false, numVertices, 0);
  gl.vertexAttribDivisor(type_al, 1);

  gl.bindBuffer(gl.ARRAY_BUFFER, 0);

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  //             R    G    B    A
  gl.clearColor(53 / 255, 64 / 255, 73 / 255, 1.0);
}

export function setScroll(scrollLeft: f32, scrollTop: f32): void {
  state.scrollLeft = clamp(state.scrollLeft + scrollLeft, 0, map.width);
  state.scrollTop = clamp(state.scrollTop + scrollTop, 0, map.height);

  gl.vertexAttrib2f(scroll_al, state.scrollLeft, state.scrollTop);
}

export function setViewport(width: i32, height: i32): void {
  state.width = width;
  state.height = height;

  gl.vertexAttrib2f(resolution_al, f32(state.width), f32(state.height));
  gl.viewport(0, 0, state.width, state.height);
}

export function displayLoop(time: u32): void {
  state.time = time;

  spriteLoader.update();
  tweens.update(time);

  gl.clear(gl.COLOR_BUFFER_BIT);
  
  let personsToDraw = 0;
  let personsStart = 0;
  let index = 0;
  
  for (let i = 0; i < persons.length; i++) {
    const npc = persons[i];

    const left = i32(state.scrollLeft * 0.5) - 64;
    const right = state.width + left + 64;

    if (npc.x > right || npc.x < left) {
      continue;
    }

    const top = i32(state.scrollTop * 0.5) - 64;
    const bottom = state.height + top + 64;

    if (npc.y < top || npc.y > bottom) {
      continue;
    }

    // x
    translation[index + 0] = npc.quad[0];
    // y
    translation[index + 1] = npc.quad[1];
    // u
    translation[index + 2] = npc.quad[2];
    // v
    translation[index + 3] = npc.quad[3];

    // colors
    colors[index + 0] = npc.bodyColor;
    colors[index + 1] = npc.legsColor;
    colors[index + 2] = npc.headColor;
    colors[index + 3] = npc.clothesColor;

    // types
    types[index + 0] = npc.bodyType;
    types[index + 1] = npc.legsType;
    types[index + 2] = npc.headType;
    types[index + 3] = npc.clothesType;

    index += translationByteLength;
    personsToDraw++;
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, instanceVBO);
  gl.bufferData(gl.ARRAY_BUFFER, translation, gl.DYNAMIC_DRAW);

  gl.bindBuffer(gl.ARRAY_BUFFER, colorsVBO);
  gl.bufferData(gl.ARRAY_BUFFER, colors, gl.DYNAMIC_DRAW);

  gl.bindBuffer(gl.ARRAY_BUFFER, typesVBO);
  gl.bufferData(gl.ARRAY_BUFFER, types, gl.DYNAMIC_DRAW);

  gl.bindVertexArray(quadVAO);

  spriteLoader.useSprite('assets/bodies.png', npc_body_ul);
  gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, personsToDraw);

  spriteLoader.useSprite('assets/hairs.png', npc_head_ul);
  gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, personsToDraw);

  spriteLoader.useSprite('assets/legs.png', npc_legs_ul);
  gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, personsToDraw);

  spriteLoader.useSprite('assets/clothes.png', npc_clothes_ul);
  gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, personsToDraw);
}

export function update(): void {  
  persons.sort((a, b) => {
    return ((a.y * map.width) + a.x) - ((b.y * map.width) + b.x);
  });
  
  for (let i = 0; i < persons.length; i++) {
    const npc = persons[i];
    npc.update();
  }
}