
export function clamp(value: number, min: number, max: number): f32 {
  return f32(Math.max(Math.min(value, max), min));
}