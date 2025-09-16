"use client";

import { useEffect } from "react";

// Smooth Scroll Enhancement Hook
export const useSmoothScroll = () => {
    useEffect(() => {
        // Enhanced smooth scrolling for anchor links
        const handleAnchorClick = (e: Event) => {
            const target = e.target as HTMLAnchorElement;
            const href = target.getAttribute("href");

            if (href?.startsWith("#")) {
                e.preventDefault();
                const targetElement = document.querySelector(href);

                if (targetElement) {
                    const offsetTop = targetElement.getBoundingClientRect().top + window.pageYOffset - 80;

                    window.scrollTo({
                        top: offsetTop,
                        behavior: "smooth",
                    });
                }
            }
        };

        // Add event listeners to all anchor links
        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        anchorLinks.forEach((link) => {
            link.addEventListener("click", handleAnchorClick);
        });

        // Cleanup
        return () => {
            anchorLinks.forEach((link) => {
                link.removeEventListener("click", handleAnchorClick);
            });
        };
    }, []);
};

// Scroll Animation Component
export const ScrollReveal: React.FC<{
    children: React.ReactNode;
    className?: string;
    delay?: number;
}> = ({ children, className = "", delay = 0 }) => {
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.classList.add("scroll-reveal-visible");
                            entry.target.classList.remove("scroll-reveal-hidden");
                        }, delay);
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: "0px 0px -50px 0px",
            }
        );

        const elements = document.querySelectorAll(".scroll-reveal");
        elements.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, [delay]);

    return <div className={`scroll-reveal scroll-reveal-hidden ${className}`}>{children}</div>;
};

// Parallax Scroll Component
export const ParallaxScroll: React.FC<{
    children: React.ReactNode;
    speed?: number;
    className?: string;
}> = ({ children, speed = 0.5, className = "" }) => {
    useEffect(() => {
        const handleScroll = () => {
            const elements = document.querySelectorAll(".parallax-element");
            const scrollY = window.pageYOffset;

            elements.forEach((element) => {
                const rect = element.getBoundingClientRect();
                const elementTop = rect.top + scrollY;
                const elementHeight = rect.height;
                const windowHeight = window.innerHeight;

                // Only apply parallax if element is in view
                if (scrollY + windowHeight > elementTop && scrollY < elementTop + elementHeight) {
                    const yPos = -(scrollY - elementTop) * speed;
                    (element as HTMLElement).style.transform = `translateY(${yPos}px)`;
                }
            });
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [speed]);

    return <div className={`parallax-element ${className}`}>{children}</div>;
};
