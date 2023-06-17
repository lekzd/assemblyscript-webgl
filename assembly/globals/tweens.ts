import { consoleLog } from "../env";

class TweenTask {
  isRunning: boolean = true;
  startTime: u32 = 0;
  duration: u32 = 0;
  onEndCallback: () => void = () => {};

  changes: Map<u32, f32> = new Map<u32, f32>();
  arr: StaticArray<f32>;
  arrCopy: Array<f32>;

  constructor(arr: StaticArray<f32>, milliseconds: u32, startTime: u32) {
    this.duration = milliseconds;
    this.startTime = startTime;
    this.arr = arr;
    this.arrCopy = arr.slice(0);
  }

  set(index: i32, target: f32): TweenTask {
    this.changes.set(index, target);

    return this;
  }

  onTick(time: u32): void {
    const keys = this.changes.keys();
    const progress: f32 = f32(time) / f32(this.duration + this.startTime);

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const target = f32(this.changes.get(keys[i]));

      this.arr[key] = this.arrCopy[key] + (target * progress);
    }
  }

  stop(): void {
    this.isRunning = false;
    this.onEndCallback();
  }

  onEnd(callback: () => void): void {
    this.onEndCallback = callback;
  }
}

class Tweens {
  tasks: Array<TweenTask> = [];
  lastTimeStamp: u32 = 0;

  add(arr: StaticArray<f32>, milliseconds: u32): TweenTask {
    const task: TweenTask = new TweenTask(arr, milliseconds, this.lastTimeStamp);

    this.tasks.push(task);

    return task;
  }

  update(deltaTime: u32): void {
    this.lastTimeStamp = deltaTime;

    for (let i = 0; i < this.tasks.length; i++) {
      const tweenTask = this.tasks[i];

      if (!tweenTask.isRunning) {
        continue;
      }

      if (tweenTask.startTime + tweenTask.duration <= deltaTime) {
        tweenTask.isRunning = false;
        tweenTask.onEndCallback();

        continue;
      }

      tweenTask.onTick(deltaTime - tweenTask.startTime);
    }

    this.tasks = this.tasks.filter(task => task.isRunning);
  }
}

export const tweens = new Tweens();