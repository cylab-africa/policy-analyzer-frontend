import ChatPage from "@/components/chat";
import { ScrollReveal } from "@/components/ui/smooth-scroll";

function page() {
    return (
        <main>
            <div className="bg-primary text-white pt-14 pb-10 mb-8">
                <div className="max-w-7xl mx-auto px-6">
                    <h1 className="text-3xl font-bold mb-2">AI-Powered Policy Analysis</h1>
                    <p className="text-lg text-white/90 max-w-[600px]">
                        AI-powered insights on privacy policies and compliance frameworks
                    </p>
                </div>
            </div>
            <div className="max-w-7xl container mx-auto px-6 mb-12">
                <ScrollReveal>
                    <div className="scroll-snap-start">
                        <ChatPage />
                    </div>
                </ScrollReveal>
            </div>
        </main>
    );
}

export default page;
