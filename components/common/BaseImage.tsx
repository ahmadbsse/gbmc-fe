import Image from "next/image";

interface CustomImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
}

const BaseImage = ({ src, alt, width, height, priority = false }: CustomImageProps) => {
  const fullUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}${src}`;
  return <Image src={fullUrl} alt={alt} width={width} height={height} priority={priority} />;
};

export default BaseImage;
