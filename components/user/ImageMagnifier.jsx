import { useState } from "react";
import BaseImage from "@/components/common/BaseImage";

const ImageMagnifier = ({ image, title }) => {
  return (
    <>
      {/* Main Image */}
      <div className="overflow-hidden rounded-lg shadow-md">
        <div className="relative flex w-full cursor-crosshair items-center justify-center">
          {image && image?.formats && image?.formats?.actual ? (
            <div className="lg:h-[400px]">
              <BaseImage
                height={image?.formats?.actual?.height}
                width={image?.formats?.actual?.width}
                src={image.formats?.actual?.url}
                alt={title}
                classes="object-contain"
                priority={true}
              />
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default ImageMagnifier;
