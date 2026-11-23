import type { NextRequest } from "next/server";

/**
 * Server-side proxy to the Policy Analyzer backend.
 *
 * The backend is protected by a shared API key. That key must never reach the browser, so the
 * browser calls this same-origin route (`/api/...`) and the key is attached here, on the
 * server, from `BACKEND_API_KEY`. Both settings are read at request time, so they are normal
 * runtime environment variables and are not baked into the build.
 */

// Always run per request: never cache or pre-render, and keep streaming responses streaming.
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const DEFAULT_BACKEND_URL = "http://localhost:8000/api";

// The backend routes the website uses, by method. Nothing else is passed on: operator routes
// (admin, folder processing, editing the country data, listing batch jobs) and routes the
// website does not use (conversation history by session ID) stay unreachable from the internet
// even though this proxy holds the API key.
const ID = "[A-Za-z0-9-]{1,64}";
const ROUTES: ReadonlyArray<{ method: "GET" | "POST"; path: RegExp }> = [
    { method: "GET", path: /^info\/(policy_laws|digital_id)(\/files|\/country\/[A-Za-z]{2})?$/ },
    { method: "POST", path: /^query_v2$/ },
    { method: "POST", path: /^batch\/upload$/ },
    { method: "GET", path: new RegExp(`^batch/(status|download)/${ID}$`) },
    { method: "POST", path: /^documents\/upload-documents$/ },
    { method: "GET", path: new RegExp(`^documents/status/${ID}$`) },
];

/** 200 when the route is allowed, 405 for a known path with another method, 404 otherwise. */
function routeStatus(method: string, segments: string[]): 200 | 404 | 405 {
    if (segments.length === 0) return 404;
    // Reject traversal and anything that could change the path once it is joined.
    if (segments.some((s) => s === "" || s === "." || s === ".." || /[\\/]/.test(s))) return 404;
    const path = segments.join("/");
    const matching = ROUTES.filter((route) => route.path.test(path));
    if (matching.length === 0) return 404;
    return matching.some((route) => route.method === method) ? 200 : 405;
}

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

async function proxy(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
    const apiKey = process.env.BACKEND_API_KEY;
    if (!apiKey) {
        console.error("BACKEND_API_KEY is not set; refusing to proxy request.");
        return Response.json({ detail: "Backend is not configured" }, { status: 500 });
    }

    const { path } = await context.params;
    const status = routeStatus(request.method, path);
    if (status === 404) return Response.json({ detail: "Not found" }, { status: 404 });
    if (status === 405) return Response.json({ detail: "Method not allowed" }, { status: 405 });

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
    // header is absent and the backend falls back to this server's address. The backend only
    // believes this header for requests coming from an address in its TRUSTED_PROXY_IPS setting.
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

export { proxy as GET, proxy as POST };
