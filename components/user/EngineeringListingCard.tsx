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
    <Link href={`/engineering/${id}`}>
      <div className="rounded-lg bg-white shadow-md hover:shadow-lg">
        <div className="relative cursor-pointer border-b border-gray-200">
          {isImage && image ? (
            <div className="mx-auto max-h-[180px] w-[250px]">
              <BaseImage
                height={160}
                width={240}
                src={image}
                alt={title}
                classes="h-40 w-full object-contain rounded-t-lg"
              />
            </div>
          ) : heroVideo ? (
            <div className="mx-auto h-[160px] w-[250px]">
              <BaseVideo
                src={heroVideo}
                autoPlay={false}
                muted={true}
                loop={false}
                classes="object-contain rounded-t-lg"
              />
            </div>
          ) : null}
          {featured ? (
            <div className="absolute right-2 top-2 rounded bg-primary px-1 text-xs font-semibold">
              <span>Featured</span>
            </div>
          ) : null}
        </div>
        <h3 title={title} className="truncate p-4 text-center text-base font-semibold sm:text-lg">
          {title}
        </h3>
      </div>
    </Link>
  );
};
export default EngineeringListingCard;
