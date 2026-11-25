/**
 * Turn a failed request into a sentence a visitor can act on.
 *
 * Errors arrive in several shapes: RTK Query errors ({ status, data }), errors from fetch
 * (network failures), and backend bodies whose `detail` is either a message or FastAPI's list
 * of validation problems. A reverse proxy can also answer with an HTML page (for example
 * "413 Request Entity Too Large"), which is never shown as is.
 */

const STATUS_MESSAGES: Record<number, string> = {
    413: "The file is too large to upload.",
    429: "Too many requests in a short time. Please wait a while and try again.",
    502: "The service is unavailable right now. Please try again in a few minutes.",
    503: "The service is unavailable right now. Please try again in a few minutes.",
    504: "The request took too long. Please try again.",
};

/** A readable message from a backend `detail` value, if it holds one. */
function fromDetail(detail: unknown): string | null {
    if (typeof detail === "string" && detail.trim()) return detail.trim();
    if (Array.isArray(detail)) {
        // FastAPI validation errors: [{ loc: [...], msg: "..." }, ...]
        const messages = detail
            .map((item) => (item && typeof item === "object" && "msg" in item ? String(item.msg) : null))
            .filter((m): m is string => Boolean(m));
        if (messages.length) return messages.join(". ");
    }
    return null;
}

/** The message for an HTTP status, using the backend's own explanation when it gave one. */
export function messageForStatus(status: number, body: unknown, fallback: string): string {
    const detail = body && typeof body === "object" && "detail" in body ? fromDetail(body.detail) : null;
    // Rate limits and gateway errors get a fixed, friendly sentence; for anything else the
    // backend's explanation (already written for users) is the most useful thing to show.
    if (status === 429 || status >= 502) return STATUS_MESSAGES[status] ?? STATUS_MESSAGES[502];
    if (detail && status < 500) return detail;
    return STATUS_MESSAGES[status] ?? fallback;
}

export function getErrorMessage(error: unknown, fallback = "Something went wrong. Please try again."): string {
    if (!error) return fallback;

    if (typeof error === "object") {
        const err = error as { status?: unknown; originalStatus?: unknown; data?: unknown; name?: unknown };

        // RTK Query: the request never got an HTTP answer
        if (err.status === "FETCH_ERROR") {
            return "Could not reach the service. Check your connection and try again.";
        }
        if (err.status === "TIMEOUT_ERROR") return STATUS_MESSAGES[504];

        // RTK Query: an answer that was not JSON (often a proxy's HTML error page)
        if (err.status === "PARSING_ERROR" && typeof err.originalStatus === "number") {
            return messageForStatus(err.originalStatus, null, fallback);
        }

        if (typeof err.status === "number") return messageForStatus(err.status, err.data, fallback);
    }

    if (error instanceof TypeError) {
        // fetch() rejects with a TypeError when the network fails
        return "Could not reach the service. Check your connection and try again.";
    }
    return fallback;
}
