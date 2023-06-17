import { initASWebGLue, ASWebGLReady } from './helpers/ASWebGlue';
import type * as WasmExports from '../assembly/index';

const wasm_file = 'build/untouched.wasm';
// const wasm_file = 'build/optimized.wasm';
let exports: typeof WasmExports;
const cnvs = document.getElementById("cnvs") as HTMLCanvasElement;

cnvs.width = window.innerWidth;
cnvs.height = window.innerHeight;

let framesCount = 0;
let frameTime = 0;

const state = {
  scrollLeft: 0,
  scrollTop: 0,
  width: cnvs.width,
  height: cnvs.height,
  time: 0,
}

function renderFrame(time: number) {
  // call the displayLoop function in the WASM module
  const perf = performance.now();
  state.time = time;

  exports.displayLoop(time);

  frameTime = performance.now() - perf;

  // requestAnimationFrame calls renderFrame the next time a frame is rendered
  requestAnimationFrame(renderFrame);

  framesCount++;
}

function updateTick() {
  exports.update();

  setTimeout(updateTick, 40);
}

function flushFPS() {
  const counter = document.querySelector('#counter');
  if (counter) {
    counter.innerHTML = `${framesCount} : ${frameTime.toFixed(2)}`;
  }

  framesCount = 0;

  setTimeout(flushFPS, 1000);
}

setTimeout(flushFPS, 1000);

const memory = new WebAssembly.Memory({ initial: 100 }); // linear memory

var importObject = {
  env: {
    memory: memory,
    seed: Date.now,
    consoleLog: console.log,
  }
};

initASWebGLue(importObject);

(async () => {
  // use WebAssembly.instantiateStreaming in combination with
  // fetch instead of WebAssembly.instantiate and fs.readFileSync
  let obj = await WebAssembly.instantiateStreaming(
    fetch(wasm_file),
    importObject);
  exports = obj.instance.exports as typeof WasmExports;

  ASWebGLReady(obj, importObject);

  exports.setViewport(state.width, state.height);
  exports.start();

  requestAnimationFrame(renderFrame);
  updateTick();
})();

window.addEventListener('wheel', e => {
  if (e.ctrlKey) {
    return
  }

  e.preventDefault();

  exports.setScroll(e.deltaX, e.deltaY);
}, { passive: false });

window.addEventListener('resize', e => {
  cnvs.width = window.innerWidth;
  cnvs.style.width = `${window.innerWidth}px`;
  cnvs.height = window.innerHeight;
  cnvs.style.height = `${window.innerHeight}px`;

  exports.setViewport(window.innerWidth, window.innerHeight);
}, { passive: false });
