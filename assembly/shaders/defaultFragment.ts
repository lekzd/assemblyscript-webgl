
export const FRAGMENT_SHADER_CODE: string = /*glsl*/ `#version 300 es
// precision highp float;
precision mediump float;

in vec2 tc;
in float instance_id;
uniform sampler2D npc_body;
in vec4 body_tone;
in float body_type;

uniform sampler2D npc_head;
in vec4 head_tone;
in float head_type;

uniform sampler2D npc_legs;
in vec4 legs_tone;
in float legs_type;

uniform sampler2D npc_clothes;
in vec4 clothes_tone;
in float clothes_type;

out vec4 color;

vec4 fade(vec4 color, vec4 fadeColor) {
  if (color.a == 0.0) {
    return color;
  }

  float grey = (color.r + color.g + color.b) * 0.5;

  float r = fadeColor.r * grey;
	float g = fadeColor.g * grey;
	float b = fadeColor.b * grey;

	return vec4(r, g, b, 1.0);
}

vec4 overlay4(vec4 body, vec4 legs, vec4 clothes, vec4 head) {
  if (head.a == 1.0) {
    return fade(head, head_tone);
  }

  if (clothes.a == 1.0) {
    return fade(clothes, clothes_tone);
  }

  if (legs.a == 1.0) {
    return fade(legs, legs_tone);
  }

  if (body.a == 1.0) {
    return fade(body, body_tone);
  }

  discard;
}

vec4 overlay(vec4 color1, vec4 color2) {
  return color2 * color2.a + color1 * (1.0 - color2.a);
}

vec2 offset(float count, float num) {
  float fr = (1.0 / count);
  return vec2((tc.x * fr) + (fr * num), tc.y);
}

void main() {
  vec4 body_color = texture( npc_body, offset(5.0, body_type) );
  vec4 head_color = texture( npc_head, offset(14.0, head_type) );
  vec4 legs_color = texture( npc_legs, offset(5.0, legs_type) );
  vec4 clothes_color = texture( npc_clothes, offset(11.0, clothes_type) );

  color = overlay4(body_color, legs_color, clothes_color, head_color);
}
`;