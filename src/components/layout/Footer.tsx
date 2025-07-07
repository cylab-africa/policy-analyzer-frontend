import React from "react";

const Footer = () => {
    return (
        <footer className="bg-[#0f4c5c] text-white px-10 py-10">
            <div>
                <div className="flex justify-between items-center pb-10 max-w-7xl container mx-auto px-6">
                    {/* Left Side */}
                    <div className="max-w-[400px]">
                        <h2 className="text-lg font-bold">Policy Analyzer</h2>
                        <p className="text-sm text-white mt-2">
                            Upanzi Network is an Africa-based collaboration of engineering research labs that is working
                            toward a secure and resilient digital transformation on the continent.
                        </p>
                    </div>

                    {/* Right Side */}
                    <div className="text-left">
                        <h2 className="text-lg font-bold mb-2">Contact Us</h2>
                        <h6 className="text-sm">africa-info@andrew.cmu.edu</h6>
                    </div>
                </div>
                <p className="text-center text-sm text-[#f6f6ff] pt-5 border-t border-gray-100">
                    © {new Date().getFullYear()} Upanzi Network Analyzer. All rights reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
