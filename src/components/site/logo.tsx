/* The spark: a four-point star with concave sides and softly rounded tips,
   so it stays solid at 16px and clean at 144px. Drawn on a 40 x 40 grid
   (tips 3.7 units from the edge) and cropped to the shape; it takes the text color. */
export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="3.5 3.5 33 33" aria-hidden className={className} fill="currentColor">
      <path d="M20.43 4.39C23.13 12.51 27.49 16.87 35.61 19.57Q37 20 35.61 20.43C27.49 23.13 23.13 27.49 20.43 35.61Q20 37 19.57 35.61C16.87 27.49 12.51 23.13 4.39 20.43Q3 20 4.39 19.57C12.51 16.87 16.87 12.51 19.57 4.39Q20 3 20.43 4.39Z" />
    </svg>
  );
}

/* Mark + name, used in the nav and footer */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 whitespace-nowrap ${className}`}>
      <LogoMark className="h-[22px] w-[22px] shrink-0" />
      <span className="text-[18px] font-[620] leading-none tracking-[-0.012em]">Founder</span>
    </span>
  );
}
