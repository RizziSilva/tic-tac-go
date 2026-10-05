# Tic Tac Go

Tic Tac Go is an online, real-time multiplayer tic-tac-toe game. Players sign in with their Google account, then either create a room and share its code with a friend or join an existing room using a code. Moves are synced instantly between both players over WebSockets, and the game handles the full match lifecycle: win/draw detection, opponent disconnection and reconnection, giving up or leaving a room, and requesting a rematch once a game is over.

**Play it live:** https://tic-tac-go-teal.vercel.app/

## Tech Stack

- React 19 + Vite
- React Router
- Firebase Authentication (Google sign-in)
- Socket.IO client
- SCSS modules

## Getting Started

Install dependencies:

```bash
npm install
```

Create a `.env` file in the project root with your Firebase config and the game server URL:

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_DATABASE_URL=
VITE_FIREBASE_MEASUREMENT_ID=
VITE_SOCKET_CONNECTION=
```

Start the dev server:

```bash
npm run dev
```

## Scripts

| Command           | Description                  |
| ----------------- | ---------------------------- |
| `npm run dev`     | Start the development server |
| `npm run build`   | Build for production         |
| `npm run preview` | Preview the production build |

## Project Structure

```
src/
├── components/   Reusable UI (board, modal, loader, protected layout)
├── constants/    Routes, socket events, env variables
├── context/      Auth and loading providers
├── hooks/        useGame, useSocketConnection, useAsync
├── pages/        Login, Home, Game
├── services/     Firebase, auth and user helpers
└── socket.js     Socket.IO client setup
```

> Note: this is the front end only. It needs the game server, [tic-tac-go-server](https://github.com/RizziSilva/tic-tac-go-server), running and configured through `VITE_SOCKET_CONNECTION`.
