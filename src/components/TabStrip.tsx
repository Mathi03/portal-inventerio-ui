import React, { ReactNode, ReactElement } from "react";
import TabStripTab from "./TabStripTab";

interface TabStripProps {
  animation?: boolean;
  selected?: number;
  onSelect: (params: { selected: number }) => void;
  children: ReactNode;
  className?: string;
  header?: ReactNode; // Propiedad opcional para el header
}

const TabStrip: React.FC<TabStripProps> = ({
  animation = true,
  selected = 0,
  onSelect,
  children,
  className = "",
  header,
}) => {
  const handleTabChange = (index: number) => {
    onSelect({ selected: index });
  };

  return (
    <div className={`border border-gray-300 p-5 rounded-lg ${className}`}>
      {header && <div className="mb-5">{header}</div>}

      <div className="w-full mb-5">
        <div className="flex space-x-4 border-b">
          {React.Children.map(children, (child, index) => {
            if (React.isValidElement(child)) {
              return React.cloneElement(child, {
                index,
                onSelect: handleTabChange,
                selected: selected === index,
              });
            }
            return child;
          })}
        </div>
      </div>

      <div
        className={`${
          animation ? "transition-opacity duration-300" : ""
        } border border-gray-300 p-5 rounded-lg`}
      >
        {React.Children.toArray(children)[selected] &&
        React.isValidElement(React.Children.toArray(children)[selected])
          ? (React.Children.toArray(children)[selected] as ReactElement).props
              .children
          : null}
      </div>
    </div>
  );
};

export default TabStrip;
