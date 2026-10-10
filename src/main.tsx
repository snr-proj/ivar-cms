import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/index.css";

/**
 * Why this file branches on pathname instead of using React Router
 * everywhere:
 *
 * react-admin's <Admin> component creates its OWN router internally.
 * React Router v6 throws if a <BrowserRouter> is mounted inside another
 * Router's tree. Rather than fighting that, we decide — before any router
 * exists — whether this load is a public-site request or an /admin
 * request, and mount exactly one self-contained app accordingly. Each app
 * (PublicApp, AdminApp) owns its own router from there.
 */
const isAdminRoute = window.location.pathname.startsWith("/admin");

async function render() {
  const { default: App } = isAdminRoute
    ? await import("./AdminApp")
    : await import("./PublicApp");

  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

render();
