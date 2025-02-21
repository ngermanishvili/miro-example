import { useState, useEffect } from "react"
import Image from "next/image"
import { X, PlayCircle, Plus, ThumbsUp } from "lucide-react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"

interface Movie {
    id: number
    title: string
    posterPath: string
    overview?: string
    voteAverage?: number
}

interface MovieModalProps {
    movie: Movie
    isOpen: boolean
    onClose: () => void
}

export default function MovieModal({ movie, isOpen, onClose }: MovieModalProps) {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)

        const handleEscKey = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose()
            }
        }

        if (isOpen) {
            document.addEventListener("keydown", handleEscKey)
        }

        return () => {
            document.removeEventListener("keydown", handleEscKey)
        }
    }, [isOpen, onClose])

    if (!isMounted) {
        return null
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogTitle className="sr-only">{movie.title}</DialogTitle>
                <div className="relative flex w-full items-center overflow-hidden bg-black text-white">
                    <button
                        type="button"
                        className="absolute top-4 right-4 rounded-lg bg-white/30 p-2 text-white hover:bg-white/50"
                        onClick={onClose}
                    >
                        <X className="h-5 w-5" />
                    </button>
                    <div className="flex w-full flex-col items-start gap-4 p-6">
                        <div className="relative h-48 w-full">
                            <Image
                                src={movie.posterPath || "/placeholder.svg"}
                                alt={movie.title}
                                layout="fill"
                                objectFit="cover"
                                className="rounded-lg"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <h2 className="text-xl font-bold">{movie.title}</h2>
                            <p className="text-sm text-gray-300">{movie.overview || "No overview available."}</p>
                            {movie.voteAverage && (
                                <div className="flex items-center gap-2">
                                    <ThumbsUp className="h-5 w-5" />
                                    <p className="text-sm font-medium">{movie.voteAverage}</p>
                                </div>
                            )}
                        </div>
                        <div className="flex w-full justify-end gap-4">
                            <button className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-black hover:bg-gray-200">
                                <PlayCircle className="h-5 w-5" />
                                Play
                            </button>
                            <button className="flex items-center gap-2 rounded-lg bg-gray-600 px-4 py-2 text-white hover:bg-gray-700">
                                <Plus className="h-5 w-5" />
                                Add to List
                            </button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}