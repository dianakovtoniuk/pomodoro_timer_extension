import type { TimerState } from "../types"

function byId<T extends HTMLElement>(id: string): T {
  const el = document.getElementById(id)
  if (!el) throw new Error(`Element #${id} not found`)
  return el as T
}

const timeEl = byId<HTMLHeadingElement>("time")
const startTimerBtn = byId<HTMLButtonElement>("start-timer-btn")
const resetTimerBtn = byId<HTMLButtonElement>("reset-timer-btn")
const addTaskBtn = byId<HTMLButtonElement>("add-task-btn")
const taskContainer = byId<HTMLDivElement>("task-container")

let tasks: string[] = []

// ---------- timer ----------

function getTimerState(): Promise<Partial<TimerState>> {
  return chrome.storage.local.get(["timer", "timeOption", "isRunning"])
}

async function updateTime(): Promise<void> {
  const { timer = 0, timeOption = 25, isRunning = false } = await getTimerState()

  const minutes = String(timeOption - Math.ceil(timer / 60)).padStart(2, "0")
  const seconds = timer % 60 !== 0 ? String(60 - (timer % 60)).padStart(2, "0") : "00"

  timeEl.textContent = `${minutes}:${seconds}`
  startTimerBtn.textContent = isRunning ? "Pause Timer" : "Start Timer"
}

void updateTime()
setInterval(updateTime, 1000)

startTimerBtn.addEventListener("click", async () => {
  const { isRunning = false } = await getTimerState()
  await chrome.storage.local.set({ isRunning: !isRunning })
  startTimerBtn.textContent = !isRunning ? "Pause Timer" : "Start Timer"
})

resetTimerBtn.addEventListener("click", async () => {
  await chrome.storage.local.set({ timer: 0, isRunning: false })
  startTimerBtn.textContent = "Start Timer"
})

// ---------- tasks ----------

addTaskBtn.addEventListener("click", () => addTask())

chrome.storage.sync.get(["tasks"]).then((res) => {
  tasks = (res.tasks as string[] | undefined) ?? []
  renderTasks()
})

function saveTasks(): void {
  chrome.storage.sync.set({ tasks })
}

function renderTask(taskNum: number): void {
  const taskRow = document.createElement("div")

  const text = document.createElement("input")
  text.type = "text"
  text.placeholder = "Enter a task..."
  text.value = tasks[taskNum]
  text.className = "task-input"
  text.addEventListener("change", () => {
    tasks[taskNum] = text.value
    saveTasks()
  })

  const deleteBtn = document.createElement("input")
  deleteBtn.type = "button"
  deleteBtn.value = "X"
  deleteBtn.className = "task-delete"
  deleteBtn.addEventListener("click", () => {
    deleteTask(taskNum)
  })

  taskRow.appendChild(text)
  taskRow.appendChild(deleteBtn)
  taskContainer.appendChild(taskRow)
}

function addTask(): void {
  const taskNum = tasks.length
  tasks.push("")
  renderTask(taskNum)
  saveTasks()
}

function deleteTask(taskNum: number): void {
  tasks.splice(taskNum, 1)
  renderTasks()
  saveTasks()
}

function renderTasks(): void {
  taskContainer.textContent = ""
  tasks.forEach((_, taskNum) => {
    renderTask(taskNum)
  })
}
