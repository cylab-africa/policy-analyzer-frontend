"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { useUploadDocumentsMutation } from "@/redux/api/apiSlice";

interface UploadPanelProps {
    readonly isOpen: boolean;
    readonly onClose: () => void;
}

const VALID_EXTENSIONS = [".pdf", ".txt", ".doc", ".docx", ".md"];

const labelClass = "mb-2 block text-sm font-medium text-slate-900";

export function UploadPanel({ isOpen, onClose }: UploadPanelProps) {
    const [uploadDocuments, { isLoading: isUploading }] = useUploadDocumentsMutation();

    const [files, setFiles] = useState<File[]>([]);
    const [visibility, setVisibility] = useState<"public" | "private">("public");
    const [category, setCategory] = useState("data-protection");
    const [clientId, setClientId] = useState("");
    const [isComplete, setIsComplete] = useState(false);
    const [uploadedCount, setUploadedCount] = useState(0);
    const [isDragging, setIsDragging] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const toastShownRef = useRef(false);

    const addFiles = (selectedFiles: File[]) => {
        const invalidFiles = selectedFiles.filter(
            (file) => !VALID_EXTENSIONS.some((ext) => file.name.toLowerCase().endsWith(ext))
        );

        if (invalidFiles.length > 0) {
            toast.error(`Invalid file types: ${invalidFiles.map((f) => f.name).join(", ")}`);
            return;
        }

        setFiles((prev) => [...prev, ...selectedFiles]);
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

    const removeFile = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const handleUpload = async () => {
        if (files.length === 0) {
            toast.error("Please select at least one file");
            return;
        }

        if (visibility === "private" && !clientId) {
            toast.error("Client ID is required for private documents");
            return;
        }

        const formData = new FormData();
        for (const file of files) {
            formData.append("files", file);
        }
        formData.append("visibility", visibility);
        formData.append("tab", category);
        if (visibility === "private" && clientId) {
            formData.append("client_id", clientId);
        }

        try {
            await uploadDocuments(formData).unwrap();
            setUploadedCount(files.length);
            setIsComplete(true);
            // Only show toast once
            if (!toastShownRef.current) {
                toastShownRef.current = true;
                toast.success(`${files.length} document${files.length > 1 ? "s" : ""} uploaded`);
            }
        } catch (err) {
            console.error("Upload failed:", err);
            let errorMessage = "Failed to upload documents";
            if (err instanceof Error) {
                errorMessage = err.message;
            } else if (
                err &&
                typeof err === "object" &&
                "data" in err &&
                err.data &&
                typeof err.data === "object" &&
                "detail" in err.data &&
                typeof err.data.detail === "string"
            ) {
                errorMessage = err.data.detail;
            }
            toast.error(errorMessage);
        }
    };

    const handleReset = () => {
        setFiles([]);
        setClientId("");
        setIsComplete(false);
        setUploadedCount(0);
        toastShownRef.current = false;
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

    if (!isOpen) return null;

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
                        onClick={handleClose}
                        aria-label="Close"
                        className="-mr-2 h-9 w-9 p-0 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                    >
                        <X size={18} />
                    </Button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    {!isComplete ? (
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
                                    <p className="mt-1 text-xs text-slate-500">PDF, TXT, DOC, DOCX or MD, up to 10 MB each</p>
                                </div>
                            </div>

                            {files.length > 0 && (
                                <div>
                                    <span className={labelClass}>Selected ({files.length})</span>
                                    <ul className="max-h-44 divide-y divide-slate-200 overflow-y-auto rounded-lg border border-slate-200">
                                        {files.map((file, idx) => (
                                            <li key={idx} className="flex items-center justify-between gap-3 px-3 py-2">
                                                <div className="min-w-0">
                                                    <p className="truncate text-sm text-slate-900">{file.name}</p>
                                                    <p className="text-xs text-slate-500">
                                                        {(file.size / 1024).toFixed(1)} KB
                                                    </p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeFile(idx)}
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
                                ) : (
                                    `Upload ${files.length > 1 ? `${files.length} documents` : files.length === 1 ? "document" : "documents"}`
                                )}
                            </Button>
                        </div>
                    ) : (
                        <div className="py-8">
                            <h3 className="text-lg font-semibold text-slate-900">Upload complete</h3>
                            <p className="mt-2 text-sm leading-relaxed text-slate-600">
                                {uploadedCount} document{uploadedCount > 1 ? "s" : ""} uploaded. They are being indexed
                                and will be searchable shortly.
                            </p>

                            <div className="mt-8 flex flex-col gap-3">
                                <Button onClick={handleReset} className="h-11">
                                    Upload more documents
                                </Button>
                                <Button onClick={handleClose} variant="outline" className="h-11">
                                    Done
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
