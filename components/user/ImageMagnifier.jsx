"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Script from "next/script";

const ImageMagnifier = ({ image, title }) => {
  const containerRef = useRef(null);
  const imageWrapperRef = useRef(null);
  const zoomRef = useRef(null);
  const driftInstanceRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);

  let imageUrl = generateAssetedUrl(src);

  const destroyDrift = () => {
    if (driftInstanceRef.current) {
      driftInstanceRef.current.destroy();
      driftInstanceRef.current = null;
    }
  };
  const setDrift = (imgElement) => {
    driftInstanceRef.current = new window.Drift(imgElement, {
      paneContainer: zoomRef.current,
      inlinePane: false,
      containInline: false,
      hoverBoundingBox: true,
      zoomFactor: 1.5,
      handleTouch: true,
      inlineOffsetX: 0,
      inlineOffsetY: 0,
      touchDelay: 100,
      sourceAttribute: "data-zoom",
    });
  };
  useEffect(() => {
    // Initialize Drift zoom when the component mounts and the script is loaded
    const initDrift = () => {
      if (
        typeof window !== "undefined" &&
        window.Drift &&
        containerRef.current &&
        imageWrapperRef.current &&
        zoomRef.current &&
        image?.formats?.actual
      ) {
        // Clean up any existing instance
        destroyDrift();

        // Find the img element inside the Next.js Image component
        const imgElement = imageWrapperRef.current.querySelector("img");

        if (!imgElement) return;

        // Set the data-zoom attribute on the actual img element
        imgElement.setAttribute("data-zoom", imageUrl);

        // Create new Drift instance
        setDrift(imgElement);
      }
    };

    // Small delay to ensure the Image component has rendered fully
    const timer = setTimeout(() => {
      // Check if Drift is already loaded
      if (typeof window !== "undefined" && window.Drift) {
        initDrift();
      } else {
        // If not, we'll wait for the script onLoad event
        window.initDrift = initDrift;
      }
    }, 100);

    // Clean up on unmount
    return () => {
      clearTimeout(timer);
      if (driftInstanceRef.current) {
        driftInstanceRef.current.destroy();
        driftInstanceRef.current = null;
      }
    };
  }, [image]);

  if (!image?.formats?.actual) {
    return null;
  }

  return (
    <>
      {/* Load Drift Zoom script */}
      <Script
        src="https://cdn.jsdelivr.net/npm/drift-zoom@1.5.1/dist/Drift.min.js"
        strategy="lazyOnload"
        onLoad={() => {
          if (typeof window.initDrift === "function") {
            window.initDrift();
          }
        }}
      />

      <div className="overflow-hidden rounded-lg shadow-md" ref={containerRef}>
        <div className="flex w-full items-center justify-center">
          {image?.formats?.actual && (
            <div className="h-60 w-full p-1 lg:h-96">
              {/* Image wrapper with ref */}
              <div
                className="h-full w-full"
                ref={imageWrapperRef}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                <Image
                  width={image.formats.actual.width}
                  height={image.formats.actual.height}
                  src={imageUrl}
                  alt={title || "Product image"}
                  className="h-full w-full cursor-crosshair object-contain p-1"
                  priority={true}
                  unoptimized={true} // Important: prevents Next.js from optimizing this image
                />
              </div>
            </div>
          )}
        </div>

        {/* Zoom pane container */}
      </div>
      <div
        ref={zoomRef}
        className="drift-zoom-pane absolute z-20 h-[200px] w-[200px] rounded-md border border-gray-200 bg-white shadow-lg sm:ml-[350px] md:ml-[350px] lg:ml-[480px] xl:ml-[610px]"
        style={isHovering ? {} : { display: "none" }}
      />

      {/* Add custom styles */}
      <style jsx global>{`
        .drift-bounding-box {
          background-color: rgba(0, 0, 0, 0.15);
          border: 1px solid #ffbf32;
          height: 100px !important;
          width: 100px !important;
        }
      `}</style>
    </>
  );
};

export default ImageMagnifier;
