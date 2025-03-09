"use client";

import React, { useEffect, useState, use } from 'react';
import { Project, ProjectLanguageData } from '@/types/project';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface ProjectEditPageProps {
    params: Promise<{
        id: string;
    }>;
}

const ProjectEditPage = ({ params }: ProjectEditPageProps) => {
    const resolvedParams = use(params);
    const { id } = resolvedParams;
    const router = useRouter();
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await fetch(`/api/projects/${id}`);

                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error('პროექტი ვერ მოიძებნა');
                    }
                    throw new Error('პროექტის ჩატვირთვა ვერ მოხერხდა');
                }

                const data = await response.json();
                setProject(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'უცნობი შეცდომა');
                console.error('Error fetching project:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [id]);

    const handleInputChange = (language: 'ge' | 'en' | 'ru', field: string, value: string) => {
        if (!project) return;

        setProject({
            ...project,
            [language]: {
                ...project[language],
                [field]: value
            }
        });
    };

    const handleThumbnailChange = (value: string) => {
        if (!project) return;

        // Update thumbnail in all language objects to maintain consistency
        setProject({
            ...project,
            ge: {
                ...project.ge,
                thumbnail: value
            },
            en: {
                ...project.en,
                thumbnail: value
            },
            ru: {
                ...project.ru,
                thumbnail: value
            }
        });
    };

    const handleDescriptionChange = (index: number, value: string) => {
        if (!project) return;

        const updatedDescription = [...project.ge.description];
        updatedDescription[index] = value;

        setProject({
            ...project,
            ge: {
                ...project.ge,
                description: updatedDescription
            }
        });
    };

    const addDescriptionParagraph = () => {
        if (!project) return;

        setProject({
            ...project,
            ge: {
                ...project.ge,
                description: [...project.ge.description, '']
            }
        });
    };

    const removeDescriptionParagraph = (index: number) => {
        if (!project) return;

        const updatedDescription = [...project.ge.description];
        updatedDescription.splice(index, 1);

        setProject({
            ...project,
            ge: {
                ...project.ge,
                description: updatedDescription
            }
        });
    };

    const handleImageChange = (index: number, field: 'src' | 'alt', value: string) => {
        if (!project) return;

        const updatedImages = [...project.ge.images];
        updatedImages[index] = {
            ...updatedImages[index],
            [field]: value
        };

        setProject({
            ...project,
            ge: {
                ...project.ge,
                images: updatedImages
            }
        });
    };

    const addImage = () => {
        if (!project) return;

        setProject({
            ...project,
            ge: {
                ...project.ge,
                images: [...project.ge.images, { src: '', alt: '' }]
            }
        });
    };

    const removeImage = (index: number) => {
        if (!project) return;

        const updatedImages = [...project.ge.images];
        updatedImages.splice(index, 1);

        setProject({
            ...project,
            ge: {
                ...project.ge,
                images: updatedImages
            }
        });
    };

    const handleSave = async () => {
        if (!project) return;

        setSaving(true);
        setError(null);
        setSuccessMessage(null);

        try {
            const response = await fetch(`/api/projects/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(project),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'პროექტის განახლება ვერ მოხერხდა');
            }

            setSuccessMessage('პროექტი წარმატებით განახლდა');
            setTimeout(() => {
                setSuccessMessage(null);
            }, 3000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'პროექტის განახლება ვერ მოხერხდა');
            console.error('Error saving project:', err);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="p-8">
                <h1 className="text-3xl font-bold mb-6">პროექტის რედაქტირება</h1>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            </div>
        );
    }

    if (error || !project) {
        return (
            <div className="p-8">
                <div className="flex items-center mb-6">
                    <Link href="/admin/dashboard" passHref>
                        <button className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded mr-4">
                            ← უკან დაბრუნება
                        </button>
                    </Link>
                    <h1 className="text-3xl font-bold">პროექტის რედაქტირება</h1>
                </div>
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    <p>{error || 'პროექტი ვერ მოიძებნა'}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                    <Link href="/admin/dashboard" passHref>
                        <button className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded mr-4">
                            ← უკან დაბრუნება
                        </button>
                    </Link>
                    <h1 className="text-3xl font-bold">პროექტის რედაქტირება: {project.ge.title}</h1>
                </div>
                <div className="flex space-x-2">
                    <Link href={`/admin/dashboard/projects/${project.id}`} passHref>
                        <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
                            დეტალების ნახვა
                        </button>
                    </Link>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className={`${saving
                            ? 'bg-green-300 cursor-not-allowed'
                            : 'bg-green-500 hover:bg-green-600'
                            } text-white py-2 px-4 rounded`}
                    >
                        {saving ? 'ინახება...' : 'შენახვა'}
                    </button>
                </div>
            </div>

            {/* Success message */}
            {successMessage && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                    <p>{successMessage}</p>
                </div>
            )}

            {/* Error message */}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    <p>{error}</p>
                </div>
            )}

            <div className="bg-white shadow-md rounded-lg p-6 mb-8">
                <h2 className="text-xl font-bold mb-4">ძირითადი ინფორმაცია</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="block text-gray-700 font-bold mb-2" htmlFor="id">
                            ID
                        </label>
                        <input
                            type="text"
                            id="id"
                            value={project.id}
                            disabled
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-100"
                        />
                        <p className="text-sm text-gray-500 mt-1">ID ცვლილებას არ ექვემდებარება</p>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-bold mb-2" htmlFor="thumbnail">
                            სათაური სურათი (Thumbnail)
                        </label>
                        <input
                            type="text"
                            id="thumbnail"
                            value={project.ge.thumbnail}
                            onChange={(e) => handleThumbnailChange(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                </div>
            </div>

            {/* ქართული ენის ინფორმაცია */}
            <div className="bg-white shadow-md rounded-lg p-6 mb-8">
                <h2 className="text-xl font-bold mb-4">ქართული ენის ინფორმაცია</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="block text-gray-700 font-bold mb-2" htmlFor="ge-title">
                            სათაური (ქართულად)
                        </label>
                        <input
                            type="text"
                            id="ge-title"
                            value={project.ge.title}
                            onChange={(e) => handleInputChange('ge', 'title', e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-bold mb-2" htmlFor="ge-location">
                            მდებარეობა (ქართულად)
                        </label>
                        <input
                            type="text"
                            id="ge-location"
                            value={project.ge.location}
                            onChange={(e) => handleInputChange('ge', 'location', e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-bold mb-2" htmlFor="ge-function">
                            ფუნქცია (ქართულად)
                        </label>
                        <input
                            type="text"
                            id="ge-function"
                            value={project.ge.function}
                            onChange={(e) => handleInputChange('ge', 'function', e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-bold mb-2" htmlFor="ge-area">
                            ფართობი (ქართულად)
                        </label>
                        <input
                            type="text"
                            id="ge-area"
                            value={project.ge.area}
                            onChange={(e) => handleInputChange('ge', 'area', e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-bold mb-2" htmlFor="ge-year">
                            წელი (ქართულად)
                        </label>
                        <input
                            type="text"
                            id="ge-year"
                            value={project.ge.year}
                            onChange={(e) => handleInputChange('ge', 'year', e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-bold mb-2" htmlFor="ge-shortDescription">
                            მოკლე აღწერა (ქართულად)
                        </label>
                        <textarea
                            id="ge-shortDescription"
                            value={project.ge.shortDescription}
                            onChange={(e) => handleInputChange('ge', 'shortDescription', e.target.value)}
                            rows={3}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 font-bold mb-2">
                        სრული აღწერა (ქართულად)
                    </label>
                    <div className="space-y-4">
                        {project.ge.description.map((paragraph, index) => (
                            <div key={index} className="flex items-start">
                                <textarea
                                    value={paragraph}
                                    onChange={(e) => handleDescriptionChange(index, e.target.value)}
                                    rows={4}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeDescriptionParagraph(index)}
                                    className="ml-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded"
                                >
                                    X
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addDescriptionParagraph}
                            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                        >
                            პარაგრაფის დამატება
                        </button>
                    </div>
                </div>
            </div>

            {/* ინგლისური ენის ინფორმაცია */}
            <div className="bg-white shadow-md rounded-lg p-6 mb-8">
                <h2 className="text-xl font-bold mb-4">ინგლისური ენის ინფორმაცია</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="block text-gray-700 font-bold mb-2" htmlFor="en-title">
                            სათაური (ინგლისურად)
                        </label>
                        <input
                            type="text"
                            id="en-title"
                            value={project.en.title}
                            onChange={(e) => handleInputChange('en', 'title', e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-bold mb-2" htmlFor="en-location">
                            მდებარეობა (ინგლისურად)
                        </label>
                        <input
                            type="text"
                            id="en-location"
                            value={project.en.location}
                            onChange={(e) => handleInputChange('en', 'location', e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-bold mb-2" htmlFor="en-function">
                            ფუნქცია (ინგლისურად)
                        </label>
                        <input
                            type="text"
                            id="en-function"
                            value={project.en.function}
                            onChange={(e) => handleInputChange('en', 'function', e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-bold mb-2" htmlFor="en-area">
                            ფართობი (ინგლისურად)
                        </label>
                        <input
                            type="text"
                            id="en-area"
                            value={project.en.area}
                            onChange={(e) => handleInputChange('en', 'area', e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-bold mb-2" htmlFor="en-year">
                            წელი (ინგლისურად)
                        </label>
                        <input
                            type="text"
                            id="en-year"
                            value={project.en.year}
                            onChange={(e) => handleInputChange('en', 'year', e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-bold mb-2" htmlFor="en-shortDescription">
                            მოკლე აღწერა (ინგლისურად)
                        </label>
                        <textarea
                            id="en-shortDescription"
                            value={project.en.shortDescription}
                            onChange={(e) => handleInputChange('en', 'shortDescription', e.target.value)}
                            rows={3}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                </div>
            </div>

            {/* რუსული ენის ინფორმაცია */}
            <div className="bg-white shadow-md rounded-lg p-6 mb-8">
                <h2 className="text-xl font-bold mb-4">რუსული ენის ინფორმაცია</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="block text-gray-700 font-bold mb-2" htmlFor="ru-title">
                            სათაური (რუსულად)
                        </label>
                        <input
                            type="text"
                            id="ru-title"
                            value={project.ru.title}
                            onChange={(e) => handleInputChange('ru', 'title', e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-bold mb-2" htmlFor="ru-location">
                            მდებარეობა (რუსულად)
                        </label>
                        <input
                            type="text"
                            id="ru-location"
                            value={project.ru.location}
                            onChange={(e) => handleInputChange('ru', 'location', e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-bold mb-2" htmlFor="ru-function">
                            ფუნქცია (რუსულად)
                        </label>
                        <input
                            type="text"
                            id="ru-function"
                            value={project.ru.function}
                            onChange={(e) => handleInputChange('ru', 'function', e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-bold mb-2" htmlFor="ru-area">
                            ფართობი (რუსულად)
                        </label>
                        <input
                            type="text"
                            id="ru-area"
                            value={project.ru.area}
                            onChange={(e) => handleInputChange('ru', 'area', e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-bold mb-2" htmlFor="ru-year">
                            წელი (რუსულად)
                        </label>
                        <input
                            type="text"
                            id="ru-year"
                            value={project.ru.year}
                            onChange={(e) => handleInputChange('ru', 'year', e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-bold mb-2" htmlFor="ru-shortDescription">
                            მოკლე აღწერა (რუსულად)
                        </label>
                        <textarea
                            id="ru-shortDescription"
                            value={project.ru.shortDescription}
                            onChange={(e) => handleInputChange('ru', 'shortDescription', e.target.value)}
                            rows={3}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                </div>
            </div>

            {/* სურათების რედაქტირება */}
            <div className="bg-white shadow-md rounded-lg p-6 mb-8">
                <h2 className="text-xl font-bold mb-4">სურათების რედაქტირება</h2>
                <div className="space-y-4">
                    {project.ge.images.map((image, index) => (
                        <div key={index} className="flex items-center space-x-4 p-4 border rounded">
                            <div className="w-24 h-24 bg-gray-100 overflow-hidden rounded flex-shrink-0">
                                <img
                                    src={image.src}
                                    alt={image.alt}
                                    className="object-cover w-full h-full"
                                />
                            </div>
                            <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-700 font-bold mb-2">
                                        სურათის მისამართი
                                    </label>
                                    <input
                                        type="text"
                                        value={image.src}
                                        onChange={(e) => handleImageChange(index, 'src', e.target.value)}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-bold mb-2">
                                        სურათის აღწერა
                                    </label>
                                    <input
                                        type="text"
                                        value={image.alt}
                                        onChange={(e) => handleImageChange(index, 'alt', e.target.value)}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    />
                                </div>
                            </div>
                            <button
                                onClick={() => removeImage(index)}
                                className="bg-red-500 hover:bg-red-600 text-white p-2 rounded"
                            >
                                X
                            </button>
                        </div>
                    ))}
                    <button
                        onClick={addImage}
                        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                    >
                        სურათის დამატება
                    </button>
                </div>
            </div>

            {/* ღილაკები */}
            <div className="flex justify-end space-x-4">
                <Link href="/admin/dashboard" passHref>
                    <button className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded">
                        უკან დაბრუნება
                    </button>
                </Link>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className={`${saving
                        ? 'bg-green-300 cursor-not-allowed'
                        : 'bg-green-500 hover:bg-green-600'
                        } text-white py-2 px-4 rounded`}
                >
                    {saving ? 'ინახება...' : 'შენახვა'}
                </button>
            </div>
        </div>
    );
};

export default ProjectEditPage;