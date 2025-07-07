import ResourcesPage from "@/components/resources/Resources";
import React from "react";

function page() {
    return (
        <div className="pt-20">
            <div className="bg-primary text-white py-12 mb-8">
                <div className="max-w-7xl mx-auto px-6">
                    <h1 className="text-4xl font-bold mb-2">Resources</h1>
                    <p className="text-lg text-white/90 max-w-[700px]">
                        Access official documents, guidelines, and legal frameworks related to data protection and
                        digital identity systems across Africa
                    </p>
                </div>
            </div>

            <ResourcesPage />
        </div>
    );
}

export default page;
