"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

// ტიპები
interface Project {
  id: string;
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

interface LocaleOption {
  value: string;
  label: string;
}

// ძირითადი კომპონენტი
const ProjectsManagement: React.FC = () => {
  const params = useParams();
  const locale = (params?.locale as string) || "ka";
  const router = useRouter();

  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showTranslations, setShowTranslations] = useState<boolean>(false);
  const [locales, setLocales] = useState<LocaleOption[]>([
    { value: "ka", label: "ქართული" },
    { value: "en", label: "English" },
    { value: "ru", label: "Русский" }
  ]);
  const [selectedLocale, setSelectedLocale] = useState<string>(locale);

  // პროექტების ჩატვირთვა
  useEffect(() => {
    const fetchProjects = async (): Promise<void> => {
      try {
        setIsLoading(true);
        const response = await fetch(`/${locale}/api/projects`);

        if (!response.ok) {
          throw new Error("პროექტების ჩატვირთვა ვერ მოხერხდა");
        }

        const data = await response.json();
        setProjects(data.projects || []);
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError("პროექტების ჩატვირთვა ვერ მოხერხდა");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [locale]);

  // პროექტის წაშლა
  const handleDeleteProject = async (id: string): Promise<void> => {
    if (window.confirm("ნამდვილად გსურთ პროექტის წაშლა?")) {
      try {
        const response = await fetch(`/${locale}/api/projects/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("პროექტის წაშლა ვერ მოხერხდა");
        }

        // წაშლის შემთხვევაში განაახლებს პროექტების სიას
        setProjects(projects.filter(project => project.id !== id));
      } catch (err) {
        console.error("Error deleting project:", err);
        alert("პროექტის წაშლა ვერ მოხერხდა");
      }
    }
  };

  // პროექტის არჩევა რედაქტირებისთვის
  const handleEditProject = (id: string): void => {
    router.push(`/admin/dashboard/projects/edit/${id}`);
  };

  // ახალი პროექტის შექმნა
  const handleCreateProject = (): void => {
    router.push("/admin/dashboard/projects/new");
  };

  // თარგმანების მართვა
  const handleManageTranslations = (project: Project): void => {
    setSelectedProject(project);
    setShowTranslations(true);
  };

  // თარგმანის რედაქტირება
  const handleEditTranslation = (projectId: string, locale: string): void => {
    router.push(`/admin/dashboard/translations/${projectId}/${locale}`);
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
    <div className="p-6">
      {/* ზედა პანელი კონტროლებით */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">პროექტების მართვა</h1>
        <div className="flex space-x-2">
          <select
            className="border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            value={selectedLocale}
            onChange={(e) => setSelectedLocale(e.target.value)}
          >
            {locales.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button
            onClick={handleCreateProject}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            ახალი პროექტის დამატება
          </button>
        </div>
      </div>

      {/* პროექტების ცხრილი */}
      {projects.length === 0 ? (
        <div className="bg-gray-100 p-4 rounded-md text-center">
          პროექტები არ არის ხელმისაწვდომი
        </div>
      ) : (
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  სათაური
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ადგილმდებარეობა
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ფუნქცია
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ფართობი
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  წელი
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  მინიატურა
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  მოქმედებები
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {projects.map((project) => (
                <tr key={project.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 whitespace-nowrap">{project.id}</td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    {project.title}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    {project.location}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    {project.function}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    {project.area}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    {project.year}
                  </td>
                  <td className="py-3 px-4">
                    {project.thumbnail ? (
                      <div className="h-10 w-16 relative">
                        <img
                          src={project.thumbnail}
                          alt={project.title}
                          className="h-full w-full object-cover rounded"
                        />
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button
                        className="bg-blue-100 hover:bg-blue-200 text-blue-800 font-medium py-1 px-2 rounded text-xs"
                        onClick={() => handleEditProject(project.id)}
                      >
                        რედაქტირება
                      </button>
                      <button
                        className="bg-green-100 hover:bg-green-200 text-green-800 font-medium py-1 px-2 rounded text-xs"
                        onClick={() => handleManageTranslations(project)}
                      >
                        თარგმანები
                      </button>
                      <button
                        className="bg-red-100 hover:bg-red-200 text-red-800 font-medium py-1 px-2 rounded text-xs"
                        onClick={() => handleDeleteProject(project.id)}
                      >
                        წაშლა
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* თარგმანების მოდალური ფანჯარა */}
      {showTranslations && selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                თარგმანების მართვა: {selectedProject.title}
              </h2>
              <button
                onClick={() => setShowTranslations(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="mb-4">
              <p className="text-gray-700">
                აირჩიეთ ენა, რომელზეც გსურთ თარგმანის რედაქტირება:
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {locales
                .filter(l => l.value !== "ka") // გამოვტოვოთ ქართული, რადგან ის ძირითადი ენაა
                .map(l => (
                  <div key={l.value} className="flex justify-between items-center p-3 border rounded">
                    <span>{l.label}</span>
                    <button
                      onClick={() => handleEditTranslation(selectedProject.id, l.value)}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm"
                    >
                      რედაქტირება
                    </button>
                  </div>
                ))}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowTranslations(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
              >
                დახურვა
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsManagement;