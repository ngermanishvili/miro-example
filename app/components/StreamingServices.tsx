import { TvIcon, PlayCircleIcon, FilmIcon, ShoppingCartIcon } from "lucide-react"

const services = [
  { name: "Netflix", color: "bg-red-600", icon: TvIcon },
  { name: "Hulu", color: "bg-green-500", icon: PlayCircleIcon },
  { name: "HBO", color: "bg-purple-600", icon: FilmIcon },
  { name: "Prime", color: "bg-blue-500", icon: ShoppingCartIcon },
]

interface StreamingServicesProps {
  className?: string;
}

export default function StreamingServices({ className = "" }: StreamingServicesProps) {
  return (
    <div className="py-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Popular Services</h2>
        <a href="#" className="text-sm text-gray-400 hover:text-white">
          View All
        </a>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {services.map((service) => (
          <div
            key={service.name}
            className={`${service.color} rounded-md p-4 flex items-center justify-center transition-transform hover:scale-105 cursor-pointer`}
          >
            <service.icon className="w-6 h-6 mr-2" />
            <span className="font-medium text-sm">{service.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

