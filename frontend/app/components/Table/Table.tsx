import {Typography} from "@material-tailwind/react";
import {Key, ReactNode} from "react";
import RowActionButton, {RowAction} from "@/app/components/Table/RowActionButton";

export interface Row<T> {
  value: T,
  index: number,
}

interface Column<T> {
  header: string,
  accessor: (row: Row<T>) => ReactNode,
}

interface Props<T> {
  data: T[];
  columns: Column<T>[]
  rowKey: (row: T) => Key;
  rowActions?: RowAction<T>[] | ((row: Row<T>) => RowAction<T>[]);
}

const Table = <T, >({data, columns, rowKey, rowActions}: Props<T>): ReactNode => {
  return (
    <table className="w-full min-w-fit table-auto text-left rounded-xl outline-1 outline-blue-gray-100">
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
          </th>,
        )}
        {rowActions?.length && <th key="row-actions"></th>}
      </tr>
      </thead>
      <tbody>
      {data.map((dataValue, index) => {
        const isLast = index === data.length - 1;
        const row: Row<T> = {
          value: dataValue,
          index
        };

        return (
          <tr key={rowKey(row.value)} {...(isLast ? {} : {className: "border-b border-blue-gray-50"})}>
            {columns.map(({header, accessor}) =>
              <td key={header} className="p-4">
                {typeof accessor(row) === "string"
                  ? <Typography variant="small" color="blue-gray" className="font-normal">{accessor(row)}</Typography>
                  : accessor(row)}
              </td>,
            )}
            {rowActions?.length &&
              // w-0 is necessary to avoid extra space on the right
                <td className="w-0">
                    <div className="flex flex-row px-2 gap-1">
                      {(typeof rowActions === "function" ? rowActions(row) : rowActions).map((action, index) =>
                        <RowActionButton {...action} row={row} key={`${rowKey(row.value)}-action-${index}`}/>,
                      )}
                    </div>
                </td>
            }
          </tr>
        );
      })}
      </tbody>
    </table>
  );
}

export default Table;
