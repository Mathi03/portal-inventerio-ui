import { FC, useEffect, useState } from 'react';

export type DropdownItem = {
  text: string;
  onClick: () => void;
};

export interface DropdownProps {
  title: string;
  items: DropdownItem[];
  isActive: boolean;
  onItemSelected: () => void;
  index: number;
  indexSelect?: number;
  setIndexSelected?: any;
}

const Dropdown: FC<DropdownProps> = ({
  title,
  items,
  isActive,
  onItemSelected,
  index,
  indexSelect,
  setIndexSelected
}) => {
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    console.log(index, indexSelect);
    if (index != indexSelect) {
      setIsOpen(false);
    }
  }, [indexSelect]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    setIndexSelected(index);
  };

  const handleItemClick = (onClick: () => void) => {
    onClick();
    onItemSelected();
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className={`px-4 py-2 font-medium border-b-2 ${
          isActive ? 'border-[#0066FF]' : 'border-transparent'
        } text-gray-600 flex items-center justify-between`}
      >
        {title}
        <svg
          className={`w-4 h-4 ml-2 transition-transform duration-200 ${
            isOpen ? 'transform rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          {' '}
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          ></path>{' '}
        </svg>
      </button>
      {isOpen && (
        <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-300 shadow-lg rounded-md z-50">
          {items.map((item, index) => (
            <button
              key={index}
              onClick={() => handleItemClick(item.onClick)}
              className="block w-full px-4 py-2 text-left text-black hover:bg-gray-100"
            >
              {item.text}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
