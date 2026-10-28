import type { TimerState } from "../types"

const DEFAULT_MINUTES = 25

const timeOption = document.getElementById("time-option") as HTMLInputElement
const saveBtn = document.getElementById("save-btn") as HTMLButtonElement

timeOption.addEventListener("change", () => {
  const val = timeOption.valueAsNumber
  if (Number.isNaN(val) || val < 1 || val > 60) {
    timeOption.value = String(DEFAULT_MINUTES)
  }
})

saveBtn.addEventListener("click", () => {
  const update: Partial<TimerState> = {
    timer: 0,
    timeOption: Number(timeOption.value),
    isRunning: false,
  }
  chrome.storage.local.set(update)
})

chrome.storage.local.get(["timeOption"]).then((res: Partial<TimerState>) => {
  timeOption.value = String(res.timeOption ?? DEFAULT_MINUTES)
})
