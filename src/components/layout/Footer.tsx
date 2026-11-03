import Image from "next/image";
import Link from "next/link";
import React from "react";

const EXPLORE_LINKS = [
    { href: "/chat", label: "Policy Chat" },
    { href: "/sources", label: "Sources" },
    { href: "/docs", label: "Documentation" },
];

const PROJECT_LINKS = [
    { href: "https://github.com/cylab-africa/policy-analyzer-frontend", label: "Frontend repository" },
    { href: "https://github.com/cylab-africa/policy-analyzer-backend", label: "Backend repository" },
    { href: "mailto:upanzi@andrew.cmu.edu", label: "upanzi@andrew.cmu.edu" },
];

const linkClass = "text-slate-400 transition-colors hover:text-white focus-visible:text-white";

const Footer = () => {
    return (
        <footer className="border-t border-slate-800 bg-slate-900 text-slate-300">
            <div className="container mx-auto max-w-7xl px-6 py-14">
                <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.6fr_1fr_1fr]">
                    <div>
                        <Link href="/" className="inline-flex items-center gap-2" aria-label="Policy Analyzer home">
                            <Image
                                src="/images/Policy_Analyzer-white.png"
                                width={32}
                                height={32}
                                alt=""
                                aria-hidden="true"
                            />
                            <span className="text-lg uppercase tracking-tight text-white">
                                Policy <span className="font-bold">Analyzer</span>
                            </span>
                        </Link>
                        <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
                            Data protection and digital identity policy across the African Union, in one searchable
                            place. Built by Upanzi Network, an Africa-based collaboration of engineering research labs.
                        </p>
                    </div>

                    <nav aria-label="Explore">
                        <h2 className="text-sm font-semibold text-white">Explore</h2>
                        <ul className="mt-4 space-y-3 text-sm">
                            {EXPLORE_LINKS.map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className={linkClass}>
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <nav aria-label="Project">
                        <h2 className="text-sm font-semibold text-white">Project</h2>
                        <ul className="mt-4 space-y-3 text-sm">
                            {PROJECT_LINKS.map((link) => {
                                const external = link.href.startsWith("http");
                                return (
                                    <li key={link.href}>
                                        <a
                                            href={link.href}
                                            className={linkClass}
                                            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                                        >
                                            {link.label}
                                        </a>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>
                </div>

                <div className="mt-12 flex flex-col gap-2 border-t border-slate-800 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
                    <p>&copy; {new Date().getFullYear()} Upanzi Network. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
