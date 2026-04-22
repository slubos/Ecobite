
  # Eco-Bite

  Eco-Bite is a frontend prototype for exploring a modern, sustainability-focused food discovery experience. It showcases a polished multi-screen user journey with reusable UI components, smooth interactions, and responsive layouts.

  ## Features

  - End-to-end frontend prototype of the Eco-Bite product concept
  - Component-driven UI architecture built with reusable design primitives
  - Multi-screen client-side navigation with `react-router`
  - Rich, animated interactions for a more engaging browsing experience
  - Responsive layouts optimized for common desktop and mobile viewports

  ## Tech Stack

  - `React` + `Vite`
  - `react-router`
  - `Tailwind CSS`
  - `Radix UI`
  - `MUI`
  - `lucide-react`
  - `motion` (Framer Motion API)

  ## Getting Started

  ### Prerequisites

  - Node.js 18+ (recommended)
  - npm

  ### Install dependencies

  ```bash
  npm install
  ```

  ### Start development server

  ```bash
  npm run dev
  ```

  By default, Vite serves the app at `http://localhost:5173`.

  ### Build for production

  ```bash
  npm run build
  ```

  ## Project Structure

  ```text
  src/
    app/
      App.tsx          # Root app component
      components/      # Shared and feature UI components
      data/            # Static/mock data
      routes.tsx       # App routes
    styles/
      index.css
    main.tsx           # App entry point
  ```

  ## Notes

  - This repository contains a frontend-only implementation intended for prototyping and UI exploration.
  - Backend APIs, authentication, and persistent server-side data are not part of this codebase.
  