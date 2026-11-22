"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { API_BASE_URL } from "@/lib/api-base";
import { useUploadBatchQueriesMutation, useGetBatchJobStatusQuery } from "@/redux/api/apiSlice";
import type { BatchQueryJob } from "@/types/api";

interface BatchAnalysisPanelProps {
    readonly isOpen: boolean;
    readonly onClose: () => void;
    /** Reopens the panel, for the progress notice that stays on screen while it is closed */
    readonly onOpen: () => void;
}

const STEPS = [
    "Upload an Excel file with one question per row in the first column.",
    "Each question is answered against the knowledge base.",
    "Download a PDF report with every answer.",
];

const labelClass = "mb-2 block text-sm font-medium text-slate-900";

// The job id is all that is needed to find a job again, so it is kept in this browser: closing the
// panel or reloading the page does not lose track of a job that is still running.
const STORAGE_KEY = "pdp.batchJobId";

function readStoredJobId(): string | null {
    try {
        return typeof window === "undefined" ? null : window.localStorage.getItem(STORAGE_KEY);
    } catch {
        return null;
    }
}

function storeJobId(jobId: string | null) {
    try {
        if (jobId) window.localStorage.setItem(STORAGE_KEY, jobId);
        else window.localStorage.removeItem(STORAGE_KEY);
    } catch {
        // Storage can be blocked (private windows): the job still runs, it just is not remembered
    }
}

/** Questions finished so far (answered or failed), so the bar keeps moving when a question fails */
function batchProgress(job: BatchQueryJob | undefined) {
    const total = job?.total_queries ?? 0;
    const done = Math.min(total, (job?.completed_queries ?? 0) + (job?.failed_queries ?? 0));
    return { total, done, percent: total > 0 ? Math.round((done / total) * 100) : 0 };
}

function BatchProgressNotice({
    job,
    onOpen,
    onDismiss,
}: {
    readonly job: BatchQueryJob;
    readonly onOpen: () => void;
    readonly onDismiss: () => void;
}) {
    const { total, done, percent } = batchProgress(job);
    const running = job.status === "pending" || job.status === "processing";
    let label = "Batch analysis starting…";
    if (job.status === "completed") label = "Batch report ready";
    else if (job.status === "failed") label = "Batch analysis failed";
    else if (total > 0) label = `Batch analysis: ${done} of ${total} questions`;

    let hint = "Click to see why";
    if (running) hint = "Click to see details";
    else if (job.status === "completed") hint = "Click to download";

    return (
        <div
            role="status"
            aria-live="polite"
            className="fixed right-4 top-20 z-30 flex w-72 items-start gap-2 rounded-lg border border-slate-200 bg-white p-3 shadow-lg animate-in fade-in slide-in-from-right duration-300"
        >
            <button type="button" onClick={onOpen} className="min-w-0 flex-1 text-left">
                <span className="flex items-center gap-2 text-sm font-medium text-slate-900">
                    {running && <Loader2 className="h-4 w-4 shrink-0 animate-spin text-primary" aria-hidden="true" />}
                    <span className="truncate">{label}</span>
                </span>
                {running && (
                    <span className="mt-2 block h-1.5 overflow-hidden rounded-full bg-slate-100">
                        <span
                            className="block h-full rounded-full bg-primary transition-all duration-500"
                            style={{ width: `${percent}%` }}
                        />
                    </span>
                )}
                <span className="mt-1 block text-xs text-slate-500">{hint}</span>
            </button>
            {!running && (
                <button
                    type="button"
                    onClick={onDismiss}
                    aria-label="Dismiss"
                    className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                    <X size={14} />
                </button>
            )}
        </div>
    );
}

export function BatchAnalysisPanel({ isOpen, onClose, onOpen }: BatchAnalysisPanelProps) {
    const [uploadBatchQueries, { isLoading: isUploading }] = useUploadBatchQueriesMutation();

    const [file, setFile] = useState<File | null>(null);
    const [email, setEmail] = useState<string>("");
    const [jobId, setJobId] = useState<string | null>(readStoredJobId);
    const [isPollingActive, setIsPollingActive] = useState<boolean>(true);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const toastShownRef = useRef<string | null>(null);
    // True once this page has seen the job still running. A job that is already finished when the
    // page loads is shown as it is, without announcing it again.
    const seenRunningRef = useRef(false);

    // This component stays mounted while the panel is closed, so the job keeps being followed
    const { data: jobStatus, error: statusError } = useGetBatchJobStatusQuery(jobId!, {
        skip: !jobId || !isPollingActive,
        pollingInterval: 5000,
    });
    const jobIsGone = (statusError as { status?: number } | undefined)?.status === 404;

    const handleReset = () => {
        setFile(null);
        setEmail("");
        setJobId(null);
        storeJobId(null);
        setIsPollingActive(true); // Reset polling state
        toastShownRef.current = null;
        seenRunningRef.current = false;
    };

    // Closing the panel only hides it: the job carries on and the notice shows its progress
    const handleClose = onClose;

    useEffect(() => {
        if (jobIsGone) {
            // The server no longer has this job (it was deleted): forget it
            // eslint-disable-next-line react-hooks/set-state-in-effect
            handleReset();
        }
    }, [jobIsGone]);

    // Announce the end of the job once, and stop polling when it is over
    useEffect(() => {
        if (!jobStatus) return;
        if (jobStatus.status === "pending" || jobStatus.status === "processing") {
            seenRunningRef.current = true;
            return;
        }
        if (jobStatus.status !== toastShownRef.current) {
            toastShownRef.current = jobStatus.status;
            setIsPollingActive(false); // Stop polling
            if (seenRunningRef.current) {
                const action = { label: "View", onClick: onOpen };
                if (jobStatus.status === "completed") {
                    toast.success("Batch analysis complete. Your report is ready.", { action });
                } else {
                    toast.error("Batch analysis failed.", { action });
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [jobStatus]);

    const selectFile = (selectedFile: File | undefined) => {
        if (!selectedFile) return;
        if (!/\.(xlsx|xls)$/i.test(selectedFile.name)) {
            toast.error("Please select a valid Excel file (.xlsx or .xls)");
            return;
        }
        setFile(selectedFile);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        selectFile(e.target.files?.[0]);
        e.target.value = "";
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        selectFile(e.dataTransfer.files[0]);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!file) {
            toast.error("Please select an Excel file");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        // Add email if provided
        if (email.trim()) {
            formData.append("user_email", email.trim());
        }

        try {
            const data = await uploadBatchQueries(formData).unwrap();
            setJobId(data.job_id);
            storeJobId(data.job_id);
            toastShownRef.current = null;
            seenRunningRef.current = false;
            setIsPollingActive(true); // Start polling for the new job
            toast.success("Batch analysis started. You can close this panel; progress stays on screen.");
        } catch (err) {
            console.error("Upload failed:", err);
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : (err as { data?: { detail?: string } })?.data?.detail || "Failed to start batch analysis";
            toast.error(errorMessage);
        }
    };

    // Escape hides the panel
    useEffect(() => {
        if (!isOpen) return;
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") onClose();
        };
        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [isOpen, onClose]);

    const handleDownload = () => {
        // Always go through the proxy: a direct backend URL would need the API key, which the browser does not have
        const downloadUrl = `${API_BASE_URL}/batch/download/${jobId}`;
        // Open in new tab instead of same window
        window.open(downloadUrl, "_blank", "noopener,noreferrer");
    };

    const { total, done, percent: progressPercentage } = batchProgress(jobStatus);
    const failedQuestions = jobStatus?.failed_queries ?? 0;

    // While the panel is closed, a small notice keeps the job's progress on screen
    if (!isOpen) {
        return jobId && jobStatus ? (
            <BatchProgressNotice job={jobStatus} onOpen={onOpen} onDismiss={handleReset} />
        ) : null;
    }

    const isCompleted = jobStatus?.status === "completed";
    const isFailed = jobStatus?.status === "failed";

    return (
        <>
            <button
                type="button"
                className="fixed inset-0 z-40 cursor-default bg-black/30 animate-in fade-in duration-200"
                onClick={handleClose}
                aria-label="Close panel"
                tabIndex={-1}
            />

            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="batch-panel-title"
                className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-2xl animate-in slide-in-from-right duration-300"
            >
                <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
                    <div>
                        <h2 id="batch-panel-title" className="text-lg font-semibold text-slate-900">
                            Batch analysis
                        </h2>
                        <p className="mt-0.5 text-sm text-slate-500">Answer many questions at once from a spreadsheet.</p>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClose}
                        aria-label="Close"
                        className="-mr-2 h-9 w-9 p-0 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                    >
                        <X size={18} />
                    </Button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    {!jobId ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <span className={labelClass}>Excel file</span>
                                <div
                                    className={`cursor-pointer rounded-lg border border-dashed p-8 text-center transition-colors ${
                                        isDragging
                                            ? "border-primary bg-slate-50"
                                            : "border-slate-300 hover:border-slate-400 hover:bg-slate-50"
                                    }`}
                                    onClick={() => fileInputRef.current?.click()}
                                    onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && fileInputRef.current?.click()}
                                    onDragOver={(e) => {
                                        e.preventDefault();
                                        setIsDragging(true);
                                    }}
                                    onDragLeave={() => setIsDragging(false)}
                                    onDrop={handleDrop}
                                    role="button"
                                    tabIndex={0}
                                    aria-label="Select Excel file to upload"
                                >
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept=".xlsx,.xls"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                    <p className="truncate text-sm font-medium text-slate-900">
                                        {file ? file.name : "Drop an Excel file here or click to browse"}
                                    </p>
                                    <p className="mt-1 text-xs text-slate-500">
                                        {file ? `${(file.size / 1024).toFixed(1)} KB` : "XLSX or XLS"}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="batch-email" className={labelClass}>
                                    Email <span className="font-normal text-slate-500">(optional)</span>
                                </label>
                                <Input
                                    id="batch-email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                />
                                <p className="mt-1.5 text-xs text-slate-500">
                                    We will email you when the report is ready.
                                </p>
                            </div>

                            <div className="rounded-lg bg-slate-50 p-4">
                                <h3 className="mb-2 text-sm font-medium text-slate-900">How it works</h3>
                                <ol className="list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-slate-600">
                                    {STEPS.map((step) => (
                                        <li key={step}>{step}</li>
                                    ))}
                                </ol>
                            </div>

                            <Button type="submit" disabled={!file || isUploading} className="h-11 w-full text-base">
                                {isUploading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Starting…
                                    </>
                                ) : (
                                    "Start batch analysis"
                                )}
                            </Button>
                        </form>
                    ) : (
                        <div className="py-4">
                            <h3 className="text-lg font-semibold text-slate-900">
                                {isCompleted ? "Analysis complete" : isFailed ? "Analysis failed" : "Processing questions"}
                            </h3>
                            <p className="mt-1 text-sm text-slate-600">
                                {isCompleted
                                    ? "Your PDF report is ready to download."
                                    : isFailed
                                    ? jobStatus?.error_message || "Something went wrong. Please try again."
                                    : jobStatus?.status === "processing"
                                    ? "Finished " +
                                      done +
                                      " of " +
                                      total +
                                      " questions" +
                                      (failedQuestions > 0 ? " (" + failedQuestions + " could not be answered)" : "") +
                                      "."
                                    : "Getting started…"}
                            </p>
                            {!isCompleted && !isFailed && (
                                <p className="mt-2 text-sm text-slate-500">
                                    This can take several minutes. You can close this panel: progress stays on screen and
                                    is remembered in this browser, so you can come back to it.
                                </p>
                            )}

                            {!isFailed && (
                                <div className="mt-6">
                                    <div
                                        role="progressbar"
                                        aria-valuemin={0}
                                        aria-valuemax={100}
                                        aria-valuenow={isCompleted ? 100 : progressPercentage}
                                        aria-label="Batch progress"
                                        className="h-2 overflow-hidden rounded-full bg-slate-100"
                                    >
                                        <div
                                            className="h-full rounded-full bg-primary transition-all duration-500"
                                            style={{ width: `${isCompleted ? 100 : progressPercentage}%` }}
                                        />
                                    </div>
                                    <p className="mt-2 text-xs tabular-nums text-slate-500">
                                        {isCompleted ? 100 : progressPercentage}%
                                    </p>
                                </div>
                            )}

                            <div className="mt-8 flex flex-col gap-3">
                                {isCompleted && (
                                    <>
                                        <Button onClick={handleDownload} className="h-11">
                                            Download PDF report
                                        </Button>
                                        <Button onClick={handleReset} variant="outline" className="h-11">
                                            Start a new batch
                                        </Button>
                                    </>
                                )}
                                {isFailed && (
                                    <Button onClick={handleReset} variant="outline" className="h-11">
                                        Try again
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
