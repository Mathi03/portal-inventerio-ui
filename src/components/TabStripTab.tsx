interface TabStripTabProps {
  title: string;
  children: React.ReactNode;
  selected: boolean;
  onSelect: (index: number) => void;
  index: number;
  disabled?: boolean;
  className?: string;
}

const TabStripTab: React.FC<TabStripTabProps> = ({
  title,
  children,
  selected,
  onSelect,
  index,
  disabled = false,
  className = "",
}) => {
  const handleTabClick = () => {
    if (!disabled) {
      onSelect(index);
    }
  };

  return (
    <div
      className={`cursor-pointer font-semibold py-2 px-4 rounded-t-md transition-all ${
        selected
          ? "border-blue-500 border-b-2"
          : "text-gray-500 hover:bg-gray-200"
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
      onClick={handleTabClick}
    >
      {title}
    </div>
  );
};

export default TabStripTab;
