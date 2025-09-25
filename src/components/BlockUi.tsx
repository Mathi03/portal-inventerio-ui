import React from "react";

type BlockUIProps = {
  blocked?: boolean;
  className?: React.HTMLAttributes<HTMLDivElement>["className"];
  children: React.ReactNode;
};

const BlockUI: React.FC<BlockUIProps> = ({
  blocked = false,
  className,
  children,
}) => {
  return (
    <div className={`relative ${className ?? ""}`}>
      <div className={blocked ? "pointer-events-none opacity-60" : ""}>
        {children}
      </div>
    </div>
  );
};

export default BlockUI;
