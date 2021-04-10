import {useObserverListener, useObserverMapper} from "components/useObserver";
import Input from "components/input/Input";

export default function InputCellRenderer({$tableData, rowIndex, colIndex, field, onChange, $columns, ...props}) {
    const $value = useObserverMapper($tableData, tableData => {
        if (tableData && tableData[rowIndex] && tableData[rowIndex][field]) {
            return tableData[rowIndex][field];
        }
        return undefined;
    });

    const $selectedTable = $columns.current[field].$selectedTable;
    useObserverListener($selectedTable, newTable => {
        onChange((oldValue) => {
            const nextValue = {...oldValue};
            nextValue[field] = '';
            return nextValue;
        });
    });
    return <Input $value={$value} onChange={value => {
        onChange((oldValue) => {
            const nextValue = {...oldValue};
            nextValue[field] = value;
            return nextValue;
        });
    }}/>
}