import ChatPage from "@/components/chat";

function page() {
    return (
        <div className="container mx-auto max-w-7xl px-6 pb-12 pt-8">
            <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Ask a policy question</h1>
                <p className="mt-1 max-w-3xl text-slate-600">
                    Data protection and digital identity policy across the African Union. Answers are generated from
                    the indexed laws and policies.
                </p>
            </div>
            <ChatPage />
        </div>
    );
}

export default page;
