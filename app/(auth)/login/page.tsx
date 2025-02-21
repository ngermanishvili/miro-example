import LoginForm from "@/components/login/LoginForm"
import Image from "next/image"

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-black bg-opacity-75 bg-[url('/netflix-background.jpg')] bg-cover bg-center flex items-center justify-center p-4">
            <div className="bg-black bg-opacity-70 rounded-md shadow-xl p-8 w-full max-w-md">
                <div className="flex justify-center mb-8">
                    <Image src="/netflix-logo.png" alt="Netflix" width={167} height={45} />
                </div>
                <LoginForm />
            </div>
        </div>
    )
}

