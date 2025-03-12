// app/(admin)/admin/dashboard/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Project } from "@/types/project";
import Link from "next/link";

const DashboardPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Fetching from the API route we have
        const response = await fetch("/api/projects");

        if (!response.ok) {
          throw new Error("Failed to fetch projects");
        }

        const data = await response.json();
        setProjects(data);
      } catch (err) {
        setError(
          "პროექტების ჩატვირთვა ვერ მოხერხდა. გთხოვთ სცადოთ მოგვიანებით."
        );
        console.error("Error fetching projects:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Function to truncate long text
  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">პროექტების მართვა</h1>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">პროექტების მართვა</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
          >
            ხელახლა ცდა
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">პროექტების მართვა</h1>
        <Link href="/admin/dashboard/new" passHref>
          <button className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded">
            ახალი პროექტის დამატება
          </button>
        </Link>
      </div>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                ID
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                სათაური (ქართულად)
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                სათაური (ინგლისურად)
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                მდებარეობა
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                წელი
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                მოქმედებები
              </th>
            </tr>
          </thead>
          <tbody>
            {projects.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center"
                >
                  პროექტები არ მოიძებნა
                </td>
              </tr>
            ) : (
              projects.map((project) => (
                <tr key={project.id} className="hover:bg-gray-50">
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                      {project.id}
                    </p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                      {project.ge.title}
                    </p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                      {project.en.title}
                    </p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                      {project.ge.location}
                    </p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                      {project.ge.year}
                    </p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <div className="flex space-x-2">
                      <Link
                        href={`/admin/dashboard/projects/${project.id}`}
                        passHref
                      >
                        <button className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded">
                          ნახვა
                        </button>
                      </Link>
                      <Link
                        href={`/admin/dashboard/projects/${project.id}/edit`}
                        passHref
                      >
                        <button className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded">
                          რედაქტირება
                        </button>
                      </Link>
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
                        onClick={() => {
                          if (
                            confirm(
                              `დარწმუნებული ხართ, რომ გსურთ წაშალოთ პროექტი: ${project.ge.title}?`
                            )
                          ) {
                            // თქვენ შეგიძლიათ აქ დაამატოთ წაშლის ფუნქციონალი მოგვიანებით
                            alert(
                              `პროექტის წაშლის ფუნქციონალი დაემატება მოგვიანებით`
                            );
                          }
                        }}
                      >
                        წაშლა
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardPage;
