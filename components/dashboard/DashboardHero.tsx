"use client"

import Image from "next/image"
import { Trophy, Gamepad2, Users } from "lucide-react"
import HeroPic from '@/public/assets/dashboard/covers/cyb3.jpg'
import HeroAvatar from '@/public/assets/dashboard/avatar/avatar-1.png'

function StatsCard({ icon, label, value }: {
    icon: React.ReactNode
    label: string
    value: string
}) {
    return (
        <div className="
            bg-zinc-800/50 backdrop-blur-sm 
            rounded-xl p-4 
            flex gap-3 items-center
            border border-zinc-700/50 
            hover:bg-zinc-800/60 
            transition-colors
        ">
            <div className="
                w-10 h-10 
                rounded-lg 
                bg-blue-500/10 
                flex items-center justify-center 
                text-blue-400
            ">
                {icon}
            </div>
            <div>
                <div className="text-sm text-zinc-400">{label}</div>
                <div className="text-xl font-semibold text-white">{value}</div>
            </div>
        </div>
    )
}

export default function DashboardHero() {
    return (
        <div className="relative">
            {/* Main Hero Image */}
            <div className="w-full h-[400px] relative">
                {/* Gradient Overlay */}
                <div className="
                    absolute inset-0 
                    bg-gradient-to-t from-zinc-950 via-transparent to-transparent 
                    z-10
                " />

                {/* Background Image */}
                <Image
                    src={HeroPic}
                    alt="Global Game"
                    fill
                    className="object-cover"
                    priority
                />
            </div>

            {/* Profile Section Overlay */}
            <div className="absolute -bottom-20 left-6 right-6 z-20">
                <div className="flex gap-6 items-end">
                    {/* Profile Image with Hover Effect */}
                    <div className="relative group">
                        <div className="
                            w-36 h-36 
                            rounded-full 
                            overflow-hidden 
                            border-4 border-zinc-800 
                            bg-zinc-900
                            ring-4 ring-blue-500/20 
                            shadow-xl
                        ">
                            <Image
                                src={HeroAvatar}
                                alt="Profile"
                                width={144}
                                height={144}
                                className="object-cover"
                            />
                        </div>

                        {/* Profile Image Hover Overlay */}
                        <div className="
                            absolute inset-0 
                            rounded-full 
                            bg-black/50 
                            opacity-0 
                            group-hover:opacity-100
                            flex items-center justify-center 
                            transition-opacity 
                            cursor-pointer
                        ">
                            <span className="text-sm text-white/90">შეცვლა</span>
                        </div>
                    </div>

                    {/* Stats Section */}
                    <div className="flex-1 flex gap-4 mb-6">
                        <div className="flex gap-4">
                            <StatsCard
                                icon={<Trophy className="w-5 h-5" />}
                                label="რეიტინგი"
                                value="2,456"
                            />
                            <StatsCard
                                icon={<Gamepad2 className="w-5 h-5" />}
                                label="თამაშები"
                                value="48"
                            />
                            <StatsCard
                                icon={<Users className="w-5 h-5" />}
                                label="მეგობრები"
                                value="164"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}