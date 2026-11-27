import { Fragment } from "react";
import { Figure } from "../primitives";

const steps = [
    { title: "Question", text: "Your question, with recent messages as context.", optional: false },
    {
        title: "Query processing",
        text: "Query rewriting, scope guardrail, and detection of countries and intent.",
        optional: false,
    },
    {
        title: "Hybrid retrieval",
        text: "Semantic and keyword search with metadata filters, merged by rank fusion.",
        optional: false,
    },
    {
        title: "Web search",
        text: "Augments the context only when little is found or the question asks for recent news.",
        optional: true,
    },
    { title: "Grounded generation", text: "An LLM writes the answer from the retrieved context.", optional: false },
];

// The steps sit in a row when the figure is wide enough to read them (the container query measures the figure,
// not the window, because the contents list takes part of the width), and stack below that.
export function AnalysisFlowDiagram() {
    return (
        <Figure caption="Figure 2. The RAG pipeline, from question to answer. The dashed step happens only when needed.">
            <div className="@container">
                <ol className="flex flex-col @[44rem]:flex-row">
                    {steps.map((step, index) => (
                        <Fragment key={step.title}>
                            {index > 0 && (
                                <li
                                    aria-hidden="true"
                                    className="flex items-center justify-center py-1 text-lg leading-none text-slate-400 @[44rem]:px-1.5 @[44rem]:py-0"
                                >
                                    <span className="@[44rem]:hidden">↓</span>
                                    <span className="hidden @[44rem]:block">→</span>
                                </li>
                            )}
                            <li
                                className={`rounded-lg border bg-white p-3 @[28rem]:grid @[28rem]:grid-cols-[10rem_minmax(0,1fr)] @[28rem]:gap-4 @[44rem]:block @[44rem]:flex-1 ${
                                    step.optional ? "border-dashed border-slate-300" : "border-slate-300"
                                }`}
                            >
                                <div>
                                    <p className="text-xs font-semibold text-slate-500">Step {index + 1}</p>
                                    <p className="text-sm font-semibold text-slate-900">{step.title}</p>
                                </div>
                                <p className="mt-1 text-xs leading-relaxed text-slate-600 @[28rem]:mt-0 @[28rem]:text-sm @[44rem]:mt-1 @[44rem]:text-xs">
                                    {step.text}
                                </p>
                            </li>
                        </Fragment>
                    ))}
                </ol>
            </div>
        </Figure>
    );
}
