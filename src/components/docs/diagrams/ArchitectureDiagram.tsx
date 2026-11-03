import type { ReactNode } from "react";
import { Figure } from "../primitives";

function Box({
    title,
    children,
    optional = false,
}: {
    readonly title: string;
    readonly children: ReactNode;
    readonly optional?: boolean;
}) {
    return (
        <div
            className={`rounded-lg border bg-white p-3 ${optional ? "border-dashed border-slate-300" : "border-slate-300"}`}
        >
            <p className="text-sm font-semibold text-slate-900">{title}</p>
            <p className="mt-0.5 text-xs leading-relaxed text-slate-600">{children}</p>
        </div>
    );
}

// Two-way link between two parts: down on small screens, across on wide ones
function Link() {
    return (
        <div
            aria-hidden="true"
            className="flex items-center justify-center py-1 text-lg text-slate-400 md:px-1 md:py-0"
        >
            <span className="md:hidden">↕</span>
            <span className="hidden md:block">↔</span>
        </div>
    );
}

const GroupLabel = ({ children }: { readonly children: ReactNode }) => (
    <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">{children}</p>
);

export function ArchitectureDiagram() {
    return (
        <Figure caption="Figure 1. How the parts connect. The website only talks to the backend; the backend talks to the data stores and to the AI provider. Dashed boxes are optional.">
            <div className="grid grid-cols-1 items-center md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1.5fr)]">
                <Box title="Website">Next.js. Maps, Sources library, chat and upload screens.</Box>
                <Link />
                <Box title="Backend API">FastAPI. Answers questions, processes documents, runs batch jobs.</Box>
                <Link />
                <div className="space-y-4">
                    <div>
                        <GroupLabel>Data stores</GroupLabel>
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-1">
                            <Box title="Qdrant">Document passages, searched by meaning.</Box>
                            <Box title="MongoDB">Country data, document tasks, batch jobs.</Box>
                            <Box title="SQLite">Conversation history.</Box>
                            <Box title="Redis">Cache of repeated questions.</Box>
                        </div>
                    </div>
                    <div>
                        <GroupLabel>Outside services</GroupLabel>
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-1">
                            <Box title="AI provider">Language and embedding models.</Box>
                            <Box title="Web search, email, S3" optional>
                                Recent news, batch notifications, file storage.
                            </Box>
                        </div>
                    </div>
                </div>
            </div>
        </Figure>
    );
}
