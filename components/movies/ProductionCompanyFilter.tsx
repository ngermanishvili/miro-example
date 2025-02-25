"use client";

import React, { useState, useEffect } from 'react';

interface Company {
    id: number;
    name: string;
    movie_count: number;
    logo_path?: string;
}

interface ProductionCompanyFilterProps {
    selectedCompany: string;
    onCompanyChange: (companyId: string) => void;
}

const ProductionCompanyFilter: React.FC<ProductionCompanyFilterProps> = ({
    selectedCompany,
    onCompanyChange
}) => {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // რეალური კომპანიების ჩატვირთვა მონაცემთა ბაზიდან
    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                setLoading(true);

                // API-დან კომპანიების ჩატვირთვა
                const response = await fetch('/api/production-companies');

                if (!response.ok) {
                    throw new Error('კომპანიების ჩატვირთვის შეცდომა');
                }

                const data = await response.json();
                setCompanies(data.companies || []);
                setError(null);
            } catch (error) {
                console.error("კომპანიების ჩატვირთვის შეცდომა:", error);
                setError('ვერ მოხერხდა კომპანიების ჩატვირთვა');

                // დროებითი მონაცემები შეცდომის შემთხვევაში
                setCompanies([
                    { id: 9, name: "Universal Pictures", movie_count: 15 },
                    { id: 420, name: "Marvel Studios", movie_count: 12 },
                    { id: 2, name: "Walt Disney", movie_count: 10 },
                    { id: 33, name: "Paramount", movie_count: 8 },
                    { id: 25, name: "Warner Bros.", movie_count: 7 },
                    { id: 4, name: "Lionsgate", movie_count: 5 },
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchCompanies();
    }, []);

    if (loading) {
        return (
            <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-lg font-medium mb-3">პროდაქშენ კომპანიები</h3>
                <div className="animate-pulse flex space-x-4">
                    <div className="h-10 bg-gray-700 rounded w-full"></div>
                </div>
            </div>
        );
    }

    if (error && companies.length === 0) {
        return (
            <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-lg font-medium mb-3">პროდაქშენ კომპანიები</h3>
                <div className="text-red-500 text-sm">{error}</div>
            </div>
        );
    }

    return (
        <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-medium mb-3">პროდაქშენ კომპანიები</h3>

            {companies.length === 0 ? (
                <div className="text-gray-400 text-sm">კომპანიები ვერ მოიძებნა</div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {companies.map((company) => (
                        <button
                            key={company.id}
                            onClick={() => onCompanyChange(company.id.toString())}
                            className={`p-2 rounded-md text-sm transition-colors flex items-center justify-center text-center h-12
                ${selectedCompany === company.id.toString()
                                    ? 'bg-red-700 text-white'
                                    : 'bg-gray-700 hover:bg-gray-600 text-gray-200'}`}
                            title={`${company.name} (${company.movie_count} ფილმი)`}
                        >
                            {company.name}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProductionCompanyFilter;