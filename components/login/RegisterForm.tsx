"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { register } from "@/app/actions/auth"

export default function RegisterForm() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        if (!email || !password) {
            setError("Please enter a valid email and password.")
            return
        }

        try {
            await register(email, password)
            router.push("/browse") // Redirect to the browse page after successful registration
        } catch (err) {
            setError("Unable to create account. Please try again.")
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <h1 className="text-3xl font-bold text-white mb-6">Sign Up</h1>
            <div>
                <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-gray-700 text-white border-0 rounded-sm p-4 w-full"
                    placeholder="Email"
                />
            </div>
            <div>
                <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-gray-700 text-white border-0 rounded-sm p-4 w-full"
                    placeholder="Password"
                />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" className="w-full text-lg py-3 bg-red-600 hover:bg-red-700 rounded-sm">
                Sign Up
            </Button>
            <p className="text-gray-500 text-center">
                Already have an account?{" "}
                <Link href="/login" className="text-white hover:underline">
                    Sign in now
                </Link>
            </p>
        </form>
    )
}

