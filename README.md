# Bravia Remote Control

A full-stack web application for controlling Sony Bravia TVs over your local network. Includes a REST API server and a React-based remote control UI.

## Architecture

```
bravia/
├── lib/          # Core Bravia client library (IRCC/HTTP protocol)
├── server/       # Express API server (TypeScript)
└── ui/           # React remote control frontend (TypeScript + Vite)
```

## One-Time TV Setup

1. Turn on your TV
2. Go to **Settings > Network > Home network setup > Remote device/Renderer > On**
3. Go to **Settings > Network > Home network setup > IP Control > Authentication > Normal and Pre-Shared Key**
4. Go to **Settings > Network > Home network setup > Remote device/Renderer > Enter Pre-Shared Key** — set a PSK (e.g. `0000`)
5. Go to **Settings > Network > Home network setup > Remote device/Renderer > Simple IP Control > On**
6. Note your TV's IP address from **Settings > Network > Network Status**

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure the server

Copy the example env file and fill in your TV's details:

```bash
cp server/.env.example server/.env
```

```ini
# server/.env
PORT=3001
NODE_ENV=development

TV_IP=192.168.1.x          # Your TV's IP address
PSK_KEY=0000                # The PSK you set on the TV
MAC_ADDRESS=                # Optional: MAC address for Wake-on-LAN (AA:BB:CC:DD:EE:FF)

CORS_ORIGIN=http://localhost:5173
```

### 3. Configure the UI

```bash
cp ui/.env.example ui/.env
```

```ini
# ui/.env
VITE_API_URL=http://localhost:3001/api/v1
```

## Development

Run both server and UI together:

```bash
npm run dev
```

Or separately:

```bash
npm run dev:server   # API server on http://localhost:3001
npm run dev:ui       # UI on http://localhost:5173
```

## Production Build

```bash
npm run build
```

Start the server:

```bash
npm start --workspace=server
```

Serve the built UI from `ui/dist/` with any static file server.

## API Reference

Base URL: `http://localhost:3001/api/v1`

All responses follow this shape:

```json
{
  "success": true,
  "data": { ... },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Status & Info

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/status` | Server and connection status |
| `GET` | `/tv-status` | Current TV state (volume, input, power) |
| `GET` | `/tv-info` | System info, inputs, apps, network, LED status |
| `GET` | `/commands` | List all available IRCC commands |

### Configuration

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/config` | Current TV IP configuration |
| `PUT` | `/config` | Update TV IP, PSK, and MAC address at runtime |

`PUT /config` body:
```json
{ "tvIp": "192.168.1.x", "pskKey": "0000", "macAddress": "AA:BB:CC:DD:EE:FF" }
```

### Commands

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/commands/:commandName` | Execute any IRCC command by name |

### Power

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/power/on` | Power on (sends `TvPower` via IRCC) |
| `POST` | `/power/off` | Power off (sends `PowerOff` via IRCC) |

### Volume

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/volume/up` | Volume up |
| `POST` | `/volume/down` | Volume down |
| `POST` | `/volume/mute` | Toggle mute |

### Channel

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/channel/up` | Next channel |
| `POST` | `/channel/down` | Previous channel |

### Input

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/input/hdmi/:number` | Switch to HDMI 1–4 |

### Apps

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/apps/:appName` | Launch an app (e.g. `Netflix`, `YouTube`) |

## Tech Stack

**Server:** Node.js, Express, TypeScript, Zod, axios

**UI:** React 18, Vite, TypeScript, Tailwind CSS, Zustand

## Authentication

The TV accepts a Pre-Shared Key (PSK) for authentication. Set your PSK in `server/.env` as `PSK_KEY`. The library maintains a session cookie in `server/cookies.json` — if you need to re-authenticate, clear that file's contents.

## Disclaimer

This is an unofficial project not affiliated with Sony. Distributed under the [Apache 2.0 License](http://www.apache.org/licenses/LICENSE-2.0).
