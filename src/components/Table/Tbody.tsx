import { TableColumn } from "./Table";

export default function Tbody({
  columns,
  rows,
}: {
  columns: TableColumn[];
  rows: any[];
}) {
  return (
    <tbody className="h-fit w-full text-base">
      {rows.map((row, rowKey) => (
        <tr key={rowKey} className="flex w-full even:bg-[#f5f5f5]">
          {columns.map(({ key, render, maxWidth, hidden }, columnKey) => (
            <td
              key={columnKey}
              className="w-full p-4 border-r-[1px] border-b-[1px] border-[#D1D5E4] last:border-r-0 text-base items-center text-ellipsis overflow-hidden"
              style={{ maxWidth, display: hidden ? "none" : "flex" }}
            >
              {row[key as string] || render?.(row)}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}
