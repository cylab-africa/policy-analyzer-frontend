"use client";

import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navItems = [
    { href: "/", label: "Home" },
    { href: "/chat", label: "Chat" },
    { href: "/sources", label: "Sources" },
    { href: "/docs", label: "Docs" },
];

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const pathname = usePathname();

    // Check if page is scrolled for header styling
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    // Function to check if a link is active
    const isActive = (path: string) => {
        if (path === "/") {
            return pathname === "/";
        }
        return pathname.startsWith(path);
    };

    return (
        <header className={cn("w-full relative")}>
            <div
                className={cn(
                    "fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out",
                    isScrolled ? "bg-white/95 backdrop-blur-lg shadow-sm" : "bg-primary"
                )}
            >
                <div className="max-w-7xl container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
                    <div>
                        <Link
                            href="/"
                            className={cn(
                                "flex items-center transition-colors duration-300 group",
                                isScrolled ? "text-foreground" : "text-primary-foreground"
                            )}
                        >
                            <Image
                                src={
                                    isScrolled
                                        ? "/images/Policy_Analyzer-primary.png"
                                        : "/images/Policy_Analyzer-white.png"
                                }
                                width={35}
                                height={35}
                                alt="Policy Analyzer Logo"
                                className="mr-2 h-[35px] w-[35px] shrink-0 object-contain transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="flex items-baseline space-x-1">
                                <div
                                    className={cn(
                                        "text-xl uppercase tracking-tight transition-colors duration-300",
                                        isScrolled ? "text-primary" : "text-primary-foreground"
                                    )}
                                >
                                    Policy
                                </div>
                                <div
                                    className={cn(
                                        "text-xl font-bold tracking-tight uppercase transition-colors duration-300",
                                        isScrolled ? "text-primary" : "text-primary-foreground"
                                    )}
                                >
                                    Analyzer
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <NavigationMenu className="hidden md:flex">
                        <NavigationMenuList>
                            {navItems.map((item) => (
                                <NavigationMenuItem key={item.href}>
                                    <Link href={item.href} passHref>
                                        <div
                                            className={cn(
                                                "px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300",
                                                isActive(item.href)
                                                    ? isScrolled
                                                        ? "text-foreground"
                                                        : "text-white"
                                                    : isScrolled
                                                    ? "text-muted-foreground hover:text-foreground"
                                                    : "text-primary-foreground/80 hover:text-primary-foreground"
                                            )}
                                        >
                                            {item.label}
                                        </div>
                                    </Link>
                                </NavigationMenuItem>
                            ))}
                        </NavigationMenuList>
                    </NavigationMenu>

                    {/* Mobile Navigation */}
                    <Sheet>
                        <SheetTrigger asChild className="md:hidden">
                            <Button
                                variant="ghost"
                                size="icon"
                                className={cn(
                                    "md:hidden transition-all duration-300 hover:scale-105",
                                    isScrolled
                                        ? "text-foreground hover:text-primary"
                                        : "text-primary-foreground hover:text-primary-foreground"
                                )}
                            >
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Open menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent className="w-full max-w-sm bg-background/95 backdrop-blur-lg border-l border-border">
                            <SheetTitle className="sr-only">Main Navigation</SheetTitle>
                            <div className="flex flex-col space-y-2 mt-8">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            "px-4 py-3 text-base font-medium transition-all duration-300",
                                            isActive(item.href)
                                                ? "text-foreground"
                                                : "text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
            {/* Spacer to prevent content from hiding under fixed header */}
            <div className="h-16"></div>
        </header>
    );
}