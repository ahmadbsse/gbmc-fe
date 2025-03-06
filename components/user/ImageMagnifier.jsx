"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Script from "next/script";

const ImageMagnifier = ({ image, title }) => {
  const containerRef = useRef(null);
  const imageWrapperRef = useRef(null);
  const zoomRef = useRef(null);
  const driftInstanceRef = useRef(null);

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
        if (driftInstanceRef.current) {
          driftInstanceRef.current.destroy();
          driftInstanceRef.current = null;
        }

        // Find the img element inside the Next.js Image component
        const imgElement = imageWrapperRef.current.querySelector("img");

        if (!imgElement) return;

        // Set the data-zoom attribute on the actual img element
        const fullImageUrl = process.env.NEXT_PUBLIC_API_BASE_URL + image.formats.actual.url;
        imgElement.setAttribute("data-zoom", fullImageUrl);

        // Create new Drift instance
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

  const imageUrl = process.env.NEXT_PUBLIC_API_BASE_URL + image.formats.actual.url;

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
            <div className="w-full lg:h-96">
              {/* Image wrapper with ref */}
              <div className="h-full w-full" ref={imageWrapperRef}>
                <Image
                  width={image.formats.actual.width}
                  height={image.formats.actual.height}
                  src={imageUrl}
                  alt={title || "Product image"}
                  className="h-full w-full cursor-crosshair object-contain"
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
        className="drift-zoom-pane absolute z-20 hidden h-[200px] w-[200px] rounded-md border border-gray-200 bg-white shadow-lg sm:ml-[350px] sm:block md:ml-[350px] lg:ml-[480px] xl:ml-[610px]"
      />

      {/* Add custom styles */}
      <style jsx global>{`
        .drift-bounding-box {
          background-color: rgba(0, 0, 0, 0.15);
          border: 1px solid #ffbf32;
        }
      `}</style>
    </>
  );
};

export default ImageMagnifier;
