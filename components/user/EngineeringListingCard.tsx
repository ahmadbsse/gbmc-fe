import type { EngineeringCardProps } from "@/types";
import Link from "next/link";
import { BaseImage } from "../common";

const EngineeringListingCard: React.FC<EngineeringCardProps> = ({ id, title, image, featured }) => {
  return (
    <Link href={`/engineering/${id}`}>
      <div className="group relative w-[250px] cursor-pointer rounded-lg shadow-md hover:shadow-lg">
        {image ? (
          <BaseImage
            height={160}
            width={240}
            src={image}
            alt={title}
            classes="h-40 w-full object-contain rounded-lg"
          />
        ) : null}
        <p className="absolute bottom-4 left-2 text-sm font-semibold text-white [text-shadow:_0_4px_8px_#2196F3] lg:left-4 lg:text-xl">
          {title}
        </p>
        {featured ? (
          <div className="absolute right-2 top-2 rounded bg-primary px-1 text-xs font-semibold">
            <span>Featured</span>
          </div>
        ) : null}
        <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black bg-opacity-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <p className="absolute bottom-4 left-2 text-sm font-semibold text-white lg:left-4 lg:text-xl">
            {title}
          </p>
        </div>
      </div>
    </Link>
  );
};
export default EngineeringListingCard;
