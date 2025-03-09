"use client";

import React, { useEffect, useState, use } from 'react';
import { Project } from '@/types/project';
import Link from 'next/link';
import Image from 'next/image';

interface ProjectViewPageProps {
  params: Promise<{ id: string }>;
}

const ProjectViewPage = ({ params }: ProjectViewPageProps) => {
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">პროექტის დეტალები</h1>
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
          <h1 className="text-3xl font-bold">პროექტის დეტალები</h1>
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
          <h1 className="text-3xl font-bold">პროექტის დეტალები: {project.ge.title}</h1>
        </div>
        <Link href={`/admin/dashboard/projects/${project.id}/edit`} passHref>
          <button className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded">
            რედაქტირება
          </button>
        </Link>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
          {/* თამბნეილი */}
          <div className="md:col-span-1 relative h-64 bg-gray-100 rounded overflow-hidden">
            {project.ge.thumbnail && (
              <div className="relative w-full h-full">
                <img
                  src={project.ge.thumbnail}
                  alt={project.ge.title}
                  className="object-cover w-full h-full"
                />
              </div>
            )}
          </div>

          {/* პროექტის მონაცემები */}
          <div className="md:col-span-2">
            <div className="mb-6">
              <h2 className="text-xl font-bold border-b pb-2 mb-4">ძირითადი ინფორმაცია</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 font-semibold">ID:</p>
                  <p>{project.id}</p>
                </div>
                <div>
                  <p className="text-gray-600 font-semibold">ფუნქცია:</p>
                  <p>{project.ge.function}</p>
                </div>
                <div>
                  <p className="text-gray-600 font-semibold">მდებარეობა:</p>
                  <p>{project.ge.location}</p>
                </div>
                <div>
                  <p className="text-gray-600 font-semibold">წელი:</p>
                  <p>{project.ge.year}</p>
                </div>
                <div>
                  <p className="text-gray-600 font-semibold">ფართობი:</p>
                  <p>{project.ge.area}</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold border-b pb-2 mb-4">მოკლე აღწერა</h2>
              <p>{project.ge.shortDescription}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ენების ჩანართები */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
        <div className="p-6">
          <h2 className="text-xl font-bold border-b pb-2 mb-4">პროექტის სახელები ყველა ენაზე</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border p-4 rounded shadow-sm">
              <h3 className="font-bold mb-2">ქართული</h3>
              <p>{project.ge.title}</p>
            </div>
            <div className="border p-4 rounded shadow-sm">
              <h3 className="font-bold mb-2">ინგლისური</h3>
              <p>{project.en.title}</p>
            </div>
            <div className="border p-4 rounded shadow-sm">
              <h3 className="font-bold mb-2">რუსული</h3>
              <p>{project.ru.title}</p>
            </div>
          </div>
        </div>
      </div>

      {/* სრული აღწერა */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
        <div className="p-6">
          <h2 className="text-xl font-bold border-b pb-2 mb-4">სრული აღწერა (ქართული)</h2>
          <div className="space-y-4">
            {project.ge.description.map((paragraph, index) => (
              <p key={index} className="text-gray-700">{paragraph}</p>
            ))}
          </div>
        </div>
      </div>

      {/* სურათების გალერეა */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
        <div className="p-6">
          <h2 className="text-xl font-bold border-b pb-2 mb-4">სურათების გალერეა</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {project.ge.images.map((image, index) => (
              <div key={index} className="relative h-48 bg-gray-100 rounded overflow-hidden">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="object-cover w-full h-full"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-2 text-sm">
                  {image.alt}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* სართულები */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-bold border-b pb-2 mb-4">სართულები და გეგმები</h2>
          {project.ge.floors && project.ge.floors.map((floor, floorIndex) => (
            <div key={floorIndex} className="mb-6 last:mb-0">
              <h3 className="font-bold text-lg mb-2">{floor.name}</h3>

              {/* სართულის გეგმა */}
              {floor.image && (
                <div className="mb-4 relative h-64 bg-gray-100 rounded overflow-hidden">
                  <img
                    src={floor.image}
                    alt={`${floor.name} გეგმა`}
                    className="object-contain w-full h-full"
                  />
                </div>
              )}

              {/* გაზომვები */}
              {floor.measurements && floor.measurements.length > 0 && floor.measurements[0] !== "" && (
                <div className="mb-4">
                  <h4 className="font-semibold mb-2">გაზომვები:</h4>
                  <ul className="list-disc list-inside">
                    {floor.measurements.map((measurement, measureIndex) => (
                      <li key={measureIndex}>{measurement}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* სართულის დამატებითი სურათები */}
              {floor.floorImages && floor.floorImages.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">სართულის სურათები:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {floor.floorImages.map((image, imageIndex) => (
                      <div key={imageIndex} className="relative h-48 bg-gray-100 rounded overflow-hidden">
                        <img
                          src={image.src}
                          alt={image.alt}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectViewPage;