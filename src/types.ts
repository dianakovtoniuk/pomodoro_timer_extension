/** Timer state shared between the background worker, the popup and the options page. */
export interface TimerState {
  /** Seconds elapsed in the current session. */
  timer: number
  /** Session length in minutes. */
  timeOption: number
  isRunning: boolean
}
