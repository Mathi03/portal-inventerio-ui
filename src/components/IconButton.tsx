export default function IconButton({
  icon,
  onClick,
  disabled = false,
}: {
  icon: string;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`material-symbols-outlined text-black/65 cursor-pointer hover:bg-[#0066FF]/10 hover:text-[#0066FF] w-9 h-9 rounded-full duration-200 flex items-center justify-center ${disabled && "opacity-35"}`}
    >
      {icon}
    </button>
  );
}
