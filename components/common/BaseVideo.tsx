interface CustomVideoProps {
  src: string;
  width: number;
  height: number;
  muted?: boolean;
  autoPlay?: boolean;
  loop?: boolean;
}

const BaseVideo = ({ src, width, height, autoPlay, muted, loop }: CustomVideoProps) => {
  const fullUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}${src}`;
  return (
    <video
      className="h-auto w-full rounded-lg"
      width={width}
      height={height}
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
