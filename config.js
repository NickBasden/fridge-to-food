// Centralized API base URL. Auto-switches between local dev and production.
// After deploying your backend, replace PROD_API_BASE with your live URL
// (e.g. "https://fridge-to-food.onrender.com").
const PROD_API_BASE = "https://REPLACE-ME.onrender.com";

const isLocal =
    location.hostname === "127.0.0.1" ||
    location.hostname === "localhost" ||
    location.hostname === "";

window.API_BASE = isLocal ? "http://127.0.0.1:8000" : PROD_API_BASE;
