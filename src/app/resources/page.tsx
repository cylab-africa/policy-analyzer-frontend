import ResourcesPage from "@/components/resources";
import { ScrollReveal } from "@/components/ui/smooth-scroll";

function page() {
    return (
        <div className="min-h-screen flex flex-col">
            <div className="bg-primary text-white py-12">
                <div className="max-w-8xl container mx-auto px-6">
                    <h1 className="text-3xl font-bold mb-2">Data Protection & Digital Identity Resources</h1>
                    <p className="text-lg text-white/90 max-w-[700px]">
                        Access official documents, guidelines, and legal frameworks related to data protection and
                        digital identity systems across Africa
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
