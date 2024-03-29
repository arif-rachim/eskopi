import List from "components/list/List";
import useObserver, {ObserverValue, useObserverListener} from "components/useObserver";
import {Horizontal, Vertical} from "components/layout/Layout";
import {createContext, useContext, useEffect, useState} from "react";
import {isNullOrUndefined} from "components/utils";
import Page from "components/page/Page";

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
 * @param onDataChange is the event when the row data is change
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
function RowItemRenderer({
                             $columns,
                             $list,
                             $value,
                             data,
                             dataKey,
                             dataToLabel,
                             index,
                             onChange,
                             onDataChange,
                             ...props
                         }) {

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
                        let Renderer = column['renderer'] || DefaultCellRenderer;
                        if (column.dataCellRenderer) {
                            Renderer = DataCellRenderer;
                        }
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
                                onChange={onDataChange}
                                pageId={column?.dataCellRenderer?.id}
                            />
                        </Vertical>

                    })
                }}
            </ObserverValue>
        </Horizontal>
    </Vertical>
}

function DataCellRenderer({pageId, value, rowData, onChange, ...props}) {
    const [$localValue, setLocalValue] = useObserver(rowData);
    useEffect(() => setLocalValue(rowData), [rowData, setLocalValue]);
    return <Page pageId={pageId} $value={$localValue} onChange={(rowData) => onChange(rowData)}/>
}

function DefaultCellRenderer({value, ...props}) {
    return <Vertical>
        {JSON.stringify(value)}
    </Vertical>;
}


const TableContext = createContext({});

export function useTableContext() {
    return useContext(TableContext);
}

export default function Table({
                                  dataKey,
                                  name,
                                  $columns,
                                  $data,
                                  $errors,
                                  domRef,
                                  $value,
                                  onBeforeChange,
                                  onChange,
                                  onDataChange,
                                  onBeforeDataChange,
                                  ...props
                              }) {
    const [$localColumns, setLocalColumns] = useObserver($columns?.current)
    useObserverListener($columns, (columns) => {
        if ($localColumns.current !== columns) {
            setLocalColumns(columns)
        }
    })
    return <TableContext.Provider
        value={{
            $localColumns,
            setLocalColumns,
            name,
            $value,
            $errors,
            onChange
        }}>
        <Vertical height={'100%'} {...props}>
            <Horizontal bB={2} color={'light'} brightness={-1} style={{minHeight: 25}}>
                <ObserverValue $observers={$localColumns}>
                    {(columns) => {
                        if (columns === undefined) {
                            return <Horizontal/>;
                        }
                        return Object.keys(columns).map(col => {
                            const column = columns[col];
                            const title = !isNullOrUndefined(column.title) ? column.title : col;
                            return <Horizontal key={col} width={columns[col].width} p={1} bL={2}
                                               style={{fontWeight: 'bold', minWidth: 55}}>{title}</Horizontal>
                        });
                    }}
                </ObserverValue>
            </Horizontal>
            <List itemRenderer={RowItemRenderer}
                  name={name}
                  $value={$value}
                  dataKey={dataKey}
                  $data={$data}
                  domRef={domRef}
                  $columns={$localColumns}
                  onChange={onChange}
                  onDataChange={onDataChange}
                  onBeforeChange={onBeforeChange}
                  onBeforeDataChange={onBeforeDataChange}

            />
        </Vertical>
    </TableContext.Provider>
}

