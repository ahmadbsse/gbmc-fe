import { generateAssetsUrl } from "@/utils";

interface CustomVideoProps {
  src: string;
  muted?: boolean;
  autoPlay?: boolean;
  loop?: boolean;
  classes?: string;
}

const BaseVideo = ({ src, autoPlay, muted, loop, classes = "" }: CustomVideoProps) => {
  const fullUrl = generateAssetsUrl(src);
  if (!fullUrl) return null;
  return (
    <video className={`${classes} h-full w-full`} autoPlay={autoPlay} muted={muted} loop={loop}>
      <source src={fullUrl} />
      Your browser does not support the video tag.
    </video>
  );
};

export default BaseVideo;
