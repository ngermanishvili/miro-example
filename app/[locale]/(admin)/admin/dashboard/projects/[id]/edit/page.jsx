"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { CldUploadWidget } from "next-cloudinary";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  ImagePlus,
  Loader2,
  Globe,
  Languages,
  Plus,
  Trash,
  ArrowLeft,
  Save,
} from "lucide-react";
import { Label } from "@/components/ui/label";

const EditProject = () => {
  const router = useRouter();
  const params = useParams();
  const projectId = params?.id;
  const locale = params?.locale || "ka";

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
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
    const fetchProject = async () => {
      if (!projectId) return;

      try {
        setLoading(true);
        const response = await fetch(`/${locale}/api/projects/${projectId}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch project: ${response.status}`);
        }

        const data = await response.json();
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDescriptionChange = (index, value) => {
    const updatedDescriptions = [...formData.description];
    updatedDescriptions[index] = value;
    setFormData({
      ...formData,
      description: updatedDescriptions,
    });
  };

  const addDescriptionField = () => {
    setFormData({
      ...formData,
      description: [...formData.description, ""],
    });
  };

  const removeDescriptionField = (index) => {
    const updatedDescriptions = [...formData.description];
    updatedDescriptions.splice(index, 1);
    setFormData({
      ...formData,
      description: updatedDescriptions,
    });
  };

  const handleFloorChange = (index, field, value) => {
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

  const addFloorField = () => {
    setFormData({
      ...formData,
      floors: [...formData.floors, { title: "", description: "" }],
    });
  };

  const removeFloorField = (index) => {
    const updatedFloors = [...formData.floors];
    updatedFloors.splice(index, 1);
    setFormData({
      ...formData,
      floors: updatedFloors,
    });
  };

  const handleImageUpload = (result) => {
    const newImage = result.info.secure_url;
    setFormData({
      ...formData,
      images: [...formData.images, newImage],
    });
  };

  const handleThumbnailUpload = (result) => {
    const newThumbnail = result.info.secure_url;
    setFormData({
      ...formData,
      thumbnail: newThumbnail,
    });
  };

  const removeImage = (index) => {
    const updatedImages = [...formData.images];
    updatedImages.splice(index, 1);
    setFormData({
      ...formData,
      images: updatedImages,
    });
  };

  const handleSubmit = async (e) => {
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
        <Button
          variant="outline"
          onClick={() => router.push("/admin/dashboard/projects")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          უკან დაბრუნება
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button
            variant="outline"
            onClick={() => router.push("/admin/dashboard/projects")}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            უკან დაბრუნება
          </Button>
          <h1 className="text-2xl font-bold">პროექტის რედაქტირება</h1>
        </div>
        <Button
          onClick={handleSubmit}
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700"
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
        </Button>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="mb-6">
          <TabsTrigger value="general">ძირითადი ინფორმაცია</TabsTrigger>
          <TabsTrigger value="description">აღწერა</TabsTrigger>
          <TabsTrigger value="floors">სართულები</TabsTrigger>
          <TabsTrigger value="images">სურათები</TabsTrigger>
        </TabsList>

        <form>
          <TabsContent value="general">
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">სათაური</Label>
                      <Input
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="შეიყვანეთ პროექტის სათაური"
                      />
                    </div>

                    <div>
                      <Label htmlFor="shortDescription">მოკლე აღწერა</Label>
                      <Textarea
                        id="shortDescription"
                        name="shortDescription"
                        value={formData.shortDescription}
                        onChange={handleInputChange}
                        placeholder="შეიყვანეთ მოკლე აღწერა"
                        rows={3}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="location">ადგილმდებარეობა</Label>
                      <Input
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder="შეიყვანეთ მდებარეობა"
                      />
                    </div>

                    <div>
                      <Label htmlFor="function">ფუნქცია</Label>
                      <Input
                        id="function"
                        name="function"
                        value={formData.function}
                        onChange={handleInputChange}
                        placeholder="შეიყვანეთ ფუნქცია"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="area">ფართობი (მ²)</Label>
                        <Input
                          id="area"
                          name="area"
                          type="number"
                          value={formData.area}
                          onChange={handleInputChange}
                          placeholder="შეიყვანეთ ფართობი"
                        />
                      </div>

                      <div>
                        <Label htmlFor="year">წელი</Label>
                        <Input
                          id="year"
                          name="year"
                          type="number"
                          value={formData.year}
                          onChange={handleInputChange}
                          placeholder="შეიყვანეთ წელი"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <Label>მთავარი სურათი (Thumbnail)</Label>
                  <div className="mt-2 flex items-center space-x-4">
                    {formData.thumbnail ? (
                      <div className="relative">
                        <img
                          src={formData.thumbnail}
                          alt="Thumbnail"
                          className="h-24 w-40 object-cover rounded-md border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                          onClick={() =>
                            setFormData({ ...formData, thumbnail: "" })
                          }
                        >
                          <Trash className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <div className="h-24 w-40 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center">
                        <CldUploadWidget
                          uploadPreset="projects"
                          onSuccess={handleThumbnailUpload}
                        >
                          {({ open }) => (
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => open()}
                            >
                              <ImagePlus className="h-4 w-4 mr-2" />
                              ატვირთვა
                            </Button>
                          )}
                        </CldUploadWidget>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="description">
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">პროექტის აღწერა</h3>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addDescriptionField}
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    დამატება
                  </Button>
                </div>

                {formData.description.map((desc, index) => (
                  <div key={index} className="mb-4 relative">
                    <Textarea
                      value={desc}
                      onChange={(e) =>
                        handleDescriptionChange(index, e.target.value)
                      }
                      placeholder={`აღწერის პარაგრაფი ${index + 1}`}
                      rows={3}
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6 text-red-500 hover:text-red-700"
                      onClick={() => removeDescriptionField(index)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                {formData.description.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    აღწერის ტექსტი არ არის დამატებული. დააკლიკეთ "დამატება"
                    ღილაკს.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="floors">
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">სართულები</h3>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addFloorField}
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    სართულის დამატება
                  </Button>
                </div>

                {formData.floors.map((floor, index) => (
                  <div
                    key={index}
                    className="mb-6 p-4 border rounded-md relative"
                  >
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6 text-red-500 hover:text-red-700"
                      onClick={() => removeFloorField(index)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>

                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <Label>სართულის სახელი</Label>
                        <Input
                          value={floor.title || ""}
                          onChange={(e) =>
                            handleFloorChange(index, "title", e.target.value)
                          }
                          placeholder="მაგ: პირველი სართული"
                        />
                      </div>

                      <div>
                        <Label>სართულის აღწერა</Label>
                        <Textarea
                          value={floor.description || ""}
                          onChange={(e) =>
                            handleFloorChange(
                              index,
                              "description",
                              e.target.value
                            )
                          }
                          placeholder="სართულის აღწერა"
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {formData.floors.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    სართულები არ არის დამატებული. დააკლიკეთ "სართულის დამატება"
                    ღილაკს.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="images">
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">პროექტის სურათები</h3>
                  <CldUploadWidget
                    uploadPreset="projects"
                    onSuccess={handleImageUpload}
                  >
                    {({ open }) => (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => open()}
                        size="sm"
                      >
                        <ImagePlus className="h-4 w-4 mr-2" />
                        სურათის ატვირთვა
                      </Button>
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
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => removeImage(index)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  {formData.images.length === 0 && (
                    <div className="col-span-full text-center py-12 border-2 border-dashed border-gray-300 rounded-md text-gray-500">
                      სურათები არ არის ატვირთული. დააკლიკეთ "სურათის ატვირთვა"
                      ღილაკს.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </form>
      </Tabs>
    </div>
  );
};

export default EditProject;
