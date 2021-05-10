import useObserver, {useObserverListener} from "components/useObserver";
import {useEffect} from "react";

export default function withAutoPopulateColumn(Component) {
    return function WithAutoPopulateColumn({$data,...props}) {
        const columns = props?.data?.columns?.columns;
        const [$columns, setColumns] = useObserver(() => {
            return constructColumns($data?.current,columns);
        });

        useObserverListener($data, data => {
            setColumns(constructColumns(data,columns));
        });
        useEffect(() => {
            setColumns(constructColumns($data.current, columns));
        }, [$data, columns, setColumns])
        return <Component $columns={$columns} $data={$data} {...props}/>
    }
}

function constructColumns(rows,columns) {
    if(columns){
        const percentage = Math.round(100 / columns.length);
        return columns.reduce((acc,column) => {
            acc[column.column.name] = {
                title : column.name,
                width : `${percentage}%`
            }
            return acc;
        },{});
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