// app/(admin)/admin/dashboard/projects/new/page.tsx
"use client";

import React, { useState } from "react";
import { Project, ProjectLanguageData } from "@/types/project";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CldUploadWidget } from "next-cloudinary";

const NewProjectPage = () => {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [projectId, setProjectId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [activeUploads, setActiveUploads] = useState<Record<string, boolean>>(
    {}
  );

  // Helper to generate a unique key for each upload
  const getUploadKey = (uploadType: string, index?: number): string => {
    if (uploadType === "thumbnail") return "thumbnail";
    if (uploadType === "projectImage" && typeof index === "number")
      return `projectImage_${index}`;
    return `${uploadType}_unknown`;
  };

  // Track start of upload
  const startUpload = (uploadType: string, index?: number) => {
    const key = getUploadKey(uploadType, index);
    setActiveUploads((prev) => ({ ...prev, [key]: true }));
  };

  // Check if upload is in progress
  const isUploading = (uploadType: string, index?: number): boolean => {
    const key = getUploadKey(uploadType, index);
    return !!activeUploads[key];
  };

  // Handle successful uploads
  const handleUploadSuccess = (
    result: any,
    uploadType: string,
    index?: number
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

    // Update project with the new image URL
    if (uploadType === "thumbnail") {
      setProject((prev) => ({
        ...prev,
        ge: { ...prev.ge, thumbnail: secureUrl },
        en: { ...prev.en, thumbnail: secureUrl },
        ru: { ...prev.ru, thumbnail: secureUrl },
      }));
    } else if (uploadType === "projectImage" && typeof index === "number") {
      setProject((prev) => {
        const newProject = { ...prev };
        // Update in all languages
        newProject.ge.images[index] = {
          ...newProject.ge.images[index],
          src: secureUrl,
        };
        newProject.en.images[index] = {
          ...newProject.en.images[index],
          src: secureUrl,
        };
        newProject.ru.images[index] = {
          ...newProject.ru.images[index],
          src: secureUrl,
        };
        return newProject;
      });
    }

    // Clear uploading state
    const uploadKey = getUploadKey(uploadType, index);
    setActiveUploads((prev) => {
      const newState = { ...prev };
      delete newState[uploadKey];
      return newState;
    });
  };

  // საწყისი პროექტის შაბლონი
  const emptyProject: Project = {
    id: "",
    ge: {
      title: "",
      shortDescription: "",
      location: "",
      function: "",
      area: "",
      year: "",
      description: [""],
      floors: [
        {
          name: "",
          image: null,
          measurements: [""],
        },
      ],
      images: [
        {
          src: null,
          alt: "",
        },
      ],
      thumbnail: null,
    },
    en: {
      title: "",
      shortDescription: "",
      location: "",
      function: "",
      area: "",
      year: "",
      description: [""],
      floors: [
        {
          name: "",
          image: null,
          measurements: [""],
        },
      ],
      images: [
        {
          src: null,
          alt: "",
        },
      ],
      thumbnail: null,
    },
    ru: {
      title: "",
      shortDescription: "",
      location: "",
      function: "",
      area: "",
      year: "",
      description: [""],
      floors: [
        {
          name: "",
          image: null,
          measurements: [""],
        },
      ],
      images: [
        {
          src: null,
          alt: "",
        },
      ],
      thumbnail: null,
    },
  };

  const [project, setProject] = useState<Project>(emptyProject);

  const handleInputChange = (field: string, value: string) => {
    setProjectId(
      value
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]/g, "")
    );
    setProject((prev) => ({
      ...prev,
      id: value
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]/g, ""),
    }));
  };

  const handleSave = async () => {
    if (!projectId.trim()) {
      setError(
        "პროექტის ID ცარიელია. გთხოვთ შეიყვანოთ პროექტის სახელი ინგლისურად."
      );
      return;
    }

    setSaving(true);
    setError(null);

    try {
      // Update the project one last time to ensure ID is set
      const projectToSave = {
        ...project,
        id: projectId,
      };

      // Send the project data to the API
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(projectToSave),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "პროექტის შექმნა ვერ მოხერხდა");
      }

      // Redirect to the edit page after successful creation
      router.push(`/admin/dashboard/projects/${projectId}/edit`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "პროექტის შექმნა ვერ მოხერხდა"
      );
      console.error("Error creating project:", err);
    } finally {
      setSaving(false);
    }
  };

  // Function to handle image alt text changes
  const handleImageAltChange = (index: number, value: string) => {
    setProject((prev) => {
      const newProject = { ...prev };
      // Update in all languages
      newProject.ge.images[index] = {
        ...newProject.ge.images[index],
        alt: value,
      };
      newProject.en.images[index] = {
        ...newProject.en.images[index],
        alt: value,
      };
      newProject.ru.images[index] = {
        ...newProject.ru.images[index],
        alt: value,
      };
      return newProject;
    });
  };

  // Function to add a new image
  const addImage = () => {
    setProject((prev) => {
      const newImage = { src: null, alt: "" };
      return {
        ...prev,
        ge: { ...prev.ge, images: [...prev.ge.images, newImage] },
        en: { ...prev.en, images: [...prev.en.images, newImage] },
        ru: { ...prev.ru, images: [...prev.ru.images, newImage] },
      };
    });
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
          className={`${
            saving || !projectId.trim()
              ? "bg-green-300 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600"
          } text-white py-2 px-4 rounded`}
        >
          {saving ? "ინახება..." : "შექმნა"}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p>{error}</p>
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">
          პროექტის საიდენტიფიკაციო ინფორმაცია
        </h2>
        <div className="mb-6">
          <label
            className="block text-gray-700 font-bold mb-2"
            htmlFor="project-title"
          >
            პროექტის სახელი (ინგლისურად)
          </label>
          <input
            type="text"
            id="project-title"
            placeholder="მაგ: Modern Villa"
            value={project.en.title}
            onChange={(e) => {
              handleInputChange("en.title", e.target.value);
              setProject((prev) => ({
                ...prev,
                en: {
                  ...prev.en,
                  title: e.target.value,
                },
              }));
            }}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          <p className="text-sm text-gray-500 mt-1">
            პროექტის სახელზე დაყრდნობით შეიქმნება პროექტის ID:{" "}
            <strong>{projectId || "project-id"}</strong>
          </p>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">დაიწყეთ პროექტის შექმნა</h2>
        <p className="mb-4">
          შეავსეთ თუნდაც მინიმალური ინფორმაცია პროექტის შესახებ, რომ შევქმნათ
          საწყისი ვერსია. შემდეგ შეგიძლიათ დაამატოთ მეტი დეტალი რედაქტირების
          გვერდზე.
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
                  onChange={(e) =>
                    setProject((prev) => ({
                      ...prev,
                      ge: {
                        ...prev.ge,
                        title: e.target.value,
                      },
                    }))
                  }
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
                  onChange={(e) =>
                    setProject((prev) => ({
                      ...prev,
                      ge: {
                        ...prev.ge,
                        shortDescription: e.target.value,
                      },
                    }))
                  }
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
                    handleInputChange("en.title", e.target.value);
                    setProject((prev) => ({
                      ...prev,
                      en: {
                        ...prev.en,
                        title: e.target.value,
                      },
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
                  onChange={(e) =>
                    setProject((prev) => ({
                      ...prev,
                      en: {
                        ...prev.en,
                        shortDescription: e.target.value,
                      },
                    }))
                  }
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
                  onChange={(e) =>
                    setProject((prev) => ({
                      ...prev,
                      ru: {
                        ...prev.ru,
                        title: e.target.value,
                      },
                    }))
                  }
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
                  onChange={(e) =>
                    setProject((prev) => ({
                      ...prev,
                      ru: {
                        ...prev.ru,
                        shortDescription: e.target.value,
                      },
                    }))
                  }
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
                  onChange={(e) =>
                    setProject((prev) => ({
                      ...prev,
                      ge: {
                        ...prev.ge,
                        location: e.target.value,
                      },
                    }))
                  }
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
                    setProject((prev) => ({
                      ...prev,
                      ge: {
                        ...prev.ge,
                        year,
                      },
                      en: {
                        ...prev.en,
                        year,
                      },
                      ru: {
                        ...prev.ru,
                        year,
                      },
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
                <div className="flex space-x-2 items-center">
                  <input
                    type="text"
                    value={project.ge.thumbnail || ""}
                    onChange={(e) => {
                      const thumbnail = e.target.value || null;
                      setProject((prev) => ({
                        ...prev,
                        ge: {
                          ...prev.ge,
                          thumbnail,
                        },
                        en: {
                          ...prev.en,
                          thumbnail,
                        },
                        ru: {
                          ...prev.ru,
                          thumbnail,
                        },
                      }));
                    }}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="მაგ: /assets/thumbnail.jpg"
                  />
                  <CldUploadWidget
                    uploadPreset="draftwork123"
                    onSuccess={(result) =>
                      handleUploadSuccess(result, "thumbnail")
                    }
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
                          {isUploading("thumbnail")
                            ? "იტვირთება..."
                            : "ატვირთვა"}
                        </button>
                      );
                    }}
                  </CldUploadWidget>
                </div>
                {project.ge.thumbnail && (
                  <div className="mt-2 max-w-xs">
                    <img
                      src={project.ge.thumbnail}
                      alt="Thumbnail preview"
                      className="max-h-32 object-contain border rounded"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Project Images Section */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">პროექტის სურათები</h2>
        <div className="space-y-4">
          {project.ge.images.map((image, index) => (
            <div
              key={index}
              className="flex items-center space-x-4 p-4 border rounded"
            >
              <div className="w-24 h-24 bg-gray-100 overflow-hidden rounded flex-shrink-0">
                {image.src && (
                  <img
                    src={image.src}
                    alt={image.alt || ""}
                    className="object-cover w-full h-full"
                  />
                )}
              </div>
              <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-bold mb-2">
                    სურათის მისამართი
                  </label>
                  <div className="flex space-x-2 items-center">
                    <input
                      type="text"
                      value={image.src || ""}
                      readOnly
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
                      {({ open }) => (
                        <button
                          type="button"
                          onClick={() => open()}
                          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded flex-shrink-0"
                          disabled={isUploading("projectImage", index)}
                        >
                          {isUploading("projectImage", index)
                            ? "..."
                            : "ატვირთვა"}
                        </button>
                      )}
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
                    onChange={(e) =>
                      handleImageAltChange(index, e.target.value)
                    }
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
              </div>
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
            გაუქმება
          </button>
        </Link>
        <button
          onClick={handleSave}
          disabled={saving || !projectId.trim()}
          className={`${
            saving || !projectId.trim()
              ? "bg-green-300 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600"
          } text-white py-2 px-4 rounded`}
        >
          {saving ? "ინახება..." : "შექმნა"}
        </button>
      </div>
    </div>
  );
};

export default NewProjectPage;
