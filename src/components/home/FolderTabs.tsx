"use client";

import { TabsList, TabsTrigger } from "@/components/ui/tabs";

// Folder-style tabs: the selected tab is raised and joins the panel below it, the others sit behind.
// Use inside <Tabs>, with a panel directly after it that has `rounded-tl-none`.
export default function FolderTabs({ tabs }: { readonly tabs: { value: string; label: string }[] }) {
    return (
        <TabsList className="flex h-auto w-full items-end justify-start gap-1.5 rounded-none bg-transparent p-0">
            {tabs.map((tab) => (
                <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="relative -mb-px h-auto min-w-0 flex-1 cursor-pointer justify-start whitespace-normal rounded-b-none rounded-t-2xl border border-b-0 px-5 pb-3.5 pt-4 text-left text-base font-bold shadow-none transition-colors duration-200 before:absolute before:inset-x-0 before:top-0 before:h-1 before:rounded-t-2xl sm:max-w-xs sm:text-lg data-[state=active]:z-10 data-[state=active]:border-slate-200 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:before:bg-primary data-[state=inactive]:mt-2 data-[state=inactive]:border-slate-200 data-[state=inactive]:bg-slate-100 data-[state=inactive]:text-slate-500 data-[state=inactive]:hover:bg-slate-50 data-[state=inactive]:hover:text-slate-700"
                >
                    {tab.label}
                </TabsTrigger>
            ))}
        </TabsList>
    );
}
