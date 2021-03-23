import List from "components/list/List";
import useObserver, {ObserverValue, useObserverListener, useObserverMapper} from "components/useObserver";
import {Horizontal, Vertical} from "components/layout/Layout";
import {createContext, useContext, useState} from "react";
import useTheme from "components/useTheme";
import {mapToNameFactory} from "components/input/Input";

/**
 *
 * @param $columns is the columns array
 * @param $list is the Table $data
 * @param $value is the selectedRow
 * @param data is the currentRow value
 * @param dataKey is the row dataKey callback function
 * @param dataToLabel is the dataItem to string
 * @param index is the rowIndex
 * @param onChange is the onChange selected row
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
function RowItemRenderer({$columns, $list, $value, data, dataKey, dataToLabel, index, onChange, ...props}) {

    const onRowClicked = onChange;
    const $selectedRow = $value;
    const [rowIsSelected, setRowIsSelected] = useState(false);
    useObserverListener($selectedRow, selectedRow => setRowIsSelected(selectedRow === data));
    return <Vertical color={"light"} brightness={rowIsSelected ? -0.5 : 0.5}>
        <Horizontal bB={1} onClick={() => {
            if (onRowClicked) {
                onRowClicked(data);
            }
        }}>
            <ObserverValue $observers={$columns}>
                {(columns) => {
                    columns = columns || [];
                    return Object.keys(columns).map((columnKey, colIndex) => {
                        const column = columns[columnKey];
                        const Renderer = column['renderer'] || DefaultCellRenderer;
                        let value = data[columnKey];
                        return <Vertical bL={1} p={1} overflow={'hidden'}
                                         width={$columns.current[columnKey].width}
                                         key={columnKey} vAlign={'center'} style={{minWidth: 55}}>
                            <Renderer
                                value={value}
                                $columns={$columns}
                                field={columnKey}
                                rowData={data}
                                $tableData={$list}
                                rowIndex={index}
                                colIndex={colIndex}
                            />
                        </Vertical>

                    })
                }}
            </ObserverValue>
        </Horizontal>
    </Vertical>
}

function DefaultCellRenderer({value, ...props}) {
    return <Vertical>
        {value?.toString()}
    </Vertical>;
}

function handleOnChange(onChange, setSelectedRow) {
    return function onChangeListener(data) {
        setSelectedRow(data);
        if (onChange) {
            onChange(data);
        }
    };
}

const TableContext = createContext({});

export function useTableContext() {
    return useContext(TableContext);
}

export default function Table({dataKey, name, $columns, $data, $errors, domRef, $value, onChange, ...props}) {

    const $nameValue = useObserverMapper($value, mapToNameFactory(name));
    const $errorValue = useObserverMapper($errors, mapToNameFactory(name));

    const [$localColumns, setLocalColumns] = useObserver($columns?.current)
    const [$selectedRow, setSelectedRow] = useObserver($nameValue?.current);
    const [$tableData, setTableData] = useObserver($data?.current);
    useObserverListener($nameValue, (value) => {
        if ($selectedRow.current !== value) {
            setSelectedRow(value);
        }
    })
    useObserverListener($columns, (columns) => {
        if ($localColumns.current !== columns) {
            setLocalColumns(columns)
        }
    })
    useObserverListener($data, data => {
        if ($tableData.current !== data) {
            setTableData(data);
        }
    });

    const [theme] = useTheme();
    return <TableContext.Provider
        value={{
            $selectedRow,
            setSelectedRow,
            $tableData,
            setTableData,
            $localColumns,
            setLocalColumns,
            name,
            $value,
            $errors,
            $nameValue,
            $errorValue,
            onChange
        }}>
        <Vertical height={'100%'} {...props}>
            <ObserverValue $observers={$errorValue}>{(error) => {
                return <Horizontal style={{color: theme.danger}}>{error}</Horizontal>;
            }}</ObserverValue>
            <Horizontal bB={2} color={'light'} brightness={-1} style={{minHeight: 25}}>
                <ObserverValue $observers={$localColumns}>
                    {(columns) => {
                        if (columns === undefined) {
                            return <Horizontal/>;
                        }
                        return Object.keys(columns).map(col => {
                            const column = columns[col];
                            const title = column.title || col;
                            return <Horizontal key={col} width={columns[col].width} p={1} bL={2}
                                               style={{fontWeight: 'bold', minWidth: 55}}>{title}</Horizontal>
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
                  $columns={$localColumns}
            />
        </Vertical>
    </TableContext.Provider>
}

