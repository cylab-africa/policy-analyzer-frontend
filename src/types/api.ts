// TypeScript types for v3.1 API - Based on FRONTEND_INTEGRATION_GUIDE.md

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

export interface PolicyLawFile {
    country: string;
    isoAlpha2: string;
    link: string;
}

export interface DigitalIdFile {
    country: string;
    isoAlpha2: string;
    link: string;
}

// ==========================================
// Query API Types
// ==========================================

export interface QueryRequest {
    query: string;
    tab?: string;
    session_id?: string;
    client_id?: string;
    enable_web_search?: boolean;
    search_tool?: SearchTool;
    max_docs_per_query?: number;
    max_total_docs?: number;
    enable_country_filter?: boolean;
}

export interface QueryResponse {
    type: "metadata" | "content";
    session_id?: string;
    system?: string;
    visibility?: Visibility;
    content?: string;
}

export interface ValidationError {
    detail: {
        loc: (string | number)[];
        msg: string;
        type: string;
    }[];
}

// ==========================================
// Batch Query Types
// ==========================================

export interface BatchQueryJob {
    job_id: string;
    status: JobStatus;
    total_queries: number;
    completed_queries: number;
    failed_queries: number;
    created_at: string;
    pdf_download_url?: string;
    error_message?: string | null;
}

export interface BatchUploadRequest {
    file: File;
    user_email: string;
    visibility?: Visibility;
    tab?: string;
}

// ==========================================
// Document Upload Types
// ==========================================

export interface DocumentProcessingRequest {
    documents: {
        link: string;
        document_type: "pdf";
    }[];
    tab: "data-protection" | "digital-id";
}

export interface DocumentProcessingStatus {
    processing_id: string;
    status: ProcessingStatus;
    file_count: number;
    processed_count: number;
    visibility: Visibility;
    updated_at: string;
}

export interface DocumentUploadRequest {
    files: File[];
    visibility: Visibility;
    tab?: string;
    client_id?: string;
}

export interface DocumentWebSocketMessage {
    status: ProcessingStatus;
    file_count: number;
    processed_count: number;
    updated_at: string;
    message?: string;
    error?: string;
    final?: boolean;
}

// ==========================================
// Admin Dashboard Types
// ==========================================

export interface HealthStatus {
    status: "OK" | "DEGRADED" | "ERROR";
    components: Record<string, string>;
    configuration: {
        enabled_tabs: string[];
        vector_store_backend: string;
        default_llm_provider: string;
    };
    warnings: string[];
}

export interface CacheStats {
    cache_statistics: {
        total_queries: number;
        cache_hits: number;
        cache_misses: number;
        hit_rate: number;
        estimated_cost_savings: number;
    };
    configuration: {
        similarity_threshold: number;
        ttl_seconds: number;
        namespace: string;
    };
}

export interface TabConfig {
    tab_name: string;
    display_name: string;
    description: string;
    enabled: boolean;
    metadata_filters: string[];
    priority: number;
}

export interface LLMMetrics {
    summary: {
        total_calls: number;
        total_errors: number;
        overall_error_rate: number;
        total_retries: number;
    };
    by_use_case: Record<
        string,
        {
            total_calls: number;
            success_count: number;
            error_count: number;
            avg_latency_ms: number;
        }
    >;
}

// ==========================================
// Utility Types
// ==========================================

export type Visibility = "public" | "private";

export type SearchTool = "tavily" | "serpapi" | "duckduckgo";

export type JobStatus = "pending" | "processing" | "completed" | "failed";

export type ProcessingStatus = "pending" | "processing" | "completed" | "error";
