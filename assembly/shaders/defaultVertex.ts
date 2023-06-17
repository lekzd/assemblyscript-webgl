
export const VERTEX_SHADER_CODE: string = /*glsl*/ `#version 300 es
// precision highp float;
precision mediump float;

in vec4 objPosition;
in vec4 color;
in vec4 type;
in vec2 position;
in vec2 tex_coord;

in vec2 scroll;
in vec2 resolution;

out vec2 tc;
out float instance_id;
out vec4 body_tone;
out float body_type;
out vec4 legs_tone;
out float legs_type;
out vec4 head_tone;
out float head_type;
out vec4 clothes_tone;
out float clothes_type;

vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {
  vec2 scrollOffset = scroll.xy / vec2(resolution.x, -resolution.y);

  gl_Position = vec4(position + objPosition.xy + vec2(1.0, -1.0) - scrollOffset, 0.0, 1.0);

  tc.x = tex_coord.x + objPosition.z;
  tc.y = tex_coord.y + objPosition.w;

  instance_id = float(gl_InstanceID);

  body_tone = vec4( hsv2rgb( vec3( color[0], 1.0, 0.5 ) ), 1.0 );
  body_type = type[0];
  legs_tone = vec4( hsv2rgb( vec3( color[1], 1.0, 0.5 ) ), 1.0 );
  legs_type = type[1];
  head_tone = vec4( hsv2rgb( vec3( color[2], 1.0, 0.5 ) ), 1.0 );
  head_type = type[2];
  clothes_tone = vec4( hsv2rgb( vec3( color[3], 1.0, 0.5 ) ), 1.0 );
  clothes_type = type[3];
}
`;
