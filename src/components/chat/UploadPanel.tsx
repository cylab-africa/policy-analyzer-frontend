"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/errors";
import { useGetDocumentProcessingStatusQuery, useUploadDocumentsMutation } from "@/redux/api/apiSlice";
import type { DocumentProcessingStatus } from "@/types/api";

interface UploadPanelProps {
    readonly isOpen: boolean;
    readonly onClose: () => void;
}

// The types the backend can read. The old Word format (.doc) is not one of them.
const VALID_EXTENSIONS = [".pdf", ".txt", ".docx", ".md"];

// The backend's default limit (MAX_FILE_SIZE). The server has the final say; checking here saves
// uploading a file only to have it refused.
const MAX_FILE_BYTES = 10 * 1024 * 1024;
// The backend refuses more than this in one upload
const MAX_FILES = 10;

const labelClass = "mb-2 block text-sm font-medium text-slate-900";

const fileKey = (file: File) => `${file.name}:${file.size}:${file.lastModified}`;

const plural = (count: number, word: string) => `${count} ${word}${count === 1 ? "" : "s"}`;

function formatSize(bytes: number): string {
    return bytes >= 1024 * 1024 ? `${(bytes / (1024 * 1024)).toFixed(1)} MB` : `${(bytes / 1024).toFixed(1)} KB`;
}

export function UploadPanel({ isOpen, onClose }: UploadPanelProps) {
    const [uploadDocuments, { isLoading: isUploading }] = useUploadDocumentsMutation();

    const [files, setFiles] = useState<File[]>([]);
    const [visibility, setVisibility] = useState<"public" | "private">("public");
    const [category, setCategory] = useState("data-protection");
    const [clientId, setClientId] = useState("");
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [uploadedCount, setUploadedCount] = useState(0);
    const [isDragging, setIsDragging] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const announcedRef = useRef<string | null>(null);
    const isOpenRef = useRef(isOpen);
    useEffect(() => {
        isOpenRef.current = isOpen;
    }, [isOpen]);

    // Indexing runs in the background after the upload; follow it until it is over. The panel
    // stays mounted while closed, so a closed panel still hears how it ended. Polling stops by
    // interval rather than `skip`, which would also drop the last result.
    const [lastStatus, setLastStatus] = useState<string | undefined>(undefined);
    const doneStatus = lastStatus === "completed" || lastStatus === "error";
    const { data: task, error: statusError } = useGetDocumentProcessingStatusQuery(processingId!, {
        skip: !processingId,
        pollingInterval: doneStatus ? 0 : 4000,
    });
    const finished = task?.status === "completed" || task?.status === "error";
    if (task?.status !== lastStatus) setLastStatus(task?.status); // adjust state during render, not in an effect
    const statusLost = (statusError as { status?: unknown } | undefined)?.status === 404;
    const indexing = Boolean(processingId) && !finished && !statusLost;

    // Tell the visitor how indexing ended, once, if the panel is not open to show it
    useEffect(() => {
        if (!processingId || !task || !finished || announcedRef.current === processingId) return;
        announcedRef.current = processingId;
        if (isOpenRef.current) return;
        if (task.status === "error") {
            toast.error(task.error_message || "The documents could not be indexed.");
        } else if (task.failed_count > 0) {
            toast.warning(`${plural(task.processed_count, "document")} indexed. Could not index: ${task.failed_files.join(", ")}`);
        } else {
            toast.success(`${plural(task.processed_count, "document")} indexed and ready to search.`);
        }
    }, [processingId, task, finished]);

    const addFiles = (selectedFiles: File[]) => {
        const problems: string[] = [];
        const accepted: File[] = [];
        const known = new Set(files.map(fileKey));

        for (const file of selectedFiles) {
            if (!VALID_EXTENSIONS.some((ext) => file.name.toLowerCase().endsWith(ext))) {
                problems.push(`${file.name} is not a PDF, TXT, DOCX or MD file`);
            } else if (file.size === 0) {
                problems.push(`${file.name} is empty`);
            } else if (file.size > MAX_FILE_BYTES) {
                problems.push(`${file.name} is larger than 10 MB`);
            } else if (!known.has(fileKey(file))) {
                known.add(fileKey(file));
                accepted.push(file);
            }
        }

        const room = MAX_FILES - files.length;
        if (accepted.length > room) {
            problems.push(`You can upload up to ${MAX_FILES} files at a time`);
            accepted.splice(room);
        }

        if (problems.length > 0) toast.error(problems.join(". "));
        if (accepted.length > 0) setFiles((prev) => [...prev, ...accepted]);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            addFiles(Array.from(e.target.files));
            // Allow choosing the same file again after removing it
            e.target.value = "";
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        addFiles(Array.from(e.dataTransfer.files));
    };

    const removeFile = (key: string) => {
        setFiles((prev) => prev.filter((file) => fileKey(file) !== key));
    };

    const handleUpload = async () => {
        if (files.length === 0) {
            toast.error("Please select at least one file");
            return;
        }

        const trimmedClientId = clientId.trim();
        if (visibility === "private" && !trimmedClientId) {
            toast.error("Client ID is required for private documents");
            return;
        }

        const formData = new FormData();
        for (const file of files) {
            formData.append("files", file);
        }
        formData.append("visibility", visibility);
        formData.append("tab", category);
        if (visibility === "private") {
            formData.append("client_id", trimmedClientId);
        }

        try {
            const result = await uploadDocuments(formData).unwrap();
            setUploadedCount(files.length);
            setProcessingId(result.processing_id);
        } catch (err) {
            console.error("Upload failed:", err);
            toast.error(getErrorMessage(err, "The documents could not be uploaded. Please try again."));
        }
    };

    const handleReset = () => {
        setFiles([]);
        setClientId("");
        setProcessingId(null);
        setLastStatus(undefined);
        setUploadedCount(0);
    };

    // Closing only hides the panel: the selection and any indexing in progress are kept
    const handleDone = () => {
        handleReset();
        onClose();
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

    if (!isOpen) return null;

    return (
        <>
            <button
                type="button"
                className="fixed inset-0 z-40 cursor-default bg-black/30 animate-in fade-in duration-200"
                onClick={onClose}
                aria-label="Close panel"
                tabIndex={-1}
            />

            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="upload-panel-title"
                className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-2xl animate-in slide-in-from-right duration-300"
            >
                <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
                    <div>
                        <h2 id="upload-panel-title" className="text-lg font-semibold text-slate-900">
                            Upload documents
                        </h2>
                        <p className="mt-0.5 text-sm text-slate-500">Add a law or policy so answers can draw on it.</p>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        aria-label="Close"
                        className="-mr-2 h-9 w-9 p-0 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                    >
                        <X size={18} />
                    </Button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    {!processingId ? (
                        <div className="space-y-6">
                            <div>
                                <span className={labelClass}>Documents</span>
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
                                    aria-label="Select files to upload"
                                >
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        multiple
                                        accept={VALID_EXTENSIONS.join(",")}
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                    <p className="text-sm font-medium text-slate-900">
                                        Drop files here or click to browse
                                    </p>
                                    <p className="mt-1 text-xs text-slate-500">Up to 10 files (PDF, TXT, DOCX or MD), 10 MB each</p>
                                </div>
                            </div>

                            {files.length > 0 && (
                                <div>
                                    <span className={labelClass}>Selected ({files.length})</span>
                                    <ul className="max-h-44 divide-y divide-slate-200 overflow-y-auto rounded-lg border border-slate-200">
                                        {files.map((file) => (
                                            <li key={fileKey(file)} className="flex items-center justify-between gap-3 px-3 py-2">
                                                <div className="min-w-0">
                                                    <p className="truncate text-sm text-slate-900">{file.name}</p>
                                                    <p className="text-xs text-slate-500">{formatSize(file.size)}</p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeFile(fileKey(file))}
                                                    className="shrink-0 cursor-pointer text-xs font-medium text-slate-500 hover:text-red-600"
                                                    aria-label={`Remove ${file.name}`}
                                                >
                                                    Remove
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <span className={labelClass}>Category</span>
                                    <Select value={category} onValueChange={setCategory}>
                                        <SelectTrigger className="w-full bg-white" aria-label="Category">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="data-protection">Data Protection</SelectItem>
                                            <SelectItem value="digital-id">Digital ID</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex-1">
                                    <span className={labelClass}>Visibility</span>
                                    <Select
                                        value={visibility}
                                        onValueChange={(v) => setVisibility(v as "public" | "private")}
                                    >
                                        <SelectTrigger className="w-full bg-white" aria-label="Visibility">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="public">Public</SelectItem>
                                            <SelectItem value="private">Private</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {visibility === "private" && (
                                <div>
                                    <label htmlFor="upload-client-id" className={labelClass}>
                                        Client ID
                                    </label>
                                    <Input
                                        id="upload-client-id"
                                        type="text"
                                        value={clientId}
                                        onChange={(e) => setClientId(e.target.value)}
                                        placeholder="Your client identifier"
                                        maxLength={100}
                                    />
                                    <p className="mt-1.5 text-xs text-slate-500">Required to access private documents.</p>
                                </div>
                            )}

                            <p className="rounded-lg bg-slate-50 p-4 text-sm leading-relaxed text-slate-600">
                                Documents are split into passages and indexed under the category you choose. Public
                                documents become searchable for every user of the Policy Analyzer, so upload only
                                documents you are allowed to share.
                            </p>

                            <Button
                                onClick={handleUpload}
                                disabled={files.length === 0 || isUploading}
                                className="h-11 w-full text-base"
                            >
                                {isUploading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Uploading…
                                    </>
                                ) : files.length > 1 ? (
                                    `Upload ${files.length} documents`
                                ) : (
                                    "Upload document"
                                )}
                            </Button>
                        </div>
                    ) : (
                        <div className="py-8" role="status" aria-live="polite">
                            <UploadResult
                                indexing={indexing}
                                statusLost={statusLost}
                                uploadedCount={uploadedCount}
                                task={task}
                            />

                            <div className="mt-8 flex flex-col gap-3">
                                {!indexing && (
                                    <Button onClick={handleReset} className="h-11">
                                        Upload more documents
                                    </Button>
                                )}
                                <Button onClick={indexing ? onClose : handleDone} variant="outline" className="h-11">
                                    {indexing ? "Close" : "Done"}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

function UploadResult({
    indexing,
    statusLost,
    uploadedCount,
    task,
}: {
    readonly indexing: boolean;
    readonly statusLost: boolean;
    readonly uploadedCount: number;
    readonly task: DocumentProcessingStatus | undefined;
}) {
    if (indexing) {
        return (
            <>
                <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" aria-hidden="true" />
                    Indexing {plural(uploadedCount, "document")}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    Each document is read and split into searchable passages. This can take a minute or two per
                    document. You can close this panel; you will be told when it is done.
                </p>
            </>
        );
    }

    if (statusLost || !task) {
        return (
            <>
                <h3 className="text-lg font-semibold text-slate-900">Upload received</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    The documents were uploaded, but their indexing status is no longer available.
                </p>
            </>
        );
    }

    if (task.status === "error") {
        return (
            <>
                <h3 className="text-lg font-semibold text-slate-900">Indexing failed</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {task.error_message || "The documents could not be indexed. Please try again."}
                </p>
            </>
        );
    }

    return (
        <>
            <h3 className="text-lg font-semibold text-slate-900">
                {task.failed_count > 0 ? "Indexing finished with problems" : "Documents ready"}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {plural(task.processed_count, "document")} indexed and now searchable in the chat.
            </p>
            {task.failed_count > 0 && (
                <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                    <p className="font-medium">Could not be indexed:</p>
                    <ul className="mt-1 list-disc pl-5">
                        {task.failed_files.map((name) => (
                            <li key={name} className="break-all">
                                {name}
                            </li>
                        ))}
                    </ul>
                    <p className="mt-2 text-amber-800">
                        Check that these files contain readable text (not only scanned images) and try again.
                    </p>
                </div>
            )}
        </>
    );
}
