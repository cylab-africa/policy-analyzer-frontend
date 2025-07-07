import React from "react";

const Footer = () => {
    return (
        <footer className="bg-gradient-to-r from-slate-900 to-slate-800 text-white">
            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    {/* Brand Section */}
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-blue-400">Policy Analyzer</h2>
                        <p className="text-slate-300 text-sm leading-relaxed w-3/5">
                            Upanzi Network is an Africa-based collaboration of engineering research labs working toward
                            a secure and resilient digital transformation on the continent.
                        </p>
                    </div>

                    {/* Contact Section */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white">Contact Information</h3>
                        <div className="space-y-3">
                            <div className="text-slate-300 text-sm">
                                <div className="font-medium text-white mb-1">Carnegie Mellon University Africa</div>
                                <div>Regional ICT Center of Excellence Bldg</div>
                                <div>Kigali Innovation City - Bumbogo</div>
                                <div>BP 6150, Kigali, Rwanda</div>
                            </div>
                            <a
                                href="mailto:africa-info@andrew.cmu.edu"
                                className="flex items-center text-slate-300 hover:text-blue-400 transition-colors text-sm group"
                            >
                                <svg
                                    className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                </svg>
                                africa-info@andrew.cmu.edu
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Border */}
                <div className="border-t border-slate-700 pt-6">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
                        <p className="text-slate-400 text-sm">
                            © {new Date().getFullYear()} Upanzi Network Policy Analyzer. All rights reserved.
                        </p>
                        <div className="flex space-x-4">
                            <span className="text-slate-500 text-xs">Powered by Upanzi Network</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
