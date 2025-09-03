import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import IconButton from '../IconButton';

export default function Pagination({
  currentDefault = 1,
  items,
  itemPerPage,
  onPageChange
}: {
  currentDefault?: number;
  items: number;
  itemPerPage: number;
  onPageChange: (page: number, limit: number) => void;
}) {
  const [current, setCurrent] = useState<number>(currentDefault);
  const [perPage, setPerPage] = useState<number>(itemPerPage);
  const [containerWidth, setContainerWidth] = useState<number>(300);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalPages = Math.ceil(items / perPage);

  const buttonWidth = 36;
  const arrowWidth = 36;
  const paddingMargin = 16;
  const ellipsisWidth = 32;

  const maxButtons = Math.max(
    3, // Minimum 1 button
    Math.floor(
      (containerWidth -
        2 * arrowWidth -
        // selectWidth -
        // textWidth -
        paddingMargin -
        2 * ellipsisWidth) /
        buttonWidth
    )
  );

  const paginations = useMemo(() => {
    const pages: (number | string)[] = [];

    if (totalPages <= maxButtons) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      const sidePages = Math.floor((maxButtons - 2) / 2);
      let start = Math.max(2, current - sidePages);
      let end = Math.min(totalPages - 1, current + sidePages);

      if (end - start + 1 < maxButtons - 2) {
        if (current < totalPages / 2) {
          end = Math.min(totalPages - 1, start + maxButtons - 3);
        } else {
          start = Math.max(2, end - (maxButtons - 3));
        }
      }

      if (start > 2 && maxButtons !== 3) {
        start = start - 2;
        pages.push('...');
      }
      if (maxButtons !== 3) {
        if (end < totalPages - 1) end = end - 1;
        else start = start - 1;
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages - 1 && maxButtons !== 3) {
        pages.push('...');
      }

      pages.push(totalPages);
    }

    return pages;
  }, [totalPages, current, maxButtons]);

  const activeClassName = useCallback(
    (pag: number) => {
      return pag === current ? 'bg-[#0066FF] text-white' : '';
    },
    [current]
  );

  const handlePageChange = (newPage: number) => {
    setCurrent(newPage);
    onPageChange(newPage, perPage);
  };

  const handlePerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPerPage = parseInt(e.target.value);
    setPerPage(newPerPage);
    setCurrent(1);
    onPageChange(1, newPerPage);
  };

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);

    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  return (
    <footer className="flex justify-end items-center">
      <div className="flex gap-4 items-center mr-[64px] text-sm font-semibold">
        <p>Mostrar</p>
        <select
          className="bg-[#0066FF0D] py-2 pr-6 pl-4 rounded-full"
          value={perPage}
          onChange={handlePerPageChange}
        >
          <option value="10" className="w-full">
            10
          </option>
          <option value="20" className="w-full">
            20
          </option>
          <option value="30" className="w-full">
            30
          </option>
        </select>
        <p>Por página</p>
      </div>
      <div
        ref={containerRef}
        className="w-fit flex items-center rounded-full gap-2 px-2 py-1 bg-[#0066FF0D]"
      >
        <IconButton
          icon="arrow_back_ios_new"
          onClick={() => handlePageChange(current - 1)}
          disabled={current === 1}
        />
        {paginations.map((pag, index) =>
          typeof pag === 'string' ? (
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
              onClick={() => handlePageChange(pag)}
            >
              {pag}
            </button>
          )
        )}
        <IconButton
          icon="arrow_forward_ios"
          onClick={() => handlePageChange(current + 1)}
          disabled={current == totalPages}
        />
      </div>
    </footer>
  );
}
