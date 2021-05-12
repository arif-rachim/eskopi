import useObserver, {ObserverValue, useObserverMapper} from "components/useObserver";
import {Horizontal, Vertical} from "components/layout/Layout";
import List from "components/list/List";
import {isNullOrUndefined} from "components/utils";
import {mapToNameFactory} from "components/input/Input";

export default function InputTable({dataKey, name, $columns, $errors, domRef, $value, onChange, ...props}) {
    const $nameValue = useObserverMapper($value, mapToNameFactory(name));
    // eslint-disable-next-line
    const $errorValue = useObserverMapper($errors, mapToNameFactory(name));
    const [$selectedRow, setSelectedRow] = useObserver();
    return <Vertical height={'100%'} {...props}>
        <Horizontal bB={2} color={'light'} brightness={-1} style={{minHeight: 25}}>
            <ObserverValue $observers={$columns}>
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
              dataKey={dataKey}
              $data={$nameValue}
              $value={$selectedRow}
              $tableData={$nameValue}
              $errors={$errorValue}
              domRef={domRef}
              $columns={$columns}
              onChange={setSelectedRow}
              onDataChange={onChange}
        />
    </Vertical>
}


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
function RowItemRenderer({
                             data,
                             index,
                             dataKey,
                             dataToLabel,
                             $value,
                             onChange,
                             onDataChange,
                             $tableData,
                             $columns,
                             ...props
                         }) {
    return <Vertical color={"light"} brightness={0.5}>
        <Horizontal bB={1}>
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
                                $tableData={$tableData}
                                rowIndex={index}
                                colIndex={colIndex}
                                onChange={onDataChange}
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