import React from "react";

type IconProps = {
  icon: string;
  className?: string;
  style?: React.CSSProperties;
} & React.HTMLAttributes<HTMLSpanElement>;

export default function Icon({ icon, className, style, ...rest }: IconProps) {
  return (
    <span
      className={`material-symbols-outlined ${className ?? ""}`}
      style={style}
      {...rest}
    >
      {icon}
    </span>
  );
}
