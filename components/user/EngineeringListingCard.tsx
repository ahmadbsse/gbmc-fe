import type { EngineeringCardProps } from "@/types";
import Link from "next/link";
import { BaseImage } from "../common";
import { Star } from "lucide-react";

const EngineeringListingCard: React.FC<EngineeringCardProps> = ({ id, title, image, featured }) => {
  return (
    <Link href={`/engineering/${id}`}>
      <div className="relative cursor-pointer shadow-md hover:shadow-lg">
        <BaseImage
          height={160}
          width={240}
          src={image}
          alt={title}
          classes="h-40 w-full object-cover rounded-lg"
        />
        <p className="absolute bottom-4 left-2 text-sm font-semibold text-white lg:left-4 lg:text-xl">
          {title}
        </p>
        {featured ? (
          <div className="absolute right-2 top-2 rounded-full bg-solidGray/40 p-1">
            <Star className="h-4 w-4 fill-current text-yellow-400" />
          </div>
        ) : null}
      </div>
    </Link>
  );
};
export default EngineeringListingCard;
