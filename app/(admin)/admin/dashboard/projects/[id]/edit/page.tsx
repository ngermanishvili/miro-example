"use client";

import React, {
  useEffect,
  useState,
  use,
  useRef,
  ChangeEvent,
  ReactElement,
} from "react";
import { Project, ProjectLanguageData } from "@/types/project";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CldUploadWidget } from "next-cloudinary";
interface ProjectEditPageProps {
  params: Promise<{
    id: string;
  }>;
}

// Define the Floor type
interface Floor {
  name: string;
  image: string;
  measurements: string[];
  floorImages: { src: string; alt: string }[] | undefined;
}

interface UploadingState {
  [key: string]: boolean;
}

// Type for file input refs
interface FileInputRefs {
  thumbnail: React.RefObject<HTMLInputElement | null>;
  projectImage: React.RefObject<HTMLInputElement | null>;
  floorImage: React.RefObject<HTMLInputElement | null>;
  floorGalleryImage: React.RefObject<HTMLInputElement | null>;
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

  const [uploadingType, setUploadingType] = useState<string | null>(null);
  // Add a new state to track uploads in progress by their unique keys
  const [activeUploads, setActiveUploads] = useState<Record<string, boolean>>(
    {}
  );

  // 3. Add this function to handle successful uploads
  const handleUploadSuccess = (
    result: any,
    uploadType: string,
    index?: number,
    floorIndex?: number,
    imageIndex?: number
  ) => {
    // Get the secure URL from the upload result
    let secureUrl;

    if (result.info && result.info.secure_url) {
      secureUrl = result.info.secure_url;
    } else if (result.secure_url) {
      secureUrl = result.secure_url;
    } else if (typeof result === "string") {
      secureUrl = result;
    } else {
      console.error("Could not find URL in upload result:", result);
      setError("Image upload succeeded but returned an unexpected format.");
      return;
    }

    console.log(`Setting ${uploadType} to URL:`, secureUrl);

    // If project is null, we can't update it
    if (!project) {
      setError("Cannot update image: project data is not loaded.");
      return;
    }

    // Handle each upload type directly without helper functions
    if (uploadType === "thumbnail") {
      setProject((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          ge: { ...prev.ge, thumbnail: secureUrl },
          en: { ...prev.en, thumbnail: secureUrl },
          ru: { ...prev.ru, thumbnail: secureUrl },
        };
      });
    } else if (uploadType === "projectImage" && typeof index === "number") {
      setProject((prev) => {
        if (!prev) return prev;
        const newImages = [...prev.ge.images];
        if (newImages[index]) {
          newImages[index] = { ...newImages[index], src: secureUrl };
        }
        return {
          ...prev,
          ge: { ...prev.ge, images: newImages },
        };
      });
    } else if (uploadType === "floorImage" && typeof floorIndex === "number") {
      setProject((prev) => {
        if (!prev) return prev;
        const newFloors = [...prev.ge.floors];
        if (newFloors[floorIndex]) {
          newFloors[floorIndex] = {
            ...newFloors[floorIndex],
            image: secureUrl,
          };
        }
        return {
          ...prev,
          ge: { ...prev.ge, floors: newFloors },
        };
      });
    } else if (
      uploadType === "floorGalleryImage" &&
      typeof floorIndex === "number" &&
      typeof imageIndex === "number"
    ) {
      setProject((prev) => {
        if (!prev) return prev;
        const newFloors = [...prev.ge.floors];
        if (newFloors[floorIndex] && newFloors[floorIndex].floorImages) {
          const newFloorImages = [...newFloors[floorIndex].floorImages];
          if (newFloorImages[imageIndex]) {
            newFloorImages[imageIndex] = {
              ...newFloorImages[imageIndex],
              src: secureUrl,
            };
          }
          newFloors[floorIndex] = {
            ...newFloors[floorIndex],
            floorImages: newFloorImages,
          };
        }
        return {
          ...prev,
          ge: { ...prev.ge, floors: newFloors },
        };
      });
    }

    // Clear uploading state
    const uploadKey = getUploadKey(uploadType, index, floorIndex, imageIndex);
    setActiveUploads((prev) => {
      const newState = { ...prev };
      delete newState[uploadKey];
      return newState;
    });
  };

  // Helper to generate a unique key for each upload
  const getUploadKey = (
    uploadType: string,
    index?: number,
    floorIndex?: number,
    imageIndex?: number
  ): string => {
    if (uploadType === "thumbnail") return "thumbnail";
    if (uploadType === "projectImage" && typeof index === "number")
      return `projectImage_${index}`;
    if (uploadType === "floorImage" && typeof floorIndex === "number")
      return `floorImage_${floorIndex}`;
    if (
      uploadType === "floorGalleryImage" &&
      typeof floorIndex === "number" &&
      typeof imageIndex === "number"
    )
      return `floorGalleryImage_${floorIndex}_${imageIndex}`;
    return `${uploadType}_unknown`;
  };

  // Track start of upload
  const startUpload = (
    uploadType: string,
    index?: number,
    floorIndex?: number,
    imageIndex?: number
  ) => {
    const key = getUploadKey(uploadType, index, floorIndex, imageIndex);
    setActiveUploads((prev) => ({ ...prev, [key]: true }));
  };

  // Check if upload is in progress
  const isUploading = (
    uploadType: string,
    index?: number,
    floorIndex?: number,
    imageIndex?: number
  ): boolean => {
    const key = getUploadKey(uploadType, index, floorIndex, imageIndex);
    return !!activeUploads[key];
  };

  const fileInputRefs: FileInputRefs = {
    thumbnail: useRef<HTMLInputElement | null>(null),
    projectImage: useRef<HTMLInputElement | null>(null),
    floorImage: useRef<HTMLInputElement | null>(null),
    floorGalleryImage: useRef<HTMLInputElement | null>(null),
  };

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/projects/${id}`);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("პროექტი ვერ მოიძებნა");
          }
          throw new Error("პროექტის ჩატვირთვა ვერ მოხერხდა");
        }

        const data = await response.json();
        setProject(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "უცნობი შეცდომა");
        console.error("Error fetching project:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const handleInputChange = (
    language: "ge" | "en" | "ru",
    field: string,
    value: string
  ) => {
    if (!project) return;

    setProject({
      ...project,
      [language]: {
        ...project[language],
        [field]: value,
      },
    });
  };

  const handleThumbnailChange = (value: string) => {
    if (!project) return;

    // Update thumbnail in all language objects to maintain consistency
    setProject({
      ...project,
      ge: {
        ...project.ge,
        thumbnail: value,
      },
      en: {
        ...project.en,
        thumbnail: value,
      },
      ru: {
        ...project.ru,
        thumbnail: value,
      },
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
        description: updatedDescription,
      },
    });
  };

  const addDescriptionParagraph = () => {
    if (!project) return;

    setProject({
      ...project,
      ge: {
        ...project.ge,
        description: [...project.ge.description, ""],
      },
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
        description: updatedDescription,
      },
    });
  };

  const handleImageChange = (
    index: number,
    field: "src" | "alt",
    value: string
  ) => {
    if (!project) return;

    const updatedImages = [...project.ge.images];
    updatedImages[index] = {
      ...updatedImages[index],
      [field]: value,
    };

    setProject({
      ...project,
      ge: {
        ...project.ge,
        images: updatedImages,
      },
    });
  };

  const addImage = () => {
    if (!project) return;

    setProject({
      ...project,
      ge: {
        ...project.ge,
        images: [...project.ge.images, { src: "", alt: "" }],
      },
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
        images: updatedImages,
      },
    });
  };

  const handleSave = async () => {
    if (!project) return;

    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(project),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "პროექტის განახლება ვერ მოხერხდა");
      }

      setSuccessMessage("პროექტი წარმატებით განახლდა");
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "პროექტის განახლება ვერ მოხერხდა"
      );
      console.error("Error saving project:", err);
    } finally {
      setSaving(false);
    }
  };

  // Add UI components and logic for editing floors
  const handleFloorChange = (
    index: number,
    field: keyof Floor,
    value: string
  ) => {
    if (!project) return;

    const updatedFloors = [...project.ge.floors];
    updatedFloors[index] = {
      ...updatedFloors[index],
      [field]: value,
    };

    setProject({
      ...project,
      ge: {
        ...project.ge,
        floors: updatedFloors,
      },
    });
  };

  const handleFloorMeasurementChange = (
    floorIndex: number,
    measurementIndex: number,
    value: string
  ) => {
    if (!project) return;

    const updatedFloors = [...project.ge.floors];
    const updatedMeasurements = [
      ...(updatedFloors[floorIndex]?.measurements || []),
    ];

    updatedMeasurements[measurementIndex] = value;

    updatedFloors[floorIndex] = {
      ...updatedFloors[floorIndex],
      measurements: updatedMeasurements,
    };

    setProject({
      ...project,
      ge: {
        ...project.ge,
        floors: updatedFloors,
      },
    });
  };

  const addFloor = () => {
    if (!project) return;

    setProject({
      ...project,
      ge: {
        ...project.ge,
        floors: [
          ...project.ge.floors,
          { name: "", image: "", measurements: [], floorImages: [] },
        ],
      },
    });
  };

  const removeFloor = (index: number) => {
    if (!project) return;

    const updatedFloors = [...project.ge.floors];
    updatedFloors.splice(index, 1);

    setProject({
      ...project,
      ge: {
        ...project.ge,
        floors: updatedFloors,
      },
    });
  };

  const addFloorMeasurement = (floorIndex: number) => {
    if (!project) return;

    const updatedFloors = [...project.ge.floors];

    if (updatedFloors[floorIndex]) {
      updatedFloors[floorIndex] = {
        ...updatedFloors[floorIndex],
        measurements: [...(updatedFloors[floorIndex].measurements || []), ""],
      };

      setProject({
        ...project,
        ge: {
          ...project.ge,
          floors: updatedFloors,
        },
      });
    }
  };

  const removeFloorMeasurement = (
    floorIndex: number,
    measurementIndex: number
  ) => {
    if (!project) return;

    const updatedFloors = [...project.ge.floors];

    if (updatedFloors[floorIndex] && updatedFloors[floorIndex].measurements) {
      const updatedMeasurements = [...updatedFloors[floorIndex].measurements];
      updatedMeasurements.splice(measurementIndex, 1);

      updatedFloors[floorIndex] = {
        ...updatedFloors[floorIndex],
        measurements: updatedMeasurements,
      };

      setProject({
        ...project,
        ge: {
          ...project.ge,
          floors: updatedFloors,
        },
      });
    }
  };

  const handleFloorImageChange = (
    floorIndex: number,
    imageIndex: number,
    field: "src" | "alt",
    value: string
  ) => {
    if (!project) return;

    const updatedFloors = [...project.ge.floors];
    const updatedFloorImages = [
      ...(updatedFloors[floorIndex]?.floorImages || [{ src: "", alt: "" }]),
    ];

    updatedFloorImages[imageIndex] = {
      ...updatedFloorImages[imageIndex],
      [field]: value,
    };

    updatedFloors[floorIndex] = {
      ...updatedFloors[floorIndex],
      floorImages: updatedFloorImages,
    };

    setProject({
      ...project,
      ge: {
        ...project.ge,
        floors: updatedFloors,
      },
    });
  };

  const addFloorImage = (floorIndex: number) => {
    if (!project) return;

    const updatedFloors = [...project.ge.floors];

    if (updatedFloors[floorIndex]) {
      updatedFloors[floorIndex] = {
        ...updatedFloors[floorIndex],
        floorImages: [
          ...(updatedFloors[floorIndex].floorImages || []),
          { src: "", alt: "" },
        ],
      };

      setProject({
        ...project,
        ge: {
          ...project.ge,
          floors: updatedFloors,
        },
      });
    }
  };

  const removeFloorImage = (floorIndex: number, imageIndex: number) => {
    if (!project) return;

    const updatedFloors = [...project.ge.floors];

    if (updatedFloors[floorIndex] && updatedFloors[floorIndex].floorImages) {
      const updatedFloorImages = [...updatedFloors[floorIndex].floorImages];
      updatedFloorImages.splice(imageIndex, 1);

      updatedFloors[floorIndex] = {
        ...updatedFloors[floorIndex],
        floorImages: updatedFloorImages,
      };

      setProject({
        ...project,
        ge: {
          ...project.ge,
          floors: updatedFloors,
        },
      });
    }
  };

  // Function to trigger file input click
  const triggerFileInput = (refKey: keyof FileInputRefs): void => {
    if (fileInputRefs[refKey].current) {
      fileInputRefs[refKey].current.click();
    }
  };
  const renderThumbnailUpload = (): ReactElement => (
    <div>
      <label className="block text-gray-700 font-bold mb-2" htmlFor="thumbnail">
        სათაური სურათი (Thumbnail)
      </label>
      <div className="flex space-x-2 items-center">
        <input
          type="text"
          id="thumbnail"
          value={project?.ge.thumbnail || ""}
          onChange={(e) => handleThumbnailChange(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        <CldUploadWidget
          uploadPreset="draftwork123" // Create this preset in your Cloudinary dashboard
          onSuccess={(result) => handleUploadSuccess(result, "thumbnail")}
          options={{
            maxFiles: 1,
            resourceType: "image",
          }}
          onOpen={() => startUpload("thumbnail")}
        >
          {({ open }) => {
            return (
              <button
                type="button"
                onClick={() => open()}
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded flex-shrink-0"
                disabled={isUploading("thumbnail")}
              >
                {isUploading("thumbnail") ? "იტვირთება..." : "ატვირთვა"}
              </button>
            );
          }}
        </CldUploadWidget>
      </div>
      {project?.ge.thumbnail && (
        <div className="mt-2 max-w-xs">
          <img
            src={project.ge.thumbnail}
            alt="Thumbnail preview"
            className="max-h-32 object-contain border rounded"
          />
        </div>
      )}
    </div>
  );

  // 2. For project images
  const renderImageUpload = (
    image: { src: string; alt: string },
    index: number
  ): ReactElement => (
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
          <div className="flex space-x-2 items-center">
            <input
              type="text"
              value={image.src}
              onChange={(e) => handleImageChange(index, "src", e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            <CldUploadWidget
              uploadPreset="draftwork123"
              onSuccess={(result) =>
                handleUploadSuccess(result, "projectImage", index)
              }
              options={{
                maxFiles: 1,
                resourceType: "image",
              }}
              onOpen={() => startUpload("projectImage", index)}
            >
              {({ open }) => {
                return (
                  <button
                    type="button"
                    onClick={() => open()}
                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded flex-shrink-0"
                    disabled={isUploading("projectImage", index)}
                  >
                    {isUploading("projectImage", index) ? "..." : "ატვირთვა"}
                  </button>
                );
              }}
            </CldUploadWidget>
          </div>
        </div>
        <div>
          <label className="block text-gray-700 font-bold mb-2">
            სურათის აღწერა
          </label>
          <input
            type="text"
            value={image.alt}
            onChange={(e) => handleImageChange(index, "alt", e.target.value)}
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
  );

  // 3. For floor main image
  const renderFloorImageUpload = (
    floor: Floor,
    floorIndex: number
  ): ReactElement => (
    <div>
      <label className="block text-gray-700 font-bold mb-2">
        სურათის მისამართი
      </label>
      <div className="flex space-x-2 items-center">
        <input
          type="text"
          value={floor.image}
          onChange={(e) =>
            handleFloorChange(floorIndex, "image", e.target.value)
          }
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        <CldUploadWidget
          uploadPreset="draftwork123"
          onSuccess={(result) =>
            handleUploadSuccess(result, "floorImage", undefined, floorIndex)
          }
          options={{
            maxFiles: 1,
            resourceType: "image",
          }}
          onOpen={() => startUpload("floorImage", undefined, floorIndex)}
        >
          {({ open }) => {
            return (
              <button
                type="button"
                onClick={() => open()}
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded flex-shrink-0"
                disabled={isUploading("floorImage", undefined, floorIndex)}
              >
                {isUploading("floorImage", undefined, floorIndex)
                  ? "იტვირთება..."
                  : "ატვირთვა"}
              </button>
            );
          }}
        </CldUploadWidget>
      </div>
      {floor.image && (
        <div className="mt-2 max-w-xs">
          <img
            src={floor.image}
            alt="Floor plan"
            className="max-h-32 object-contain border rounded"
          />
        </div>
      )}
    </div>
  );

  // 4. For floor gallery images
  const renderFloorGalleryImageUpload = (
    floor: Floor,
    floorIndex: number,
    image: { src: string; alt: string },
    imageIndex: number
  ): ReactElement => (
    <div key={imageIndex} className="flex items-center mb-2">
      <div className="flex-grow grid grid-cols-3 gap-2">
        <div className="col-span-2 flex items-center space-x-2">
          <input
            type="text"
            value={image.src}
            onChange={(e) =>
              handleFloorImageChange(
                floorIndex,
                imageIndex,
                "src",
                e.target.value
              )
            }
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          <CldUploadWidget
            uploadPreset="draftwork123"
            onSuccess={(result) =>
              handleUploadSuccess(
                result,
                "floorGalleryImage",
                undefined,
                floorIndex,
                imageIndex
              )
            }
            options={{
              maxFiles: 1,
              resourceType: "image",
            }}
            onOpen={() =>
              startUpload(
                "floorGalleryImage",
                undefined,
                floorIndex,
                imageIndex
              )
            }
          >
            {({ open }) => {
              return (
                <button
                  type="button"
                  onClick={() => open()}
                  className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded flex-shrink-0"
                  disabled={isUploading(
                    "floorGalleryImage",
                    undefined,
                    floorIndex,
                    imageIndex
                  )}
                >
                  {isUploading(
                    "floorGalleryImage",
                    undefined,
                    floorIndex,
                    imageIndex
                  )
                    ? "..."
                    : "ატვირთვა"}
                </button>
              );
            }}
          </CldUploadWidget>
        </div>
        <input
          type="text"
          value={image.alt}
          onChange={(e) =>
            handleFloorImageChange(
              floorIndex,
              imageIndex,
              "alt",
              e.target.value
            )
          }
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Alt text"
        />
      </div>
      {image.src && (
        <div className="w-12 h-12 mx-2 bg-gray-100 overflow-hidden rounded flex-shrink-0">
          <img
            src={image.src}
            alt={image.alt || "Floor image"}
            className="object-cover w-full h-full"
          />
        </div>
      )}
      <button
        onClick={() => removeFloorImage(floorIndex, imageIndex)}
        className="ml-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded"
      >
        X
      </button>
    </div>
  );

  // Use direct type assertion for render functions
  const safeRenderFloorImageUpload = (
    floor: any,
    floorIndex: number
  ): ReactElement => renderFloorImageUpload(floor as Floor, floorIndex);

  const safeRenderFloorGalleryImageUpload = (
    floor: any,
    floorIndex: number,
    image: { src: string; alt: string },
    imageIndex: number
  ): ReactElement =>
    renderFloorGalleryImageUpload(
      floor as Floor,
      floorIndex,
      image,
      imageIndex
    );

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
          <p>{error || "პროექტი ვერ მოიძებნა"}</p>
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
          <h1 className="text-3xl font-bold">
            პროექტის რედაქტირება: {project.ge.title}
          </h1>
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
            className={`${
              saving
                ? "bg-green-300 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600"
            } text-white py-2 px-4 rounded`}
          >
            {saving ? "ინახება..." : "შენახვა"}
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
            <p className="text-sm text-gray-500 mt-1">
              ID ცვლილებას არ ექვემდებარება
            </p>
          </div>
          {renderThumbnailUpload()}
        </div>
      </div>

      {/* ქართული ენის ინფორმაცია */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">ქართული ენის ინფორმაცია</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="ge-title"
            >
              სათაური (ქართულად)
            </label>
            <input
              type="text"
              id="ge-title"
              value={project.ge.title}
              onChange={(e) => handleInputChange("ge", "title", e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div>
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="ge-location"
            >
              მდებარეობა (ქართულად)
            </label>
            <input
              type="text"
              id="ge-location"
              value={project.ge.location}
              onChange={(e) =>
                handleInputChange("ge", "location", e.target.value)
              }
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div>
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="ge-function"
            >
              ფუნქცია (ქართულად)
            </label>
            <input
              type="text"
              id="ge-function"
              value={project.ge.function}
              onChange={(e) =>
                handleInputChange("ge", "function", e.target.value)
              }
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div>
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="ge-area"
            >
              ფართობი (ქართულად)
            </label>
            <input
              type="text"
              id="ge-area"
              value={project.ge.area}
              onChange={(e) => handleInputChange("ge", "area", e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div>
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="ge-year"
            >
              წელი (ქართულად)
            </label>
            <input
              type="text"
              id="ge-year"
              value={project.ge.year}
              onChange={(e) => handleInputChange("ge", "year", e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div>
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="ge-shortDescription"
            >
              მოკლე აღწერა (ქართულად)
            </label>
            <textarea
              id="ge-shortDescription"
              value={project.ge.shortDescription}
              onChange={(e) =>
                handleInputChange("ge", "shortDescription", e.target.value)
              }
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
                  onChange={(e) =>
                    handleDescriptionChange(index, e.target.value)
                  }
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
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="en-title"
            >
              სათაური (ინგლისურად)
            </label>
            <input
              type="text"
              id="en-title"
              value={project.en.title}
              onChange={(e) => handleInputChange("en", "title", e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div>
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="en-location"
            >
              მდებარეობა (ინგლისურად)
            </label>
            <input
              type="text"
              id="en-location"
              value={project.en.location}
              onChange={(e) =>
                handleInputChange("en", "location", e.target.value)
              }
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div>
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="en-function"
            >
              ფუნქცია (ინგლისურად)
            </label>
            <input
              type="text"
              id="en-function"
              value={project.en.function}
              onChange={(e) =>
                handleInputChange("en", "function", e.target.value)
              }
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div>
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="en-area"
            >
              ფართობი (ინგლისურად)
            </label>
            <input
              type="text"
              id="en-area"
              value={project.en.area}
              onChange={(e) => handleInputChange("en", "area", e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div>
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="en-year"
            >
              წელი (ინგლისურად)
            </label>
            <input
              type="text"
              id="en-year"
              value={project.en.year}
              onChange={(e) => handleInputChange("en", "year", e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div>
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="en-shortDescription"
            >
              მოკლე აღწერა (ინგლისურად)
            </label>
            <textarea
              id="en-shortDescription"
              value={project.en.shortDescription}
              onChange={(e) =>
                handleInputChange("en", "shortDescription", e.target.value)
              }
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
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="ru-title"
            >
              სათაური (რუსულად)
            </label>
            <input
              type="text"
              id="ru-title"
              value={project.ru.title}
              onChange={(e) => handleInputChange("ru", "title", e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div>
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="ru-location"
            >
              მდებარეობა (რუსულად)
            </label>
            <input
              type="text"
              id="ru-location"
              value={project.ru.location}
              onChange={(e) =>
                handleInputChange("ru", "location", e.target.value)
              }
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div>
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="ru-function"
            >
              ფუნქცია (რუსულად)
            </label>
            <input
              type="text"
              id="ru-function"
              value={project.ru.function}
              onChange={(e) =>
                handleInputChange("ru", "function", e.target.value)
              }
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div>
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="ru-area"
            >
              ფართობი (რუსულად)
            </label>
            <input
              type="text"
              id="ru-area"
              value={project.ru.area}
              onChange={(e) => handleInputChange("ru", "area", e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div>
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="ru-year"
            >
              წელი (რუსულად)
            </label>
            <input
              type="text"
              id="ru-year"
              value={project.ru.year}
              onChange={(e) => handleInputChange("ru", "year", e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div>
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="ru-shortDescription"
            >
              მოკლე აღწერა (რუსულად)
            </label>
            <textarea
              id="ru-shortDescription"
              value={project.ru.shortDescription}
              onChange={(e) =>
                handleInputChange("ru", "shortDescription", e.target.value)
              }
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
          {project.ge.images.map((image, index) =>
            renderImageUpload(image, index)
          )}
          {/* <button
            onClick={addImage}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
          >
            სურათის დამატება
          </button> */}
        </div>
      </div>

      {/* სართულების რედაქტირება */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">სართულების რედაქტირება</h2>
        {project.ge.floors.map((floor, floorIndex) => (
          <div key={floorIndex} className="mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 font-bold mb-2">
                  სართულის სახელი
                </label>
                <input
                  type="text"
                  value={floor.name}
                  onChange={(e) =>
                    handleFloorChange(floorIndex, "name", e.target.value)
                  }
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-2">
                  სურათის მისამართი
                </label>
                <div className="flex space-x-2 items-center">
                  <input
                    type="text"
                    value={floor.image}
                    onChange={(e) =>
                      handleFloorChange(floorIndex, "image", e.target.value)
                    }
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                  <CldUploadWidget
                    uploadPreset="draftwork123"
                    onSuccess={(result) =>
                      handleUploadSuccess(
                        result,
                        "floorImage",
                        undefined,
                        floorIndex
                      )
                    }
                    options={{
                      maxFiles: 1,
                      resourceType: "image",
                    }}
                    onOpen={() =>
                      startUpload("floorImage", undefined, floorIndex)
                    }
                  >
                    {({ open }) => {
                      return (
                        <button
                          type="button"
                          onClick={() => open()}
                          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded flex-shrink-0"
                          disabled={isUploading(
                            "floorImage",
                            undefined,
                            floorIndex
                          )}
                        >
                          {isUploading("floorImage", undefined, floorIndex)
                            ? "იტვირთება..."
                            : "ატვირთვა"}
                        </button>
                      );
                    }}
                  </CldUploadWidget>
                </div>
                {floor.image && (
                  <div className="mt-2 max-w-xs">
                    <img
                      src={floor.image}
                      alt="Floor plan"
                      className="max-h-32 object-contain border rounded"
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">
                ზომები
              </label>
              {floor.measurements.map((measurement, measurementIndex) => (
                <div key={measurementIndex} className="flex items-center mb-2">
                  <input
                    type="text"
                    value={measurement}
                    onChange={(e) =>
                      handleFloorMeasurementChange(
                        floorIndex,
                        measurementIndex,
                        e.target.value
                      )
                    }
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                  <button
                    onClick={() =>
                      removeFloorMeasurement(floorIndex, measurementIndex)
                    }
                    className="ml-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded"
                  >
                    X
                  </button>
                </div>
              ))}
              <button
                onClick={() => addFloorMeasurement(floorIndex)}
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
              >
                ზომის დამატება
              </button>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">
                სართულის სურათები
              </label>
              {(floor.floorImages || []).map((image, imageIndex) =>
                safeRenderFloorGalleryImageUpload(
                  floor,
                  floorIndex,
                  image,
                  imageIndex
                )
              )}
              <button
                onClick={() => addFloorImage(floorIndex)}
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
              >
                სურათის დამატება
              </button>
            </div>
            <button
              onClick={() => removeFloor(floorIndex)}
              className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
            >
              სართულის წაშლა
            </button>
          </div>
        ))}
        <button
          onClick={addFloor}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
        >
          სართულის დამატება
        </button>
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
          className={`${
            saving
              ? "bg-green-300 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600"
          } text-white py-2 px-4 rounded`}
        >
          {saving ? "ინახება..." : "შენახვა"}
        </button>
      </div>
    </div>
  );
};

export default ProjectEditPage;
