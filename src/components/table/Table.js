import List from "components/list/List";
import useObserver, {ObserverValue, useObserverListener, useObserverMapper} from "components/useObserver";
import {Horizontal, Vertical} from "components/layout/Layout";
import {useState} from "react";
import useTheme from "components/useTheme";
import {mapToNameFactory} from "components/input/Input";

function RowItemRenderer(props) {
    const $columns = props.$columns;
    const data = props.data;
    const onRowClicked = props.onChange;
    const $selectedRow = props.$value;
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
                    return Object.keys(columns).map(columnKey => {
                        let value = data[columnKey];
                        value = value === undefined ? '' : value;
                        const valueIsArray = Array.isArray(value);
                        return <Horizontal bL={1} p={1} overflow={'hidden'}
                                           width={$columns.current[columnKey].width}
                                           key={columnKey} vAlign={'center'} style={{minWidth: 55}}>
                            <Horizontal flex={'1 0 auto'}>
                                {valueIsArray ? `${value.length}` : value}
                            </Horizontal>
                        </Horizontal>

                    })
                }}
            </ObserverValue>
        </Horizontal>
    </Vertical>
}


function handleOnChange(onChange, setSelectedRow) {
    return function onChangeListener(data) {
        setSelectedRow(data);
        if (onChange) {
            onChange(data);
        }
    };
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
    return <Vertical height={'100%'} {...props}>
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
                        return <Horizontal key={col} width={columns[col].width} p={1} bL={2}
                                           style={{fontWeight: 'bold', minWidth: 55}}>{col}</Horizontal>
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
}

