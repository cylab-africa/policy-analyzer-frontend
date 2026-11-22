import type { BatchQueryJob, DigitalId, DocumentProcessingStatus, DocumentUploadResponse, PolicyLaw } from "@/types/api";
import { API_BASE_URL } from "@/lib/api-base";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export type { BatchQueryJob, DigitalId, DocumentProcessingStatus, DocumentUploadResponse, PolicyLaw } from "@/types/api";

/**
 * The backend endpoints the website uses. Requests go to the website's own proxy, which adds the
 * API key on the server and passes on only these routes (see src/app/api/[...path]/route.ts).
 * The chat answer is streamed with fetch in components/chat, not through this slice.
 */
export const apiSlice = createApi({
    reducerPath: "api",
    // JSON bodies get their Content-Type automatically; FormData keeps the browser's boundary
    baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
    tagTypes: ["PolicyLaw", "DigitalId", "BatchJob", "Document"],
    endpoints: (builder) => ({
        getPolicyLaws: builder.query<PolicyLaw[], { page?: number; limit?: number }>({
            query: ({ page = 1, limit = 100 } = {}) => ({
                url: "/info/policy_laws",
                params: { page, limit },
            }),
            providesTags: ["PolicyLaw"],
        }),

        getDigitalIds: builder.query<DigitalId[], { page?: number; limit?: number }>({
            query: ({ page = 1, limit = 100 } = {}) => ({
                url: "/info/digital_id",
                params: { page, limit },
            }),
            providesTags: ["DigitalId"],
        }),

        uploadBatchQueries: builder.mutation<BatchQueryJob, FormData>({
            query: (formData) => ({
                url: "/batch/upload",
                method: "POST",
                body: formData,
            }),
            invalidatesTags: ["BatchJob"],
        }),

        getBatchJobStatus: builder.query<BatchQueryJob, string>({
            query: (jobId) => `/batch/status/${encodeURIComponent(jobId)}`,
            providesTags: (result, error, jobId) => [{ type: "BatchJob", id: jobId }],
        }),

        uploadDocuments: builder.mutation<DocumentUploadResponse, FormData>({
            query: (formData) => ({
                url: "/documents/upload-documents",
                method: "POST",
                body: formData,
            }),
            invalidatesTags: ["Document"],
        }),

        getDocumentProcessingStatus: builder.query<DocumentProcessingStatus, string>({
            query: (processingId) => `/documents/status/${encodeURIComponent(processingId)}`,
            providesTags: (result, error, processingId) => [{ type: "Document", id: processingId }],
        }),
    }),
});

export const {
    useGetPolicyLawsQuery,
    useGetDigitalIdsQuery,
    useUploadBatchQueriesMutation,
    useGetBatchJobStatusQuery,
    useUploadDocumentsMutation,
    useGetDocumentProcessingStatusQuery,
} = apiSlice;

// Summary counts for the country maps and statistics
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

// Summary counts for the digital ID map and statistics
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
