import Image from "next/image";

interface CustomImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  classes?: string;
  priority?: boolean;
  fill?: boolean;
}

const BaseImage = ({
  src,
  alt,
  width,
  height,
  classes = "",
  priority = false,
  fill = false,
}: CustomImageProps) => {
  const fullUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}${src}`;
  return (
    <Image
      className={`${classes}`}
      src={fullUrl}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      fill={fill}
    />
  );
};

export default BaseImage;
