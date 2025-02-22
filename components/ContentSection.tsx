import Image from "next/image";

interface ImageItem {
    src: string;
    alt: string;
    title: string;
    subtitle: string;
}

interface ContentSectionProps {
    id: string;
    title: string;
    subtitle?: string;
    images?: ImageItem[];
}

const ContentSection = ({
    id,
    title,
    subtitle,
    images,
}: ContentSectionProps) => (
    <section id={id} className="container mx-auto px-4 py-16">
        <h2 className="text-3xl mb-4 font-bold text-gray-900">{title}</h2>
        {subtitle && (
            <h3 className="text-xl text-gray-600 mb-8">{subtitle}</h3>
        )}
        {images && (
            <div className="flex flex-col gap-16">
                {/* First row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    {images.slice(0, 2).map((image, index) => (
                        <div key={index} className="flex flex-col gap-4">
                            <div className="relative h-[400px] rounded-lg overflow-hidden">
                                <Image
                                    src={image.src}
                                    alt={image.alt}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    style={{ objectFit: 'cover' }}
                                    priority={index === 0}
                                    className="w-full h-full"
                                />
                            </div>
                            <div className="text-center">
                                <h4 className="text-lg font-semibold text-gray-800">{image.title}</h4>
                                <p className="text-gray-600 mt-2">{image.subtitle}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Second row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    {images.slice(2, 4).map((image, index) => (
                        <div key={index + 2} className="flex flex-col gap-4">
                            <div className="relative h-[400px] rounded-lg overflow-hidden">
                                <Image
                                    src={image.src}
                                    alt={image.alt}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    style={{ objectFit: 'cover' }}
                                    className="w-full h-full"
                                />
                            </div>
                            <div className="text-center">
                                <h4 className="text-lg font-semibold text-gray-800">{image.title}</h4>
                                <p className="text-gray-600 mt-2">{image.subtitle}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Third row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    {images.slice(4, 6).map((image, index) => (
                        <div key={index + 4} className="flex flex-col gap-4">
                            <div className="relative h-[400px] rounded-lg overflow-hidden">
                                <Image
                                    src={image.src}
                                    alt={image.alt}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    style={{ objectFit: 'cover' }}
                                    className="w-full h-full"
                                />
                            </div>
                            <div className="text-center">
                                <h4 className="text-lg font-semibold text-gray-800">{image.title}</h4>
                                <p className="text-gray-600 mt-2">{image.subtitle}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}
    </section>
);

export default ContentSection;