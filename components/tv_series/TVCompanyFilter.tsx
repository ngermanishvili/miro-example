// components/tv-series/TVCompanyFilter.tsx
"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface Company {
    id: number;
    name: string;
    series_count: number;
    logo_path?: string;
}

interface TVCompanyFilterProps {
    selectedCompany: string;
    onCompanyChange: (companyId: string) => void;
}

const TVCompanyFilter: React.FC<TVCompanyFilterProps> = ({
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
                const response = await fetch('/api/tv-production-companies');

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
                    { id: 1399, name: "HBO", series_count: 15 },
                    { id: 2, name: "Netflix", series_count: 12 },
                    { id: 493, name: "BBC", series_count: 10 },
                    { id: 1024, name: "Amazon", series_count: 8 },
                    { id: 3268, name: "Hulu", series_count: 7 },
                    { id: 2739, name: "Disney+", series_count: 6 },
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
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-12 bg-gray-700 rounded animate-pulse"></div>
                    ))}
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
                                    ? 'bg-purple-700 text-white'
                                    : 'bg-gray-700 hover:bg-gray-600 text-gray-200'}`}
                            title={`${company.name} (${company.series_count} სერიალი)`}
                        >
                            {company.logo_path ? (
                                <div className="relative w-8 h-8 mr-2">
                                    <Image
                                        src={`https://image.tmdb.org/t/p/w200${company.logo_path}`}
                                        alt={company.name}
                                        fill
                                        className="object-contain"
                                        onError={(e) => {
                                            const target = e.target as HTMLElement;
                                            target.style.display = 'none';
                                        }}
                                    />
                                </div>
                            ) : null}
                            <span>{company.name}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TVCompanyFilter;