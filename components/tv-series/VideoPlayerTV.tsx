// components/tv-series/VideoPlayer.tsx
"use client"

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Play, Pause, Volume2, VolumeX, Maximize, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface VideoPlayerProps {
    videoUrl: string | null;  // შევცვალეთ undefined -> null
}

export default function VideoPlayer({ videoUrl }: VideoPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showControls, setShowControls] = useState(true);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handleTimeUpdate = () => {
            setProgress((video.currentTime / video.duration) * 100);
            setCurrentTime(video.currentTime);
        };

        const handleLoadedMetadata = () => {
            setDuration(video.duration);
        };

        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => setIsPlaying(false);
        const handleWaiting = () => setIsLoading(true);
        const handlePlaying = () => setIsLoading(false);

        video.addEventListener('timeupdate', handleTimeUpdate);
        video.addEventListener('loadedmetadata', handleLoadedMetadata);
        video.addEventListener('play', handlePlay);
        video.addEventListener('pause', handlePause);
        video.addEventListener('waiting', handleWaiting);
        video.addEventListener('playing', handlePlaying);

        return () => {
            video.removeEventListener('timeupdate', handleTimeUpdate);
            video.removeEventListener('loadedmetadata', handleLoadedMetadata);
            video.removeEventListener('play', handlePlay);
            video.removeEventListener('pause', handlePause);
            video.removeEventListener('waiting', handleWaiting);
            video.removeEventListener('playing', handlePlaying);
        };
    }, []);

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
        }
    };

    const handleProgress = (value: number[]) => {
        if (videoRef.current) {
            const time = (value[0] / 100) * videoRef.current.duration;
            videoRef.current.currentTime = time;
        }
    };

    const handleVolume = (value: number[]) => {
        if (videoRef.current) {
            const newVolume = value[0] / 100;
            videoRef.current.volume = newVolume;
            setVolume(newVolume);
            setIsMuted(newVolume === 0);
        }
    };

    const toggleMute = () => {
        if (videoRef.current) {
            const newMuted = !isMuted;
            videoRef.current.muted = newMuted;
            setIsMuted(newMuted);
            if (newMuted) {
                videoRef.current.volume = 0;
                setVolume(0);
            } else {
                videoRef.current.volume = 1;
                setVolume(1);
            }
        }
    };

    const toggleFullscreen = () => {
        if (!videoRef.current) return;

        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            videoRef.current.requestFullscreen();
        }
    };

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    return (
        <div
            className="relative aspect-video bg-black rounded-lg overflow-hidden group"
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => setShowControls(false)}
        >
            <video
                ref={videoRef}
                className="w-full h-full"
                onClick={togglePlay}
            >
                {videoUrl && <source src={videoUrl} type="video/mp4" />}
            </video>

            {/* Play/Pause Overlay */}
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                    <Loader2 className="w-12 h-12 text-white animate-spin" />
                </div>
            )}

            {/* Controls */}
            <div
                className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent 
                         transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}
            >
                {/* Progress Bar */}
                <Slider
                    value={[progress]}
                    max={100}
                    step={0.1}
                    className="mb-4"
                    onValueChange={handleProgress}
                />

                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-white hover:bg-white/20"
                            onClick={togglePlay}
                        >
                            {isPlaying ?
                                <Pause className="h-5 w-5" /> :
                                <Play className="h-5 w-5" />
                            }
                        </Button>

                        <div className="flex items-center space-x-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-white hover:bg-white/20"
                                onClick={toggleMute}
                            >
                                {isMuted ?
                                    <VolumeX className="h-5 w-5" /> :
                                    <Volume2 className="h-5 w-5" />
                                }
                            </Button>
                            <div className="w-24">
                                <Slider
                                    value={[volume * 100]}
                                    max={100}
                                    step={1}
                                    className="w-full"
                                    onValueChange={handleVolume}
                                />
                            </div>
                        </div>

                        <span className="text-white text-sm">
                            {formatTime(currentTime)} / {formatTime(duration)}
                        </span>
                    </div>

                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-white hover:bg-white/20"
                        onClick={toggleFullscreen}
                    >
                        <Maximize className="h-5 w-5" />
                    </Button>
                </div>
            </div>
        </div>
    );
}