"use client";

import { cn } from "@/lib/utils";
import { ExternalLink, X } from "lucide-react";
import Link from "next/link";
import {
    useCallback,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
    type MouseEvent,
    type ReactNode,
    type RefObject,
} from "react";

const OFFSET = 16; // gap between the cursor and the card
const MARGIN = 8; // minimum gap between the card and the map edge

interface PopoverState {
    name: string;
    pinned: boolean;
}

/** Only http(s) links from the data are rendered, so a bad record can never inject a script URL. */
export const safeUrl = (url: string | undefined): string | undefined => {
    try {
        const parsed = new URL(url ?? "");
        return parsed.protocol === "http:" || parsed.protocol === "https:" ? url : undefined;
    } catch {
        return undefined;
    }
};

/**
 * Hover shows a light preview that follows the cursor and never blocks the map.
 * Clicking a country pins the card in place so its links can be clicked; clicking the
 * map background, the close button or pressing Escape closes it.
 */
export function useMapPopover() {
    const containerRef = useRef<HTMLDivElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);
    const pointer = useRef({ x: 0, y: 0 });
    const pinnedRef = useRef(false);
    const [state, setState] = useState<PopoverState | null>(null);

    const place = useCallback(() => {
        const container = containerRef.current;
        const card = cardRef.current;
        if (!container || !card) return;
        const bounds = container.getBoundingClientRect();
        const { x, y } = pointer.current;
        let left = x + OFFSET;
        let top = y + OFFSET;
        if (left + card.offsetWidth > bounds.width - MARGIN) left = x - card.offsetWidth - OFFSET;
        if (top + card.offsetHeight > bounds.height - MARGIN) top = bounds.height - card.offsetHeight - MARGIN;
        card.style.left = `${Math.max(MARGIN, left)}px`;
        card.style.top = `${Math.max(MARGIN, top)}px`;
    }, []);

    const track = useCallback((event: MouseEvent) => {
        const bounds = containerRef.current?.getBoundingClientRect();
        if (!bounds) return;
        pointer.current = { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
    }, []);

    const hover = useCallback(
        (name: string, event: MouseEvent) => {
            if (pinnedRef.current) return;
            track(event);
            setState({ name, pinned: false });
        },
        [track]
    );

    // Moves the card with the cursor without re-rendering the map
    const move = useCallback(
        (event: MouseEvent) => {
            if (pinnedRef.current) return;
            track(event);
            place();
        },
        [track, place]
    );

    const leave = useCallback(() => {
        if (!pinnedRef.current) setState(null);
    }, []);

    const pin = useCallback(
        (name: string, event: MouseEvent) => {
            event.stopPropagation();
            track(event);
            pinnedRef.current = true;
            setState({ name, pinned: true });
        },
        [track]
    );

    const close = useCallback(() => {
        pinnedRef.current = false;
        setState(null);
    }, []);

    // Position the card before the browser paints it
    useLayoutEffect(() => {
        if (state) place();
    }, [state, place]);

    useEffect(() => {
        if (!state?.pinned) return;
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") close();
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [state?.pinned, close]);

    return { containerRef, cardRef, state, hover, move, leave, pin, close };
}

export function MapPopoverCard({
    pinned,
    label,
    cardRef,
    onClose,
    children,
}: {
    readonly pinned: boolean;
    readonly label: string;
    readonly cardRef: RefObject<HTMLDivElement | null>;
    readonly onClose: () => void;
    readonly children: ReactNode;
}) {
    return (
        <div
            ref={cardRef}
            role={pinned ? "dialog" : "tooltip"}
            aria-label={label}
            onClick={(event) => event.stopPropagation()}
            className={cn(
                "absolute left-0 top-0 z-30 max-h-[calc(100%-1rem)] w-80 max-w-[calc(100%-1rem)] overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-xl",
                pinned ? "pointer-events-auto ring-2 ring-primary/30" : "pointer-events-none"
            )}
        >
            {pinned && (
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close"
                    className="absolute right-2 top-2 rounded-full p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                >
                    <X className="h-4 w-4" />
                </button>
            )}
            {children}
        </div>
    );
}

export function CardHeader({
    flag,
    name,
    status,
    color,
}: {
    readonly flag?: string;
    readonly name: string;
    readonly status: string;
    readonly color: string;
}) {
    return (
        <div className="border-b border-slate-100 bg-slate-50 px-4 py-3 pr-11">
            <div className="flex items-center gap-3">
                <span className="text-2xl" aria-hidden="true">
                    {flag || "🏳️"}
                </span>
                <div className="min-w-0">
                    <h3 className="text-base font-bold leading-tight text-slate-900">{name}</h3>
                    <span className="mt-0.5 inline-flex items-center gap-1.5 text-sm font-medium text-slate-600">
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
                        {status}
                    </span>
                </div>
            </div>
        </div>
    );
}

export function CardRow({ label, children }: { readonly label: string; readonly children: ReactNode }) {
    return (
        <div className="flex items-start justify-between gap-3 text-sm">
            <span className="text-slate-500">{label}</span>
            <span className="text-right font-semibold text-slate-800">{children}</span>
        </div>
    );
}

export function CardLinks({
    links,
    pinned,
}: {
    readonly links: { title: string; url: string }[];
    readonly pinned: boolean;
}) {
    const usable = links.filter((link) => safeUrl(link.url));
    if (usable.length === 0) return null;

    if (!pinned) {
        return (
            <p className="text-xs text-slate-500">
                {usable.length} source{usable.length > 1 ? "s" : ""}. Click the country to open them.
            </p>
        );
    }

    return (
        <ul className="space-y-2">
            {usable.slice(0, 4).map((link) => (
                <li key={link.url}>
                    <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-primary hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                    >
                        <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{link.title || link.url}</span>
                    </a>
                </li>
            ))}
            {usable.length > 4 && (
                <li className="text-center text-xs text-slate-500">
                    +{usable.length - 4} more on the{" "}
                    <Link href="/sources" className="font-medium text-primary underline">
                        Sources page
                    </Link>
                </li>
            )}
        </ul>
    );
}
