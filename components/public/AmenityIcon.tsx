import { Wifi, Wind, Tv, Refrigerator, Droplets, Waves, ParkingCircle, Coffee, HelpCircle } from "lucide-react";

const ICON_MAP: Record<string, React.ElementType>={ 
  wifi: Wifi,
  ac: Wind,
  tv: Tv,
  fridge: Refrigerator,
  "hot-water": Droplets,
  "balcony-river": Waves,
  parking: ParkingCircle,
  breakfast: Coffee,
};

export function AmenityIcon({
  iconKey,
  size = 18,
  className,
}: {
  iconKey: string;
  size?: number;
  className?: string;
}) {
  const Icon = ICON_MAP[iconKey] ?? HelpCircle;
  return <Icon size={size} className={className} />;
}
