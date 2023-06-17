import { createProgram } from "../helpers/createProgram";
import { FRAGMENT_SHADER_CODE } from "../shaders/defaultFragment";
import { VERTEX_SHADER_CODE } from "../shaders/defaultVertex";
import { WebGLProgram } from "../WebGL";

export const program: WebGLProgram = createProgram(VERTEX_SHADER_CODE, FRAGMENT_SHADER_CODE);