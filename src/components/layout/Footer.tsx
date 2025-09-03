import React from "react";

const Footer = () => {
    return (
        <footer className="bg-gradient-to-r from-slate-900 to-slate-800 text-white">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    {/* Brand Section */}
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-primary">Policy Analyzer</h2>
                        <p className="text-slate-300 text-sm max-w-md leading-relaxed">
                            Upanzi Network is an Africa-based collaboration of engineering research labs working toward
                            a secure and resilient digital transformation on the continent.
                        </p>
                    </div>

                    {/* Contact Section */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white">Contact</h3>
                        <div>
                            <a
                                href="mailto:upanzi@andrew.cmu.edu"
                                className="flex items-center text-slate-300 hover:text-blue-400 transition-colors text-sm group"
                                aria-label="Email Upanzi Network"
                            >
                                <svg
                                    className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    aria-hidden="true"
                                >
                                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                </svg>
                                <span>upanzi@andrew.cmu.edu</span>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Optional: Footer Bottom Bar */}
                <div className="mt-10 border-t border-slate-700 pt-6 text-xs text-slate-400 text-center">
                    &copy; {new Date().getFullYear()} Upanzi Network. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
