"use client";

import { cn } from "@/lib/utils";
import { ChatTab } from ".";

const linkClass = "cursor-pointer font-medium text-primary underline underline-offset-2 hover:text-primary/80";

export function WelcomeScreen({
    wide,
    activeTab,
    setInput,
    suggestedQuestions,
    onUploadClick,
    onBatchClick,
}: {
    wide?: boolean;
    activeTab: ChatTab;
    setInput: (input: string) => void;
    suggestedQuestions: Record<ChatTab, string[]>;
    onUploadClick?: () => void;
    onBatchClick?: () => void;
}) {
    // Read ChatTab at render time: this file and the chat index import each other
    const { title, blurb } =
        activeTab === ChatTab.DATA_PROTECTION
            ? {
                  title: "Explore data protection policy",
                  blurb: "Ask what each country's law requires, who enforces it, and how countries compare.",
              }
            : {
                  title: "Explore digital identity systems",
                  blurb: "Ask how national ID systems work, how far they have rolled out, and which laws govern them across Africa.",
              };

    return (
        <div
            className={cn(
                "mx-auto flex min-h-full flex-col justify-center px-4 py-10 transition-[max-width] duration-300 ease-in-out sm:px-8",
                wide ? "max-w-4xl" : "max-w-3xl"
            )}
        >
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">{title}</h2>
            <p className="mt-3 max-w-xl leading-relaxed text-slate-600">{blurb}</p>

            <h3 className="mt-10 text-sm font-semibold text-slate-900">Sample questions</h3>
            <ul className="mt-3 divide-y divide-slate-200 overflow-hidden rounded-xl border border-slate-200">
                {suggestedQuestions[activeTab].map((question) => (
                    <li key={question}>
                        <button
                            type="button"
                            onClick={() => setInput(question)}
                            className="w-full cursor-pointer px-4 py-3 text-left text-sm text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900 focus-visible:bg-slate-50 focus-visible:outline-none"
                        >
                            {question}
                        </button>
                    </li>
                ))}
            </ul>

            <p className="mt-8 text-sm leading-relaxed text-slate-600">
                You can also{" "}
                <button type="button" onClick={onUploadClick} className={linkClass}>
                    upload a document
                </button>{" "}
                so answers can draw on it, or{" "}
                <button type="button" onClick={onBatchClick} className={linkClass}>
                    run a batch of up to 100 questions
                </button>{" "}
                from a spreadsheet and get a PDF report.
            </p>
        </div>
    );
}
