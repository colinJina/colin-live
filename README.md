# Colin Live React

[![React](https://img.shields.io/badge/React-19.0-blue?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

**A modern video interaction platform built on the React 19 ecosystem.** This project is not just a video player frontend, but an engineering practice exploring **high-performance Web rendering** and **complex asynchronous state orchestration.**

---

## 🏗️ Architecture Philosophy

In this project, I focus on building a **robust**, **maintainable**, and **scalable** codebase:

- **Declarative Data Fetching:** Powered by **TanStack Query v5**. By encapsulating custom hooks (e.g., `useVideoDetail`), I implemented a "Request as Resource" pattern, significantly reducing **Race Conditions** and enabling automated caching.
- **Atomic State Management:** Leveraged **Zustand** for a lightweight state machine. Compared to Redux, it offers lower rendering overhead and cleaner boilerplate, especially for high-frequency updates like "video playback states."
- **Advanced UI Rendering:** Built on **Ant Design 5.x** Design Tokens with secondary encapsulation. Integrated with **Tailwind CSS 4**'s high-performance compiler to achieve responsive design with near-zero runtime overhead.
- **Engineering Standards:** Strictly enforced **TypeScript 5.x** constraints to ensure **End-to-End Type Safety** from API definitions to UI rendering.

---

## ⚡ Technical Showcases

### 1. Video Rendering & Playback Optimization

- Integrated **Artplayer** with **HLS.js** to provide seamless support for `.m3u8` streaming protocols.
- Performance-tuned the danmaku (bullet chat) rendering engine to maintain a silky-smooth **60FPS** interactive experience, even under high-concurrency environments.

### 2. UX Optimization & Interaction

- **Optimistic Updates:** Applied React Query's optimistic update patterns for interactions like "Likes" and "Coins." The UI reacts instantly while background synchronization happens asynchronously, providing a "zero-latency" user feedback loop.
- **Highly Abstracted Hooks:** Logic is deeply decoupled from the UI. For instance, `useVideoActionMutation` handles a complete lifecycle: authentication interceptors, error rollbacks, and automated data re-fetching.

---

## 📂 Project Structure

```bash
src/
├── api/          # Type-safe API layer (Interceptors, API Schemas)
├── assets/       # Static assets (SVG, Images, Lottie)
├── components/   # High-cohesion UI units (Atomic Components)
├── hooks/        # The "Brains" of the app (Hooks as Controllers)
│   ├── queries/  # Data fetching & caching logic
│   └── mutations/# Data mutation & state sync logic
├── pages/        # View orchestration (Feature-based structure)
├── provider/     # Dependency injection (Global Context, Theme, Auth)
├── router/       # Routing configuration (React Router v6+)
├── stores/       # Global state management (Zustand Stores)
└── utils/        # Pure utility functions (Formatting, Validation)

🛠️ Getting Started
Install Dependencies:

Bash
npm install  # or pnpm install
Start Development Server:

Bash
npm run dev
Build for Production:

Bash
npm run build
📄 License
This project is licensed under the MIT License.
```
