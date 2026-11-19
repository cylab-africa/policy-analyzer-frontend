/**
 * Base URL the browser uses to reach the backend.
 *
 * This is the website's own proxy route (src/app/api/[...path]), which adds the backend API key on
 * the server. The key itself is never sent to, or stored in, the browser.
 */
export const API_BASE_URL = "/api";
