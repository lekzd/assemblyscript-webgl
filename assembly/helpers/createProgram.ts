import { gl } from "../globals/gl";
import { WebGLProgram, WebGLShader } from "../WebGL";

export function createProgram(vertexShader: string, fragmentShader: string): WebGLProgram {
  let vertex_shader: WebGLShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertex_shader, vertexShader);
  gl.compileShader(vertex_shader);
  
  let fragment_shader: WebGLShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragment_shader, fragmentShader);
  gl.compileShader(fragment_shader);
  
  let program: WebGLProgram = gl.createProgram();
  
  gl.attachShader(program, vertex_shader);
  gl.attachShader(program, fragment_shader);
  
  gl.linkProgram(program);

  return program;
}