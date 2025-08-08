/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Updated types based on your API documentation
export interface PolicyLaw {
    country: string;
    yearLegislationEnacted: string;
    malaboConventionStatus: string;
    name: string;
    dataProtectionLegislationStatus: string;
    link: string;
}

export interface DigitalId {
    country: string;
    isoAlpha2: string;
    features: string[];
    coverage: string;
    authority: string;
    description: string;
    links: Record<string, any>[];
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

export interface DocumentProcessingRequest {
    documents: {
        link: string;
        document_type: "pdf";
    }[];
    tab: "data-protection" | "digital-id";
}

export interface QueryStreamRequest {
    query: string;
    tab: string;
    session_id: string;
    enable_web_search?: boolean;
    search_tool?: "tavily";
}

export interface ValidationError {
    detail: {
        loc: (string | number)[];
        msg: string;
        type: string;
    }[];
}

// API endpoints configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://172.29.108.116:8001";

export const apiSlice = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
        baseUrl: API_BASE_URL,
        prepareHeaders: (headers) => {
            headers.set("Content-Type", "application/json");
            return headers;
        },
    }),
    tagTypes: ["PolicyLaw", "DigitalId", "PolicyLawFile", "DigitalIdFile", "Task", "Session"],
    endpoints: (builder) => ({
        // Policy Laws endpoints
        getPolicyLaws: builder.query<PolicyLaw[], { page?: number; limit?: number }>({
            query: ({ page = 1, limit = 55 } = {}) => ({
                url: "/api/info/policy_laws",
                params: { page, limit },
            }),
            providesTags: ["PolicyLaw"],
        }),

        createPolicyLaw: builder.mutation<PolicyLaw, Omit<PolicyLaw, "id">>({
            query: (body) => ({
                url: "/api/info/policy_laws",
                method: "POST",
                body,
            }),
            invalidatesTags: ["PolicyLaw"],
        }),

        getPolicyLawByCountry: builder.query<PolicyLaw, string>({
            query: (countryCode) => `/api/info/policy_laws/country/${countryCode}`,
            providesTags: (result, error, countryCode) => [{ type: "PolicyLaw", id: countryCode }],
        }),

        updatePolicyLawByCountry: builder.mutation<PolicyLaw, { countryCode: string; data: Partial<PolicyLaw> }>({
            query: ({ countryCode, data }) => ({
                url: `/api/info/policy_laws/country/${countryCode}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: (result, error, { countryCode }) => [{ type: "PolicyLaw", id: countryCode }, "PolicyLaw"],
        }),

        deletePolicyLawByCountry: builder.mutation<Record<string, any>, string>({
            query: (countryCode) => ({
                url: `/api/info/policy_laws/country/${countryCode}`,
                method: "DELETE",
            }),
            invalidatesTags: ["PolicyLaw"],
        }),

        // Digital ID endpoints
        getDigitalIds: builder.query<DigitalId[], { page?: number; limit?: number }>({
            query: ({ page = 1, limit = 55 } = {}) => ({
                url: "/api/info/digital_id",
                params: { page, limit },
            }),
            providesTags: ["DigitalId"],
        }),

        createDigitalId: builder.mutation<DigitalId, Omit<DigitalId, "id">>({
            query: (body) => ({
                url: "/api/info/digital_id",
                method: "POST",
                body,
            }),
            invalidatesTags: ["DigitalId"],
        }),

        getDigitalIdByCountry: builder.query<DigitalId, string>({
            query: (countryCode) => `/api/info/digital_id/country/${countryCode}`,
            providesTags: (result, error, countryCode) => [{ type: "DigitalId", id: countryCode }],
        }),

        updateDigitalIdByCountry: builder.mutation<DigitalId, { countryCode: string; data: Partial<DigitalId> }>({
            query: ({ countryCode, data }) => ({
                url: `/api/info/digital_id/country/${countryCode}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: (result, error, { countryCode }) => [{ type: "DigitalId", id: countryCode }, "DigitalId"],
        }),

        deleteDigitalIdByCountry: builder.mutation<Record<string, any>, string>({
            query: (countryCode) => ({
                url: `/api/info/digital_id/country/${countryCode}`,
                method: "DELETE",
            }),
            invalidatesTags: ["DigitalId"],
        }),

        // File endpoints
        getPolicyLawFiles: builder.query<PolicyLawFile[], { page?: number; limit?: number }>({
            query: ({ page = 1, limit = 55 } = {}) => ({
                url: "/api/info/policy_laws/files",
                params: { page, limit },
            }),
            providesTags: ["PolicyLawFile"],
        }),

        getDigitalIdFiles: builder.query<DigitalIdFile[], { page?: number; limit?: number }>({
            query: ({ page = 1, limit = 55 } = {}) => ({
                url: "/api/info/digital_id/files",
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
                url: "/api/document_processing/process_documents",
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
            query: () => "/api/document_processing/tasks",
            providesTags: ["Task"],
        }),

        getTaskStatus: builder.query<string, string>({
            query: (taskId) => `/api/document_processing/task_status/${taskId}`,
            providesTags: (result, error, taskId) => [{ type: "Task", id: taskId }],
        }),

        // Session and chat endpoints
        getSession: builder.query<string, string>({
            query: (sessionId) => `/api/sessions/${sessionId}`,
            providesTags: (result, error, sessionId) => [{ type: "Session", id: sessionId }],
        }),

        queryStream: builder.mutation<string, QueryStreamRequest>({
            query: (body) => ({
                url: "/api/query_stream",
                method: "POST",
                body,
            }),
            invalidatesTags: (result, error, { session_id }) => [{ type: "Session", id: session_id }],
        }),

        // Root endpoint
        getRoot: builder.query<string, void>({
            query: () => "/",
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

    // Root hook
    useGetRootQuery,
} = apiSlice;

// export const usePolicyLawData = (params?: { page?: number; limit?: number }) => {
//     const { data, isLoading, error } = useGetPolicyLawsQuery(params ?? {});

//     return {
//         policyLaws: data || [],
//         isLoading,
//         error,
//         totalCountries: data?.length || 0,
//         enactedLaws: data?.filter((law) => law.dataProtectionLegislationStatus === "Enacted").length || 0,
//         draftLaws: data?.filter((law) => law.dataProtectionLegislationStatus === "Draft").length || 0,
//         noLaws: data?.filter((law) => law.dataProtectionLegislationStatus === "No Law").length || 0,
//         malaboSigned:
//             data?.filter((law) =>
//                 ["signed", "ratified"].includes(law.malaboConventionStatus?.toLowerCase())
//             ).length || 0,
//     };
// };

// Updated custom hooks for common use cases
export const usePolicyLawData = (params?: { page?: number; limit?: number }) => {
    const { data, isLoading, error } = useGetPolicyLawsQuery(params ?? {});

    return {
        policyLaws: data || [],
        isLoading,
        error,
        // Corrected computed values based on actual API structure
        totalCountries: data?.length || 0,

        // Fixed: Check for exact matches of "Enacted" status
        enactedLaws: data?.filter((law) => law.dataProtectionLegislationStatus === "Enacted").length || 0,

        // Fixed: Check for exact matches of "Draft" status
        draftLaws: data?.filter((law) => law.dataProtectionLegislationStatus === "Draft").length || 0,

        // Fixed: Check for exact matches of "No Law" status
        noLaws: data?.filter((law) => law.dataProtectionLegislationStatus === "No Law").length || 0,

        // Added: Count for "Lite" legislation status
        liteLaws: data?.filter((law) => law.dataProtectionLegislationStatus === "Lite").length || 0,

        // Fixed: Check for exact matches of "Ratified" status
        malaboRatified: data?.filter((law) => law.malaboConventionStatus === "Ratified").length || 0,

        // Added: Check for exact matches of "Signed" status
        malaboSigned: data?.filter((law) => law.malaboConventionStatus === "Signed").length || 0,

        // Added: Combined count for countries that have signed OR ratified Malabo Convention
        malaboSignedOrRatified:
            data?.filter((law) => law.malaboConventionStatus === "Signed" || law.malaboConventionStatus === "Ratified")
                .length || 0,

        // Added: Countries with no Malabo Convention involvement
        malaboNo: data?.filter((law) => law.malaboConventionStatus === "No").length || 0,
    };
};
// export const useDigitalIdData = (params?: { page?: number; limit?: number }) => {
//     const { data, isLoading, error } = useGetDigitalIdsQuery(params ?? {});

//     return {
//         digitalIds: data || [],
//         isLoading,
//         error,
//         // Computed values based on actual API structure
//         totalCountries: data?.length || 0,
//         // Note: Since the API doesn't have explicit status field like your original types,
//         // you might need to derive status from other fields or update your API
//         countriesWithSystems: data?.filter((id) => id.features && id.features.length > 0).length || 0,
//         totalFeatures: data?.reduce((acc, id) => acc + (id.features?.length || 0), 0) || 0,
//         countriesWithBiometrics:
//             data?.filter((id) =>
//                 id.features?.some(
//                     (feature) =>
//                         feature.toLowerCase().includes("biometric") ||
//                         feature.toLowerCase().includes("fingerprint") ||
//                         feature.toLowerCase().includes("facial")
//                 )
//             ).length || 0,
//     };
// };

// Improved useDigitalIdData hook with additional computed values
export const useDigitalIdData = (params?: { page?: number; limit?: number }) => {
    const { data, isLoading, error } = useGetDigitalIdsQuery(params ?? {});

    return {
        digitalIds: data || [],
        isLoading,
        error,

        // Basic counts
        totalCountries: data?.length || 0,

        // Countries with any digital ID features
        countriesWithSystems: data?.filter((id) => id.features && id.features.length > 0).length || 0,

        // Total feature count across all countries
        totalFeatures: data?.reduce((acc, id) => acc + (id.features?.length || 0), 0) || 0,

        // IMPROVED: More comprehensive biometric detection
        countriesWithBiometrics:
            data?.filter((id) =>
                id.features?.some(
                    (feature) =>
                        feature.toLowerCase().includes("biometric") ||
                        feature.toLowerCase().includes("fingerprint") ||
                        feature.toLowerCase().includes("facial") ||
                        feature.toLowerCase().includes("iris") ||
                        feature.toLowerCase().includes("biometric")
                )
            ).length || 0,

        // ADDED: Countries by implementation status
        implementedSystems:
            data?.filter((id) => {
                const coverage = id.coverage?.toLowerCase() || "";
                const hasFeatures = id.features && id.features.length > 0;
                const hasHighCoverage = coverage.includes("%") && parseInt(coverage.replace("%", "")) >= 70;
                const hasAdvancedFeatures = id.features?.some(
                    (feature) =>
                        feature.toLowerCase().includes("digital") ||
                        feature.toLowerCase().includes("biometric") ||
                        feature.toLowerCase().includes("smart") ||
                        feature.toLowerCase().includes("electronic")
                );

                return (
                    hasFeatures &&
                    (hasHighCoverage || hasAdvancedFeatures) &&
                    coverage !== "none" &&
                    coverage !== "pilot" &&
                    coverage !== "planning"
                );
            }).length || 0,

        // ADDED: Countries in pilot/partial implementation
        partialSystems:
            data?.filter((id) => {
                const coverage = id.coverage?.toLowerCase() || "";
                const hasFeatures = id.features && id.features.length > 0;
                const hasLowCoverage =
                    coverage.includes("%") &&
                    parseInt(coverage.replace("%", "")) < 70 &&
                    parseInt(coverage.replace("%", "")) > 0;

                return hasFeatures && (coverage === "pilot" || hasLowCoverage || coverage.includes("limited"));
            }).length || 0,

        // ADDED: Countries in planning phase
        planningSystems:
            data?.filter((id) => {
                const coverage = id.coverage?.toLowerCase() || "";
                return coverage === "planning" || coverage === "design phase";
            }).length || 0,

        // ADDED: Countries with no digital ID system
        noSystems:
            data?.filter((id) => {
                const coverage = id.coverage?.toLowerCase() || "";
                const hasNoFeatures = !id.features || id.features.length === 0;
                return coverage === "none" || hasNoFeatures;
            }).length || 0,

        // ADDED: Coverage analysis
        highCoverageCountries:
            data?.filter((id) => {
                const coverage = id.coverage || "";
                if (coverage.includes("%")) {
                    const percentage = parseInt(coverage.replace("%", ""));
                    return percentage >= 70;
                }
                return false;
            }).length || 0,

        mediumCoverageCountries:
            data?.filter((id) => {
                const coverage = id.coverage || "";
                if (coverage.includes("%")) {
                    const percentage = parseInt(coverage.replace("%", ""));
                    return percentage >= 40 && percentage < 70;
                }
                return false;
            }).length || 0,

        lowCoverageCountries:
            data?.filter((id) => {
                const coverage = id.coverage || "";
                if (coverage.includes("%")) {
                    const percentage = parseInt(coverage.replace("%", ""));
                    return percentage < 40 && percentage > 0;
                }
                return false;
            }).length || 0,

        // ADDED: Feature analysis
        countriesWithSmartCards:
            data?.filter((id) =>
                id.features?.some(
                    (feature) =>
                        feature.toLowerCase().includes("smart") ||
                        feature.toLowerCase().includes("chip") ||
                        feature.toLowerCase().includes("electronic")
                )
            ).length || 0,

        countriesWithDigitalServices:
            data?.filter((id) =>
                id.features?.some(
                    (feature) =>
                        feature.toLowerCase().includes("digital services") ||
                        feature.toLowerCase().includes("e-services") ||
                        feature.toLowerCase().includes("online") ||
                        feature.toLowerCase().includes("mobile app")
                )
            ).length || 0,

        countriesWithAuthentication:
            data?.filter((id) =>
                id.features?.some(
                    (feature) =>
                        feature.toLowerCase().includes("authentication") ||
                        feature.toLowerCase().includes("verification") ||
                        feature.toLowerCase().includes("digital authentication")
                )
            ).length || 0,

        // ADDED: Authority analysis
        uniqueAuthorities: [...new Set(data?.map((id) => id.authority).filter(Boolean) || [])].length,

        // ADDED: Countries with documentation links
        countriesWithLinks: data?.filter((id) => id.links && id.links.length > 0).length || 0,

        // ADDED: Average coverage calculation
        averageCoverage: (() => {
            const coverageValues =
                data
                    ?.map((id) => {
                        const coverage = id.coverage || "";
                        if (coverage.includes("%")) {
                            return parseInt(coverage.replace("%", ""));
                        }
                        return 0;
                    })
                    .filter((val) => val > 0) || [];

            if (coverageValues.length === 0) return 0;
            return Math.round(coverageValues.reduce((sum, val) => sum + val, 0) / coverageValues.length);
        })(),
    };
};

// Utility function for handling API errors
export const isValidationError = (error: any): error is { data: ValidationError } => {
    return error?.data?.detail && Array.isArray(error.data.detail);
};

// Helper function to format validation errors
export const formatValidationError = (error: ValidationError): string => {
    return error.detail.map((err) => `${err.loc.join(".")}: ${err.msg}`).join(", ");
};
