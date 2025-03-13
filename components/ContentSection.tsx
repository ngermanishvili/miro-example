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

// Improved URL validation function
const isValidUrl = (url: string | null | undefined): boolean => {
  if (!url) return false;

  // Check for absolute URLs (http:// or https://)
  if (url.startsWith("http://") || url.startsWith("https://")) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  // Check for valid relative URLs (must start with /)
  return url.startsWith("/");
};

// Get a valid image URL or return a placeholder
const getValidImageUrl = (url: string | null | undefined): string => {
  if (!url) return "/assets/placeholder.jpg";
  if (isValidUrl(url)) return url;
  // If URL doesn't start with /, add it (assuming it's a relative path)
  if (!url.startsWith("/")) return `/${url}`;
  return "/assets/placeholder.jpg";
};

const ContentSection = ({
  id,
  title,
  subtitle,
  images,
}: ContentSectionProps) => {
  // Filter out images with invalid URLs
  const validImages = images?.filter((img) => img && isValidUrl(img.src)) || [];

  return (
    <section id={id} className="container mx-auto px-4 py-16">
      <div className="flex justify-end mb-8">
        <div className="text-right">
          <h2 className="text-3xl mb-4 font-bold text-gray-900">{title}</h2>
          {subtitle && <h3 className="text-xl text-gray-600">{subtitle}</h3>}
        </div>
      </div>
      {validImages.length > 0 && (
        <div className="flex flex-col gap-16">
          {/* First row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {validImages.slice(0, 2).map((image, index) => {
              const imageSrc = getValidImageUrl(image.src);
              const isLocalAsset = imageSrc.startsWith("/assets");

              return (
                <div key={index} className="flex flex-col gap-4">
                  <div className="relative h-[400px] rounded-lg overflow-hidden">
                    <Image
                      src={imageSrc}
                      alt={image.alt || `${title} image ${index + 1}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      style={{ objectFit: "cover" }}
                      priority={index === 0}
                      className="w-full h-full"
                      unoptimized={isLocalAsset}
                    />
                  </div>
                  <div className="text-start">
                    <h4 className="text-lg font-semibold text-gray-800">
                      {image.title}
                    </h4>
                    <p className="text-gray-600 mt-2">{image.subtitle}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Second row */}
          {validImages.length > 2 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {validImages.slice(2, 4).map((image, index) => {
                const imageSrc = getValidImageUrl(image.src);
                const isLocalAsset = imageSrc.startsWith("/assets");

                return (
                  <div key={index + 2} className="flex flex-col gap-4">
                    <div className="relative h-[400px] rounded-lg overflow-hidden">
                      <Image
                        src={imageSrc}
                        alt={image.alt || `${title} image ${index + 3}`}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        style={{ objectFit: "cover" }}
                        className="w-full h-full"
                        unoptimized={isLocalAsset}
                      />
                    </div>
                    <div className="text-start">
                      <h4 className="text-lg font-semibold text-gray-800">
                        {image.title}
                      </h4>
                      <p className="text-gray-600 mt-2">{image.subtitle}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Third row */}
          {validImages.length > 4 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {validImages.slice(4, 6).map((image, index) => {
                const imageSrc = getValidImageUrl(image.src);
                const isLocalAsset = imageSrc.startsWith("/assets");

                return (
                  <div key={index + 4} className="flex flex-col gap-4">
                    <div className="relative h-[400px] rounded-lg overflow-hidden">
                      <Image
                        src={imageSrc}
                        alt={image.alt || `${title} image ${index + 5}`}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        style={{ objectFit: "cover" }}
                        className="w-full h-full"
                        unoptimized={isLocalAsset}
                      />
                    </div>
                    <div className="items-center">
                      <h4 className="text-lg font-semibold text-gray-800">
                        {image.title}
                      </h4>
                      <p className="text-gray-600 mt-2">{image.subtitle}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default ContentSection;
