"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { useUploadBatchQueriesMutation, useGetBatchJobStatusQuery } from "@/redux/api/apiSlice";

interface BatchAnalysisPanelProps {
    readonly isOpen: boolean;
    readonly onClose: () => void;
}

const STEPS = [
    "Upload an Excel file with one question per row in the first column.",
    "Each question is answered against the knowledge base.",
    "Download a PDF report with every answer.",
];

const labelClass = "mb-2 block text-sm font-medium text-slate-900";

export function BatchAnalysisPanel({ isOpen, onClose }: BatchAnalysisPanelProps) {
    const [uploadBatchQueries, { isLoading: isUploading }] = useUploadBatchQueriesMutation();

    const [file, setFile] = useState<File | null>(null);
    const [email, setEmail] = useState<string>("");
    const [jobId, setJobId] = useState<string | null>(null);
    const [isPollingActive, setIsPollingActive] = useState<boolean>(true);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const toastShownRef = useRef<string | null>(null);

    // RTK Query for batch job status polling
    const { data: jobStatus } = useGetBatchJobStatusQuery(jobId!, {
        skip: !jobId || !isPollingActive,
        pollingInterval: 5000, // Poll every 5 seconds instead of 3
    });

    // Handle status updates - only show toast once per status change
    // Stop polling when job is completed or failed
    useEffect(() => {
        if (jobStatus && jobStatus.status !== toastShownRef.current) {
            if (jobStatus.status === "completed") {
                toastShownRef.current = "completed";
                // The job status comes from polling; stopping the poll is a response to it
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setIsPollingActive(false); // Stop polling
                toast.success("Batch analysis complete. Your report is ready.");
            } else if (jobStatus.status === "failed") {
                toastShownRef.current = "failed";
                setIsPollingActive(false); // Stop polling
                toast.error("Batch analysis failed. Please try again.");
            }
        }
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
            setIsPollingActive(true); // Start polling for the new job
            toast.success("Batch analysis started");
        } catch (err) {
            console.error("Upload failed:", err);
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : (err as { data?: { detail?: string } })?.data?.detail || "Failed to start batch analysis";
            toast.error(errorMessage);
        }
    };

    const handleReset = () => {
        setFile(null);
        setEmail("");
        setJobId(null);
        setIsPollingActive(true); // Reset polling state
        toastShownRef.current = null;
    };

    const handleClose = () => {
        handleReset();
        onClose();
    };

    // Escape closes the panel
    useEffect(() => {
        if (!isOpen) return;
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                handleReset();
                onClose();
            }
        };
        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [isOpen, onClose]);

    const handleDownload = () => {
        const downloadUrl = jobStatus?.pdf_download_url || `${process.env.NEXT_PUBLIC_API_URL}/batch/download/${jobId}`;
        // Open in new tab instead of same window
        window.open(downloadUrl, "_blank", "noopener,noreferrer");
    };

    // Calculate progress percentage safely to avoid NaN
    const progressPercentage =
        jobStatus && jobStatus.total_queries > 0
            ? Math.round((jobStatus.completed_queries / jobStatus.total_queries) * 100)
            : 0;

    if (!isOpen) return null;

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
                                    ? "Something went wrong. Please try again."
                                    : jobStatus?.status === "processing"
                                    ? `Answered ${jobStatus.completed_queries} of ${jobStatus.total_queries} questions.`
                                    : "Getting started…"}
                            </p>

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
