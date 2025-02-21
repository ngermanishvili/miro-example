import Image from "next/image";
import type { FC } from "react";

type CastMember = {
    name: string;
    character: string;
    photo: string;
};

interface CastListProps {
    cast: CastMember[];
}

const CastList: FC<CastListProps> = ({ cast }) => {
    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Cast</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {cast.map((member, index) => (
                    <div key={index} className="space-y-2">
                        <div className="aspect-square relative rounded-lg overflow-hidden bg-zinc-800">
                            <Image
                                src={member.photo || "/placeholder.svg"}
                                alt={member.name}
                                fill
                                className="object-cover hover:scale-105 transition-transform duration-200"
                            />
                        </div>
                        <div className="text-center">
                            <p className="font-medium text-sm truncate">{member.name}</p>
                            <p className="text-xs text-gray-400 truncate">{member.character}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CastList;