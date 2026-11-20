/* The ZK monogram: a Z whose right edge is the stem of the K.
   Drawn on a 50.5 x 36 grid with 7-unit strokes; it takes the text color. */
export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="5 14 50.5 36" aria-hidden className={className} fill="currentColor">
      <path fillRule="evenodd" d="M5 14H40V50H5V43L23.8 21H5ZM33 21V43H14.2Z" />
      <path d="M37.5 32 47.5 14H55.5L45.5 32 55.5 50H47.5Z" />
    </svg>
  );
}

/* Mark + name, used in the nav and footer */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 whitespace-nowrap ${className}`}>
      <LogoMark className="h-[20px] w-auto shrink-0" />
      <span className="text-[18px] font-[620] leading-none tracking-[-0.012em]">Zac Klein</span>
    </span>
  );
}
