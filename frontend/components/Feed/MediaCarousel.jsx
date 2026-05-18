"use client";
import { useEffect, useRef, useMemo, useCallback } from "react";
import { usePostsStore } from "@/stores/usePostsStore";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";

const MediaCarousel = ({ images, postId }) => {
  const currentSlide = usePostsStore(
    (state) => state.postUIState.get(postId)?.currentSlide || 0
  );
  const setCurrentSlide = usePostsStore((state) => state.setCurrentSlide);

  const videoRef = useRef(null);

  const handleCarouselChange = useCallback(
    (api) => {
      if (!api) return;

      const updateSlide = () => {
        setCurrentSlide(postId, api.selectedScrollSnap());
      };

      updateSlide();
      api.on("select", updateSlide);

      return () => api.off("select", updateSlide);
    },
    [postId, setCurrentSlide]
  );

  if (!images || images.length === 0) return null;

  return (
    <div className="relative">
      <Carousel className="w-full" setApi={handleCarouselChange}>
        <CarouselContent>
          {images.map((media, index) => (
            <CarouselItem key={index}>
              <AspectRatio
                ratio={4 / 5}
                className="overflow-hidden shadow-md bg-black"
              >
                {media.imageUrl &&
                  (media.imageUrl.match(/\.(mp4|webm|ogg|mov)$/i) ? (
                    <video
                      ref={videoRef}
                      src={`${
                        process.env.NEXT_PUBLIC_IMAGE_HOSTING_URL
                      }/posts/${media.imageUrl.split("/").pop()}`}
                      className="w-full h-full object-cover"
                      disablePictureInPicture
                      controls
                      controlsList="nodownload nofullscreen noremoteplaybook nopictureinpicture"
                      preload="metadata"
                      playsInline
                      referrerPolicy="no-referrer"
                      crossOrigin="anonymous"
                      style={{ outline: "none" }}
                    >
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <Image
                      src={`${
                        process.env.NEXT_PUBLIC_IMAGE_HOSTING_URL
                      }/posts/${media.imageUrl.split("/").pop()}`}
                      alt={`Post content ${index + 1}`}
                      fill
                      className="object-cover transition-transform duration-300 ease-in-out"
                    />
                  ))}
              </AspectRatio>
            </CarouselItem>
          ))}
        </CarouselContent>
        {images.length > 1 && (
          <>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </>
        )}
      </Carousel>

      {/* Pill-style slide indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
          {images.map((_, index) => (
            <div
              key={index}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                index === currentSlide
                  ? "w-5 bg-white shadow-sm"
                  : "w-1.5 bg-white/50"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MediaCarousel;
