
export class State {
  width: i32;
  height: i32;
  scrollLeft: f32 = 0;
  scrollTop: f32 = 0;
  time: u32 = 0;
}

export const state = new State();