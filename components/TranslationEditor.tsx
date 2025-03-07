"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

// ტიპები
interface ProjectTranslation {
    id: string;
    title: string;
    shortDescription: string;
    description: string[];
    floors: Floor[];
    originalTitle?: string;
    originalShortDescription?: string;
    originalDescription?: string[];
    originalFloors?: Floor[];
}

interface Floor {
    name: string;
    image: string;
    measurements: string[];
}

const TranslationEditor: React.FC = () => {
    const params = useParams();
    const projectId = params?.projectId as string;
    const locale = params?.locale as string;
    const baseLocale = "ka"; // ძირითადი ენა
    const router = useRouter();

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [translation, setTranslation] = useState<ProjectTranslation>({
        id: "",
        title: "",
        shortDescription: "",
        description: [],
        floors: [],
        originalTitle: "",
        originalShortDescription: "",
        originalDescription: [],
        originalFloors: []
    });

    const localeName = locale === "en" ? "ინგლისური" : locale === "ru" ? "რუსული" : locale;

    // პროექტის და მისი თარგმანის ჩატვირთვა
    useEffect(() => {
        const fetchProjectAndTranslation = async (): Promise<void> => {
            try {
                setIsLoading(true);

                // ორიგინალი პროექტის ჩატვირთვა (ქართულ ენაზე)
                const originalResponse = await fetch(`/${baseLocale}/api/projects/${projectId}`);

                if (!originalResponse.ok) {
                    throw new Error("პროექტის ჩატვირთვა ვერ მოხერხდა");
                }

                const originalData = await originalResponse.json();

                // თარგმანის ჩატვირთვა არჩეულ ენაზე
                const translationResponse = await fetch(`/${locale}/api/projects/${projectId}`);

                let translationData;

                if (translationResponse.ok) {
                    translationData = await translationResponse.json();
                } else {
                    // თუ თარგმანი არ არსებობს, გამოვიყენოთ ორიგინალი
                    translationData = {
                        ...originalData,
                        title: "",
                        shortDescription: "",
                        description: [],
                        floors: originalData.floors.map((floor: Floor) => ({
                            ...floor,
                            name: "",
                            measurements: floor.measurements.map(() => "")
                        }))
                    };
                }

                setTranslation({
                    id: projectId,
                    title: translationData.title || "",
                    shortDescription: translationData.shortDescription || "",
                    description: Array.isArray(translationData.description) ? translationData.description : [],
                    floors: Array.isArray(translationData.floors) ? translationData.floors : [],
                    originalTitle: originalData.title,
                    originalShortDescription: originalData.shortDescription,
                    originalDescription: Array.isArray(originalData.description) ? originalData.description : [],
                    originalFloors: Array.isArray(originalData.floors) ? originalData.floors : []
                });

            } catch (err) {
                console.error("Error fetching project:", err);
                setError("პროექტის ჩატვირთვა ვერ მოხერხდა");
            } finally {
                setIsLoading(false);
            }
        };

        if (projectId && locale) {
            fetchProjectAndTranslation();
        }
    }, [projectId, locale, baseLocale]);

    // ინფუთის ცვლილებების დამუშავება
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        const { name, value } = e.target;
        setTranslation(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // აღწერის ცვლილებების დამუშავება
    const handleDescriptionChange = (index: number, value: string): void => {
        const updatedDescription = [...translation.description];

        // თუ ელემენტი არ არსებობს, შევქმნათ
        while (updatedDescription.length <= index) {
            updatedDescription.push("");
        }

        updatedDescription[index] = value;

        setTranslation(prev => ({
            ...prev,
            description: updatedDescription
        }));
    };

    // სართულის სახელის ცვლილებების დამუშავება
    const handleFloorNameChange = (index: number, value: string): void => {
        const updatedFloors = [...translation.floors];

        if (updatedFloors[index]) {
            updatedFloors[index] = {
                ...updatedFloors[index],
                name: value
            };

            setTranslation(prev => ({
                ...prev,
                floors: updatedFloors
            }));
        }
    };

    // სართულის გაზომვების ცვლილებების დამუშავება
    const handleFloorMeasurementChange = (floorIndex: number, measurementIndex: number, value: string): void => {
        const updatedFloors = [...translation.floors];

        if (updatedFloors[floorIndex]) {
            const updatedMeasurements = [...updatedFloors[floorIndex].measurements];
            updatedMeasurements[measurementIndex] = value;

            updatedFloors[floorIndex] = {
                ...updatedFloors[floorIndex],
                measurements: updatedMeasurements
            };

            setTranslation(prev => ({
                ...prev,
                floors: updatedFloors
            }));
        }
    };

    // თარგმანის შენახვა
    const handleSaveTranslation = async (): Promise<void> => {
        try {
            setIsSaving(true);

            const response = await fetch(`/${locale}/api/projects/${projectId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title: translation.title,
                    short_description: translation.shortDescription,
                    description: translation.description,
                    floors: translation.floors.map(floor => ({
                        name: floor.name,
                        image: floor.image,
                        measurements: floor.measurements
                    }))
                })
            });

            if (!response.ok) {
                throw new Error("თარგმანის შენახვა ვერ მოხერხდა");
            }

            alert("თარგმანი წარმატებით შეინახა");
            router.push("/admin/dashboard/projects");

        } catch (err) {
            console.error("Error saving translation:", err);
            alert("თარგმანის შენახვა ვერ მოხერხდა");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative m-4">
                <strong className="font-bold">შეცდომა!</strong>
                <span className="block sm:inline"> {error}</span>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">
                        პროექტის თარგმანის რედაქტირება ({localeName})
                    </h1>
                    <p className="text-gray-600">
                        {translation.originalTitle}
                    </p>
                </div>
                <div className="flex space-x-2">
                    <button
                        onClick={() => router.push("/admin/dashboard/projects")}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                    >
                        უკან დაბრუნება
                    </button>
                    <button
                        onClick={handleSaveTranslation}
                        disabled={isSaving}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                    >
                        {isSaving ? "ინახება..." : "შენახვა"}
                    </button>
                </div>
            </div>

            <div className="bg-white shadow-md rounded-lg p-6">
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        სათაური
                    </label>
                    <div className="mb-2 text-gray-500 text-sm italic">
                        ორიგინალი: {translation.originalTitle}
                    </div>
                    <input
                        type="text"
                        name="title"
                        value={translation.title}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder={`სათაური ${localeName} ენაზე`}
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        მოკლე აღწერა
                    </label>
                    <div className="mb-2 text-gray-500 text-sm italic">
                        ორიგინალი: {translation.originalShortDescription}
                    </div>
                    <textarea
                        name="shortDescription"
                        value={translation.shortDescription}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder={`მოკლე აღწერა ${localeName} ენაზე`}
                    />
                </div>

                <div className="mb-6">
                    <h3 className="text-lg font-medium mb-2">აღწერა</h3>

                    {translation.originalDescription?.map((paragraph, index) => (
                        <div key={`desc-${index}`} className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                პარაგრაფი {index + 1}
                            </label>
                            <div className="mb-2 text-gray-500 text-sm italic">
                                ორიგინალი: {paragraph}
                            </div>
                            <textarea
                                value={translation.description[index] || ""}
                                onChange={(e) => handleDescriptionChange(index, e.target.value)}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder={`პარაგრაფი ${index + 1} ${localeName} ენაზე`}
                            />
                        </div>
                    ))}
                </div>

                <div className="mb-6">
                    <h3 className="text-lg font-medium mb-2">სართულები</h3>

                    {translation.originalFloors?.map((originalFloor, floorIndex) => (
                        <div key={`floor-${floorIndex}`} className="border rounded-md p-4 mb-4">
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    სართულის სახელი
                                </label>
                                <div className="mb-2 text-gray-500 text-sm italic">
                                    ორიგინალი: {originalFloor.name}
                                </div>
                                <input
                                    type="text"
                                    value={translation.floors[floorIndex]?.name || ""}
                                    onChange={(e) => handleFloorNameChange(floorIndex, e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder={`სართულის სახელი ${localeName} ენაზე`}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    გაზომვები
                                </label>

                                {originalFloor.measurements.map((measurement, measurementIndex) => (
                                    <div key={`measurement-${floorIndex}-${measurementIndex}`} className="mb-2">
                                        <div className="mb-1 text-gray-500 text-sm italic">
                                            ორიგინალი: {measurement}
                                        </div>
                                        <input
                                            type="text"
                                            value={translation.floors[floorIndex]?.measurements[measurementIndex] || ""}
                                            onChange={(e) => handleFloorMeasurementChange(floorIndex, measurementIndex, e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            placeholder={`გაზომვა ${measurementIndex + 1} ${localeName} ენაზე`}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TranslationEditor;