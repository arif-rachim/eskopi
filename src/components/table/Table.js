import List from "components/list/List";
import useObserver, {ObserverValue, useObserverListener} from "components/useObserver";
import {Horizontal, Vertical} from "components/layout/Layout";
import {useState} from "react";
import useSlideDownPanel from "../page/useSlideDownPanel";
import ConfigureColumnPanel, {
    createDefaultColumnsArray,
    createDefaultColumnsObject
} from "components/table/ConfigureColumnPanel";

function RowItemRenderer(props) {
    const $columns = props.$columns;
    const index = props.index;
    const data = props.data;
    const onRowClicked = props.onChange;
    const $selectedRow = props.$value;
    const [rowIsSelected, setRowIsSelected] = useState(false);
    useObserverListener($selectedRow, selectedRow => setRowIsSelected(selectedRow === data));

    return <Horizontal bB={1} onClick={() => {
        if (onRowClicked) {
            onRowClicked(data);
        }
    }} color={"light"} brightness={rowIsSelected ? -0.5 : 0.5}>
        <ObserverValue $observers={$columns}>
            {(columns) => {
                columns = columns || [];
                return Object.keys(columns).map(columnKey => {
                    let value = data[columnKey];
                    value = value === undefined ? '' : value;
                    return <Horizontal bL={1} p={1} overflow={'hidden'} width={$columns.current[columnKey].width}
                                       key={columnKey}>{value.toString()}</Horizontal>
                })
            }}
        </ObserverValue>
    </Horizontal>
}

function handleOnChange(onChange, setSelectedRow) {
    return function onChangeListener(data) {
        setSelectedRow(data);
        if (onChange) {
            onChange(data);
        }
    };
}


function calculateColumnsWidth(colNames) {
    const columnsNames = JSON.parse(JSON.stringify(colNames));
    const totalCharacter = Object.keys(columnsNames).reduce((acc, colName) => {
        acc = acc + columnsNames[colName].width;
        return acc;
    }, 0);
    Object.keys(columnsNames).map(col => {
        columnsNames[col].width = Math.round((columnsNames[col].width / totalCharacter) * 100) + '%';
    });
    return columnsNames;
}

function constructColumns(rows) {
    rows = rows || [];
    const columnsNames = rows.reduce((acc, row) => {
        Object.keys(row).forEach(col => {
            acc[col] = acc[col] || {width: 0};
            const rowColWidth = row[col].toString().length;
            acc[col].width = acc[col].width < rowColWidth ? rowColWidth : acc[col].width;
        })
        return acc;
    }, {});
    return columnsNames;
}

export default function Table({dataKey, $data, domRef, $value, onChange}) {
    const [$selectedRow, setSelectedRow] = useObserver(() => {
        if ($data) {
            return $data.current;
        }
        return undefined;
    });
    useObserverListener($value, (newValue) => {
        if ($selectedRow.current !== newValue) {
            setSelectedRow(newValue);
        }
    })
    const [$columnsBasedOnData, setColumnsBasedOnData] = useObserver(() => {
        return constructColumns($data.current);
    });
    const [$persistedColumns, setPersistedColumns] = useObserver(() => {
        return createDefaultColumnsObject(createDefaultColumnsArray($columnsBasedOnData.current));
    });
    const [$actualGridColumn, setActualGridColumn] = useObserver(() => {
        if ($persistedColumns.current && $columnsBasedOnData.current) {
            const persistedColumns = $persistedColumns.current;
            const columnsBasedOnData = $columnsBasedOnData.current;
            const visibleColumns = Object.keys(persistedColumns).filter(key => persistedColumns[key] === true);
            const columns = Object.keys(columnsBasedOnData).filter(key => visibleColumns.indexOf(key) >= 0)
                .reduce((acc, key) => {
                    acc[key] = columnsBasedOnData[key];
                    return acc;
                }, {});

            return columns;
        }
    });
    const [$tableData, setTableData] = useObserver($data?.current);

    useObserverListener([$persistedColumns, $columnsBasedOnData], ([persistedColumns, columnsBasedOnData]) => {
        if (persistedColumns && columnsBasedOnData) {
            const visibleColumns = Object.keys(persistedColumns).filter(key => {
                return persistedColumns[key] === true;
            });
            const columns = Object.keys(columnsBasedOnData).filter(key => visibleColumns.indexOf(key) >= 0)
                .reduce((acc, key) => {
                    acc[key] = columnsBasedOnData[key];
                    return acc;
                }, {});
            setActualGridColumn(calculateColumnsWidth(columns));
        }
    })

    useObserverListener($data, data => {
        const columns = constructColumns(data);
        setColumnsBasedOnData(columns);
        const persistedColumns = createDefaultColumnsObject(createDefaultColumnsArray(columns));
        setPersistedColumns(persistedColumns);
        setTableData(data);
    });

    const showPanel = useSlideDownPanel();

    return <Vertical>
        <Horizontal bB={2} color={'light'} brightness={-1}>
            <ObserverValue $observers={$actualGridColumn}>
                {(columns) => {
                    if (columns === undefined) {
                        return <Horizontal/>;
                    }
                    return Object.keys(columns).map(col => {
                        return <Horizontal key={col} width={columns[col].width} p={1} bL={2}
                                           style={{fontWeight: 'bold'}}>{col}</Horizontal>
                    });
                }}
            </ObserverValue>
        </Horizontal>

        <List itemRenderer={RowItemRenderer}
              onChange={handleOnChange(onChange, setSelectedRow)}
              $value={$selectedRow}
              dataKey={dataKey}
              $data={$tableData}
              domRef={domRef}
              $columns={$actualGridColumn}
        />
        <Horizontal top={3} right={3} style={{position: 'absolute', cursor: 'pointer'}} onClick={async () => {
            const result = await showPanel(ConfigureColumnPanel, {
                $columns: $columnsBasedOnData,
                $value: $persistedColumns
            });
            setPersistedColumns(result);
        }}>
            ⚒
        </Horizontal>

    </Vertical>
}

