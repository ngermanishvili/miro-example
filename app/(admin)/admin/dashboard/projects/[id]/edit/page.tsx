"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { CldUploadWidget } from "next-cloudinary";
import {
  ArrowLeft,
  ImagePlus,
  Loader2,
  Plus,
  Save,
  Trash,
} from "lucide-react";

// Type definitions
interface ProjectData {
  id?: number;
  title: string;
  shortDescription: string;
  location: string;
  function: string;
  area: string;
  year: string;
  description: string[];
  floors: Floor[];
  images: string[];
  thumbnail: string;
}

interface Project extends ProjectData {
  id: number;
}

interface Floor {
  title: string;
  description: string;
}

interface CloudinaryResult {
  info: {
    secure_url: string;
  };
}

interface Params {
  id?: string;
  locale?: string;
}

const EditProject: React.FC = () => {
  const router = useRouter();
  const params = useParams() as Params;
  const projectId = params?.id;
  const locale = params?.locale || "ka";

  // State
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("general");
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
    thumbnail: "",
  });

  useEffect(() => {
    const fetchProject = async (): Promise<void> => {
      if (!projectId) return;

      try {
        setLoading(true);
        const response = await fetch(`/${locale}/api/projects/${projectId}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch project: ${response.status}`);
        }

        const data: Project = await response.json();
        setProject(data);
        setFormData({
          title: data.title || "",
          shortDescription: data.shortDescription || "",
          location: data.location || "",
          function: data.function || "",
          area: data.area || "",
          year: data.year || "",
          description: Array.isArray(data.description) ? data.description : [],
          floors: Array.isArray(data.floors) ? data.floors : [],
          images: Array.isArray(data.images) ? data.images : [],
          thumbnail: data.thumbnail || "",
        });
      } catch (err) {
        console.error("Error fetching project:", err);
        setError("პროექტის ჩატვირთვა ვერ მოხერხდა");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId, locale]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDescriptionChange = (index: number, value: string): void => {
    const updatedDescriptions = [...formData.description];
    updatedDescriptions[index] = value;
    setFormData({
      ...formData,
      description: updatedDescriptions,
    });
  };

  const addDescriptionField = (): void => {
    setFormData({
      ...formData,
      description: [...formData.description, ""],
    });
  };

  const removeDescriptionField = (index: number): void => {
    const updatedDescriptions = [...formData.description];
    updatedDescriptions.splice(index, 1);
    setFormData({
      ...formData,
      description: updatedDescriptions,
    });
  };

  const handleFloorChange = (index: number, field: keyof Floor, value: string): void => {
    const updatedFloors = [...formData.floors];
    updatedFloors[index] = {
      ...updatedFloors[index],
      [field]: value,
    };
    setFormData({
      ...formData,
      floors: updatedFloors,
    });
  };

  const addFloorField = (): void => {
    setFormData({
      ...formData,
      floors: [...formData.floors, { title: "", description: "" }],
    });
  };

  const removeFloorField = (index: number): void => {
    const updatedFloors = [...formData.floors];
    updatedFloors.splice(index, 1);
    setFormData({
      ...formData,
      floors: updatedFloors,
    });
  };

  const handleImageUpload = (result: CloudinaryResult): void => {
    const newImage = result.info.secure_url;
    setFormData({
      ...formData,
      images: [...formData.images, newImage],
    });
  };

  const handleThumbnailUpload = (result: CloudinaryResult): void => {
    const newThumbnail = result.info.secure_url;
    setFormData({
      ...formData,
      thumbnail: newThumbnail,
    });
  };

  const removeImage = (index: number): void => {
    const updatedImages = [...formData.images];
    updatedImages.splice(index, 1);
    setFormData({
      ...formData,
      images: updatedImages,
    });
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(`/${locale}/api/projects/${projectId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          short_description: formData.shortDescription,
          location: formData.location,
          function: formData.function,
          area: formData.area,
          year: formData.year,
          description: formData.description,
          floors: formData.floors,
          images: formData.images,
          thumbnail: formData.thumbnail,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update project");
      }

      // Navigate back to projects dashboard
      router.push("/admin/dashboard/projects");
      router.refresh();
    } catch (err) {
      console.error("Error updating project:", err);
      setError("პროექტის განახლება ვერ მოხერხდა");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2">პროექტის ჩატვირთვა...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <strong className="font-bold">შეცდომა!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
        <button
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          onClick={() => router.push("/admin/dashboard/projects")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          უკან დაბრუნება
        </button>
      </div>
    );
  }

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
          <h1 className="text-2xl font-bold">პროექტის რედაქტირება</h1>
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

      {/* Custom Tabs */}
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

      <form>
        {/* General Information Tab */}
        {activeTab === "general" && (
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    სათაური
                  </label>
                  <input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="შეიყვანეთ პროექტის სათაური"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
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
                      ფართობი (მ²)
                    </label>
                    <input
                      id="area"
                      name="area"
                      type="number"
                      value={formData.area}
                      onChange={handleInputChange}
                      placeholder="შეიყვანეთ ფართობი"
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
                      type="number"
                      value={formData.year}
                      onChange={handleInputChange}
                      placeholder="შეიყვანეთ წელი"
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

        {/* Description Tab */}
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
                დამატება
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
                აღწერის ტექსტი არ არის დამატებული. დააკლიკეთ "დამატება" ღილაკს.
              </div>
            )}
          </div>
        )}

        {/* Floors Tab */}
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

            {formData.floors.map((floor, index) => (
              <div key={index} className="mb-6 p-4 border rounded-md relative">
                <button
                  type="button"
                  className="absolute top-2 right-2 h-6 w-6 text-red-500 hover:text-red-700 focus:outline-none"
                  onClick={() => removeFloorField(index)}
                >
                  <Trash className="h-4 w-4" />
                </button>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      სართულის სახელი
                    </label>
                    <input
                      value={floor.title || ""}
                      onChange={(e) => handleFloorChange(index, "title", e.target.value)}
                      placeholder="მაგ: პირველი სართული"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      სართულის აღწერა
                    </label>
                    <textarea
                      value={floor.description || ""}
                      onChange={(e) => handleFloorChange(index, "description", e.target.value)}
                      placeholder="სართულის აღწერა"
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
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

        {/* Images Tab */}
        {activeTab === "images" && (
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">პროექტის სურათები</h3>
              <CldUploadWidget uploadPreset="projects" >
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
                    src={img}
                    alt={`Project image ${index + 1}`}
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

export default EditProject;