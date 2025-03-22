import { Metadata } from 'next';
import { SupportedLocale } from "@/types/project";

interface Params {
    locale: SupportedLocale;
}

interface LayoutProps {
    children: React.ReactNode;
    params: Promise<Params>;
}

export async function generateMetadata({
    params
}: LayoutProps): Promise<Metadata> {
    const resolvedParams = await params;
    const { locale } = resolvedParams;

    // SEO Titles based on language
    const title =
        locale === "ka" ? "სერვისები | Draftworks Project" :
            locale === "ru" ? "Услуги | Draftworks Project" :
                "Services | Draftworks Project";

    // SEO Descriptions based on language
    const description =
        locale === "ka" ? "ჩვენ გთავაზობთ პროფესიონალურ არქიტექტურულ და დიზაინერულ მომსახურებას. გაეცანით ჩვენს სერვისებს." :
            locale === "ru" ? "Мы предлагаем профессиональные архитектурные и дизайнерские услуги. Ознакомьтесь с нашими услугами." :
                "Professional architectural and design services including BIM modeling, interior design, and building permit documentation. Explore our services.";

    return {
        title,
        description,
        keywords: ['architecture services', 'BIM modeling', 'interior design', 'building permit', 'tender documentation'],
        openGraph: {
            title,
            description,
            type: 'website',
            locale: locale === 'ka' ? 'ka_GE' : locale === 'ru' ? 'ru_RU' : 'en_US',
            url: `https://draftworksproject.com/${locale}/services`,
            siteName: 'Draftworks Project',
        },
    };
}

export default async function ServicesLayout({
    children,
    params,
}: LayoutProps) {
    return (
        <>
            {children}
        </>
    );
}
