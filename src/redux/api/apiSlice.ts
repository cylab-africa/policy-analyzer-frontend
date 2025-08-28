/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Updated types based on your actual API data structures
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
            const apiKey = process.env.NEXT_PUBLIC_API_KEY || "HpOfOIDyNljM7LlC5QYxKGXSjn0ZRhidTUYW6bgh";
            if (apiKey) {
                headers.set("X-API-Key", apiKey);
            }
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

        // Biometric capabilities
        countriesWithBiometrics:
            data?.filter((id) =>
                id.features?.some(
                    (feature) =>
                        feature.toLowerCase().includes("biometric") ||
                        feature.toLowerCase().includes("fingerprint") ||
                        feature.toLowerCase().includes("facial") ||
                        feature.toLowerCase().includes("iris") ||
                        feature.toLowerCase().includes("palm")
                )
            ).length || 0,

        // Smart card capabilities
        countriesWithSmartCards:
            data?.filter((id) =>
                id.features?.some(
                    (feature) =>
                        feature.toLowerCase().includes("smart") ||
                        feature.toLowerCase().includes("chip") ||
                        feature.toLowerCase().includes("electronic") ||
                        feature.toLowerCase().includes("microchip")
                )
            ).length || 0,

        // Digital services integration
        countriesWithDigitalServices:
            data?.filter((id) =>
                id.features?.some(
                    (feature) =>
                        feature.toLowerCase().includes("digital services") ||
                        feature.toLowerCase().includes("e-services") ||
                        feature.toLowerCase().includes("online") ||
                        feature.toLowerCase().includes("mobile") ||
                        feature.toLowerCase().includes("digital government")
                )
            ).length || 0,

        // Banking and financial integration
        countriesWithBankingIntegration:
            data?.filter((id) =>
                id.features?.some(
                    (feature) =>
                        feature.toLowerCase().includes("banking") ||
                        feature.toLowerCase().includes("financial") ||
                        feature.toLowerCase().includes("payment") ||
                        feature.toLowerCase().includes("sim") ||
                        feature.toLowerCase().includes("mandatory for sim")
                )
            ).length || 0,

        // Coverage analysis (based on percentage values in coverage field)
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

        // Countries with specific coverage descriptions
        countriesWithEnrolledCoverage:
            data?.filter((id) => {
                const coverage = id.coverage?.toLowerCase() || "";
                return coverage.includes("enrolled") || coverage.includes("registered");
            }).length || 0,

        // Authority and governance analysis
        uniqueAuthorities: [...new Set(data?.map((id) => id.authority).filter(Boolean) || [])].length,

        // Launch year analysis
        recentLaunches:
            data?.filter((id) => {
                const yearLaunched = id.year_launched || "";
                const currentYear = new Date().getFullYear();
                const launchYear = parseInt(yearLaunched.match(/\d{4}/)?.[0] || "0");
                return launchYear >= currentYear - 5; // Last 5 years
            }).length || 0,

        // Link and documentation analysis
        countriesWithLinks: data?.filter((id) => id.links && id.links.length > 0).length || 0,
        totalLinks: data?.reduce((acc, id) => acc + (id.links?.length || 0), 0) || 0,

        // Link type analysis
        countriesWithAcademicResearch:
            data?.filter((id) => id.links?.some((link) => link.type === "Academic Research")).length || 0,

        countriesWithPolicyResearch:
            data?.filter((id) => id.links?.some((link) => link.type === "Policy Research")).length || 0,

        countriesWithDevelopmentPartnerLinks:
            data?.filter((id) => id.links?.some((link) => link.type === "Development Partner")).length || 0,

        // Average coverage calculation
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

        // Countries by launch decade
        launched2020s:
            data?.filter((id) => {
                const yearLaunched = id.year_launched || "";
                const launchYear = parseInt(yearLaunched.match(/\d{4}/)?.[0] || "0");
                return launchYear >= 2020;
            }).length || 0,

        launched2010s:
            data?.filter((id) => {
                const yearLaunched = id.year_launched || "";
                const launchYear = parseInt(yearLaunched.match(/\d{4}/)?.[0] || "0");
                return launchYear >= 2010 && launchYear < 2020;
            }).length || 0,

        launched2000s:
            data?.filter((id) => {
                const yearLaunched = id.year_launched || "";
                const launchYear = parseInt(yearLaunched.match(/\d{4}/)?.[0] || "0");
                return launchYear >= 2000 && launchYear < 2010;
            }).length || 0,
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
