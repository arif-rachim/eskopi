import useObserver, {useObserverListener} from "components/useObserver";


export default function withAutoPopulateColumn(Component) {
    return function WithAutoPopulateColumn({$data, ...props}) {
        const [$columns, setColumns] = useObserver(constructColumns($data?.current));
        useObserverListener($data, data => {
            setColumns(constructColumns(data));
        });
        return <Component $columns={$columns} $data={$data} {...props}/>
    }
}


function constructColumns(rows) {
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