import { TableColumn } from "./Table";

export default function Thead({ columns }: { columns: TableColumn[] }) {
  return (
    <thead className="h-fit flex w-full bg-[#F2F7FF] text-[#0066FF] sticky top-0 z-10">
      <tr className="flex w-full">
        {columns.map(({ title, maxWidth, hidden }, columnKey) => (
          <th
            key={columnKey}
            scope="col"
            className="w-full flex items-center p-4 border-r-[1px] border-b-[1px] text-left border-[#D1D5E4] last:border-r-0 font-bold"
            style={{ maxWidth, display: hidden ? "none" : "flex" }}
          >
            {title}
          </th>
        ))}
      </tr>
    </thead>
  );
}
