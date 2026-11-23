// Types for the backend API, as reached through the website's proxy (src/app/api/[...path])

// ==========================================
// Domain Types (Policy Laws & Digital ID)
// ==========================================

export interface PolicyLaw {
    country: string;
    yearLegislationEnacted: string;
    malaboConventionStatus: string;
    dataProtectionLegislationStatus: string;
    isoAlpha2: string;
    flagEmoji: string;
    links: {
        title: string;
        url: string;
        type: string;
    }[];
}

export interface DigitalId {
    country: string;
    status: string;
    isoAlpha2: string;
    flagEmoji: string;
    authority: string;
    description: string;
    features: string[];
    year_launched: string;
    coverage: string;
    links: {
        title: string;
        url: string;
        type: string;
    }[];
}

// ==========================================
// Batch Query Types
// ==========================================

/** GET /batch/status/{job_id}, and the reply to POST /batch/upload (which adds delete_token) */
export interface BatchQueryJob {
    job_id: string;
    status: JobStatus;
    total_queries: number;
    completed_queries: number;
    failed_queries: number;
    created_at: string;
    error_message?: string | null;
    delete_token?: string;
}

// ==========================================
// Document Upload Types
// ==========================================

/** The reply to POST /documents/upload-documents */
export interface DocumentUploadResponse {
    message: string;
    processing_id: string;
    visibility: Visibility;
}

/** GET /documents/status/{processing_id}: how indexing the uploaded files went */
export interface DocumentProcessingStatus {
    processing_id: string;
    status: ProcessingStatus;
    file_count: number;
    processed_count: number;
    failed_count: number;
    failed_files: string[];
    error_message?: string | null;
    updated_at?: string | null;
}

// ==========================================
// Utility Types
// ==========================================

export type Visibility = "public" | "private";

export type JobStatus = "pending" | "processing" | "completed" | "failed";

export type ProcessingStatus = "pending" | "processing" | "completed" | "error";
