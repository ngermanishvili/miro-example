"use client"

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { MessageSquare, Timer, Vote, Film, UserCog, ArrowUpRight } from "lucide-react"

export default function FeaturedActions() {
    const featuredItems = [
        {
            title: "AI ჩათი",
            description: "ისაუბრე ხელოვნურ ინტელექტთან",
            bg: "from-blue-600 to-blue-700",
            icon: <MessageSquare className="w-8 h-8 text-white/80" />
        },
        {
            title: "დაატრიალე და მოიგე",
            description: "გაითამაშე პრიზები",
            bg: "from-yellow-600 to-yellow-700",
            icon: <Timer className="w-8 h-8 text-white/80" />
        },
        {
            title: "ხმის მიცემა",
            description: "მიიღე მონაწილეობა",
            bg: "from-green-600 to-green-700",
            icon: <Vote className="w-8 h-8 text-white/80" />
        },
        {
            title: "სანახაობები",
            description: "ფილმები და სერიალები",
            bg: "from-purple-600 to-purple-700",
            icon: <Film className="w-8 h-8 text-white/80" />
        },
        {
            title: "პროფილის რედაქტირება",
            description: "განაახლე ინფორმაცია",
            bg: "from-red-600 to-red-700",
            icon: <UserCog className="w-8 h-8 text-white/80" />
        }
    ]

    return (
        <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex gap-4 pb-4">
                {featuredItems.map((item, index) => (
                    <div
                        key={index}
                        className={`
                            relative w-72 h-40 rounded-xl 
                            bg-gradient-to-br ${item.bg} 
                            p-6 flex flex-col justify-between 
                            group hover:opacity-90 transition-all
                            cursor-pointer
                        `}
                    >
                        {/* Corner Arrow Icon */}
                        <div className="absolute top-3 right-3">
                            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center
                                          group-hover:bg-white/20 transition-all">
                                <ArrowUpRight className="w-5 h-5 text-white/80 
                                                       group-hover:rotate-12 group-hover:scale-110 
                                                       transition-all duration-200" />
                            </div>
                        </div>

                        <div className="p-4">
                            {item.icon}
                            <h3 className="text-xl font-bold mt-2">{item.title}</h3>
                            <p className="text-sm text-white/80 mt-1">{item.description}</p>
                        </div>
                    </div>
                ))}
            </div>
            <ScrollBar orientation="horizontal" />
        </ScrollArea>
    )
}