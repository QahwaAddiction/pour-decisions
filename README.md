# CalibratedPours

[![Live app](https://img.shields.io/badge/▶_Open_the_live_app-7B2FBE?style=for-the-badge)](https://qahwaaddiction.github.io/CalibratedPours/)

**Live:** https://qahwaaddiction.github.io/CalibratedPours/ · On a phone, open it and choose *Add to Home Screen* to install it like an app.

A precision pour-over brewing assistant. Tell it about your beans — roast level,
process, origin, elevation, roast date — and the goal you're chasing (clarity,
sweetness, body, and so on), and it generates water temperature, grind, ratio,
bloom and a step-by-step pour schedule, with the reasoning behind every number.
Two modes: xBloom Studio and Manual Pour-Over. English and Arabic.

Built as a single self-contained React app. No backend, no accounts — your saved
recipes and dial-in notes live in your browser via `localStorage`.

## Run it locally

You'll need [Node.js](https://nodejs.org) 18 or newer.

```bash
npm install
npm run dev
```

Then open the URL it prints (usually http://localhost:5173).

## Build for production

```bash
npm run build      # outputs to dist/
npm run preview    # preview the production build locally
```

## Deploy

This repo ships with a GitHub Actions workflow (`.github/workflows/deploy.yml`)
that builds the app and publishes it to **GitHub Pages** on every push to `main`.

Because the build uses relative asset paths, the same `dist/` also works on
Netlify, Vercel, Cloudflare Pages, or any static host — just point it at the
build command `npm run build` and the output folder `dist`.

## Install as an app

The app is a Progressive Web App. On a phone, open the live site and choose
**Add to Home Screen** — it installs with its own icon and runs full-screen,
no app store required.

## Tech

- [React 18](https://react.dev) + [Vite](https://vitejs.dev)
- PWA manifest + service worker for offline use and home-screen install
- All logic in `src/App.jsx`

## License

[MIT](./LICENSE)
