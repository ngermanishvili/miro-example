/**
 * ფუნქცია formatCraftsSchoolDescription გარდაქმნის crafts-school პროექტის აღწერას
 * სტრუქტურირებულ ფორმატში HTML ელემენტებთან ერთად.
 * 
 * @param description აღწერის მასივი
 * @returns ფორმატირებული აღწერის მასივი HTML ელემენტებით
 */

// პოზიციის ინტერფეისი
interface SectionPosition {
    start: number;
    title: string;
    isMain: boolean;
}

export const formatCraftsSchoolDescription = (description: string[]): string[] => {
    // თუ აღწერა არის ერთი დიდი ტექსტი არაის პირველ ელემენტში
    if (description.length === 1) {
        const fullText = description[0];

        // სექციების სათაურები, რომლებიც უნდა გამოიყოს
        const sectionTitles = [
            { title: "Crafts School at Slot Schaesberg: Merging Tradition with Modern Design", isMain: true },
            { title: "Design Approach & Concept", isMain: false },
            { title: "Structural & Material Strategy", isMain: false },
            { title: "Roof & Spatial Organization", isMain: false },
            { title: "Context & Site Integration", isMain: false },
            { title: "Conclusion", isMain: false }
        ];

        // მასივი HTML სტრიქონების შესანახად
        const formattedSections: string[] = [];

        // ვპოულობთ სექციების დასაწყისებს
        const sections: SectionPosition[] = [];

        sectionTitles.forEach(({ title, isMain }) => {
            const index = fullText.indexOf(title);
            if (index !== -1) {
                sections.push({ start: index, title, isMain });
            }
        });

        // ვალაგებთ სექციებს ტექსტში მათი პოზიციების მიხედვით
        sections.sort((a, b) => a.start - b.start);

        // ვამუშავებთ ყველა სექციას
        for (let i = 0; i < sections.length; i++) {
            const currentSection = sections[i];
            const nextSection = i < sections.length - 1 ? sections[i + 1] : null;

            // სექციის სათაური - მთავარი სათაური ან ქვესათაური
            const titleTag = currentSection.isMain ? "h1" : "h2";
            const titleClass = currentSection.isMain
                ? "text-xl font-bold mb-4 pt-2"
                : "text-lg font-semibold mt-6 mb-2 pt-2";

            formattedSections.push(`<${titleTag} class="${titleClass}">${currentSection.title}</${titleTag}>`);

            // სექციის ტექსტი
            if (nextSection) {
                const sectionText = fullText.substring(
                    currentSection.start + currentSection.title.length,
                    nextSection.start
                ).trim();

                if (sectionText) {
                    formattedSections.push(`<p class="mb-4">${sectionText}</p>`);
                }
            } else {
                // ბოლო სექცია
                const sectionText = fullText.substring(
                    currentSection.start + currentSection.title.length
                ).trim();

                if (sectionText) {
                    formattedSections.push(`<p class="mb-4">${sectionText}</p>`);
                }
            }
        }

        return formattedSections;
    }

    // თუ აღწერა უკვე არის მასივის ფორმატში, ვაბრუნებთ ისევ მასივს
    return description;
};