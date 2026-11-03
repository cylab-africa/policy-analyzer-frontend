"use client";

import { useState } from "react";

// A block of commands with a copy button
export function CodeBlock({ label, children }: { readonly label: string; readonly children: string }) {
    const [copied, setCopied] = useState(false);

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(children);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Clipboard access can be blocked; the text stays selectable
        }
    };

    return (
        <div className="mb-6 overflow-hidden rounded-lg border border-slate-800 bg-slate-900">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-2 text-xs text-slate-400">
                <span>{label}</span>
                <button
                    type="button"
                    onClick={copy}
                    className="cursor-pointer font-medium text-slate-300 transition-colors hover:text-white"
                >
                    {copied ? "Copied" : "Copy"}
                </button>
            </div>
            <pre className="overflow-x-auto p-4 font-mono text-sm leading-relaxed text-slate-100">
                <code>{children}</code>
            </pre>
        </div>
    );
}
