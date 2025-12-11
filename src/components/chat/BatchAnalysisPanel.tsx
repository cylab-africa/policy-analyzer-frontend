"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, Loader2, CheckCircle2, XCircle, X, Download, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { useUploadBatchQueriesMutation, useGetBatchJobStatusQuery } from "@/redux/api/apiSlice";

interface BatchAnalysisPanelProps {
    readonly isOpen: boolean;
    readonly onClose: () => void;
}

export function BatchAnalysisPanel({ isOpen, onClose }: BatchAnalysisPanelProps) {
    const [uploadBatchQueries, { isLoading: isUploading }] = useUploadBatchQueriesMutation();

    const [file, setFile] = useState<File | null>(null);
    const [email, setEmail] = useState<string>("");
    const [jobId, setJobId] = useState<string | null>(null);
    const [isPollingActive, setIsPollingActive] = useState<boolean>(true);
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
                setIsPollingActive(false); // Stop polling
                toast.success("Batch analysis complete! Your report is ready.");
            } else if (jobStatus.status === "failed") {
                toastShownRef.current = "failed";
                setIsPollingActive(false); // Stop polling
                toast.error("Batch analysis failed. Please try again.");
            }
        }
    }, [jobStatus]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            if (!/\.(xlsx|xls)$/i.test(selectedFile.name)) {
                toast.error("Please select a valid Excel file (.xlsx or .xls)");
                return;
            }
            setFile(selectedFile);
        }
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
            toast.success("Batch analysis started!");
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

    // Convert to string for SVG attribute
    const strokeDashoffset = String(351.9 - (351.9 * progressPercentage) / 100);

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/20 z-40 animate-in fade-in duration-200"
                onClick={handleClose}
                onKeyDown={(e) => e.key === "Escape" && handleClose()}
                role="button"
                tabIndex={0}
                aria-label="Close panel"
            />

            {/* Slide-over Panel */}
            <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 animate-in slide-in-from-right duration-300 flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-emerald-50/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-emerald-100 rounded-xl">
                            <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-slate-800">Batch Analysis</h2>
                            <p className="text-xs text-slate-500">Process multiple queries at once</p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClose}
                        className="h-9 w-9 p-0 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
                    >
                        <X size={20} />
                    </Button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {!jobId ? (
                        <form onSubmit={handleSubmit} className="space-y-6 h-full flex flex-col">
                            {/* Excel Upload Area */}
                            <div>
                                <label className="text-sm font-medium text-slate-700 mb-2.5 block">Excel File</label>
                                <div
                                    className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
                                        file
                                            ? "border-emerald-300 bg-emerald-50"
                                            : "border-slate-200 hover:border-emerald-400 bg-slate-50/50 hover:bg-emerald-50/50"
                                    }`}
                                    onClick={() => fileInputRef.current?.click()}
                                    onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
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
                                    <div className="flex flex-col items-center gap-3">
                                        <div
                                            className={`p-3 rounded-xl transition-colors ${
                                                file ? "bg-emerald-100" : "bg-white border border-slate-200"
                                            }`}
                                        >
                                            <FileSpreadsheet
                                                className={`w-6 h-6 ${file ? "text-emerald-600" : "text-slate-400"}`}
                                            />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-700">
                                                {file ? file.name : "Drop Excel file or click to browse"}
                                            </p>
                                            <p className="text-xs text-slate-400 mt-1">
                                                {file ? `${(file.size / 1024).toFixed(1)} KB` : "XLSX or XLS format"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Email Input (Optional) */}
                            <div>
                                <label htmlFor="email" className="text-sm font-medium text-slate-700 mb-2.5 block">
                                    Email (Optional)
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    className="w-full h-11 px-4 rounded-xl border border-slate-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all text-sm text-slate-700 placeholder:text-slate-400"
                                />
                                <p className="text-xs text-slate-500 mt-2">
                                    Receive a notification when your report is ready
                                </p>
                            </div>

                            {/* Info Box */}
                            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                <h4 className="text-sm font-medium text-slate-700 mb-3">How it works</h4>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-3">
                                        <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-semibold shrink-0 mt-0.5">
                                            1
                                        </span>
                                        <p className="text-sm text-slate-600">
                                            Upload an Excel file with queries in the first column
                                        </p>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-semibold shrink-0 mt-0.5">
                                            2
                                        </span>
                                        <p className="text-sm text-slate-600">
                                            Each query is processed against the knowledge base
                                        </p>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-semibold shrink-0 mt-0.5">
                                            3
                                        </span>
                                        <p className="text-sm text-slate-600">
                                            Download a comprehensive PDF report with all answers
                                        </p>
                                    </li>
                                </ul>
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                disabled={!file || isUploading}
                                className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 font-medium shadow-sm text-base rounded-xl"
                            >
                                {isUploading ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Starting Analysis...
                                    </>
                                ) : (
                                    <>
                                        <FileSpreadsheet className="mr-2 h-5 w-5" />
                                        Start Batch Analysis
                                    </>
                                )}
                            </Button>
                        </form>
                    ) : (
                        /* Processing Status */
                        <div className="flex flex-col items-center justify-center h-full text-center py-8">
                            {/* Progress Circle */}
                            <div className="relative w-32 h-32 mb-6">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle
                                        cx="64"
                                        cy="64"
                                        r="56"
                                        stroke="currentColor"
                                        strokeWidth="8"
                                        fill="transparent"
                                        className="text-slate-100"
                                    />
                                    <circle
                                        cx="64"
                                        cy="64"
                                        r="56"
                                        stroke="currentColor"
                                        strokeWidth="8"
                                        fill="transparent"
                                        strokeDasharray="351.9"
                                        strokeDashoffset={strokeDashoffset}
                                        strokeLinecap="round"
                                        className={`transition-all duration-500 ${
                                            jobStatus?.status === "failed"
                                                ? "text-red-500"
                                                : jobStatus?.status === "completed"
                                                ? "text-emerald-500"
                                                : "text-emerald-600"
                                        }`}
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    {jobStatus?.status === "completed" ? (
                                        <CheckCircle2 className="w-14 h-14 text-emerald-500" />
                                    ) : jobStatus?.status === "failed" ? (
                                        <XCircle className="w-14 h-14 text-red-500" />
                                    ) : (
                                        <span className="text-3xl font-bold text-slate-700">{progressPercentage}%</span>
                                    )}
                                </div>
                            </div>

                            <h3 className="text-xl font-semibold text-slate-900 mb-2">
                                {jobStatus?.status === "completed"
                                    ? "Analysis Complete!"
                                    : jobStatus?.status === "failed"
                                    ? "Analysis Failed"
                                    : "Processing Queries..."}
                            </h3>
                            <p className="text-sm text-slate-500 max-w-xs mb-8">
                                {jobStatus?.status === "processing"
                                    ? `Processed ${jobStatus.completed_queries} of ${jobStatus.total_queries} queries`
                                    : jobStatus?.status === "completed"
                                    ? "Your PDF report is ready for download"
                                    : jobStatus?.status === "failed"
                                    ? "Something went wrong. Please try again."
                                    : "Initializing batch processing..."}
                            </p>

                            {jobStatus?.status === "completed" && (
                                <div className="flex flex-col gap-3 w-full max-w-xs">
                                    <Button
                                        onClick={handleDownload}
                                        className="h-12 bg-emerald-600 hover:bg-emerald-700 font-medium rounded-xl"
                                    >
                                        <Download className="mr-2 h-5 w-5" />
                                        Download PDF Report
                                        <ExternalLink className="ml-2 h-4 w-4 opacity-60" />
                                    </Button>
                                    <Button onClick={handleReset} variant="outline" className="h-11 rounded-xl">
                                        Start New Batch
                                    </Button>
                                </div>
                            )}

                            {jobStatus?.status === "failed" && (
                                <Button onClick={handleReset} variant="outline" className="h-11 rounded-xl">
                                    Try Again
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
