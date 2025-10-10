import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ReduxProvider } from "@/components/providers/ReduxProvider";
import { PostHogProvider } from "@/components/providers/PostHogProvider";
import { PostHogPageView } from "@/components/providers/PostHogPageView";
import { Toaster } from "sonner";
import { Suspense } from "react";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Policy Analyzer | Upanzi Network",
    description:
        "An advanced policy analysis tool developed by Upanzi Network, an Africa-based research collaboration working towards secure digital transformation across the continent.",
    keywords: [
        "policy analyzer",
        "Upanzi Network",
        "digital transformation",
        "Africa technology",
        "policy research",
        "secure systems",
        "engineering research",
    ],
    authors: [{ name: "Upanzi Network", url: "https://www.africa.engineering.cmu.edu/" }],
    openGraph: {
        title: "Policy Analyzer | Upanzi Network",
        description: "Advanced policy analysis for Africa's digital transformation",
        url: "https://www.africa.engineering.cmu.edu/",
        siteName: "Policy Analyzer",
        images: [
            {
                url: "/images/og-image.jpg",
                width: 1200,
                height: 630,
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Policy Analyzer | Upanzi Network",
        description: "Advanced policy analysis for Africa's digital transformation",
        images: ["/images/twitter-image.jpg"],
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}>
                <PostHogProvider>
                    <Suspense fallback={null}>
                        <PostHogPageView />
                    </Suspense>
                    <ReduxProvider>
                        <div className="flex flex-col min-h-screen">
                            <Toaster position="bottom-right" richColors closeButton />

                            <Header />
                            <main className="flex-1 w-full">{children}</main>
                            <Footer />
                        </div>
                    </ReduxProvider>
                </PostHogProvider>
            </body>
        </html>
    );
}
