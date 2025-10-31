type WidthClass =
  | 'w-4'
  | 'w-5'
  | 'w-6'
  | 'w-7'
  | 'w-8'
  | 'w-9'
  | 'w-10'
  | 'w-11'
  | 'w-12'
  | 'w-14'
  | 'w-16'
  | 'w-20'
  | (string & {});

type HeightClass =
  | 'h-4'
  | 'h-5'
  | 'h-6'
  | 'h-7'
  | 'h-8'
  | 'h-9'
  | 'h-10'
  | 'h-11'
  | 'h-12'
  | 'h-14'
  | 'h-16'
  | 'h-20'
  | (string & {});

type TextSizeClass =
  | 'text-xs'
  | 'text-sm'
  | 'text-base'
  | 'text-lg'
  | 'text-xl'
  | 'text-2xl'
  | 'text-3xl'
  | 'text-4xl'
  | (string & {});

interface IconButtonProps {
  icon: string;
  onClick?: () => void;
  disabled?: boolean;
  buttonWidth?: WidthClass;
  buttonHeight?: HeightClass;
  iconSize?: TextSizeClass;
  className?: React.HTMLAttributes<HTMLElement>['className'];
  title?: string;
}

export default function IconButton({
  icon,
  onClick,
  disabled = false,
  buttonWidth = 'w-9',
  buttonHeight = 'h-9',
  iconSize = 'text-xl',
  className = '',
  title
}: IconButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`material-symbols-outlined cursor-pointer hover:bg-[#0066FF]/15 hover:text-[#0066FF] rounded-full duration-200 flex items-center justify-center ${buttonWidth} ${buttonHeight} ${iconSize} ${
        disabled ? 'opacity-35' : ''
      } ${className}`}
      title={title}
    >
      {icon}
    </button>
  );
}
