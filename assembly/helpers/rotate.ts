
export function rotate(points: StaticArray<f32>, size: i32, angle: i32): StaticArray<f32> {
  let cx: f32 = 0;
  let cy: f32 = 0;
  const radians = (Math.PI / 180) * angle;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);

  for (let i: i32 = 0; i < points.length; i += size) {
    cx += points[i];
    cy += points[i + 1];
  };

  const pointsCount = f32(points.length / size);
  cx = f32(cx / pointsCount);
  cy = f32(cy / pointsCount);

  for (let i: i32 = 0; i < points.length; i += size) {
    const x = points[i];
    const y = points[i + 1];

    points[i] = f32((cos * (x - cx)) + (sin * (y - cy)) + cx);
    points[i + 1] = f32((cos * (y - cy)) - (sin * (x - cx)) + cy);
  };

  return points;
}