import { FeatureCardProps } from "@/types";

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon: Icon,
  featured = false,
}) => {
  return (
    <div
      className={`rounded-lg p-6 shadow-md transition-all duration-300 hover:shadow-lg ${featured ? "border-2 border-secondary bg-blue-50" : "bg-white"} `}
    >
      <div className="flex items-start gap-4">
        <div
          className={`rounded-full p-3 ${featured ? "bg-secondary text-white" : "bg-gray-100"} `}
        >
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <h3 className="mb-2 text-lg font-semibold">{title}</h3>
          <p className="">{description}</p>
        </div>
      </div>
    </div>
  );
};
export default FeatureCard;
