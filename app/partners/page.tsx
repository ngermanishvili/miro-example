import React from 'react';

interface Partner {
    name: string;
    logo: string;
}

interface LogoRowProps {
    items: Partner[];
    className?: string;
}

const Partners: React.FC = () => {
    const partners: Partner[] = [
        { name: 'Autodesk', logo: '/assets/partners/c1.png' },
        { name: 'Dropbox', logo: '/assets/partners/c2.png' },
        { name: 'Google', logo: '/assets/partners/c3.png' },
        { name: 'Vitra', logo: '/assets/partners/c4.png' },
        { name: 'LSG Solutions', logo: '/assets/partners/c5.png' },
        { name: 'Belle Maison', logo: '/assets/partners/c6.png' },
        { name: 'Kapana', logo: '/assets/partners/c7.png' },
        { name: 'EF Group', logo: '/assets/partners/c8.png' },
        { name: 'Lazieri', logo: '/assets/partners/c9.png' },
        { name: 'Bodi', logo: '/assets/partners/c10.png' },
        { name: 'Insta', logo: '/assets/partners/c11.png' },
        { name: 'Brand R', logo: '/assets/partners/c12.png' },
        { name: 'Knauf', logo: '/assets/partners/c13.png' },
        { name: 'Knauf', logo: '/assets/partners/c14.png' }
    ];

    // Split partners into rows
    const firstRow = partners.slice(0, 4);
    const secondRow = partners.slice(4, 9);
    const thirdRow = partners.slice(9, 14);

    const LogoRow: React.FC<LogoRowProps> = ({ items, className }) => (
        <div className={`grid grid-cols-4 md:grid-cols-5 gap-8 w-full  ${className}`}>
            {items.map((partner, index) => (
                <div
                    key={index}
                    className={`flex items-center justify-center transform hover:scale-110 transition-transform duration-300 ${items.length === 4 ? '' : 'first:col-start-1 last:col-start-1 md:first:col-start-auto md:last:col-start-auto'
                        }`}
                >
                    <img
                        src={partner.logo}
                        alt={`${partner.name} logo`}
                        className="h-24 w-auto object-contain opacity-70"
                    />
                </div>
            ))}
        </div>
    );

    return (
        <section className="w-full py-16 bg-white">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-12">Our Partners</h2>
                <div className="flex flex-col space-y-12">
                    <LogoRow items={firstRow} className="justify-center" />
                    <LogoRow items={secondRow} className="justify-center" />
                    <LogoRow items={thirdRow} className="justify-center" />
                </div>
            </div>
        </section>
    );
};

export default Partners;