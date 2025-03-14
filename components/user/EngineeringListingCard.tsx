import type { EngineeringCardProps } from "@/types";
import Link from "next/link";
import { BaseImage, BaseVideo } from "../common";

const EngineeringListingCard: React.FC<EngineeringCardProps> = ({
  id,
  title,
  image,
  featured,
  isImage,
  heroVideo,
}) => {
  return (
    <Link className="" href={`/engineering/${id}`}>
      <div className="relative w-[280px] min-w-[280px] rounded-lg border border-gray-200 bg-white shadow-sm transition xs:w-[330px] sm:w-auto">
        {featured ? (
          <div className="absolute right-2 top-4 rounded bg-primary px-1 text-xs font-bold">
            <span>Featured</span>
          </div>
        ) : null}
        <div className="flex h-[200px] w-full items-center justify-center border-b border-gray-200 p-1">
          {isImage && image ? (
            <BaseImage
              width={image?.formats?.thumbnail?.width}
              height={image?.formats?.thumbnail?.height}
              src={image?.formats?.thumbnail?.url}
              alt={title}
              priority={true}
              classes=" object-contain "
            />
          ) : heroVideo ? (
            <BaseVideo
              src={heroVideo?.url}
              autoPlay={false}
              muted={true}
              loop={false}
              classes="object-contain rounded-t-lg"
            />
          ) : null}
        </div>
        <h3 title={title} className="truncate p-4 text-center text-base font-bold sm:text-lg">
          {title}
        </h3>
      </div>
    </Link>
  );
};
export default EngineeringListingCard;
