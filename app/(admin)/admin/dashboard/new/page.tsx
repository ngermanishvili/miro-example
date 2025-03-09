// app/(admin)/admin/dashboard/projects/new/page.tsx
"use client";

import React, { useState } from 'react';
import { Project, ProjectLanguageData } from '@/types/project';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const NewProjectPage = () => {
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [projectId, setProjectId] = useState('');
    const [error, setError] = useState<string | null>(null);

    // საწყისი პროექტის შაბლონი
    const emptyProject: Project = {
        id: '',
        ge: {
            title: '',
            shortDescription: '',
            location: '',
            function: '',
            area: '',
            year: '',
            description: [''],
            floors: [
                {
                    name: '',
                    image: '',
                    measurements: ['']
                }
            ],
            images: [
                {
                    src: '',
                    alt: ''
                }
            ],
            thumbnail: ''
        },
        en: {
            title: '',
            shortDescription: '',
            location: '',
            function: '',
            area: '',
            year: '',
            description: [''],
            floors: [
                {
                    name: '',
                    image: '',
                    measurements: ['']
                }
            ],
            images: [
                {
                    src: '',
                    alt: ''
                }
            ],
            thumbnail: ''
        },
        ru: {
            title: '',
            shortDescription: '',
            location: '',
            function: '',
            area: '',
            year: '',
            description: [''],
            floors: [
                {
                    name: '',
                    image: '',
                    measurements: ['']
                }
            ],
            images: [
                {
                    src: '',
                    alt: ''
                }
            ],
            thumbnail: ''
        }
    };

    const [project, setProject] = useState<Project>(emptyProject);

    const handleInputChange = (field: string, value: string) => {
        setProjectId(value.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''));
        setProject(prev => ({
            ...prev,
            id: value.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
        }));
    };

    const handleSave = async () => {
        // ეს ფუნქციონალი დაემატება მოგვიანებით
        alert('პროექტის შექმნის ფუნქციონალი დაემატება შემდგომში');
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                    <Link href="/admin/dashboard" passHref>
                        <button className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded mr-4">
                            ← უკან დაბრუნება
                        </button>
                    </Link>
                    <h1 className="text-3xl font-bold">ახალი პროექტის შექმნა</h1>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving || !projectId.trim()}
                    className={`${saving || !projectId.trim()
                        ? 'bg-green-300 cursor-not-allowed'
                        : 'bg-green-500 hover:bg-green-600'
                        } text-white py-2 px-4 rounded`}
                >
                    {saving ? 'ინახება...' : 'შექმნა'}
                </button>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                    <p>{error}</p>
                </div>
            )}

            <div className="bg-white shadow-md rounded-lg p-6 mb-8">
                <h2 className="text-xl font-bold mb-4">პროექტის საიდენტიფიკაციო ინფორმაცია</h2>
                <div className="mb-6">
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="project-title">
                        პროექტის სახელი (ინგლისურად)
                    </label>
                    <input
                        type="text"
                        id="project-title"
                        placeholder="მაგ: Modern Villa"
                        value={project.en.title}
                        onChange={(e) => {
                            handleInputChange('en.title', e.target.value);
                            setProject(prev => ({
                                ...prev,
                                en: {
                                    ...prev.en,
                                    title: e.target.value
                                }
                            }));
                        }}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                        პროექტის სახელზე დაყრდნობით შეიქმნება პროექტის ID: <strong>{projectId || 'project-id'}</strong>
                    </p>
                </div>
            </div>

            <div className="bg-white shadow-md rounded-lg p-6 mb-8">
                <h2 className="text-xl font-bold mb-4">დაიწყეთ პროექტის შექმნა</h2>
                <p className="mb-4">
                    შეავსეთ თუნდაც მინიმალური ინფორმაცია პროექტის შესახებ, რომ შევქმნათ საწყისი ვერსია.
                    შემდეგ შეგიძლიათ დაამატოთ მეტი დეტალი რედაქტირების გვერდზე.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* ქართული */}
                    <div className="border p-4 rounded">
                        <h3 className="font-bold text-lg mb-3">ქართული</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-gray-700 font-bold mb-2">
                                    სათაური
                                </label>
                                <input
                                    type="text"
                                    value={project.ge.title}
                                    onChange={(e) => setProject(prev => ({
                                        ...prev,
                                        ge: {
                                            ...prev.ge,
                                            title: e.target.value
                                        }
                                    }))}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    placeholder="სათაური ქართულად"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-bold mb-2">
                                    მოკლე აღწერა
                                </label>
                                <textarea
                                    value={project.ge.shortDescription}
                                    onChange={(e) => setProject(prev => ({
                                        ...prev,
                                        ge: {
                                            ...prev.ge,
                                            shortDescription: e.target.value
                                        }
                                    }))}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    placeholder="მოკლე აღწერა ქართულად"
                                    rows={3}
                                />
                            </div>
                        </div>
                    </div>

                    {/* ინგლისური */}
                    <div className="border p-4 rounded">
                        <h3 className="font-bold text-lg mb-3">ინგლისური</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-gray-700 font-bold mb-2">
                                    სათაური
                                </label>
                                <input
                                    type="text"
                                    value={project.en.title}
                                    onChange={(e) => {
                                        handleInputChange('en.title', e.target.value);
                                        setProject(prev => ({
                                            ...prev,
                                            en: {
                                                ...prev.en,
                                                title: e.target.value
                                            }
                                        }));
                                    }}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    placeholder="სათაური ინგლისურად"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-bold mb-2">
                                    მოკლე აღწერა
                                </label>
                                <textarea
                                    value={project.en.shortDescription}
                                    onChange={(e) => setProject(prev => ({
                                        ...prev,
                                        en: {
                                            ...prev.en,
                                            shortDescription: e.target.value
                                        }
                                    }))}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    placeholder="მოკლე აღწერა ინგლისურად"
                                    rows={3}
                                />
                            </div>
                        </div>
                    </div>

                    {/* რუსული */}
                    <div className="border p-4 rounded">
                        <h3 className="font-bold text-lg mb-3">რუსული</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-gray-700 font-bold mb-2">
                                    სათაური
                                </label>
                                <input
                                    type="text"
                                    value={project.ru.title}
                                    onChange={(e) => setProject(prev => ({
                                        ...prev,
                                        ru: {
                                            ...prev.ru,
                                            title: e.target.value
                                        }
                                    }))}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    placeholder="სათაური რუსულად"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-bold mb-2">
                                    მოკლე აღწერა
                                </label>
                                <textarea
                                    value={project.ru.shortDescription}
                                    onChange={(e) => setProject(prev => ({
                                        ...prev,
                                        ru: {
                                            ...prev.ru,
                                            shortDescription: e.target.value
                                        }
                                    }))}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    placeholder="მოკლე აღწერა რუსულად"
                                    rows={3}
                                />
                            </div>
                        </div>
                    </div>

                    {/* ძირითადი ინფორმაცია */}
                    <div className="border p-4 rounded">
                        <h3 className="font-bold text-lg mb-3">ძირითადი ინფორმაცია</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-gray-700 font-bold mb-2">
                                    მდებარეობა (ქართულად)
                                </label>
                                <input
                                    type="text"
                                    value={project.ge.location}
                                    onChange={(e) => setProject(prev => ({
                                        ...prev,
                                        ge: {
                                            ...prev.ge,
                                            location: e.target.value
                                        }
                                    }))}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    placeholder="მაგ: თბილისი, საქართველო"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-bold mb-2">
                                    წელი
                                </label>
                                <input
                                    type="text"
                                    value={project.ge.year}
                                    onChange={(e) => {
                                        const year = e.target.value;
                                        setProject(prev => ({
                                            ...prev,
                                            ge: {
                                                ...prev.ge,
                                                year
                                            },
                                            en: {
                                                ...prev.en,
                                                year
                                            },
                                            ru: {
                                                ...prev.ru,
                                                year
                                            }
                                        }));
                                    }}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    placeholder="მაგ: 2023"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-bold mb-2">
                                    თამბნეილის მისამართი
                                </label>
                                <input
                                    type="text"
                                    value={project.ge.thumbnail}
                                    onChange={(e) => {
                                        const thumbnail = e.target.value;
                                        setProject(prev => ({
                                            ...prev,
                                            ge: {
                                                ...prev.ge,
                                                thumbnail
                                            },
                                            en: {
                                                ...prev.en,
                                                thumbnail
                                            },
                                            ru: {
                                                ...prev.ru,
                                                thumbnail
                                            }
                                        }));
                                    }}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    placeholder="მაგ: /assets/thumbnail.jpg"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ღილაკები */}
            <div className="flex justify-end space-x-4">
                <Link href="/admin/dashboard" passHref>
                    <button className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded">
                        გაუქმება
                    </button>
                </Link>
                <button
                    onClick={handleSave}
                    disabled={saving || !projectId.trim()}
                    className={`${saving || !projectId.trim()
                        ? 'bg-green-300 cursor-not-allowed'
                        : 'bg-green-500 hover:bg-green-600'
                        } text-white py-2 px-4 rounded`}
                >
                    {saving ? 'ინახება...' : 'შექმნა'}
                </button>
            </div>
        </div>
    );
};

export default NewProjectPage;