interface CustomVideoProps {
  src: string;
  muted?: boolean;
  autoPlay?: boolean;
  loop?: boolean;
  classes?: string;
}

const BaseVideo = ({ src, autoPlay, muted, loop, classes = "" }: CustomVideoProps) => {
  const isValidFullUrl = (url: string): boolean => {
    try {
      const parsed = new URL(url);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      return false;
    }
  };

  let fullUrl = "";
  if (isValidFullUrl(src)) {
    fullUrl = src;
  } else {
    const result = src.replace("/uploads", "");
    fullUrl = `https://${process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_URL}${result}`;
  }
  if (!fullUrl) return null;
  return (
    <video className={`${classes} h-full w-full`} autoPlay={autoPlay} muted={muted} loop={loop}>
      <source src={fullUrl} />
      Your browser does not support the video tag.
    </video>
  );
};

export default BaseVideo;
