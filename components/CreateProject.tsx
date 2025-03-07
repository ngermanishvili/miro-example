"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CldUploadWidget } from "next-cloudinary";
import { ImagePlus, Loader2, Plus, Trash, ArrowLeft, Save } from "lucide-react";

// ტიპები
interface ProjectData {
    id?: string;
    title: string;
    shortDescription: string;
    location: string;
    function: string;
    area: string;
    year: string;
    description: string[];
    floors: Floor[];
    images: Image[];
    thumbnail: string;
}

interface Floor {
    name: string;
    image: string;
    measurements: string[];
}

interface Image {
    src: string;
    alt: string;
}

interface CloudinaryResult {
    info: {
        secure_url: string;
    };
}

const CreateProject: React.FC = () => {
    const params = useParams();
    const locale = (params?.locale as string) || "ka";
    const router = useRouter();

    const [activeTab, setActiveTab] = useState<string>("general");
    const [saving, setSaving] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState<ProjectData>({
        title: "",
        shortDescription: "",
        location: "",
        function: "",
        area: "",
        year: "",
        description: [],
        floors: [],
        images: [],
        thumbnail: ""
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleDescriptionChange = (index: number, value: string): void => {
        const updatedDescriptions = [...formData.description];
        updatedDescriptions[index] = value;
        setFormData({
            ...formData,
            description: updatedDescriptions
        });
    };

    const addDescriptionField = (): void => {
        setFormData({
            ...formData,
            description: [...formData.description, ""]
        });
    };

    const removeDescriptionField = (index: number): void => {
        const updatedDescriptions = [...formData.description];
        updatedDescriptions.splice(index, 1);
        setFormData({
            ...formData,
            description: updatedDescriptions
        });
    };

    const handleFloorChange = (index: number, field: keyof Floor, value: string): void => {
        const updatedFloors = [...formData.floors];
        updatedFloors[index] = {
            ...updatedFloors[index],
            [field]: value
        };
        setFormData({
            ...formData,
            floors: updatedFloors
        });
    };

    const handleFloorMeasurementChange = (floorIndex: number, measurementIndex: number, value: string): void => {
        const updatedFloors = [...formData.floors];
        const updatedMeasurements = [...(updatedFloors[floorIndex]?.measurements || [])];

        updatedMeasurements[measurementIndex] = value;

        updatedFloors[floorIndex] = {
            ...updatedFloors[floorIndex],
            measurements: updatedMeasurements
        };

        setFormData({
            ...formData,
            floors: updatedFloors
        });
    };

    const addFloorField = (): void => {
        setFormData({
            ...formData,
            floors: [...formData.floors, { name: "", image: "", measurements: [] }]
        });
    };

    const addFloorMeasurement = (floorIndex: number): void => {
        const updatedFloors = [...formData.floors];

        if (updatedFloors[floorIndex]) {
            updatedFloors[floorIndex] = {
                ...updatedFloors[floorIndex],
                measurements: [...(updatedFloors[floorIndex].measurements || []), ""]
            };

            setFormData({
                ...formData,
                floors: updatedFloors
            });
        }
    };

    const removeFloorField = (index: number): void => {
        const updatedFloors = [...formData.floors];
        updatedFloors.splice(index, 1);
        setFormData({
            ...formData,
            floors: updatedFloors
        });
    };

    const removeFloorMeasurement = (floorIndex: number, measurementIndex: number): void => {
        const updatedFloors = [...formData.floors];

        if (updatedFloors[floorIndex] && updatedFloors[floorIndex].measurements) {
            const updatedMeasurements = [...updatedFloors[floorIndex].measurements];
            updatedMeasurements.splice(measurementIndex, 1);

            updatedFloors[floorIndex] = {
                ...updatedFloors[floorIndex],
                measurements: updatedMeasurements
            };

            setFormData({
                ...formData,
                floors: updatedFloors
            });
        }
    };

    const handleImageUpload = (result: CloudinaryResult): void => {
        const newImage = {
            src: result.info.secure_url,
            alt: `Project image ${formData.images.length + 1}`
        };

        setFormData({
            ...formData,
            images: [...formData.images, newImage]
        });
    };

    const handleThumbnailUpload = (result: CloudinaryResult): void => {
        const newThumbnail = result.info.secure_url;
        setFormData({
            ...formData,
            thumbnail: newThumbnail
        });
    };

    const removeImage = (index: number): void => {
        const updatedImages = [...formData.images];
        updatedImages.splice(index, 1);
        setFormData({
            ...formData,
            images: updatedImages
        });
    };

    const generateProjectId = (title: string): string => {
        // ინგლისურ ენაზე გადაკეთება, ხარვეზების გარეშე ID-თვის
        return title
            .toLowerCase()
            .replace(/\s+/g, '-') // სფეისების დეშით ჩანაცვლება
            .replace(/[^a-z0-9-]/g, '') // მხოლოდ პატარა ასოები, ციფრები და დეფისები
            .replace(/-+/g, '-'); // მრავლობითი დეფისების ერთით ჩანაცვლება
    };

    const handleSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        setSaving(true);

        try {
            // შევამოწმოთ, რომ არსებობს აუცილებელი ველები
            if (!formData.title || !formData.title.trim()) {
                setError("სათაური აუცილებელია");
                setSaving(false);
                return;
            }

            // მოვამზადოთ მონაცემები გასაგზავნად
            const projectId = generateProjectId(formData.title);

            const projectData = {
                id: projectId,
                title: formData.title,
                short_description: formData.shortDescription,
                location: formData.location,
                function: formData.function,
                area: formData.area,
                year: formData.year,
                description: formData.description,
                floors: formData.floors.map(floor => ({
                    name: floor.name,
                    image: floor.image,
                    measurements: floor.measurements
                })),
                images: formData.images,
                thumbnail: formData.thumbnail
            };

            const response = await fetch(`/${locale}/api/projects`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(projectData)
            });

            if (!response.ok) {
                throw new Error("პროექტის შექმნა ვერ მოხერხდა");
            }

            // გადავიდეთ პროექტების სიაში
            router.push("/admin/dashboard/projects");
            router.refresh();
        } catch (err) {
            console.error("Error creating project:", err);
            setError("პროექტის შექმნა ვერ მოხერხდა");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                    <button
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-4"
                        onClick={() => router.push("/admin/dashboard/projects")}
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        უკან დაბრუნება
                    </button>
                    <h1 className="text-2xl font-bold">ახალი პროექტის შექმნა</h1>
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={saving}
                    className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${saving ? 'opacity-75 cursor-not-allowed' : ''}`}
                >
                    {saving ? (
                        <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            შენახვა...
                        </>
                    ) : (
                        <>
                            <Save className="h-4 w-4 mr-2" />
                            შენახვა
                        </>
                    )}
                </button>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                    <strong className="font-bold">შეცდომა!</strong>
                    <span className="block sm:inline"> {error}</span>
                </div>
            )}

            {/* ტაბები */}
            <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab("general")}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === "general"
                            ? "border-blue-500 text-blue-600"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }`}
                    >
                        ძირითადი ინფორმაცია
                    </button>
                    <button
                        onClick={() => setActiveTab("description")}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === "description"
                            ? "border-blue-500 text-blue-600"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }`}
                    >
                        აღწერა
                    </button>
                    <button
                        onClick={() => setActiveTab("floors")}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === "floors"
                            ? "border-blue-500 text-blue-600"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }`}
                    >
                        სართულები
                    </button>
                    <button
                        onClick={() => setActiveTab("images")}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === "images"
                            ? "border-blue-500 text-blue-600"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }`}
                    >
                        სურათები
                    </button>
                </nav>
            </div>

            <form onSubmit={handleSubmit}>
                {/* ძირითადი ინფორმაცია */}
                {activeTab === "general" && (
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                                        სათაური *
                                    </label>
                                    <input
                                        id="title"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        placeholder="შეიყვანეთ პროექტის სათაური"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="shortDescription" className="block text-sm font-medium text-gray-700">
                                        მოკლე აღწერა
                                    </label>
                                    <textarea
                                        id="shortDescription"
                                        name="shortDescription"
                                        value={formData.shortDescription}
                                        onChange={handleInputChange}
                                        placeholder="შეიყვანეთ მოკლე აღწერა"
                                        rows={3}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                                        ადგილმდებარეობა
                                    </label>
                                    <input
                                        id="location"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleInputChange}
                                        placeholder="შეიყვანეთ მდებარეობა"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="function" className="block text-sm font-medium text-gray-700">
                                        ფუნქცია
                                    </label>
                                    <input
                                        id="function"
                                        name="function"
                                        value={formData.function}
                                        onChange={handleInputChange}
                                        placeholder="შეიყვანეთ ფუნქცია"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="area" className="block text-sm font-medium text-gray-700">
                                            ფართობი
                                        </label>
                                        <input
                                            id="area"
                                            name="area"
                                            value={formData.area}
                                            onChange={handleInputChange}
                                            placeholder="მაგ: 400 sqm"
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="year" className="block text-sm font-medium text-gray-700">
                                            წელი
                                        </label>
                                        <input
                                            id="year"
                                            name="year"
                                            value={formData.year}
                                            onChange={handleInputChange}
                                            placeholder="მაგ: 2024"
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6">
                            <label className="block text-sm font-medium text-gray-700">
                                მთავარი სურათი (Thumbnail)
                            </label>
                            <div className="mt-2 flex items-center space-x-4">
                                {formData.thumbnail ? (
                                    <div className="relative">
                                        <img
                                            src={formData.thumbnail}
                                            alt="Thumbnail"
                                            className="h-24 w-40 object-cover rounded-md border"
                                        />
                                        <button
                                            type="button"
                                            className="absolute -top-2 -right-2 h-6 w-6 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                            onClick={() => setFormData({ ...formData, thumbnail: "" })}
                                        >
                                            <Trash className="h-3 w-3" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="h-24 w-40 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center">
                                        <CldUploadWidget
                                            uploadPreset="projects"
                                        // onSuccess={handleThumbnailUpload}
                                        >
                                            {({ open }) => (
                                                <button
                                                    type="button"
                                                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                    onClick={() => open()}
                                                >
                                                    <ImagePlus className="h-4 w-4 mr-2" />
                                                    ატვირთვა
                                                </button>
                                            )}
                                        </CldUploadWidget>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* აღწერა */}
                {activeTab === "description" && (
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium">პროექტის აღწერა</h3>
                            <button
                                type="button"
                                className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                onClick={addDescriptionField}
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                პარაგრაფის დამატება
                            </button>
                        </div>

                        {formData.description.map((desc, index) => (
                            <div key={index} className="mb-4 relative">
                                <textarea
                                    value={desc}
                                    onChange={(e) => handleDescriptionChange(index, e.target.value)}
                                    placeholder={`აღწერის პარაგრაფი ${index + 1}`}
                                    rows={3}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm pr-10"
                                />
                                <button
                                    type="button"
                                    className="absolute top-2 right-2 h-6 w-6 text-red-500 hover:text-red-700 focus:outline-none"
                                    onClick={() => removeDescriptionField(index)}
                                >
                                    <Trash className="h-4 w-4" />
                                </button>
                            </div>
                        ))}

                        {formData.description.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                აღწერის პარაგრაფები არ არის დამატებული. დააკლიკეთ "პარაგრაფის დამატება" ღილაკს.
                            </div>
                        )}
                    </div>
                )}

                {/* სართულები */}
                {activeTab === "floors" && (
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium">სართულები</h3>
                            <button
                                type="button"
                                className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                onClick={addFloorField}
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                სართულის დამატება
                            </button>
                        </div>

                        {formData.floors.map((floor, floorIndex) => (
                            <div key={floorIndex} className="mb-6 p-4 border rounded-md relative">
                                <button
                                    type="button"
                                    className="absolute top-2 right-2 h-6 w-6 text-red-500 hover:text-red-700 focus:outline-none"
                                    onClick={() => removeFloorField(floorIndex)}
                                >
                                    <Trash className="h-4 w-4" />
                                </button>

                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            სართულის სახელი
                                        </label>
                                        <input
                                            value={floor.name}
                                            onChange={(e) => handleFloorChange(floorIndex, "name", e.target.value)}
                                            placeholder="მაგ: პირველი სართული"
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            სართულის სურათი (URL)
                                        </label>
                                        <input
                                            value={floor.image}
                                            onChange={(e) => handleFloorChange(floorIndex, "image", e.target.value)}
                                            placeholder="მაგ: /assets/floor1.png"
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                        />
                                    </div>

                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <label className="block text-sm font-medium text-gray-700">
                                                გაზომვები
                                            </label>
                                            <button
                                                type="button"
                                                className="inline-flex items-center px-2 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                onClick={() => addFloorMeasurement(floorIndex)}
                                            >
                                                <Plus className="h-3 w-3 mr-1" />
                                                დამატება
                                            </button>
                                        </div>

                                        {floor.measurements.map((measurement, measurementIndex) => (
                                            <div key={`m-${floorIndex}-${measurementIndex}`} className="flex items-center mb-2">
                                                <input
                                                    value={measurement}
                                                    onChange={(e) => handleFloorMeasurementChange(floorIndex, measurementIndex, e.target.value)}
                                                    placeholder={`გაზომვა ${measurementIndex + 1}`}
                                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                />
                                                <button
                                                    type="button"
                                                    className="ml-2 text-red-500 hover:text-red-700 focus:outline-none"
                                                    onClick={() => removeFloorMeasurement(floorIndex, measurementIndex)}
                                                >
                                                    <Trash className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ))}

                                        {floor.measurements.length === 0 && (
                                            <div className="text-center py-2 text-gray-500 text-sm">
                                                გაზომვები არ არის დამატებული
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {formData.floors.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                სართულები არ არის დამატებული. დააკლიკეთ "სართულის დამატება" ღილაკს.
                            </div>
                        )}
                    </div>
                )}

                {/* სურათები */}
                {activeTab === "images" && (
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium">პროექტის სურათები</h3>
                            <CldUploadWidget
                                uploadPreset="projects"
                            // onSuccess={handleImageUpload}
                            >
                                {({ open }) => (
                                    <button
                                        type="button"
                                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        onClick={() => open()}
                                    >
                                        <ImagePlus className="h-4 w-4 mr-2" />
                                        სურათის ატვირთვა
                                    </button>
                                )}
                            </CldUploadWidget>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {formData.images.map((img, index) => (
                                <div key={index} className="relative group">
                                    <img
                                        src={img.src}
                                        alt={img.alt}
                                        className="h-40 w-full object-cover rounded-md border"
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity rounded-md flex items-center justify-center">
                                        <button
                                            type="button"
                                            className="h-8 w-8 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                            onClick={() => removeImage(index)}
                                        >
                                            <Trash className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {formData.images.length === 0 && (
                                <div className="col-span-full text-center py-12 border-2 border-dashed border-gray-300 rounded-md text-gray-500">
                                    სურათები არ არის ატვირთული. დააკლიკეთ "სურათის ატვირთვა" ღილაკს.
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
};

export default CreateProject;