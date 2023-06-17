import { state } from "../models/State";

export function quadXY(array: StaticArray<f32>, x: i32, y: i32, width: i32, height: i32,): StaticArray<f32> {
  const fX1 = f32(f32(x / (state.width * 0.5)) - 1.0);
  const fY1 = -f32(f32(y / (state.height * 0.5)) - 1.0);
  const fX2 = f32(f32((x + width) / (state.width * 0.5) - 1.0));
  const fY2 = -f32(f32((y + height) / (state.height * 0.5)) - 1.0);

  array[0] = fX1;
  array[1] = fY1;
  array[2] = fX1;
  array[3] = fY2;
  array[4] = fX2;
  array[5] = fY1;
  array[6] = fX2;
  array[7] = fY2;

  return array;
}

export function quadXYUV(
  array: StaticArray<f32>,
  x: i32, y: i32, width: i32, height: i32,
  spriteWidth: i32, spriteHeight: i32
): StaticArray<f32> {

  const fX1 = f32(f32(x / (state.width * 0.5)) - 1.0);
  const fY1 = -f32(f32(y / (state.height * 0.5)) - 1.0);
  const fX2 = f32(f32((x + width) / (state.width * 0.5) - 1.0));
  const fY2 = -f32(f32((y + height) / (state.height * 0.5)) - 1.0);

  array[0] = fX1;
  array[1] = fY1;
  array[2] = 0.0;
  array[3] = 0.0;

  array[4] = fX1;
  array[5] = fY2;
  array[6] = 0.0;
  array[7] = -1.0 / f32(spriteHeight);

  array[8] = fX2;
  array[9] = fY1;
  array[10] = 1.0 / f32(spriteWidth);
  array[11] = 0.0;

  array[12] = fX2;
  array[13] = fY2;
  array[14] = 1.0 / f32(spriteWidth);
  array[15] = -1.0 / f32(spriteHeight);

  return array;
}

export function moveQuadXY(
  array: StaticArray<f32>,
  x: i32, y: i32, width: i32, height: i32,
  size: i32
): StaticArray<f32> {

  const fX1 = f32(f32(x / (state.width * 0.5)) - 1.0);
  const fY1 = -f32(f32(y / (state.height * 0.5)) - 1.0);
  const fX2 = f32(f32((x + width) / (state.width * 0.5) - 1.0));
  const fY2 = -f32(f32((y + height) / (state.height * 0.5)) - 1.0);

  array[0] = fX1;
  array[1] = fY1;

  array[size] = fX1;
  array[size + 1] = fY2;

  array[(size * 2)] = fX2;
  array[(size * 2) + 1] = fY1;

  array[(size * 3)] = fX2;
  array[(size * 3) + 1] = fY2;

  return array;
}

export function moveQuadUV(
  array: StaticArray<f32>,
  u: i32, v: i32, spriteWidth: i32, spriteHeight: i32,
): StaticArray<f32> {

  const width: f32 = 1.0 / f32(spriteWidth);
  const height: f32 = 1.0 / f32(spriteHeight);

  array[2] = width * f32(u);
  array[3] = -height * f32(v);

  array[6] = width * f32(u);
  array[7] = -(height * f32(v)) - height;

  array[10] = (width * f32(u)) + width;
  array[11] = -height * f32(v);

  array[14] = (width * f32(u)) + width;
  array[15] = -(height * f32(v)) - height;

  return array;
}