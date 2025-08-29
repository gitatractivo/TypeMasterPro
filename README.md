# TypeMasterPro
[![Ask DeepWiki](https://devin.ai/assets/askdeepwiki.png)](https://deepwiki.com/gitatractivo/TypeMasterPro)

TypeMasterPro is a real-time, multiplayer typing game designed for competitive practice. Create or join rooms, challenge friends, and see your typing speed improve with detailed post-race analytics.

This project is built as a monorepo using pnpm workspaces and Turborepo, featuring a Next.js frontend and an Express.js WebSocket backend.

## ✨ Features

- **Real-time Multiplayer:** Compete with others in real-time typing races using WebSockets.
- **Custom Rooms:** Create private rooms to challenge your friends or join existing ones.
- **Live Progress Tracking:** See your opponents' progress and words-per-minute (WPM) update live during a race.
- **Dynamic Word Generation:** Races feature randomly generated words for endless variety.
- **Customizable Themes:** Personalize your typing experience with multiple color themes.
- **Performance Analytics:** Get detailed post-race results, including WPM, accuracy, character stats, and a WPM-over-time chart.
- **Responsive Design:** A clean, modern UI that works seamlessly across all devices.

## 🚀 Tech Stack

- **Frontend:** Next.js, React, TypeScript
- **Backend:** Express.js, WebSocket (ws)
- **UI:** shadcn/ui, Tailwind CSS, Recharts
- **Monorepo:** pnpm, Turborepo
- **Code Quality:** ESLint, Prettier

## 🏗️ Architecture

This repository is a monorepo managed with **pnpm** and **Turborepo**.

-   `apps/web`: The Next.js frontend application that users interact with. It includes all UI components, pages, and hooks for the typing game.
-   `apps/api`: The Express.js and WebSocket server that handles game logic, room management, and real-time communication between clients.
-   `packages/ui`: A shared library of UI components built with shadcn/ui, used by the `web` app.
-   `packages/shared`: Shared types, constants, and utility functions (e.g., word generation) used across both the `web` and `api` applications.
-   `packages/typescript-config`, `packages/eslint-config`, `packages/prettier-config`: Centralized configurations for TypeScript, ESLint, and Prettier to ensure code consistency across the monorepo.

## 🏁 Getting Started

### Prerequisites

-   Node.js (>= 22.0.0)
-   pnpm (>= 9.12.0)

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/gitatractivo/TypeMasterPro.git
    cd TypeMasterPro
    ```

2.  Install the dependencies using pnpm:
    ```bash
    pnpm install
    ```

3. In the `apps/web` directory, create a `.env.local` file and add the WebSocket server URL:
    ```env
    NEXT_PUBLIC_WS_URL=ws://localhost:8080
    ```


### Running the Application

To run both the frontend and backend servers in development mode, execute the following command from the root directory:

```bash
pnpm dev
```

- The web application will be available at `http://localhost:3000`.
- The API server will be running on `http://localhost:8080`.

## 📜 Available Scripts

The following scripts are available from the root of the monorepo:

-   `pnpm dev`: Start all apps in development mode.
-   `pnpm build`: Build all applications for production.
-   `pnpm lint`: Lint all packages and applications.
-   `pnpm format`: Format the entire codebase using Prettier.
-   `pnpm clean:all`: Remove all `node_modules` and `dist` folders.

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
