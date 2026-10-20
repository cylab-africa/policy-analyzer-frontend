import ResourcesPage from "@/components/resources";
import { ScrollReveal } from "@/components/ui/smooth-scroll";

function page() {
    return (
        <div className="min-h-screen flex flex-col">
            <div className="bg-primary text-white py-12">
                <div className="max-w-7xl container mx-auto px-6">
                    <h1 className="text-3xl font-bold mb-2">Data Protection & Digital Identity Sources</h1>
                    <p className="text-lg text-white/90 max-w-[700px]">
                        Reference summaries, legal texts, guidelines and research on data protection and digital
                        identity across Africa
                    </p>
                </div>
            </div>
            <ScrollReveal>
                <div className="scroll-snap-start">
                    <ResourcesPage />
                </div>
            </ScrollReveal>
        </div>
    );
}

export default page;
