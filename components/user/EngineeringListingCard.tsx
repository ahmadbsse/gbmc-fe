import type { EngineeringCardProps } from "@/types";
import Link from "next/link";
import { BaseImage } from "../common";

const EngineeringListingCard: React.FC<EngineeringCardProps> = ({ id, title, image }) => {
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
        <p className="absolute bottom-2 left-2 text-sm font-semibold text-white lg:bottom-4 lg:left-4 lg:text-xl">
          {title}
        </p>
      </div>
    </Link>
  );
};
export default EngineeringListingCard;
