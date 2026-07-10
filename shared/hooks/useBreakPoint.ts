import { useEffect, useState } from "react";

export function useBreakpoint() {
  const getWidth = () => window.innerWidth;

  const [width, setWidth] = useState(getWidth);

  useEffect(() => {
    const handleResize = () => setWidth(getWidth());

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const breakpoint =
    width < 768
      ? "mobile"
      : width < 1024
      ? "tablet"
      : "desktop";

  return {
    width,
    breakpoint,
    isMobile: breakpoint === "mobile",
    isTablet: breakpoint === "tablet",
    isDesktop: breakpoint === "desktop",
  };
}