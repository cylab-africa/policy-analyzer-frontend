"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Loader2, CheckCircle2, X, Upload, Info } from "lucide-react";
import { toast } from "sonner";
import { useUploadDocumentsMutation } from "@/redux/api/apiSlice";

interface UploadPanelProps {
    readonly isOpen: boolean;
    readonly onClose: () => void;
}

export function UploadPanel({ isOpen, onClose }: UploadPanelProps) {
    const [uploadDocuments, { isLoading: isUploading }] = useUploadDocumentsMutation();

    const [files, setFiles] = useState<File[]>([]);
    const [visibility, setVisibility] = useState<"public" | "private">("public");
    const [category, setCategory] = useState("data-protection");
    const [clientId, setClientId] = useState("");
    const [isComplete, setIsComplete] = useState(false);
    const [uploadedCount, setUploadedCount] = useState(0);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const toastShownRef = useRef(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files);
            const validExtensions = [".pdf", ".txt", ".doc", ".docx", ".md"];
            const invalidFiles = selectedFiles.filter(
                (file) => !validExtensions.some((ext) => file.name.toLowerCase().endsWith(ext))
            );

            if (invalidFiles.length > 0) {
                toast.error(`Invalid file types: ${invalidFiles.map((f) => f.name).join(", ")}`);
                return;
            }

            setFiles((prev) => [...prev, ...selectedFiles]);
        }
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
                toast.success(`${files.length} document${files.length > 1 ? "s" : ""} uploaded successfully!`);
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

    const getFileIcon = (filename: string) => {
        const ext = filename.toLowerCase();
        if (ext.endsWith(".pdf")) return <FileText className="text-red-500" size={16} />;
        if (ext.endsWith(".md")) return <FileText className="text-blue-500" size={16} />;
        if (ext.endsWith(".doc") || ext.endsWith(".docx")) return <FileText className="text-blue-600" size={16} />;
        return <FileText className="text-slate-400" size={16} />;
    };

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
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-blue-50/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-primary/10 rounded-xl">
                            <Upload className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-slate-800">Upload Documents</h2>
                            <p className="text-xs text-slate-500">Add files to the knowledge base</p>
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
                    {!isComplete ? (
                        <div className="space-y-6">
                            {/* File Upload Area */}
                            <div>
                                <label className="text-sm font-medium text-slate-700 mb-2.5 block">
                                    Select Documents
                                </label>
                                <div
                                    className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
                                        files.length > 0
                                            ? "border-primary/40 bg-primary/5"
                                            : "border-slate-200 hover:border-primary/40 bg-slate-50/50 hover:bg-primary/5"
                                    }`}
                                    onClick={() => fileInputRef.current?.click()}
                                    onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
                                    role="button"
                                    tabIndex={0}
                                    aria-label="Select files to upload"
                                >
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        multiple
                                        accept=".pdf,.txt,.doc,.docx,.md"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                    <div className="flex flex-col items-center gap-3">
                                        <div
                                            className={`rounded-xl transition-colors ${
                                                files.length > 0 ? "bg-primary/10" : "bg-white border border-slate-200"
                                            }`}
                                        >
                                            <Upload
                                                className={`w-6 h-6 ${
                                                    files.length > 0 ? "text-primary" : "text-slate-400"
                                                }`}
                                            />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-700">
                                                {files.length > 0
                                                    ? `${files.length} file${files.length > 1 ? "s" : ""} selected`
                                                    : "Drop files here or click to browse"}
                                            </p>
                                            <p className="text-xs text-slate-400 mt-1">
                                                PDF, TXT, DOC, DOCX, MD • Max 10MB each
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* File List */}
                            {files.length > 0 && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 block">Selected Files</label>
                                    <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                                        {files.map((file, idx) => (
                                            <div
                                                key={idx}
                                                className="flex items-center justify-between py-2.5 px-3 bg-slate-50 rounded-lg border border-slate-100 group hover:bg-white hover:border-slate-200 transition-all"
                                            >
                                                <div className="flex items-center gap-3 min-w-0">
                                                    <div className="p-1.5 bg-white rounded-lg border border-slate-100 shrink-0">
                                                        {getFileIcon(file.name)}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-medium text-slate-700 truncate">
                                                            {file.name}
                                                        </p>
                                                        <p className="text-xs text-slate-400">
                                                            {(file.size / 1024).toFixed(1)} KB
                                                        </p>
                                                    </div>
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeFile(idx);
                                                    }}
                                                    className="text-slate-400 hover:text-red-500 hover:bg-red-50 h-8 w-8 p-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                                                >
                                                    <X size={16} />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            <div className="flex items-center gap-4">
                                {/* Category */}
                                <div className="flex-1">
                                    <label className="text-sm font-medium text-slate-700 mb-2.5 block">Category</label>
                                    <Select value={category} onValueChange={setCategory}>
                                        <SelectTrigger className="h-11 w-full bg-white border-slate-200 rounded-xl text-sm">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="data-protection">Data Protection</SelectItem>
                                            <SelectItem value="digital-id">Digital ID</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Visibility */}
                                <div className="flex-1">
                                    <label className="text-sm font-medium text-slate-700 mb-2.5 block">
                                        Visibility
                                    </label>
                                    <Select
                                        value={visibility}
                                        onValueChange={(v) => setVisibility(v as "public" | "private")}
                                    >
                                        <SelectTrigger className="h-11 w-full bg-white border-slate-200 rounded-xl text-sm">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="public">Public</SelectItem>
                                            <SelectItem value="private">Private</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Client ID - Only for private */}
                            {visibility === "private" && (
                                <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                                    <label className="text-sm font-medium text-slate-700 mb-2.5 block">Client ID</label>
                                    <Input
                                        type="text"
                                        value={clientId}
                                        onChange={(e) => setClientId(e.target.value)}
                                        placeholder="Enter your client identifier"
                                        className="h-11 bg-white border-slate-200 rounded-xl text-sm"
                                    />
                                    <p className="text-xs text-slate-400 mt-1.5">
                                        Required for private document access
                                    </p>
                                </div>
                            )}

                            {/* Info Box */}
                            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                <div className="flex gap-3">
                                    <Info className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                                    <div>
                                        {/* <h4 className="text-sm font-medium text-slate-700 mb-1">How it works</h4> */}
                                        <p className="text-xs text-slate-500 leading-relaxed">
                                            Your documents are split into passages and indexed under the category you
                                            choose. Public documents become searchable for every user of the Policy
                                            Analyzer. Please upload only documents you are allowed to share.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <Button
                                onClick={handleUpload}
                                disabled={files.length === 0 || isUploading}
                                className="w-full h-12 bg-primary hover:bg-primary/90 font-medium shadow-sm text-base rounded-xl"
                            >
                                {isUploading ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="mr-2 h-5 w-5" />
                                        Upload{" "}
                                        {files.length > 0
                                            ? `${files.length} Document${files.length > 1 ? "s" : ""}`
                                            : "Documents"}
                                    </>
                                )}
                            </Button>
                        </div>
                    ) : (
                        /* Success State */
                        <div className="flex flex-col items-center justify-center h-full text-center py-12">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                                <CheckCircle2 className="w-10 h-10 text-green-500" />
                            </div>

                            <h3 className="text-xl font-semibold text-slate-900 mb-2">Upload Successful!</h3>
                            <p className="text-sm text-slate-600 max-w-xs mb-1">
                                {uploadedCount} document{uploadedCount > 1 ? "s" : ""} uploaded successfully.
                            </p>
                            <p className="text-sm text-slate-500 max-w-xs mb-8">
                                Your files are now being indexed and will be available in the knowledge base shortly.
                            </p>

                            <div className="flex flex-col gap-3 w-full max-w-xs">
                                <Button
                                    onClick={handleReset}
                                    className="h-11 bg-primary hover:bg-primary/90 font-medium rounded-xl"
                                >
                                    <Upload className="mr-2 h-4 w-4" />
                                    Upload More Documents
                                </Button>
                                <Button onClick={handleClose} variant="outline" className="h-11 rounded-xl">
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
