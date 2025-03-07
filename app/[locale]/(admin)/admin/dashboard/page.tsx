"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Type definitions
interface User {
  username: string;
  [key: string]: any; // For any additional user properties
}

interface AuthResponse {
  status: string;
  message?: string;
  user?: User;
}

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async (): Promise<void> => {
      try {
        // Try the standard API route first
        const response = await fetch("/api/auth/check", {
          credentials: "include", // Important for cookies
        });

        if (!response.ok) {
          throw new Error("Authentication failed");
        }

        const data: AuthResponse = await response.json();

        if (data.status !== "success") {
          throw new Error(data.message || "Authentication error");
        }

        setUser(data.user || null);
        setIsLoading(false);
      } catch (err) {
        console.error("Auth check error:", err);
        setError("Authentication failed. Redirecting to login...");

        // Give the user a moment to see the error before redirecting
        setTimeout(() => {
          router.push("/ka/login");
        }, 1500);
      }
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold">მიმდინარეობს ჩატვირთვა...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center text-red-600">
          <h2 className="text-xl font-semibold">{error}</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">ადმინისტრატორის პანელი</h1>
            <div className="text-sm text-gray-600">
              მომხმარებელი:{" "}
              <span className="font-semibold">{user?.username}</span>
            </div>
          </div>

          {/* Dashboard content goes here */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-4 rounded-md">
              <h2 className="text-lg font-semibold mb-2">სტატისტიკა</h2>
              <p>აქ იქნება სტატისტიკური მონაცემები...</p>
            </div>
            <div className="bg-green-50 p-4 rounded-md">
              <h2 className="text-lg font-semibold mb-2">ბოლო აქტივობები</h2>
              <p>აქ იქნება ბოლო აქტივობები...</p>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={() => {
                document.cookie =
                  "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                router.push("/ka/login");
              }}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              გასვლა
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}