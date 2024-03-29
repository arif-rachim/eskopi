import useObserver, {useObserverListener} from "components/useObserver";
import {useEffect} from "react";

export default function withAutoPopulateColumn(Component) {
    return function WithAutoPopulateColumn({$data, ...props}) {

        let {columns, ...data} = props?.data;
        columns = columns?.columns;
        const nextProps = {...props, data};

        const [$columns, setColumns] = useObserver(() => {
            return constructColumns($data?.current, columns);
        });

        useObserverListener($data, data => {
            setColumns(constructColumns(data, columns));
        });
        useEffect(() => {
            setColumns(constructColumns($data.current, columns));
        }, [$data, columns, setColumns])

        return <Component $columns={$columns} $data={$data} {...nextProps}/>
    }
}

function constructColumns(rows, columns) {
    if (columns) {
        const percentage = Math.round(100 / columns.length);
        return columns.reduce((acc, column) => {
            const columnKey = typeof column.column === 'string' ? column.column : column.column.name;
            acc[columnKey] = {
                title: column.name,
                width: `${percentage}%`,
                dataCellRenderer: column.renderer
            }
            return acc;
        }, {});
    }

    rows = rows || [];
    if (!Array.isArray(rows)) {
        return {};
    }
    return rows.reduce((acc, row) => {
        Object.keys(row).filter(col => !col.endsWith('_')).forEach(col => {
            acc[col] = acc[col] || {width: 0};
            const rowColWidth = row[col].toString().length * 7;
            acc[col].width = acc[col].width < rowColWidth ? rowColWidth : acc[col].width;
        })
        return acc;
    }, {});
}