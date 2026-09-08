import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
    return (
        <div className="relative min-h-[75vh] flex items-center justify-center overflow-hidden px-6 py-24">
            {/* Decorative background */}
            <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute left-1/2 top-1/2 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />
                <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-secondary/10 blur-3xl" />
                <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage:
                            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
                        backgroundSize: "48px 48px",
                    }}
                />
            </div>

            <div className="max-w-lg w-full text-center animate-fade-in-up">
                <div className="relative select-none">
                    <h1 className="text-[7rem] sm:text-[9rem] font-black leading-none tracking-tight bg-gradient-to-b from-primary to-primary/30 bg-clip-text text-transparent">
                        404
                    </h1>
                </div>

                <h2 className="-mt-4 sm:-mt-6 text-2xl sm:text-3xl font-bold text-foreground text-balance">
                    Page not found
                </h2>
                <p className="mt-4 text-muted-foreground text-balance leading-relaxed">
                    The page you&apos;re looking for doesn&apos;t exist, has moved, or isn&apos;t available right
                    now.
                </p>

                <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Button asChild size="lg" className="w-full sm:w-auto shadow-sm hover:shadow-md transition-shadow">
                        <Link href="/">Back to home</Link>
                    </Button>
                   
                </div>
            </div>
        </div>
    );
}
