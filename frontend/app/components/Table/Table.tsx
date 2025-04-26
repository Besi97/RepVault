import {Typography} from "@material-tailwind/react";
import {Key, ReactNode} from "react";

interface Column<T> {
  header: string,
  accessor: (row: T) => ReactNode,
}

interface Props<T> {
  data: T[];
  columns: Column<T>[]
  rowKey: (row: T) => Key;
}

const Table = <T, >({data, columns, rowKey}: Props<T>): ReactNode => {
  return (
    <table className="w-full min-w-max table-auto text-left rounded-xl overflow-hidden outline-1 outline-blue-gray-100">
      <thead>
        <tr className="border-b border-blue-gray-100 bg-blue-gray-50">
          {columns.map(({header}) =>
            <th key={header} className="p-4">
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal leading-none opacity-70"
              >
                {header}
              </Typography>
            </th>
          )}
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => {
          const isLast = index === data.length - 1;

          return (
            <tr key={rowKey(row)} {...(isLast ? {} : {className: "border-b border-blue-gray-50"})}>
              {columns.map(({header, accessor}) => <td key={header} className="p-4">
                <Typography variant="small" color="blue-gray" className="font-normal">
                  {accessor(row)}
                </Typography>
              </td>)}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default Table;
