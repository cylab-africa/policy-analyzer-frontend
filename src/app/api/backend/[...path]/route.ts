import type { NextRequest } from "next/server";

/**
 * Server-side proxy to the Policy Analyzer backend.
 *
 * The backend is protected by a shared API key. That key must never reach the browser, so the
 * browser calls this same-origin route (`/api/backend/...`) and the key is attached here, on the
 * server, from `BACKEND_API_KEY`. Both settings are read at request time, so they are normal
 * runtime environment variables and are not baked into the build.
 */

// Always run per request: never cache or pre-render, and keep streaming responses streaming.
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const DEFAULT_BACKEND_URL = "http://localhost:8000/api";

// Only the backend routes the website actually uses are reachable through the proxy.
const ALLOWED_PREFIXES = [
    "info/",
    "document_processing/",
    "sessions/",
    "query_v2",
    "batch/",
    "documents/",
];

const ALLOWED_METHODS = new Set(["GET", "POST", "PATCH", "DELETE"]);

// Request headers that are safe to pass on. Everything else (cookies, a client-supplied
// X-API-Key, host, ...) is dropped.
const FORWARDED_REQUEST_HEADERS = ["content-type", "accept"];

// Response headers that must not be copied: the body is re-sent by this server, so the upstream
// framing and encoding no longer apply.
const DROPPED_RESPONSE_HEADERS = new Set([
    "content-encoding",
    "content-length",
    "transfer-encoding",
    "connection",
    "keep-alive",
    "set-cookie",
]);

function isAllowedPath(segments: string[]): boolean {
    if (segments.length === 0) return false;
    // Reject traversal and anything that could change the path once it is joined.
    if (segments.some((s) => s === "" || s === "." || s === ".." || /[\\/]/.test(s))) return false;
    const path = segments.join("/");
    return ALLOWED_PREFIXES.some((prefix) => (prefix.endsWith("/") ? path.startsWith(prefix) : path === prefix));
}

async function proxy(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
    if (!ALLOWED_METHODS.has(request.method)) {
        return new Response("Method not allowed", { status: 405 });
    }

    const apiKey = process.env.BACKEND_API_KEY;
    if (!apiKey) {
        console.error("BACKEND_API_KEY is not set; refusing to proxy request.");
        return Response.json({ detail: "Backend is not configured" }, { status: 500 });
    }

    const { path } = await context.params;
    if (!isAllowedPath(path)) {
        return Response.json({ detail: "Not found" }, { status: 404 });
    }

    const backendUrl = (process.env.BACKEND_API_URL || DEFAULT_BACKEND_URL).replace(/\/+$/, "");
    const target = `${backendUrl}/${path.map(encodeURIComponent).join("/")}${request.nextUrl.search}`;

    const headers = new Headers();
    for (const name of FORWARDED_REQUEST_HEADERS) {
        const value = request.headers.get(name);
        if (value) headers.set(name, value);
    }
    headers.set("X-API-Key", apiKey);

    // Tell the backend who the visitor is, so its rate limits apply per visitor instead of to this
    // server as a whole. The last X-Forwarded-For entry is the one added by the reverse proxy in
    // front of this app (earlier entries can be forged by the visitor). Without such a proxy the
    // header is absent and the backend falls back to this server's address.
    const clientIp = request.headers.get("x-forwarded-for")?.split(",").pop()?.trim();
    if (clientIp) headers.set("X-Client-IP", clientIp);

    const hasBody = request.method !== "GET" && request.method !== "HEAD";

    let upstream: Response;
    try {
        upstream = await fetch(target, {
            method: request.method,
            headers,
            body: hasBody ? request.body : undefined,
            // Needed by Node's fetch when the body is a stream (file uploads).
            ...(hasBody ? { duplex: "half" } : {}),
            redirect: "manual",
            // Cancel the upstream request when the browser goes away (e.g. the Stop button).
            signal: request.signal,
        } as RequestInit);
    } catch (error) {
        if (request.signal.aborted) {
            return new Response(null, { status: 499 });
        }
        console.error("Backend request failed:", error);
        return Response.json({ detail: "Could not reach the backend" }, { status: 502 });
    }

    const responseHeaders = new Headers();
    upstream.headers.forEach((value, name) => {
        if (!DROPPED_RESPONSE_HEADERS.has(name.toLowerCase())) responseHeaders.set(name, value);
    });
    // Keep proxies and servers from buffering a streamed answer.
    responseHeaders.set("Cache-Control", "no-store");
    responseHeaders.set("X-Accel-Buffering", "no");

    return new Response(upstream.body, {
        status: upstream.status,
        statusText: upstream.statusText,
        headers: responseHeaders,
    });
}

export { proxy as GET, proxy as POST, proxy as PATCH, proxy as DELETE };
