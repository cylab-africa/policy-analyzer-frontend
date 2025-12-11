/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * PostHog Event Tracking Helper Functions
 *
 * This file contains reusable functions for tracking user interactions across the app.
 * Import these functions or use the usePostHog hook directly in client components.
 *
 * Events currently tracked:
 * - app_loaded: When the app initializes (automatically in PostHogProvider)
 * - $pageview: Page navigation (automatically in PostHogPageView)
 * - chat_input_focused: When user focuses on chat input
 * - chat_message_sent: When user sends a message (includes tab and message length)
 * - chat_tab_switched: When user switches between Data Protection and Digital ID tabs
 * - chat_history_toggled: When user shows/hides chat history
 * - cta_button_clicked: When user clicks CTA buttons on home page
 * - feedback_button_clicked: When user clicks feedback button
 *
 * PostHog automatically captures:
 * - User location (country, city, region) from IP address
 * - Device type (mobile, desktop, tablet)
 * - Browser and OS information
 * - Screen size and viewport
 * - UTM parameters and referrer
 */

import posthog from "posthog-js";

/**
 * Track button clicks
 */
export const trackButtonClick = (buttonName: string, metadata?: Record<string, any>) => {
    posthog.capture("button_clicked", {
        button_name: buttonName,
        timestamp: new Date().toISOString(),
        ...metadata,
    });
};

/**
 * Track form submissions
 */
export const trackFormSubmission = (formName: string, success: boolean, metadata?: Record<string, any>) => {
    posthog.capture("form_submitted", {
        form_name: formName,
        success,
        timestamp: new Date().toISOString(),
        ...metadata,
    });
};

/**
 * Track policy analysis queries
 */
export const trackPolicyAnalysis = (analysisType: string, metadata?: Record<string, any>) => {
    posthog.capture("policy_analysis", {
        analysis_type: analysisType,
        timestamp: new Date().toISOString(),
        ...metadata,
    });
};

/**
 * Identify user (call after login/signup)
 */
export const identifyUser = (userId: string, properties?: Record<string, any>) => {
    posthog.identify(userId, properties);
};

/**
 * Track feature usage
 */
export const trackFeatureUsage = (featureName: string, metadata?: Record<string, any>) => {
    posthog.capture("feature_used", {
        feature_name: featureName,
        timestamp: new Date().toISOString(),
        ...metadata,
    });
};

/**
 * Track navigation to specific sections
 */
export const trackNavigation = (destination: string, source?: string) => {
    posthog.capture("navigation", {
        destination,
        source,
        timestamp: new Date().toISOString(),
    });
};

/**
 * Track resource views
 */
export const trackResourceView = (resourceType: string, resourceId: string, metadata?: Record<string, any>) => {
    posthog.capture("resource_viewed", {
        resource_type: resourceType,
        resource_id: resourceId,
        timestamp: new Date().toISOString(),
        ...metadata,
    });
};

/**
 * Track search queries
 */
export const trackSearch = (query: string, resultsCount?: number, metadata?: Record<string, any>) => {
    posthog.capture("search_performed", {
        query,
        results_count: resultsCount,
        timestamp: new Date().toISOString(),
        ...metadata,
    });
};