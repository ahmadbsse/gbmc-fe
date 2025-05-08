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
  // Check if the src is a valid URL
  const isValidFullUrl = (url: string): boolean => {
    try {
      const parsed = new URL(url);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      return false;
    }
  };
  const fullUrl = isValidFullUrl(src) ? src : `${process.env.NEXT_PUBLIC_API_BASE_URL}${src}`;
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
