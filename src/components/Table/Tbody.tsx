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
        <tr key={rowKey} className="flex w-full odd:bg-[#fff]">
          {columns.map(({ key, render, maxWidth, hidden }, columnKey) => (
            <td
              key={columnKey}
              className="w-full p-4 border-r-[1px] border-b-[1px] border-[#D1D5E4] last:border-r-0 
                        break-words whitespace-normal overflow-hidden"
              hidden={hidden}
              style={{ maxWidth }}
            >
              {render ? render(row) : row[key as string]}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}
