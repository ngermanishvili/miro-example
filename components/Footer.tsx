import { Mail, Linkedin, Instagram, Phone } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="w-full bg-white py-8">
            <div className="container mx-auto max-w-6xl px-4">
                {/* Using flex-row by default and flex-col on small screens */}
                <div className="flex flex-row items-center justify-between gap-6 sm:gap-8 max-sm:flex-col">
                    {/* Logo Section */}
                    <div className="flex-shrink-0">
                        <p className="text-lg font-medium text-gray-900 whitespace-nowrap">© Draftworks Project</p>
                    </div>

                    {/* Info Section */}
                    <div className="flex items-center gap-6 max-sm:flex-col">
                        <a
                            href="tel:+995599000000"
                            className="flex items-center gap-2 text-gray-600 transition-colors hover:text-gray-900 whitespace-nowrap"
                        >
                            <Phone className="h-4 w-4" />
                            +995 599000000
                        </a>
                        <a
                            href="mailto:info@draftworksproject.com"
                            className="flex items-center gap-2 text-gray-600 transition-colors hover:text-gray-900 whitespace-nowrap"
                        >
                            <Mail className="h-4 w-4" />
                            info@draftworksproject.com
                        </a>
                        <p className="text-gray-600 whitespace-nowrap">Tbilisi, Georgia</p>
                    </div>

                    {/* Social Section */}
                    <div className="flex items-center gap-4">
                        <a
                            href="#"
                            className="rounded-full p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
                            aria-label="LinkedIn"
                        >
                            <Linkedin className="h-5 w-5" />
                        </a>
                        <a
                            href="#"
                            className="rounded-full p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
                            aria-label="Instagram"
                        >
                            <Instagram className="h-5 w-5" />
                        </a>
                        <a
                            href="#"
                            className="rounded-full p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
                            aria-label="Email"
                        >
                            <Mail className="h-5 w-5" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;