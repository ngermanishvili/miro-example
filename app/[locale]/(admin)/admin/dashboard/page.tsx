"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface User {
    userId: number;
    username: string;
}

export default function AdminDashboard() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // მომხმარებლის ინფორმაციის გამოთხოვა
        const fetchUserInfo = async () => {
            try {
                const res = await fetch("/api/auth/check", {
                    credentials: "include", // მნიშვნელოვანია ქუქების გასაგზავნად
                });

                const data = await res.json();

                if (data.status === "success") {
                    setUser(data.user);
                } else {
                    // თუ ტოკენი არ არის ვალიდური, გადავამისამართოთ login გვერდზე
                    router.replace("/ka/login");
                }
            } catch (error) {
                console.error("Error fetching user info:", error);
                router.replace("/ka/login");
            } finally {
                setLoading(false);
            }
        };

        fetchUserInfo();
    }, [router]);

    const handleLogout = async () => {
        try {
            // ქუქის წაშლა - შეიძლება გქონდეთ ცალკე API ამისთვის
            document.cookie = "auth_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
            router.replace("/ka/login");
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-2xl font-semibold">იტვირთება...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center">
                                <h1 className="text-xl font-bold">ადმინ პანელი</h1>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <div className="ml-4 flex items-center md:ml-6">
                                <span className="mr-4">მოგესალმებით, {user?.username}</span>
                                <button
                                    onClick={handleLogout}
                                    className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                >
                                    გასვლა
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="border-2 border-gray-200 rounded-lg p-6">
                        <h2 className="text-2xl font-semibold mb-6">ადმინისტრატორის პანელი</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* პროექტების მართვის ბარათი */}
                            <div className="bg-white overflow-hidden shadow rounded-lg">
                                <div className="p-5">
                                    <div className="flex items-center">
                                        <div className="w-0 flex-1">
                                            <h3 className="text-lg font-medium text-gray-900">პროექტების მართვა</h3>
                                            <p className="mt-1 text-sm text-gray-500">
                                                პროექტების დამატება, წაშლა და რედაქტირება
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-5 py-3">
                                    <Link href="/admin/projects">
                                        <div className="text-sm font-medium text-blue-600 hover:text-blue-500 cursor-pointer">
                                            გადასვლა
                                        </div>
                                    </Link>
                                </div>
                            </div>

                            {/* სხვა ბარათები შეგიძლიათ დაამატოთ საჭიროების მიხედვით */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}