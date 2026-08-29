import { artworkSizeForUrl } from "@/lib/timeline/artwork-size";
import { cn } from "@/lib/utils";

/** Reserves the painting's aspect ratio so timeline scroll does not jump on load. */
export function ArtworkFrame({
  src,
  alt,
  imgClassName,
  className,
}: {
  src: string;
  alt: string;
  imgClassName?: string;
  className?: string;
}) {
  const size = artworkSizeForUrl(src);

  return (
    <span
      className={cn("block w-full overflow-hidden bg-surface", className)}
      style={{ aspectRatio: `${size.width} / ${size.height}` }}
    >
      <img
        src={src}
        alt={alt}
        width={size.width}
        height={size.height}
        decoding="async"
        className={cn("block h-full w-full object-cover", imgClassName)}
        onError={(e) => {
          const frame = e.currentTarget.parentElement;
          if (frame) frame.hidden = true;
        }}
      />
    </span>
  );
}
