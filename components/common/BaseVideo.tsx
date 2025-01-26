interface CustomVideoProps {
  src: string;
  muted?: boolean;
  autoPlay?: boolean;
  loop?: boolean;
  classes?: string;
}

const BaseVideo = ({ src, autoPlay, muted, loop, classes = "" }: CustomVideoProps) => {
  const fullUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}${src}`;
  return (
    <video
      className={`${classes} h-auto w-full rounded-lg`}
      autoPlay={autoPlay}
      muted={muted}
      loop={loop}
    >
      <source src={fullUrl} />
      Your browser does not support the video tag.
    </video>
  );
};

export default BaseVideo;
