"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useEffect } from "react";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
            posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY as string, {
                api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
                person_profiles: "identified_only",
                capture_pageview: false, // We'll capture pageviews manually for better control
                capture_pageleave: true,
                session_recording: {
                    maskAllInputs: false,
                    maskInputOptions: {
                        password: true,
                    },
                },
            });

            // Capture user location and device info automatically
            posthog.register({
                app_version: process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0",
                environment: process.env.NODE_ENV,
            });

            // Set user properties for location tracking (PostHog automatically detects location from IP)
            posthog.capture("app_loaded", {
                timestamp: new Date().toISOString(),
            });
        }
    }, []);

    return <PHProvider client={posthog}>{children}</PHProvider>;
}
