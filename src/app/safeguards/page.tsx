import SafeguardsPage from "@/components/safeguards";
import { notFound } from "next/navigation";

function page() {
    // Hidden from the public until reviewed by a PI.
    notFound();

    return (
        <div className="min-h-screen flex flex-col">
            <div className="bg-primary text-white py-12">
                <div className="max-w-7xl container mx-auto px-6">
                    <h1 className="text-3xl font-bold mb-2">UN DPI Safeguards Framework</h1>
                    <p className="text-lg text-white/90 max-w-[700px]">
                        The 18 Foundational and Operational principles and 13 risks that guide safe, inclusive
                        digital public infrastructure.
                    </p>
                </div>
            </div>
            <SafeguardsPage />
        </div>
    );
}

export default page;
