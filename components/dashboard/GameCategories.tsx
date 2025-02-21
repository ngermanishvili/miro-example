"use client"

import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Gamepad2, MoveIcon } from "lucide-react"

export default function GameCategories() {
    const categories = [
        { icon: <Gamepad2 />, label: "Simulator", color: "bg-blue-600" },
        { icon: <Gamepad2 />, label: "Simulator", color: "bg-red-600" },
        { icon: <MoveIcon />, label: "Simulator", color: "bg-yellow-600" },
    ]

    return (
        <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">
                    Games Categories <span className="text-gray-400 text-sm">(16)</span>
                </h2>
            </div>
            <ScrollArea className="w-full">
                <div className="flex gap-4 pb-4">
                    {categories.map((category, index) => (
                        <Button key={index} variant="outline" className="border-gray-700 hover:bg-gray-800">
                            <div className={`w-8 h-8 rounded-full ${category.color} p-2 mr-2`}>{category.icon}</div>
                            {category.label}
                        </Button>
                    ))}
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </div>
    )
}