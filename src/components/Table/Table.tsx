import { ReactNode } from "react";
import Thead from "./Thead";
import Tbody from "./Tbody";
import TLoading from "./TLoading";
import TEmpty from "./TEmpty";
import Pagination from "./Pagination";

export interface TableColumn<T = any> {
  title?: ReactNode;
  key?: keyof T;
  render?: (row: T) => ReactNode;
  maxWidth?: string;
  hidden?: boolean;
}

interface BaseTableProps {
  columns: TableColumn[];
  rows: any[];
  header?: ReactNode;
  isLoading?: boolean;
  compact?: boolean;
}

// Caso 1: Se pasa el nodo `pagination`, no se requieren los otros props
interface WithCustomPagination extends BaseTableProps {
  pagination: ReactNode;
  onPageChange?: never;
  item?: never;
  itemPerPage?: never;
}

// Caso 2: No se pasa `pagination`, entonces los otros props son obligatorios
interface WithInternalPagination extends BaseTableProps {
  pagination?: undefined;
  onPageChange: (page: number, limit: number) => void;
  item: number;
  itemPerPage: number | null;
}

type TableProps = WithCustomPagination | WithInternalPagination;

export default function Table({
  columns,
  rows,
  header,
  isLoading = false,
  pagination,
  compact = false,
  onPageChange,
  item,
  itemPerPage,
}: TableProps) {
  return (
    <section
      className={`w-full h-full bg-white grid grid-rows-[auto_1fr_auto] overflow-hidden ${!compact && "p-4"} gap-4 rounded-[8px] isolate`}
    >
      {header}
      {isLoading && <TLoading />}
      {!isLoading && rows?.length === 0 && <TEmpty />}
      {!isLoading && rows?.length !== 0 && (
        <table
          className="rounded-[12px] grid content-start overflow-auto border-[#D1D5E4] border-[1px] scroller"
          style={{ gridRow: "2/3" }}
        >
          <Thead columns={columns} />
          <Tbody columns={columns} rows={rows} />
        </table>
      )}
      {pagination ? (pagination): (
        <Pagination
          itemPerPage={itemPerPage}
          items={item}
          onPageChange={onPageChange}
        />
      )}
    </section>
  );
}
