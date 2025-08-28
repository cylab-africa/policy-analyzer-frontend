import ChatPage from "@/components/chat/Chat";

function page() {
    return (
        <main>
            <div className="bg-primary text-white py-12 mb-8">
                <div className="max-w-7xl mx-auto px-6">
                    <h1 className="text-4xl font-bold mb-2">Policy Intelligence Assistant</h1>
                    <p className="text-lg text-white/90 max-w-[600px]">
                        AI-powered insights on privacy policies and compliance frameworks
                    </p>
                </div>
            </div>
            <div className="max-w-7xl container mx-auto px-6 mb-20">
                <ChatPage />
            </div>
        </main>
    );
}

export default page;
