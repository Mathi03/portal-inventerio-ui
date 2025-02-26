import { ReactNode } from "react";
import Thead from "./Thead";
import Tbody from "./Tbody";
import TLoading from "./TLoading";
import TEmpty from "./TEmpty";

export interface TableColumn<T = any> {
  title?: ReactNode;
  key?: keyof T;
  render?: (row: T) => ReactNode;
  maxWidth?: string;
  hidden?: boolean;
}

export default function Table({
  columns,
  rows,
  header,
  isLoading = false,
  pagination,
}: {
  columns: TableColumn[];
  rows: any[];
  header: ReactNode;
  isLoading?: boolean;
  pagination: ReactNode;
}) {
  return (
    <section className="w-full h-full bg-white grid grid-rows-[auto_1fr_auto] overflow-hidden p-4 gap-4 rounded-[8px]">
      {header}
      {isLoading && <TLoading />}
      {!isLoading && rows.length === 0 && <TEmpty />}
      {!isLoading && rows.length !== 0 && (
        <table className="rounded-[12px] grid content-start overflow-auto border-[#D1D5E4] border-[1px] scroller">
          <Thead columns={columns} />
          <Tbody columns={columns} rows={rows} />
        </table>
      )}
      {pagination}
    </section>
  );
}
