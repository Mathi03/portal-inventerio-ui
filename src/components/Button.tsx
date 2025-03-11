import {
  ButtonPrimary,
  ButtonSecondary,
  ButtonLink,
} from "@telefonica/mistica";
import { ButtonElement } from "@telefonica/mistica/dist/button";
import { useMemo } from "react";

type ButtonElementProps = ButtonElement["props"];

export interface ButtonProps extends ButtonElementProps {
  variant?: "primary" | "secondary" | "link";
  onClick?: (e: any) => void;
}

export default function Button({
  variant = "primary",
  children,
  onClick,
  showSpinner,
  className,
  disabled,
  EndIcon,
  StartIcon,
  to,
}: ButtonProps) {
  const Component = useMemo(() => {
    switch (variant) {
      case "secondary":
        return ButtonSecondary;
      case "link":
        return ButtonLink;
      default:
        return ButtonPrimary;
    }
  }, [variant]);

  return (
    <div className="contents" onClick={onClick}>
      <Component
        submit
        showSpinner={showSpinner}
        className={className}
        disabled={disabled}
        EndIcon={EndIcon}
        StartIcon={StartIcon}
        to={to}
      >
        {children}
      </Component>
    </div>
  );
}
