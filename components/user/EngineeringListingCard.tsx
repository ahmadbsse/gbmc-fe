import { useRouter } from "next/router";
import Image from "next/image";

import type { EngineeringCardProps } from "@/types";

const EngineeringListingCard: React.FC<EngineeringCardProps> = ({ title, description, image }) => {
  const router = useRouter();
  return (
    <div
      className="cursor-pointer overflow-hidden rounded-lg bg-white shadow-md hover:shadow-lg"
      onClick={() => {
        router.push("/engineering-article");
      }}
    >
      <Image
        height={160}
        width={240}
        src={image}
        alt={title}
        className="h-40 w-full object-cover"
      />
      <div className="p-4">
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm">{description}</p>
      </div>
    </div>
  );
};
export default EngineeringListingCard;
