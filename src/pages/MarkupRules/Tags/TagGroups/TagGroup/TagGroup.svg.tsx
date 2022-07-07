import React from "react";

export const PurpleCircleSvg = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="8" cy="8" r="7.5" fill="white" stroke="#9254DE" />
      <circle cx="8" cy="8" r="4" fill="#9254DE" />
    </svg>
  );
};
