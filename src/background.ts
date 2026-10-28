import type { TimerState } from "./types"

const ALARM_NAME = "pomodoroTimer"
const DEFAULT_MINUTES = 25

chrome.alarms.create(ALARM_NAME, {
  periodInMinutes: 1 / 60,
})

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name !== ALARM_NAME) return

  const res: Partial<TimerState> = await chrome.storage.local.get([
    "timer",
    "isRunning",
    "timeOption",
  ])
  if (!res.isRunning) return

  const timeOption = res.timeOption ?? DEFAULT_MINUTES
  let timer = (res.timer ?? 0) + 1
  let isRunning = true

  if (timer >= 60 * timeOption) {
    chrome.notifications.create({
      type: "basic",
      iconUrl: "icon.png",
      title: "Pomodoro Timer",
      message: `${timeOption} minutes has passed!`,
    })
    timer = 0
    isRunning = false
  }

  await chrome.storage.local.set({ timer, isRunning })
})

// Fill in defaults on first run without overwriting saved values.
chrome.storage.local
  .get(["timer", "isRunning", "timeOption"])
  .then((res: Partial<TimerState>) => {
    const initial: TimerState = {
      timer: res.timer ?? 0,
      timeOption: res.timeOption ?? DEFAULT_MINUTES,
      isRunning: res.isRunning ?? false,
    }
    return chrome.storage.local.set(initial)
  })
