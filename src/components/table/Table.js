import List from "components/list/List";
import useObserver, {ObserverValue, useObserverListener} from "components/useObserver";
import {Horizontal, Vertical} from "components/layout/Layout";

function RowItemRenderer(props) {
    const $columns = props.$columns;
    const index = props.index;
    const data = props.data;
    const dataKey = props.dataKey;
    return <Horizontal bB={1}>
        {Object.keys($columns.current).map(columnKey => {
            return <Horizontal bL={1} p={1} overflow={'hidden'} width={$columns.current[columnKey].width}
                               key={dataKey(data)}>{data[columnKey].toString()}</Horizontal>
        })}
    </Horizontal>

}

function handleOnChange() {
    return function onChangeListener(event) {

    };
}


function constructColumns(rows, setColumns) {
    const columnsNames = rows.reduce((acc, row) => {
        Object.keys(row).forEach(col => {
            acc[col] = acc[col] || {width: 0};
            const rowColWidth = row[col].toString().length;
            acc[col].width = acc[col].width < rowColWidth ? rowColWidth : acc[col].width;
        })
        return acc;
    }, {});
    const totalCharacter = Object.keys(columnsNames).reduce((acc, colName) => {
        acc = acc + columnsNames[colName].width;
        return acc;
    }, 0);
    Object.keys(columnsNames).map(col => {
        columnsNames[col].width = Math.round((columnsNames[col].width / totalCharacter) * 100) + '%';
    });
    setColumns(columnsNames);
}

export default function Table({dataKey, $data, domRef}) {
    const [$selectedRow, setSelectedRow] = useObserver();
    const [$columns, setColumns] = useObserver();
    const [$tableData, setTableData] = useObserver(() => {
        if ($data?.current) {
            constructColumns($data.current, setColumns);
            return $data.current
        }
        return undefined;
    });
    useObserverListener($data, data => {
        constructColumns(data, setColumns);
        setTableData(data);
    });
    return <Vertical>
        <Horizontal bB={2} color={'light'} brightness={-1}>
            <ObserverValue $observers={$columns}>
                {(columns) => {
                    if (columns === undefined) {
                        return <Horizontal/>;
                    }
                    return Object.keys(columns).map(col => {
                        return <Horizontal width={columns[col].width} p={1} bL={2}
                                           style={{fontWeight: 'bold'}}>{col}</Horizontal>
                    });
                }}
            </ObserverValue>
        </Horizontal>

        <List itemRenderer={RowItemRenderer}
              onChange={handleOnChange()}
              $value={$selectedRow}
              dataKey={dataKey}
              $data={$tableData}
              domRef={domRef}
              $columns={$columns}

        />

    </Vertical>
}