import {
  Wifi, Wind, Tv, Refrigerator, Droplets, Waves, ParkingCircle, Coffee,
  Fan, PawPrint, Cookie, Eye, EyeOff, AppWindow, Ban, BedDouble,
  Sparkles, HelpCircle,
} from "lucide-react";

const ICON_MAP: Record<string, React.ElementType> = {
  wifi: Wifi,
  ac: Wind,
  tv: Tv,
  fridge: Refrigerator,
  "hot-water": Droplets,
  "balcony-river": Waves,
  parking: ParkingCircle,
  breakfast: Coffee,
  "river-view": Eye,
  "private-shower": Droplets,
  hairdryer: Fan,
  "sofa-bed": BedDouble,
  kettle: Coffee,
  "no-view": EyeOff,
  "no-pets": PawPrint,
  "no-window": AppWindow,
  "coffee-snack": Cookie,
  toiletries: Sparkles,
  "drinking-water": Droplets,
  "no-breakfast": Ban,
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