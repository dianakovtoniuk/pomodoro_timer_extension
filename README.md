# Pomodoro Timer Extension

A Chrome extension (Manifest V3) written in TypeScript. It has a Pomodoro timer and a simple task list.

![Screenshot](screenshot.png)

## Features

- Start, pause and reset a countdown from the popup
- The timer keeps running in the background while the popup is closed
- Desktop notification when the time is up
- Configurable session length (1 to 60 minutes, 25 by default) on the options page
- Task list that syncs across devices with your Google account

## Getting started

Requires Node.js 18 or newer.

```bash
npm install
npm run build
```

Then load the extension in Chrome:

1. Open `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked** and select the `dist` folder

Other scripts:

- `npm run watch` recompiles TypeScript on every change (run `npm run build` once first to copy static files)
- `npm run typecheck` checks types without emitting files

After rebuilding, press the reload icon on the extension card in `chrome://extensions`.

## How it works

The extension has three parts that communicate only through `chrome.storage`:

- **Background service worker** (`src/background.ts`) uses `chrome.alarms` to tick once per second. Service workers in Manifest V3 can be shut down when idle, so `setInterval` is not reliable there. On every tick it increments the elapsed seconds, and when the session is over it shows a notification and resets the timer.
- **Popup** (`src/popup/popup.ts`) reads the timer state from storage every second and renders it. The buttons only change values in storage, the counting itself is done by the background worker. The task list also lives here.
- **Options page** (`src/options/options.ts`) saves the session length and resets the timer so the old state does not conflict with the new duration.

Timer state is stored in `chrome.storage.local`, tasks are stored in `chrome.storage.sync`. The shape of the timer state is described once in `src/types.ts` and shared by all three parts.

## Project structure

```
pomodoro-timer-extension/
├── public/              static files copied to dist as is
│   ├── manifest.json
│   ├── icon.png
│   ├── popup/           popup.html, popup.css
│   └── options/         options.html, options.css
├── src/                 TypeScript sources compiled to dist
│   ├── background.ts
│   ├── types.ts
│   ├── popup/popup.ts
│   └── options/options.ts
├── scripts/copy-static.mjs
├── tsconfig.json
└── package.json
```

## Tech

TypeScript, Chrome Extensions API (Manifest V3), `chrome.storage`, `chrome.alarms`, `chrome.notifications`, `@types/chrome`

## Known limitations

The one-second alarm interval works in unpacked mode. For a Chrome Web Store release the timer should be reworked to store an end timestamp instead of counting ticks.
