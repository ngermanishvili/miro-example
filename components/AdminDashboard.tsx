'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
    userId: number;
    username: string;
}

export default function AdminDashboard() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        async function fetchUserData() {
            try {
                const res = await fetch('/api/auth/check');
                if (!res.ok) {
                    throw new Error('ავტორიზაცია არ მოხერხდა');
                }

                const data = await res.json();
                setUser(data.user);
            } catch (err) {
                console.error('ავტორიზაციის შემოწმების შეცდომა:', err);
                router.push('/admin/login');
            } finally {
                setLoading(false);
            }
        }

        fetchUserData();
    }, [router]);

    const handleLogout = async () => {
        try {
            const res = await fetch('/api/auth/logout', {
                method: 'POST',
            });

            if (res.ok) {
                router.push('/admin/login');
            }
        } catch (err) {
            console.error('გასვლის შეცდომა:', err);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-xl">იტვირთება...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow-md p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <h1 className="text-xl font-bold">ადმინის პანელი</h1>
                    <div className="flex items-center space-x-4">
                        <span className="text-gray-700">
                            მოგესალმებით, {user?.username}
                        </span>
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                        >
                            გასვლა
                        </button>
                    </div>
                </div>
            </nav>

            <main className="container mx-auto p-6">
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">ადმინისტრატორის გვერდი</h2>
                    <p className="text-gray-700">
                        აქ შეგიძლიათ მართოთ თქვენი საიტის კონტენტი და კონფიგურაცია.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                        <div className="bg-blue-50 p-4 rounded-lg shadow">
                            <h3 className="font-medium text-lg mb-2">სტატისტიკა</h3>
                            <p className="text-gray-600">სტატისტიკური მონაცემების ნახვა</p>
                        </div>

                        <div className="bg-green-50 p-4 rounded-lg shadow">
                            <h3 className="font-medium text-lg mb-2">მომხმარებლები</h3>
                            <p className="text-gray-600">მომხმარებლების მართვა</p>
                        </div>

                        <div className="bg-purple-50 p-4 rounded-lg shadow">
                            <h3 className="font-medium text-lg mb-2">კონტენტი</h3>
                            <p className="text-gray-600">კონტენტის მართვა</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}