export interface Time {
  hours: number;
  minutes: number;
  seconds: number;
}

export interface Timer extends Time {
  isRunning: boolean;
  isFinished: boolean;
}
