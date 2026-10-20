/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
    BatchQueryJob,
    DigitalId,
    DigitalIdFile,
    DocumentProcessingRequest,
    DocumentProcessingStatus,
    PolicyLaw,
    PolicyLawFile,
    QueryRequest
} from "@/types/api";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Re-export types for convenience
export type {
    BatchQueryJob,
    CacheStats,
    DigitalId,
    DigitalIdFile,
    DocumentProcessingRequest,
    DocumentProcessingStatus,
    HealthStatus,
    LLMMetrics,
    PolicyLaw,
    PolicyLawFile,
    QueryRequest,
    TabConfig,
    ValidationError
} from "@/types/api";

// API endpoints configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const apiSlice = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
        baseUrl: API_BASE_URL,
        prepareHeaders: (headers, { endpoint }) => {
            // Don't set Content-Type for FormData uploads - browser will set it automatically with boundary
            const formDataEndpoints = ["uploadBatchQueries", "uploadDocuments"];
            if (!formDataEndpoints.includes(endpoint)) {
                headers.set("Content-Type", "application/json");
            }
            const apiKey = process.env.NEXT_PUBLIC_API_KEY || "HpOfOIDyNljM7LlC5QYxKGXSjn0ZRhidTUYW6bgh";
            if (apiKey) {
                headers.set("X-API-Key", apiKey);
            }
            return headers;
        },
    }),
    tagTypes: [
        "PolicyLaw",
        "DigitalId",
        "PolicyLawFile",
        "DigitalIdFile",
        "Task",
        "Session",
        "BatchJob",
        "Document",
        "Admin",
    ],
    endpoints: (builder) => ({
        // Policy Laws endpoints
        getPolicyLaws: builder.query<PolicyLaw[], { page?: number; limit?: number }>({
            query: ({ page = 1, limit = 100 } = {}) => ({
                url: "/info/policy_laws",
                params: { page, limit },
            }),
            providesTags: ["PolicyLaw"],
        }),

        createPolicyLaw: builder.mutation<PolicyLaw, Omit<PolicyLaw, "id">>({
            query: (body) => ({
                url: "/info/policy_laws",
                method: "POST",
                body,
            }),
            invalidatesTags: ["PolicyLaw"],
        }),

        getPolicyLawByCountry: builder.query<PolicyLaw, string>({
            query: (countryCode) => `/info/policy_laws/country/${countryCode}`,
            providesTags: (result, error, countryCode) => [{ type: "PolicyLaw", id: countryCode }],
        }),

        updatePolicyLawByCountry: builder.mutation<PolicyLaw, { countryCode: string; data: Partial<PolicyLaw> }>({
            query: ({ countryCode, data }) => ({
                url: `/info/policy_laws/country/${countryCode}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: (result, error, { countryCode }) => [{ type: "PolicyLaw", id: countryCode }, "PolicyLaw"],
        }),

        deletePolicyLawByCountry: builder.mutation<Record<string, any>, string>({
            query: (countryCode) => ({
                url: `/info/policy_laws/country/${countryCode}`,
                method: "DELETE",
            }),
            invalidatesTags: ["PolicyLaw"],
        }),

        // Digital ID endpoints
        getDigitalIds: builder.query<DigitalId[], { page?: number; limit?: number }>({
            query: ({ page = 1, limit = 100 } = {}) => ({
                url: "/info/digital_id",
                params: { page, limit },
            }),
            providesTags: ["DigitalId"],
        }),

        createDigitalId: builder.mutation<DigitalId, Omit<DigitalId, "id">>({
            query: (body) => ({
                url: "/info/digital_id",
                method: "POST",
                body,
            }),
            invalidatesTags: ["DigitalId"],
        }),

        getDigitalIdByCountry: builder.query<DigitalId, string>({
            query: (countryCode) => `/info/digital_id/country/${countryCode}`,
            providesTags: (result, error, countryCode) => [{ type: "DigitalId", id: countryCode }],
        }),

        updateDigitalIdByCountry: builder.mutation<DigitalId, { countryCode: string; data: Partial<DigitalId> }>({
            query: ({ countryCode, data }) => ({
                url: `/info/digital_id/country/${countryCode}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: (result, error, { countryCode }) => [{ type: "DigitalId", id: countryCode }, "DigitalId"],
        }),

        deleteDigitalIdByCountry: builder.mutation<Record<string, any>, string>({
            query: (countryCode) => ({
                url: `/info/digital_id/country/${countryCode}`,
                method: "DELETE",
            }),
            invalidatesTags: ["DigitalId"],
        }),

        // File endpoints
        getPolicyLawFiles: builder.query<PolicyLawFile[], { page?: number; limit?: number }>({
            query: ({ page = 1, limit = 100 } = {}) => ({
                url: "/info/policy_laws/files",
                params: { page, limit },
            }),
            providesTags: ["PolicyLawFile"],
        }),

        getDigitalIdFiles: builder.query<DigitalIdFile[], { page?: number; limit?: number }>({
            query: ({ page = 1, limit = 100 } = {}) => ({
                url: "/info/digital_id/files",
                params: { page, limit },
            }),
            providesTags: ["DigitalIdFile"],
        }),

        // Document processing endpoints
        processDocuments: builder.mutation<
            string,
            {
                documents: DocumentProcessingRequest;
                model_provider?: string;
                model_name?: string;
                temperature?: number;
                max_tokens?: number;
                streaming?: boolean;
            }
        >({
            query: ({
                documents,
                model_provider = "openai",
                model_name = "gpt-4o",
                temperature = 0,
                max_tokens,
                streaming = true,
            }) => ({
                url: "/document_processing/process_documents",
                method: "POST",
                body: documents,
                params: {
                    model_provider,
                    model_name,
                    temperature,
                    ...(max_tokens && { max_tokens }),
                    streaming,
                },
            }),
            invalidatesTags: ["Task"],
        }),

        getTasks: builder.query<string, void>({
            query: () => "/document_processing/tasks",
            providesTags: ["Task"],
        }),

        getTaskStatus: builder.query<string, string>({
            query: (taskId) => `/document_processing/task_status/${taskId}`,
            providesTags: (result, error, taskId) => [{ type: "Task", id: taskId }],
        }),

        // Session and chat endpoints
        getSession: builder.query<string, string>({
            query: (sessionId) => `/sessions/${sessionId}`,
            providesTags: (result, error, sessionId) => [{ type: "Session", id: sessionId }],
        }),

        // Updated to v3.1 API endpoint
        queryStream: builder.mutation<string, QueryRequest>({
            query: (body) => ({
                url: "/query_v2",
                method: "POST",
                body,
            }),
            invalidatesTags: (result, error, { session_id }) =>
                session_id ? [{ type: "Session", id: session_id }] : [],
        }),

        // Batch Query endpoints (v3.1 API)
        uploadBatchQueries: builder.mutation<BatchQueryJob, FormData>({
            query: (formData) => ({
                url: "/batch/upload",
                method: "POST",
                body: formData,
            }),
            invalidatesTags: ["BatchJob"],
        }),

        getBatchJobStatus: builder.query<BatchQueryJob, string>({
            query: (jobId) => `/batch/status/${jobId}`,
            providesTags: (result, error, jobId) => [{ type: "BatchJob", id: jobId }],
        }),

        getBatchJobs: builder.query<BatchQueryJob[], void>({
            query: () => "/batch/jobs",
            providesTags: ["BatchJob"],
        }),

        deleteBatchJob: builder.mutation<void, string>({
            query: (jobId) => ({
                url: `/batch/${jobId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["BatchJob"],
        }),

        // Document Upload endpoints (v3.1 API)
        uploadDocuments: builder.mutation<DocumentProcessingStatus, FormData>({
            query: (formData) => ({
                url: "/documents/upload-documents",
                method: "POST",
                body: formData,
            }),
            invalidatesTags: ["Document"],
        }),
    }),
});

// Export hooks for usage in components
export const {
    // Policy Laws hooks
    useGetPolicyLawsQuery,
    useCreatePolicyLawMutation,
    useGetPolicyLawByCountryQuery,
    useUpdatePolicyLawByCountryMutation,
    useDeletePolicyLawByCountryMutation,

    // Digital ID hooks
    useGetDigitalIdsQuery,
    useCreateDigitalIdMutation,
    useGetDigitalIdByCountryQuery,
    useUpdateDigitalIdByCountryMutation,
    useDeleteDigitalIdByCountryMutation,

    // File hooks
    useGetPolicyLawFilesQuery,
    useGetDigitalIdFilesQuery,

    // Document processing hooks
    useProcessDocumentsMutation,
    useGetTasksQuery,
    useGetTaskStatusQuery,

    // Session and chat hooks
    useGetSessionQuery,
    useQueryStreamMutation,

    // Batch Query hooks (v3.1 API)
    useUploadBatchQueriesMutation,
    useGetBatchJobStatusQuery,
    useGetBatchJobsQuery,
    useDeleteBatchJobMutation,

    // Document Upload hooks (v3.1 API)
    useUploadDocumentsMutation,
} = apiSlice;

// Updated custom hook for policy law data
export const usePolicyLawData = (params?: { page?: number; limit?: number }) => {
    const { data, isLoading, error } = useGetPolicyLawsQuery(params ?? {});

    return {
        policyLaws: data || [],
        isLoading,
        error,
        totalCountries: data?.length || 0,
        enactedLaws: data?.filter((law) => law.dataProtectionLegislationStatus === "Enacted").length || 0,
        draftLaws: data?.filter((law) => law.dataProtectionLegislationStatus === "Draft").length || 0,
        noLaws: data?.filter((law) => law.dataProtectionLegislationStatus === "No Law").length || 0,
        liteLaws: data?.filter((law) => law.dataProtectionLegislationStatus === "Lite").length || 0,
        malaboRatified: data?.filter((law) => law.malaboConventionStatus === "Ratified").length || 0,
        malaboSigned: data?.filter((law) => law.malaboConventionStatus === "Signed").length || 0,
        malaboSignedOrRatified:
            data?.filter((law) => law.malaboConventionStatus === "Signed" || law.malaboConventionStatus === "Ratified")
                .length || 0,
        malaboNo: data?.filter((law) => law.malaboConventionStatus === "No").length || 0,
    };
};

// Updated custom hook for digital ID data based on your actual data structure
export const useDigitalIdData = (params?: { page?: number; limit?: number }) => {
    const { data, isLoading, error } = useGetDigitalIdsQuery(params ?? {});

    return {
        digitalIds: data || [],
        isLoading,
        error,

        // Basic counts
        totalCountries: data?.length || 0,

        // Status-based analysis using the exact status values from your color mapping
        implementedSystems: data?.filter((id) => id.status?.toLowerCase() === "implemented").length || 0,
        partialSystems: data?.filter((id) => id.status?.toLowerCase() === "partial").length || 0,
        planningSystems: data?.filter((id) => id.status?.toLowerCase() === "planning").length || 0,
        noDataSystems: data?.filter((id) => id.status?.toLowerCase() === "no data").length || 0,

        // Additional status categories that might exist in your data
        ongoingSystems: data?.filter((id) => id.status === "Ongoing rollout").length || 0,
        delayedSystems: data?.filter((id) => id.status === "Delayed transition").length || 0,
        scalingUpSystems: data?.filter((id) => id.status === "Scaling up").length || 0,
        noSystems: data?.filter((id) => id.status === "No System").length || 0,

        // Feature analysis
        totalFeatures: data?.reduce((acc, id) => acc + (id.features?.length || 0), 0) || 0,
        countriesWithFeatures: data?.filter((id) => id.features && id.features.length > 0).length || 0,
    };
};
