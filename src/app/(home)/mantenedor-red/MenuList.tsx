import IconButton from "@/components/IconButton";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function MenuList({
  onEdit,
  onDelete,
}: {
  onEdit: () => void;
  onDelete?: () => void;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div>
          <IconButton icon="more_vert" />
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="w-[156px] bg-[white] rounded-[8px] py-2 px-0 overflow-hidden"
        align="end"
      >
        <ul className="grid gap-4 text-base font-medium">
          <li
            className="hover:bg-[#0066FF]/10 hover:text-[#0066FF] py-2 px-4 cursor-pointer"
            onClick={onEdit}
          >
            Editar
          </li>
          <li
            className="hover:bg-[#0066FF]/10 hover:text-[#0066FF] py-2 px-4 cursor-pointer"
            onClick={onDelete}
          >
            Eliminar
          </li>
        </ul>
      </PopoverContent>
    </Popover>
  );
}
