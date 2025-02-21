// Newsletter.tsx
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import React from 'react'
import Logo from '@/public/assets/dashboard/avatar/avatar-1.png'

const Newsletter = () => {
    return (
        <div className="absolute bottom-0 left-[200px] right-[250px] bg-[#42D791] py-2 rounded-sm z-20 border-t border-[#2d0707]">
            <div className="w-full lg:w-[1200px] mx-auto px-4 lg:px-12">
                <div className="flex items-center justify-between">
                    {/* Logo and Text */}
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8">
                            <Image
                                src={Logo}
                                alt="Netflix"
                                width={32}
                                height={32}
                                priority
                            />
                        </div>
                        <span className="text-white text-sm md:text-base">
                            Plans start at just EUR 9.39
                        </span>
                    </div>

                    {/* Button */}
                    <Button className="bg-[#000000] hover:bg-[#f6121d] text-white px-6 py-2 rounded-sm text-sm font-medium">
                        Join Now
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default Newsletter
