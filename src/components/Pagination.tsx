import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  const [containerWidth, setContainerWidth] = useState(300);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalPages = Math.ceil(items / limit);
  const buttonWidth = 36;
  const arrowWidth = 36;
  const paddingMargin = 16;
  const ellipsisWidth = 32;

  const maxButtons = Math.max(
    3,
    Math.floor(
      (containerWidth - 2 * arrowWidth - paddingMargin - 2 * ellipsisWidth) /
        buttonWidth
    )
  );

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const paginations = useMemo(() => {
    const pages: (number | string)[] = [];

    if (totalPages <= maxButtons) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      const sidePages = Math.floor((maxButtons - 2) / 2);
      let start = Math.max(2, page - sidePages);
      let end = Math.min(totalPages - 1, page + sidePages);

      if (end - start + 1 < maxButtons - 2) {
        if (page < totalPages / 2) {
          end = Math.min(totalPages - 1, start + maxButtons - 3);
        } else {
          start = Math.max(2, end - (maxButtons - 3));
        }
      }

      if (start > 2 && maxButtons !== 3) {
        pages.push("...");
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages - 1 && maxButtons !== 3) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages;
  }, [totalPages, page, maxButtons]);

  const activeClassName = useCallback(
    (pag: number) => (pag === page ? "bg-[#0066FF] text-white" : ""),
    [page]
  );

  return (
    <footer className="flex justify-end items-center">
      <div className="flex gap-4 items-center mr-[64px] text-sm font-semibold">
        <p>Mostrar</p>
        <select
          className="bg-[#0066FF0D] py-2 pr-6 pl-4 rounded-full"
          onChange={(e) => onChangeLimit(+e.target.value)}
          value={limit}
        >
          <option value="20">20</option>
          <option value="30">30</option>
          <option value="40">40</option>
        </select>
        <p>Por página</p>
      </div>
      <div
        ref={containerRef}
        className="w-fit flex items-center rounded-full gap-2 px-2 py-1 bg-[#0066FF0D]"
      >
        <IconButton
          icon="arrow_back_ios_new"
          onClick={() => onChangePage(Math.max(1, page - 1))}
          disabled={page === 1}
        />
        {paginations.map((pag, index) =>
          typeof pag === "string" ? (
            <span
              key={index}
              className="w-8 h-8 flex items-center justify-center text-base font-semibold"
            >
              {pag}
            </span>
          ) : (
            <button
              key={index}
              className={`${activeClassName(
                pag
              )} w-auto h-8 min-w-8 rounded-md text-base font-semibold`}
              onClick={() => onChangePage(pag)}
            >
              {pag}
            </button>
          )
        )}
        <IconButton
          icon="arrow_forward_ios"
          onClick={() => onChangePage(Math.min(totalPages, page + 1))}
          disabled={page >= totalPages}
        />
      </div>
    </footer>
  );
}
