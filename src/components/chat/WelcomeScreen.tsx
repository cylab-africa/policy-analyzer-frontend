"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Upload, FileSpreadsheet } from "lucide-react";
import { ChatTab } from ".";

export function WelcomeScreen({
    activeTab,
    setInput,
    suggestedQuestions,
    onUploadClick,
    onBatchClick,
}: {
    activeTab: ChatTab;
    setInput: (input: string) => void;
    suggestedQuestions: Record<ChatTab, string[]>;
    onUploadClick?: () => void;
    onBatchClick?: () => void;
}) {
    return (
        <div className="h-full flex flex-col items-center justify-center text-center p-4 sm:p-6 max-w-4xl mx-auto">
            {/* Title with better typography */}
            <div className="mb-8 space-y-2">
                <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    {activeTab === ChatTab.DATA_PROTECTION
                        ? "Explore Data Protection Policies"
                        : "Discover Digital ID Systems"}
                </h2>
                <p className="text-gray-600 text-sm sm:text-base max-w-lg">
                    {activeTab === ChatTab.DATA_PROTECTION
                        ? "Get insights on privacy laws, compliance frameworks, and regulatory landscapes across African nations"
                        : "Learn about identity verification systems, digital citizenship, and authentication frameworks in Africa"}
                </p>
            </div>

            {/* Action Cards */}
            <div className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                <button
                    onClick={onUploadClick}
                    className="group flex items-start gap-4 p-5 bg-gradient-to-br from-primary/5 to-primary/10 hover:from-primary/10 hover:to-primary/15 border border-primary/20 hover:border-primary/30 rounded-2xl text-left transition-all duration-300"
                >
                    <div className="p-3 bg-white rounded-xl shadow-sm group-hover:shadow-md transition-shadow">
                        <Upload className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-base font-semibold text-slate-800 mb-1">Upload Documents</h3>
                        <p className="text-sm text-slate-500 leading-relaxed">
                            Add your own documents to enhance the knowledge base
                        </p>
                    </div>
                </button>

                <button
                    onClick={onBatchClick}
                    className="group flex items-start gap-4 p-5 bg-gradient-to-br from-green-50 to-emerald-50 hover:from-green-100/80 hover:to-emerald-100/80 border border-green-200 hover:border-green-300 rounded-2xl text-left transition-all duration-300"
                >
                    <div className="p-3 bg-white rounded-xl shadow-sm group-hover:shadow-md transition-shadow">
                        <FileSpreadsheet className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-base font-semibold text-slate-800 mb-1">Batch Analysis</h3>
                        <p className="text-sm text-slate-500 leading-relaxed">
                            Process multiple queries from an Excel file
                        </p>
                    </div>
                </button>
            </div>

            {/* Enhanced suggestion tags */}
            <div className="w-full max-w-3xl">
                <div className="flex items-center gap-2 mb-4">
                    <span className="text-sm font-medium text-gray-700">Or try asking:</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                    {suggestedQuestions[activeTab].map((question, index) => (
                        <Button
                            key={index}
                            className="group cursor-pointer relative bg-gradient-to-r from-gray-50 to-gray-100/90 
                            border border-gray-200 hover:border-primary/30 rounded-xl p-4 text-left transition-all duration-300 
                            focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2"
                            onClick={() => setInput(question)}
                        >
                            {/* Content */}
                            <div className="flex items-center gap-3">
                                <div className="flex-shrink-0 w-2 h-2 bg-primary/60 rounded-full transition-colors"></div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-gray-600 group-hover:text-gray-700 leading-relaxed">
                                        {question}
                                    </p>
                                </div>
                                <ArrowRight
                                    size={16}
                                    className="text-gray-400 group-hover:text-primary transition-colors opacity-0 group-hover:opacity-100 transform translate-x-1 group-hover:translate-x-0"
                                />
                            </div>

                            {/* Hover effect border */}
                            <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-primary/20 transition-all duration-300"></div>
                        </Button>
                    ))}
                </div>
            </div>
        </div>
    );
}
