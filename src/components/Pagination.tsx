import { useCallback, useMemo } from "react";
import IconButton from "./IconButton";

export default function Pagination({
  page,
  items,
  limit,
  onChangePage,
  onChangeLimit,
}: {
  page: number;
  items: number;
  limit: number;
  onChangePage: (page: number) => void;
  onChangeLimit: (limit: number) => void;
}) {
  const paginations = useMemo(() => {
    const array: number[] = [];
    for (let i = 0; i < Math.ceil(items / limit); i++) {
      array[i] = i + 1;
    }
    return array;
  }, [items, limit]);
  const activeClassName = useCallback(
    (pag: number) => {
      return pag === page ? "bg-[#0066FF] text-white" : "";
    },
    [page],
  );
  return (
    <footer className="flex justify-end items-center">
      <div className="flex gap-4 items-center mr-[64px] text-sm font-semibold">
        <p>Mostrar</p>
        <select
          className="bg-[#0066FF0D] py-2 pr-6 pl-4 rounded-full"
          onChange={(e) => onChangeLimit(+e.target.value)}
        >
          <option value="20" className="w-full">
            20
          </option>
          <option value="30" className="w-full">
            30
          </option>
          <option value="40" className="w-full">
            40
          </option>
        </select>
        <p>Por pagina</p>
      </div>
      <div className="w-fit flex items-center rounded-full gap-2 px-2 py-1 bg-[#0066FF0D]">
        <IconButton
          icon="arrow_back_ios_new"
          onClick={() => onChangePage(page - 1 || 1)}
          disabled={page === 1}
        />
        {paginations.map((pag, pagKey) => (
          <button
            key={pagKey}
            className={`${activeClassName(pag)} w-8 h-8 rounded-md text-base font-semibold transition-[200ms]`}
            onClick={() => onChangePage(pag)}
          >
            {pag}
          </button>
        ))}
        <IconButton
          icon="arrow_forward_ios"
          onClick={() => onChangePage(page + 1)}
          disabled={page >= paginations.length}
        />
      </div>
    </footer>
  );
}
