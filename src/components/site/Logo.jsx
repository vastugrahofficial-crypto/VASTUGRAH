import logoMark from "@/assets/logo-mark.png";

/**
 * The VASTUGRAH mark — the supplied circular logo, cropped to the disc only.
 * Size it with className; it is always clipped to a circle.
 */
export default function Logo({ className = "h-11 w-11", alt = "VASTUGRAH emblem" }) {
  return (
    <img
      src={logoMark}
      alt={alt}
      width={256}
      height={256}
      className={`shrink-0 rounded-full object-cover ${className}`}
    />
  );
}